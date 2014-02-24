/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

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

		fields       : ['id', 'name', 'user_id', 'domain', 'context', 'model_id', 'description', 'pre_recorded'],

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
				this.count(options),
				Backbone.sync.call(this,method,this,options)
			);
		}

	});

	return FiltersCollection;

});