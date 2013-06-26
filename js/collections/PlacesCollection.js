/******************************************
* Places Collection
*/
app.Collections.Places = Backbone.Collection.extend({

	model: app.Models.Place,

	// Model name in the database //
	model_name : 'openstc.site',



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Place collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options) {
		var fields = ["code", "complete_name", "id", "lenght", "name", "service", "service_ids", "site_parent_id", "surface", "type", "width"];

		app.readOE( this.model_name, app.models.user.getSessionID(), options, fields);
	},



	/** Collection Parse
	*/
	parse: function(response) {
		return response.result.records;
	},



	/** Comparator for ordering collection
	*/
	comparator: function(item) {
	  return _.titleize( item.get('name').toLowerCase() ) ;
	},


});
