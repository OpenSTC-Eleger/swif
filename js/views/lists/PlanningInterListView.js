/******************************************
* Pagination View
*/
app.Views.PlanningInterListView = app.Views.GenericListView.extend({

	el           : '#planningInters',
	
	templateHTML : 'planningInters',

	currentRoute : null,

	urlParameters : ['id', 'officer', 'team', 'year', 'week', 'filter', 'sort', 'page', 'search'],
	
	// The DOM events //
	events: function(){
		return _.defaults({			
			//'switch-change #switchWithForeman'        : 'setForemanInTeam',	
			'click #filterStateInterventionList li a' 	: 'setFilterState',	
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
		
		this.filterValue = 'state-open';
		
		this.collections = this.options.collections;
	    app.router.render(this);
	    
	    this.collections.interventions.off();
	    this.listenTo(self.collections.interventions, 'add', this.addInter);
	},
	
	addInter: function(model){
		//If filter is on 'all state' or 'scheduled' add item view in panel
		if( _.isUndefined(this.filterValue) || _(this.filterValue).strRight('-') == model.toJSON().state ) {
			var itemPlanningInterTaskListView = new app.Views.ItemPlanningInterTaskListView({ model : model });	
			var itemPlanningInterView  = new app.Views.ItemPlanningInterView({ model: model, detailedView:itemPlanningInterTaskListView });
			$('#inter-items').prepend(itemPlanningInterTaskListView.render().el);
			$('#inter-items').prepend(itemPlanningInterView.render().el);
			itemPlanningInterView.highlight().done(function(){
				itemPlanningInterView.expendAccordion();
			});
			if(this.collections.interventions.length == 1){
				$(this.el).find('.noInter').css({display: 'none'});
				$(this.el).find('.table-nested-objects').css({display: 'table'});
			}			
		}
		else {
			//filter is selected and intervention has been created : display open interventions
			$( "#filterStateInterventionList li" ).children("a[href='#'" + app.Models.Task.status.open.key + "]").trigger( "click" );
		}
		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.interventionSaveOK);
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
				
				var detailedView =new app.Views.ItemPlanningInterTaskListView({model: inter});
				var simpleView = new app.Views.ItemPlanningInterView({model: inter, detailedView:detailedView});
				$('#inter-items').append( simpleView.render().el );
				$('#inter-items').append(detailedView.render().el);
				simpleView.detailedView = detailedView;				
			});	
			
			
			
			// Pagination view //
			app.views.paginationView = new app.Views.PaginationView({ 
				page       : self.options.page.page,
				collection : self.collections.interventions,
				size		: 'sm',
				displayGoToPage : false,
				
			})
			app.views.paginationView.render();
			
			
			// Render Filter Link //
			if(_.isUndefined(self.options.filter)){
				
				$('#filterStateIntervention').addClass('filter-disabled');
				$('#filterStateInterventionList li.delete-filter').addClass('disabled');
			}
			else{
				// set status information on filter selected
				$('#filterStateIntervention').removeClass('filter-disabled');
				$('#filterStateInterventionList li.delete-filter').removeClass('disabled');
				if( !_.isUndefined( app.Models.Intervention.status[self.options.filter.value] ) ) 
					$('a.filter-button').addClass('text-'+app.Models.Intervention.status[self.options.filter.value].color);
			}
			
		});
		return this;
	},
	
	/**
	 * Re calculate pagination 
	 */
	paginationRender : function() {
		app.views.paginationView.initialize();
		app.views.paginationView.render();
	},
	

	/** Display the form to add / update an intervention
	*/
	displayModalSaveInter: function(e){
		e.preventDefault();
		var params = {el:'#modalSaveInter',interventions: this.collections.interventions}
		new app.Views.ModalInterventionView(params);
	},


	/** Filter Intervention by status
	*/
	setFilterState: function(e){

		e.preventDefault();
		if($(e.target).parent().hasClass('disabled')) return;
		
		
		delete this.options.page;
		delete this.options.sort;
		delete this.options.filter;

		var filterValue = _($(e.target).attr('href')).strRightBack('#');
		
		// Set the filter value in the options of the view //
		var globalSearch = {};
		if(filterValue != 'delete-filter'){
			this.options.filter =  'state-' + filterValue;
		}
		else{
			delete this.options.filter;
		}
		
		this.filterValue = this.options.filter;
		
		app.views.planning.partialRender();
		app.views.paginationView.render();

	},	
	
	/**
	 * Go to page
	 */
	goToPage: function(e){
		e.preventDefault()
		
		delete this.options.page;
		delete this.options.sort;
		delete this.options.filter;

		this.options.filter =   this.filterValue;		
				
		var link = $(e.target);
		
		this.options.page = _(link.attr('href')).strRightBack('/page');		
			
		app.views.planning.partialRender();		
	},

});