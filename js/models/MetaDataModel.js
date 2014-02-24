/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'genericModel'

], function(app, GenericModel){

	'use strict';


	/******************************************
	* Meta Model
	*/
	var MetaDataModel = GenericModel.extend({


		fields     : ['id', 'name', 'model', 'info'],

		urlRoot    : '/api/open_object/meta_datas',



		/** Model Initialization
		*/
		initialize: function () {
			//console.log("Meta Model Initialization");
		},



		filters: function() {
			var metaModel = this;

			return $.when($.ajax({
				async   : true,
				url     : this.urlRoot + '/' + this.get('id') + '/filters',
				headers : {Authorization: 'Token token=' + app.current_user.getAuthToken()},
				success : function (data) {
					metaModel.setFilters(data);
				}
			}));
		},



		getFilters: function() {
			return this.get('filters');

		},
		setFilters : function(value) {
			this.set({ filters : value });
		},

	});

	return MetaDataModel;

});