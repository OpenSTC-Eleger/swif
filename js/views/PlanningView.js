/******************************************
* Planning View
*/
app.Views.PlanningView = Backbone.View.extend({


    el : '#rowContainer',

    templateHTML: 'planning',

    filters: 'interventionsListFilter',

    calendarView: 'agendaWeek',
    
    selectedInter : '',
    selectedTask : '',

    sstoragePlanningSelected: 'selectedPlanning',
    
    //task: app.Models.Task.getCurrentTask(),
    
    // The DOM events //
    events: {
        'click .buttonCancelInter'                     : 'setInfoModalCancelInter',
        'click .modalDeleteTask'                       : 'setInfoModalDeleteTask',

        'click button.linkToInter'                      : 'linkToInter',

        'submit #formCancelInter'                       : 'cancelInter',
        'click button.btnDeleteTask'                    : 'deleteTask',
        	
        'click .btn.addTaskPlanning'                    : 'displayFormAddTask',
        'click .btn.addInterventionPlanning'            : 'displayFormAddIntervention',
        
        'submit #formAddTask'         			        : 'saveTask',   
        'submit #formAddIntervention' 			        : 'saveIntervention', 
        'switch-change .calendarSwitch'                 : 'scheduledInter',
        'switch-change #switchWithForeman'              : 'setForemanInTeam',

        
        'change #interventionDetailService'             : 'fillDropdownService',
        
        'click #filterStateInterventionList li:not(.disabled) a' 	: 'setFilter',

        'click #listAgents li a, #listTeams li a'       :          'selectPlanning',

        'click #btnRemoveTask'                          : 'removeTaskFromSchedule'
    },


    /** View Initialization
    */
    initialize : function(agent) {
    	this.agent = agent;  
    	
    	//_.bindAll(this, 'beforeRender', 'render', 'afterRender'); 

    	var self = this;
//    	this.render = _.wrap( this.render, function(render){
//    		self.beforeRender();
//    		render(); //arguments[1]
//    		self.afterRender();
//    		return self;
//    	} ) 
        console.log('Planning view');
    },



    beforeRender : function()  {
    	app.loader('display');
    },



    afterRender : function()  {
    	app.loader('hide');
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
            var officers = app.collections.officers.models;

        	_.each(app.models.user.attributes.service_ids,function (user_service_id){
        		var agentsKeeped = _.filter(officers, function(officer,i){

                    // Don't display the DST if the user is not the DST //
                    if(!app.models.user.isDST()){
                        if(!officer.isDST()){
                            officer = officer.toJSON();

                            var service = _.filter(officer.service_ids,function (service_id){
                				return service_id.id == user_service_id;
                			}); 
                			return service.length != 0
                        }
                    }
                    else{
                        officer = officer.toJSON();

                        var service = _.filter(officer.service_ids,function (service_id){
                            return service_id.id == user_service_id;
                        }); 
                        return service.length != 0
                    }
        		});
        		if ( that.agents == null )
        			that.agents = agentsKeeped;
        		else {
        			that.agents = _.union(that.agents, agentsKeeped);
        		}
        	});


            // Transform officer model to JSON object for the template //
            var officers = [];
            _.each(that.agents, function(item){
                officers.push(item.toJSON());
            })

        	
        	//Filter Teams : all teams belongs to user's services
        	var teams = app.collections.teams.toJSON();
        	var that = this;
        	_.each(app.models.user.attributes.service_ids,function (user_service_id){
        		var teamsKeeped = _.filter(teams, function(item,i){             	
        			var service = _.filter(item.service_ids,function (service_id){            		
        				return service_id.id == user_service_id;
        			}); 
        			return service.length != 0
        		});
        		if ( that.teams == null )
        			that.teams = teamsKeeped;
        		else {
        			that.teams = _.union(that.teams, teamsKeeped);
        		}
        	}); 


            var interventions = app.collections.interventions.models;


            // Filter Intervention - Just retrieve Schedule, to Schedule and Template State //
            /*var interventions = _.filter(interventions, function(item){
                return (item.toJSON().state == app.Models.Intervention.state[0].value || item.toJSON().state == app.Models.Intervention.state[1].value || item.toJSON().state == app.Models.Intervention.state[5].value);
            });*/

            
            // Collection Filter if not null / Otherwise we display only To Schedule interventions //
			if(sessionStorage.getItem(self.filters) != null){
				var interventions = _.filter(interventions, function(item){ 
					var itemJSON = item.toJSON();
					return itemJSON.state == sessionStorage.getItem(self.filters);
				});
			}
            else{
                sessionStorage.setItem(self.filters, app.Models.Intervention.state[1].value);
                var interventions = _.filter(interventions, function(item){ 
                    return item.toJSON().state == app.Models.Intervention.state[1].value;
                });
            }


            interventionSorted = new app.Collections.Interventions(interventions);


            // Set variables template //
            var template = _.template(templateData, {
        		lang: app.lang,
        		interventionsState: app.Models.Intervention.state,
        		interventions: interventionSorted.toJSON(),
        		officers: officers,
        		teams: that.teams,
            });

            $(self.el).html(template);
            self.initAllCalendars();
            self.initDragObject();

            $('*[rel="tooltip"]').tooltip();
            $('*[rel="popover"]').popover({trigger: 'hover', delay: { show: 500, hide: 100 }});

            $('.switch').bootstrapSwitch();

            $('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});


            // Set the focus to the first input of the form //
            $('#modalAddInter, #modalAddTask').on('shown', function (e) {
                $(this).find('input').first().focus();
            })



            // If a plannig was Selected //
            if(sessionStorage.getItem(self.sstoragePlanningSelected) != null){
                
                // Get the planning ID //
                var id = sessionStorage.getItem(self.sstoragePlanningSelected);

                // Simule a click to the link //
                $('#'+id).click();

                // Check if a Team was selected to select the Team Tab //
                if(_.str.include(id, 'Team')){
                    $('#allTabs a[data-target="#tab-teams"]').tab('show');
                }

                // Navigate to the link //
                window.location.href = $('#'+id).attr('href');
            }


			// Display filter on the table //
			if(sessionStorage.getItem(self.filters) != null){
				$('a.filter-button').removeClass('filter-disabled').addClass('filter-active');
				$('li.delete-filter').removeClass('disabled');

				_.each(app.Models.Intervention.state, function (state, i) {
					if(state.value == sessionStorage.getItem(self.filters)){
						$('a.filter-button').addClass('text-'+state.color);
					}
				})
			}
			else{
				$('a.filter-button').removeClass('filter-active ^text').addClass('filter-disabled');
				$('li.delete-filter').addClass('disabled');
			}

            app.loader('hide');
        });
       
        return this;
    },



    /** Select the planning to display
    */
    selectPlanning: function(e){
        var link = $(e.target);

        // Save the selected planning in the Session storage //
        sessionStorage.setItem(this.sstoragePlanningSelected, link.attr('id'));

        $('#listAgents li.active, #listTeams li.active').removeClass('active');
        link.parent('li').addClass('active');
    },



    /** Set a user model to the view
    */
    setModel : function(model) {
        this.model = model;
        return this;
    },    



    /** Calendar Initialization
    */
    initAllCalendars: function() {    		
    		var self = this;
    		
            teams = app.collections.teams;    		
    		teams.each(function(t){	
				new app.Views.EventsListView(self,t,true).render();
			});

            officers = app.collections.officers;    		
			officers.each(function(o){
				new app.Views.EventsListView(self,o,false).render();
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
				project_id: task.project_id[0],
				//user_id: task.user_id[0],
				planned_hours: task.planned_hours,
				total_hours: task.total_hours,
				effective_hours: task.effective_hours,
				remaining_hours: task.remaining_hours,
				//allDay: true,
			};
			
			// Store the Event Object in the DOM element so we can get to it later //
			el.data('eventObject', eventObject);
			
			// Make the event draggable using jQuery UI //
			el.draggable({
			    zIndex: 9999,
			    revert: true,
			    revertDuration: 500,
			    appendTo: '#app',
			    opacity: 0.8,
                scroll: false,
                cursorAt: { top: 0, left: 0 },
			    helper: function(e){
                    return $("<p class='well well-small'>"+eventObject.title+"</p>");
                },
			    reverting: function() {
					console.log('reverted');
				},


			});

    	});
    },



    /** Link to the Intervention page
    */
    linkToInter: function(e){

        // Retrieve the ID of the intervention //
        var link = $(e.target);

        // Check if the element click is a <i> or the <button> //
        if(link.is('i')){
            var id = _(link.parent('button').parent('a').attr('href')).strRightBack('_');    
        }
        else{
            var id = _(link.parent('a').attr('href')).strRightBack('_');       
        }
        
        // Navigate to the Intervention //
        app.router.navigate('#interventions/'+id , {trigger: true, replace: true});

    },



    /** Display information in the Modal view
    */
    setInfoModalCancelInter: function(e){

        // Retrieve the ID of the intervention //
        var link = $(e.target);

        $('#motifCancel').val('');

        // Check if the element click is a <i> or the <button> //
        if(link.is('i')){
            var id = _(link.parent('button').parent('a').attr('href')).strRightBack('_');    
        }
        else{
            var id = _(link.parent('a').attr('href')).strRightBack('_');       
        }

        var inter = _.filter(app.collections.interventions.models, function(item){ return item.attributes.id == id });

        if( inter ) {
            this.selectedInter = inter[0]
            this.selectedInterJSON = this.selectedInter.toJSON();

            $('#infoModalCancelInter p').html(this.selectedInterJSON.name);
            $('#infoModalCancelInter small').html(this.selectedInterJSON.description);
        }
        else{
            app.notify('', 'error', app.lang.errorMessages.unablePerformAction, "Annulation Intervention : non trouvée dans la liste");
        }
    },



    /** Display information in the Modal Delete Task view
    */
    setInfoModalDeleteTask: function(e){

        // Retrieve the ID of the task //
        var link = $(e.target);

        var id = _(link.parent('a').parent('li').attr('id')).strRightBack('_');

        var task = _.filter(app.collections.tasks.models, function(item){ return item.attributes.id == id });
        if( task ) {
            this.selectedTask = task[0]
            this.selectedTaskJSON = this.selectedTask.toJSON();

            $('#infoModalDeleteTask p').html(this.selectedTaskJSON.name);
            $('#infoModalDeleteTask small').html(this.selectedTaskJSON.description);
        }
        else{
            app.notify('', 'error', app.lang.errorMessages.unablePerformAction, "Suppression Tâche : non trouvée dans la liste");
        }
    },



    /** Delete intervention
    */
    scheduledInter: function(e) {

		var intervention = $(e.target);
		var id = _(intervention.parents('.accordion-body').attr('id')).strRightBack('_');

        // Retrieve the new status //
        if(intervention.bootstrapSwitch('status')){
		  params = { state: app.Models.Intervention.state[0].value, };
        }
        else{
            params = { state: app.Models.Intervention.state[1].value, };
        }

		app.models.intervention.saveAndRoute(id, params, null, this);
	},



    /** Delete intervention
    */
    cancelInter: function(e){
		e.preventDefault();
		this.selectedInter.cancel($('#motifCancel').val(),
			{
				success: function(data){
					$('#modalCancelInter').modal('hide');
                    app.router.navigate('#planning', {trigger: true, replace: true});
					/*route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);*/
				}
			}
		);
    },



    /** Delete task
    */
    deleteTask: function(e){
		var self = this;
		this.selectedTask.destroy({
			success: function(data){
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.tasks.remove(self.selectedTask);
					var inter = app.collections.interventions.get(self.selectedTaskJSON.intervention.id);					
					inter.attributes.tasks.remove(self.selectedTaskJSON.id);
					app.collections.interventions.add(inter);//					
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.taskDeleteOk);
                    $('#modalDeleteTask').modal('hide');
					// Refresh the page //
					
                    /*route = Backbone.history.fragment;
					Backbone.history.loadUrl(route);*/
                    app.router.navigate('#planning', {trigger: true, replace: true});
				}
			},
			error: function(e){
				alert('Impossible de supprimer la tâche');
			}

		});

    },



    /** Remove the Task from the Calendar
    */
    removeTaskFromSchedule: function(e){

        // Retrieve the Id of the Task //
        var taskId = $('#modalAboutTask').data('taskId');

        // Retrieve the Task in the collection //
        var taskModel = app.collections.tasks.get(taskId)

        params = {
            state: app.Models.Task.state[3].value, 
            user_id: null,
            team_id: null,
            date_end: null,
            date_start: null,
        };

        // Display the Modal //
        $("#modalAboutTask").modal('hide');

        taskModel.save(taskId, params);
        
        // Refresh the page //
        /*route = Backbone.history.fragment;
        Backbone.history.loadUrl(route);*/
        app.router.navigate('#planning', {trigger: true, replace: true});
    },



 	getTarget:function(e) {    	
    	e.preventDefault();
	    // Retrieve the ID of the intervention //
		var link = $(e.target);
		this.pos =  _(link.parents('tr').attr('id')).strRightBack('_');
		
    },



    /** Display the form to add a new Task
    */
    displayFormAddTask: function(e){
    	this.pos = e.currentTarget.id;
    	
        //Display only categories in dropdown belongs to intervention
        var categoriesTasksFiltered = null;
        var inter = app.collections.interventions.get(this.pos);
        if( inter) {
        	var interJSON = inter.toJSON();
	        categoriesTasksFiltered = _.filter(app.collections.categoriesTasks.models, function(item){ 
	        	var services = [];
	        	_.each( item.attributes.service_ids.models, function(service){
	        		services.push( service.toJSON().id );
	        	});
	        	return  interJSON.service_id && $.inArray(interJSON.service_id[0], services )!=-1;
	       	});
		}
		
		app.views.selectListAssignementsView = new app.Views.DropdownSelectListView({el: $("#taskCategory"), 
			collection: categoriesTasksFiltered==null?app.collections.categoriesTasks: new app.Collections.CategoriesTasks(categoriesTasksFiltered)
		})
		app.views.selectListAssignementsView.clearAll();
		app.views.selectListAssignementsView.addEmptyFirst();
		app.views.selectListAssignementsView.addAll();	

//		app.views.selectListEquipmentsView = new app.Views.DropdownSelectListView({el: $("#taskEquipment"), collection: app.collections.equipments})
//		app.views.selectListEquipmentsView.clearAll();
//		app.views.selectListEquipmentsView.addEmptyFirst();
//		app.views.selectListEquipmentsView.addAll();

        // Retrieve the ID of the intervention //
        this.pos = e.currentTarget.id;
        $('#modalAddTask').modal();
   },
    
	//TODO : Abstraire le code ==> displayFormAddIntervention,renderService,fillDropdownService,saveIntervention 
   	// déjà dans la view InterventionDetailsView 


	/** Display the form to add a new Intervention
    */
    displayFormAddIntervention: function(e){

   		//search no technical services
		var noTechnicalServices = _.filter(app.collections.claimersServices.models, function(service){
			return service.attributes.technical != true 
		});
		//remove no technical services
		app.collections.claimersServices.remove(noTechnicalServices);

		app.views.selectListServicesView = new app.Views.DropdownSelectListView({el: $("#interventionDetailService"), collection: app.collections.claimersServices})
		app.views.selectListServicesView.clearAll();
		app.views.selectListServicesView.addEmptyFirst();
		app.views.selectListServicesView.addAll();
		

		// Fill select Places  //
		app.views.selectListPlacesView = new app.Views.DropdownSelectListView({el: $("#interventionPlace"), collection: app.collections.places})
		app.views.selectListPlacesView.clearAll();
		app.views.selectListPlacesView.addEmptyFirst();
		app.views.selectListPlacesView.addAll();	
        
        // Retrieve the ID of the intervention //
        this.pos = e.currentTarget.id;
        $('#modalAddInter').modal();
   },



    renderService: function ( service ) {
		if( service!= null ) {
			app.views.selectListServicesView.setSelectedItem( service );
			places = app.collections.places.models;
			
			//keep only places belongs to service selected
			keepedPlaces = _.filter(places, function(item){ 
				var placeJSON = item.toJSON();
				var placeServices = placeJSON.service_ids;	
				var placeServices = [];
				_.each( item.attributes.service_ids.models, function(s){
					placeServices.push( s.toJSON().id );
				});				
				return $.inArray(service, placeServices)!=-1
			});
			app.views.selectListPlacesView.collection = new app.Collections.Places(keepedPlaces);
			app.views.selectListPlacesView.clearAll();
			app.views.selectListPlacesView.addEmptyFirst();
			app.views.selectListPlacesView.addAll();
		}	
	},



	fillDropdownService: function(e){
		e.preventDefault();
		$('#interventionPlace').val('');
		this.renderService( _($(e.target).prop('value')).toNumber() );
	},



    /** Save the Task
    */
    saveTask: function(e){
    	 var self = this;

		 e.preventDefault();
		
		 
		 input_category_id = null;
	     if( app.views.selectListAssignementsView != null ) {
	    	 var selectItem = app.views.selectListAssignementsView.getSelected();
	    	 if( selectItem ) {
	    		 input_category_id = selectItem.toJSON().id
	    	 }
	     }
	     
//	     input_equipment_id = null;
//	     if( app.views.selectListEquipmentsView != null ) {
//	    	 var selectItem = app.views.selectListEquipmentsView.getSelected();
//	    	 if( selectItem ) {
//	    		 input_equipment_id = selectItem.toJSON().id
//	    	 }
//	     }

	     var duration = $("#taskHour").val().split(":");
	     var mDuration = moment.duration ( { hours:duration[0], minutes:duration[1] })
	     
	     var params = {
	         project_id: this.pos,
	         name: this.$('#taskName').val(),
	         category_id: input_category_id,	
	         //equipment_id: input_equipment_id,
	         planned_hours: mDuration.asHours(),
	     };
	     
	    $('#modalAddTask').modal('hide');
	    app.models.task.save(0,params);
   },



	/** Save the intervention */
    saveIntervention: function (e) {

    	e.preventDefault();

        var self = this;
	     
        input_service_id = null;
        if ( app.views.selectListServicesView && app.views.selectListServicesView.getSelected())
            input_service_id = app.views.selectListServicesView.getSelected().toJSON().id;
	     
        var params = {	
		    name: this.$('#interventionName').val(),
		    description: this.$('#interventionDescription').val(),
		    state: this.$('#isTemplate').is(':checked')?"template":"open",
            // active: this.$('#isTemplate').is(':checked')?false:true,
            service_id: input_service_id,
            site1: this.$('#interventionPlace').val(),
            site_details: this.$('#interventionPlacePrecision').val(),
        };

        app.models.intervention.saveAndRoute(0,params,$('#modalAddInter'), this, "#planning");
    },



	saveNewState: function(params, element) {
		var self = this;
		self.element = element;
		self.params = params
		this.selectedInter.save(params, {
		    success: function (data) {
			        console.log(data);
			        if(data.error){
			    		app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
			        }
			        else{
			            console.log('NEW STATE INTER SAVED');
			            if( self.element!= null )
			            	self.element.modal('hide');
			            self.selectedInter.update(self.params);
			            app.collections.interventions.add(self.selectedInter);
			            self.render();
			        }
			    },
			    error: function () {
					console.log('ERROR - Unable to valid the Inter - InterventionView.js');
			    },
		},false);
	},



    /** Set or no the Foreman in the team
    */
    setForemanInTeam: function(e){

        var foremanState = $(e.target);

        // Retrieve the new status //
        if(foremanState.bootstrapSwitch('status')){
            console.log('Avec le chef d"équipe');
        }
        else{
            console.log('Sans le chef d"equipe');
        }
    },



	/** Filter Request
    */
	setFilter: function(event){

		event.preventDefault();

		var link = $(event.target);

		var filterValue = _(link.attr('href')).strRightBack('#');

		// Set the filter in the local Storage //
		if(filterValue != 'delete-filter'){
			sessionStorage.setItem(this.filters, filterValue);
		}
		else{
			sessionStorage.removeItem(this.filters);
		}
		//this.render();
        Backbone.history.loadUrl('#planning');
	},

});

