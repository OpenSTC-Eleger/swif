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
		initialize: function (options) {
			//console.log('Equipment collection Initialization');
		},


	});

return EquipmentsTypesCollection;

});