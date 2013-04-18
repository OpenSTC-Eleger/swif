/******************************************
* Users Collection - Person who are Log in
*/
app.Collections.Users = Backbone.Collection.extend({

    model : app.Models.User,

    sessionStorage : new Store('usersCollection'),


    /** Collection Initialization
    */
    initialize : function() {
        console.log('User collection initialize');
    },

});