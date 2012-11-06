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
         
            var template = _.template(templateData, {lang: openstm.lang, interventions: openstm.collections.interventions.toJSON()});
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
    
    	
    initCalendar: function() {
            // Calendrier //
		    $('div.calendar').each(function(){
		    	
		    	$(this).fullCalendar({
			       // height: 660,
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
			        drop: function(date, allDay) { // this function is called when something is dropped
			
			            // retrieve the dropped element's stored Event Object
			            var originalEventObject = $(this).data('eventObject');
			
			            // we need to copy it, so that multiple events don't have a reference to the same object
			            var copiedEventObject = $.extend({}, originalEventObject);
			
			            // assign it the date that was reported
			            copiedEventObject.start = date;
			            copiedEventObject.allDay = allDay;
			
			            // render the event on the calendar
			            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
			            $('.calendar').fullCalendar('renderEvent', copiedEventObject, true);
			
			            $.pnotify({
					        title: 'Tâche attribuée',
					        text: 'La tâche a correctement été attribué à l\'agent.'
					    });
			
			            $(this).remove();     
			        }
			     });
		    });
	
    },

    initDragObject: function() {	  
	    $('li.external-event').each(function() {
		
			// create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
			// it doesn't need to have a start or end
			var eventObject = {
					title: $.trim($(this).text()) // use the element's text as the event title
			};
			
			// store the Event Object in the DOM element so we can get to it later
			$(this).data('eventObject', eventObject);
			
			// make the event draggable using jQuery UI
			$(this).draggable({
			    zIndex: 9999,
			    revert: true,
			    revertDuration: 0,
			    appendTo: 'div.container-fluid',
			    opacity: 0.5  //  original position after the drag
			});
		
		});
	
    }
  
});




