/******************************************
* Place Type Collection
*/
app.Collections.PlaceTypes = app.Collections.GenericCollection.extend({

	url  : '/api/openstc/site_categories',


	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Sites types collection Initialization');
	},

});
