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
        'click button.saveTaskPlanning' : 'saveTask',
        
        'click .btn.pull-right'    : 'scheduledInter',
    },


    /** View Initialization
    */
    initialize : function(user) {
        console.log('Planning view');
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
            
            
           
            var that = this;
            //Filter Agents : all agents belongs to user's services
            var officers = app.collections.officers.toJSON();        	
        	_.each(app.models.user.attributes.service_ids,function (user_service_id){
        		var agentsKeeped = _.filter(officers, function(item,i){             	
        			var service = _.filter(item.service_ids,function (service_id){            		
        				return service_id == user_service_id;
        			}); 
        			return service.length != 0
        		});
        		if ( that.agents == null )
        			that.agents = agentsKeeped;
        		else {
        			that.agents = _.union(that.agents, agentsKeeped);
        		}
        	}); 
        	
        	//Filter Teams : all teams belongs to user's services
        	var teams = app.collections.teams.toJSON();
        	var that = this;
        	_.each(app.models.user.attributes.service_ids,function (user_service_id){
        		var teamsKeeped = _.filter(teams, function(item,i){             	
        			var service = _.filter(item.service_ids,function (service_id){            		
        				return service_id == user_service_id;
        			}); 
        			return service.length != 0
        		});
        		if ( that.teams == null )
        			that.teams = teamsKeeped;
        		else {
        			that.teams = _.union(that.teams, teamsKeeped);
        		}
        	}); 

        	//remove admin
        	if ( that.agents!=null && that.agents.length > 0 )
        		that.agents = _.without(that.agents,that.agents[0]);
        	
            var interventions = app.collections.interventions.models;
            console.log(app.collections.interventions);
            
            //Keep only inetrvention not planned
            interventions = _.filter(interventions,function (intervention){    
            	var inter = intervention.toJSON();
				return (inter.state == app.Models.Intervention.state[0].value ||
						inter.state == app.Models.Intervention.state[1].value)
			});
            
           //Order by date start 
            var interventionsSortedArray = _.sortBy(interventions, function(item){ 
                    	return item.attributes.date_start; 
            });
            
            interventionSorted = new app.Collections.Interventions(interventionsSortedArray);

            var template = _.template(templateData, {
        		lang: app.lang,
        		interventions: interventionSorted.toJSON(),
        		officers: that.agents,
        		teams: that.teams,
            });

            $(self.el).html(template);
            self.initAllCalendars();
            self.initDragObject();

            $('*[data-spy="affix"]').affix();            
            $('*[rel="tooltip"]').tooltip({placement: "left"});

            $('#listAgents li a').click(function(){
                $('#listAgents li.active').removeClass('active');
                $(this).parent('li').addClass('active');
            })
            
            $('#listTeams li a').click(function(){
                $('#listTeams li.active').removeClass('active');
                $(this).parent('li').addClass('active');
            })
            
        });
       
        return this;
    },



    /** Set a user model to the view
    */
    setModel : function(model) {
        this.model = model;
        return this;
    },    
    	
    initAllCalendars: function() {    		
    		var self = this;
    		teams = app.collections.teams;    		
    		
			teams.each(function(t){	
				//var team_json = t.toJSON();	
				//var allTasks = team_json.tasks;
				//var collection = t.attributes.tasks;
				new app.Views.EventsView(self,t,true).render();
			});

    		officers = app.collections.officers;    		
    		
			officers.each(function(o){	
//				var officer_json = o.toJSON();
//				var allTasks = officer_json.tasks;					
//				if( officer_json.belongsToTeam!= null && officer_json.belongsToTeam.tasks!=null )
//					allTasks = _.union(officer_json.tasks, officer_json.belongsToTeam.tasks.toJSON());	
//				var collection = new app.Collections.Tasks(allTasks);
				new app.Views.EventsView(self,o,false).render();
			});

	
    },

    /** Make the external event Draggable
    */
    initDragObject: function() {
    	tasks = app.collections.tasks.toJSON();
    	
        _.each(tasks, function (task, i){

    		el = $('li#task_'+task.id+':not(.disabled)');

            var eventObject = {
                state: task.state,
                id: task.id,
				title: task.name,
				//user_id: task.user_id[0],
				planned_hours: task.planned_hours,
				total_hours: task.total_hours,
				effective_hours: task.effective_hours,
				remaining_hours: task.remaining_hours,
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


    scheduledInter: function(e) {
		var self = this;
		
		var intervention = $(e.target);
		var id = _(intervention.parents('.accordion-body').attr('id')).strRightBack('_');
		
		params = {
				state: app.Models.Intervention.state[1].value,
		};
		
		app.models.intervention.save(id,params,null,this);	
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
	     
	    app.models.task.save(0,params,$('#modalAddTask'), this, "#planning");
   },



});

