/******************************************
* Claimers Collection
*/
app.Collections.Claimers = Backbone.Collection.extend({

    model : app.Models.Claimer,

    // Model name in the database //
    model_name : 'res.partner',

    url: "demandeurs",   
    


    /** Collection Initialization
    */
    initialize : function() {
        console.log('Claimer collection initialize');
    },



    /** Collection Sync
    */
    sync: function(method, model, options) {
    	app.readOE(this.model_name, app.models.user.getSessionID(), options);
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
