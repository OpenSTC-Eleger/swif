define([
	'app',
	'genericModel'

], function(app, GenericModel){

	'use strict';


	/******************************************
	* Booking Model
	*/
	var bookingRecurrence = GenericModel.extend({
		
		urlRoot: "/api/openresa/booking_recurrences",
		
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
	
		getId: function(){
			return this.get('id');
		},
		
		getName: function(){
			return this.get('name');
		},
		
	
		/** Model Initialization
		*/
		initialize: function(){
			//console.log('Booking Model initialization');
			//this.fetchRelated('tasks');
		},
	
	
	}, {
		// Request State Initialization //
		status : {
	
		}
	
	});	

	return bookingRecurrence;

});