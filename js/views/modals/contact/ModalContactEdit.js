app.Views.ModalContactEdit = app.Views.GenericModalView.extend({

	templateHTML : 'modals/contact/contactEdit',
	el : "#modalEditContact",
	events: function(){
		return _.defaults({
				'submit #formContact'            : 'saveContact',
			},
			app.Views.GenericModalView.prototype.events
		);
	},

	initialize : function() {
		var self = this;
		this.el = this.options.el;
		this.modal = $(this.el);
		this.claimersContactsListView = this.options.claimersContactsListView;
		this.currentClaimer = this.claimersContactsListView.model;
	},

	render : function(loader) {
		var self = this;
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang  : app.lang,
				contact : self.model,
				loader: loader
			});
 			self.modal.html(template);
			self.modal.modal('show');
		});
		return this;
	},

	// toggle loading style for submit button
	toggleLoadingOnSubmitButton : function () {
		var submit_button = $(this.el).find("button[type=submit]")
		if (submit_button.attr('disabled') == 'disabled') {
			submit_button.button('reset');
		}else {
			submit_button.button('loading');
		}
	},

	// Set model given form's values
	setModelPropertiesFromForm: function () {
		var self = this;
		var updatedAttributes = {};
		function readFormValue (attribute) {
			return self.$(('#' + attribute)).val()
		};

		function setAttribute(attribute, value) {
			updatedAttributes[attribute] = value;
		};

		setAttribute('name', readFormValue('contactName'));
		setAttribute('partner_id', self.currentClaimer.get('id'));
		setAttribute('function', readFormValue('contactFunction'));
		setAttribute('phone', readFormValue('contactPhone'));
		setAttribute('email', readFormValue('contactEmail'));
		setAttribute('mobile', readFormValue('contactMobile'));
		setAttribute('street', readFormValue('addressStreet'));
		setAttribute('city', readFormValue('addressCity'));
		setAttribute('zip', readFormValue('addressCity'));

		if( $('#createAssociatedAccount').is(':checked') ){
			if(readFormValue('userLogin') == '' || readFormValue('userPassword') == ''){
				app.notify('', 'error',
					app.lang.errorMessages.unablePerformAction,
					app.lang.validationMessages.claimers.accountIncorrect);
				return;
			}
			else{
				this.params.login = readFormValue('userLogin');
				this.params.password = readFormValue('userPassword');
			}
		}
		this.model.set(updatedAttributes, {silent:true});

	},

	saveContact: function(e){
		e.preventDefault();
		var self = this;
		self.toggleLoadingOnSubmitButton();
		self.setModelPropertiesFromForm();
		self.persistContact().fail(function (e) {
			console.log(e);
		}).
			always(function () {
				self.toggleLoadingOnSubmitButton();
				self.modal.modal('hide');
			});
	},

	persistContact: function () {
		if (this.model.isNew()) {
			return this.createContact()
		} else {
			return this.updateContact()
		}
	},

	updateContact: function () {
		var self = this;
		return self.model.save(this.model.changedAttributes(),{patch :true}).
			done(function () {
				self.model.fetch({ data : {fields : self.model.fields} });
			})
	},

	createContact: function () {
		var self = this;
		return self.model.save().
			done( function (data) {
				self.model.set('id',data);
				self.model.fetch({silent: true, data : {fields : app.Collections.ClaimersContacts.prototype.fields} }).
					done( function () {
						$(('#claimerContactsList_' + self.currentClaimer.id)).append(
							new app.Views.ClaimerContactView({model: self.model, user_ids:[]}).render().el
						)
					})
			})
	}

});