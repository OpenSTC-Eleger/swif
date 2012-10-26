/******************************************
* Users Collection
*/
openstm.Collections.Users = Backbone.Collection.extend({

    model : openstm.Models.User,

    localStorage : new Store("usersCollection"),

    

    /** Collection Initialization
    */
    initialize : function() {
        console.log('User collection initialize');
    }


});
