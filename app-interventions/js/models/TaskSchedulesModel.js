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