/******************************************
* Equipments Collection
*/
app.Collections.Equipments = Backbone.Collection.extend({

	model: app.Models.Equipment,

	// Model name in the database //
	model_name : 'openstc.equipment',

	url: 'equipments',



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Equipment collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options) {
		var fields = ["commercial_vehicle:", "complete_name", "cv", "energy_type", "fat_material", "id", "immat", "km", "manager_id", "marque", "name", "service", "service_ids", "service_technical_id", "small", "small_material", "technical", "technical_vehicle", "time", "type", "type_prod", "usage", "year"];

		app.readOE(this.model_name, app.models.user.getSessionID(), options, fields);
	},



	/** Collection Parse
	*/
	parse: function(response) {
		// keeps only STC materials //
		var records = response.result.records;
		records = _.filter(records, function(record){
			return record.technical_vehicle || record.commercial_vehicle
					|| record.fat_material || record.small_material;
		});

		return records;
	},
	
	

	/** Comparator for ordering collection
	*/
	comparator: function(item) {
	  return item.get('name');
	},

});
