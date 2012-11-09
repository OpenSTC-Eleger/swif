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
    
    
//	search : function(){
//    	var self = this;
//    	self.list = []
//		_.each(this.toJSON(),function(task) {
//			if (task.user_id == "undefined")
//				self.list.push(task)	
//		});
//		return self.list;
//	}
    


});
