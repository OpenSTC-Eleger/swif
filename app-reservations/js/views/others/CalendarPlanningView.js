define([
	'app',
	'appHelpers',

	'fullcalendar',
	'moment',

	'bookingsCollection'


], function(app, AppHelpers, fullcalendar, moment, BookingsCollection){

	'use strict';

		
	
	/******************************************
	* Valid Request Modal View
	*/
	var CalendarPlanningView = Backbone.View.extend({
	
	
		templateHTML        : '<div id="calendarContainer"></div>',


	
		// The DOM events //
		events: {
			'click .fc-button-prev'      : 'goPrevDate',
			'click .fc-button-next'      : 'goNextDate',
			'click .fc-button-today'     : 'goTodayDate',
			'click .fc-button-agendaDay' : 'goDayFormat',
			'click .fc-button-agendaWeek': 'goWeekFormat',
			'click .fc-button-month'     : 'goMonthFormat'
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
			var self = this;

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


	    		/** Calculates events to display on calendar for officer (or team) on week selected
				*/    		
				events: function(start, end, callback) { 
	    			
					// Get the selected resources //
		    		var selectedResources = _.union(app.views.sideBarPlanningSelectResourcesView.selectedPlaces, app.views.sideBarPlanningSelectResourcesView.selectedEquipments);
		    
	    			if(!_.isEmpty(selectedResources)){

		    			self.fetchReservations(start, end, selectedResources)
		    			.done(function(){
							var events = self.collectionsToEvents(self.collection);
							callback(events);
		    			});
	    			}

				},

				eventRender: function(event, element){
					element.find('.fc-event-title').html(event.title);	

					element.popover( {trigger: 'hover', content: 'lolol', title: 'pouopui', placement: 'left', container: 'body'} );
				},


				/** Open leave time modal (Absent task)
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

		},




		/** Fetch the reservations
		*/
		fetchReservations: function(start, end, selectedResources){

			// Create the collection //
			if(_.isUndefined(this.collection)){ this.collection = new BookingsCollection();}


			// Create Fetch params //
			var fetchParams = {
				silent  : true,
				data : {
					fields : ['name', 'checkin', 'checkout', 'note', 'resource_ids', 'is_citizen', 'partner_id', 'people_name']
				}
			};

			// Select the period of time //
			var domain = [
				{ 'field' : 'checkin', 'operator' : '>', 'value' : moment(start).format('YYYY-MM-DD HH:mm:ss') },
				{ 'field' : 'checkout', 'operator' : '<', 'value' : moment(end).format('YYYY-MM-DD HH:mm:ss')  },
				{ 'field' : 'reservation_line.reserve_product.id', 'operator' : 'in', 'value' : selectedResources}
			]

			fetchParams.data.filters    = app.objectifyFilters(domain);

			// Fetch the collections //
			return $.when(this.collection.fetch(fetchParams))
			.fail(function(e){
				console.log(e);
			});
		},



		/** fetchEvents
		*/
		fetchEvents: function(){
			this.calendar.fullCalendar('refetchEvents');	
		},


		
		/** Convert a collection to Array events for FullCalendar
		*/
		collectionsToEvents: function(collection){

			var events = [];

			_.each(collection.models, function(model, index){

				var resouceIds = model.getResourcesId();

				var resourcePlaces     = _.intersection(app.views.sideBarPlanningSelectResourcesView.selectablePlaceIds, resouceIds);
				var resourceEquipments = _.intersection(app.views.sideBarPlanningSelectResourcesView.selectableEquipmentIds, resouceIds);


				// Set the color of the event with the color of the place resource //
				if(!_.isEmpty(resourcePlaces)){
					var color = app.views.sideBarPlanningSelectResourcesView.selectablePlaces.get(_.first(resourcePlaces)).getColor();
				}
				else{
					var color = app.views.sideBarPlanningSelectResourcesView.selectableEquipments.get(_.first(resourceEquipments)).getColor();
				}

				var rgb = AppHelpers.hexaToRgb(color.split('#')[1]);

				if( (((rgb[0]*299) + (rgb[0]*587) + (rgb[0]*114)) / 1000) < 125 ){
					var textColor = '#FFF';
				}
				else{
					var textColor = '#000';
				}

				
				// Get the equipments //
				if(!_.isEmpty(resourceEquipments)){
					
					var equipments = '&nbsp;'

					_.each(resourceEquipments, function(i){
						equipments += "<span class='badge'>"+app.views.sideBarPlanningSelectResourcesView.selectableEquipments.get(i).getName()+"</span>";
					})
				}
				else{
					var equipments = ''
				}

				var evt = {
					id       : model.getId(),
					title    : model.getName() + equipments,
					start    : model.getStartDate(),
					end      : model.getEndDate(),
					color    : color,
					textColor: textColor,
					allDay   : false,
				}

				events.push(evt);
			})

			return events;
		},



		urlBuilder: function(mode){

			var unite; var view;
			// Check the params //
			switch(this.calendarView){
				case 'agendaDay':
					unite = 'days';
					view = 'day';
				break;

				case 'agendaWeek':
					unite = 'weeks';
					view = 'week';
				break;

				case 'month':
					unite = 'months';
					view = 'month';
				break;
			}

			if(mode == 'add'){
				this.currentDate.add(unite, 1);
			}
			else if(mode == 'subtract'){
				this.currentDate.subtract(unite, 1);
			}
			else if(mode == 'today'){
				this.currentDate = moment();
			}

			var route = _.strLeft(app.routes.planningManager.url, '(');

			var params = view +'/'+ this.currentDate.format('DD') +'/'+ (this.currentDate).format('MM') +'/'+ this.currentDate.year();

			app.router.navigate(_.join('/', route, params), {trigger: false, replace: true});

		},



		/** Go to the previous Date
		*/		
		goPrevDate: function(e){
			this.urlBuilder('subtract');
		},

		/** Go to the next Date
		*/
		goNextDate: function(e){
			this.urlBuilder('add');
		},

		/** Go to the today's Date
		*/
		goTodayDate: function(e){
			this.urlBuilder('today');
		},

		/** Go to the Day Format
		*/
		goDayFormat: function(e){
			this.calendarView = 'agendaDay';
			this.urlBuilder();
		},

		/** Go to the Week Format
		*/
		goWeekFormat: function(e){
			this.calendarView = 'agendaWeek';
			this.urlBuilder();
		},

		/** Go to the Month Format
		*/
		goMonthFormat: function(e){
			this.calendarView = 'month';
			this.urlBuilder();
		}


	});

return CalendarPlanningView;

})