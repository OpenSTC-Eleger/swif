/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define(['app', 'appHelpers', 'genericModalView', 'claimersContactsCollection'

], function (app, AppHelpers, GenericModalView, ClaimersContactsCollection) {

	'use strict';

	return GenericModalView.extend({

		templateHTML: 'templates/modals/contactEdit.html',


		events: function () {
			return _.defaults({
					'submit #formContact': 'saveContact',
					'change #createAssociatedAccount': 'accordionAssociatedAccount'
				},
				GenericModalView.prototype.events
			);
		},


		initialize: function (params) {
			this.options = params;

			this.user = this.options.user;

			this.modal = $(this.el);
			if (!_.isUndefined(this.options.claimersContactsListView)) {
				this.claimersContactsListView = this.options.claimersContactsListView;
				this.currentClaimer = this.claimersContactsListView.model;
			}
//		this.$el.on('shown', function (e) {
//			$(this).find('input, textarea').first().focus();
//		})

		},


		render: function (loader) {
			var self = this;
			$.get(this.templateHTML, function (templateData) {

				var template = _.template(templateData, {
					lang: app.lang,
					contact: self.model.toJSON(),
					user: self.user,
					loader: loader
				});
				self.modal.html(template);
				self.modal.modal('show');
				self.accordionAssociatedAccount();
			});
			return this;
		},


		// toggle loading style for submit button
		toggleLoadingOnSubmitButton: function () {
			var submit_button = $(this.el).find('button[type=submit]');

			if (submit_button.attr('disabled') === 'disabled') {
				submit_button.button('reset');
			} else {
				submit_button.button('loading');
			}
		},


		// Set model given form's values
		setModelPropertiesFromForm: function () {
			var self = this;
			var updatedAttributes = {};

			function readFormValue(attribute) {
				return self.$(('#' + attribute)).val();
			}

			function setAttribute(attribute, value) {
				updatedAttributes[attribute] = value;
			}

			if (self.model.isNew()) {
				setAttribute('partner_id', self.currentClaimer.get('id'));
			}

			setAttribute('name', readFormValue('contactName'));
			setAttribute('function', readFormValue('contactFunction'));
			setAttribute('phone', readFormValue('contactPhone'));
			setAttribute('email', readFormValue('contactEmail'));
			setAttribute('mobile', readFormValue('contactMobile'));
			setAttribute('street', readFormValue('addressStreet'));
			setAttribute('city', readFormValue('addressCity'));
			setAttribute('zip', readFormValue('addressZip'));

			if ($('#createAssociatedAccount').is(':checked')) {
				if (readFormValue('userLogin') === '' || readFormValue('userPassword') === '') {
					app.notify('', 'error',
						app.lang.errorMessages.unablePerformAction,
						app.lang.validationMessages.claimers.accountIncorrect);
					return;
				}
				else {
					this.user.set({
						login: readFormValue('userLogin'),
						password: readFormValue('userPassword'),
						name: readFormValue('contactName')
					});
				}
			}
			this.model.set(updatedAttributes, {silent: true});

		},


		saveContact: function (e) {
			e.preventDefault();
			var self = this;
			self.toggleLoadingOnSubmitButton();
			self.setModelPropertiesFromForm();
			self.persistUser()
				.done(function () {
					self.persistContact()
						.fail(function (e) {
							console.error(e);
						}).
						always(function () {
							self.toggleLoadingOnSubmitButton();
							self.modal.modal('hide');
						});
				}
			);
		},


		persistContact: function () {

			if (this.model.isNew()) {
				return this.createContact();
			} else {
				return this.updateContact();
			}
		},


		updateContact: function () {
			var self = this;
			var patch_data = this.model.changedAttributes();

			if (!_.isUndefined(self.user.id)) {
				$.extend(patch_data, {user_id: self.user.id});
			}
			return self.model.save(patch_data, {patch: true}).
				done(function () {

					self.model.fetch({ data: {fields: self.model.fields} });
					self.model.trigger('updateSuccess');
				});
		},


		createContact: function () {
			var self = this;
			if (!_.isUndefined(self.user.id)) {
				self.model.set('user_id', this.user.id);
			}
			return self.model.save().
				done(function (data) {
					self.model.set('id', data);
					self.model.fetch({silent: true, data: {fields: ClaimersContactsCollection.prototype.fields} }).
						done(function () {
							self.claimersContactsListView.contactsCollection.trigger('add');
							self.claimersContactsListView.contactsCollection.add(self.model);
						});
				});
		},


		persistUser: function () {
			var self = this;

			if ($('#createAssociatedAccount').is(':checked')) {
				if (self.user.isNew()) {
					return self.createUser();
				} else if (self.user.changedAttributes()) {
					return self.updateUser();
				}
			} else {
				var fkdfd = $.Deferred();
				fkdfd.resolve();
				return fkdfd;
			}
		},



		createUser: function () {
			var self = this;
			return self.user.save().done(function (data) {
				self.user.set('id', data);
			});
		},



		updateUser: function () {
			var self = this;
			return self.user.save({password: self.user.password, name: self.user.name}, {patch: true});
		},



		accordionAssociatedAccount: function (event) {
			if (!_.isUndefined(event)) {
				event.preventDefault();
				event.stopPropagation();
			}

			// Toggle Slide Create associated task section //
			$('fieldset.associated-account').stop().slideToggle(function () {
				if ($(this).is(':hidden')) {
					$('#partnerLogin, #partnerPassword').prop('required', false);
					$('#partnerLogin, #partnerPassword').val('');
				}
				else {
					$('#partnerLogin, #partnerPassword').prop('required', true);
				}
			});
		},



		userIsValid: function (user) {
			if (!_.isUndefined(user.get('login')) && user.get('password').length > 5) {
				return true;
			} else {
				return false;
			}
		}

	});

});
