/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app', 'appHelpers', 'officerModel', 'modalContactEdit', 'modalDeleteView'

], function (app, AppHelpers, OfficerModel, ModalContactEdit, ModalDeleteView) {

	'use strict';


	return Backbone.View.extend({

		tagName     : 'tr',
		className   : 'row-nested-objects',
		templateHTML: 'templates/items/claimerContact.html',

		events: {
			'click a.modalEditContact': 'showEditModal',
			'click a.modalDeleteContact': 'showDeleteModal'
		},


		id: function () {
			return 'address_' + this.model.id;
		},



		/** View Initialization
		*/
		initialize: function (params) {
			this.options = params;

			this.user = this.options.user;
			this.listenTo(this.model, 'updateSuccess', this.changed);
			this.listenTo(this.model, 'destroy', this.destroyed);
		},



		/** Display the view
		*/
		render: function () {

			var self = this;

			$.get(self.templateHTML, function (templateData) {
				var template = _.template(templateData, {
					lang   : app.lang,
					address: self.serializeContact()
				});

				$(self.el).html(template);
			});

			return this;
		},



		serializeContact: function () {
			var tpl_data = this.model.toJSON();

			if (!_.isUndefined(this.user)) {
				tpl_data = $.extend(tpl_data, {user_login: this.user.get('login')});
			}

			return tpl_data;
		},



		changed: function () {
			this.render();
			AppHelpers.highlight($(this.el));
			app.notify('', 'success', app.lang.infoMessages.information, this.model.get('name') + ' : ' + app.lang.infoMessages.claimerContactUpdateOk);
		},



		showEditModal: function (e) {
			e.preventDefault();
			e.stopPropagation();

			var edit_user;

			if (_.isUndefined(this.user)) {
				edit_user = new OfficerModel();
			} else {
				edit_user = this.user;
			}

			new ModalContactEdit({model: this.model, el: '#modalEditContact', user: edit_user}).render();
		},



		showDeleteModal: function (e) {
			e.preventDefault();
			new ModalDeleteView({el: '#modalDeleteClaimerContact', model: this.model,
				modalTitle: app.lang.viewsTitles.deleteContact, modalConfirm: app.lang.warningMessages.confirmDeleteContact
			});
		},



		/** Delete Address
		*/
		deleteAddress: function () {
			var self = this;
			this.selectedAddress.delete({
				success: function (data) {
					if (data.error) {
						app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
					}
					else {
						app.collections.claimersContacts.remove(self.selectedAddress);
						var claimer = app.collections.claimers.get(self.selectedAddressJSON.livesIn.id);
						claimer.attributes.address.remove(self.selectedAddressJSON.id);
						app.collections.claimers.add(claimer);
						$('#modalDeleteContact').modal('hide');
						app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.addressDeleteOk);
						self.render();
					}
				},
				error: function () {
					alert('Impossible de supprimer le contact');
				}

			});

		},



		destroyed: function () {
			var self = this;

			AppHelpers.highlight($(this.el)).done(function () {
				self.$el.remove();
			});

			app.notify('', 'success', app.lang.infoMessages.information, self.model.get('name') + ' : ' + app.lang.infoMessages.contactDeleteOk);
		}

	});

});