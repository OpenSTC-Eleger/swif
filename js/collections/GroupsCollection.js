/******************************************
* Sites Collection
*/
openstm.Collections.Groups = Backbone.Collection.extend({

    model: openstm.Models.Group,

    // Model name in the database //
    model_name : 'res.groups',
    
   	url: "groups",

   

    /** Collection Initialization
    */
    initialize: function (options) {
    	console.log('Groups collection Initialization');
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


});
