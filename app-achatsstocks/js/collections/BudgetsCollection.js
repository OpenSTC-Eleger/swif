/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'genericCollection',
	'budgetModel'

], function(app, GenericCollection, BudgetModel){

	'use strict';


	/******************************************
	* Budgets collection
	*/
	var BudgetsCollection = GenericCollection.extend({

		model        : BudgetModel,

		url          : '/api/open_achats_stock/budgets',

		fields       : ['id', 'name', 'service_id', 'planned_amount', 'openstc_practical_amount', 'date_from', 'date_to', 'state', 'actions', 'validate_note', 'done_note', 'cancel_note', 'new_name', 'new_date_from', 'new_date_to'],

		default_sort : { by: 'date_from', order: 'DESC' },

		advanced_searchable_fields: [
			{ key: 'planned_amount' },
			{ key: 'openstc_practical_amount' },
			{ key: 'service_id' },
			{ key: 'date_from' },
			{ key: 'date_to' }
		],



		/** Collection Initialization
		*/
		initialize: function () {

			// Set field translation //
			this.advanced_searchable_fields[0].label = app.lang.achatsstocks.plannedAmount;
			this.advanced_searchable_fields[1].label = app.lang.achatsstocks.spentAmount;
			this.advanced_searchable_fields[2].label = app.lang.service;
			this.advanced_searchable_fields[3].label = app.lang.dateStart;
			this.advanced_searchable_fields[4].label = app.lang.dateEnd;
		}

	});

	return BudgetsCollection;

});