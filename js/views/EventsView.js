openstm.Views.EventsView = Backbone.View.extend({
        initialize: function(el,collection){
			this.el = el;
			this.collection = collection;
            _.bindAll(this); 

            this.collection.bind('reset', this.addAll);
            this.collection.bind('add', this.addOne);
            this.collection.bind('change', this.change);            
            this.collection.bind('destroy', this.destroy);
            
            this.eventView = new openstm.Views.EventView();            
        },
        
        initEvents: function() {
        	this.events = [];
        	var self = this;
        	
        	_.each(this.collection.toJSON(), function (task, i){
        		var event = { id: task.id, title: task.name, start: task.date_start, end: task.date_end};
        		self.events.push(event);
        	});
        },
        
        render: function() {
	
        	this.initEvents();
        	self = this;
            this.el.fullCalendar({
              events: self.events,
            	
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                selectable: true,
                selectHelper: true,
                editable: true,
                ignoreTimezone: false,                
                select: this.select,
                eventClick: this.eventClick,
                eventDrop: this.eventDropOrResize,        
                eventResize: this.eventDropOrResize
            });
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
        eventClick: function(fcEvent) {
            this.eventView.model = this.collection.get(fcEvent.id);
            this.eventView.render()
        },
        change: function(event) {
            // Look up the underlying event in the calendar and update its details from the model
            var fcEvent = this.el.fullCalendar('clientEvents', event.get('id'))[0];
            fcEvent.title = event.get('title');
            fcEvent.color = event.get('color');
            this.el.fullCalendar('updateEvent', fcEvent);           
        },
        eventDropOrResize: function(fcEvent) {
            // Lookup the model that has the ID of the event and update its attributes
            this.collection.get(fcEvent.id).save({start: fcEvent.start, end: fcEvent.end});            
        },
        destroy: function(event) {
            this.el.fullCalendar('removeEvents', event.id);         
        }        
    });













//	        	self = this;
//            this.el.fullCalendar({
//              events: self.events,
//            	
//			        defaultView: 'agendaWeek',
//			        aspectRatio: 1.30,
//			        header: {
//			            left: 'infosUser',
//			            center: 'title',
//			            right: 'today,prev,next'
//			        },
//			        titleFormat:{
//			            //week: "d { [ MMM] '-' d} MMM yyyy",
//			            week: "'Semaine ' W '<small class=hidden-phone> du' d { [ MMM] 'au' d} MMM yyyy '</small>'",
//			        },
//			        allDayText: 'Journée entière',
//			        axisFormat: 'H:mm',
//			        timeFormat: 'H:mm',
//			        slotMinutes: 120,
//			        firstHour: 8,
//			        minTime: 8,
//			        maxTime: 18,
//			        defaultEventMinutes: 120,
//			        dragOpacity: 0.5,
//			        weekends: true,
//			        editable: true,
//			        droppable: true,
//			        disableResizing: true,
//			        eventColor: '#378006',
//			        eventRender: function(evt, element){
//			            console.debug(element);
//			
//			 
//			            
//			        },
//			        drop: function( date, allDay) { // this function is called when something is dropped
//			
//			            // retrieve the dropped element's stored Event Object
//			            var originalEventObject = $(this).data('eventObject');
//			
//			            // we need to copy it, so that multiple events don't have a reference to the same object
//			            var copiedEventObject = $.extend({}, originalEventObject);
//			
//			            // assign it the date that was reported
//			            copiedEventObject.start = date;
//			            copiedEventObject.allDay = allDay;
//			
//			            // render the event on the calendar
//			            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
//			            $(self.el).fullCalendar('renderEvent', copiedEventObject, true);
//			            params = { 
//			                       task_id: copiedEventObject.id,
//			            		   date_end: date,
//			                       date_start: date,
//			                       planned_hours: 2,
//			                       user_id: 2,
//			            };
//			            self.save(params);
//			
//			            $.pnotify({
//					        title: 'Tâche attribuée',
//					        text: 'La tâche a correctement été attribué à l\'agent.'
//					    });
//
//			
//			            $(this).remove();     
//			        },
//			        
//
//
//
//			     });
