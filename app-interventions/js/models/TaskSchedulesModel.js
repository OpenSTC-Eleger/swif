/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericModel'

], function(GenericModel){

	'use strict';


	/******************************************
	* Absent Type Model
	*/
	var TaskSchedulesModel = GenericModel.extend({


		fields  : [],

		urlRoot : '/api/openstc/task_schedules',


	});

	return TaskSchedulesModel;

});