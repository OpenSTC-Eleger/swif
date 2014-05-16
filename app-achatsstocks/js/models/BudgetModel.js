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
	* Budget Model
	*/
	var BudgetModel = GenericModel.extend({


		urlRoot : '/api/open_achats_stock/budgets',


		searchable_fields: [
			{ key: 'name',  type: 'text' }
		],



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

			if(type === 'string'){
				return _.toSentence(placeServices, ', ', ' '+app.lang.and+' ');
			}
			else{
				return placeServices;
			}
		},

		setServices : function(value, silent) {
			this.set({ service_ids : [[6, 0, value]] }, {silent: silent});
		}

	});

	return BudgetModel;

});