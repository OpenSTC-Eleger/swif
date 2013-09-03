/******************************************
* Teams Collection
*/
app.Collections.Teams = app.Collections.GenericCollection.extend({

	model        : app.Models.Team,

	url          : '/api/openstc/teams',

	fields       : ['id', 'name', 'actions', 'manager_id', 'service_names', 'user_names'],

	default_sort : { by: 'name', order: 'ASC' },



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Teams collection Initialization');
	},

});