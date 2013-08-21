/******************************************
* AbsentType Collection - Leave Time Type
*/
app.Collections.AbsentTypes = app.Collections.GenericCollection.extend({

	model: app.Models.AbsentType,


	// Model name in the database //
	model_name : 'openstc.absent.type',
	
	url: "/absent",


	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Absent Types collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options) {
		var fields = ["id", "code", "name", "description"];

		return app.readOE(this.model_name, app.models.user.getSessionID(), options, fields);
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
