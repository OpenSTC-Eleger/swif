/******************************************
* Sites Collection
*/
openstm.Collections.ClaimersTypes = Backbone.Collection.extend({

    model: openstm.Models.ClaimerType,

    // Model name in the database //
    model_name : 'openctm.partner.type',

   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Claimer type collection Initialization');
    },



    /** Collection Sync
    */
    sync: function(method, model, options) {
    	openstm.readOE(this.model_name, openstm.models.user.getSessionID(), options);
    },



    /** Collection Parse
    */
    parse: function(response) {
        return response.result.records;
    }


});
