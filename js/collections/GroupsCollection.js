/******************************************
* Groups Collection - User groups for OpenERP
*/
app.Collections.Groups = Backbone.Collection.extend({

    model: app.Models.Group,

    // Model name in the database //
    model_name : 'res.groups',
    
   	url: "groups",


    /** Collection Sync
    */
    sync: function(method, model, options) {
    	app.readOE( this.model_name ,  app.models.user.getSessionID(), options);
    },



    /** Collection Parse
    */
    parse: function(response) { 
    	return _.filter(response.result.records, function(record){
    		return _.startsWith(record.name.toLowerCase(),"openstc");
    	})
        //return response.result.records;
    },



    /** Comparator for ordering collection
     */
    comparator: function(item) {
	  return item.get("name");
	},

});
