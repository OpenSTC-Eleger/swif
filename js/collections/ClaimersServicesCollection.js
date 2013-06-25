/******************************************
* Claimers Services Collection
*/
app.Collections.ClaimersServices = Backbone.Collection.extend({

	model : app.Models.ClaimerService,

	// Model name in the database //
	model_name : 'openstc.service',

	url: 'demandeurs-services',



	/** Collection Initialization
	*/
	initialize : function() {
		console.log('Claimer Service collection initialize');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options) {
		var fields = ["asksBelongsto", "category_ids", "code", "id", "manager_id", "name", "service_id", "technical", "user_ids"];

		app.readOE(this.model_name, app.models.user.getSessionID(), options, fields);
	},



	/** Collection Parse
	*/
	parse: function(response) {
		return response.result.records;
	},
	


	/** Comparator for ordering collection
	*/
	comparator: function(item) {
		return item.get('name');
	},

});