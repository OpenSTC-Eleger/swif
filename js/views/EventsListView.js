/******************************************
* Events List View
*/
app.Views.EventsListView = Backbone.View.extend({
	
	filterTasks		: null,
	minTime			: 8,
	maxTime			: 18,
	workingTime 	: 8,
	arrayPlanifTasks: [],
	arrayOnDayEvents: [],

	events: {
	},



	initialize: function(planning, object, teamMode){
		this.teamMode = teamMode;
		this.planning = planning;

		this.id = object.attributes.id;
		this.initCollection(object);

		this.el = $(this.elStringId);

		_.bindAll(this); 
	},



	initCollection: function(object) {
		
		this.filterTasks = null;

		if (this.teamMode) {
			
			this.elStringId = 'div#team_' + object.attributes.id;
			var team_json = object.toJSON();
			this.filterTasks = object.attributes.tasks.toJSON();
			var that = this;
			if( team_json.user_ids!= null ){
				_.each(object.attributes.user_ids.models, function(user){
					if( user!=null && user.attributes.tasks != null && 
							user.attributes.tasks.models.length>0 )
						that.filterTasks = _.union(that.filterTasks, user.attributes.tasks.toJSON());
				})
			}

		}
		else{
			
			this.elStringId = 'div#officer_' + object.attributes.id;
			var officer_json = object.toJSON();

			if( officer_json.team_ids != null ) {
				var self = this;
				this.filterTasks = officer_json.tasks;

				_.each( officer_json.team_ids, function(team){
					self.filterTasks = _.union(self.filterTasks, team.tasks.toJSON());
				});
			}
		}
    },

        
        render: function() {
        	this.initEvents();
        	this.initCalendar();
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
			    			app.collections.officers.fetch({ 
			    				success: function(){
							 		app.collections.teams.fetch({
						                success: function(){
							 				if( self.teamMode)
										    	self.initCollection(app.collections.teams.get(self.id));
										    else
										    	self.initCollection(app.collections.officers.get(self.id));
										    $(self.el).fullCalendar('refetchEvents');
										    self.planning.render();
								 		}
							 		});
						         },
	                        	complete: function(){
	                        	    app.loader('hide');
	                        	}
						     });
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
			
			tasksInfo += '<span class="label label-'+task.getColor()+' pull-right">'+task.getStateTranslate()+'</span>';


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
			if(task.getState() == app.Models.Task.state[1].value || task.getState() == app.Models.Task.state[2].value || task.getState() == app.Models.Task.state[4].value){
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
        


		copy: function() {
			console.log('Copy Event');
		},



        remove: function() {
        	console.log('Remove Event');
        },



        edit: function() {
        	console.log('Edit Event');
        },


        
        getColor: function(task) {
        	var classColor = '';

			switch (task.state) {
				case app.Models.Task.state[0].value:
			    	classColor = app.Models.Task.state[0].color;
			    	break;
				case app.Models.Task.state[1].value:
					classColor = app.Models.Task.state[1].color;
					break;
				case app.Models.Task.state[2].value:
					classColor = app.Models.Task.state[2].color;
					break;
				case app.Models.Task.state[3].value:
					classColor = app.Models.Task.state[3].color;
					break;
				case app.Models.Task.state[4].value:
					classColor = app.Models.Task.state[4].color;
					break;
				case app.Models.Task.state[5].value:
					classColor = app.Models.Task.state[5].color;
					break;
				default:
					classColor = app.Models.Task.state[3].color;
					break;
        	}

        	return classColor;
        },


        
        initEvents: function() {
        	this.events = [];
        	var self = this;
        	
        	_.each(this.filterTasks , function (task, i){
        		var actionDisabled = task.state == app.Models.Task.state[1].value || task.state == app.Models.Task.state[4].value;

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
					className: 'calendar-'+self.getColor(task),
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

        	this.calendar = self.el.fullCalendar({
				events: function(start, end, callback) {
        			callback(self.events);
				},
				
				defaultView: self.planning.calendarView,
				aspectRatio: 1.30,
				header: {
				    left: 'infosUser',
				    center: 'title',
				    right: 'today,prev,next'
				},
				// time formats
				titleFormat: {
				    month: 'MMMM yyyy',
				    // week: "MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}",
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
				minTime		: 8,
				maxTime		: 18,
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
				startOfLunchTime	: app.configuration.startLunchTime,
				endOfLunchTime		: app.configuration.endLunchTime,
                
				select: function( startDate, endDate, allDay, jsEvent, view) {

					console.debug('START' + startDate);
					console.debug('START' + endDate);
					console.debug('ALLDAY' + allDay);

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
		        		tempStartDate.add('hours',self.workingTime)
			    		$("#startHour").timepicker( 'setTime', tempStartDate.format('LT') );
		        		var tempEndDate = moment( mEndDate );
		        		tempEndDate.add('hours',self.maxTime)
			    		$("#endHour").timepicker('setTime', tempEndDate.format('LT') );
		        	}
		        	else {
			    		$("#startHour").timepicker( 'setTime', mStartDate.format('LT') );
			    		$("#endHour").timepicker('setTime', mEndDate.format('LT') );
		        	}

		        	// Set Modal informations //
		        	if(!self.teamMode){
		        		var selectedOfficer = app.collections.officers.get(self.id);
		    			$('#infoModalAbsentTask p').html("<i class='icon-user'></i> "+selectedOfficer.getFullname());
		    			$('#infoModalAbsentTask small').html("Du " + mStartDate.format('LLL') + " au " + mEndDate.format('LLL') );
		    		}
		    		else{
	    				var selectedTeam = app.collections.teams.get(self.id);
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
							    team_id: self.teamMode?self.id:0,
							    user_id: !self.teamMode?self.id:0,
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
				    $(self.el).fullCalendar('refresh');
				    self.planning.render();
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
				    $(self.el).fullCalendar('refresh');
				    self.planning.render();
				    app.loader('hide');
				},



				loading: function (bool) { 
				},



				eventRender: function(event, element) {
					//$(this.event).css('border-color', 'yellow');
				},



				eventDragStop: function(event, jsEvent, ui, view) {
				},

			});
    	
			var username = self.el.data('username');
			
			
			$(self.el.selector + ' table td.fc-header-left').html("<img src='http://mashwork.com/blog/wp-content/uploads/2012/06/Unknown-person2.gif' width='80px' class='img-polaroid'> <span class='lead text-info'>"+username+"</span>");


			// Print button //
			$('<span class="fc-button-print">' 
				   +'<button class="btn btn-primary btn-small no-outline"><i class="icon-print"></i></button></span>')
				  //+('labels', 'Print') + '</span>')
				  .appendTo(self.elStringId + ' td.fc-header-right')
				  .button()
				  .on('click', function() {
					    self.printCalendar();
				  })
				  .before('<span class="fc-header-space">');
				
			
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
        	                  state: app.Models.Task.state[3].value, 
        	                  planned_hours: event.planned_hours ,
        	                  remaining_hours: event.planned_hours ,
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
        	var maxTime = moment( startDate.clone() ).hours( this.maxTime );
        	var stopWorkingEvent = this.getEvent( "stopWorkingTime", maxTime.minutes(0).toDate() );
        	this.arrayOnDayEvents.push( stopWorkingEvent );
        	
        	var minutes = 0;
        	if(_.str.include(app.configuration.startLunchTime, '.')){
        		var minutes = _.lpad(((_.rpad(_( app.configuration.startLunchTime ).strRight('.'), 2, '0') / 100) * 60), 2, '0');
        	}
        	var hours = _( app.configuration.startLunchTime ).strLeft('.');

            
			var startLunchTime = moment( startDate.clone() ).hours( hours ).minutes( minutes );
			
			var minutes = 0;
        	if(_.str.include(app.configuration.endLunchTime, '.')){
        		minutes = _.lpad(((_.rpad(_( app.configuration.endLunchTime ).strRight('.'), 2, '0') / 100) * 60), 2, '0');
        	}
            hours = _( app.configuration.endLunchTime ).strLeft('.');
			
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
				    team_id: this.teamMode?this.id:0,
				    user_id: !this.teamMode?this.id:0,
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
		
        
        //--------------------Print calendar--------------------------------------//
		renderHours: function (o, date){
			return date.format('H[h]mm');
	
		},


		
		getIntervention: function (o, intervention) {
			return intervention.name;
		},
		


		getPlace: function (o, intervention) {
			console.debug(intervention);
			return intervention.site1!=null?intervention.site1[1]:"";
		
		},


		
		getStyle: function (nTd, sData, oData, iRow, iCol) {
			if( oData.state == app.Models.Task.state[5].value )
				$(nTd).css('font-style', 'italic');
		},
		
		renderResume: function (o, check){
			if( o.aData.state != app.Models.Task.state[5].value )
				return "<td class=\"center\"><input type=\"checkbox\" disabled " + (check?"checked":"") + "></td>";
			else
				return "<td class=\"center\"></td>";
		},
		

		
		getDay : function(date) {
			var momentDate = moment( this.el.fullCalendar('getView').visStart );
			return date.format('dddd D MMMM');
		},
			


		/** Print Calendar
		*/
		printCalendar: function () {
			var date = moment( this.el.fullCalendar('getView').visStart );			
			var momentDate = moment().year(date.year()).week(date.week());
			
			var firstDayOfTheWeek = momentDate.clone().day(1);
			var lastDayOfTheWeek = momentDate.clone().day(7);
		
		
			if(firstDayOfTheWeek.isSame(lastDayOfTheWeek, 'month')){
				var titleFirstDay = momentDate.day(1).format('D');
			}
			else{
				if(firstDayOfTheWeek.isSame(lastDayOfTheWeek, 'year')){
					var titleFirstDay = momentDate.day(1).format('D MMM');
				}
				else{
					var titleFirstDay = momentDate.day(1).format('D MMM YYYY');
				}
			}
						
			$("#printContainer .before-muted").html( app.lang.week + " " + momentDate.week() + " - " ); 
			$("#printContainer .muted").html( titleFirstDay + " " + app.lang.to + " " + lastDayOfTheWeek.format('D MMM YYYY')  );			
			
			var self = this;
			var paperBoard = this.filterTasks[0];//this.collection.toJSON();
			var elementToPrint = $('#printContainer');
			var worker = null
			if ( paperBoard && paperBoard.user_id  )
				worker = $('#worker').text(paperBoard.user_id[1]);
			else if ( paperBoard && paperBoard.team_id  )
				worker = $('#worker').text(paperBoard.team_id[1]);
			var table = $('#paperboard');
			
			var tasks = _.filter(this.filterTasks, function(task){ 
	        	return (
	        			task.date_start && task.date_start.toDate() < self.el.fullCalendar('getView').visEnd &&
	        			task.date_end && task.date_end.toDate() > self.el.fullCalendar('getView').visStart &&
	        			(	task.state != app.Models.Task.state[3].value &&
	        				task.state != app.Models.Task.state[4].value
	        			)
	        			
	        		); 
	        });
			
			tasks = _.sortBy(tasks, function(item){ 
			    return item.date_start; 
			});
			
			
		    _.each(tasks, function(task){ 
		    	var inter = task.intervention;
		    	
		    	task["day"] = self.getDay(task.date_start);
		    	
		    	task["inter"] = ( inter!=null)?inter.name:"" ;
		    	task["name"] = task.name;
		    	//task["category"] = ( task.category_id!=null )?task.category_id[1]:"" ;
		    	task["place"] = ( inter!=null && inter.site1!=null && inter.site1[1] )?inter.site1[1]:"" ;
		    	//task["effective_hours"] = "";
		    	//task["remaining_hous"] = "";
		    	task["done"] = ( task.state == app.Models.Task.state[1].value  ? true : false );
		    	
		    	task["equipment"] = "";
		    	if( task.equipment_ids ) {
			    	_.each( task.equipment_ids, function( equipment ) {
			    		task["equipment"] += "[" + equipment.complete_name + "]";
			    	});
			    }
		    	
			    task["planned_hours"] =  ( task.planned_hours>0? task.planned_hours : '' );
			    task["effective_hours"] =  ( task.effective_hours>0? task.effective_hours : '' );
			    task["remaining_hours"] =  '';//( task.remaining_hours>0? task.remaining_hours : '' );
		    	task["oilQtity"] =  (task.oil_qtity>0? task.oil_qtity : '');
		    	task["oilPrice"] =  (task.oil_price>0? task.oil_price : '');
		    	task["taskHours"] = task.date_start.format('H[h]mm') + '-' + task.date_end.format('H[h]mm');
		    	task["km"] = ''; //task.km;

		    	task["description"] = '';
		    	if(inter!=null){
	    			task["description"] = inter.description;
		    	}
		    	else{
		    		task["description"] = '';
		    	}
    	

		    })
		    
		    $('#paperboard').data('resultSet', tasks);
		    var results = $('#paperboard').data('resultSet');
		    self.results = results;
		    
			table.dataTable({
				"bAutoWidth": false,
				"aaData": self.results,
			    "bJQueryUI": true,
			    "sPaginationType": "full_numbers",
			    "bProcessing": true,
			    "bSort": true,
			    //"bDeferRender": true,
			    //"sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
			    "aoColumns": [			        
			        {"sDay": "Day", "mDataProp": "day", 'sWidth': '5%', 'sClass': "center", "bVisible": false, "sType": "day"},
			        {"sInter": "Inter", "mDataProp": "inter", 'sWidth': '5%', 'sClass': "center"},
			        {"sDescription": "Description", "mDataProp": "description", 'sWidth': '5%'},
			        {"sName": "Name", "mDataProp": "name", 'sWidth': '5%', 'fnCreatedCell': self.getStyle },
			        {"sPlace": "Place", "mDataProp": "place", 'sWidth': '5%', 'sClass': "center"},
			        {"sDateStart": "DateStart", "mDataProp": "taskHours","sType": "date", 'sWidth': '2%'},
			        { "sWorkingTime": "WorkingTime", "mDataProp": "planned_hours", 'sWidth': '1%','sClass': "center"},//'sWidth': '5%'},
			        { "sEffectiveTime": "EffectiveTime", "mDataProp": "effective_hours", 'sWidth': '1%','sClass': "center toFill"}, //'sWidth': '5%','fnRender': self.renderHours},
			        { "sRemainingTime": "RemainingTime", "mDataProp": "remaining_hours", 'sWidth': '1%','sClass': "center toFill"}, //'sWidth': '5%','fnRender': self.renderHours},
			        { "sDone": "Done", "mDataProp": "done", 'sWidth': '2%','fnRender': self.renderResume},
			        { "sEquipment": "Equipment", "mDataProp": "equipment", 'sWidth': '25%','sClass': "center toFill"},
			        { "sOilQtity": "oilQtity", "mDataProp": "oilQtity", 'sWidth': '2%', 'sClass': "center toFill"},
			        { "km": "km", "mDataProp": "km", 'sWidth': '2%', 'sClass': "center toFill"},
			        { "sOilPrice": "oilPrice", "mDataProp": "oilPrice", 'sWidth': '2%', 'sClass': "center toFill"},
			        ],
			
			    "bFilter": false,"bInfo": false,"bPaginate": false,"bLengthChange": false,
			    bRetrieve: true,
			    "fnDrawCallback": function ( oSettings ) {					
		            if ( oSettings.aiDisplay.length == 0 )
		            {
		                return;
		            }
		             
		            var nTrs = $('#paperboard tbody tr');
		            var iColspan = nTrs[0].getElementsByTagName('td').length;
		            var sLastGroup = "";
		            for ( var i=0 ; i<nTrs.length ; i++ )
		            {
		                var iDisplayIndex = oSettings._iDisplayStart + i;
		                var sGroup = oSettings.aoData[ oSettings.aiDisplay[iDisplayIndex] ]._aData["day"];
		                if ( sGroup != sLastGroup )
		                {
		                    var nGroup = document.createElement( 'tr' );
		                    var nCell = document.createElement( 'td' );
		                    
		                    //$(nCell).css({ backgroundColor: '#FFF'});//.css({ display: 'table-row' }).addClass('expend');
		                    nCell.colSpan = iColspan;
		                    nCell.className = "group";
		                    //$(nCell).addClass("gradeA"); 
		                    nCell.innerHTML = sGroup;
		                    //$(nGroup).addClass("row-object");
		                    nGroup.appendChild( nCell );
		                    nTrs[i].parentNode.insertBefore( nGroup, nTrs[i] );
		                    sLastGroup = sGroup;
		                }
		            }
		        },
		        "fnSort": function (x,y) {
			          return ((x < y) ? -1 : ((x > y) ?  1 : 0));
			    },
		        "aoColumnDefs": [
		            { "bVisible": false, "aTargets": [ 0 ] }
		        ],
		        //"aaSortingFixed": [[ 0, 'asc' ]],
		        "aaSorting": [[ 0, 'asc' ]],
		        //"sDom": 'lfr<"giveHeight"t>ip',
		         //"binfo": true,
		         //"sDom": '<"top"i>rt<"bottom"flp><"clear">'
			})

			table.fnClearTable();
			if (results.length)
				table.fnAddData(results);
			table.fnDraw();

			elementToPrint.printElement({
				leaveOpen	: true,
				printMode	: 'popup',
				overrideElementCSS:[
					{ href:'css/vendors/print_table.css', media: 'all'}
				]
			});
		},	
		

		//--------------------End  Print calendar----------------------------------------//
	});

jQuery.fn.dataTableExt.oSort['day-asc']  = function(x,y) {
	var days = Array("lundi","mardi","mercredi","jeudi","vendredi","samedi");
	var indexOfx = days.indexOf(x);
	var indexOfy = days.indexOf(y);
	return ((indexOfx < indexOfy) ? -1 : ((indexOfx > indexOfy) ? 1 : 0));
};
