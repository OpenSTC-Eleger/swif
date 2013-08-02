/******************************************
* Place Type Collection
*/
app.Collections.PlaceTypes = app.Collections.GenericCollection.extend({

	model: app.Models.PlaceType,

	url: '/api/openstc/site_categories',


	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Sites types collection Initialization');
	},

	/** Comparator for ordering collection
	*/
	comparator: function(item) {
	  return item.get("name");
	},

});
