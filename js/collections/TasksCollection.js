/******************************************
* Sites Collection
*/
openstm.Collections.Tasks = Backbone.Collection.extend({

    model: openstm.Models.Task,

    // Model name in the database //
    model_name : 'project.task',

    url: "taches",

//	url : function( models ) {
//		return this.url;
//	},
//   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Tasks collection Initialization');
    },



    /** Collection Sync
    */
    sync: function(method, model, options) {
    	openstm.readOE( this.model_name ,  openstm.models.user.getSessionID(), options);
    },



    /** Collection Parse
    */
    parse: function(response) {
        return response.result.records;
    },
    
    getTasksByOfficer: function(officer_id){    	
    	self = this;
    	self.tasks = this.toJSON();
    	_.each(self.tasks, function(task){
    		if(task.user_id != false) {
    			if (task.user_id[0] != officer_id)
    				self.remove(task);
    		}
    		else
    			self.remove(task);
    	});
    	return this;
    }
    
    
//	getNotAssignedTasks: function(){
//	   return _.filter(this.models, function(model){ 
//		   return model.get('user_id') === false; 
//	   });
//	}
    


});
