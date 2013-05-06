/******************************************
* Task Work Model
*/
app.Models.TaskWork = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'project.task.work',	
	
	url: "/#times/:id",	



	/** Model Initialization
	*/
	initialize: function (model) {
	   	console.log("Task Work Initialization");
	},



    /** Model Parser
    */
    parse: function(response) {
        return response;
    },
    


	/** Save Model
	*/
	save: function(id,data,options) { 
		app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), options);
	},

});