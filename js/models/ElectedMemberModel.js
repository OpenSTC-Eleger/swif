/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'officerModel'

], function(OfficerModel){

	'use strict';


	/******************************************
	* Elected Member Model
	*/
	var ElectedMember = OfficerModel.extend({

		urlRoot : '/api/open_object/elected_member',

		fields: ['complete_name', 'contact_id', 'context_lang', 'context_tz', 'date', 'firstname', 'groups_id', 'current_group', 'openresa_group', 'id', 'isDST', 'isManager', 'isResaManager', 'lastname', 'login', 'name', 'phone', 'service_id', 'service_names', 'user_email', 'actions'],

	});

	return ElectedMember;

});