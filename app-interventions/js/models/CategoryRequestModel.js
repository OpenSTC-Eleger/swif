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
	* Category Request  Model - Intervention classification for budget
	*/
	var CategoryRequestModel = GenericModel.extend({


		fields     : ['id', 'name', 'code', 'actions'],

		urlRoot    : '/api/openstc/intervention_categories',


		searchable_fields: [
			{ key: 'name', type: 'text' },
			{ key: 'code', type: 'text' }
		],


		getCode : function() {
			return this.get('code');
		},
		setCode : function(value, silent) {
			this.set({ code : value }, {silent: silent});
		},


		/** Get Informations of the model
		*/
		getInformations : function(){
			var informations = {};

			informations.name = this.getName();

			informations.infos = {};
			informations.infos.key = _.capitalize(app.lang.code);
			informations.infos.value = this.getCode();

			return informations;
		},

	});

	return CategoryRequestModel;

});