define([
	'app',
	'appHelpers',
	
	'genericModel',
	'moment-timezone',
	'moment-timezone-data'


], function(app, AppHelpers, GenericModel, moment){

	'use strict';
	
	/******************************************
	* Booking Model
	*/
	var contract = GenericModel.extend({
		
		urlRoot: "/api/openresa/bookings",

		fields : ['id', 'name'],
	
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
			if(!_.isUndefined(val) && val != '' && val != false && val != null){
				return val;
			}
			else{
				return default_value;
			}
		},
	
	
		getId: function(){
			return this.get('id');
		},
		
		getName: function(){
			return this.get('name');
		},
		
		
		/** Model Initialization
		*/
		initialize: function(){
		},
	
	
	}, {
		// Request State Initialization //
		status : {
			confirm: {
				key                 : 'confirm',
				color               : 'success',
				icon 		        : 'fa-check',
				translation         : app.lang.valid
			},
			done: {
				key                 : 'done',
				color               : 'default',
				icon 		        : 'fa-thumbs-o-up',
				translation         : app.lang.closed
			},
			draft: {
				key                 : 'draft',
				color               : 'default',
				icon 		        : 'fa-pencil-o',
				translation         : app.lang.draft
			}
		},
		
			// Actions of the requests //
		actions : {

		}
	
	});
	

return contract;

});