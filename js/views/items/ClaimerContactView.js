app.Views.ClaimerContactView = Backbone.View.extend({

	tagName     : 'tr',
	className   : 'row-nested-objects',
	templateHTML: 'items/claimerContact',

	event : {
		'click .modalEditContact' : 'showEditModal',
		'click .modalDeleteContact' : 'showModalDelete'
	},

	id: function () {
		return 'address_' + this.model.id
	},

	initialize: function () {
		this.user = this.options.user;
		console.log("------------in claimer contact init-------------")
	},

	render: function () {
		console.log("------------in claimer contact render-------------")
		var self = this;
		this.serialize();
		$.get("templates/" + self.templateHTML + ".html", function (templateData) {
			var template = _.template(templateData, {
				lang   : app.lang,
				address: self.model.toJSON()
			});

			$(self.el).html(template);
		});

		return this;
	},

	serialize: function () {
		if (!_.isUndefined(this.user)) {
			this.model.set('user_login', this.officers.get(this.model.get('user_id')[0]).get('login'));
		}
	},


	showEditModal: function () {
		console.log("show edit")
		new app.Views.ModalContactEdit({model:this.model, el: "#modalEditContact"}).render()

	},

	/** Delete Address
	 */
	deleteAddress: function(e){
		var self = this;
		this.selectedAddress.delete({
			success: function(data){
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					app.collections.claimersContacts.remove(self.selectedAddress);
					var claimer = app.collections.claimers.get(self.selectedAddressJSON.livesIn.id);
					claimer.attributes.address.remove(self.selectedAddressJSON.id);
					app.collections.claimers.add(claimer);
					$('#modalDeleteContact').modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.addressDeleteOk);
					self.render();
				}
			},
			error: function(e){
				alert("Impossible de supprimer le contact");
			}

		});

	},





	/** Set informations to the Modal for delete contact
	 */
	modalDeleteContact: function(e){
		this.getTarget(e);
		this.selectedAddress = app.collections.claimersContacts.get(this.pos);
		this.selectedAddressJSON = this.selectedAddress.toJSON();
		//console.log(this.selectedAddressJSON);
		$('#infoModalDeleteContact').children('p').html(this.selectedAddressJSON.name);
		$('#infoModalDeleteContact').children('small').html(_.capitalize(this.selectedAddressJSON.function));
	},



});