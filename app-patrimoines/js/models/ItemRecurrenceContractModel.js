define([
	'app',
	'appHelpers',
	'genericModel',
	'moment'


], function(app, AppHelpers, GenericModel){

	'use strict';
	
	/******************************************
	* Booking Model
	*/
	return GenericModel.extend({
		
		urlRoot: '/api/openstc/tasks',

		fields: ['id', 'name', 'date_deadline', 'state', 'agent_or_team_name', 'user_id', 'team_id', 'actions', 'partner_id', 'recurrence_id', 'date_start'],
		
		readonlyFields: ['id', 'state', 'actions'],
		
		searchable_fields: [
			{
				key  : 'id',
				type : 'numeric',
				label: 'N°'
			},
			{
				key  : 'name',
				type : 'text',
				label: app.lang.label
			}
			
		],
		
		getId: function(){
			return this.get('id');
		},
		
		/** Model Initialization
		*/
		initialize: function(){

		},
	
	
	}, {
		// Request State Initialization //
		status : {
			draft: {
				key         : 'draft', // To Schedule //
				color       : 'warning',
				translation : app.lang.toScheduled
			},
			open: {
				key         : 'open', // Scheduled //
				color       : 'info',
				translation : app.lang.planningFenced
			},
			done: {
				key         : 'done', // Finish //
				color       : 'success',
				translation : app.lang.finished
			},
			cancelled: {
				key         : 'cancelled', // cancel //
				color       : 'danger',
				translation : app.lang.cancelled
			},
			none: {
				key			: 'none',
				color		: '',
				translation	: ''
			}
		},
		
			// Actions of the requests //
		actions : {


		}
	});
});