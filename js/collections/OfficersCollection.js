/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'usersCollection',
	'officerModel'

], function(UsersCollection, OfficerModel){

	'use strict';


	/******************************************
	* Officers Collection
	*/
	var OfficersCollection = UsersCollection.extend({

		key         : 'officer',

		model       : OfficerModel,

		url         : '/api/open_object/officers',

		fields      : ['complete_name', 'contact_id', 'date', 'firstname', 'current_group', 'openresa_group', 'id', 'isDST', 'isManager', 'isResaManager', 'lastname', 'login', 'name', 'phone', 'service_id', 'service_ids', 'service_names', 'user_email', 'actions', 'cost'],

		logo        : 'fa-user',


		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Officers collection Initialization');
		}

	});

	return OfficersCollection;

});