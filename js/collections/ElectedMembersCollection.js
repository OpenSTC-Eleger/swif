/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'usersCollection',
	'electedMemberModel'

], function(UsersCollection, ElectedMemberModel){

	'use strict';


	/******************************************
	* Elected Members Collection
	*/
	var ElectedMembersCollection = UsersCollection.extend({

		key         : 'elected_member',

		model       : ElectedMemberModel,

		url         : '/api/open_object/elected_members',

		fields      : ['complete_name', 'contact_id', 'date', 'firstname', 'current_group', 'openresa_group', 'id', 'isDST', 'isManager', 'isResaManager', 'lastname', 'login', 'name', 'phone', 'service_id', 'service_ids', 'service_names', 'user_email', 'actions', 'cost'],

		logo        : 'fa-user',


		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Elected members collection Initialization');
		}

	});

	return ElectedMembersCollection;

});