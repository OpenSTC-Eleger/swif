/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'contractModel',
	'contractsCollection',

	'formContractView',
	'modalDeleteView',
	'genericActionModalView',
	'genericItemView',
	'moment'


], function(app, AppHelpers, ContractModel, ContractsCollection, FormContractView, ModalDeleteView, GenericActionModalView, GenericItemView){

	'use strict';

	return GenericItemView.extend({

		tagName      : 'tr',

		className    : function(){
			var ret = 'row-item';
			var state = this.model.getAttribute('state','draft');
			if(state == 'done' || state == 'cancel'){
				ret += ' text-muted';
			}
			else if(this.model.getAttribute('warning_delay',false)){
				ret += ' bolder';
			}
			return ret;
		},

		templateHTML : '/templates/items/itemContract.html',
		templateCancelContract: '/templates/modals/modalCancelContract.html',
		templateRenewContract: '/templates/modals/modalRenewContract.html',
		templateSmallActionHTML : '/templates/others/templateSmallActionComponent.html',
		templateButtonActionHTML : '/templates/others/templateButtonActionComponent.html',

		classModel	: ContractModel,

		// The DOM events //
		events: {
			'click .actionDelete'	: 'modalDelete',
			'click .actions'		: 'modalConfirm',
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
			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.absentTypeUpdateOk);
		},



		/** When the model is destroy //
		*/
		destroy: function(e){
			var self = this;

			AppHelpers.highlight($(this.el)).done(function(){
				self.remove();
				app.views.ContractsListView.partialRender();
			});

			app.notify('', 'success', app.lang.infoMessages.information, e.getName()+' : '+app.lang.infoMessages.absentTypeDeleteOk);
		},



		/** Display the view
		*/
		render : function() {
			var self = this;
			var formUrl = FormContractView.prototype.urlBuilder(this.model.getId());
			var stateItem = ContractModel.status[this.model.getAttribute('state','draft')];
			// Retrieve the template //
			$.get(app.menus.openstcpatrimoine+this.templateHTML, function(templateData){

				if(_.isUndefined(self.actions)){self.authorizedActions = self.model.getAttribute('actions',[]);}

				var template = _.template(templateData, {
					lang        : app.lang,
					contract  : self.model,
					mainAction: self.model.getUserActions().mainAction,
					otherActions: self.model.getUserActions().otherActions,
					formUrl		: formUrl,
					stateItem	: stateItem
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
			switch(action){
			case 'cancel':
				templateForm = app.menus.openstcpatrimoine + this.templateCancelContract;
				break;
			case 'renew':
				templateForm = app.menus.openstcpatrimoine + this.templateRenewContract;
				break;
			}
			var langAction = app.lang.patrimoine.modalContract;
			new GenericActionModalView({
				el			:'#modalView',
				model		:this.model,
				action		:action,
				langAction	:langAction,
				templateForm:templateForm
			});
		}

	});

});