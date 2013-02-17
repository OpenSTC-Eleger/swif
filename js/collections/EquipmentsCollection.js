/******************************************
* Claimers Types Collection
*/
app.Collections.Equipments = Backbone.Collection.extend({

    model: app.Models.Equipment,

    // Model name in the database //
    model_name : 'openstc.equipment',

    url: "equipments",   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Equipment collection Initialization');
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
    }


});
