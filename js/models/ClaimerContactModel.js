/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericModel',

], function(GenericModel){

	'use strict';


	/******************************************
	* Claimer Contact Model
	*/
	var ClaimerContactModel = GenericModel.extend({

		urlRoot : '/api/open_object/partner_addresses',


		getInformations: function () {
			return this.getName();
		}

	});

	return ClaimerContactModel;

});