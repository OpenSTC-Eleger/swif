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
		
		urlRoot: '/api/open_achats_stock/purchases',

		fields: ['id', 'name', 'description', 'service_id', 'partner_id', 'amount_total', 'state', 'validation', 'actions', 'check_dst', 'check_elu', 'user_id', 'attach_invoices', 'attach_not_invoices', 'attach_waiting_invoice_ids'],
		
		//readonlyFields: ['contract_line_names', 'contract_line', 'id', 'state'],
		
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
		
		/**
		 * @return: name of action to display on the main button, or empty string if not any action is authorized
		 * use 'priority' variable to apply the priority of the main action (first index is the higher priority)
		 */
		getUserMainAction: function(){
			var priority = ['check_elu','check_dst', 'done', 'invoice','refuse'];
			var ret = '';
			for(var i=0;i < priority.length;i++){
				if(this.hasAction(priority[i])){
					ret = priority[i];
					break;
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
			var values = [];
			values.push({key: app.lang.service, value: this.getAttribute('service_id', [0,''])[1]});
			values.push({key: app.lang.agent, value: this.getAttribute('user_id', [0,''])[1]});
			values.push({key: app.lang.total, value: this.getCurrencyString('amount_total')});
			//did not add the last </footer> because the modal template do it yet, need a refacto to be easier to implement
			_.each(values, function(val){
				value += '</footer><br><footer><strong>' + val.key + ': </strong> ' + val.value;
			});
			ret.infos = {key: app.lang.note, value: value};
			return ret;
		},
		
		/**
		 * @param field: field name to parse in html
		 * @return: String containg html to be displayed in tooltips
		 */
		printAttachInfos: function(){
			var attaches = this.getAttribute('attach_invoices', []);
			var attachToTreatIds = this.getAttribute('attach_waiting_invoice_ids', []);
			var ret = '<ul>';
			var val = '';
			_.each(attaches, function(attach){
				val = '<li>' + attach.name + '</li>';
				if(_.contains(attachToTreatIds, attach.id)){
					val = '<strong>' + val + '(' + app.lang.actions.process + ')</strong>';
				}
				ret += val;
			});
			ret += '</ul>';
			return ret;
		},
		
		addLineToRemove: function(model){
			this.linesToRemove.push([2,model.get('id')]);
		},

		
		saveToBackend: function(){
			var self = this;
			var vals = this.getSaveVals();
			//vals.contract_line = this.linesToRemove;
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
			
			budget_to_check: {
				key					: 'budget_to_check',
				color				: 'warning',
				translation			: app.lang.draft,
			},
			
			engagement_to_check: {
				key					: 'engagement_to_check',
				color				: 'info',
				translation			: app.lang.wait
			},
			
			done: {
				key					: 'done',
				color				: 'success',
				translation			: app.lang.valid
			},
			purchase_paid: {
				key					: 'purchase_paid',
				color				: 'default',
				translation			: app.lang.purchasePaid
			},
			purchase_engaged: {
				key					: 'purchase_engaged',
				color				: 'success',
				translation			: app.lang.valid
			}
			
		},
		
			// Actions of the requests //
		actions : {
			delete: {
				key					: 'delete',
				color				: 'danger',
				icon				: 'fa-trash-o',
				translation			: app.lang.actions.delete
			},
			check_dst: {
				key					: 'check_dst',
				color				: 'success',
				icon				: 'fa-check',
				translation			: 'Validation Responsable (traduire)'
			},
			
			check_elu: {
				key					: 'check_elu',
				color				: 'success',
				icon				: 'fa-check',
				translation			: 'Validation Elu (traduire)'
			},
			
			cancel: {
				key					: 'cancel',
				color				: 'danger',
				icon				: 'fa-ban',
				translation			: app.lang.actions.cancel
			},
			
			refuse: {
				key					: 'refuse',
				color				: 'danger',
				icon				: 'fa-times',
				translation			: app.lang.actions.refuse
			},
			
			done: {
				key					: 'done',
				color				: 'default',
				icon				: 'fa-thumbs-o-up',
				translation			: app.lang.actions.endPurchase
			},
			
			invoice: {
				key					: 'invoice',
				color				: 'default',
				icon				: 'fa-file-pdf-o',
				translation			: app.lang.actions.manageInvoices
			},
			
		}
	});
});