/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'absentTypeModel'

], function(GenericCollection, AbsentTypeModel){

	'use strict';


	/******************************************
	* AbsentType Collection - Leave Time Type
	*/
	var AbsentTypesCollection = GenericCollection.extend({

		model       : AbsentTypeModel,

		url         : '/api/openstc/absence_categories',

		fields      : ['id', 'name', 'code', 'description', 'actions'],

		default_sort: { by: 'name', order: 'ASC' },



		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Place collection Initialization');
		},

	});

	return AbsentTypesCollection;

});