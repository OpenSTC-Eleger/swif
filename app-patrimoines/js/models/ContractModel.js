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
		
		urlRoot: '/api/openpatrimoine/contracts',

		fields: ['id', 'name', 'actions', 'date_start_order', 'date_end_order', 'internal_inter', 'technical_service_id', 'supplier_id', 'provider_name', 'patrimoine_is_equipment', 'equipment_id' ,'site_id' ,'patrimoine_name', 'state', 'description', 'deadline_delay', 'type_renewal', 'category_id', 'contract_line', 'contract_line_names'],
		
		readonlyFields: ['contract_line_names', 'contract_line', 'id', 'state'],
		
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
		
		getInformations: function(){
			var ret = {};
			ret.name = this.getAttribute('name','');
			ret.infos = {key:app.lang.description, value:this.getAttribute('description','')};
			return ret;
		},
		
		/**
		 * to move to GenericCollection
		 */
		getSaveVals: function(){
			var ret = {};
			var self = this;
			if(!_.isUndefined(this.collection)){
				_.map(this.collection.fieldsMetadata, function(fieldDefinition, fieldName){
					if(!_.contains(self.readonlyFields, fieldName)){
						if(fieldDefinition.type == 'many2one'){
							ret[fieldName] = self.getAttribute(fieldName, [false,''])[0];
						}
						else{
							ret[fieldName] = self.getAttribute(fieldName, false);
						}
					}
				});
			}
			else{
				console.warning('Swif error: Could not save model because not any collection is linked with, and so can not retrieve metadata fields.');
			}
			return ret;
		},
		
		saveToBackend: function(){
			var self = this;
			var vals = this.getSaveVals();
			var ret = this.save(vals,{patch:!this.isNew(), wait:true}).then(function(data){
				if(self.isNew()){
					self.set({id:data});
				}
				return self.fetch();
			});
			return ret;
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
			renew: {
				key					: 'renew',
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