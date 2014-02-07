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
			
		fields      : ['id', 'name', 'immat', 'marque', 'purchase_date', 'time', 'km', 'categ_id', 'qty_available', 'color'],

		default_sort: { by: 'name', order: 'ASC' },

		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Equipment collection Initialization');
		}

	});

	return EquipmentsCollection;

});