define([
	'app', 

	'genericCollection',
	'requestModel'

], function(app, GenericCollection, RequestModel){

	'use strict';


	/******************************************
	* Requests Collection
	*/
	var FiltersCollection = GenericCollection.extend({

		model        : RequestModel,

		url          : '/api/open_object/filters',

		fields       : ['id', 'name', 'user_id', 'domain', 'context', 'model_id'],

		advanced_searchable_fields: [],

		default_sort : { by: 'id', order: 'DESC' },


		/** Collection Initialization
		*/
		initialize: function (options) {
		},


		/** Collection Sync
		*/
		sync: function(method, model, options){

			options.data.fields = this.fields;

			return $.when(
				this.count(options),
				Backbone.sync.call(this,method,this,options)
			);
		}

	});

return FiltersCollection;

});