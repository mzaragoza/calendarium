/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 * Youxi v1.3 - Themer Script
 *
 * This file is part of Youxi, a HTML5 Business Theme build for sale at ThemeForest.
 * For questions, suggestions or support request, please mail me at maimairel@yahoo.com
 *
 * Development Started:
 * March 26, 2013
 *
 */

;(function( $, window, document, undefined ) {

	"use strict";

	function appendStylesheet( styles ) {

		var id = 'youxi-theme-css';
		var oldCSS = document.getElementById(id);
		var css;

		if( !oldCSS ) {
			css = document.createElement('style');
			css.setAttribute('type', 'text/css');
			css.id = id;

			$( 'body' ).append( css );
		} else {
			css = oldCSS;
		}

		if (css.styleSheet) {
			css.styleSheet.cssText = styles;
		} else {
			css.innerHTML = styles;
		}
	}

	var Themer = function( options, callback ) {
		this.options = $.extend( true, {}, options );
		this.getLESS(function() {
			this.build();
			if( $.isFunction( callback ) ) {
				callback.apply( this );
			}
		});

		return this;
	};

	Themer.colors = [ '#EF5C2C', '#FF8C21', '#E8C500', '#D13D3D', '#C94949', '#E0268C', '#D68DBB', '#C149ED', '#51C242', '#A0BA52', '#A7CC39', '#48BDAF', '#169FE6', '#6388ED' ];
	Themer.backgrounds = [
		{ w: 200, h: 200, url: 'assets/img/bg/debut_light.png', url2x: 'assets/img/bg/debut_light_@2X.png' }, 
		{ w: 410, h: 410, url: 'assets/img/bg/fabric_of_squares_gray.png', url2x: 'assets/img/bg/fabric_of_squares_gray_@2X.png' }, 
		{ w: 400, h: 355, url: 'assets/img/bg/frenchstucco.png', url2x: 'assets/img/bg/frenchstucco_@2X.png' }, 
		{ w: 600, h: 600, url: 'assets/img/bg/furley_bg.png', url2x: 'assets/img/bg/furley_bg_@2X.png' }, 
		{ w: 188, h: 178, url: 'assets/img/bg/gplaypattern.png', url2x: 'assets/img/bg/gplaypattern_@2X.png' }, 
		{ w: 397, h: 322, url: 'assets/img/bg/grey.png', url2x: 'assets/img/bg/grey_@2X.png' }, 
		{ w: 190, h: 191, url: 'assets/img/bg/light_wool.png', url2x: 'assets/img/bg/light_wool_@2X.png' }, 
		{ w:  46, h:  23, url: 'assets/img/bg/pw_maze_white.png', url2x: 'assets/img/bg/pw_maze_white_@2X.png' }, 
		{ w: 200, h: 200, url: 'assets/img/bg/retina_dust.png', url2x: 'assets/img/bg/retina_dust_@2X.png' }, 
		{ w: 252, h: 230, url: 'assets/img/bg/square_bg.png', url2x: 'assets/img/bg/square_bg_@2X.png' }, 
		{ w:  16, h:  16, url: 'assets/img/bg/striped_lens.png', url2x: 'assets/img/bg/striped_lens_@2X.png' }, 
		{ w: 400, h: 400, url: 'assets/img/bg/subtle_grunge.png', url2x: 'assets/img/bg/subtle_grunge_@2X.png' }, 
		{ w:  26, h:  26, url: 'assets/img/bg/tiny_grid.png', url2x: 'assets/img/bg/tiny_grid_@2X.png' }
	];

	Themer.markup = 
		'<div class="youxi-themer">' +
			'<div class="toggle-btn"><i class="icon-cogwheels"></i></div>' + 
			'<div class="form">' + 
				'<div class="form-row">' + 
					'<label class="form-label">Pick a Color</label>' + 
					'<ul class="theme-list form-list">' + 
						'<li><input type="text" class="color-picker"></li>' + 
					'</ul>' + 
				'</div>' + 
				'<div class="form-row">' + 
					'<label class="form-label">Background Image</label>' + 
					'<ul class="bg-list form-list"></ul>' + 
				'</div>' + 
				'<div class="form-row">' + 
					'<label class="form-label">Layout Mode</label>' + 
					'<ul class="inline form-list">' + 
						'<li><label><input type="radio" name="mode[]" data-layout-mode="wide"> Wide</label></li>' + 
						'<li><label><input type="radio" name="mode[]" data-layout-mode="boxed"> Boxed</label></li>' + 
					'</ul>' + 
				'</div>' + 
				'<div class="button-row">' + 
					'<button id="css-btn" type="button" class="btn">Get CSS</button>' + 
				'</div>' + 
			'</div>' + 
			'<div class="css-modal">' + 
				'<div class="ow-overlay ow-closed"></div>' + 
				'<div class="modal ow-closed"><textarea readonly></textarea></div>' + 
			'</div>' + 
		'</div>';


	Themer.prototype = {
		getLESS: function( callback ) {
			var self = this;
			$.get( this.options.lessFile, function( response ) {
				self.lessData = (response).toString();
				if( $.isFunction( callback ) ) {
					callback.apply( self );
				}
			});
		}, 

		modifyVars: function( vars ) {
			var str = '';
			for( name in vars ) {
				str += ((name.slice(0, 1) === '@')? '' : '@') + name +': '+ 
					((vars[name].slice( -1 ) === ';')? vars[name] : vars[name] +';');
			}
			return this.lessData + str;
		}, 

		refresh: function( doNotAppend ) {
			var self = this, 
				vars = { 
					'@themeColor': this.selectedColor, 
					'@bodyBackground': '"' + Themer.backgrounds[ this.selectedBg ].url + '"', 
					'@bodyBackgroundRetina': '"' + Themer.backgrounds[ this.selectedBg ].url2x + '"', 
					'@bodyBackgroundWidth': Themer.backgrounds[ this.selectedBg ].w + 'px', 
					'@bodyBackgroundHeight': Themer.backgrounds[ this.selectedBg ].h + 'px'
				};

			this.lessParser.parse( this.modifyVars( vars ), function( error, root ) {
				if( error ) { console.error( error ); }
				self.activeCSS = root.toCSS()
				self.cssTextarea.val( self.activeCSS );

				if( !doNotAppend ) {
					appendStylesheet( self.activeCSS );
				}
			});
		}, 

		init: function() {

			var self = this;

			// Init Modal Window
			if( $.fn.omniWindow ) {
				this.modalWindow.omniWindow();
			}

			// Layout Mode
			$( '[data-layout-mode]', this.element ).each(function() {
				$( this ).prop( 'checked', ( $( this ).data( 'layout-mode' ) === 'wide' ) === $( 'body' ).hasClass( 'wide' )  );
			}).on( 'change', function() {
				$( 'body' ).toggleClass( 'wide', $( this ).data( 'layout-mode' ) === 'wide' );
				$( window ).trigger( 'resize' );
			});

			// Color List
			this.themeList.on( 'click', 'li[data-color]', function( e ) {
				self.selectedColor = $( this ).data( 'color' );
				self.refresh();
			});

			// BG List
			this.bgList.on( 'click', 'li', function( e ) {
				self.selectedBg = $( this ).data( 'bg-index' );
				self.refresh();
			});

			// Init Color Picker
			this.pickerElement = $( '.color-picker', this.element ).minicolors({
				letterCase: 'uppercase', 
				textfield: false, 
				change: function( hex, opacity ) {
					hex && (self.selectedColor = hex.toString());
					self.refresh();
				}
			});

			// Toggle Button
			$( '.toggle-btn', this.element ).on( 'click', function() {
				self[ self.element.is( '.hidden' )? 'show' : 'hide' ]();
			});

			// CSS Button
			$( '#css-btn', this.element ).on( 'click', function() {
				self.modalWindow.trigger( 'show' );
			});

			// Hide Element
			this.hide( true );

			// Refresh (don't apply CSS)
			this.refresh( true );

		}, 

		build: function() {

			if( $.miniColors ) {
				console.error( "Themer requires miniColors" );
			}

			if( typeof less === 'undefined' ) {
				console.error( "Themer requires LESS" );
			} else {
				this.lessParser = new(less.Parser);
			}

			this.element = $( Themer.markup );

			// Defaults
			this.selectedColor = Themer.colors[ 0 ];
			this.selectedBg = 9;

			// Get Color List
			this.themeList = $( '.theme-list', this.element );

			// Get BG List
			this.bgList = $( '.bg-list', this.element );

			// Get Modal Window
			this.modalWindow = $( '.css-modal .modal', this.element );
			// Get Textarea
			this.cssTextarea = $( 'textarea', this.modalWindow );

			// Append Color Schemes
			$.each( Themer.colors, $.proxy(function( i, color ) {
				var theme = $( '<li></li>' ).attr( 'data-color', color ).append( $( '<span></span>' ).css( 'background-color', color ) );
				theme.appendTo( this.themeList );
			}, this ));

			// Append BG
			$.each( Themer.backgrounds, $.proxy(function( i, bg ) {
				var span = $( '<span></span>' ).css({
						'background-image': 'url(' + (window.devicePixelRatio > 1? bg.url2x : bg.url) + ')', 
						'background-size': [bg.w + 'px', bg.h + 'px'].join( ' ' )
					}), 
					list = $( '<li></li>' ).attr( 'data-bg-index', i ).append( span );
				list.appendTo( this.bgList );
			}, this ));
		}, 

		show: function() {

			this.element.animate({
				'left': 0
			}, function() {
				$( this ).removeClass( 'hidden' );
			});
		}, 

		hide: function( init ) {

			if( init ) {
				this.element
					.css( 'left', (-this.element.outerWidth()) + 'px' )
					.addClass( 'hidden' );
			} else {
				this.element.animate({
					'left': (-this.element.outerWidth()) + 'px'
				}, function() {
					$( this ).addClass( 'hidden' );
				});
			}
		}
	};

	$( document ).ready( function() {
		var themer = new Themer({ lessFile: 'themer/less/theme.less' }, function() {
			$( 'body' ).prepend( this.element );
			this.init();
		});
	})

	// jQuery OmniWindow plugin
	// @version:  0.7.0
	// @author:   Rudenka Alexander (mur.mailbox@gmail.com)
	// @license:  MIT
	$.fn.extend({
	    omniWindow: function(options) {

	      options = $.extend(true, {
	        animationsPriority: {
	          show: ['overlay', 'modal'],
	          hide: ['modal', 'overlay']
	        },
	        overlay: {
	          selector: '.ow-overlay',
	          hideClass: 'ow-closed',
	          animations: {
	            show: function(subjects, internalCallback) { return internalCallback(subjects); },
	            hide: function(subjects, internalCallback) { return internalCallback(subjects); },
	            internal: {
	              show: function(subjects){ subjects.overlay.removeClass(options.overlay.hideClass); },
	              hide: function(subjects){ subjects.overlay.addClass(options.overlay.hideClass); }
	            }
	          }
	        },
	        modal:   {
	          hideClass: 'ow-closed',
	          animations: {
	            show: function(subjects, internalCallback) { return internalCallback(subjects); },
	            hide: function(subjects, internalCallback) { return internalCallback(subjects); },
	            internal: {
	              show: function(subjects){ subjects.modal.removeClass(options.modal.hideClass); },
	              hide: function(subjects){ subjects.modal.addClass(options.modal.hideClass); }
	            }
	          },
	          internal: {
	            stateAttribute: 'ow-active'
	          }
	        },
	        eventsNames: {
	          show: 'show.ow',
	          hide: 'hide.ow',
	          internal: {
	            overlayClick:  'click.ow',
	            keyboardKeyUp: 'keyup.ow'
	          }
	        },
	        callbacks: {                                                                                  // Callbacks execution chain
	          beforeShow:  function(subjects, internalCallback) { return internalCallback(subjects); },   // 1 (stop if retruns false)
	          positioning: function(subjects, internalCallback) { return internalCallback(subjects); },   // 2
	          afterShow:   function(subjects, internalCallback) { return internalCallback(subjects); },   // 3
	          beforeHide:  function(subjects, internalCallback) { return internalCallback(subjects); },   // 4 (stop if retruns false)
	          afterHide:   function(subjects, internalCallback) { return internalCallback(subjects); },   // 5
	          internal: {
	            beforeShow: function(subjects) {
	              if (subjects.modal.data(options.modal.internal.stateAttribute)) {
	                return false;
	              } else {
	                subjects.modal.data(options.modal.internal.stateAttribute, true);
	                return true;
	              }
	            },
	            afterShow: function(subjects) {
	              $(document).on(options.eventsNames.internal.keyboardKeyUp, function(e) {
	                if (e.keyCode === 27) {                                              // if the key pressed is the ESC key
	                  subjects.modal.trigger(options.eventsNames.hide);
	                }
	              });

	              subjects.overlay.on(options.eventsNames.internal.overlayClick, function(){
	                subjects.modal.trigger(options.eventsNames.hide);
	              });
	            },
	            positioning: function(subjects) {
	              subjects.modal.css('margin-left', Math.round(subjects.modal.outerWidth() / -2));
	            },
	            beforeHide: function(subjects) {
	              if (subjects.modal.data(options.modal.internal.stateAttribute)) {
	                subjects.modal.data(options.modal.internal.stateAttribute, false);
	                return true;
	              } else {
	                return false;
	              }
	            },
	            afterHide: function(subjects) {
	              subjects.overlay.off(options.eventsNames.internal.overlayClick);
	              $(document).off(options.eventsNames.internal.keyboardKeyUp);

	              subjects.overlay.css('display', ''); // clear inline styles after jQ animations
	              subjects.modal.css('display', '');
	            }
	          }
	        }
	      }, options);

	      var animate = function(process, subjects, callbackName) {
	        var first  = options.animationsPriority[process][0],
	            second = options.animationsPriority[process][1];

	        options[first].animations[process](subjects, function(subjs) {        // call USER's    FIRST animation (depends on priority)
	          options[first].animations.internal[process](subjs);                 // call internal  FIRST animation

	          options[second].animations[process](subjects, function(subjs) {     // call USER's    SECOND animation
	            options[second].animations.internal[process](subjs);              // call internal  SECOND animation

	                                                                              // then we need to call USER's
	                                                                              // afterShow of afterHide callback
	            options.callbacks[callbackName](subjects, options.callbacks.internal[callbackName]);
	          });
	        });
	      };

	      var showModal = function(subjects) {
	        if (!options.callbacks.beforeShow(subjects, options.callbacks.internal.beforeShow)) { return; } // cancel showing if beforeShow callback return false

	        options.callbacks.positioning(subjects, options.callbacks.internal.positioning);

	        animate('show', subjects, 'afterShow');
	      };

	      var hideModal = function(subjects) {
	        if (!options.callbacks.beforeHide(subjects, options.callbacks.internal.beforeHide)) { return; } // cancel hiding if beforeHide callback return false

	        animate('hide', subjects, 'afterHide');
	      };


	      var $overlay = $(options.overlay.selector);

	      return this.each(function() {
	        var $modal  = $(this);
	        var subjects = {modal: $modal, overlay: $overlay};

	        $modal.bind(options.eventsNames.show, function(){ showModal(subjects); })
	              .bind(options.eventsNames.hide, function(){ hideModal(subjects); });
	      });
	    }
	});

})( jQuery, window, document );