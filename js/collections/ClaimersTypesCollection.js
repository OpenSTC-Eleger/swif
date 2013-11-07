/******************************************
* Claimers Types Collection
*/
app.Collections.ClaimersTypes = app.Collections.GenericCollection.extend({

	model       : app.Models.ClaimerType,

	url         : '/api/open_object/partner_types',

	fields      : ["id", "name", "code", "actions"],

	default_sort: { by: 'name', order: 'ASC' },

	

	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Claimer type collection Initialization');
	}

});