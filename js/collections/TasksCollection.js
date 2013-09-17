/******************************************
* Tasks Collection
*/
app.Collections.Tasks = app.Collections.GenericCollection.extend({

	model : app.Models.Task,
	
	url   : '/api/openstc/tasks',
	
	fields: ['id', 'name', 'site1','actions','absent_type_id', 'category_id', 'date_end', 'date_start', 'effective_hours', 'equipment_ids', 'equipment_names', 'km', 'oil_price', 'oil_qtity', 'planned_hours', 'project_id', 'remaining_hours', 'state', 'team_id', 'total_hours', 'user_id'],
	default_sort: { by: 'date_start', order: 'ASC' },
	
	/** Collection Initialization
	*/
	initialize: function (options) {
		//console.log('Task collection Initialization');
	},

});