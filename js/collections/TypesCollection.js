/******************************************
* Categories Collection
*/
app.Collections.Types = Backbone.Collection.extend({

    model: app.Models.Type,

    // Model name in the database //
    model_name : 'openstc.site.type',
    
   	url: "types",
   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Types collection Initialization');
    },



    /** Collection Sync
    */
    sync: function(method, model, options) {
    	app.readOE( this.model_name ,  app.models.user.getSessionID(), options);
    },



    /** Collection Parse
    */
    parse: function(response) {    	
        return response.result.records;
    },
    
    /** Comparator for ordering collection
     */
    comparator: function(item) {
	  return item.get("name");
	},

});
