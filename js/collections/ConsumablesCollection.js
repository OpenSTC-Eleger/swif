/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'consumableModel'

], function(GenericCollection, ConsumableModel){

	'use strict';


	/******************************************
	* Consumable Categorie Collection - Intervention classification for budget
	*/
	var ConsumablesCollection = GenericCollection.extend({

		model        : ConsumableModel,

		url          : '/api/open_object/consumables',

		fields       : ['id', 'name', 'code', 'complete_name',  'type_id', 'type_name', 'hour_price'],

		default_sort : { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Categorie collection Initialization');
		},

	});

	return ConsumablesCollection;

});