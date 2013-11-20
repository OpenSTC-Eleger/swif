define([
	'localStorage',

	'userModel'

], function(UserModel){

	'use strict';


	/******************************************
	* Users Collection - Person who are Log in
	*/
	var UsersCollection = Backbone.Collection.extend({

		model       : UserModel,

		localStorage: new Backbone.LocalStorage('users-collection'),


		/** Collection Initialization
		*/
		initialize : function() {
			//console.log('User collection initialize');
		},

	});


	return UsersCollection;

});