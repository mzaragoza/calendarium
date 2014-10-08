/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 * Youxi v1.3 - FlipClock Script
 *
 * This file is part of Youxi, a HTML5 Business Theme build for sale at ThemeForest.
 * For questions, suggestions or support request, please mail me at maimairel@yahoo.com
 *
 * Development Started:
 * March 26, 2013
 *
 *
 *  ORIGINAL Copyright For FlipClock's Base Code
 *  Copyright (c) 2012 Adem ilter, http://codepen.io/yirmiuc
 *
	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

;(function( $, window, document, undefined ) {

	"use strict";

	function pad(str, len, c) {
		str = str.toString();
		if (len + 1 >= str.length) {
			str = (new Array(len + 1 - str.length).join(c)) + str;
		}

		return str;
	}

	function calculatePeriods( until, parts ) {
		var now = new Date();
		now.setMilliseconds(0);
		
		if (now.getTime() > until.getTime()) {
			now = until;
		}
		
		// Calculate differences by period
		var periods = {};
		var diff = Math.floor((until.getTime() - now.getTime()) / 1000);
		var extractPeriod = function(period, numSecs) {
			if(parts[period]) {
				periods[period] = Math.floor(diff / numSecs);
				diff -= periods[period] * numSecs;
			}
		};
		extractPeriod(FlipClock.periods.D, 86400);
		extractPeriod(FlipClock.periods.H, 3600);
		extractPeriod(FlipClock.periods.M, 60);
		extractPeriod(FlipClock.periods.S, 1);
		
		if (diff > 0) {
			var multiplier = [7, 24, 60, 60];
			var lastShown = FlipClock.periods.S;
			var max = 1;
			for (var period = FlipClock.periods.S; period >= FlipClock.periods.D; period--) {
				if(parts[period]) {
					if (periods[lastShown] >= max) {
						periods[lastShown] = 0;
						diff = 1;
					}
					if (diff > 0) {
						periods[period]++;
						diff = 0;
						lastShown = period;
						max = 1;
					}
					max *= multiplier[period];
				}
			}
		}
		
		return periods;
	}

	var Digit = function( min, max ) {
		if( arguments ) {
			this.init( min, max );
		}
	};

	Digit.prototype = {
		markup: 
			'<div class="digit-wrap">' + 
				'<div class="digit-inner">' + 
					'<div class="up">' + 
						'<div class="shadow"></div>' + 
						'<div class="inn"></div>' + 
					'</div>' + 
					'<div class="down">' + 
						'<div class="shadow"></div>' + 
						'<div class="inn"></div>' + 
					'</div>' + 
				'</div>' + 
			'</div>', 
		
		init: function( min, max ) {
			this.element = this.build( min, max );
			this.digits = this.element.children();
			this.activeDigit = $();
		}, 

		build: function( min, max ) {
			var wrap = $( '<div class="digit"></div>' ), d, i;
			for( i = min; i <= max; i++ ) {
				d = $( this.markup ).attr( 'data-value', i );
				d.find( '.inn' ).text( i );
				wrap.append( d );
			}

			return wrap;
		}, 

		setValue: function( val ) {
			this.activeDigit = this.digits.removeClass( 'active' ).filter( '[data-value="' + val + '"]' ).addClass( 'active' );
		}, 

		adjust: function( increment ) {
			this.element.removeClass( 'animating' );

			if( !this.activeDigit.length ) {
				this.activeDigit = this.reset( increment );

			} else if( this.activeDigit.is( increment? ':last-child' : ':first-child' ) ) {
				this.digits.removeClass( 'before' );
				this.activeDigit.addClass( 'before' ).removeClass( 'active' );

				this.activeDigit = this.reset( increment );
				return true;

			} else {
				this.digits.removeClass( 'before' );
				this.activeDigit.addClass( 'before' ).removeClass( 'active' );

				this.activeDigit = ( increment? this.activeDigit.next() : this.activeDigit.prev() );
				this.activeDigit.addClass( 'active' ).closest( '.digit' ).addClass( 'animating' );

			}

			return false;
		}, 

		reset: function( increment ) {
			this.digits.removeClass( 'active' );
			this.activeDigit = increment? this.digits.first() : this.digits.last();
			return this.activeDigit.addClass( 'active' ).closest( '.digit' ).addClass( 'animating' ).end();
		}
	};

	var DigitGroup = function( digits, label ) {
		if( arguments ) {
			this.init( digits, label );
		}
	};

	DigitGroup.prototype = {

		init: function( digits, label ) {
			this.digits = digits;
			this.element = this.build( digits );
			this.element.append( $( '<div class="digit-label"></div>' ).text( label ) );
		}, 

		build: function( digits ) {
			var wrap = $( '<div class="digit-group"></div>' );
			for( var i = 0; i < digits.length; i++ ) {
				wrap.append( digits[ i ].element );
			}

			return wrap;
		}, 

		reset: function() {
			for( var i = 0; i < this.digits.length; i++ ) {
				this.digits[ i ].reset();
			}
		}, 

		setValue: function( val ) {
			var self = this;
			val = pad( parseInt( val, 10 ), this.digits.length, '0' ).split( '' );
			for( var i = 0; i < this.digits.length; i++ ) {
				this.digits[ i ].setValue( val[ i ] );
			}
		}, 

		adjust: function( increment ) {
			var propagate = false, i;
			for( i = this.digits.length - 1; i >= 0; i-- ) {
				if( this.digits[ i ].adjust( increment ) ) {
					propagate = (i === 0);
					continue;
				}
				break;
			}

			return propagate;			
		}
	};

	var FlipClock = function( element, options ) {

		if( arguments ) {
			this.init( element, options );
		}
    };

    FlipClock.periods = { 'D': 0, 'H': 1, 'M': 2, 'S': 3 };
	
	// the plugin prototype
	FlipClock.prototype = {
		defaults: {
			until: new Date(2012, 11, 12), // apocalypse
			labels: [ "days", "hours", "minutes", "seconds" ]
		}, 
		
		init: function( element, options ) {
			this.options = $.extend( true, {}, this.defaults, options );
			this.element = $( element );

			this.groups = [];
			this.parts = this._getParts( 'D' );

			this._buildClock();
			this._start();
			
			return this;
		},
		
		_getParts: function( maxUnit ) {
			var parts = {}, p = [ 'D', 'H', 'M', 'S' ];
			for( var i = FlipClock.periods.D; i <= FlipClock.periods.S; i++ ) {
				parts[ i ] = i >= FlipClock.periods[ maxUnit ]? p[ i ] : 0;
			}

			return parts;
		}, 

		_start: function() {

			var drawStart = ( (window.performance && window.performance.now)? 
					function() { return window.performance.now() + window.performance.timing.navigationStart; } : 
					function() { return new Date().getTime(); } ), 
				self = this, tickInterval = 1000, lastTick = drawStart(), currTime, timeToCall, i, 
				tick = function() {
					currTime = drawStart();
					timeToCall = Math.max( 0, tickInterval - ( currTime - lastTick ));

					for( i = self.groups.length - 1; i >= 0; i-- ) {
						if( self.groups[ i ].adjust( false ) ) {
							continue;
						}
						break;
					}
					lastTick = currTime + timeToCall;
					
					setTimeout(function() {
						tick();
					}, timeToCall );
				};

			tick();
		}, 
		
		_buildClock: function() {
			var periods = calculatePeriods( this.options.until, this.parts ), 
				period, group, part, len, i, 
				builder09 = function() { return new Digit( 0, 9 ); };

			for( i in periods ) {
				part = this.parts[ i ];

				if( part ) {

					period = periods[ i ];
					len = Math.max( 2, parseInt( periods[ i ], 10 ).toString().split( '' ).length );

					switch( part ) {
						case 'D':
							group = new DigitGroup( $.map( new Array( len ), builder09 ), this.options.labels[ i ] );
							break;
						case 'H':
							if( period > 23 ) {
								group = new DigitGroup( $.map( new Array( len ), builder09 ), this.options.labels[ i ] );
							} else {
								group = new DigitGroup( [ new Digit( 0, 2 ), new Digit( 0, 3 ) ], this.options.labels[ i ] );
							}
							break;
						case 'M':
						case 'S':
							if( period > 59 ) {
								group = new DigitGroup( $.map( new Array( len ), builder09 ), this.options.labels[ i ] );
							} else {
								group = new DigitGroup( [ new Digit( 0, 5 ), new Digit( 0, 9 ) ], this.options.labels[ i ] );
							}
							break;
						default:
							break;
					}

					group.setValue( period );
					group.element.appendTo( this.element );

					this.groups.push( group );
				}
			}
		}
	};
	
	FlipClock.defaults = FlipClock.prototype.defaults;
	
	$.fn.flipClock = function( options ) {

		return this.each(function() {
			if ( !$.data( this, 'flipclock' ) ) {
				$.data( this, 'flipclock', new FlipClock( this, options ) );
			}
		});
	};

})( jQuery, window , document );