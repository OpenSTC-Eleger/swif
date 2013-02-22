/******************************************
* Claimers Types Collection
*/
app.Collections.ClaimersTypes = Backbone.Collection.extend({

    model: app.Models.ClaimerType,

    // Model name in the database //
    model_name : 'openstc.partner.type',

    url: "type-demandeurs",   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Claimer type collection Initialization');
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
