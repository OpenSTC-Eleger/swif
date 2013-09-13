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
			//'switch-change #switchWithForeman'        : 'setForemanInTeam',		
			'click #filterStateInterventionList li:not(.disabled) a' 	: 'setFilterState',	
			'click a.modalCreateInter'			: 'displayModalSaveInter',
			'click #pagination ul a'			: 'goToPage',
		}, 
			app.Views.GenericListView.prototype.events
		);
	},


	/** View Initialization
	*/
	initialize: function() {		
		var self = this;
		
		this.collections = this.options.collections;
	    app.router.render(this);
	    
	    this.collections.interventions.off();
	    this.listenTo(self.collections.interventions, 'add', this.addInter);
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
			app.views.paginationView = new app.Views.PaginationView({ 
				page       : self.options.page.page,
				collection : self.collections.interventions
			})
			app.views.paginationView.render();
			
			
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
	partialRender: function (model) {		
//		var self = this;
//		$.when(self.collections.interventions.pendingInterventionsCount(),
//				self.collections.interventions.plannedInterventionsCount()).done(function(){
//			$('#nbInterPlanned').html(self.collections.interventions.plannedInterventions);
//			$('#nbInterPending').html(self.collections.interventions.pendingInterventions);
//		});
	},
	
//	panelRender: function (model) {
//		var model = this.collections.tasks.findWhere({id:model.id});	
//		model.setId(model.id);
//		model.fetch({silent: true, data: {fields: app.Collections.Tasks.fields}});	
//	},


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
//			this.options.page = app.Helpers.Main.calculPageOffset(this.options.page);
		
		// routing with new url		
		var urlParameters = ['id', 'officer', 'team', 'year', 'week', 'filter', 'sort', 'page', 'search']
		app.router.navigate(app.Helpers.Main.urlBuilder(urlParameters, this.options), {trigger: true, replace: true});	
	},	
	
	goToPage: function(e){
		e.preventDefault()
		
		var self = this;
		
		var link = $(e.target);
		
		this.options.page = _(link.attr('href')).strRightBack('/page')
		delete this.options.sort;
		
		app.router.navigate(this.urlBuilder(), {trigger: false, replace: true});
		
		app.views.planning.partialRender();
		
	},
	
	/**
	 * Constructs url for planning
	 */
	urlBuilder: function() {
		var self = this;
		var url = _(Backbone.history.fragment).strLeft('/');

		// Iterate all urlParameters //
		_.each(this.urlParameters, function(value, index){		
			// Check if the options parameter aren't undefined or null //
			if(!_.isUndefined(self.options[value]) && !_.isNull(self.options[value])){	
					url += '/'+value+'/'+self.options[value];					
			}
		});				
		return url;		
	},


});