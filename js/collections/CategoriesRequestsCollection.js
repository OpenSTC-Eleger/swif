/******************************************
* Request Categorie Collection - Intervention classification for budget
*/
app.Collections.CategoriesRequests = app.Collections.GenericCollection.extend({

	model        : app.Models.CategoryRequest,

	url          : '/api/openstc/intervention_categories',

	fields       : ['id', 'name', 'code', 'actions'],

	default_sort : { by: 'name', order: 'ASC' },



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Categorie Intervention collection Initialization');
	},

});
