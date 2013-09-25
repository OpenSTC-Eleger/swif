/******************************************
* Groups Collection - User groups for OpenERP
*/
app.Collections.STCGroups = app.Collections.GenericCollection.extend({

	model: app.Models.STCGroup,


	url: '/api/open_object/groups',


	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Groups collection Initialization');
	},

});
