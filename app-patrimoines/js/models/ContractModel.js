define([
	'app',
	'appHelpers',
	'genericModel',


], function(app, AppHelpers, GenericModel){

	'use strict';
	
	/******************************************
	* Booking Model
	*/
	return GenericModel.extend({
		
		urlRoot: '/api/openpatrimoine/contracts',

		fields: ['id', 'name', 'actions', 'date_start_order', 'date_end_order', 'internal_inter', 'technical_service_id', 'supplier_id', 'provider_name', 'patrimoine_is_equipment', 'equipment_id' ,'site_id' ,'patrimoine_name', 'state'],

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
		
		getUserMainAction: function(){
			var ret = '';
			switch(this.getAttribute('state','')){
			case 'draft':
				ret = 'confirm';
				break;
			case 'confirm':
				ret = 'done';
				break;
			case 'done':
				ret = 'extend';
				break;
			default:
				ret = 'confirm';
			}
			return ret;
		},
		/**
		 * Method used to compute actions authorized for user, and compute the mainAction to display on itemListViews
		 */
		getUserActions: function(){
			var actions = this.getAttribute('actions',[]);
			var mainAction = this.getUserMainAction();
			return {mainAction: mainAction, otherActions: _.without(actions, mainAction)};
		},
		
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
				key					: 'confirm',
				color				: 'success',
				translation			: app.lang.valid
			},
			done: {
				key					: 'done',
				color				: 'default',
				icon				: 'fa-thumbs-o-up',
				translation			: app.lang.closed
			},
			draft: {
				key					: 'draft',
				color				: 'default',
				icon				: 'fa-pencil-o',
				translation			: app.lang.draft
			}
		},
		
			// Actions of the requests //
		actions : {
			update: {
				key					: 'update',
				icon				: 'fa-pencil',
				translation			: app.lang.actions.update
			},
			delete: {
				key					: 'delete',
				icon				: 'fa-trash-o',
				translation			: app.lang.actions.delete
			},
			
			confirm: {
				key					: 'confirm',
				color				: 'success',
				icon				: 'fa-check',
				translation			: app.lang.actions.validate
			},
			
			done: {
				key					: 'done',
				color				: 'default',
				icon				: 'fa-thumbs-o-up',
				translation			: app.lang.actions.closed
			},
			extend: {
				key					: 'extend',
				color				: 'info',
				icon				: 'fa-pencil',
				translation			: app.lang.actions.extendContract
			},
			
			foo: {
				key					: 'foo',
				icon				: 'fa-ban-circle',
				translation			: 'bar'
			}

		}
	});
});