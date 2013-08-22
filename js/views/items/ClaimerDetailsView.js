app.Views.ClaimerDetailsView = Backbone.View.extend({

	tagName      : 'tr',

	className    : 'row-item row-nested-objects-collapse',

	templateHTML : 'items/claimerDetails',

	id: function () {
		return 'collapse_' + this.model.id
	},

//
//	// The DOM events //
//	events: {
//		'click'                    : 'modalUpdateclaimer',
//		'click a.modalDeleteclaimer' : 'modalDeleteclaimer'
//	},
//


	/** View Initialization
	 */
	initialize : function() {
		this.model.off();

		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);

		// When the model are destroy //
		this.listenTo(this.model,'destroy', this.destroy);
	},



	/** When the model is updated //
	 */
	change: function(e){

		this.render();
		this.highlight();
		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.claimerUpdateOk);
	},


	// This set addresses attribute with the JSON address object
	serializeClaimer: function (claimer) {
		var addresses = claimer.getAddresses();
		_.each(addresses, function (address) {
			console.log(address)

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

		app.notify('', 'success', app.lang.infoMessages.information, e.getCompleteName()+' : '+app.lang.infoMessages.claimerDeleteOk);
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

			// Set the Tooltip //
			$('*[data-toggle="tooltip"]').tooltip();
		});

		return this;
	},

	fetchDetails: function () {
		var self = this;
		var addresses = self.model.getAddresses()
		$(('#claimerContactsList_' + self.model.id)).empty();
		self.listenTo(addresses, 'fetchDone', function () {
			var user_ids = _.filter(addresses.pluck('user_id'), function (e) {return e != false; });
			user_ids = _.map(user_ids,function (e) {return e[0]});
			console.log(user_ids);
			_.each(addresses.models, function (address) {
				$(('#claimerContactsList_' + self.model.id)).append(
					new app.Views.ClaimerContactView({model: address, user_ids:user_ids}).render().el
				)
			})
		});
	},


	/** Display Modal form to add/sav a new claimer
	 */
	modalUpdateClaimer: function(e){
		e.preventDefault(); e.stopPropagation();

		app.views.modalClaimerView = new app.Views.ModalClaimerView({
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