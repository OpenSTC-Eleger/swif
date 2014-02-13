define([
	'app',
	'appHelpers',

	'claimersCollection',

	'modalResetPasswordView',
	'moment'

], function(app, AppHelpers, ClaimersCollection, ModalResetPasswordView, moment){

	'use strict';


	/******************************************
	* Row Place View
	*/
	var ItemUserView = Backbone.View.extend({

		tagName      : 'tr',

		className    : 'row-item',

		templateHTML : 'templates/items/itemUser.html',


		// The DOM events //
		events: {
			'click a.modalResetPassword' : 'modalResetPassword'
		},



		/** View Initialization
		*/
		initialize : function() {
			var self = this;

			this.model.off();

			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);


			// if the user is associated to an Organization, retrieve it //
			if(!_.isEmpty(this.model.getServices())){
				this.render();				
			}
			else{
				this.getOrganization().done(function(data, result){
						self.model.attributes.organization = result[0][0];
					self.render();
				}); 
			}
		},




		change: function(){
			AppHelpers.highlight($(this.el));
			app.notify('', 'success', app.lang.infoMessages.information, app.lang.infoMessages.passwordReset);
		},



		/** Display the view
		*/
		render : function() {
			var self = this;

			// Retrieve the template // 
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang  : app.lang,
					user  : self.model,
					moment: moment
				});

				$(self.el).html(template);

				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip();
			});

			return this;
		},



		/** Modal form to reset the password
		*/
		modalResetPassword: function(e){
			e.preventDefault();

			app.views.modalResetPasswordView = new ModalResetPasswordView({
				el    : '#modalResetPassword',
				model : this.model
			});
		},



		/** Get the organization of a user
		*/
		getOrganization: function(){
			var self = this;

			var m = new ClaimersCollection();

			// Create Fetch params //
			var fetchParams = {
				silent : true,
				data   : {
					filters : [{ field : 'address.user_id.id', operator : '=', value : this.model.getId() }]
				}
			};

			return m.fetch(fetchParams).done(function(){
				
			});
		}

	});

	return ItemUserView;

});