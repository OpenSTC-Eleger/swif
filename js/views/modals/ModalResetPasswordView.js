define([
	'app',

	'genericModalView',
	

], function(app, GenericModalView){

	'use strict';


	/******************************************
	* Reset Password Modal View
	*/
	var ModalResetPasswordView = GenericModalView.extend({


		templateHTML : 'templates/modals/modalResetPassword.html',



		// The DOM events //
		events: function(){
			return _.defaults({
				'change #placeWidth, #placeLength' : 'checkPassword',
				'submit #formResetPassword'        : 'resetPassword'
			}, 
				GenericModalView.prototype.events
			);
		},



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;

			this.modal = $(this.el);

			this.render();
		},



		/** Display the view
		*/
		render : function(loader) {
			var self = this;


			// Retrieve the template // 
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang  : app.lang,
					user  : self.model,
					loader: loader
				});

				self.modal.html(template);

				self.modal.modal('show');
			});

			return this;
		},



		/** Reset password
		*/
		resetPassword: function(e){
			e.preventDefault();	

			var self = this;

			// Set the button in loading State //
			$(this.el).find("button[type=submit]").button('loading');

			/*console.log($('#newPassword').val());
			console.log($('#confirmPassword').val());*/

			var params = { new_password : $('#newPassword').val() };


			this.model.save(params, {patch: true, wait: true})
				.done(function(data) {
					self.modal.modal('hide');
				})
				.fail(function (e) {
					console.log(e);
				})
				.always(function () {
					$(self.el).find("button[type=submit]").button('reset');
				});
		},



		/** Calcul the area of the place
		*/
		checkPassword: function (e) {
			console.log($('#newPassword').val());
			console.log($('#confirmPassword').val());
		}

	});

	return ModalResetPasswordView;

});