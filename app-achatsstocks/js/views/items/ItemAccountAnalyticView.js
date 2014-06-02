/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'analyticAccountModel',
	'analyticAccountsCollection',
	'genericItemView',
	'modalDeleteView',
	'genericFormModalView',
	'moment'


], function(app, AppHelpers, AnalyticAccountModel, AnalyticAccountsCollection, GenericItemView, ModalDeleteView, GenericFormModalView){

	'use strict';

	return GenericItemView.extend({

		tagName      : 'tr',

		className    : function(){
			var ret = 'row-item';
			return ret;
		},

		templateHTML : '/templates/items/itemAnalyticAccount.html',
		templateModalFormHTML: '/templates/modals/modalAnalyticAccount.html',

		classModel	: AnalyticAccountModel,

		// The DOM events //
		events: {
			'click .actionDelete'	: 'modalDelete',
			'click .actionUpdate'	: 'modalUpdate'

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
			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.achatsstocks.infoMessages.analyticAccountupdateOk);
		},



		/** When the model is destroy //
		*/
		destroy: function(e){
			var self = this;

			AppHelpers.highlight($(this.el)).done(function(){
				self.remove();
				app.views.analyticAccountsListView.partialRender();
			});

			app.notify('', 'success', app.lang.infoMessages.information, e.getName()+' : '+app.lang.achatsstocks.infoMessages.analyticAccountDeleteOk);
		},



		/** Display the view
		*/
		render : function() {
			var self = this;
			$.get(app.menus.openstcachatstock+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang            : app.lang,
					acountAnalytic	: self.model
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
				modalTitle   : app.lang.achatsstocks.viewsTitles.deleteAnalyticAccount,
				modalConfirm : app.lang.achatsstocks.warningMessages.confirmDeleteAnalyticAccount
			});
		},

		modalUpdate: function(e){
			e.preventDefault();
			e.stopPropagation();
			new GenericFormModalView({
				el:'#modalView',
				model: this.model,
				title:app.lang.achatsstocks.modalAnalyticAccount.update,
				templateForm: app.menus.openstcachatstock + this.templateModalFormHTML
			});
		},
	});
});