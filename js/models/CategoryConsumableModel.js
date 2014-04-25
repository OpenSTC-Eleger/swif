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
	var CategoryConsumableModel = GenericModel.extend({


		fields     : ['id', 'name', 'code', 'price',  'service_ids', 'service_names' ], //'consumable_parent_id', 'consumable_parent_name',

		urlRoot    : '/api/open_object/consumable_categories',


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
		getParentConsumable : function(type) {

			var id, name = '';
			
			// Check if the place have a parent place //
			if(this.get('consumable_parent_id')){
				id = this.get('consumable_parent_id')[0];
				if(!_.isUndefined(this.get('consumable_parent_id')[1])) {
					name = _.titleize(this.get('consumable_parent_id')[1].toLowerCase());
				}
				else {
					name = this.get('consumable_parent_name');
				}
			}
			
			var returnVal;
			
			switch (type){
				case 'id':
					returnVal = id;
					break;
				case 'all':
					returnVal = this.get('consumable_parent_id');
					break;
				case 'json':
					returnVal = {id: id, name: name};
					break;
				default:
					returnVal = name;
			}
			
			return returnVal;
		},
		setParentConsumable : function(value, silent) {
			this.set({ consumable_parent_id : value }, {silent: silent});
		},
		
		getServices : function(type){
			
			var placeServices = [];
			
			_.each(this.get('service_names'), function(s){
				switch (type){
					case 'id':
						placeServices.push(s[0]);
						break;
					case 'json':
						placeServices.push({id: s[0], name: s[1]});
						break;
					default:
						placeServices.push(s[1]);
				}
			});
			
			if(type == 'string'){
				return _.toSentence(placeServices, ', ', ' '+app.lang.and+' ');
			}
			else{
				return placeServices;
			}
		},
		setServices : function(value, silent) {
			this.set({ service_ids : [[6, 0, value]] }, {silent: silent});
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

	return CategoryConsumableModel;

});