/******************************************
* Login View
*/
openstm.Views.PlanningView = Backbone.View.extend({


    el : '#rowContainer',

    templateHTML: 'planning',
    

    
    // The DOM events //
    events: {

    },



    /** View Initialization
    */
    initialize : function(user) {
        console.log('Planning view');
        this.render();

    },



    /** Display the view
    */
    render : function() {
        var self = this;

        // Change the page title //
        openstm.router.setPageTitle(openstm.lang.viewsTitles.planning);

        // Retrieve the Login template // 
        $.get("templates/" + this.templateHTML + ".html", function(templateData){
         
            
        	//var tasks = openstm.collections.tasks.search();
        	openstm.collections.interventions.search();

        	var template = _.template(templateData, {
            		lang: openstm.lang,
            		tasks: openstm.collections.tasks.toJSON(),
            		interventions: openstm.collections.interventions.toJSON(),
            		officers: openstm.collections.officers.toJSON()            		
            });
            $(self.el).html(template);
            self.initCalendar();
            self.initDragObject();
        });

        return this;
    },



    /** Set a user model to the view
    */
    setModel : function(model) {
        this.model = model;
        return this;
    },
    
    save: function(params) {
    	model = new openstm.Models.Task();
		model.save(params,			
			{
			    success: function (data) {
			        console.log(data);
			        if(data.error){
			    		openstm.notify('', 'error', openstm.lang.errorMessages.unablePerformAction, openstm.lang.errorMessages.sufficientRights);
			        }
			        else{
			            console.log('Success SAVE REQUEST');
			        }
			    },
			    error: function () {
					console.log('ERROR - Unable to save the Request - RequestDetailsView.js');
			    },           
		},false);
    },
    
    	
    initCalendar: function() {
	
    		var self = this;
    		officers = openstm.collections.officers;    		
    		
		    officers.each(function(o){
		    	
		    	//self.tasks = 
//		    	view = new openstm.Views.EventsView($('div#officer_'+o.attributes.id),
//		    		collection);
//		    	collection.fetch();
//		    	view.render();
		    	self.events = self.getEvents(o.attributes.tasks.toJSON());

		    	$('div#officer_'+o.attributes.id).fullCalendar({
		    		events: self.events,
			        defaultView: 'agendaWeek',
			        aspectRatio: 1.30,
			        header: {
			            left: 'infosUser',
			            center: 'title',
			            right: 'today,prev,next'
			        },
			        titleFormat:{
			            //week: "d { [ MMM] '-' d} MMM yyyy",
			            week: "'Semaine ' W '<small class=hidden-phone> du' d { [ MMM] 'au' d} MMM yyyy '</small>'",
			        },
			        allDayText: 'Journée entière',
			        axisFormat: 'H:mm',
			        timeFormat: 'H:mm',
			        slotMinutes: 120,
			        firstHour: 8,
			        minTime: 8,
			        maxTime: 18,
			        defaultEventMinutes: 120,
			        dragOpacity: 0.5,
			        weekends: true,
			        editable: true,
			        droppable: true,
			        disableResizing: true,
			        eventColor: '#378006',
			        eventRender: function(evt, element){
			            console.debug(element);
			
			 
			            
			        },
			        drop: function( date, allDay) { // this function is called when something is dropped
			
			            // retrieve the dropped element's stored Event Object
			            var originalEventObject = $(this).data('eventObject');
			
			            // we need to copy it, so that multiple events don't have a reference to the same object
			            var copiedEventObject = $.extend({}, originalEventObject);
			
			            // assign it the date that was reported
			            copiedEventObject.start = date;
			            copiedEventObject.allDay = allDay;
			
			            // render the event on the calendar
			            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
			            $('div#officer_'+o.attributes.id).fullCalendar('renderEvent', copiedEventObject, true);
			            params = { 
			                       task_id: copiedEventObject.id,
			            		   date_end: date,
			                       date_start: date,
			                       planned_hours: copiedEventObject.planned_hours,
			                       user_id: o.attributes.id
			            };
			            self.save(params);
			
			            $.pnotify({
					        title: 'Tâche attribuée',
					        text: 'La tâche a correctement été attribué à l\'agent.'
					    });

			
			            $(this).remove();     
			        },
			     });
		    	
//		    	o.tasks.each(function(t){
//		    		$('div#'+o.attributes.login).fullCalendar('renderEvent',t);
//		    	}


		    });
	
    },
    
    getEvents: function(tasks) {
    	events = [];
    	_.each(tasks, function (task, i){
    		var event = { id: task.id, title: task.name, start: task.date_start, end: task.date_end};
    		events.push(event);
    	});
    	return events;
    },

    initDragObject: function() {
    	tasks = openstm.collections.tasks.toJSON();
    	_.each(tasks, function (task, i){
    	//tasks.each(function(task){
    		el = $('li#task_'+task.id);
    		// create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
			// it doesn't need to have a start or end
			var eventObject = {
			        id: task.id,
					title: task.name, // use the element's text as the event title
					user_id: task.user_id[0],
					planned_hours: task.planned_hours                                                                                   ,
			};
			
			// store the Event Object in the DOM element so we can get to it later
			el.data('eventObject', eventObject);
			
			// make the event draggable using jQuery UI
			el.draggable({
			    zIndex: 9999,
			    revert: true,
			    revertDuration: 0,
			    appendTo: 'div.container-fluid',
			    opacity: 0.5,  //  original position after the drag
			    
			    reverting: function() {
					console.log('reverted');
				},
			

			});

    	});
	
//	    $('li.external-event').each(function() {
//		
//			// create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
//			// it doesn't need to have a start or end
//			var eventObject = {
//					title: $.trim($(this).text()) // use the element's text as the event title
//			};
//			
//			// store the Event Object in the DOM element so we can get to it later
//			$(this).data('eventObject', eventObject);
//			
//			// make the event draggable using jQuery UI
//			$(this).draggable({
//			    zIndex: 9999,
//			    revert: true,
//			    revertDuration: 0,
//			    appendTo: 'div.container-fluid',
//			    opacity: 0.5,  //  original position after the drag
//			    
//			    reverting: function() {
//					console.log('reverted');
//				},
//			
//
//			});
//		
//		});
	    
	    //scroll interventions and officers
	    $('[data-spy="affix"]').affix()
	    
	    // Animated Scroll //
	    $('ul.nav li a[href^="#"]').click(function(){  
	        var elementID = $(this).attr("href");  
	        
	        $('html, body').animate({  
	            scrollTop:$(elementID).offset().top -5
	        }, 'slow');
	        
	        return false;
	    });
	
    }
  
});

//            // Calendrier //
//		    $('div.calendar').each(function(){
//		    	
//		    	$(this).fullCalendar({
//			       // height: 660,
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
//			        drop: function(date, allDay) { // this function is called when something is dropped
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
//			            $('.calendar').fullCalendar('renderEvent', copiedEventObject, true);
//			
//			            $.pnotify({
//					        title: 'Tâche attribuée',
//					        text: 'La tâche a correctement été attribué à l\'agent.'
//					    });
//			
//			            $(this).remove();     
//			        }
//			     });
//		    });




