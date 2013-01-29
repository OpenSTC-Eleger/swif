app.Views.EventsView = Backbone.View.extend({
	
		filterTasks: null,
	
		events: {

			//'click .btn.printCalendar'    : 'printCalendar',
		},
	
	
        initialize: function(planning,object,teamMode){
			this.teamMode = teamMode;
			this.planning = planning;
			
			this.id = object.attributes.id;
			this.initCollection(object);
				
			this.el = $(this.elStringId);			
			
            _.bindAll(this); 
            
            this.eventView = new app.Views.EventView();            
        },
        
        initCollection: function(object) {
			if (this.teamMode) 
			{
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
			else
			{
				this.elStringId = 'div#officer_' + object.attributes.id;
				var officer_json = object.toJSON();
				this.filterTasks = officer_json.tasks;					
				if( officer_json.belongsToTeam!= null && officer_json.belongsToTeam.tasks!=null )
					this.filterTasks = _.union(officer_json.tasks, officer_json.belongsToTeam.tasks.toJSON());	
				
				//TODO : code below for multi-team association by agent

//				this.filterTasks = object.attributes.tasks.toJSON();
//				var that = this;
//				if( officer_json.team_ids!= null ){
//					_.each(object.attributes.team_ids.models, function(team){
//						if( team!=null && team.attributes.tasks != null && 
//								team.attributes.tasks.models.length>0 )
//							that.filterTasks = _.union(that.filterTasks, team.attributes.tasks.toJSON());	
//					})
//				}

			}
        },

        
        render: function() {	
        	this.initEvents();
        	this.initCalendar();          	
        },
        eventClick: function(fcEvent, jsEvent, view) {
            this.eventView.model = app.collections.tasks.get(fcEvent.id);
            this.eventView.render($(jsEvent.currentTarget),this.planning,this.el)
        },
        eventDropOrResize: function(fcEvent) {
            // Lookup the model that has the ID of the event and update its attributes
            this.collection.get(fcEvent.id).save({start: fcEvent.start, end: fcEvent.end});            
        },
        
        copy: function() {
        	console.debug("Copy Event");
        },

        remove: function() {
        	console.debug("Remove Event");
        },

        edit: function() {
        	console.debug("Edit Event");
        },
        
        getColor: function(task) {	
        	var color = 'green';
        	if ( task.team_id )
        		color = 'grey'      
        			
        	switch (task.state) {        	
        		case 'done' :
			    	color = 'purple';
			    	break;
        	}
        	
        	return color;	
        },
                
        initEvents: function() {
        	this.events = [];        	
        	var self = this;
        	
        	_.each(this.filterTasks , function (task, i){
        		var actionDisabled = task.state==app.Models.Task.state[3].value || task.state==app.Models.Task.state[4].value
        		var event = { id: task.id, 
        		              state: task.state,
        		              title: task.name, 
        		              start: task.date_start, 
        		              end: task.date_end, 
        		              planned_hours: task.planned_hours,
        		              total_hours: task.total_hours,
        		              effective_hours: task.effective_hours,
        		              remaning_hours: task.remaining_hours,
        		              allDay:false,
        		              color: self.getColor(task),
        		              editable: true,
        		              disableDragging: actionDisabled,
        		              disableResizing: actionDisabled,
        		             };
        		self.events.push(event);
        	});
        },
        
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
				    week:"'Semaine du' dd [yyyy] {'au' [MMM] dd MMM yyyy}",
				    day: 'dddd dd MMM yyyy'
				},
				columnFormat: {
				    month: 'ddd',
				    week: 'ddd dd/M',
				    day: 'dddd dd/M' 
				},
				axisFormat: 'HH:mm',
//				timeFormat: {
//				    agenda: 'H:mm{ - h:mm}'
//				},
				timeFormat: 'H(:mm){ - H(:mm)}',

//				titleFormat:{
//				    //week: "d { [ MMM] '-' d} MMM yyyy",
//				    week: "'Semaine ' W '<small class=visible-desktop> du' d { [ MMM] 'au' d} MMM yyyy '</small>'",
//				},
				allDayText: 'Journée entière',
				//axisFormat: 'H:mm',
				//timeFormat: 'H:mm',
				slotMinutes: 30,
				firstHour: 8,
				minTime: 8,
				maxTime: 18,
				defaultEventMinutes: 30,
				dragOpacity: 0.5,
				weekends: true,
				droppable: true,
				//disableResizing: false,				
                selectable: true,
                selectHelper: true,
                editable: true,
                ignoreTimezone: false,          
                dragRevertDuration:0,
                eventClick: self.eventClick,
                


                eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) { 
					app.loader('display');
					
				    params = { 
				       date_start: event.start,
				       date_end: event.end,
				    };
				    app.models.task.save(event.id,params,null,null,'#planning');	
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
				    app.models.task.save(event.id,params,null,null,'#planning');
				    $(self.el).fullCalendar('refresh');
				    self.planning.render();
				    app.loader('hide');	
				},
                
				loading: function (bool) { 
				},
				
				eventRender: function(event, element) {
					//$(this.event).css('border-color', 'yellow');
				},


				drop: function( date, allDay) { // this function is called when something is dropped
				    // retrieve the dropped element's stored Event Object
				    var originalEventObject = $(this).data('eventObject');
				
				    // we need to copy it, so that multiple events don't have a reference to the same object
				    var copiedEventObject = $.extend({}, originalEventObject);
				
				    // assign it the date that was reported
				    var dateStart = date;
				    var dateEnd = new Date(date); ;
				    
				    
				    copiedEventObject.start = dateStart;
				    copiedEventObject.end = new Date(dateEnd.setHours( dateEnd.getHours()+copiedEventObject.planned_hours )); 
				    copiedEventObject.dayDelta = 10;
				    copiedEventObject.allDay = true;
				
				    // render the event on the calendar
				    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
				    $(self.el).fullCalendar('renderEvent', copiedEventObject, true);
				    //$(self.el).append('<button type="button" class="close" data-dismiss="close">X</button>');
				    params = { 
		               //id: copiedEventObject.id,
				       state: 'open',
		               date_start: copiedEventObject.start,
		    		   date_end: copiedEventObject.end,
		               planned_hours: copiedEventObject.planned_hours,
		               remaining_hours: copiedEventObject.planned_hours,
				    };
				    
				    if( self.teamMode)
				    	params.team_id = self.id
				    else
				    	params.user_id = self.id
				    
				    //app.models.task.save(copiedEventObject.id, params, null, self, null); 
				    app.models.task.saveTest(copiedEventObject.id, params, {
				    	success: function (data) {
					    	$.pnotify({
					    		title: 'Tâche attribuée',
					    		text: 'La tâche a correctement été attribué à l\'agent.'
						    });
					    	app.collections.tasks.fetch({ 
					    		success: function(){					    	
					    			app.collections.interventions.fetch({ 
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
										         }
										     });
								        }
								   });
							 	}					 
					    	});
				    	}
				    }); 		    
				},				
				eventDragStop: function(event, jsEvent, ui, view) {				    
				},

			});
    	
			// Print button
			$('<span class="fc-button-print">' 
				   +'<button class="btn btn-primary btn-small no-outline " ><i class="icon-print"></i></button></span>')
				  //+('labels', 'Print') + '</span>')
				  .appendTo(self.elStringId + ' td.fc-header-right')
				  .button()
				  .on('click', function() {
					    self.printCalendar();
				  })
				  .before('<span class="fc-header-space">');
			
			//remove vertical scrollbar (http://code.google.com/p/fullcalendar/issues/detail?id=314)
			$('.fc-view-agendaWeek > div > div').css('overflow-y', 'hidden'); $('.fc-agenda-gutter').css('width', 0);
				
			
		},	
		
		renderDate: function (o, date){
			return date.getDate() + "-"+ ( date.getMonth()+1 ) +"-"+ date.getFullYear() +" "
					+ date.getHours() + ":" + ( date.getMinutes()!=0?date.getMinutes():"00" );
	
		},
		
		getIntervention: function (o, intervention) {
			return intervention.name;
		
		},
		
		getPlace: function (o, intervention) {
			console.debug(intervention);
			return intervention.site1!=null?intervention.site1[1]:"";
		
		},
		
		renderResume: function (o, check){
			return "<td class=\"center\"><input type=\"checkbox\"></td>";
		},
		
		renderHours: function (o, value){
			return "<td class=\"center\"><input type=\"text\" size=\"5\" />";
		},
			
		printCalendar: function () {
			var self = this;
			var paperBoard = this.filterTasks[0];//this.collection.toJSON();
			var elementToPrint = $('#printContainer');
			var worker = null
			if ( paperBoard && paperBoard.user_id  )
				worker = $('#worker').val(paperBoard.user_id[1]);
			else if ( paperBoard && paperBoard.team_id  )
				worker = $('#worker').val(paperBoard.team_id[1]);
			var table = $('#paperboard');
			
			var tasks = _.filter(this.filterTasks, function(task){ 
	        	return (
	        			task.date_start < self.el.fullCalendar('getView').visEnd &&
	        			task.date_end > self.el.fullCalendar('getView').visStart &&
	        			(	task.state == app.Models.Task.state[1].value ||
	        				task.state == app.Models.Task.state[2].value
	        			)
	        			
	        		); 
	        });
			
			tasks = _.sortBy(tasks, function(item){ 
			    return item.date_start; 
			});
			
			
		    _.each(tasks, function(task){ 
		    	var inter = task.intervention;
		    	task["inter"] = ( inter!=null)?inter.name:"" ;
		    	task["place"] = ( inter!=null && inter.site1!=null )?inter.site1[1]:"" ;
		    	//task["effective_hours"] = "";
		    	//task["remaining_hous"] = "";
		    	task["done"] = "false";
		    	task["equipment"] = "";
		    	task["oil"] = "";
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
			    "bDeferRender": true,
			    "sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
			    "aoColumns": [
			        {"sInter": "Inter", "mDataProp": "inter", 'sWidth': '5%', 'sClass': "center"},
			        {"sName": "Name", "mDataProp": "name", 'sWidth': '5%', 'sClass': "center"},
			        {"sPlace": "Place", "mDataProp": "place", 'sWidth': '5%', 'sClass': "center"},
			        {"sDateStart": "DateStart", "mDataProp": "date_start","sType": "date", 'sWidth': '25%', 'fnRender': self.renderDate },
			        {"sDateEnd": "DateEnd", "mDataProp": "date_end","sType": "date", 'sWidth': '25%', 'fnRender': self.renderDate},			        
			        { "sWorkingTime": "WorkingTime", "mDataProp": "planned_hours", 'sWidth': '5%'},
			        { "sEffectiveTime": "EffectiveTime", "mDataProp": "effective_hours", 'sWidth': '5%','fnRender': self.renderHours},
			        { "sRemainingTime": "RemainingTime", "mDataProp": "remaining_hours",'sWidth': '5%','fnRender': self.renderHours},
			        { "sDone": "Done", "mDataProp": "done", 'sWidth': '5%','fnRender': self.renderResume},
			        { "sEquipment": "Equipment", "mDataProp": "equipment", 'sWidth': '5%','fnRender': self.renderHours},
			        { "sOil": "oil", "mDataProp": "oil", 'sWidth': '5%', 'sWidth': '5%','fnRender': self.renderHours}],
			
			    "bFilter": false,"bInfo": false,"bPaginate": false,
			    sClass: "center",
			    bRetrieve: true,
			});

			table.fnClearTable();
			if (results.length)
				table.fnAddData(results);
			table.fnDraw();

			elementToPrint.printElement(
//				{
//				    overrideElementCSS:[
//				       'bootstrap.css',
//				       { href:'bootstrap.css',media:'print'}
//				    ]
//				}
			);		
		},
	});
//			var printEl = this.el.clone(true);
//			printEl.find('.fc-agenda-days').height("800");
//			printEl.find('.fc-agenda-slots').height("100");
//			printEl.find('.fc-header-right').css("display", "none")
//			printEl.find('.fc-event-title').append("F");
//			printEl.find('.fc-event-title').append("P");
//			printEl.find('.fc-event-title').append("N");
//			printEl.printElement(
//					{
//		                leaveOpen:true,
//		                printMode:'popup',
//			            overrideElementCSS:[
//			                                'fullcalendar-1.5.4.less',
//			                                { href:'fullcalendar-1.5.4.less',media:'print'}]
//					});
//	
//	
//    // save current calendar width
//    w = $('div#officer_'+printObject_id).css('width');
//
//    // prepare calendar for printing
//    $('div#officer_'+printObject_id).css('width', '6.5in');
//    $('.fc-header').hide();  
//    $('div#officer_'+printObject_id).fullCalendar('render');
//
//    window.print();
//
//    // return calendar to original, delay so the print processes the correct width
//    window.setTimeout(function() {
//        $('.fc-header').show();
//        $('div#officer_'+printObject_id).css('width', w);
//        $('div#officer_'+printObject_id).fullCalendar('render');
//    }, 1000);

    		
//    		   $(this.el).css('width', '6.5in');
//    $('.fc-content .fc-state-highlight').css('background', '#ccc');
//    $(this.el).fullCalendar('render');
//    bdhtml = window.document.body.innerHTML;
//    sprnstr = "<!--startprint-->";
//    eprnstr = "<!--endprint-->";
//    prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17);
//    prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
//    window.document.body.innerHTML =  $(this.el).fullCalendar('render');
//    window.print();
	


//		    var append = false;
//		    var delimiter = "<hr />";
//		    
//		    var domClone = document.getElementById('officer_'+printObject_id).cloneNode(true);
//		
//		    var $printSection = document.getElementById("printSection");
//		
//		    if (!$printSection) {
//		        var $printSection = document.createElement("div");
//		        $printSection.id = "printSection";
//		        document.body.appendChild($printSection);
//		    }
//		
//		    if (append !== true) {
//		        $printSection.innerHTML = "";
//		    }
//		
//		    else if (append === true) {
//		        if (typeof(delimiter) === "string") {
//		            $printSection.innerHTML += delimiter;
//		        }
//		        else if (typeof(delimiter) === "object") {
//		            $printSection.appendChlid(delimiter);
//		        }
//		    }
//		
//		    domClone.id = "printable";
//		    $printSection.appendChild(domClone);
//		    domClone = null;
//		    window.print();

