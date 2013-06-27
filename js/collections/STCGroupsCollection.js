/******************************************
* Groups Collection - User groups for OpenERP
*/
app.Collections.STCGroups = Backbone.Collection.extend({

	model: app.Models.STCGroup,

	// Model name in the database //
	model_name : 'res.groups',

	url: "groups",



	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Groups collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options) {
		var fields = ["code", "full_name", "id", "name"];

		return app.readOE( this.model_name ,  app.models.user.getSessionID(), options, fields);
	},



	/** Collection Parse
	*/
	parse: function(response) { 
		return _.filter(response.result.records, function(record){
			return _.startsWith(record.name.toLowerCase(),"openstc");
		})
		//return response.result.records;
	},



	/** Comparator for ordering collection
	*/
	comparator: function(item) {
	  return item.get("name");
	}

});
