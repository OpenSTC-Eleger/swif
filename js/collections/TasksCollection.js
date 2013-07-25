/******************************************
* Tasks Collection
*/
app.Collections.Tasks = app.Collections.GenericCollection.extend({

	model: app.Models.Task,

	// Model name in the database //
	model_name : 'project.task',

	url: 'taches',


	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Tasks collection Initialization');
	},



	/** Collection Sync
	*/
	sync: function(method, model, options) {
		var fields = ["actions","absent_type_id", "active", "ask_id", "belongsToCategory", "cancel_reason", "category_id", "create_date", "date_end", "date_start", "effective_hours", "equipment_ids", "id", "intervention", "intervention_assignement_id", "km", "manager_id", "name", "oil_price", "oil_qtity", "planned_hours", "project_id", "remaining_hours", "state", "teamWorkingOn", "team_id", "total_hours", "type_id", "user_id"];

		return app.readOE(this.model_name , app.models.user.getSessionID(), options, fields);
	},



	/** Collection Parse name
	*/
	parse: function(response) {
		return response.result.records;
	},



	comparator: function(item) {
	   return -item.get("date_start");
	},

});
