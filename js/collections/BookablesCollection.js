/******************************************
* Bookables Collection
*/
app.Collections.Bookables = app.Collections.GenericCollection.extend({

	model : app.Models.Bookable,
	
	url   : "/api/openresa/bookables",
	
	fields: ['id', 'name'],

});