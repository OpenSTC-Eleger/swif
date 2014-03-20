/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'equipmentModel'

], function(GenericCollection, EquipmentModel){

	'use strict';


	/******************************************
	* Equipments Collection
	*/
	var EquipmentsCollection = GenericCollection.extend({

		model       : EquipmentModel,

		url         : '/api/openstc/equipments',

		fields      : ['id', 'name', 'immat', 'marque', 'purchase_date', 'time', 'km', 'categ_id', 'qty_available', 'color', 'product_product_id'],

		default_sort: { by: 'name', order: 'ASC' },

		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Equipment collection Initialization');
		}

	});

	return EquipmentsCollection;

});