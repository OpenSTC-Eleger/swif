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
		]


	});

	return BudgetLineModel;

});