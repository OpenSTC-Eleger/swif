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

		fields: ['id', 'name', 'date_deadline', 'state', 'agent_or_team_name', 'user_id', 'team_id'],
		
		readonlyFields: ['date_deadline', 'id', 'state'],
		
		searchable_fields: [
			{
				key  : 'id',
				type : 'numeric'
			},
			{
				key  : 'name',
				type : 'text'
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

		},
		
			// Actions of the requests //
		actions : {


		}
	});
});