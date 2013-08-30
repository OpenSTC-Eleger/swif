/******************************************
* Pagination View
*/
app.Views.PlanningInterListView = app.Views.GenericListView.extend({

	el           : '#planningInters',
	
	templateHTML : 'planningInters',

	currentRoute : null,

	
	// The DOM events //
	events: function(){
		return _.defaults({
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
			//'click #listAgents li a, #listTeams li a' :          'selectPlanning',	
		}, 
			app.Views.GenericListView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize: function() {
		
		var self = this;
		console.log("Planing Inter panel view intialization")
	    this.initCollections().done(function(){
	    	self.collections.tasks.off();	
			self.listenTo(self.collections.tasks, 'change', self.updateTask);
			//self.render();
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
			
			// Call the render Generic View //
			app.Views.GenericListView.prototype.render(self.options);
			
			$('*[rel="tooltip"]').tooltip();
			$('*[rel="popover"]').popover({trigger: 'hover', delay: { show: 500, hide: 100 }});

			$('.switch').bootstrapSwitch();

			$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});


			// Set the focus to the first input of the form //
			$('#modalAddInter, #modalAddTask').on('shown', function (e) {
				$(this).find('input').first().focus();
			})
						
			_.each(self.collections.interventions.models, function(inter, i){
				var tasks = new app.Collections.Tasks();
				_.each(inter.toJSON().tasks,function(item,i){ 
					tasks.push(self.collections.tasks.get(item));
				});
				var itemPlaningInterView = new app.Views.ItemPlanningInterView({model: inter});
				$('#inter-items').append(itemPlaningInterView.render().el);
				var itemPlanningInterTaskListView = new app.Views.ItemPlanningInterTaskListView({inter: inter, tasks: tasks});
				$('#inter-items').append(itemPlanningInterTaskListView.render().el);
				
			});	
			
			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page       : self.options.page.page,
				collection : self.collections.interventions
			})
			app.views.paginationView.render();
			
		});
		return this;
	},
	
		
	/** Partial Render of the view
	*/
	partialRender: function () {
		this.initialize();
//		var self = this;
//		$.when(self.collections.interventions.pendingInterventionsCount(),
//				self.collections.interventions.plannedInterventionsCount()).done(function(){
//			$('#nbInterPlanned').html(self.collections.interventions.plannedInterventions);
//			$('#nbInterPending').html(self.collections.interventions.pendingInterventions);
//		});
	},

		/** Set a user model to the view
		*/
		setModel : function(model) {
			this.model = model;
			return this;
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
		
			
			

			var deferred = $.Deferred();
			//retrieve interventions and tasks associated (use domain ('project_id','in',[...] to retrieve tasks associated)
			
			// Check the parameters //
			if(_.isUndefined(this.options.sort)){
				this.options.sort = this.collections.interventions.default_sort;
			}
			else{
				this.options.sort = app.calculPageSort(this.options.sort);	
			}
			this.options.page = app.calculPageOffset(this.options.page);
	
	
			// Create Fetch params //
			this.fetchParams = {
				silent : true,
				data   : {
					limit  : app.config.itemsPerPage,
					offset : this.options.page.offset,
					sort   : this.options.sort.by+' '+this.options.sort.order
				}
			};
			if(!_.isUndefined(this.options.search)){
				this.fetchParams.data.filters = app.calculSearch({search: this.options.search }, app.Models.Intervention.prototype.searchable_fields);
			}
			
			this.collections.interventions.fetch(this.fetchParams)
			.done(function(){
				if(self.collections.interventions.cpt > 0){
					self.collections.tasks.fetch({silent: true,data: {filters: {0:{'field':'project_id.id','operator':'in','value':self.collections.interventions.pluck('id')}}}})
					.done(function(){
						app.loader('hide');
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
			
			return deferred;
		
		},




});