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

	events: {
	},

	initialize: function(){	
	
		var self = this;
		this.teamMode = this.options.teamMode
		//get officers or teams list  
		var collection = this.teamMode?app.models.user.getTeams():app.models.user.getOfficers();
		//Set domain to fetch according the mode (team or officer mode)
		this.domain = this.teamMode?[['team_id','=',this.options.calendarId]]:[['user_id','=',this.options.calendarId]];		
		
		//set team or officer model
		this.model = _.find(collection, function (o) { 
				return o.id == self.options.calendarId
		});
		
		//Set dom element of calendar
		this.divCalendar = 'div#calendar_' + this.model.id;		
		this.initCollection();
		

	},

	initCollection: function() {
	
		var self = this;
		this.filterTasks = null;
		//fetch tasks of officer or team to display events in calendar
		collection = new app.Collections.Tasks();
		collection.fetch({search: self.domain,
			success: function(data){
				self.filterTasks = data.toJSON()
				self.render();
			}
		});
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
        	self.initEvents();
        	self.initCalendar();
		});

		return this;
	},


    refresh: function() {
		var self = this;
        app.collections.tasks.fetch({ 
    		success: function(){
    			app.collections.interventions.fetch({ 
    				beforeSend: function(){
	                    app.loader('display');
	                },
    				success: function(){
    					self.options.planning.render();
    				},
    				complete: function(){
                    	app.loader('hide');
                    }
               });
           }
        });
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
    
    initEvents: function() {
    	this.events = [];
    	var self = this;
    	
    	_.each(this.filterTasks , function (task, i){
    		//task = task.toJSON()
    		var actionDisabled = task.state == app.Models.Task.status.done.key || task.state == app.Models.Task.status.cancelled.key;

    		var event = { 
    			id: task.id, 
				state: task.state,
				title: task.name, 
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
    	
		var eventsSortedArray = _.sortBy(self.events, function(event){ 
			return [event.start, event.end]; 
		});
		self.events = eventsSortedArray;
    },
    


	getEvent: function( title, startDate, endDate ){
		return {
					title: title,
					start: startDate,
					end : endDate,
				};
	},        



	removeEvent: function(array,s){
		var index = array.indexOf(s);
		if(array.indexOf(s) != -1) array.splice(index, 1);
	},		
	//--------------------End events on calendar-------------------------//


    //--------------------Init calendar----------------------------------//
    initCalendar: function() {
    	var self = this;

    	this.calendar = $(this.divCalendar).fullCalendar({
			events: function(start, end, callback) {
    			callback(self.events);
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
            
			select: function( startDate, endDate, allDay, jsEvent, view) {

				//console.debug('START' + startDate);
				//console.debug('START' + endDate);
				//console.debug('ALLDAY' + allDay);

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

	        	// Set Modal informations //
	        	if(!self.teamMode){
	        		var selectedOfficer = app.collections.officers.get(this.model.id);
	    			$('#infoModalAbsentTask p').html("<i class='icon-user'></i> "+selectedOfficer.getFullname());
	    			$('#infoModalAbsentTask small').html("Du " + mStartDate.format('LLL') + " au " + mEndDate.format('LLL') );
	    		}
	    		else{
    				var selectedTeam = app.collections.teams.get(this.model.id);
	    			$('#infoModalAbsentTask p').html("<i class='icon-group'></i> "+selectedTeam.getName());
	    			$('#infoModalAbsentTask small').html("Du " + mStartDate.format('LLL') + " au " + mEndDate.format('LLL') );	
	    		}

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
						    team_id: self.teamMode?this.model.id:0,
						    user_id: !self.teamMode?this.model.id:0,
						}
						app.models.task.save(0,params,{
							success: function(data){
								if(data.error){
									app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.unablePerformAction);
								}
								else
									self.refresh();
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



			start: function (event, ui){
				$('modalAbsentTask').modal();
			},



			/** When a event is Drop on the calendar
			*/
			drop: function( date, allDay ) {
				app.loader('display');

				var domObject = $(this)
				var originalEventObject = $(this).data('eventObject');
				var copiedEventObject = $.extend({}, originalEventObject);
				copiedEventObject.allDay = allDay;
				copiedEventObject.start = date;

				var currentInter = app.collections.interventions.get( copiedEventObject.project_id );
				currentInter = currentInter!=null? currentInter.toJSON():null
				copiedEventObject.copy = ( currentInter && currentInter.state == 'template' )?true:false;					
				copiedEventObject.allPlanned = false;
				self.arrayPlanifTasks = [];
				self.arrayOnDayEvents = _.filter(self.events, function(e) {
					if(!e.start) return false;
					var eventDate = moment( e.start );
					var currentDate = moment( date );
					if( eventDate.days() !=  currentDate.days() ) return false;
					return ( currentDate.diff(eventDate, 'days', true)>-1 && currentDate.diff(eventDate, 'days', true)<1 )
					
				});
				self.calculTask(copiedEventObject);
				self.planTasks(copiedEventObject);	
			},



			eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) { 
				app.loader('display');
				
			    params = { 
			       date_start: event.start,
			       date_end: event.end,
			    };
			    app.models.task.save(event.id, params);	
			    $(this.divCalendar).fullCalendar('refresh');
			    self.options.planning.render();
			    app.loader('hide');	
			},



			eventResize: function( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ) { 
				
				app.loader('display');
				
			    params = { 
			       date_start: event.start,
			       date_end: event.end,
			       planned_hours: (event.planned_hours + (minuteDelta)/60),
			       total_hours: (event.total_hours + (minuteDelta)/60),
			       remaining_hours: (event.remaining_hours + (minuteDelta)/60),
			    };
			    app.models.task.save(event.id,params);
			    $(this.divCalendar).fullCalendar('refresh');
			    self.options.planning.render();
			    app.loader('hide');
			},
		});
	
		var username = $(this.divCalendar).data('username');
		
		
		$('table td.fc-header-left').html("<img src='css/images/unknown-person.jpg' width='80px' class='img-polaroid'> <span class='lead text-info'>"+username+"</span>");



		
		
						
		//Initialize Print calendar view
		app.views.printingCalendarView = new app.Views.PrintingCalendarView({
			calendar : this,
			el: $("#printingCalendar"), 
			events : self.filterTasks,
		})
			
		
	},
	// --------------------End init calendar----------------------------------------//
    
	//--------------------Cut dropped task on calendar-----------------------------//
    calculTask: function(event) {
    	if( event.allPlanned  ) {
    		if( event.planned_hours!=0 ) {
    	        var params = {
    	        		  name:  event.title,
    	                  project_id: event.project_id,
    	                  parent_id: event.copy?event.id:false,
    	                  state: app.Models.Task.status.draft.key,
    	                  planned_hours: event.planned_hours,
    	                  remaining_hours: event.planned_hours,
    	                  user_id: null,
    	                  team_id: null,
    	                  date_end: null,
    	                  date_start: null,
    	              };
    	        app.Models.Task.prototype.save(0, params, null);
    		}
    		return 1;
    	}
    	
    	var startDate = moment(event.start);
    	var maxTime = moment( startDate.clone() ).hours( app.config.endWorkTime );
    	var stopWorkingEvent = this.getEvent( "stopWorkingTime", maxTime.minutes(0).toDate() );
    	this.arrayOnDayEvents.push( stopWorkingEvent );
    	
    	var minutes = 0;
    	if(_.str.include(app.config.startLunchTime, '.')){
    		var minutes = _.lpad(((_.rpad(_( app.config.startLunchTime ).strRight('.'), 2, '0') / 100) * 60), 2, '0');
    	}
    	var hours = _( app.config.startLunchTime ).strLeft('.');

        
		var startLunchTime = moment( startDate.clone() ).hours( hours ).minutes( minutes );
		
		var minutes = 0;
    	if(_.str.include(app.config.endLunchTime, '.')){
    		minutes = _.lpad(((_.rpad(_( app.config.endLunchTime ).strRight('.'), 2, '0') / 100) * 60), 2, '0');
    	}
        hours = _( app.config.endLunchTime ).strLeft('.');

		var endLunchTime = moment( startDate.clone() ).hours( hours ).minutes( minutes );
		var lunchEvent = this.getEvent( "lunchTime", startLunchTime.toDate(), endLunchTime.toDate() );
		this.arrayOnDayEvents.push( lunchEvent );

		
		var self = this;
		self.event = event;
		
		overlapsEvent = _.filter(this.arrayOnDayEvents, function(e){
			return self.event.start>=e.start && self.event.end<e.end
		});
		
		while( overlapsEvent.length>0 ){
			
			
			overlapsEvent = _.sortBy(overlapsEvent, function(event){ 
				return [event.start,event.end]; 
			});
			
			_.each(overlapsEvent, function(e){
				self.event.start = e.end;
				self.event.end = e.end;
			});	
			
			overlapsEvent = _.filter(this.arrayOnDayEvents, function(e){
				return self.event.start>=e.start && self.event.end<e.end
			});
		}
		
		this.arrayOnDayEvents.push( event );
		var eventsSortedArray = _.sortBy(this.arrayOnDayEvents, function(event){ 
			return [event.start,event.end]; 
		});
		this.arrayOnDayEvents = eventsSortedArray;

		
		this.getEndDate( event );
		
		this.removeEvent( this.arrayOnDayEvents, stopWorkingEvent );
		this.removeEvent( this.arrayOnDayEvents, lunchEvent );
		this.removeEvent( this.arrayOnDayEvents, event );
		
		
		this.calculTask( event );
    },


    getEndDate: function(event) {
    	var duration = event.planned_hours;
    	var startDate = moment( event.start );
    	var index = this.arrayOnDayEvents.indexOf( event );
    	var size = this.arrayOnDayEvents.length;
    	var found = false;
    	var returnDate = null;
    	while( index<size-1 && !found ) {
    		var returnDate = returnDate==null?startDate.clone().add('hours', duration):returnDate;
    		var nextEvent = this.arrayOnDayEvents[ index+1 ];
    		if( nextEvent ) {
        		nextDateStart = moment( nextEvent.start ); 
        		nextDateEnd = moment( nextEvent.end ); 
        		var diff = returnDate.diff(nextDateStart, 'minutes', true );
        		if( diff>0 ) {
        			returnDate = moment( nextDateStart )
        			found = true;
        		}
        		else if ( diff==0 ) {
        			returnDate = moment( nextDateStart )
        		}
			}
    		index += 1;
    	}
    	if( index==size || !nextEvent ) event.allPlanned = true;
    	else {
    		this.removeEvent( this.arrayOnDayEvents, event )
        		
        	duration = returnDate.diff( startDate, 'hours', true );

        	var title = event.title;
        	if( this.arrayPlanifTasks.length>0 )
        		title = "(Suite-" + this.arrayPlanifTasks.length + ")" + title ;
        	

			var params=
			{
			    name:  title,
			    project_id: event.project_id,
			    copy: event.copy,
			    parent_id: event.copy?event.id:false,
			    state: 'open',
			    date_start: startDate.toDate(),
			    date_end: returnDate.toDate(),
			    planned_hours: duration,
			    remaining_hours: duration,
			    team_id: this.teamMode?this.model.id:0,
			    user_id: !this.teamMode?this.model.id:0,
			}
			
			
			event.planned_hours -= duration;
	    	event.remaining_hours -= duration;
    		
    		
    		if( event.planned_hours==0 || returnDate.hours()==18 )
    			event.allPlanned = true;
    		else if( nextDateEnd ){
	    		event.start = nextDateEnd.toDate();
	    		event.end = nextDateEnd.toDate();
    		}
    		
			this.arrayPlanifTasks.push(params);
		}
    },
    
    planTasks : function(copiedEventObject) {
    	        	
    	if( this.arrayPlanifTasks.length==0) {
    		this.refresh();
    		return 1;
    	}
    	
    	var self = this;
		if( this.arrayPlanifTasks.length==1 && !copiedEventObject.copy ) {
			this.arrayPlanifTasks[0].id = copiedEventObject.id;
			this.updateTask( this.arrayPlanifTasks[0] );
		}else {			
			var params = this.arrayPlanifTasks[0];
			self.params = params;
			app.models.task.save(0,params,{
				success: function(){
					self.arrayPlanifTasks.splice(0, 1);
					self.planTasks( copiedEventObject );
				}
			});
		}
    },
    
    updateTask: function(event) {
    	var self = this;
	    app.models.task.save(event.id, event, {
	    	success: function (data) {
		    	$.pnotify({
		    		title: 'Tâche attribuée',
		    		text: 'La tâche a correctement été attribué à l\'agent.'
			    });
		    	self.refresh();
	    	}
	    }); 			    
	    return 1;
    },        
    //--------------------End cut dropped task on calendar--------------------//

});

