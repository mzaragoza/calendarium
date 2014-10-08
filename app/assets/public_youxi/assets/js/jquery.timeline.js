/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *
 * Youxi v1.3 - Timeline Plugin Script
 *
 * This file is part of Youxi, a HTML5 Business Theme build for sale at ThemeForest.
 * For questions, suggestions or support request, please mail me at maimairel@yahoo.com
 *
 * Development Started:
 * March 26, 2013
 *
 * Heavily Enhanced and Modified from Timeline Plugin for jQuery by Jakob Ploens <post@jakobploens.de>
 *
 **/

;(function( $, window, document, undefined ) {

    "use strict";

    var Timeline = function( element, options ) {
        if( arguments ) {
            this.init( element, options );
        }
    };

    Timeline.monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    Timeline.monthNamesShort = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    Timeline.dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
    Timeline.dayNamesShort = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];

    Timeline.FN = {
        _toDateObject: function( i )  {
            if( !i || i === '' ) {
                return false;
            }

            var p, y, m, d;

            p = i.toString().split("-");
            y = p[0]? p[0] : "1970";
            m = p[1]? parseInt( p[1], 10 ) - 1 : 0;
            d = p[2]? parseInt( p[2], 10 ) : 1;

            return new Date( y, m, d );
        }, 

        _round: function( n, i ) {
            var r;

            if( isNaN( n ) ) {
                r = parseInt( n + 0.5 );
            } else {
                if( !i ){
                    r = Math.round( n );

                } else {
                    i = Math.pow( 10, i );
                    r = Math.round( n * i ) / i;
                }
            }

            return r;
        }, 

        /* Format a date object into a string value
         * Simplified from jQuery-UI 1.10.2 datepicker
         * The format can be combinations of the following:
         * d  - day of month (no leading zero)
         * dd - day of month (two digit)
         * D  - day name short
         * DD - day name long
         * m  - month of year (no leading zero)
         * mm - month of year (two digit)
         * M  - month name short
         * MM - month name long
         * y  - year (two digit)
         * yy - year (four digit)
         *
         * @param  format string - the desired format of the date
         * @param  date Date - the date value to format
         * @param  settings Object - attributes include:
         *                  dayNamesShort   string[7] - abbreviated names of the days from Sunday (optional)
         *                  dayNames        string[7] - names of the days from Sunday (optional)
         *                  monthNamesShort string[12] - abbreviated names of the months (optional)
         *                  monthNames      string[12] - names of the months (optional)
         * @return  string - the date in the above format
         */
        _formatDate: function( format, date, settings ) {

            // initial date parsing
            var parts = date.split( '-' ), 
                hasDay = !!parts[2], 
                hasMonth = !!parts[1], 
                hasYear = !!parts[0];

            date = Timeline.FN._toDateObject( date );

            var iFormat, c, 
                dayNamesShort = (settings && settings.dayNamesShort) || Timeline.dayNamesShort, 
                dayNames = (settings && settings.dayNames) || Timeline.dayNames, 
                monthNamesShort = (settings && settings.monthNamesShort) || Timeline.monthNamesShort, 
                monthNames = (settings && settings.monthNames) || Timeline.monthNames, 
                // Check whether a format character is doubled
                lookAhead = function(match, increment) {
                    var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                    if (matches && increment) {
                        iFormat++;
                    }
                    return matches;
                },
                // Format a number, with leading zero if necessary
                formatNumber = function(match, value, len) {
                    var num = "" + value;
                    if (lookAhead(match, true)) {
                        while (num.length < len) {
                            num = "0" + num;
                        }
                    }
                    return num;
                },
                // Format a name, short or long as requested
                formatName = function(match, value, shortNames, longNames) {
                    return (lookAhead(match, true) ? longNames[value] : shortNames[value]);
                },
                output = [], buffer, 
                nextValid, charMatch;

            if (date) {
                for (iFormat = 0; iFormat < format.length; iFormat++) {
                    switch (format.charAt(iFormat)) {
                        case "d":
                            if( hasDay ) { output.push( formatNumber("d", date.getDate(), 2) ); }
                            break;
                        case "D":
                            if( hasDay ) { output.push( formatName("D", date.getDay(), dayNamesShort, dayNames) ); }
                            break;
                        case "m":
                            if( hasMonth ) { output.push( formatNumber("m", date.getMonth() + 1, 2) ); }
                            break;
                        case "M":
                            if( hasMonth ) { output.push( formatName("M", date.getMonth(), monthNamesShort, monthNames) ); }
                            break;
                        case "y":
                            if( hasYear ) { 
                                output.push( (lookAhead("y", true) ? date.getFullYear() : (date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100) );
                            }
                            break;
                        default:
                            buffer = '';
                            nextValid = false;
                            charMatch = false;
                            while( iFormat < format.length && !charMatch ) {
                                if( lookAhead('d') || lookAhead('D') ) {
                                    charMatch = true;
                                    if( hasDay ) {
                                        nextValid = true;
                                    }
                                }
                                if( lookAhead('m') || lookAhead('M') ) {
                                    charMatch = true;
                                    if( hasMonth ) {
                                        nextValid = true;
                                    }
                                }
                                if( lookAhead('y') ) {
                                    charMatch = true;
                                    if( hasYear ) {
                                        nextValid = true;
                                    }
                                }

                                buffer += format.charAt( iFormat );

                                if( !nextValid ) {
                                    iFormat++;
                                }
                            }

                            if( nextValid ) {
                                output.length && output.push( buffer );
                            }
                            break;
                    }
                }
            }

            return output.join('');
        }
    }

    Timeline.prototype = {
        defaults: {
            spacingUnit: 'px', 
            spacing: 4, 
            dateFormat: 'MM dd, yy', 
            itemSelector: ' > ul > li'
        }, 

        init: function( element, options ) {
            this.element = $( element );
            this.options = $.extend( true, {}, this.defaults, options );

            this.items = $( this.options.itemSelector, this.element );
            this.build();
        }, 

        build: function() {

            if( !this.items.length ) {
                return;
            }

            var self = this, 
                start = this.items.first().data( 'date' ), 
                end = this.items.last().data( 'date' ), 
                stretch;

            if( start && end ) {
                stretch = (Timeline.FN._toDateObject( end ).getTime() - Timeline.FN._toDateObject( start ).getTime()) || false;
            }

            this.element.addClass( 'timeline' ).prepend( '<div class="line"></div>' );

            $.each( this.items, function( index, item ) {

                var date, dateFormat, dateObj, dateLabel, pr, priordate, prior, interval, percentage, margin;

                item = $( item );
                date = item.data( 'date' ).toString();
                dateFormat = item.data( 'dateFormat' ) || self.options.dateFormat;
                dateObj = Timeline.FN._toDateObject( date );
                item.addClass( index % 2? 'odd' : 'even' );

                if( item.data( 'title' ) ) {
                    dateLabel = item.data( 'title' );
                } else if( item.data( 'end' ) ) {
                    dateLabel = Timeline.FN._formatDate( dateFormat, date ) + "-" + Timeline.FN._formatDate( dateFormat, item.data( 'end' ) );
                } else {
                    dateLabel = Timeline.FN._formatDate( dateFormat, date );
                }

                if( index > 0 && stretch ) {

                    pr = item.prev( 'li' );
                    prior = pr.data( 'end' ) || pr.data( 'date' );

                    interval = dateObj.getTime() - Timeline.FN._toDateObject( prior ).getTime();
                    percentage = ( interval / stretch ) * 100;

                    margin = self.options.spacing * percentage;
                    margin = self.options.spacingUnit === 'em'? Timeline.FN._round( margin * 0.1, 2 ) : Timeline.FN._round( margin );

                    // item.css( 'margin-top', margin + self.options.spacingUnit );
                }


                item.prepend( '<span class="bullet"><span></span></span>' );
                item.prepend( '<span class="date">' + dateLabel + '</span>' );
            });
        }
    };

    $.fn.timeline = function( options ) {
        return this.each(function() {
            new Timeline( this, options );
        });
    }

}) ( jQuery, window, document );