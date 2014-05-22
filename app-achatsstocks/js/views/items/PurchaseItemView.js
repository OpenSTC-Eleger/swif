/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'purchaseModel',
	'purchasesCollection',
	'genericItemView',
	'modalDeleteView',
//	'genericFormModalView',
	'genericActionModalView',
	'moment'


], function(app, AppHelpers, PurchaseModel, PurchasesCollection, GenericItemView, ModalDeleteView, GenericActionModalView){

	'use strict';

	return GenericItemView.extend({

		tagName      : 'tr',

		className    : function(){
			var ret = 'row-item';
			return ret;
		},

		templateHTML : '/templates/items/itemPurchase.html',

		classModel	: PurchaseModel,

		// The DOM events //
		events: {
			'click .actionDelete'	: 'modalDelete',
			'click .actionCancel'	: 'modalCancel',
			'click .actions'		: 'modalConfirm'
			
		},

		/** View Initialization
		*/
		initialize: function (params) {

			this.options = params;

			this.model.off();

			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);

			// When the model are destroy //
			this.listenTo(this.model,'destroy', this.destroy);
			GenericItemView.prototype.initialize.apply(this, params);

		},

		/** When the model is updated //
		*/
		change: function(){

			this.render();
			AppHelpers.highlight($(this.el));
			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.patrimoine.infoMessages.contractTypesUpdateOk);
		},



		/** When the model is destroy //
		*/
		destroy: function(e){
			var self = this;

			AppHelpers.highlight($(this.el)).done(function(){
				self.remove();
				app.views.ContractsListView.partialRender();
			});

			app.notify('', 'success', app.lang.infoMessages.information, e.getName()+' : '+app.lang.infoMessages.contractTypesDeleteOk);
		},



		/** Display the view
		*/
		render : function() {
			var self = this;
			var stateItem = PurchaseModel.status[this.model.getAttribute('validation','budget_to_check')];
			$.get(app.menus.openachatsstocks+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang        : app.lang,
					purchase	: self.model,
					stateItem	: stateItem,
					mainAction: self.model.getUserActions().mainAction,
					otherActions: self.model.getUserActions().otherActions,
				});
				$(self.el).html(template);
				GenericItemView.prototype.render.apply(self);
			});

			return this;
		},

		/** Modal to remove a place
		*/
		modalDelete: function(e){
			e.preventDefault();
			e.stopPropagation();

			app.views.modalDeleteView = new ModalDeleteView({
				el           : '#modalView',
				model        : this.model,
				modalTitle   : app.lang.viewsTitles.deleteContract,
				modalConfirm : app.lang.warningMessages.confirmDeleteContract
			});
		},
		
		modalConfirm: function(e){
			e.preventDefault();
			e.stopPropagation();
			var action = $(e.currentTarget).data('action');
			var templateForm = null;
//			switch(action){
//			case 'cancel':
//				templateForm = app.menus.openstcpatrimoine + this.templateCancelContract;
//				break;
//			case 'renew':
//				templateForm = app.menus.openstcpatrimoine + this.templateRenewContract;
//				break;
//			}
			var langAction = app.lang.achatsstocks.modalPurchase;
			new GenericActionModalView({
				el			:'#modalView',
				model		:this.model,
				action		:action,
				langAction	:langAction,
				templateForm:templateForm
			});
		},
		
		modalCancel: function(e){
			$(e.currentTarget).data('action','cancel');
			this.modalConfirm(e);
		},
	});
});