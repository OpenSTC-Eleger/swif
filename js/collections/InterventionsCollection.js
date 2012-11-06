/******************************************
* Sites Collection
*/
openstm.Collections.Interventions = Backbone.Collection.extend({

    model: openstm.Models.Intervention,

    // Model name in the database //
    model_name : 'project.project',

   

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
    }


});
