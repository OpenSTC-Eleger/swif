/******************************************
* Equipments Collection
*/
app.Collections.EquipmentsTypes = app.Collections.GenericCollection.extend({

	model  : app.Models.EquipmentType,
	
	url    : '/api/openstc/equipment_categories',
	
	fields : ['id', 'name', 'is_equipment', 'is_vehicle'],



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Equipment collection Initialization');
	},


});