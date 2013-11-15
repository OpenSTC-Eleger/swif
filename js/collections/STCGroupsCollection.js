define([
	'genericCollection'

], function(GenericCollection){

	'use strict';


	/******************************************
	* Groups Collection - User groups for OpenERP
	*/
	var STCGroupsCollection = GenericCollection.extend({

		url: '/api/open_object/groups',


		/** Collection Initialization
		*/
		initialize: function (options) {
			//console.log('Groups collection Initialization');
		},

	});

return STCGroupsCollection;

});