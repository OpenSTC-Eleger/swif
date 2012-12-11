/******************************************
* Request Model
*/
app.Models.Task = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'project.task',	
	
	url: "/#taches/:id",

	defaults:{
		id:0,
		effective_hours:0,
		total_hours: 0,
		remaining_hours: 0,
	},
	
    getId : function() {
        return this.get('id');
    },
    setId: function(value) {
    	if( value == 'undefined') return;
        this.set({ id : value });
    },


//	relations: [
//	{
//		// Create a cozy, recursive, one-to-one relationship
//		type: Backbone.HasOne,
//		key: 'project_id',
//		relatedModel: 'app.Models.Intervention',
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
		app.saveOE(this.get("id"), data, this.model_name,app.models.user.getSessionID(), options);
	},
	
	destroy: function (options) {	
		app.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	},


});