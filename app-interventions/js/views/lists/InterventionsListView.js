define([
	'app',
	'appHelpers',

	'interventionsCollection',
	'interventionModel',
	'tasksCollection',

	'genericListView',
	'paginationView',
	'itemInterventionView',
	'itemInterventionTaskListView',
	'modalInterventionView'

], function(app, AppHelpers, InterventionsCollection, InterventionModel, TasksCollection, GenericListView, PaginationView, ItemInterventionView, ItemInterventionTaskListView, ModalInterventionView){

	'use strict';
	
	
	/******************************************
	* Interventions List View
	*/
	var InterventionsListView = GenericListView.extend({
	
		templateHTML: '/templates/lists/interventionsList.html',
	
		filters: 'intersListFilter',
		
		selectedInter : '',
		selectedTask : '',
		collections:  {},
	
		// The DOM events //
		events: function(){
			return _.defaults({
				'click a.modalCreateInter'     : 'displayModalSaveInter',
				
				'click #filterStateInterList li:not(.disabled) a' 	: 'setFilter'
			}, 
				GenericListView.prototype.events
			);
		},
	
	
	
		/** View Initialization
		*/
		initialize : function(params) {
			var self = this;
	
			this.options = params;
	
	
			this.initCollections().done(function(){
				app.router.render(self);
				// Unbind & bind the collection //
				self.collections.interventions.off();
				self.listenTo(self.collections.interventions, 'add',self.add);
			});
		},
	
	
	
		add: function(model){
			var itemInterView  = new ItemInterventionView({ model: model });
			var itemInterTaskListView = new ItemInterventionTaskListView({ inter: model, tasks: new TasksCollection() });
			$('#inter-items').prepend(itemInterTaskListView.render().el);
			$('#inter-items').prepend(itemInterView.render().el);
			AppHelpers.highlight($(itemInterView.el)).done(function(){
				itemInterView.expendAccordion();
			});
	
			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.interventionSaveOK);
			
			this.partialRender();
	
			//this.options.id = model.getId();
			app.router.navigate(app.views.interventions.urlBuilder(), {trigger: false, replace: false});
		},
	
	
	
		/** Partial Render of the view
		*/
		partialRender: function (type) {
			var self = this;
			$.when(self.collections.interventions.pendingInterventionsCount(),
					self.collections.interventions.plannedInterventionsCount()).done(function(){
				$('#nbInterPlanned').html(self.collections.interventions.plannedInterventions);
				$('#nbInterPending').html(self.collections.interventions.pendingInterventions);
			});
			//@TODO: update view to use paginationView
			
			//this.collection.count(this.fetchParams).done(function(){
				//$('#bagdeNbTeams').html(self.collection.cpt);
				//app.views.paginationView.render();
			//});
		},
		
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
			// Change the page title //
			app.router.setPageTitle(app.lang.viewsTitles.interventionsMonitoring);
	
	
	
			var interventions = this.collections.interventions.toJSON();
			var len = this.collections.interventions.cpt;
			var pageCount = Math.ceil(len / app.config.itemsPerPage);
	
			var startPos = (this.options.page.page - 1) * app.config.itemsPerPage;
			var endPos = startPos + app.config.itemsPerPage;

			// Retrieve the HTML template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){
				var template = _.template(templateData, {
					lang                   : app.lang,
					nbInterventions        : len,
					nbInterventionsPending : self.collections.interventions.pendingInterventions,
					nbInterventionsPlanned : self.collections.interventions.plannedInterventions,
					interventionsState     : InterventionModel.status,
					interventions          : interventions,
					startPos               : startPos, endPos: endPos,
					page                   : self.options.page.page, 
					pageCount              : pageCount,
					logo_path              : app.config.logo_path
				});
	
	
				$(self.el).html(template);
	
				// Display filter on the table //
				if(!_.isUndefined(self.options.filter)){
					$('a.filter-button').removeClass('filter-disabled').addClass('filter-active');
					$('li.delete-filter').removeClass('disabled');
	
					var applyFilter = self.options.filter;
	
					if(applyFilter.value != 'overrun') {
						$('a.filter-button').addClass('text-'+InterventionModel.status[applyFilter.value].color);
					}
					else{
						$('a.filter-button').addClass('text-overrun');
					}
				}
				else{
					$('a.filter-button').removeClass('filter-active ^text').addClass('filter-disabled');
					$('li.delete-filter').addClass('disabled');
				}
	
				// Call the render Generic View //
				GenericListView.prototype.render(self);
				
				// Create item intervention view //
				_.each(self.collections.interventions.models, function(inter, i){
					var tasks = new TasksCollection();
					_.each(inter.toJSON().tasks,function(item,i){
						tasks.add(self.collections.tasks.get(item));
					});
					var itemInterventionView = new ItemInterventionView({model: inter, tasks: tasks});
					$('#inter-items').append(itemInterventionView.render().el);
					var itemInterventionTaskListView = new ItemInterventionTaskListView({inter: inter, tasks: tasks});
					$('#inter-items').append(itemInterventionTaskListView.render().el);
					
				});
				
				// Pagination view //
				app.views.paginationView = new PaginationView({ 
					page       : self.options.page.page,
					collection : self.collections.interventions
				});
				
			});
			$(this.el).hide().fadeIn();
			return this;
		},
	
	
	
		/** Display the form to add / update an intervention
		*/
		displayModalSaveInter: function(e){
			e.preventDefault();
			
			var params = {el:'#modalSaveInter',collection: this.collections.interventions}
			new ModalInterventionView(params);
		},
	
	
	
		/** Retrieve Equipment  (Vehicle)
		*/
		fillDropdownEquipment: function(e){
			e.preventDefault();
			var target = $(e.target).val();
			if( target ) {
				var equipment = this.collections.vehicles.get( target );
				if( equipment ) {
					var km = equipment.toJSON().km ;
					$('.equipmentKm').val( km );
					$('.equipmentKm').attr('min', km )
				}
			}
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
						this.collections.interventions.add(self.selectedInter);
						self.render();
					}
				},
				error: function () {
					console.log('ERROR - Unable to valid the Inter - InterventionView.js');
				},
			},false);
		},
	
	
	
	
		/** Filter Request
		*/
		setFilter: function(event){
			event.preventDefault();
	
			var link = $(event.target);
	
			var filterValue = _(link.attr('href')).strRightBack('#');
	
			// Set the filter in the local Storage //
			if(filterValue != 'delete-filter'){
				this.options.filter = {by: 'state', value:filterValue};
			}
			else{
				delete this.options.filter;
			}
	
	
			app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});
	
		},
	
	
	
		initCollections: function(){
			var self = this;
			
			// Check if the collections are instantiated //
			if(_.isUndefined(this.collections.tasks)){ this.collections.tasks = new TasksCollection(); }
			else{this.collections.tasks.reset();}
			
			if(_.isUndefined(this.collections.interventions)){this.collections.interventions = new InterventionsCollection();}
			else{this.collections.interventions.reset();}
			
			// Set main collection used in GenericListView
			this.collection = this.collections.interventions;
			
			//check sort parameter
			if(_.isUndefined(this.options.sort)){
				this.options.sort = this.collections.interventions.default_sort;
			}
			else{
				this.options.sort = AppHelpers.calculPageSort(this.options.sort);	
			}
			
			
			// Construction of the domain (filter and search, special domain if filter == overrun)
			var domain = [];
			var optionSearch = {};
			//Retrieve search domain given by search box and / or by filter
			if(!_.isUndefined(this.options.search)){
				// Collection Filter if not null //
				optionSearch.search = this.options.search;
			}
			else if(!_.isUndefined(this.options.filter)){
				//Add advanced search from url in params
				optionSearch.filter = JSON.parse(this.options.filter);
			}
			//TODO : remove state filter from list
//			if(!_.isUndefined(this.options.filter) && !_.isNull(this.options.filter)){
//				this.options.filter = AppHelpers.calculPageFilter(this.options.filter);
//	
//				//interventions = _.filter(interventions, function(item){ 
//				if(this.options.filter.value == 'overrun'){
//					//return (item.state == app.Models.Intervention.status.closed.key && item.overPourcent > 100);
//					domain.push({field:'state',operator:'=',value:'closed'});
//					domain.push({field:'overPourcent',operator:'>',value:'100.0'});
//				}
//				else{
//					optionSearch.filter = this.options.filter;
//				}
//			}
			//'Unbuild' domain objectify to be able to add other filters (and objectify when all filters are added
			var searchDomain = AppHelpers.calculSearch(optionSearch, InterventionModel.prototype.searchable_fields);
			_.each(searchDomain,function(item, index){
				domain.push(item);
			});	
			
			this.options.page = AppHelpers.calculPageOffset(this.options.page);
	
			// Create Fetch params //
			var fetchParams = {
				silent : true,
				data   : {
					limit  : app.config.itemsPerPage,
					offset : this.options.page.offset,
					filters: app.objectifyFilters(domain)
				}
			};
			if(!_.isUndefined(this.options.sort)){
				fetchParams.data.sort = this.options.sort.by+' '+this.options.sort.order;
			}
			
			fetchParams.data.fields = this.collections.interventions.fields;
			
			var deferred = $.Deferred();
			//retrieve interventions and tasks associated (use domain ('project_id','in',[...] to retrieve tasks associated)
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
			
			return deferred;
		}
	  
	});
	return InterventionsListView;
})