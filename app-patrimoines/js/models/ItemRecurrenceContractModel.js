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

		fields: ['id', 'name', 'date_deadline', 'state', 'agent_or_team_name', 'user_id', 'team_id', 'actions'],
		
		readonlyFields: ['date_deadline', 'id', 'state'],
		
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
		
		
		//method to retrieve attribute with standard return form
		getAttribute: function(key,default_value){
			var val = this.get(key);
			if(_.isUndefined(default_value)){
				default_value = false;
			}
			if(!_.isUndefined(val) && val !== '' && val !== false && val !== null){
				return val;
			}
			else{
				return default_value;
			}
		},
		
		getId: function(){
			return this.get('id');
		},
		
		/** Model Initialization
		*/
		initialize: function(){
			this.linesToRemove = [];
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
		},
		
			// Actions of the requests //
		actions : {


		}
	});
});