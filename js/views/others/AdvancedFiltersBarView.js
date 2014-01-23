define([
	'app',
	'appHelpers',
	
	'claimersServicesCollection',

	'advancedSelectBoxView',
	'fieldContainerView'	

], function(app, AppHelpers, ClaimersServicesCollection, AdvancedSelectBoxView, FieldContainerView){

	'use strict';


	/******************************************
	* Advanced Filter Bar View
	*/
	var AdvancedFiltersBarView = Backbone.View.extend({
		
		el              : '#advanced-filters-bar',
		templateHTML 	: 'others/advancedFiltersBar.html',
		
		
		// The DOM events //
		events: function(){
			return _.defaults({
				//'change #searchServices' 					: 'change',
				'submit #formApplyFilters'					: 'applyFilterForm',
			});
		},


		/** View Initialization
		*/
		initialize: function(options){
			this.collection = options.collection;
			this.view = options.view;
			
			this.render();
		},



		/** View Render
		*/
		render: function(){
			var self = this;
			
			// Retrieve the template //
			$.get("templates/" + this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang             : app.lang,
					pageTitle		 : "Filtres avançés"

				});

				$(self.el).html(template);
				
				if($('#divNavbar').hasClass('hide')){
					$('#divNavbar').removeClass('hide');
					$('#advanced-filters').removeClass('disabled');
					$('#divTable').addClass('span10');
				}
				else {
					$('#advanced-filters').addClass('disabled');
				}				
				
				self.fieldContainerView = new FieldContainerView({ searchableFields : self.collection.searchable_fields} )
				
				$('#navbar li:not(.nav-header)').first().addClass('active');


			});

			$(this.el).hide().fadeIn();

			return this;


		},
		
		/*
		*/
		applyFilterForm: function(e){

			e.preventDefault();
			var self = this;
			

			var advancedSearch = {};
			
			_.each(self.fieldContainerView.components, function(c,i) {
				var search = AppHelpers.getComponentValue(c);
				if(!_.isUndefined(search)) {
					advancedSearch[c.field.key] = search;
				}
			});

			this.view.applyAdvancedFilters(advancedSearch)

		}			

//			var filters = []
//		    var size = _.size(this.fieldContainerView.components)
//			_.each(self.fieldContainerView.components, function(c,i) {
//				var filter = AppHelpers.getFilterDomain(c);
//				if(!_.isUndefined(filter)) {
//					filters.push(filter)
//				}
//			})
//
//            var fetchParams = {
//               				reset      : true,
//               				data       : {
//               					limit  : app.config.itemsPerPage,
//               					offset : this.options.page.offset,
//               					sort   : this.options.sort.by+' '+this.options.sort.order
//               				}
//               			};  
//            if(_.size(filters)>0) {
//            	fetchParams.data.filters = app.objectifyFilters(filters)            
//            	this.collection.fetch(fetchParams)
//            }
			

		//},


	});

return AdvancedFiltersBarView;

});