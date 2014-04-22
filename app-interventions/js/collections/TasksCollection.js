/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'genericCollection',
	'taskModel'

], function(GenericCollection, TaskModel){

	'use strict';


	/******************************************
	* Tasks Collection
	*/
	var TasksCollection = GenericCollection.extend({

		model       : TaskModel,

		url         : '/api/openstc/tasks',

		fields      : ['id', 'name', 'site1','actions','absent_type_id', 'category_id', 'date_end', 'date_start', 'effective_hours', 'equipment_ids', 'equipment_names', 'km', 'oil_price', 'oil_qtity', 'planned_hours', 'project_id', 'inter_desc', 'remaining_hours', 'state', 'team_id', 'total_hours', 'user_id', 'inter_equipment', 'partner_id', 'date_deadline', 'recurrence_id' ,'agent_or_team_name'],

		default_sort: { by: 'date_start', order: 'ASC' },


		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Task collection Initialization');
		},

	});

	return TasksCollection;

});