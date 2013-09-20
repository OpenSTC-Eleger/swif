/******************************************
* Equipments Collection
*/
app.Collections.Equipments = app.Collections.GenericCollection.extend({

	model       : app.Models.Equipment,
		
	url         : '/api/openstc/equipments',
		
	fields      : ['id', 'name', 'maintenance_service_ids', 'internal_use', 'service_ids', 'immat', 'marque', 'usage', 'type', 'cv', 'year', 'time', 'km', 'energy_type', 'length_amort', 'purchase_price', 'default_code', 'categ_id', 'service_names', 'maintenance_service_names', 'complete_name'],
		
	default_sort: { by: 'name', order: 'ASC' },



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Equipment collection Initialization');
	}

});