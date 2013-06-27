/******************************************
* Place Type Collection
*/
app.Collections.PlaceTypes = Backbone.Collection.extend({

	model: app.Models.PlaceType,

	// Model name in the database //
	model_name : 'openstc.site.type',



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Sites types collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options) {
		var fields = ["code", "name", "id"];

		return app.readOE( this.model_name, app.models.user.getSessionID(), options, fields);
	},



	/** Collection Parse
	*/
	parse: function(response) {
		return response.result.records;
	},



	/** Comparator for ordering collection
	*/
	comparator: function(item) {
	  return item.get("name");
	},


});
