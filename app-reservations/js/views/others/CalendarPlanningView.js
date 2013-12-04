define([
	'app',
	'fullcalendar',
	'moment',


], function(app, fullcalendar, moment){

	'use strict';

		
	
	/******************************************
	* Valid Request Modal View
	*/
	var CalendarPlanningView = Backbone.View.extend({
	
	
		templateHTML        : '<div id="calendarContainer"></div>',


	
		// The DOM events //
		events: {

		}, 
	
	
	
		/** View Initialization
		*/
		initialize: function (params) {
			var self = this;


			// Params //
			this.calendarView = params.calendarView;
			this.currentDate = params.date;

			this.render();
		},
	
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
	
			// Retrieve the template // 
			var template = _.template(this.templateHTML, {
				lang    : app.lang,
			});
	
			$(this.el).html(template);

			this.calendar = $('#calendarContainer');
			
			// Init the calendar //
			this.initCalendar();

	
			return this;
		},



		/** Init the calendar
		*/
		initCalendar: function(){

			this.calendar.fullCalendar({
	    		
	    		/** Full calendar attributes **/
				date        :   this.currentDate.date(),
				month       :	this.currentDate.month(),
				year        :	this.currentDate.year(),
				defaultView   : this.calendarView,
				ignoreTimezone: false,
				height        : 735,
				header: {
					left  : 'agendaDay,agendaWeek,month',
					center: 'title',
					right : 'today,prev,next'
				},
				// time formats
				titleFormat: {
					month: 'MMMM yyyy',
					week : "'Semaine 'W' <small>du' d [MMM] [yyyy] {'au' d MMM yyyy}</small>",
					day  : 'dddd d MMM yyyy'
				},
				columnFormat: {
					month: 'ddd',
					week : 'ddd d/MM',
					day  : 'dd/MM/yyyy'
				},
				firstDay           : 1,
				axisFormat         : 'HH:mm',
				timeFormat         : 'H(:mm){ - H(:mm)}',
				allDayText         : _.capitalize(app.lang.daytime),
				slotMinutes        : 30,
				firstHour          : 8,
				defaultEventMinutes: 120,
				weekends           : true,
				selectable         : true,
				selectHelper       : true,
				
				weekNumbers        : true,
				weekNumberTitle    : 's',
				
				monthNames         : app.lang.monthNames,
				monthNamesShort    : app.lang.monthNamesShort,
				dayNames           : app.lang.dayNames,
				dayNamesShort      : app.lang.dayNamesShort,
				buttonText         : {
					today : _.capitalize(app.lang.today),
					month : _.capitalize(app.lang.month),
					week  : _.capitalize(app.lang.week),
					day   : _.capitalize(app.lang.day),
					prev  : '<i class="fa fa-chevron-left fa-fw"></i>',
					next  : '<i class="fa fa-chevron-right fa-fw"></i>',
				},


	    		/**
	    		 * Calculates events to display on calendar for officer (or team) on week selected
	    		 */    		
				events: function(start, end, callback) { 
	    		
				},			
	
				/**
				 * Open leave time modal (Absent task)
				 */
				select: function( startDate, endDate, allDay, jsEvent, view) {
					 
					console.log(startDate + ' - ' + endDate);
	    				//allDay  	: allDay,
	
				},
	

				/** Task is click on the calendar : display unplan task modal
	    	    */
	    	    eventClick: function(fcEvent, jsEvent, view) {

	    		}
			});

		}
	


	});

return CalendarPlanningView;

})