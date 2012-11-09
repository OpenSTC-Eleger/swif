/******************************************
* Sites Collection
*/
openstm.Collections.Interventions = Backbone.Collection.extend({

    model: openstm.Models.Intervention,

    // Model name in the database //
    model_name : 'project.project',
    
   	url: "demandes-dinterventions",
//
//	url : function( models ) {
//		return this.url;
//	},

   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Interventions collection Initialization');
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
    
    search : function(){
    	var self = this;
    	self.list = []
		_.each(this.toJSON(),function(intervention) {
			var j = 0;
			toRemove = [];
			for ( var i=0; i< intervention.tasks.length;i++ ){
				
				if ( intervention.tasks[i].user_id != false  ){
					toRemove.push(intervention.tasks[i]);
					//intervention.tasks.pop(i);
					//self.models[j].attributes.tasks.remove(intervention.tasks[i]);
					//self.get(i).tasks = intervention.tasks;
				}

			};	
			for (var w=0 ; w<toRemove.length ; w++) {
				self.models[j].attributes.tasks.remove(toRemove[w])
			}			
			if(self.models[j].attributes.tasks.length == 0)
				self.remove(intervention);
			j++;
		});		
	}


});
