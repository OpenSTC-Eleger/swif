/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'currentUserModel'

], function(CurrentUserModel){

	'use strict';


	/******************************************
	* Current Users Collection - Person who are Log in
	*/
	var CurrentUsersCollection = Backbone.Collection.extend({

		model       : CurrentUserModel,



		/** Collection Initialization
		*/
		initialize : function() {
			//console.log('User collection initialize');
		},

	});


	return CurrentUsersCollection;

});