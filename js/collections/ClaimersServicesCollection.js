/******************************************
* Claimers Services Collection
*/

// fields = ["category_ids", "code", "id", "manager_id", "name", "service_id", "technical", "user_ids"]

app.Collections.ClaimersServices = app.Collections.GenericCollection.extend({

	model : app.Models.ClaimerService,

	// Model name in the database //
	model_name : 'openstc.service',

	url: '/api/openstc/departments',



	/** Collection Initialization
	*/
	initialize : function() {
		//console.log('Claimer Service collection initialize');
	},

	/** Comparator for ordering collection
	*/
	comparator: function(item) {
		return item.get('name');
	},

});
