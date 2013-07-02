/******************************************
* Tasks Collection
*/
app.Collections.Tasks = Backbone.Collection.extend({

    model: app.Models.Task,

    // Model name in the database //
    model_name : 'project.task',

    url: 'taches',
 


    /** Collection Sync
    */
    sync: function(method, model, options) {
    	app.readOE(this.model_name , app.models.user.getSessionID(), options);
    },



    /** Collection Parse name
    */
    parse: function(response) {
        return response.result.records;
    },
    


    /** Comparator for ordering collection
    */
    /*comparator: function(item) {
	  return item.get('name');
	},*/
    


    comparator: function(item) {
	   return -item.get("date_start");
	},

});
