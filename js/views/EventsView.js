app.Views.EventsView = Backbone.View.extend({
	
//		events: {
//		    "submit form": "save"
//		},
	
	
        initialize: function(planning,collection,officer_id){
			this.planning = planning;
			this.el = $('div#officer_'+officer_id);
			this.collection = collection;
			this.officer_id = officer_id;
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
				titleFormat:{
				    //week: "d { [ MMM] '-' d} MMM yyyy",
				    week: "'Semaine ' W '<small class=visible-desktop> du' d { [ MMM] 'au' d} MMM yyyy '</small>'",
				},
				allDayText: 'Journée entière',
				axisFormat: 'H:mm',
				timeFormat: 'H:mm',
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

                eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) { 
					app.loader('display');
					
				    params = { 
				       date_start: event.start,
				       date_end: event.end,
				    };
				    app.models.task.save(event.id,params);	
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
				    app.models.task.save(event.id,params);
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
				       state: 'pending',
		               date_start: copiedEventObject.start,
		    		   date_end: copiedEventObject.end,		               
		               planned_hours: copiedEventObject.planned_hours,
		               total_hours: copiedEventObject.total_hours,
		               remaining_hours: copiedEventObject.remanning_hours,
		               user_id: self.officer_id
				    };
				    
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
    	}
    });
