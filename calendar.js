/**
 * jquery date picker
 * @author Victor Li
 * @version 1.0
 * @lincense MIT
 */

(function($) {

	var defaults = {
		container: 'body',
		language: 'cn',
		mode: 'single'
	};

	var _html = '<div id="calendar" class="cal-style">'
            		+ '<div class="cal-header">'
                		+ '<div class="cal-info">'
                    		+ '<span class="prev"><span class="prev-icon"></span></span>'
                    		+ '<span class="cal-year-month"></span>'
                    		+ '<span class="next"><span class="next-icon"></span></span>'
                		+ '</div>'
                		+ '<div class="cal-weeks"></div>'
            		+ '</div>'
            		+ '<div class="cal-body"></div>'
            		+ '<div class="cal-footer"></div>'
        		+ '</div>';

    var weeks = {
    	enShort: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    	cnShort: ['一', '二', '三', '四', '五', '六', '七'],
    	enLong: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    	cnLong: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    };

    // Sets the default current date is now
    var current = new Date('2015-03-01'),
    	currYear = current.getFullYear(),
    	currMonth = current.getMonth() + 1,
    	currDate = current.getDate();

    /**
     * Render the calendar
     */
    var init = function(options) {
    	var container = options.container,
    		language = options.language;
        $(container).html($(_html));

        // render weeks
        var weeksPanel = $('#calendar').find('.cal-weeks'),
        	weeksData = weeks[language + 'Short'];
        weeksData.forEach(function(d) {
        	var perDay = $('<span class="cal-day"></span>');
        	weeksPanel.append(perDay.text(d));
        });

        // render some cells to show date
        var datesPanel = $('#calendar').find('.cal-body');
        for (var i = 1; i <= 5; i++) {
        	var perWeek = $('<div class="cal-per-week"></div>');
        	for (var j = (i - 1) * 7 + 1; j <= i * 7; j++) {
        		var perDate = $('<span class="cal-per-date"></span>');
        		perWeek.append(perDate);
        	}
        	datesPanel.append(perWeek);
        }
    };

    /**
     * Sets current year and month for calendar
     */
    var renderYearMonth = function() {
        var yearAndMonth = format.call(current);
        $('.cal-year-month').text(yearAndMonth);
    };

    /**
     * Fills cells with dates
     */
    var renderCells = function() {
        $('.cal-per-date').text('').removeClass('has-date');
    	var firstDayInMonth = getFirstDayInMonth(current),
    		datesInMonth = getDatesInMonth(current);
    	var cells = $('.cal-per-date:eq(' + (firstDayInMonth - 1) + '), .cal-per-date:gt(' + (firstDayInMonth - 1) + ')');
    		for (var i = 1; i <= datesInMonth; i++) {
    			var dataDate = format.call(current);
    			$(cells[i - 1]).text(i).addClass('has-date').attr('data-date', dataDate);
    		}
    };

    var getFirstDayInMonth = function(date) {
    	var temp = new Date(date);
    	temp.setDate(0);
    	return temp.getDay() + 1;
    };

    var getDatesInMonth = function(date) {
    	var currMonth = date.getMonth() + 1,
    		dateOfNextMonth = new Date(date);
    		dateOfNextMonth.setMonth(currMonth);
    	return parseInt((dateOfNextMonth.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
    };

    /**
     * Go to the next month
     */
    var nextMonth = function() {
        if (currMonth < 12) {
            currMonth++;
        } else {
            currMonth = 1;
            currYear++;
        }
        current.setFullYear(currYear);
        current.setMonth(currMonth);
    };

    /**
     * Go to the previous month
     */
    var prevMonth = function() {
        if (currMonth > 1) {
            currMonth--;
        } else {
            currMonth = 12;
            currYear--;
        }
        current.setFullYear(currYear);
        current.setMonth(currMonth);
    };

    var format = function(format) {
    	if (!this instanceof Date) {
    		return;
    	}

        var o = {
            y: this.getFullYear(),
            m: this.getMonth() + 1,
            d: this.getDate(),
            hh: this.getHours(),
            mm: this.getMinutes(),
            ss: this.getSeconds()
        };

    	var formatted;

    	switch (format) {
    		case 'yyyy/mm/dd':
                formatted = o.y + '/' + o.m + '/' + o.d;
                break;
            case 'yyyy-mm-dd':
                formatted = o.y + '-' + o.m + '-' + o.d;
                break;
            case 'yyyy/mm/dd hh:mm:ss':
                formatted = o.y + '/' + o.m + '/' + o.d + ' ' + o.hh + ':' + o.mm + ':' + o.ss;
                break;
            case 'yyyy-mm-dd hh:mm:ss':
                formatted = o.y + '/' + o.m + '/' + o.d + ' ' + o.hh + ':' + o.mm + ':' + o.ss;
                break;
            case 'hh:mm:ss':
                 formatted = o.hh + ':' + o.mm + ':' + o.ss;
                 break;
             default:
                 formatted = o.y + '/' + o.m + '/' + o.d;
                 break;
    	}
        return formatted;

    };

    var addListener = function(target, event, fn) {
        $('body').on(event, target, function() {
            if (typeof fn === 'function') {
                fn();
            }
        });
    };

    var events = [
        {
            t: '.next',
            e: 'click',
            f: function() {
                nextMonth();
                renderYearMonth();
                renderCells();
            }
        },
        {
            t: '.prev',
            e: 'click',
            f: function() {
                prevMonth();
                renderYearMonth();
                renderCells();
            }
        }
    ];

    for (var i = 0; i < events.length; i++) {
        addListener(events[i].t, events[i].e, events[i].f);
    }

    $.fn.calendar = function(options) {
        var settings = $.extend(defaults, options);
        init(settings);
        renderYearMonth();
        renderCells();
    };

 })(jQuery);
