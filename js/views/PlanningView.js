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
        	//openstm.collections.interventions.search();


        	var template = _.template(templateData, {
            		lang: openstm.lang,
            		tasks: openstm.collections.tasks.toJSON(),
            		interventions: openstm.collections.interventions.toJSON(),
            		officers: openstm.collections.officers.toJSON()            		
            });
            $(self.el).html(template);
            self.initCalendar();
            self.initDragObject();
            $('[data-spy="affix"]').affix();
            $('[data-spy="scroll"], .navUser').scrollspy();

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
		    	self.events = self.getEvents(o.attributes.tasks.toJSON());		    	
		    	var collection = o.attributes.tasks;
		    	new openstm.Views.EventsView($('div#officer_'+o.attributes.id),
		    		collection,o.attributes.id).render();
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
    	tasks = openstm.collections.tasks.toJSON();
    	_.each(tasks, function (task, i){
    		el = $('li#task_'+task.id);
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
    }  
});

