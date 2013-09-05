/******************************************
* Pagination View
*/
app.Views.PlanningInterListView = Backbone.View.extend({

	el           : '#planningInters',
	
	templateHTML : 'planningInters',

	currentRoute : null,

	
	// The DOM events //
	events: function(){
		return _.defaults({
			//'click .buttonCancelInter'                : 'setInfoModalCancelInter',
			//'submit #formCancelInter'                 : 'cancelInter',
			//'click .btn.addInterventionPlanning'      : 'displayFormAddIntervention',
			//'submit #formAddIntervention'             : 'saveIntervention', 
			
			//'click .btn.addTaskPlanning'              : 'displayFormAddTask',
			//'submit #formAddTask'                     : 'saveTask', 
			
			'switch-change .calendarSwitch'           : 'scheduledInter',
			'switch-change #switchWithForeman'        : 'setForemanInTeam',
		
		
			'change #interventionDetailService'       : 'fillDropdownService',	
			'click #filterStateInterventionList li:not(.disabled) a' 	: 'setFilterState',	
			'click a.modalCreateInter'			: 'displayModalSaveInter',
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
	    	//self.collections.tasks.off();
	    	app.router.render(self);
	    	self.collections.interventions.off();
	    	self.listenTo(self.collections.interventions, 'add', self.addInter);
			//self.listenTo(self.collections.tasks, 'add',self.adTask);
	    	
	    	
	    })
	},
	
	addInter: function(model){
		var itemPlanningInterView  = new app.Views.ItemPlanningInterView({ model: model });
		var itemPlanningInterTaskListView = new app.Views.ItemPlanningInterTaskListView({ inter: model, tasks: new app.Collections.Tasks() });		
		$('#inter-items').prepend(itemPlanningInterTaskListView.render().el);
		$('#inter-items').prepend(itemPlanningInterView.render().el);
		itemPlanningInterView.highlight().done(function(){
			itemPlanningInterView.expendAccordion();
		});
	
		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.interventionSaveOK);
		
		this.partialRender();
	
		//app.router.navigate(app.views.planningInterListView.urlBuilder(), {trigger: false, replace: false});
	},

	/** Display the view
	*/
	render: function() {
		var self = this;		
	
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			// Set variables template //
			var template = _.template(templateData, {
				lang: app.lang,
				interventionsState: app.Models.Intervention.status,
				interventions: self.collections.interventions.toJSON(),		
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
				var itemPlanningInterView = new app.Views.ItemPlanningInterView({model: inter, tasks: tasks});
				$('#inter-items').append(itemPlanningInterView.render().el);
				var itemPlanningInterTaskListView = new app.Views.ItemPlanningInterTaskListView({inter: inter, tasks: tasks});
				$('#inter-items').append(itemPlanningInterTaskListView.render().el);
				
			});	
			
			// Pagination view //
//			app.views.paginationView = new app.Views.PaginationView({ 
//				page       : self.options.page.page,
//				collection : self.collections.interventions
//			})
//			app.views.paginationView.render();
			
			
			// Render Filter Link //
			if(_.isUndefined(self.options.filter)){
				// set status information on open intervention
				$('#filterStateIntervention').removeClass('filter-disabled');
				$('#filterStateInterventionList li.delete-filter').removeClass('disabled');

				$('a.filter-button').addClass('text-'+app.Models.Intervention.status.open.color);
			}
//			else if(self.options.filter.value=='notFilter'){
//				// set status information on no filter
//				$('#filterStateIntervention').addClass('filter-disabled');
//				$('#filterStateInterventionList li.delete-filter').addClass('disabled');
//				
//			}
			else{
				// set status information on filter selected
				$('#filterStateIntervention').removeClass('filter-disabled');
				$('#filterStateInterventionList li.delete-filter').removeClass('disabled');

				$('a.filter-button').addClass('text-'+app.Models.Intervention.status[self.options.filter.value].color);
			}
			
		});
		return this;
	},
	

	/** Display the form to add / update an intervention
	*/
	displayModalSaveInter: function(e){
		e.preventDefault();
		var params = {el:'#modalSaveInter',interventions: this.collections.interventions}
		new app.Views.ModalInterventionView(params);
	},
		
	/** Partial Render of the view
	*/
	partialRender: function () {
//		var self = this;
//		$.when(self.collections.interventions.pendingInterventionsCount(),
//				self.collections.interventions.plannedInterventionsCount()).done(function(){
//			$('#nbInterPlanned').html(self.collections.interventions.plannedInterventions);
//			$('#nbInterPending').html(self.collections.interventions.pendingInterventions);
//		});
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



		/** Filter Intervention by status
		*/
		setFilterState: function(e){

			e.preventDefault();

			if($(e.target).is('i')){
				var filterValue = _($(e.target).parent().attr('href')).strRightBack('#');
			}else{
				var filterValue = _($(e.target).attr('href')).strRightBack('#');
			}
			
			// Set the filter value in the options of the view //
			var globalSearch = {};
			if(filterValue != 'delete-filter'){
				//globalSearch.filter = { by: 'state', value: filterValue};	
				this.options.filter =  { by: 'state', value: filterValue};	
			}
			else{
				//this.options.filter = "noFilter"
				delete this.options.filter;
			}
			
//			if(_.isUndefined(this.options.sort)){
//				this.options.sort = this.collections.interventions.default_sort;
//			}
//			
//			this.fetchParams.data.filters = this.options.filter;
//
//			// Create Fetch params //
//			this.fetchParams.data.sort = this.options.sort.by+' '+this.options.sort.order
//			
//			this.options.page = '1';
//			this.options.page = app.calculPageOffset(this.options.page);
			
			// routing with new url		
			var urlParameters = ['id', 'officer', 'team', 'year', 'week', 'filter', 'sort', 'page', 'search']
			app.router.navigate(app.Helpers.Main.urlBuilder(urlParameters, this.options), {trigger: true, replace: true});	
		},
		
		/**
		 * Init intervention and task collections
		 */
		initCollections: function(){
			var self = this;
			
			// Check if the collections is instantiate //
			if(_.isUndefined(this.collections)){this.collections = {}}
			if(_.isUndefined(this.collections.interventions)){this.collections.interventions = new app.Collections.Interventions();}
			if(_.isUndefined(this.collections.tasks)){ this.collections.tasks = new app.Collections.Tasks(); }
			
			
			// Check the parameters //
			if(_.isUndefined(this.options.sort)){
				this.options.sort = this.collections.interventions.default_sort;
			}
			else{
				this.options.sort = app.calculPageSort(this.options.sort);	
			}
			this.options.page = app.calculPageOffset(this.options.page);

			if(!_.isUndefined(this.options.filter)){
				this.options.filter = app.calculPageFilter(this.options.filter);
			}
	
			// Create Fetch params //
			this.fetchParams = {
				silent : true,
				data   : {
					limit  : app.config.itemsPerPage,
					offset : this.options.page.offset,
					sort   : this.options.sort.by+' '+this.options.sort.order
				}
			};
			
			var globalSearch = {};
			if(!_.isUndefined(this.options.search)){
				globalSearch.search = this.options.search;
			}
			if(!_.isUndefined(this.options.filter) && this.options.filter.value!='notFilter' ){
				globalSearch.filter = this.options.filter;
			}
			else{
				globalSearch.filter = { by: 'state', value: app.Models.Intervention.status.open.key};
			}
	
			if(!_.isEmpty(globalSearch)){
				this.fetchParams.data.filters = app.calculSearch(globalSearch, app.Models.Intervention.prototype.searchable_fields);
			}
			
			return this.fetchCollections();
		
		},
		
		fetchCollections : function(){
			var self = this;
			var deferred = $.Deferred();
			this.collections.interventions.fetch(this.fetchParams)
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
			
			return deferred;
		}

});