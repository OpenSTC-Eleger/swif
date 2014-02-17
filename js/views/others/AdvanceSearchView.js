define([
	'app',
	'appHelpers',
	
	'filterModel',
	
	'fieldContainerView',
	'modalSaveFilterView'

], function(app, AppHelpers, FilterModel, FieldContainerView, ModalSaveFilterView){

	'use strict';


	/******************************************
	* Advanced Search View
	*/
	var AdvanceSearchView = Backbone.View.extend({
		
		el              : '#advanced-filters-bar',

		templateHTML    : 'templates/others/advanceSearch.html',
		
		
		// The DOM events //
		events: {
			'submit #formAdvanceSearch'	: 'performSearch',
			'click #saveFilter'         : 'modalSaveFilter'
		},


		/** View Initialization
		*/
		initialize: function(options){
			this.collection = options.collection;
			this.view = options.view;
		},



		/** View Render
		*/
		render: function(activeSearch){
			var self = this;

			this.activeSearch = activeSearch;
			
			// Retrieve the template //
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang   : app.lang
				});

				$(self.el).html(template);

				self.fieldContainerView = new FieldContainerView({ searchableFields: self.collection.advanced_searchable_fields, activeSearch: self.activeSearch });
			});

			$(this.el).hide().fadeIn();

			return this;
		},



		/** Prepares filters for generic list view
		*/
		performSearch: function(e){
			e.preventDefault();
			this.view.applyAdvancedFilters(this.getDomain());
		},

		getDomain: function() {
			var domain = [];
			
			_.each(this.fieldContainerView.components, function(c) {

				var field = c.field.key;
				var value = c.getValue();
				var operator = c.getOperator('key');
			
				if(!_.isNull(value)){
					domain.push({ field: field, operator: operator, value: value });
				}

			});

			return domain;
		},


		/** Transform JSON filter to readable String
		*/
		humanizeFilter: function(){

			var str = '';

			var i = 0;
			_.each(this.fieldContainerView.components, function(c) {

				var cVal = c.getValue();


				if(!_.isNull(cVal)){

					if(i !== 0){ str += app.lang.and; }
					i++;

					str += ' <strong>'+ _.capitalize(c.field.label) +'</strong> ';
					str += c.getOperator('label').toLowerCase()+ ' ';
					str += '<em class="text-underline">'+ c.getValue(true) +'</em> ';
				}

			});

			return str;
		},



		/** Display modal to save the Filter
		*/
		modalSaveFilter: function(e){
			e.preventDefault();
			var modelJSON = this.view.metaDataModel.toJSON();

			var filter = new FilterModel({
				domain   : JSON.stringify(this.getDomain()),
				user_id  : app.current_user.getUID(),
				model_id : modelJSON.model
			});

			app.views.modalSaveFilterView = new ModalSaveFilterView({
				el     : '#modalSaveFilter',
				model  : filter
			});

		}

	});

	return AdvanceSearchView;

});