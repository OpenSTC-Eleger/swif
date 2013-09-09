/******************************************
* Events List View
*/
app.Views.EventsListView = Backbone.View.extend({
	
	//template name
	templateHTML 	: 'calendar',	
	//Dom element for calendar
	divCalendar: 	null,
		
	calendarView: 	'agendaWeek',	
	teamMode:		 false,
	initialized: false,

	events: {
		'click .fc-button-prev'                  : 'previousDate',
		'click .fc-button-next'                  : 'nextDate',		
	},
	
	urlParameters : ['officer','team','year','week'],

	/**
	 * Initialize calendar view
	 */
	initialize: function(){	
	
		var self = this;
		var collection = null;
		
		if(!_.isUndefined(this.options.team)) {
			//get team model selected on calendar
			this.teamMode = true;
			collection = app.models.user.getTeams();
			this.model = _.find(collection, function (o) { 
				return _.slugify(o.name).toUpperCase() == self.options.team
			});
		} else {
			//get officer model selected on calendar
			collection = app.models.user.getOfficers(); 
			if(_.isUndefined(this.options.officer)) {
				this.model = collection[0];
				// Initialize first officer in tab if no officer passed in url
				this.options.officer = _.slugify(this.model.name).toUpperCase()
			}
			else{
				this.model = _.find(collection, function (o) { 
					return _.slugify(o.name).toUpperCase() == self.options.officer.toUpperCase()
				});				
			}
		}
		
		// Initialize year,week parameters if not yet in url with current year/week (for prev/next button on calendar)
		if(_.isUndefined(this.options.year)) {
			this.options.year = moment().year();
			this.options.week = moment().week();
		}
		
		//DOM element id for calendar with model
		this.divCalendar = 'div#calendar_' + this.model.id;	
		
	},

    
	/** Display the view
	*/
	render: function() {
		var self = this;

		// Retrieve the template //
		$.get('templates/' + this.templateHTML + '.html', function(templateData){
			var template = _.template(templateData, {
				calendar   : self.model,
			});
			
			self.$el.html(template);	
			// Init calendar
        	self.initCalendar();

    		// Go to week selected	
        	var momentDate = moment().year(self.options.year).week(self.options.week);			
			self.calendar.fullCalendar( 'gotoDate', momentDate.year(), momentDate.month(), momentDate.date());			
        	
		});

		return this;
	},
	
	/**
	 * Go to next week
	 */
	nextDate: function(e) {
		this.options.week = String(parseInt(this.options.week)+1);
		app.router.navigate(this.urlBuilder(), {trigger: false, replace: false});
	},

	/**
	 * Go to previous week
	 */
	previousDate: function(e) {
		this.options.week = String(parseInt(this.options.week)-1);
		app.router.navigate(this.urlBuilder(), {trigger: false, replace: false});
	},
	

	/**
	 * Constructs url for planning
	 */
	urlBuilder: function() {
		var self = this;
		var url = _(Backbone.history.fragment).strLeft('/');

		// Iterate all urlParameters //
		_.each(this.urlParameters, function(value, index){		
			// Check if the options parameter aren't undefined or null //
			if(!_.isUndefined(self.options[value]) && !_.isNull(self.options[value])){	
					url += '/'+value+'/'+self.options[value];					
			}
		});				
		return url;		
	},

   /**
    * Init fullcallendar
    */
    initCalendar: function() {
    	var self = this;

    	this.calendar = $(this.divCalendar).fullCalendar({
    		
    		/** Full calendar attributes **/			
			defaultView: self.calendarView,
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
			droppable	: true,
			selectable	: true,
			selectHelper: true,
			editable	: true,
			ignoreTimezone	: false,
			dragRevertDuration	:0,
			startOfLunchTime	: app.config.startLunchTime,
			endOfLunchTime		: app.config.endLunchTime,
	
    		/**
    		 * Calculates events to display on calendar for officer (or team) on week selected
    		 */    		
			events: function(start, end, callback) { 
    			 


				if( !self.initialized ) {
					self.initialized = true;
					return;
				}
			
    			var fetchParams={
					silent : true,
					data   : {}
				};

    				
    			var domain = [
    			              	{ 'field' : 'date_start', 'operator' : '>', 'value' : moment(start).format('YYYY-MM-DD HH:mm:ss') },
    			              	{ 'field' : 'date_end', 'operator' : '<', 'value' : moment(end).format('YYYY-MM-DD HH:mm:ss')  },    			              	
    			             ]
    			
    			if(self.teamMode){
        			var users = app.models.user.getOfficerIdsByTeamId(self.model.id)
        			if( users.length>0 )
        				domain.push(		'|',
        								   { 'field' : 'team_id.id', 'operator' : '=', 'value' : self.model.id },
        				                   { 'field' : 'user_id.id', 'operator' : 'in', 'value' : users  }
        				               )
        			else
        				domain.push({ 'field' : 'user_id.id', 'operator' : '=', 'value' : self.model.id })
    			}
    			else{
        			var teams = app.models.user.getTeamIdsByOfficerId(self.model.id)
        			if( teams.length>0 )
        				domain.push(		'|',
        								   { 'field' : 'user_id.id', 'operator' : '=', 'value' : self.model.id },
        				                   { 'field' : 'team_id.id', 'operator' : 'in', 'value' : teams  }
        				               )
        			else
        				domain.push({ 'field' : 'user_id.id', 'operator' : '=', 'value' : self.model.id })
    			}

	    		fetchParams.data.filters    = app.objectifyFilters(domain),
	    		self.collection = new app.Collections.Tasks();
	    		//Get tasks for domain
				self.collection.fetch(fetchParams).done(function(data){
					//Transforms tasks in events for fullcalendar
					self.events = self.fetchEvents();	
					self.listenTo(self.collection, 'change', self.change);
					self.initPrintView();
					//Display events on calendar					
					callback(self.events);
				});
			},

			

			/**
			 * Open leave time
			 */
			select: function( startDate, endDate, allDay, jsEvent, view) {


				
				app.views.modalAbsentTaskView = new app.Views.ModalUnplanTaskView({
    				el    	: '#modalAbsentTask',
    				startDt : moment( startDate ),	
    				endDt	: moment( endDate ),
    			});

	        	modalAbsentTask = $("#modalAbsentTask");
	        	$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});


	        	$('.datepicker').datepicker({ format: 'dd/mm/yyyy', weekStart: 1, autoclose: true, language: 'fr'});

	        	app.views.selectListAbsentTypesView = new app.Views.DropdownSelectListView({el: $("#absentType"), collection: app.collections.absentTypes})
				app.views.selectListAbsentTypesView.clearAll();
				app.views.selectListAbsentTypesView.addEmptyFirst();
				app.views.selectListAbsentTypesView.addAll();

	        	$("#startDate").val( moment( startDate ).format('L') );
	        	$("#endDate").val( moment( endDate ).format('L') );
	        	if( allDay ) {
	        		var tempStartDate = moment( mStartDate );
	        		tempStartDate.add('hours', (app.config.endWorkTime - app.config.startWorkTime))
		    		$("#startHour").timepicker( 'setTime', tempStartDate.format('LT') );
	        		var tempEndDate = moment( mEndDate );
	        		tempEndDate.add('hours',app.config.endWorkTime)
		    		$("#endHour").timepicker('setTime', tempEndDate.format('LT') );
	        	}
	        	else {
		    		$("#startHour").timepicker( 'setTime', mStartDate.format('LT') );
		    		$("#endHour").timepicker('setTime', mEndDate.format('LT') );
	        	}
	        	
	        	// Set Modal informations 
	        	var icon = self.teamMode?'group':'user' 
	        	$('#infoModalAbsentTask p').html("<i class='icon-" + icon +"'></i> " + self.model.name );
	    		$('#infoModalAbsentTask small').html("Du " + mStartDate.format('LLL') + " au " + mEndDate.format('LLL') );

	    		modalAbsentTask.one('submit', function(event) {
					event.preventDefault();
					var mNewDateStart =  new moment( $("#startDate").val(),"DD-MM-YYYY")
											.add('hours',$("#startHour").val().split(":")[0] )
											.add('minutes',$("#startHour").val().split(":")[1] );
					var mNewDateEnd =  new moment( $("#endDate").val(),"DD-MM-YYYY")
											.add('hours',$("#endHour").val().split(":")[0] )
											.add('minutes',$("#endHour").val().split(":")[1] );
					var planned_hours = mNewDateEnd.diff(mNewDateStart, 'hours', true);

					absentTypeId = null;
					absentTypeTitle = null;
				    if ( app.views.selectListAbsentTypesView ) {
				    	var absentTypeSelected = app.views.selectListAbsentTypesView.getSelected()
				    	if( absentTypeSelected ) {
				    		absentTypeJSON = absentTypeSelected.toJSON();
				    		absentTypeId =  absentTypeJSON.id;
				    		absentTypeTitle = absentTypeJSON.name;
				    	}
				    }

					var params=
						{
						    name:  absentTypeTitle,
						    absent_type_id: absentTypeId,
						    state: 'absent',
						    date_start: mNewDateStart.toDate(),
						    date_end: mNewDateEnd.toDate(),
						    planned_hours: planned_hours,
						    effective_hours: planned_hours,
						    hours: planned_hours,
						    remaining_hours: 0,
						    team_id: self.teamMode?self.model.id:0,
						    user_id: !self.teamMode?self.model.id:0,
						}
						app.Models.Task.prototype.save(0,params,{
							success: function(data){
								if(data.error){
									app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.unablePerformAction);
								}
								else
									$(self.divCalendar).fullCalendar( 'refetchEvents' )
										
							}
						});
						modalAbsentTask.modal('hide');
			    });	
	    		$('#modalAbsentTask .dismiss').one('click .dismiss', function (event) {
	    			event.preventDefault();
	    			 $('#modalAbsentTask').unbind('submit'); 
	    		});
			    modalAbsentTask.modal();
			},


			/**
			 * Open modal to fill leave
			 */
			start: function (event, ui){
				$('modalAbsentTask').modal();
			},


			/** When a event is Drop on the calendar : plan in backend
			*/
			drop: function( date, allDay ) {

				var domObject = $(this)
				var originalEventObject = $(this).data('eventObject');
				var copiedEventObject = $.extend({}, originalEventObject);
				copiedEventObject.allDay = allDay;
				copiedEventObject.start = date; //$.fullCalendar.formatDate(date, 'yyyy-MM-dd HH:mm:ss');
			
				var params = {
						startWorkingTime : app.config.startWorkTime,
						endWorkingTime : app.config.endWorkTime,
				        startLunchTime : app.config.startLunchTime,
				        endLunchTime : app.config.endLunchTime,
				        startDt: copiedEventObject.start,
				        teamMode : self.teamMode,
				        calendarId : self.model.id,
				}
				
//				var model = new app.Models.Task(params);
//				
//				model.save(params,{
//					 success: function( data ) {
//						console.log(data);	     	
//						if(data.error){
//							app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
//						}
//						else{
//							$(self.divCalendar).fullCalendar( 'refetchEvents' )
//						}				
//					},
//					error: function(e){
//						alert("Impossible de mettre à jour la tâche'");
//					}
//				 });
				
				
				app.Models.Task.prototype.planTasks(copiedEventObject.id, 
					params, {
						success: function (data){
							if( !_.isUndefined(data.error) ){
								app.notify('', 'error', app.lang.errorMessages.unablePerformAction, data.error.data.fault_code);
							}
							else{
								
								//self.planning.partialRender(data.result.project_id)						
							}							
						},
					}
				);
			},

			//Drop event from time slot to another
			eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) { 
				var model = self.collection.get(event.id)
			
			    params = { 
			       date_start: event.start,
			       date_end: event.end,
			    };
			    
				model.save(params, {patch: true, silent: true})
				.fail(function (e) {
					console.log(e);
				})
			},


			/**
			 * Resize event
			 */
			eventResize: function( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) { 			    
			    
			    var model = self.collection.get(event.id)
				
			    params = {
				   date_start: event.start,
			       date_end: event.end,
			       planned_hours: (event.planned_hours + (minuteDelta)/60),
			       total_hours: (event.total_hours + (minuteDelta)/60),
			       remaining_hours: (event.remaining_hours + (minuteDelta)/60),
				};
		
			   
				model.save(params, {patch: true, silent: true})
					.fail(function (e) {
						console.log(e);
					})
			},
			
			/** Task is click on the calendar : display unplan task modal
    	    */
    	    eventClick: function(fcEvent, jsEvent, view) {
    			app.views.modalUnplanTaskView = new app.Views.ModalUnplanTaskView({
    				el    : '#modalUnplanTask',
    				model : self.collection.get(fcEvent.id)
    			});
    		},
		});
	
    	/**
    	 * Get calendar name
    	 */
		var username = $(this.divCalendar).data('username');
		
		/**
		 * Add personal icon for officer on calendar 
		 */
		$('table td.fc-header-left').html("<img src='css/images/unknown-person.jpg' width='80px' class='img-polaroid'> <span class='lead text-info'>"+username+"</span>");		
	},
	// -------------------- End fullcalendar initialization -------------------- //
	
	/**
	 * Transforms tasks in events for fullcalendar
	 */	    
    fetchEvents: function() {
    	this.events = [];
    	var self = this;
    	
    	_.each(this.collection.toJSON() , function (task, i){
    		var actionDisabled = task.state == app.Models.Task.status.done.key || task.state == app.Models.Task.status.cancelled.key;

    		var title = task.name;
    		if( self.teamMode ) {
    			if( task.user_id ) {
    				title += "(" + task.user_id[1] + ")"
    			}   				
    		}
    		else{
    			if( task.team_id ) {
    				title += "(" + task.team_id[1] + ")"
    			}    
    		}
    		
    		var event = { 
    			id: task.id, 
				state: task.state,
				title: title, 
				start: task.date_start!=false?task.date_start:null,
				end: task.date_end!=false?task.date_end:null,
				planned_hours: task.planned_hours,
				total_hours: task.total_hours,
				effective_hours: task.effective_hours,
				remaning_hours: task.remaining_hours,
				allDay: false,
				className: 'calendar-'+app.Models.Task.status[task.state].color,
				editable: true,
				disableDragging: actionDisabled,
				disableResizing: actionDisabled,
			};

    		self.events.push(event);
    	});
    	
		return eventsSortedArray = _.sortBy(self.events, function(event){ 
			return [event.start, event.end]; 
		});
    },
    
	/**
	 * Initialize Print calendar view
	 */
	initPrintView: function(){
		if ( _.isUndefined(app.views.printingCalendarView) ){
			app.views.printingCalendarView = new app.Views.PrintingCalendarView({
				calendar : this,
				events : this.collection.toJSON(),
			})
		}
		else {
			app.views.printingCalendarView.close();
			app.views.printingCalendarView.calendar = this;
			app.views.printingCalendarView.events = this.collection.toJSON();
		}
		$('#printingCalendar').html(app.views.printingCalendarView.render().el);
	},

	/** When the model ara updated //
	*/
	change: function(model){
		$(this.divCalendar).fullCalendar( 'refetchEvents' )
		app.notify('', 'success', app.lang.infoMessages.information, app.lang.infoMessages.taskUpdateOk);
	},

	/**
	 * ????
	 */
	eventDropOrResize: function(fcEvent) {
		// Lookup the model that has the ID of the event and update its attributes
		this.collection.get(fcEvent.id).save({start: fcEvent.start, end: fcEvent.end});            
	},

});

