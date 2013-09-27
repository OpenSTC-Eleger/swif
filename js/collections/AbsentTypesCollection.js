/******************************************
* AbsentType Collection - Leave Time Type
*/
app.Collections.AbsentTypes = app.Collections.GenericCollection.extend({

	model       : app.Models.AbsentType,

	url         : "/api/openstc/absence_categories",

	fields      : ['id', 'name', 'code', 'description', 'actions'],

	default_sort: { by: 'name', order: 'ASC' },



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Place collection Initialization');
	},

});