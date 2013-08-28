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
		this.fetchOfficers()
	},

	render: function () {
		var self = this;
		this.listenTo(this.officers,'fetchDone', function () {this.applyTemplate();})
		return this;
	},

	applyTemplate: function () {
		var self = this;
		this.serialize()
		$.get("templates/" + self.templateHTML + ".html", function (templateData) {
			var template = _.template(templateData, {
				lang   : app.lang,
				address: self.model.toJSON()
			});
			$(self.el).html(template);
		});
	},

	// This function retrieves officers attached to the related contact
	fetchOfficers: function () {
		var self = this;
		self.officers = new app.Collections.Officers()
		if (!_.isUndefined(self.options.user_ids) && self.options.user_ids.length > 0) {

			self.officers.fetch({
				data: {filters: {0:{field:'id',operator:'in',value: self.options.user_ids}}}
			}).done( function () {
					self.officers.trigger('fetchDone')
				})
		}else {
			self.officers.trigger('fetchDone')
		}
	},

	serialize: function () {
		if (this.model.get('user_id') != false) {
			this.model.set('user_login', this.officers.get(this.model.get('user_id')[0]).get('login'));
		}
	},

	/** Display the form to add a new contact
	 */
	modalEditContact: function(e){
		this.selectedAddressJSON = null;
		this.getTarget(e);

		var link = $(e.target);

		// Reset the form //
		$('#modalSaveContact input').val('');
		$('#createAssociatedAccount, #partnerLogin').prop('disabled', false);
		$('#createAssociatedAccount').prop('checked', false);

		// Check if it's a creation or not //
		if(link.data('action') == 'update'){

			this.getTarget(e);
			this.selectedAddress = app.collections.claimersContacts.get(this.pos);
			this.selectedAddressJSON = this.selectedAddress.toJSON();

			// Set Informations in the form //
			$('#addressName').val(this.selectedAddressJSON.name);
			$('#addressEmail').val(this.selectedAddressJSON.email);
			$('#addressFunction').val(this.selectedAddressJSON.function);
			if(this.selectedAddressJSON.phone != false){
				$('#addressPhone').val(this.selectedAddressJSON.phone);
			}

			if(this.selectedAddressJSON.mobile != false){
				$('#addressMobile').val(this.selectedAddressJSON.mobile);
			}

			if(this.selectedAddressJSON.addressStreet != false){
				$('#addressStreet').val(this.selectedAddressJSON.street);
			}
			if(this.selectedAddressJSON.addressCity != false){
				$('#addressCity').val(this.selectedAddressJSON.city);
			}
			if(this.selectedAddressJSON.addressZip != false){
				$('#addressZip').val(this.selectedAddressJSON.zip);
			}


			// Check if the user have an account in OpenERP //
			if(this.selectedAddressJSON.user_id != false){
				$('#createAssociatedAccount').prop('checked', true); $('#createAssociatedAccount, #partnerLogin').prop('disabled', true);
				$('fieldset.associated-account').show();

				var off = app.collections.officers.get(this.selectedAddressJSON.user_id[0]);
				$('#partnerLogin').val(off.getLogin());
			}
			else{
				$('fieldset.associated-account').hide();
				$('#createAssociatedAccount, #partnerLogin').prop('disabled', false);
			}

			$('fieldset.associated-adress').show();
		}
		else{
			// Reset the form //
			$('fieldset.associated-account').hide();
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