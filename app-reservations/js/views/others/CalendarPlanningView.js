define([
	'app',
	'fullcalendar',


], function(app,fullcalendar){

	'use strict';

		
	
	/******************************************
	* Valid Request Modal View
	*/
	var CalendarPlanningView = Backbone.View.extend({
	
	
		templateHTML        : '/templates/others/CalendarPlanning.html',


	
		// The DOM events //
		events: {

		}, 
	
	
	
		/** View Initialization
		*/
		initialize: function (params) {
			var self = this;

			this.options = params;

			this.render();
		},
	
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
	
			// Retrieve the template // 
			$.get(app.menus.openresa+this.templateHTML, function(templateData){
	
				var template = _.template(templateData, {
					lang    : app.lang,
				});
	
				$(self.el).html(template);

				self.initCalendar();
	
			});
	
			return this;
		},



		/** Init the calendar
		*/
		initCalendar: function(){

			$('#calendarContainer').fullCalendar({
	    		
	    		/** Full calendar attributes **/

	    		ignoreTimezone: false,
				aspectRatio: 1.30,
				header: {
					left: 'infosUser',
					center: 'title',
					right: 'today,prev,next'
				},
				// time formats
				titleFormat: {
					month: 'MMMM yyyy',
					week:"'Semaine 'W' du' dd [MMM] [yyyy] {'au' dd MMM yyyy}",
					day: 'dddd dd MMM yyyy'
				},
				columnFormat: {
				    month: 'ddd',
				    week: 'ddd dd/M',
				    day: 'dddd dd/M'
				},
				firstDay: 1,
				axisFormat: 'HH:mm',
				timeFormat: 'H(:mm){ - H(:mm)}',
	
				monthNames: app.lang.monthNames,
				monthNamesShort: app.lang.monthNamesShort,
				dayNames: app.lang.dayNames,
				dayNamesShort: app.lang.dayNamesShort,
				buttonText: {
				    today: app.lang.today,
				    month: app.lang.month,
				    week: app.lang.week,
				    day: app.lang.day
				},
				allDayText: app.lang.daytime,
				slotMinutes	: 30,
				firstHour	: 8,
				minTime		: app.config.startWorkTime,
				maxTime		: app.config.endWorkTime,
				defaultEventMinutes	: 30,
				dragOpacity	: 0.5,
				weekends	: true,
				selectable	: true,
				selectHelper: true,
				editable	: true,


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