define([
	'app',

	'modalPlaceView',
	'moment'

], function(app, ModalResetPasswordView, moment){

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
			this.model.off();

			// When the model are updated //
			//this.listenTo(this.model, 'change', this.change);
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

			app.views.modalPlaceView = new ModalResetPasswordView({
				el  : '#modalResetPassword'
			});
		}

	});

	return ItemUserView;

});