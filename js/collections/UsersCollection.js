/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'userModel'

], function(UserModel){

	'use strict';


	/******************************************
	* Users Collection - Person who are Log in
	*/
	var UsersCollection = Backbone.Collection.extend({

		model       : UserModel,



		/** Collection Initialization
		*/
		initialize : function() {
			//console.log('User collection initialize');
		},

	});


	return UsersCollection;

});