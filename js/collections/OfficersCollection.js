define([
	'genericCollection',
	'officerModel'

], function(GenericCollection, OfficerModel){

	'use strict';


	/******************************************
	* Officers Collection
	*/
	var OfficersCollection = GenericCollection.extend({

		model       : OfficerModel,
		
		url         : '/api/open_object/users',
		
		fields      : ['complete_name', 'contact_id', 'date', 'firstname', 'current_group', 'openresa_group', 'id', 'isDST', 'isManager', 'isResaManager', 'lastname', 'login', 'name', 'phone', 'service_id', 'service_ids', 'service_names', 'user_email', 'actions'],
		
		default_sort: { by: 'complete_name', order: 'ASC' },


		/** Collection Initialization
		*/
		initialize: function () {
			//console.log('Requests collection Initialization');
		}

	});

	return OfficersCollection;

});