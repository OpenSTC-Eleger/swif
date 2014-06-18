/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'userModel'

], function(app, UserModel){

	'use strict';


	/******************************************
	* Officer Model
	*/
	var OfficerModel = UserModel.extend({

		urlRoot : '/api/open_object/officers',

		fields: ['complete_name', 'contact_id', 'context_lang', 'context_tz', 'date', 'firstname', 'groups_id', 'current_group', 'openresa_group', 'id', 'isDST', 'isManager', 'isResaManager', 'lastname', 'login', 'name', 'phone', 'service_id', 'service_names', 'tasks', 'team_ids', 'user_email', 'actions', 'cost'],

	});

	return OfficerModel;

});