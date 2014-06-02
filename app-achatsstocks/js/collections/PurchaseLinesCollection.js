/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'purchaseLineModel'

], function(GenericCollection, PurchaseLineModel){

	'use strict';


	/******************************************
	* Budget Lines collection
	*/
	return GenericCollection.extend({

		model        : PurchaseLineModel,

		url          : '/api/open_achats_stock/purchase_lines',

		fields       : ['id', 'name', 'product_id', 'product_qty', 'taxes_id', 'price_unit', 'budget_line_id'],

		default_sort : { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Categories Tasks Initialization');
		}

	});
});