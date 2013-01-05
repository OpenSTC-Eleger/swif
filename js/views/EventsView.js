app.Views.EventsView = Backbone.View.extend({
	
		events: {

			//'click .btn.printCalendar'    : 'printCalendar',
		},
	
	
        initialize: function(planning,collection,id,teamMode){
			this.teamMode = teamMode;
			this.planning = planning;
			if (this.teamMode) 
				this.elStringId = 'div#team_'+id;				
			else
				this.elStringId = 'div#officer_'+id;
				
			this.el = $(this.elStringId);
			this.collection = collection;
			this.id = id;
            _.bindAll(this); 

            this.collection.bind('reset', this.addAll);
            this.collection.bind('add', this.addOne);
            this.collection.bind('change', this.change);            
            this.collection.bind('destroy', this.destroy);
            
            this.eventView = new app.Views.EventView();            
        },

        
        render: function() {	
        	this.initEvents();
        	this.initCalendar();          	
        },
        		
        addAll: function() {
            this.el.fullCalendar('addEventSource', this.collection.toJSON());
        },
        addOne: function(event) {
            this.el.fullCalendar('renderEvent', event.toJSON());
        },        
        select: function(startDate, endDate) {
            this.eventView.collection = this.collection;
            this.eventView.model = new Event({start: startDate, end: endDate});
            this.eventView.render();            
        },
        eventClick: function(fcEvent, jsEvent, view) {
        	var self = this;
            this.eventView.model = this.collection.get(fcEvent.id);
            this.eventView.render($(jsEvent.currentTarget),this.el.fullCalendar)
        },
        change: function(event) {
            // Look up the underlying event in the calendar and update its details from the model
            var fcEvent = this.el.fullCalendar('clientEvents', event.get('id'))[0];
            fcEvent.planned_hours = event.get('planned_hours');
            fcEvent.remaining_hours = event.get('remaining_hours');
            //this.el.fullCalendar('updateEvent', fcEvent);           
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
        
        getColor: function(state) {	
        	var color = 'green';
        	switch (state) {        	
        		case 'done' :
			    	color = 'purple';
			    	break;
			    	
//				case 'pending' :
//			    	color = 'blue';
//			    	break;
//			    	
//			    case 'open' :
//			    	color = '#FFCCFF';
//			    	break;
//			    	
//			    case 'cancelled' :
//			    	color = '#CCFFCC';
//			    	break;
//			
//			    case 'draft' :
//			    	color = 'LemonChiffon';
//			    	break;
        	}
        	return color;	
        },
                
        initEvents: function() {
        	this.events = [];
        	var self = this;
        	
        	_.each(this.collection.toJSON(), function (task, i){
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
        		              color: self.getColor(task.state)
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
				disableResizing: false,				
                selectable: true,
                selectHelper: true,
                editable: true,
                ignoreTimezone: false,          
                dragRevertDuration:0,
                eventClick: this.eventClick,
                
				eventClick: function(calEvent, jsEvent, view) {
					return false;
				},

                eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) { 
					app.loader('display');
					
				    params = { 
				       date_start: event.start,
				       date_end: event.end,
				    };
				    app.models.task.save(event.id,params,null,null,'#planning');	
					//self.save(event.id,params);	
				    $(self.el).fullCalendar('refresh');
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
				    copiedEventObject.allDay = allDay;
				
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
				    
				    app.models.task.save(copiedEventObject.id, params, null, null, "#planning"); 
				    //self.save(copiedEventObject.id,params);
				
				    $.pnotify({
				        title: 'Tâche attribuée',
				        text: 'La tâche a correctement été attribué à l\'agent.'
					    });
				    //$(this).remove();  				    
				},
				
//				select: function( startDate, endDate, allDay) {
//					console.debug('Event Select');
//				},
				
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
		
		renderResume: function (o, check){
			return "<td class=\"center\"><input type=\"checkbox\"></td>";
		},
		
		renderHours: function (o, check){
			return "<td class=\"center\"><input type=\"text\" size=\"5\"/></td>";
		},
			
		printCalendar: function () {
			var self = this;
			var paperBoard = this.collection.toJSON();
			var elementToPrint = $('#printContainer');
			var worker = null
			if ( paperBoard[0].user_id )
				worker = $('#worker').val(paperBoard[0].user_id[1]);
			else
				worker = $('#worker').val(paperBoard[0].team_id[1]);
			var table = $('#paperboard');
			
			var tasks = _.filter(self.collection.toJSON(), function(task){ 
	        	return (
	        			task.date_start < self.el.fullCalendar('getView').visEnd &&
	        			task.date_end > self.el.fullCalendar('getView').visStart &&
	        			(	task.state == app.Models.Task.state[1].value ||
	        				task.state == app.Models.Task.state[2].value
	        			)
	        			
	        		); 
	        });
		    _.each(tasks, function(task){ 
		    	task["done"] = "false";
		    	task["notdone"] = "false";
		    	task["pending"] = "false";
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
			        {"sInter": "Inter", "mDataProp": "intervention", 'sWidth': '5%', 'sClass': "center", 'fnRender': self.getIntervention},
			        {"sName": "Name", "mDataProp": "name", 'sWidth': '5%', 'sClass': "center"},
			        {"sDateStart": "DateStart", "mDataProp": "date_start","sType": "date", 'sWidth': '25%', 'fnRender': self.renderDate },
			        {"sDateEnd": "DateEnd", "mDataProp": "date_end","sType": "date", 'sWidth': '25%', 'fnRender': self.renderDate},
			        { "sDone": "Done", "mDataProp": "done", 'sWidth': '5%','fnRender': self.renderResume},
			        { "sNotDone": "NotDone", "mDataProp": "notdone", 'sWidth': '5%','fnRender': self.renderResume},
			        { "sPending": "Pending", "mDataProp": "pending", 'sWidth': '5%','fnRender': self.renderResume},
			        { "sWorkingTime": "WorkingTime", "mDataProp": "planned_hours", 'sWidth': '5%','fnRender': self.renderHours},
			        { "sRemainingTime": "RemainingTime", "mDataProp": "remaining_hours",'sWidth': '5%','fnRender': self.renderHours}],
			
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

