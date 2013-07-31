/******************************************
* Events List View
*/
app.Views.EventsListView = Backbone.View.extend({
	
	//template name
	templateHTML : 'calendar',	
	//domain for task search
	domain:	[[]],
	//Dom element for calendar
	divCalendar: null,
	
	//tasks : calendar's events 
	filterTasks		: null,
	
	//fullcalendar options : week
	calendarView: 'agendaWeek',
	arrayPlanifTasks: [],
	arrayOnDayEvents: [],
	
	weekSelected	:null,

	events: {
	},

	initialize: function(){	
	
		var self = this;
		this.teamMode = this.options.teamMode;
		//get officers or teams list  
		var collection = this.teamMode?app.models.user.getTeams():app.models.user.getOfficers();
		//Set domain to fetch according the mode (team or officer mode)		

		
		//set team or officer model
		this.model = _.find(collection, function (o) { 
				return o.id == self.options.calendarId
		});
		
		//Set dom element of calendar
		this.divCalendar = 'div#calendar_' + this.model.id;	
		this.render();
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
        	self.initCalendar();
		});

		return this;
	},


     /** Task is click on the calendar
    */
    eventClick: function(fcEvent, jsEvent, view) {

        // Reset the modal Buttons //
        $('#btnRemoveTask').prop('disabled', false);
       	$('#switchWithForeman').bootstrapSwitch('setActive', true);
        
		
        // Retrieve the Task //
		var task = app.collections.tasks.get(fcEvent.id);

		// Set informations in the modal //
		var taskInter = '';
		if(task.getInterventionId() != ''){ taskInter = "<i class='icon-pushpin'></i> " + task.getInterventionName() + " -"; }
		var tasksInfo = taskInter + " " + task.getName();

		// Display a label with the state of the task //
		
		tasksInfo += '<span class="label label-'+app.Models.Task.status[task.getState()].color+' pull-right">'+app.Models.Task.status[task.getState()].translation+'</span>';


		// Check if the task is set to an officer or a team //
		if(task.getTeamId() == false){ 
			var assignTo = "<br /> <i class='icon-user'></i> " + task.getUserName();
			$('#formModalAboutTask').hide();
		}
		else{
			var assignTo = "<br /><i class='icon-group'></i> " + task.getTeamName();
			$('#formModalAboutTask').show();
		}

		$('#infoModalAboutTask p').html(tasksInfo);
		$('#infoModalAboutTask small').html(task.getStartEndDateInformations() + assignTo);

		// Disable or not the button "Remove Of The Schedule" //
		if(task.getState() == app.Models.Task.status.done.key || task.getState() == app.Models.Task.status.cancelled.key){
        	$('#btnRemoveTask').prop('disabled', true);
        	$('#switchWithForeman').bootstrapSwitch('setActive', false);
		}


		// Set the ID of the Task in the DOM of the modal //
		$('#modalAboutTask').data('taskId', task.getId());


		// Display the Modal //
		$("#modalAboutTask").modal('show');
	},



	eventDropOrResize: function(fcEvent) {
		// Lookup the model that has the ID of the event and update its attributes
		this.collection.get(fcEvent.id).save({start: fcEvent.start, end: fcEvent.end});            
	},
    
    fetchEvents: function(tasks) {
    	this.events = [];
    	var self = this;
    	
    	_.each(tasks , function (task, i){
    		//task = task.toJSON()
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
				start: task.date_start!=false?task.date_start.toDate():null,
				end: task.date_end!=false?task.date_end.toDate():null,
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
    	
	//--------------------End events on calendar-------------------------//


    //--------------------Init calendar----------------------------------//
    initCalendar: function() {
    	var self = this;

    	this.calendar = $(this.divCalendar).fullCalendar({
			events: function(start, end, callback) {
    			var domain = []
	    		if( self.teamMode ) {
	    			domain = [	'&',['date_start', '>', moment(start).format('YYYY-MM-DD HH:mm:ss') ],
	    			            '&',['date_end', '<', moment(end).format('YYYY-MM-DD HH:mm:ss') ],
	    			            '|',['team_id','=',self.options.calendarId],
    			               		['user_id','in',app.models.user.getOfficerIdsByTeamId(self.options.calendarId)],
	    			          ];
	    		}
	    		else{			
	    			domain = [	'&',['date_start', '>', moment(start).format('YYYY-MM-DD HH:mm:ss') ],
	    			            '&',['date_end', '<', moment(end).format('YYYY-MM-DD HH:mm:ss') ],
	    			            '|',['user_id','=',self.options.calendarId],
    			               		['team_id','in',app.models.user.getTeamIdsByOfficerId(self.options.calendarId)],
	    			          ];
	    		}	
	    		
	    		collection = new app.Collections.Tasks();
				collection.fetch({search: domain,
					success: function(data){
						var events = self.fetchEvents(data.toJSON());
						callback(events);
					}
				});
    		
    			
			},
			
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
			//disableResizing: false,
			selectable	: true,
			selectHelper: true,
			editable	: true,
			ignoreTimezone	: false,
			dragRevertDuration	:0,
			eventClick	: self.eventClick,
			//drop: self.drop,
			startOfLunchTime	: app.config.startLunchTime,
			endOfLunchTime		: app.config.endLunchTime,
			

			/**
			 * Open leave time
			 */
			select: function( startDate, endDate, allDay, jsEvent, view) {

				var mStartDate = moment( startDate );
				var mEndDate = moment( endDate );

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
									//self.options.planning.render();
									app.loader('hide');	
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
				app.loader('display');

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
				
				
				
				app.Models.Task.prototype.planTasks(copiedEventObject.id, 
					params, {
						success: function (data){
							if( !_.isUndefined(data.error) ){
								app.loader('hide');	
								app.notify('', 'error', app.lang.errorMessages.unablePerformAction, data.error.data.fault_code);
							}
							else{
								$(self.divCalendar).fullCalendar( 'refetchEvents' )
								 self.options.planning.partialRender();
								//self.options.planning.render();
								app.loader('hide');	
							}							
						},
					}
				);
			},

			//Drop event from time slot to another
			eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) { 
				app.loader('display');
				
			    params = { 
			       date_start: event.start,
			       date_end: event.end,
			    };
			    app.Models.Task.prototype.save(event.id, params);	
			    $(this.divCalendar).fullCalendar( 'refetchEvents' )			   
			   // $(this.divCalendar).fullCalendar('refresh');
			    //self.options.planning.render();
			    app.loader('hide');	
			},


			/**
			 * Resize event
			 */
			eventResize: function( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) { 
				
				app.loader('display');
				
			    params = { 
			       date_start: event.start,
			       date_end: event.end,
			       planned_hours: (event.planned_hours + (minuteDelta)/60),
			       total_hours: (event.total_hours + (minuteDelta)/60),
			       remaining_hours: (event.remaining_hours + (minuteDelta)/60),
			    };
			    app.Models.Task.prototype.save(event.id,params);
			    $(this.divCalendar).fullCalendar( 'refetchEvents' )
			    //$(this.divCalendar).fullCalendar('refresh');
			    //self.options.planning.render();
			    app.loader('hide');
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
		
		if(sessionStorage.getItem("week") != null){
			var weekSelected = sessionStorage.getItem("week");
			yearSelected = _(this.weekSelected).strLeft('-');	
			weekSelected = _(this.weekSelected).strRight('-');	
			
			var date = moment().year(yearSelected)
			date = date.week(weekSelected)
			$(this.divCalendar).fullCalendar('gotopage', date.year(), date.month(), date.date());	
			
		}
		
						
		/**
		 * Initialize Print calendar view
		 */
		app.views.printingCalendarView = new app.Views.PrintingCalendarView({
			calendar : this,
			el: $("#printingCalendar"), 
			events : self.filterTasks,
		})
			
		
	},
	// --------------------End init calendar----------------------------------------//
    


});

