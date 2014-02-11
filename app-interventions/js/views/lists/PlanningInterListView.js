define([
	'app',
	
	'taskModel',
	'interventionModel',

	'genericListView',
	'paginationView',
	'itemPlanningInterView',
	'itemPlanningInterTaskListView',
	'modalInterventionView'

], function(app, TaskModel, InterventionModel, GenericListView, PaginationView , ItemPlanningInterView , ItemPlanningInterTaskListView, ModalInterventionView  ){

	'use strict';


	/******************************************
	* Pagination View
	*/
	var planningInterListView = GenericListView.extend({
	
		el           : '#planningInters',
		
		templateHTML : '/templates/lists/planningInters.html',
	
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
				GenericListView.prototype.events
			);
		},
	
	
		/** View Initialization
		*/
		initialize: function(params) {
			this.options = params;
	
			var self = this;
			
			//By default display open intervention (intervention to schedule)
			this.filter = [{field:"state", operator:"=", value:"open"}];
			
			this.collections = params.collections;
			
			// Set main collection used in GenericListView
			this.collection = this.collections.interventions;
			
			app.router.render(this);
		    
		    this.collections.interventions.off();
		    this.listenTo(self.collections.interventions, 'add', this.addInter);
		},
		
		addInter: function(model){
			//If filter is on 'all state' or 'scheduled' add item view in panel
			if( _.isUndefined(this.filter.value) || this.filter.value == model.toJSON().state ) {
				var itemPlanningInterTaskListView = new ItemPlanningInterTaskListView({ model : model });	
				var itemPlanningInterView  = new ItemPlanningInterView({ model: model, detailedView:itemPlanningInterTaskListView });
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
				$( "#filterStateInterventionList li" ).children("a[href='#'" + TaskModel.status.open.key + "]").trigger( "click" );
			}
			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.interventionSaveOK);
		},
	
		/** Display the view
		*/
		render: function() {
			var self = this;		
		
			$.get(app.menus.openstc + this.templateHTML, function(templateData){
				// Set variables template //
				var template = _.template(templateData, {
					lang				: app.lang,
					interventionsState	: InterventionModel.status,
					interventions		: self.collections.interventions.toJSON(),		
					InterventionModel	: InterventionModel
				});
				
				$(self.el).html(template);
				
				// Call the render Generic View //
				GenericListView.prototype.render(self);
				
				$('*[rel="tooltip"]').tooltip();
				$('*[rel="popover"]').popover({trigger: 'hover', delay: { show: 500, hide: 100 }});
	
				
				$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
	
	
				// Set the focus to the first input of the form //
				$('#modalAddInter, #modalAddTask').on('shown', function (e) {
					$(this).find('input').first().focus();
				})
							
				_.each(self.collections.interventions.models, function(inter, i){
					
					var detailedView =new ItemPlanningInterTaskListView({model: inter});
					var simpleView = new ItemPlanningInterView({model: inter, detailedView:detailedView});
					$('#inter-items').append( simpleView.render().el );
					$('#inter-items').append(detailedView.render().el);
					simpleView.detailedView = detailedView;				
				});	
				
				
				
				// Pagination view //
				app.views.paginationView = new PaginationView({ 
					page           : self.options.page.page,
					collection     : self.collections.interventions,
					size           : 'sm',
					displayGoToPage: false,
					
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
					if( !_.isUndefined(self.options.filter) ){
						if( _.size(self.options.filter)>0 ){
							var filter = self.options.filter[0].value;						
							if( !_.isUndefined( InterventionModel.status[filter] ) ) 
								//Set color of status filter
								$('a.filter-button').addClass('text-' + InterventionModel.status[filter].color);
						}
					}
				}
				
			});
			return this;
		},
		
		/**
		 * Re calculate pagination 
		 */
		paginationRender : function(params) {
			app.views.paginationView.initialize(params.page);
			app.views.paginationView.render();
		},
		
	
		/** Display the form to add / update an intervention
		*/
		displayModalSaveInter: function(e){
			e.preventDefault();
			var params = {el:'#modalSaveInter',collection: this.collections.interventions}
			new ModalInterventionView(params);
		},
	
	
		/** Filter Intervention by status
		*/
		setFilterState: function(e){
	
			e.preventDefault();
			if($(e.target).parent().hasClass('disabled')) return;
			
			
			delete this.options.page;
			delete this.options.sort;
			delete this.options.filter;
	
			var filter = _($(e.target).attr('href')).strRightBack('#');
			
			// Set the filter value in the options of the view //
			var globalSearch = {};
			if(filter != 'delete-filter'){
				this.options.filter =  [{field:"state", operator:"=", value:filter}] ;
			}
			else{
				delete this.options.filter;
			}
			
			this.filter = this.options.filter;
			
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
	
			this.options.filter =   this.filter;		
					
			var link = $(e.target);
			
			this.options.page = _(link.attr('href')).strRightBack('/page');		
				
			app.views.planning.partialRender();		
		},
	
	});
	
		
	return planningInterListView;

});