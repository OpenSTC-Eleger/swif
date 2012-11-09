/******************************************
* Request Model
*/
openstm.Models.Task = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'project.task',	
	
	url: "/#taches/:id",




//	relations: [
//	{
//		// Create a cozy, recursive, one-to-one relationship
//		type: Backbone.HasOne,
//		key: 'project_id',
//		relatedModel: 'openstm.Models.Intervention',
//		includeInJSON: true,
//		reverseRelation: {
//			key: 'tasks'
//		}
//	}],
	

	/** Model Initialization
	*/
	initialize: function (model) {
	   	console.log("Request task Initialization");
	},



    /** Model Parser
    */
    parse: function(response) {
        return response;
    },
    
	/** Save Model
		*/
	save: function(params, options, create) {
		var data = {};
		data.date_start = params.date_start;
		data.date_end = params.date_end;
		data.planned_hours = params.planned_hours;
		data.user_id = params.user_id;	      	
		openstm.saveOE(data, params.task_id, this.model_name,openstm.models.user.getSessionID(), options);
	},


});