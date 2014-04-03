/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'tasksCollection',

	'taskModel',
	'taskSchedulesModel',

	'printingCalendarView',
	'modalAbsentTaskView',
	'modalUnplanTaskView',

	'fullcalendar',
	'moment',
	'tabsContainerView'

], function(app, AppHelpers,
				TasksCollection,
				TaskModel, TaskSchedulesModel,
				PrintingCalendarView, ModalAbsentTaskView, ModalUnplanTaskView, fullcalendar, moment,
				TabsContainerView){

	'use strict';


	/******************************************
	* Events List View
	*/
	var calendarView = Backbone.View.extend({

		//template name
		templateHTML: '/templates/others/calendar.html',

		//Dom element for calendar
		divCalendar  : null,

		calendarView : 'agendaWeek',
		teamMode     : false,
		initialized  : false,

		events: {
			'click .fc-button-prev'                    : 'previousDate',
			'click .fc-button-next'                    : 'nextDate',
		},

		urlParameters : ['officer', 'team', 'provider', 'year', 'week'],


		/**
		* Initialize calendar view
		*/
		initialize: function(params){
			this.options = params;

			var self = this;

			this.collections = this.options.collections;
			
			if(_.isUndefined(this.options.year)) {
				this.options.year = moment().year();
				this.options.week = moment().week();
			}
		},


		/** Display the view
		*/
		render: function() {
			var self = this;
			
			this.model = app.views.tabsContainerView.getSelectedModel();
			
			//DOM element id for calendar with model
			this.divCalendar = 'div#calendar_' +  this.model.id;

			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang    : app.lang,
					calendar: self.model,
					officers: self.collections.officers,
					teams   : self.collections.teams
				});

				self.$el.html(template);
				// Init calendar
				var momentDate = moment().year(self.options.year).week(self.options.week);
				self.initCalendar(momentDate);
				
			});

			return this;
		},



		/**"#pOfficer_"+self.options.officer+" Go to next week
		*/
		nextDate: function() {
			this.options.week = String(parseInt(this.options.week)+1);
			app.router.navigate(this.urlBuilder(), {trigger: false, replace: false});
			//Add new url in pagination for intervention panel
			app.views.planningInterListView.paginationRender(this.options);
		},


		/** Go to previous week
		*/
		previousDate: function() {
			this.options.week = String(parseInt(this.options.week)-1);
			app.router.navigate(this.urlBuilder(), {trigger: false, replace: false});
			//Add new url in pagination for intervention panel
			app.views.planningInterListView.paginationRender(this.options);
		},


		/** Init fullcallendar
		*/
		initCalendar: function(date) {
			var self = this;

			this.calendar = $(this.divCalendar).fullCalendar({

				/** Full calendar attributes **/
				month         :	date.month(),
				year          :	date.year(),
				date          : date.date(),
				defaultView   : self.calendarView,
				ignoreTimezone: false,
				aspectRatio   : 1.30,
				header: {
					left  : 'infosUser',
					center: 'title',
					right : 'today,prev,next'
				},
				// time formats
				titleFormat: {
					month: 'MMMM yyyy',
					week :  '\'Semaine \'W\' <small>du\' dd [MMM] [yyyy] {\'au\' dd MMM yyyy}</small>',
					day  : 'dddd dd MMM yyyy'
				},
				columnFormat: {
					month: 'ddd',
					week : 'ddd dd/M',
					day  : 'dddd dd/M'
				},
				firstDay  : 1,
				axisFormat: 'HH:mm',
				timeFormat: 'H(:mm){ - H(:mm)}',

				monthNames     : app.lang.monthNames,
				monthNamesShort: app.lang.monthNamesShort,
				dayNames       : app.lang.dayNames,
				dayNamesShort  : app.lang.dayNamesShort,
				buttonText: {
					today: app.lang.today,
					month: app.lang.month,
					week : app.lang.week,
					day  : app.lang.day
				},
				allDayText         : app.lang.daytime,
				slotMinutes        : 30,
				firstHour          : 8,
				minTime            : app.config.startWorkTime,
				maxTime            : app.config.endWorkTime,
				defaultEventMinutes: 30,
				dragOpacity        : 0.5,
				weekends           : true,
				droppable          : true,
				selectable         : true,
				selectHelper       : true,
				editable           : true,
				dragRevertDuration :0,
				startOfLunchTime   : app.config.startLunchTime,
				endOfLunchTime     : app.config.endLunchTime,



				/** Calculates events to display on calendar for officer (or team) on week selected
				*/
				events: function(start, end, callback) {
					var fetchParams={
						silent : true,
						data   : {}
					};
					


					fetchParams.data.filters = AppHelpers.getPlanningDomain(self.options, self.model, start, end);
					self.collection = new TasksCollection();
					
					//Get tasks 
					$.ajax({
						url: self.collection.url,
						dataType: 'text',
						data: fetchParams.data,
						success: function(events) {
							self.collection.set(JSON.parse(events));
							self.listenTo(self.collection, 'add', self.refreshEvents);
							self.listenTo(self.collection, 'remove', self.refreshEvents);
							//Adapt data to display in calendar
							self.events = self.fetchEvents();
							self.initPrintView();
							callback(self.events);
						}
					});
				},



				/** Open leave time modal (Absent task)
				*/
				select: function(startDate, endDate, allDay) {
				
					app.views.modalAbsentTaskView = new ModalAbsentTaskView({
						el        : '#modalAbsentTask',
						model     : self.model,
						collection: self.collection,
						startDate : startDate ,
						endDate   : endDate ,
						teamMode  : self.teamMode,
						allDay    : allDay,
					});

				},

				/** When a event is Drop on the calendar : plan in backend
				*/
				drop: function( date, allDay ) {

					var originalEventObject = $(this).data('eventObject');
					var copiedEventObject = $.extend({}, originalEventObject);
					copiedEventObject.allDay = allDay;
					copiedEventObject.start = date; //$.fullCalendar.formatDate(date, 'yyyy-MM-dd HH:mm:ss');

					var params = {
						task_id           : copiedEventObject.id,
						start_working_time: app.config.startWorkTime,
						end_working_time  : app.config.endWorkTime,
						start_lunch_time  : app.config.startLunchTime,
						end_lunch_time    : app.config.endLunchTime,
						start_dt          : copiedEventObject.start ,
						team_mode         : self.teamMode,
						calendar_id       : self.model.id,
					};


					var model = new TaskSchedulesModel();

					model.save(params, {patch: false, silent: true})
						.done(function() {
							self.collections.interventions.get(copiedEventObject.project_id).fetch();
							self.refreshEvents();
						})
						.fail(function (e) {
							console.log(e);
						});
				},



				/** Drop event from time slot to another
				*/
				eventDrop: function (event) {
					var model = self.collection.get(event.id);

					var params = {
						date_start: event.start,
						date_end  : event.end,
					};

					model.save(params, {patch: true, silent: true})
						.done(function() {
							//If task has intervention (absent task has no intervention)
							var inter;
							if( model.toJSON().project_id !== false ){
								inter = self.collections.interventions.get(model.toJSON().project_id[0]);
							}
							//If inter is not in left panel : not fetch
							if( !_.isUndefined( inter ) ){
								inter.fetch();
							}
						})
						.fail(function (e) {
							console.log(e);
						});
				},


				/** Resize event
				*/
				eventResize: function( event, dayDelta, minuteDelta) {

					var model = self.collection.get(event.id);

					var newEvent = self.events.filter(function (element) {
						return element.id == event.id;
					})[0];

					var params = {
						date_start     : event.start,
						date_end       : event.end,
						planned_hours  : (event.planned_hours + (minuteDelta)/60),
						total_hours    : (event.total_hours + (minuteDelta)/60),
						remaining_hours: (event.remaining_hours + (minuteDelta)/60),
					};


					newEvent.date_start      = event.start;
					newEvent.date_end        = event.end;
					newEvent.planned_hours   = (event.planned_hours + (minuteDelta)/60);
					newEvent.total_hours     = (event.total_hours + (minuteDelta)/60);
					newEvent.remaining_hours =  (event.remaining_hours + (minuteDelta)/60);

					model.save(params, {patch: true, silent: true})
						.done(function() {
							//If task has intervention (absent task has no intervention)
							if( model.toJSON().project_id !== false ) {
								var inter = self.collections.interventions.get(model.toJSON().project_id[0]);
								//If inter is not in left panel : not fetch
								if( !_.isUndefined( inter ) ){
									inter.fetch();
								}
							}
						})
						.fail(function (e) {
							console.log(e);
						});
				},


				/** Task is click on the calendar : display unplan task modal
				*/
				eventClick: function(fcEvent) {
					var taskModel = self.collection.get(fcEvent.id);
					var taskModelJSON = taskModel.toJSON();
					var interModel = null;
					if( taskModelJSON.project_id !== false ){
						interModel = self.collections.interventions.get(taskModelJSON.project_id[0]);
					}

					app.views.modalUnplanTaskView = new ModalUnplanTaskView({
						el        : '#modalUnplanTask',
						model     : taskModel,
						interModel: interModel
					});
				},
			});

			/**
			* Get calendar name
			*/
			var username = $(this.divCalendar).data('username');

			/** Add personal icon for officer on calendar
			*/
			$('table td.fc-header-left').html('<img src="medias/unknown-person.jpg" width="80px" class="img-thumbnail"> <span class="lead text-info">'+username+'</span>');
		},
		// -------------------- End fullcalendar initialization -------------------- //


		/** Transforms tasks in events for fullcalendar
		*/
		fetchEvents: function() {
			this.events = [];
			var self = this;

			_.each(this.collection.models , function (model){

				var task = model.toJSON();
				var interModel = self.collections.interventions.get(model.getIntervention('id'));
				if( ! _.isUndefined(interModel) ) {
					self.listenTo(model, 'change', self.refreshEvents);
				}
				var actionDisabled = task.state == TaskModel.status.done.key || task.state == TaskModel.status.cancelled.key;

				var title = task.name;
				//team mode
				if( self.teamMode ) {
					//Add officer information about task
					if( task.user_id ) {
						title += '(' + task.user_id[1] + ')';
					}
				}
				//officer mode
				else
				{
					if( task.team_id ) {
						//Add team information about task
						title += '(' + task.team_id[1] + ')';
					}
				}

				//Apply user's 'timezone on dates
				var dtStart = task.date_start !== false ? moment( task.date_start ).tz(app.current_user.getContext().tz) : null;
				var dtEnd = task.date_end !== false ? moment( task.date_end ).tz(app.current_user.getContext().tz) : null;


				//prepare event for calendar
				var event = {
					id             : task.id,
					state          : task.state,
					title          : title,
					inter_desc     : task.inter_desc,
					inter_name     : model.getIntervention(),
					equipments     : model.getEquipments(),
					inter_site     : model.getSite(),
					inter_equipment: model.getInterEquipment(),
					start          : dtStart.add('minutes',-dtStart.zone()).format(),
					end            : dtEnd.add('minutes',-dtStart.zone()).format(),
					planned_hours  : task.planned_hours,
					total_hours    : task.total_hours,
					effective_hours: task.effective_hours,
					remaning_hours : task.remaining_hours,
					allDay         : false,
					className      : 'calendar-' + TaskModel.status[task.state].color,
					editable       : true,
					disableDragging: actionDisabled,
					disableResizing: actionDisabled,
				};

				//Add event in array
				self.events.push(event);
			});

			//order events list by date and return
			return _.sortBy(self.events, function(event){
				return [event.start, event.end];
			});
		},



		/** Initialize Print calendar view
		*/
		initPrintView: function(){
			if ( _.isUndefined(app.views.printingCalendarView) ){
				app.views.printingCalendarView = new PrintingCalendarView({
					calendar: this,
					events  : this.events
				});
			}
			else {
				app.views.printingCalendarView.close();
				app.views.printingCalendarView.calendar = this;
				app.views.printingCalendarView.events = this.events;
			}
			$('#printingCalendar').html(app.views.printingCalendarView.render().el);
		},



		/** When the model ara updated //
		*/
		refreshEvents: function(){
			$(this.divCalendar).fullCalendar( 'refetchEvents' );
		},
		
		/** Constructs url for planning
		*/
		urlBuilder: function() {
			var self = this;
			// Retrieve the baseurl of the view //
			var moduleName = _(Backbone.history.fragment).strLeft('/');

			var pageUrl = _(_(Backbone.history.fragment).strRight('/')).strLeft('/');


			if(pageUrl == app.config.menus.openbase){
				pageUrl = pageUrl + '/' + _(_(_(Backbone.history.fragment).strRight('/')).strRight('/')).strLeft('/');
			}


			var url = _.join('/', moduleName, pageUrl);

			// Iterate all urlParameters //
			_.each(this.urlParameters, function(value){
				// Check if the options parameter aren't undefined or null //
				if(!_.isUndefined(self.options[value]) && !_.isNull(self.options[value])){
					url += '/'+value+'/'+self.options[value];
				}
			});
			return url;
		},

	});

	return calendarView;

});