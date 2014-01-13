define([
	'app',

	'claimersCollection',

	'modalPlaceView',
	'moment'

], function(app, ClaimersCollection, ModalResetPasswordView, moment){

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