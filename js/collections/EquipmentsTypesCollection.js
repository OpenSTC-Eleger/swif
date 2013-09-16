/******************************************
* Equipments Collection
*/
app.Collections.EquipmentsTypes = app.Collections.GenericCollection.extend({

	model       : app.Models.EquipmentType,
	
	url         : '/api/openstc/equipment_categories',
	
	default_sort: { by: 'name', order: 'ASC' },


	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Equipment collection Initialization');
	},


});