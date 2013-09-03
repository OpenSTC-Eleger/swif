/******************************************
* Groups Collection - User groups for OpenERP
*/
app.Collections.STCGroups = app.Collections.GenericCollection.extend({

	model: app.Models.STCGroup,

	// Model name in the database //
	model_name : 'res.groups',

	url: "/groups",



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Groups collection Initialization');
	},

});
