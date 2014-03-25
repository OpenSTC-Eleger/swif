define([
	'app',
	'genericCollection',
	'contractLineModel'

], function(app, GenericCollection, ContractLineModel){

	'use strict';

	/******************************************
	* Contracts Collection
	*/
	return GenericCollection.extend({
	
		model : ContractLineModel,
		
		url: '/api/openstc/tasks',

		fields: ['id', 'name','date_deadline', 'agent_or_team_name', 'user_id', 'team_id', 'state'],

		default_sort: { by: 'id', order: 'DESC' },
		
		specialCpt : 0,
		
		/** Collection Sync
		*/
//		sync: function(method, model, options){
//	
//			if(_.isUndefined(options.data.fields)){
//				options.data.fields = this.fields;	
//			}		
//			
//			return $.when(this.count(options), this.specialCount(), Backbone.sync.call(this,method,this,options));
//		}
//	
//	});
	});
});