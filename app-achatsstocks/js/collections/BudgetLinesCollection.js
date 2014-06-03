/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'budgetModel',

	'budgetLineModel'

], function(GenericCollection, BudgetModel, BudgetLineModel){

	'use strict';


	/******************************************
	* Budget Lines collection
	*/
	var BudgetLinesCollection = GenericCollection.extend({

		model        : BudgetLineModel,

		url          : '/api/open_achats_stock/budget_lines',

		fields       : ['id', 'name', 'service_names', 'openstc_practical_amount', 'planned_amount', 'crossovered_budget_id', 'analytic_account_id', 'openstc_general_account', 'complete_name'],

		default_sort : { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Categories Tasks Initialization');
		}

	});

	return BudgetLinesCollection;

});