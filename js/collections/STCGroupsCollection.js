/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection'

], function(GenericCollection){

	'use strict';


	/******************************************
	* Groups Collection - User groups for OpenERP
	*/
	var STCGroupsCollection = GenericCollection.extend({

		url: '/api/open_object/groups',


		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Groups collection Initialization');
		},

	});

	return STCGroupsCollection;

});