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

		fields: ['id', 'name', 'actions', 'date_start_order', 'date_end_order', 'internal_inter', 'technical_service_id', 'supplier_id', 'provider_name', 'patrimoine_is_equipment', 'equipment_id' ,'site_id' ,'patrimoine_name', 'state', 'description', 'deadline_delay', 'type_renewal', 'category_id', 'contract_line', 'contract_line_names', 'delay_passed', 'warning_delay', 'cancel_reason'],
		
		readonlyFields: ['contract_line_names', 'contract_line', 'id', 'state'],
		
		searchable_fields: [
			{
				key  : 'id',
				type : 'numeric',
				label: 'N°'
			},
			{
				key  : 'name',
				type : 'text',
				label: 'Libellé'
			}
		],
		
		getUserMainAction: function(){
			var ret = '';
			if(this.getAttribute('delay_passed',false) && this.getAttribute('actions',[]).indexOf('close') > -1){
				ret = 'close';
			}
			else if(this.getAttribute('warning_delay',false) && this.getAttribute('actions',[]).indexOf('renew') > -1){
				ret = 'renew';
			}
			
			else{
				switch(this.getAttribute('state','')){
				case 'wait':
					ret = 'confirm';
					break;
				case 'confirm':
					ret = 'renew';
					break;
				default:
					ret = 'close';
				}
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
		
		getId: function(){
			return this.get('id');
		},
		
		getName: function(){
			return this.get('name');
		},
		
		getInformations: function(){
			var ret = {};
			ret.name = this.getAttribute('name','');
			var value = this.getAttribute('description','');
			value += '</footer><br><footer>';
			value += '<strong>Dates :</strong> du ' + this.getDateFr('date_start_order') + ' au ' + this.getDateFr('date_end_order') + '</footer>';
			
			var lineNames = this.getAttribute('contract_line_names', []);
			if(lineNames.length > 0){
				value += '<br><footer><strong>Tâches du contrat : </strong>';
				value += '<ul>';
				_.each(lineNames, function(lineName){
					value += '<li>' + lineName[1] + '</i>';
				});
				value += '</ul>';
			}
			
			ret.infos = {key:app.lang.note, value:value};
			return ret;
		},
		
		addLineToRemove: function(model){
			this.linesToRemove.push([2,model.get('id')]);
		},

		
		saveToBackend: function(){
			var self = this;
			var vals = this.getSaveVals();
			vals.contract_line = this.linesToRemove;
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
			this.linesToRemove = [];
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
			wait: {
				key					: 'wait',
				color				: 'info',
				icon				: 'fa-check',
				translation			: app.lang.wait,
			},
			draft: {
				key					: 'draft',
				color				: 'warning',
				icon				: 'fa-pencil-o',
				translation			: app.lang.draft
			},
			
			cancel: {
				key					: 'cancel',
				color				: 'danger',
				icon				: 'fa-ban',
				translation			: app.lang.cancel
			},
			
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
			
//			done: {
//				key					: 'done',
//				color				: 'default',
//				icon				: 'fa-thumbs-o-up',
//				translation			: app.lang.actions.close
//			},
			renew: {
				key					: 'renew',
				color				: 'default',
				icon				: 'fa-repeat',
				translation			: app.lang.actions.extendContract
			},
			
			close: {
				key					: 'close',
				color				: 'default',
				icon				: 'fa-archive',
				translation			: app.lang.actions.close
			},
			
			cancel: {
				key					: 'cancel',
				color				: 'danger',
				icon				: 'fa-ban',
				translation			: app.lang.actions.cancel
			},

		}
	});
});