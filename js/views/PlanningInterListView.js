/******************************************
* Pagination View
*/
app.Views.PlanningInterListView = Backbone.View.extend({

	el           : '#planningInters',
	
	templateHTML : 'planningInters',

	currentRoute : null,


	// The DOM events //
	events: {
		//'click .buttonCancelInter'                : 'setInfoModalCancelInter',
		//'click button.linkToInter'                : 'linkToInter',
		//'submit #formCancelInter'                 : 'cancelInter',
		'click .btn.addInterventionPlanning'      : 'displayFormAddIntervention',
		'submit #formAddIntervention'             : 'saveIntervention', 
		
		'click .modalDeleteTask'                  : 'setInfoModalDeleteTask',
		'click button.btnDeleteTask'              : 'deleteTask',
		//'click .btn.addTaskPlanning'              : 'displayFormAddTask',
		//'submit #formAddTask'                     : 'saveTask', 
		
		'switch-change .calendarSwitch'           : 'scheduledInter',
		'switch-change #switchWithForeman'        : 'setForemanInTeam',
	
	
		'change #interventionDetailService'       : 'fillDropdownService',	
		'click #filterStateInterventionList li:not(.disabled) a' 	: 'setFilter',	
		'click #listAgents li a, #listTeams li a' :          'selectPlanning',	
		
	},



	/** View Initialization
	*/
	initialize: function() {
		
		var self = this;
		console.log("Planing Inter panel view intialization")
	    this.initCollections().done(function(){
	    	self.collections.tasks.off();	
			self.listenTo(self.collections.tasks, 'change', self.updateTask);
	    	app.router.render(self);
	    })
		//this.initCollection().done(function(){
			// Unbind & bind the collection //
//		this.collection = this.options.planning.collections.tasks;
//		this.collection.off();	
//		this.listenTo(self.collection, 'change', self.updateTask);
//		//self.listenTo(self.taskCollection, 'add', self.updateTask);
//		self.render()
			//app.router.render(self);
		//});

	},

	updateTask: function(model) {
		this.collections.tasks.add(model);
		this.render();	
	},


	/** Display the view
	*/
	render: function() {
		var self = this;
		
		var interventions = this.collections.interventions.models;

		
		// Collection Filter if not null / Otherwise we display only To Schedule interventions //
		if(sessionStorage.getItem(self.filters) != null){
			if(sessionStorage.getItem(self.filters) != 'notFilter'){
				var interventions = _.filter(interventions, function(item){ 
					var itemJSON = item.toJSON();
					return itemJSON.state == sessionStorage.getItem(self.filters);
				});
			}
		}
		else{
			sessionStorage.setItem(self.filters, app.Models.Intervention.status.open.key);
			var interventions = _.filter(interventions, function(item){ 
				return item.toJSON().state == app.Models.Intervention.status.open.key;
			});
		}

		interventionSorted = new app.Collections.Interventions(interventions);		
		
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			// Set variables template //
			var template = _.template(templateData, {
				lang: app.lang,
				interventionsState: app.Models.Intervention.status,
				interventions: interventionSorted.toJSON(),		
			});
			
			$(self.el).html(template);
			
			$('*[rel="tooltip"]').tooltip();
			$('*[rel="popover"]').popover({trigger: 'hover', delay: { show: 500, hide: 100 }});

			$('.switch').bootstrapSwitch();

			$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});


			// Set the focus to the first input of the form //
			$('#modalAddInter, #modalAddTask').on('shown', function (e) {
				$(this).find('input').first().focus();
			})
			
			_.each(self.collections.interventions.models, function(inter, i){
				var tasks = [];
				_.each(inter.toJSON().tasks,function(item,i){ 
					tasks.push(self.collections.tasks.get(item));
				});
				var itemPlaningInterView = new app.Views.ItemPlanningInterView({model: inter});
				$('#inter-items').append(itemPlaningInterView.render().el);
				var itemPlanningInterTaskListView = new app.Views.ItemPlanningInterTaskListView({inter: inter, tasks: tasks});
				$('#inter-items').append(itemPlanningInterTaskListView.render().el);
				
			});
			
			//self.initDragObject();
		});
		return this;
	},

		/** Set a user model to the view
		*/
		setModel : function(model) {
			this.model = model;
			return this;
		},

		/** Make the external event Draggable
		*/
		initDragObject: function() {
			tasks = self.collections.tasks.toJSON();
			
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
			app.router.navigate(app.routes.interventions.baseUrl+'/'+id , {trigger: true, replace: true});

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
			  params = { state: app.Models.Intervention.status.scheduled.key, };
			}
			else{
				params = { state: app.Models.Intervention.status.open.key, };
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
						app.router.navigate(app.routes.planning.url, {trigger: true, replace: true});
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
						app.router.navigate(app.routes.planning.url, {trigger: true, replace: true});
					}
				},
				error: function(e){
					alert('Impossible de supprimer la tâche');
				}

			});

		},





		getTarget:function(e) {    	
			e.preventDefault();
			// Retrieve the ID of the intervention //
			var link = $(e.target);
			this.pos = _(link.parents('tr').attr('id')).strRightBack('_');
			
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

//			app.views.selectListEquipmentsView = new app.Views.DropdownSelectListView({el: $("#taskEquipment"), collection: app.collections.equipments})
//			app.views.selectListEquipmentsView.clearAll();
//			app.views.selectListEquipmentsView.addEmptyFirst();
//			app.views.selectListEquipmentsView.addAll();

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
					return $.inArray(service, item.toJSON().service_ids)!=-1
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
			 
//		     input_equipment_id = null;
//		     if( app.views.selectListEquipmentsView != null ) {
//		    	 var selectItem = app.views.selectListEquipmentsView.getSelected();
//		    	 if( selectItem ) {
//		    		 input_equipment_id = selectItem.toJSON().id
//		    	 }
//		     }

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
				sessionStorage.setItem(this.filters, 'notFilter');
			}
			//this.render();
			Backbone.history.loadUrl('#planning');
		},
		
		
		initCollections: function(){
			var self = this;
			
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collections)){this.collections = {}}
			if(_.isUndefined(this.collections.interventions)){this.collections.interventions = new app.Collections.Interventions();}
			if(_.isUndefined(this.collections.tasks)){ this.collections.tasks = new app.Collections.Tasks(); }
		
			
			
			// Fetch the collections //
			app.loader('display');

			var deferred = $.Deferred();
			//retrieve interventions and tasks associated (use domain ('project_id','in',[...] to retrieve tasks associated)
			
			// Create Fetch params //
			fetchParams = {
				silent : true,
				data   : {
					limit  : 5,
				}
			};
			
			this.collections.interventions.fetch(fetchParams)
			.done(function(){
				if(self.collections.interventions.cpt > 0){
					self.collections.tasks.fetch({silent: true,data: {filters: {0:{'field':'project_id.id','operator':'in','value':self.collections.interventions.pluck('id')}}}})
					.done(function(){
						deferred.resolve();
					})
					.fail(function(e){
						console.error(e);
					})
				}
				else{
					deferred.resolve();
				}
			})
			.fail(function(e){
				console.error(e);
			})
			.always(function(){
				app.loader('hide');
			});
			
			return deferred;
		
		},




});