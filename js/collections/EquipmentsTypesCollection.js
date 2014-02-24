/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'equipmentTypeModel'

], function(GenericCollection, EquipmentTypeModel){

	'use strict';


	/******************************************
	* Equipments Collection
	*/
	var EquipmentsTypesCollection = GenericCollection.extend({

		model  : EquipmentTypeModel,

		url    : '/api/openstc/equipment_categories',

		fields : ['id', 'name', 'is_equipment', 'is_vehicle'],



		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Equipment collection Initialization');
		},


	});

	return EquipmentsTypesCollection;

});