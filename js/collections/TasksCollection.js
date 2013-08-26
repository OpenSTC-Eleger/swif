/******************************************
* Tasks Collection
*/
app.Collections.Tasks = app.Collections.GenericCollection.extend({

	model: app.Models.Task,

	// Model name in the database //
	model_name : 'project.task',

	url: '/api/openstc/tasks',


	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Tasks collection Initialization');
	},
	//i put fields in Collection attribute to be able to pass it to other OpenERP custom functions
	fields: ["site1","actions","absent_type_id", "category_id", "date_end", "date_start", "effective_hours", "equipment_ids", "id", "km", "name", "oil_price", "oil_qtity", "planned_hours", "project_id", "remaining_hours", "state", "team_id", "total_hours", "user_id"],

	/** Collection Sync
	*/

	comparator: function(item) {
	   return -item.get("date_start");
	},

});
