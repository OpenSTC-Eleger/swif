/******************************************
* Users Collection - Person who are Log in
*/
app.Collections.Users = Backbone.Collection.extend({

	model       : app.Models.User,

	localStorage: new Backbone.LocalStorage('users-collection'),


	/** Collection Initialization
	*/
	initialize : function() {
		//console.log('User collection initialize');
	},

});