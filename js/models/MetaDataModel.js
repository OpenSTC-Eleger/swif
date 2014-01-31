define([
	'app',
	'genericModel',
	'moment'

], function(app, GenericModel, moment){

	'use strict';


	/******************************************
	* Request Model
	*/
	var MetaDataModel = GenericModel.extend({


		fields     : ['id', 'name', 'model', 'info'],

		urlRoot    : '/api/open_object/meta_datas',


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
			//console.log("Meta Model Initialization");
		},
		
		filters: function() {
			var metaModel = this;
			return $.when($.ajax({
				async: true,
				url: this.urlRoot + '/' + this.get("id") + '/filters',
				headers: {Authorization: 'Token token=' + app.current_user.getAuthToken()},
				success: function (data) {
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