/******************************************
* Interventions List View
*/
app.Views.InterventionsListView = app.Views.GenericListView.extend({

	templateHTML: 'interventions',

	filters: 'intersListFilter',
	
	numberListByPage: 25,
	selectedInter : '',
	selectedTask : '',
	collections:  {},

	// The DOM events //
	events: function(){
		return _.defaults({
			'click li.active'					: 'preventDefault',
			'click li.disabled'					: 'preventDefault',
			'click ul.sortable li'				: 'preventDefault',

			'click a.modalCreateInter'			: 'displayModalSaveInter',

			'click #filterStateInterList li:not(.disabled) a' 	: 'setFilter'
		}, 
			app.Views.GenericListView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize : function() {
		var self = this;
		console.log('Interventions view Initialize');
		this.initCollections().done(function(){
			app.router.render(self);
			// Unbind & bind the collection //
			self.collections.interventions.off();
			self.listenTo(self.collections.interventions, 'add',self.add);
		});
	},

	add: function(model){
		var itemInterView  = new app.Views.ItemInterventionView({ model: model });
		var itemInterTaskListView = new app.Views.ItemInterventionTaskListView({ inter: model, tasks: new app.Collections.Tasks() });
		$('#inter-items').prepend(itemInterTaskListView.render().el);
		$('#inter-items').prepend(itemInterView.render().el);
		app.Helpers.Main.highlight($(itemInterView.el)).done(function(){
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
		console.log('-----------Interventions list view rendering--------------');
		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.interventionsMonitoring);

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

		// Change the Grid Mode of the view //
		app.views.headerView.switchGridMode('fluid');


		var interventions = this.collections.interventions.toJSON();
		var len = this.collections.interventions.cpt;
		var pageCount = Math.ceil(len / app.config.itemsPerPage);

		var startPos = (this.options.page.page - 1) * app.config.itemsPerPage;
		var endPos = startPos + app.config.itemsPerPage;
		// Retrieve the HTML template //
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang                   : app.lang,
				nbInterventions        : len,
				nbInterventionsPending : self.collections.interventions.pendingInterventions,
				nbInterventionsPlanned : self.collections.interventions.plannedInterventions,
				interventionsState     : app.Models.Intervention.status,
				interventions          : interventions,
				startPos               : startPos, endPos: endPos,
				page                   : self.options.page.page, 
				pageCount              : pageCount,
			});


			$(self.el).html(template);

			// Display filter on the table //
			if(!_.isUndefined(self.options.filter)){
				$('a.filter-button').removeClass('filter-disabled').addClass('filter-active');
				$('li.delete-filter').removeClass('disabled');

				var applyFilter = self.options.filter;

				if(applyFilter.value != 'overrun') {
					$('a.filter-button').addClass('text-'+app.Models.Intervention.status[applyFilter.value].color);
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
			app.Views.GenericListView.prototype.render(self.options);
			
			// Create item intervention view //
			_.each(self.collections.interventions.models, function(inter, i){
				var tasks = new app.Collections.Tasks();
				_.each(inter.toJSON().tasks,function(item,i){
					tasks.add(self.collections.tasks.get(item));
				});
				var itemInterventionView = new app.Views.ItemInterventionView({model: inter, tasks: tasks});
				$('#inter-items').append(itemInterventionView.render().el);
				var itemInterventionTaskListView = new app.Views.ItemInterventionTaskListView({inter: inter, tasks: tasks});
				$('#inter-items').append(itemInterventionTaskListView.render().el);
				
			});
			
			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page       : self.options.page.page,
				collection : self.collections.interventions
			})
			app.views.paginationView.render();

			
		});
		$(this.el).hide().fadeIn();
		return this;
	},


	getTarget:function(e) {    	
		e.preventDefault();
		// Retrieve the ID of the intervention //
		var link = $(e.target);
		if(link.parents('tr').length > 0){
			this.pos =  _(link.parents('tr').attr('id')).strRightBack('_');
		}
		else{
			this.pos = -1;
		}
		},


	/** Display the form to add / update an intervention
	*/
	displayModalSaveInter: function(e){
		//this.getTarget(e);
		e.preventDefault();
		var params = {el:'#modalSaveInter',interventions: this.collections.interventions}
//		if(this.pos > -1){
//			params.model = this.collections.interventions.get(this.pos);
//		}
		new app.Views.ModalInterventionView(params);
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
//			sessionStorage.setItem(this.filters, filterValue);
			this.options.filter = {by: 'state', value:filterValue};
		}
		else{
			delete this.options.filter;
		}

//		if(this.options.page <= 1){
//			this.render();
//		}
//		else{
//			app.router.navigate(app.routes.interventions.baseUrl, {trigger: true, replace: true});
//		}
		app.router.navigate(this.urlBuilder(), {trigger: true, replace: true});

	},



	/** Prevent the default action
	*/
	preventDefault: function(event){
		event.preventDefault();
	},
	
	initCollections: function(){
		var self = this;
		
		// Check if the collections are instantiated //
		if(_.isUndefined(this.collections.tasks)){ this.collections.tasks = new app.Collections.Tasks(); }
		if(_.isUndefined(this.collections.interventions)){this.collections.interventions = new app.Collections.Interventions();}
		
		//check sort parameter
		if(_.isUndefined(this.options.sort)){
			this.options.sort = this.collections.interventions.default_sort;
		}
		else{
			this.options.sort = app.calculPageSort(this.options.sort);	
		}
		
		
		// Construction of the domain (filter and search, special domain if filter == overrun)
		var domain = [];
		var optionSearch = {};
		//Retrieve search domain given by search box and / or by filter
		if(!_.isUndefined(this.options.search)){
			// Collection Filter if not null //
			optionSearch.search = this.options.search;
		}
		if(!_.isUndefined(this.options.filter) && !_.isNull(this.options.filter)){
			this.options.filter = app.calculPageFilter(this.options.filter);

			//interventions = _.filter(interventions, function(item){ 
			if(this.options.filter.value == 'overrun'){
				//return (item.state == app.Models.Intervention.status.closed.key && item.overPourcent > 100);
				domain.push({field:'state',operator:'=',value:'closed'});
				domain.push({field:'overPourcent',operator:'>',value:'100.0'});
			}
			else{
				optionSearch.filter = this.options.filter;
			}
		}
		//'Unbuild' domain objectify to be able to add other filters (and objectify when all filters are added
		var searchDomain = app.calculSearch(optionSearch, app.Models.Intervention.prototype.searchable_fields);
		_.each(searchDomain,function(item, index){
			domain.push(item);
		});	
		
		this.options.page = app.calculPageOffset(this.options.page);

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




