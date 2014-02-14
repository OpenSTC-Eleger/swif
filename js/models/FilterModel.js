define([
	'app',
	'genericModel',

], function(app, GenericModel){

	'use strict';


	/******************************************
	* Filter Model
	*/
	var FilterModel = GenericModel.extend({


		fields     : ['id', 'name', 'user_id', 'domain', 'context', 'model_id', 'description', 'pre_recorded'],

		urlRoot    : '/api/open_object/filters',
		
		defaults   :{
			name    : null,
			user_id : null,
			model_id: null,
			domain  : null,
		},


		searchable_fields: [
			{ key: 'id',   type: 'numeric' },
			{ key: 'name', type: 'text' }
		],


		/** Model Initialization
		*/
		initialize: function () {
			//console.log("Filter Model Initialization");
		},
		
		getName: function() {
			return this.get('name');
		},
		setName: function(value, silent) {
			this.set({ name: value }, {silent: silent});
		},

		getDescription: function() {
			return this.get('description');
		},
		setDescription: function(value, silent) {
			this.set({ description: value }, {silent: silent});
		},

	});

	return FilterModel;

});