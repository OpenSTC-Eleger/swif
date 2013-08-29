app.Views.ClaimerContactsListView = Backbone.View.extend({

	tagName      : 'tr',

	className    : 'row-item row-nested-objects-collapse',

	templateHTML : 'claimerContactsList',

	events : {
		'click button.modalNewContact' : 'showNewContactModal'
	},

	id: function () {
		return 'collapse_' + this.model.id
	},

	/** View Initialization
	 */
	initialize : function() {
	},


	// This set addresses attribute with the JSON address object
	serializeClaimer: function (claimer) {
		var addresses = claimer.getAddresses();
		_.each(addresses, function (address) {
		})
		claimer.set('addresses',addresses);
		return claimer
	},


	/** When the model is destroy //
	 */
	destroy: function(e){
		var self = this;

		this.highlight().done(function(){
			self.remove();
		});

		app.notify('', 'success', app.lang.infoMessatages.information, e.getCompleteName()+' : '+app.lang.infoMessages.claimerDeleteOk);
		app.views.claimersListView.collection.cpt--;
		app.views.claimersListView.partialRender();
	},

	render: function () {

		var self = this;


		$.get("templates/" + this.templateHTML + ".html", function (templateData) {

			var template = _.template(templateData, {
				lang   : app.lang,
				claimer: self.model.toJSON()
			});

			$(self.el).html(template);

			if (!_.isUndefined(self.contactsCollection)) {
				$(('#claimerContactsList_' + self.model.id)).empty();
				_.each(self.contactsCollection.models, function (address) {
					if (!_.isUndefined(address.user_id)) {
						var user = self.usersCollection.find(address.user_id);
					} else {
						var user = undefined;
					}

					$(('#claimerContactsList_' + self.model.id)).append(
						new app.Views.ClaimerContactView({model: address, user: user}).render().el
					)
				})
			};

			// Set the Tooltip //
			$('*[data-toggle="tooltip"]').tooltip();
		});



		return this;
	},

	fetchContacts: function () {
		var self = this;
		self.contactsCollection = self.model.getAddresses();
	},




	// Fetch users in self.address collection. Should only be launched on contactCollections 'fetchDone' event.
	fetchUsers : function () {
		var self = this;
		var user_ids = _.filter(self.contactsCollection.pluck('user_id'), function (e) {return e != false; });
		user_ids = _.map(user_ids,function (e) {return e[0]});
		self.usersCollection = new app.Collections.Officers()
		if (user_ids.length > 0 ) {
			self.usersCollection.fetch(
				{
					data: {filters: {0:{field:'id',operator:'in',value: user_ids}}}
				}
			)
		};
		return self.usersCollection;
	},


	fetchData : function () {
		var self = this;
		var deferred = jQuery.Deferred( function () {

				self.fetchContacts()
				self.listenTo(self.contactsCollection,'sync', function () {
					self.fetchUsers()
					self.listenTo(self.usersCollection, 'sync', function () {
						deferred.resolve();
					} )
				})
			}
		)
		return deferred

	},

	/** Display Modal form to add/sav a new claimer
	 */
	modalUpdateClaimer: function(e){
		e.preventDefault(); e.stopPropagation();

		app.views.modalClaimerEdit = new app.Views.ModalClaimerEdit({
			el      : '#modalSaveClaimer',
			model   : this.model,
			elFocus : $(e.target).data('form-id')
		});
	},



	/** Modal to remove a claimer
	 */
	modalDeleteClaimer: function(e){
		e.preventDefault(); e.stopPropagation();

		app.views.modalDeleteView = new app.Views.ModalDeleteView({
			el         : '#modalDeleteClaimer',
			model      : this.model
		});
	},


	showNewContactModal: function (e) {
		var self = this;
		e.preventDefault(); e.stopPropagation();
		var new_contact = new app.Models.ClaimerContact;
		new app.Views.ModalContactEdit({
			el : "#modalEditContact",
			model : new_contact,
			claimersContactsListView: self
		}).render();
	},



	/** Highlight the row item
	 */
	highlight: function(){
		var self = this;

		$(this.el).addClass('highlight');

		var deferred = $.Deferred();

		// Once the CSS3 animation are end the class are removed //
		$(this.el).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
			function(e) {
				$(self.el).removeClass('highlight');
				deferred.resolve();
			});

		return deferred;
	}

});