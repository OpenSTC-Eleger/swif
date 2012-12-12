/******************************************
* Login View
*/
app.Views.PlanningView = Backbone.View.extend({


    el : '#rowContainer',
    templateHTML: 'planning', 
    calendarView: 'agendaWeek',

    selectedInter : '',
    selectedTask : '',
    
    //task: app.Models.Task.getCurrentTask(),
    
    // The DOM events //
    events: {
        'click a.modalDeleteInter'  : 'setInfoModal',
        'click a.modalDeleteTask'   : 'setInfoModal',

        'click button.btnDeleteInter'  : 'deleteInter',
        'click button.btnDeleteTask'   : 'deleteTask',
        	
        'click .btn.addTaskPlanning'    : 'displayFormAddTask',
        'click button.saveTaskPlanning'       : 'saveTask'
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

            var interventions = app.collections.interventions.models;
            console.log(app.collections.interventions);

            var interventionsSortedArray = _.sortBy(interventions, function(item){ 
                    	return item.attributes.date_start; 
            });
            
            interventionSorted = new app.Collections.Interventions(interventionsSortedArray);

        	var template = _.template(templateData, {
        		lang: app.lang,
        		interventions: interventionSorted.toJSON(),
        		officers: app.collections.officers.toJSON()            		
            });

            $(self.el).html(template);
            self.initCalendar();
            self.initDragObject();
            

            $('[data-spy="affix"]').affix();
            $('[data-spy="scroll"], #listAgents').scrollspy();
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
		app.models.task.save(params,			
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



    /** Make the external event Draggable
    */
    initDragObject: function() {
    	tasks = app.collections.tasks.toJSON();
    	
        _.each(tasks, function (task, i){

    		el = $('li#task_'+task.id+':not(.disabled)');

            var eventObject = {
                id: task.id,
				title: task.name,
				user_id: task.user_id[0],
				planned_hours: 0.5,
				total_hours: 0,
				effective_hours: 0,
				remaining_hours: 0.5,
			};
			
			// Store the Event Object in the DOM element so we can get to it later //
			el.data('eventObject', eventObject);
			
			// Make the event draggable using jQuery UI //
			el.draggable({
			    zIndex: 9999,
			    revert: true,
			    revertDuration: 500,
			    appendTo: '#app',
			    opacity: 0.5,
			    
			    reverting: function() {
					console.log('reverted');
				},
			});

    	});	
    },



    /** Display information in the Modal view
    */
    setInfoModal: function(e){
        
        // Retrieve the ID of the intervention //
        var link = $(e.target);
        
  
        if(link.attr('href') == "#modalDeleteInter"){

            var id = _(link.parent('p').siblings('a').attr('href')).strRightBack('_');
            
            this.selectedInter = _.filter(app.collections.interventions.models, function(item){ return item.attributes.id == id });
            this.selectedInter = this.selectedInter[0].toJSON();

            $('#infoModalDeleteInter p').html(this.selectedInter.name);
            $('#infoModalDeleteInter small').html(this.selectedInter.description);
        }
        else if(link.attr('href') == "#modalDeleteTask"){        
            
            var id = _(link.parent('p').parent('li').attr('id')).strRightBack('_');

            this.selectedTask = _.filter(app.collections.tasks.models, function(item){ return item.attributes.id == id });
            this.selectedTask = this.selectedTask[0].toJSON();

            $('#infoModalDeleteTask p').html(this.selectedTask.name);
            $('#infoModalDeleteTask small').html(this.selectedTask.description);

            console.debug(this.selectedTask[0]);
        }

    },



    /** Delete intervention
    */
    deleteInter: function(e){
        alert('TODO - Delete Intervention with ID ' + + this.selectedInter.id);
    },


    /** Delete task
    */
    deleteTask: function(e){
        alert('TODO - Delete Task with ID ' + this.selectedTask.id);

    },
    
    /** Display the form to add a new Task
    */
    displayFormAddTask: function(e){
    	
		app.views.selectListAssignementsView = new app.Views.DropdownSelectListView({el: $("#taskCategory"), collection: app.collections.categories})
		app.views.selectListAssignementsView.clearAll();
		app.views.selectListAssignementsView.addEmptyFirst();
		app.views.selectListAssignementsView.addAll();
        
        // Retrieve the ID of the intervention //
        this.pos = e.currentTarget.id;
        $('#modalAddTask').modal();
   },
    
    
    /** Save the Task
    */
    saveTask: function(e){
    	 var self = this;

		e.preventDefault();
		
		 
		 input_category_id = null;
	     if( app.views.selectListAssignementsView != null )
	    	 input_category_id = app.views.selectListAssignementsView.getSelected().toJSON().id;

	     var params = {
	         project_id: this.pos,
	         name: this.$('#taskName').val(),
	         category_id: input_category_id,	         
		     planned_hours: this.$('#taskHour').val(),
	     };

	    app.models.task.save(0,params,{
            beforeSend: function(){
	            app.loader('display');
	        },
        	complete: function(){
        	    app.loader('hide');
        	},
			success: function (data) {
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					$('#modalAddTask').modal('hide');        	
        	
					 	app.collections.tasks.fetch({  
					 		success: function(){						 	
						 		app.collections.interventions.fetch({
					                success: function(){						 		
										route = Backbone.history.fragment;
										app.router.navigate('#planning',  {'trigger': true, replace: true});	
										self.initialize();
							 		}					 
						 		});
					 		}					 
				 		});
						 		

					console.log('Success SAVE TASK');
				}
			},
			error: function () {
				console.log('ERROR - Unable to save the Request - RequestDetailsView.js');
			},	     
		});
   }


});

