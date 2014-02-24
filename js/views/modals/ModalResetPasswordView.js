/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

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
				'submit #formResetPassword'        : 'resetPassword',

				'mousedown #toggleDisplayPassword' : 'displayPassword',
				'mouseup #toggleDisplayPassword'   : 'hidePassword'
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

				$('*[data-toggle="tooltip"]').tooltip({ container: '.form-group' });

				self.modal.modal('show');
			});

			return this;
		},



		/** Reset password
		*/
		resetPassword: function(e){
			e.preventDefault();

			if(this.checkPassword()){

				var self = this;

				// Set the button in loading State //
				$(this.el).find('button[type=submit]').button('loading');

				/*console.log($('#newPassword').val());
				console.log($('#confirmPassword').val());*/

				var params = { new_password : $('#newPassword').val() };


				this.model.save(params, {patch: true, wait: true})
					.done(function() {
						self.modal.modal('hide');
					})
					.fail(function (e) {
						console.log(e);
					})
					.always(function () {
						$(self.el).find('button[type=submit]').button('reset');
					});
			}
		},



		/** Calcul the area of the place
		*/
		checkPassword: function () {

			if(this.checkPasswordRules() && this.checkPasswordsMatch()){
				return true;
			}
			else{
				return false;
			}

		},



		/** Check if the password filled the rules right
		*/
		checkPasswordRules: function(){
			if($('#newPassword').val().length < 7){
				$('#newPasswordGroup').addClass('has-error');
				return false;
			}
			else{
				$('#newPasswordGroup').removeClass('has-error');
				return true;
			}
		},

		/** Check if the new password and the confirmation are equals
		*/
		checkPasswordsMatch: function(){
			if($('#newPassword').val() != $('#confirmPassword').val()){
				$('#confirmPasswordGroup').addClass('has-error');
				$('#confirmPasswordGroup .help-block').removeClass('hide');

				return false;
			}
			else{
				return true;
			}
		},



		/** Display the password
		*/
		displayPassword: function(e){
			$('#newPassword, #confirmPassword').prop('type', 'text');
			$(e.target).removeClass('fa-eye').addClass('fa-eye-slash');
		},

		/** Hide the password
		*/
		hidePassword: function(e){
			$('#newPassword, #confirmPassword').prop('type', 'password');
			$('#newPassword').focus();
			$(e.target).removeClass('fa-eye-slash').addClass('fa-eye');
		}

	});

	return ModalResetPasswordView;

});