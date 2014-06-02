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
	* Budget Line Model
	*/
	var BudgetLineModel = GenericModel.extend({


		urlRoot : '/api/open_achats_stock/budget_lines',


		searchable_fields: [
			{ key: 'name',  type: 'text' }
		],



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



		/** Get M14 account
		*/
		getM14Account : function(type){
			var returnVal;

			switch (type){
				case 'id':
					returnVal = this.get('openstc_general_account')[0];
					break;
				case 'json':
					returnVal = {id: this.get('openstc_general_account')[0], name: this.get('openstc_general_account')[1]};
					break;
				default:
					returnVal = this.get('openstc_general_account')[1];
			}

			return returnVal;
		},



		/** Get Informations of the model
		*/
		getInformations : function(){
			var informations = {};

			informations.name = this.getName();

			informations.infos = {};
			informations.infos.key = app.lang.achatsstocks.m14Account;
			informations.infos.value = this.getM14Account();

			return informations;
		}


	});

	return BudgetLineModel;

});