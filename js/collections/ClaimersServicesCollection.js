/******************************************
* Claimers Services Collection
*/
app.Collections.ClaimersServices = app.Collections.GenericCollection.extend({

	model        : app.Models.ClaimerService,

	fields       : ['id', 'category_ids', 'code', 'manager_id', 'name', 'service_id', 'technical', 'user_ids'],

	default_sort : { by: 'name', order: 'ASC' },

	url          : '/api/openstc/departments',



	/** Collection Initialization
	*/
	initialize : function() {
		//console.log('Claimer Service collection initialize');
	},

});