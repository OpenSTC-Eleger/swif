define([
	'app',
	'genericModel',
	'moment'

], function(app, GenericModel, moment){

	'use strict';


	/******************************************
	* Request Model
	*/
	var FilterModel = GenericModel.extend({


		fields     : ['id', 'name', 'user_id', 'domain', 'context', 'model_id'],

		urlRoot    : '/api/open_object/filters',


		searchable_fields: [
			{
				key  : 'id',
				type : 'numeric'
			},
			{
				key  : 'name', 
				type : 'text'
			}
		],


		/** Model Initialization
		*/
		initialize: function (model) {
			//console.log("Filter Model Initialization");
		},

	});

return FilterModel;

});