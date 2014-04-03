/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'contractTypesModel',
	'contractTypesCollection',
	'genericItemView',
	'modalDeleteView',
	'genericFormModalView',
	'moment'


], function(app, AppHelpers, ContractTypesModel, ContractTypesCollection, GenericItemView, ModalDeleteView, GenericFormModalView){

	'use strict';

	return GenericItemView.extend({

		tagName      : 'tr',

		className    : function(){
			var ret = 'row-item';
			return ret;
		},

		templateHTML : '/templates/items/itemContractTypes.html',
		templateModalFormHTML: '/templates/modals/modalContractType.html',
		classModel	: ContractTypesModel,
		
		// The DOM events //
		events: {
			'click .actionDelete'	: 'modalDelete',
			'click .actionUpdate'	: 'modalUpdate',
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
			
			$.get(app.menus.openstcpatrimoine+this.templateHTML, function(templateData){
								
				var template = _.template(templateData, {
					lang        : app.lang,
					contractType: self.model,
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
		
		modalUpdate: function(e){
			e.preventDefault();
			e.stopPropagation();
			var action = $(e.currentTarget).data('action');
			new GenericFormModalView({
				el:'#modalView',
				model: this.model,
				action: action,
				title:app.lang.patrimoine.modalContractType.update,
				templateForm: app.menus.openstcpatrimoine + this.templateModalFormHTML
			});
		},
		
	});
});