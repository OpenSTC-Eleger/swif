app.Views.ClaimerContactView = Backbone.View.extend({

	tagName     : 'tr',
	className   : 'row-nested-objects',
	templateHTML: 'items/claimerContact',

	events: {
		'click a.modalEditContact'  : 'showEditModal',
		'click a.modalDeleteContact': 'showDeleteModal'
	},

	id: function () {
		return 'address_' + this.model.id
	},

	initialize: function () {
		this.user = this.options.user;
		this.listenTo(this.model, 'updateSuccess', this.changed);
		this.listenTo(this.model,'destroy', this.destroyed);
	},

	render: function () {
		console.log('in render')
		var self = this;

		$.get("templates/" + self.templateHTML + ".html", function (templateData) {
			var template = _.template(templateData, {
				lang   : app.lang,
				address: self.serializeContact()
			});

			$(self.el).html(template);
		});

		return this;
	},

	serializeContact: function () {
		var tpl_data = this.model.toJSON()
		if (!_.isUndefined(this.user)) {
			$.extend(tpl_data, {user_login: this.user.login})
		}

		return tpl_data
	},


	changed: function () {
		this.render();
		app.Helpers.Main.highlight($(this.el));
		app.notify('', 'success', app.lang.infoMessages.information, this.model.get('name') + ' : ' + app.lang.infoMessages.placeUpdateOk);
	},

	showEditModal: function (e) {
		e.preventDefault();
		e.stopPropagation();
		if (_.isUndefined(this.user)) {
			var edit_user = new app.Models.Officer()
		} else {
			var edit_user = this.user
		}

		new app.Views.ModalContactEdit({model: this.model, el:"#modalEditContact",user: edit_user}).render()
	},

	showDeleteModal: function (e) {
		e.preventDefault();
		new app.Views.ModalDeleteView({el: '#modalDeleteClaimerContact', model: this.model,
			modalTitle: app.lang.viewsTitles.deleteContact, modalConfirm: app.lang.warningMessages.confirmDeleteContact
		});
	},

	/** Delete Address
	 */
	deleteAddress: function (e) {
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
			error  : function (e) {
				alert("Impossible de supprimer le contact");
			}

		});

	},

	destroyed: function (e) {
		var self = this;

		app.Helpers.Main.highlight($(this.el)).done(function(){
			self.$el.remove();
		});

		app.notify('', 'success', app.lang.infoMessages.information, self.model.get('name')+' : '+app.lang.infoMessages.contactDeleteOk);
	}

});