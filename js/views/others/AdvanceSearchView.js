define([
	'app',
	'appHelpers',
	
	'fieldContainerView'	

], function(app, AppHelpers, FieldContainerView){

	'use strict';


	/******************************************
	* Advanced Search View
	*/
	var AdvanceSearchView = Backbone.View.extend({
		
		el              : '#advanced-filters-bar',
		templateHTML 	: 'others/advanceSearch.html',
		
		
		// The DOM events //
		events: {
			'submit #formApplyFilters'		: 'applyFilterForm'
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
				});

				$(self.el).html(template);
	
				
				self.fieldContainerView = new FieldContainerView({ searchableFields : self.collection.advanced_searchable_fields} )
				
				$('#navbar li:not(.nav-header)').first().addClass('active');

			});

			$(this.el).hide().fadeIn();

			return this;
		},



		/** Prepares filters for generic list view
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

	});

	return AdvanceSearchView;

});