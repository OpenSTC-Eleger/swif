/******************************************
* Equipments Collection
*/
app.Collections.Equipments = app.Collections.GenericCollection.extend({

	model: app.Models.Equipment,
	
	url  : '/api/openstc/equipments',


	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Equipment collection Initialization');
	},


});