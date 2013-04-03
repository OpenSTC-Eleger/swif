/******************************************
* Users Collection
*/
app.Collections.Users = Backbone.Collection.extend({

    model : app.Models.User,

    localStorage : new Store("usersCollection"),


    /** Collection Initialization
    */
    initialize : function() {
        console.log('User collection initialize');
    },
    
    /** Collection Parse name
    */
//    parse: function(response) {
//        return response;
//    },

});