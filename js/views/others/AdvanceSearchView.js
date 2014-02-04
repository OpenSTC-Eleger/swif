define([
	'app',
	'appHelpers',
	
	'fieldContainerView',
	'modalSaveFilterView'

], function(app, AppHelpers, FieldContainerView, ModalSaveFilterView){

	'use strict';


	/******************************************
	* Advanced Search View
	*/
	var AdvanceSearchView = Backbone.View.extend({
		
		el              : '#advanced-filters-bar',
		templateHTML 	: 'templates/others/advanceSearch.html',
		
		
		// The DOM events //
		events: {
			'submit #formAdvanceSearch'	: 'applyFilterForm',
			'click #saveFilter'         : 'modalSaveFilter'
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
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang   : app.lang,
				});

				$(self.el).html(template);
	

				self.fieldContainerView = new FieldContainerView({ searchableFields : self.collection.advanced_searchable_fields} )
			});

			$(this.el).hide().fadeIn();

			return this;
		},



		/** Prepares filters for generic list view
		*/
		applyFilterForm: function(e){

			e.preventDefault();
			
			var advancedSearch = {};
			
			_.each(this.fieldContainerView.components, function(c,i) {

				var search = c.getValue();

				if(!_.isNull(search)){
					advancedSearch[c.field.key] = search;
				}
			
			});

			console.log(advancedSearch);
			
			this.view.applyAdvancedFilters(advancedSearch);
		},


		/** Display modal to save the Filter
		*/
		modalSaveFilter: function(e){

			app.views.modalSaveFilterView = new ModalSaveFilterView({
				el : '#modalSaveFilter'
			});

		}

	});

	return AdvanceSearchView;

});