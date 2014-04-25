/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'categoryConsumableModel'

], function(GenericCollection, CategoryConsumableModel){

	'use strict';


	/******************************************
	* Consumable Categorie Collection - Intervention classification for budget
	*/
	var CategoriesConsumablesCollection = GenericCollection.extend({

		model        : CategoryConsumableModel,

		url          : '/api/open_object/consumable_categories',

		fields       : ['id', 'name', 'code', 'price',  'service_ids', 'service_names' ], //'consumable_parent_id', 'consumable_parent_name',

		default_sort : { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Categorie collection Initialization');
		},

	});

	return CategoriesConsumablesCollection;

});