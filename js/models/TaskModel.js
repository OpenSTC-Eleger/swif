/******************************************
* Request Model
*/
openstm.Models.Task = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'project.task',	
	
	url: "/#taches/:id",

	defaults:{
		total_hours: 0,
		remaining_hours: 0,
	},


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
	
	save: function(data,options) { 
		openstm.saveOE(data, this.model_name,openstm.models.user.getSessionID(), options);
	},


});