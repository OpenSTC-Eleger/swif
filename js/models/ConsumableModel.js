/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'genericModel'

], function(app, GenericModel){

	'use strict';


	/******************************************
	* Category Consumable  Model - Intervention classification for budget
	*/
	var ConsumableModel = GenericModel.extend({


		fields     : ['id', 'name', 'code', 'complete_name',  'type_id', 'type_name', 'price'],

		urlRoot    : '/api/open_object/consumables',


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

		getPrice : function() {
			return this.get('price');
		},
		setPrice : function(value, silent) {
			this.set({ price : value }, {silent: silent});
		},

		getName : function() {
			return this.get('name');
		},
		setName : function(value, silent) {
			this.set({ name : value }, {silent: silent});
		},

		getCompleteName : function() {
			return _.titleize(this.get('complete_name').toLowerCase());
		},


		getType : function(type) {

			var id, name = '';

			// Check if the place have a parent place //
			if(this.get('type_id')){
				id = this.get('type_id')[0];
				if(!_.isUndefined(this.get('type_id')[1])) {
					name = _.titleize(this.get('type_id')[1].toLowerCase());
				}
				else {
					name = this.get('type_name');
				}
			}

			var returnVal;

			switch (type){
				case 'id':
					returnVal = id;
					break;
				case 'all':
					returnVal = this.get('type_id');
					break;
				case 'json':
					returnVal = {id: id, name: name};
					break;
				default:
					returnVal = name;
			}

			return returnVal;
		},
		setType : function(value, silent) {
			this.set({ Type_id : value }, {silent: silent});
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

	return ConsumableModel;

});