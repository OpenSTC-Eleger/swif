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

		fields: ['id', 'name', 'description', 'date_order', 'service_id', 'partner_id', 'amount_total', 'state', 'validation', 'actions', 'check_dst', 'check_elu', 'user_id', 'attach_invoices', 'attach_not_invoices', 'attach_waiting_invoice_ids', 'account_analytic_id', 'order_line', 'amount_untaxed', 'amount_tax', 'shipped_rate', 'supplier_mail_sent', 'validation_order_items', 'validation_note'],

		readonlyFields: ['id', 'name', 'date_order', 'amount_total', 'state', 'validation', 'actions', 'user_id', 'attach_invoices', 'attach_not_invoices', 'attach_waiting_invoice_ids', 'amount_untaxed', 'amount_tax', 'reception_progress', 'validation_order_items'],

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
			var priority = ['confirm','refuse', 'done', 'send_mail', 'receive', 'send_mail_again', 'refuse'];
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
			values.push({key: app.lang.buyer, value: this.getAttribute('user_id', [0,''])[1]});
			values.push({key: app.lang.total, value: this.getCurrencyString('amount_total')});
			//did not add the last </footer> because the modal template do it yet, need a refacto to be easier to implement
			_.each(values, function(val){
				value += '</footer><br><footer><strong>' + val.key + ': </strong> ' + val.value;
			});
			ret.infos = {key: app.lang.note, value: value};
			return ret;
		},

		/**
		 * @return: String containing html to be displayed in tooltips
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

		/**
		 * @return: String containing html to be displayed in tooltips
		 */
		printValidationInfos: function(){
			function printValidation(elt, label){
				var ret = '';
				if(elt.length > 0){
					ret = '<strong>' + label + ': </strong><br>';
					_.each(elt, function(item){
						ret += '- ';
						ret += item.role + ' (' + item.validator + ')';
						ret = item.note ? ret + ' : <i>' + item.note + '</i>': ret;
						ret = item.date ? ret + ' ' + AppHelpers.convertDateToTz(item.date).format('DD/MM/YYYY hh[h]mm') : ret;
						ret += '<br>';
					});
					ret += '<br>';
				}
				return ret;
			}
			var ret = '';
			var validations = this.getAttribute('validation_order_items', []);
			ret += printValidation(validations.waiting, app.lang.waitingValidators);
			ret += printValidation(validations.confirm, app.lang.confirmedValidators);
			ret += printValidation(validations.refuse, app.lang.refusedValidators);
			return ret;
		},

		addLineToRemove: function(model){
			if(!model.isNew()){
				this.linesToRemove.push([2,model.get('id')]);
			}
		},

		printStateTooltip: function(){
			var ret = '';
			if(_.contains(['wait','cancel'], this.getAttribute('state','draft'))){
				ret = this.printValidationInfos();
			}
			return ret;
		},

		saveToBackend: function(){
			var self = this;
			var vals = this.getSaveVals();
			vals.order_line = this.linesToRemove.slice(0); //clone the linesToRemove
			this.linesToRemove = [];
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

			draft: {
				key					: 'draft',
				color				: 'warning',
				translation			: app.lang.draft,
			},

			wait: {
				key					: 'wait',
				color				: 'info',
				translation			: app.lang.wait
			},

			approved: {
				key					: 'approved',
				color				: 'success',
				widget				: 'progress',
				translation			: app.lang.valid
			},
			done: {
				key					: 'done',
				color				: 'default',
				translation			: app.lang.purchasePaid
			},
			
			cancel: {
				key					: 'cancel',
				color				: 'danger',
				translation			: app.lang.refused
			},
		},

			// Actions of the requests //
		actions : {
			delete: {
				key					: 'delete',
				color				: 'danger',
				icon				: 'fa-trash-o',
				translation			: app.lang.actions.delete
			},
			confirm: {
				key					: 'confirm',
				color				: 'success',
				icon				: 'fa-check',
				translation			: app.lang.actions.check_confirm
			},

			refuse: {
				key					: 'refuse',
				color				: 'danger',
				icon				: 'fa-times',
				translation			: app.lang.actions.check_refuse
			},

			cancel: {
				key					: 'cancel',
				color				: 'danger',
				icon				: 'fa-ban',
				translation			: app.lang.actions.cancel
			},

			done: {
				key					: 'done',
				color				: 'default',
				icon				: 'fa-thumbs-o-up',
				translation			: app.lang.actions.endPurchase
			},

			send_mail: {
				key					: 'send_mail',
				color				: 'default',
				icon				: 'fa-envelope-o',
				translation			: app.lang.actions.purchaseSent
			},

			send_mail_again: {
				key					: 'send_mail_again',
				color				: 'default',
				icon				: 'fa-envelope-o',
				translation			: app.lang.actions.sendPurchaseAgain
			},

			receive: {
				key					: 'receive',
				color				: 'default',
				icon				: 'fa-truck',
				translation			: app.lang.actions.receiveProducts
			}

		}
	});
});