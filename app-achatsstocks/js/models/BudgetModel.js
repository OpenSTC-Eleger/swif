/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'genericModel',

	'moment'

], function(app, GenericModel, moment){

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


		/** Get start date
		*/
		getStartDate: function(){
			return moment(this.get('date_from'), 'YYYY-MM-DD').format('DD/MM/YYYY');
		},

		/** Get end date
		*/
		getEndDate: function(){
			return moment(this.get('date_to'), 'YYYY-MM-DD').format('DD/MM/YYYY');
		},


		/** Get the state of the Budget
		*/
		getState: function() {
			return this.get('state');
		},


		/** Get the note according to the state of the Budget
		*/
		getNote: function() {
			var returnVal;

			switch(this.getState()){
				case BudgetModel.state.cancel.key:
					returnVal = this.get('cancel_note');
					break;
				case BudgetModel.state.validate.key:
					returnVal = this.get('validate_note');
					break;
				case BudgetModel.state.done.key:
					returnVal = this.get('done_note');
					break;
			}

			return returnVal;
		},



		/** Get actions
		*/
		getActions: function() {
			return this.get('actions');
		},


		/** Get Informations of the model
		*/
		getInformations : function(){
			var informations = {};

			informations.name = this.getName();

			if(!_.isEmpty(this.getService())){
				informations.infos = {};
				informations.infos.key = _.capitalize(app.lang.service);
				informations.infos.value = this.getService();
			}

			return informations;
		}


	}, {

		// Status of the requests //
		state : {
			confirm: { // en attente
				key        : 'confirm',
				color      : 'info',
				translation: app.lang.wait
			},
			validate: {
				key        : 'validate',
				color      : 'success',
			},
			done: { // Clôturer
				key        : 'done',
				color      : 'default',
				translation: app.lang.completed
			},
			cancel: {
				key        : 'cancel',
				color      : 'danger',
				translation: app.lang.stateCancelled
			}
		},

		actions : {
			validate: {
				key        : 'validate',
				color      : 'success',
				icon       : 'fa-check',
				translation: app.lang.actions.validate
			},
			renew: {
				key        : 'renew',
				color      : 'warning',
				icon       : 'fa-repeat',
				translation: app.lang.actions.renew
			},
			done: {
				key        : 'done',
				color      : 'default',
				icon       : 'fa-archive',
				translation: app.lang.actions.close
			},
			cancel: {
				key        : 'cancel',
				color      : 'danger',
				icon       : 'fa-ban',
				translation: app.lang.actions.cancel
			}
		}

	});

	return BudgetModel;

});