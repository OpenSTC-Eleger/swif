/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'genericModel'

], function(app, GenericModel){

	'use strict';


	/******************************************
	* Task Model
	*/
	var TaskRecurrenceModel = GenericModel.extend({

		urlRoot: '/api/openstc/task_recurrences',


		/** Model Initialization
		*/
		initialize: function () {
			//console.log('Task Model Initialization');
		},




	}, {

		// Task State Initialization //
		status:  {
			
		}

	});

	return TaskRecurrenceModel;

});