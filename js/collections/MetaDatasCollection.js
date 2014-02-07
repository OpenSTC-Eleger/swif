define([
	'app', 

	'genericCollection',
	'metaDataModel'

], function(app, GenericCollection, MetaDataModel){

	'use strict';


	/******************************************
	* Metadatas Collection
	*/
	var MetaDatasCollection = GenericCollection.extend({

		model        : MetaDataModel,

		url          : '/api/open_object/meta_datas',

		fields       : ['id', 'name', 'model', 'info'],

		advanced_searchable_fields: [],

		default_sort : { by: 'id', order: 'DESC' },


		/** Collection Initialization
		*/
		initialize: function () {
		},


		/** Collection Sync
		*/
		sync: function(method, model, options){

			options.data.fields = this.fields;

			return $.when(
				Backbone.sync.call(this,method,this,options)
			);
		}

	});

	return MetaDatasCollection;

});