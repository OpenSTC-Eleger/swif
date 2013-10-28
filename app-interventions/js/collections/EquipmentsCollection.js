/******************************************
* Equipments Collection
*/
app.Collections.Equipments = app.Collections.GenericCollection.extend({

	model       : app.Models.Equipment,
		
	url         : '/api/openstc/equipments',
		
	fields      : ['id', 'name', 'immat', 'marque', 'purchase_date', 'time', 'km', 'categ_id'],

	default_sort: { by: 'name', order: 'ASC' },



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Equipment collection Initialization');
	}

});