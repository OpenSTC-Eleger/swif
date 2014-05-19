/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'budgetModel'

], function(GenericCollection, BudgetModel){

	'use strict';


	/******************************************
	* Budgets collection
	*/
	var BudgetsCollection = GenericCollection.extend({

		model        : BudgetModel,

		url          : '/api/open_achats_stock/budgets',

		fields       : ['id', 'name', 'service_id', 'planned_amount', 'openstc_practical_amount', 'date_from'],

		default_sort : { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Categories Tasks Initialization');
		}

	});

	return BudgetsCollection;

});