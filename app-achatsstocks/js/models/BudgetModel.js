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
			}

			return returnVal;
		},


		getPlannedAmount: function(){
			return this.getCurrencyString('planned_amount');
		},


		getSpentAmount: function(){
			if(this.get('openstc_practical_amount') > 0){
				return this.getCurrencyString('openstc_practical_amount');
			}
			else{
				return '';
			}
		},


		getRemainAmount: function(withSymbol){
			var cost = this.get('planned_amount') - this.get('openstc_practical_amount');
			cost = _.numberFormat(cost, 2, '.', ' ');

			if(withSymbol) {
				cost += '&euro;';
			}

			return cost;

		},


		/** Get the percentage cost
		*/
		getSpentAmountPercentage: function() {
			return _.toNumber((this.get('openstc_practical_amount') * 100) / this.get('planned_amount'), 2);
		},



		/** Get the state of the Budget
		*/
		getState: function() {
			return this.get('state');
		},




	}, {

		// Status of the requests //
		state : {
			confirm: { // ena ttente
				key        : 'confirm',
				color      : 'info',
				translation: app.lang.wait
			},
			validate: {
				key        : 'validate',
				color      : 'success',
			},
			done: {
				key        : 'done',
				color      : 'default',
				translation: app.lang.completed
			},
			cancel: {
				key        : 'cancel',
				color      : 'danger',
				translation: app.lang.stateCancelled
			}
		}

	});

	return BudgetModel;

});