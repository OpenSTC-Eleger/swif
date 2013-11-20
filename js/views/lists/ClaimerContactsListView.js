define(['app', 'appHelpers', 'officerModel', 'officersCollection', 'claimerContactModel', 'claimerContactView', 'modalClaimerEdit', 'modalDeleteView', 'modalContactEdit'

], function (app, AppHelpers, OfficerModel, OfficersCollection, ClaimerContactModel, ClaimerContactView, ModalClaimerEdit, ModalDeleteView, ModalContactEdit) {

	'use strict';

	return Backbone.View.extend({

		tagName: 'tr',

		className: 'row-item row-nested-objects-collapse',

		templateHTML: 'lists/claimerContacts',

		events: {
			'click button.modalNewContact': 'showNewContactModal'
		},

		id: function () {
			return 'collapse_' + this.model.id
		},

		/** View Initialization
		 */
		initialize: function () {
			var self = this;
			self.fetchData().done(
				function () {
					self.contactsCollection.off();
					self.listenTo(self.contactsCollection, 'add', self.addContact);
				}
			)
		},

		addContact: function (contact) {
			console.log("fucking !");
			var self = this;
			var contactView = new ClaimerContactView({ model: contact });
			$(('#claimerContactsList_' + self.model.id)).append(
				contactView.render().el
			);
			AppHelpers.highlight($(contactView.el));
		},

		// This set addresses attribute with the JSON address object
		serializeClaimer: function (claimer) {
			var addresses = claimer.getAddresses();
			_.each(addresses, function (address) {
			})
			claimer.set('addresses', addresses);
			return claimer
		},

		/** When the model is destroy //
		 */
		destroy: function (e) {
			var self = this;

			AppHelpers.Main.highlight($(this.el)).done(function () {
				self.remove();
			});

			app.notify('', 'success', app.lang.infoMessatages.information, e.getCompleteName() + ' : ' + app.lang.infoMessages.claimerDeleteOk);
			app.views.claimersListView.collection.cpt--;
			app.views.claimersListView.partialRender();
		},

		render: function () {

			var self = this;

			$.get("templates/" + this.templateHTML + ".html", function (templateData) {
				var contactNb = self.model.toJSON().address.length;
				if (!_.isUndefined(self.contactsCollection)) {
					contactNb = self.contactsCollection.length;
				}
				var template = _.template(templateData, {
					lang     : app.lang,
					claimer  : self.model.toJSON(),
					contactNb: contactNb
				});

				$(self.el).html(template);

				if (!_.isUndefined(self.contactsCollection)) {
					$(('#claimerContactsList_' + self.model.id)).empty();
					_.each(self.contactsCollection.models, function (address) {
						if (!_.isUndefined(address.get('user_id')[0])) {
							var user = self.usersCollection.get(address.get('user_id')[0]);
						} else {
							var user = undefined;
						}
						$(('#claimerContactsList_' + self.model.id)).append(
							new ClaimerContactView({model: address, user: user}).render().el
						)
					})
				}
				;

				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip();
			});
			return this;
		},

		fetchContacts: function () {
			var self = this;
			self.contactsCollection = self.model.getAddresses();
			return self.contactsCollection
		},

		// Fetch users in self.address collection. Should only be launched on contactCollections 'fetchDone' event.
		fetchUsers   : function () {
			var self = this;
			self.usersCollection = new OfficersCollection();
			if (this.getUserIds().length > 0) {
				self.usersCollection.fetch(
					{
						data: {filters: {0: {field: 'id', operator: 'in', value: this.getUserIds()}}}
					}
				)
			}
			;

			return self.usersCollection;
		},

		fetchData: function () {
			var self = this;
			var deferred = jQuery.Deferred(function () {

					self.fetchContacts()
					self.listenTo(self.contactsCollection, 'sync', function () {
						if (this.getUserIds().length > 0) {
							self.fetchUsers();
							self.listenTo(self.usersCollection, 'sync', function () {
								deferred.resolve();
							})
						} else {
							deferred.resolve();
						}

					})
				}
			)
			return deferred

		},

		getUserIds: function () {
			var self = this;

			var user_ids = _.filter(self.contactsCollection.pluck('user_id'), function (e) {
				return e != false;
			});

			user_ids = _.map(user_ids, function (e) {
				if (!_.isNull(e)) {
					return e[0];
				}
			});

			return user_ids;
		},

		/** Display Modal form to add/sav a new claimer
		 */
		modalUpdateClaimer: function (e) {
			e.preventDefault();
			e.stopPropagation();

			app.views.modalClaimerEdit = new ModalClaimerEdit({
				el     : '#modalSaveClaimer',
				model  : this.model,
				elFocus: $(e.target).data('form-id')
			});
		},

		/** Modal to remove a claimer
		 */
		modalDeleteClaimer: function (e) {
			e.preventDefault();
			e.stopPropagation();

			app.views.modalDeleteView = new ModalDeleteView({
				el   : '#modalDeleteClaimer',
				model: this.model
			});
		},

		showNewContactModal: function (e) {
			var self = this;
			e.preventDefault();
			e.stopPropagation();
			var new_contact = new ClaimerContactModel;
			new ModalContactEdit({
				el                      : "#modalEditContact",
				model                   : new_contact,
				claimersContactsListView: self,
				user                    : new OfficerModel()
			}).render();
		}
	});
});