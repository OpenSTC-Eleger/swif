/******************************************
* Places Collection
*/
app.Collections.Places = app.Collections.GenericCollection.extend({

	model        : app.Models.Place,

	url          : '/api/openstc/sites',

	fields       : ['id', 'actions', 'name', 'complete_name', 'service_names', 'site_parent_id', 'surface'],

	default_sort : { by: 'name', order: 'ASC' },



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Place collection Initialization');
	}

});