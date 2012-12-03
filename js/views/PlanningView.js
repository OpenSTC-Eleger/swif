/******************************************
* Login View
*/
app.Views.PlanningView = Backbone.View.extend({


    el : '#rowContainer',
    templateHTML: 'planning', 
    calendarView: 'agendaWeek',

    
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


        // Retrieve the Login template // 
        $.get("templates/" + this.templateHTML + ".html", function(templateData){

            // Change the page title //
            app.router.setPageTitle(app.lang.viewsTitles.planning);
            // Change the Grid Mode of the view //
            app.views.headerView.switchGridMode('fluid');


            console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");
            console.log(app.collections.interventions);


        	var template = _.template(templateData, {
        		lang: app.lang,
        		interventions: app.collections.interventions.toJSON(),
        		officers: app.collections.officers.toJSON()            		
            });

            $(self.el).html(template);
            self.initCalendar();
            self.initDragObject();
            

            $('[data-spy="affix"]').affix();
            $('[data-spy="scroll"], .navListAgents').scrollspy();
            $('*[rel="tooltip"]').tooltip({placement: "left"});

            // Animated Scroll //
            $('ul.nav li a[href^="#"]').click(function(){  
		        var elementID = $(this).attr("href");  
		        
		        $('html, body').animate({  
		            scrollTop:$(elementID).offset().top -5
		        }, 'slow');
		        
		        return false;
		    });

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
    	model = new app.Models.Task();
		model.save(params,			
			{
			    success: function (data) {
			        console.log(data);
			        if(data.error){
			    		app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
			        }
			        else{
			            console.log('Success SAVE REQUEST');
			        }
			    },
			    error: function () {
					console.log('ERROR - Unable to save the Request - RequestDetailsView.js');
			    },           
		},
        false);
    },
    
    	
    initCalendar: function() {
	
    		var self = this;
    		officers = app.collections.officers;    		
    		
		    officers.each(function(o){		    	
		    	self.events = self.getEvents(o.attributes.tasks.toJSON());		    	
		    	var collection = o.attributes.tasks;
		    	new app.Views.EventsView(self,collection,o.attributes.id).render();
		    });
	
    },
    
    getEvents: function(tasks) {
    	events = [];
    	_.each(tasks, function (task, i){
    		var event = { id: task.id, title: task.name, start: task.date_start, end: task.date_end, allDay:false};
    		events.push(event);
    	});
    	return events;
    },

    initDragObject: function() {
    	tasks = app.collections.tasks.toJSON();
    	_.each(tasks, function (task, i){
    		el = $('li#task_'+task.id);
			var eventObject = {
			        id: task.id,
					title: task.name, // use the element's text as the event title
					user_id: task.user_id[0],
					planned_hours: task.planned_hours,
					total_hours: task.total_hours,
					effective_hours: task.effective_hours,
					remaining_hours: task.remaining_hours,
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
    }  
});

