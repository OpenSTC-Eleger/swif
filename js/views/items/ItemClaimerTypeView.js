/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',
	'claimerTypeModel',
	'genericListView',
	'paginationView',
	'modalDeleteView',
	'modalClaimerTypeView'

], function (app, AppHelpers, ClaimerTypeModel, GenericListView, PaginationView, ModalDeleteView, ModalClaimerTypeView) {

	'use strict';


	/******************************************
	* Item Claimer Type View
	*/
	var ItemClaimerTypeView =  Backbone.View.extend({

		tagName     : 'tr',
		className   : 'row-item',
		templateHTML: 'templates/items/itemClaimerType.html',

		// The DOM events //
		events      : {
			'click'                         : 'modalUpdateClaimerType',
			'click a.modalDeleteClaimerType': 'modalDeleteClaimerType'
		},



		/** View Initialization
		*/
		initialize: function () {
			this.model.off();

			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);

			// When the model are destroy //
			this.listenTo(this.model, 'destroy', this.destroy);
		},



		/** When the model is updated
		*/
		change: function() {

			this.render();
			AppHelpers.highlight($(this.el));
			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName() + ' : ' + app.lang.infoMessages.claimerTypeUpdateOk);
		},



		/** When the model is destroy
		*/
		destroy: function (e) {
			var self = this;

			AppHelpers.highlight($(this.el)).done(function () {
				self.remove();
				app.views.claimersTypesListView.partialRender();
			});

			app.notify('', 'success', app.lang.infoMessages.information, e.getName() + ' : ' + app.lang.infoMessages.claimerTypeDeleteOk);
		},



		/** Display the view
		*/
		render: function () {
			var self = this;

			// Retrieve the template //
			$.get(this.templateHTML, function (templateData) {

				var template = _.template(templateData, {
					lang       : app.lang,
					claimerType: self.model
				});

				$(self.el).html(template);

				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip();

			});

			return this;
		},



		/** Display Modal form to add/sav a new Claimer type
		*/
		modalUpdateClaimerType: function (e) {
			e.preventDefault();
			e.stopPropagation();

			app.views.modalClaimerTypeView = new ModalClaimerTypeView({
				el     : '#modalSaveClaimerType',
				model  : this.model,
				elFocus: $(e.target).data('form-id')
			});
		},



		/** Modal to remove an Claimer Type
		*/
		modalDeleteClaimerType: function (e) {
			e.preventDefault();
			e.stopPropagation();

			app.views.modalDeleteView = new ModalDeleteView({
				el          : '#modalDeleteClaimerType',
				model       : this.model,
				modalTitle  : app.lang.viewsTitles.deleteClaimerType,
				modalConfirm: app.lang.warningMessages.confirmDeleteClaimerType
			});
		}

	});

	return ItemClaimerTypeView;

});