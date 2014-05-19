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
			{ key: 'name',  type: 'text', label: app.lang.name }
		],


		getService : function(type){

			var returnVal;

			switch (type){
				case 'id':
						returnVal = this.get('service_id')[0];
					break;
				case 'json':
					returnVal = {id: this.get('service_id')[0], name: this.get('service_id')[1]};
					break;
				default:
					returnVal = this.get('service_id')[1];
			};

			return returnVal;
		},


		getPlannedAmount: function(){
			return this.get('planned_amount');
		},


		getSpentAmount: function(){
			return this.get('openstc_practical_amount');
		}


	});

	return BudgetModel;

});