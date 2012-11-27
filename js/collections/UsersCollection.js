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
    }

});