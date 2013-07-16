/******************************************
* Claimers Collection
*/
app.Collections.Claimers = app.Collections.GenericCollection.extend({

	model : app.Models.Claimer,

	// Model name in the database //
	model_name : 'res.partner',

	url: "demandeurs",   
	


	/** Collection Initialization
	*/
	initialize : function() {
		//console.log('Claimer collection initialize');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options) {
		var fields = ["address", "category_id", "contract_ids", "id", "email", "name", "phone", "service_id", "task_ids", "technical_service_id", "technical_site_id", "title", "type_id", "user_id"];

		return app.readOE(this.model_name, app.models.user.getSessionID(), options, fields);
	},



	/** Collection Parse
	*/
	parse: function(response) {
		return response.result.records;
	},



	/** Comparator for ordering collection
	*/
	comparator: function(item) {
	  return item.get("name");
	},

});
