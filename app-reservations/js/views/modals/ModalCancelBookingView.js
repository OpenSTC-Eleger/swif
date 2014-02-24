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
	 * Booking Details View
	 */
	var ModalCancelBookingView = GenericModalView.extend({


		templateHTML: '/templates/modals/modalCancelBooking.html',


		// The DOM events //
		events: function() {
			return _.defaults({
				'submit #formCancelBooking'          : 'cancelBooking',
			},
			GenericModalView.prototype.events);

		},

		/** View Initialization
		 */
		initialize: function (params) {
		    var self = this;

		    this.options = params;

		    this.modal = $(this.el);
	    	self.render();
	    },

	    /** Display the view
	     */
	    render: function () {

			// Change the page title depending on the create value //
			app.router.setPageTitle(app.lang.resa.viewsTitles.cancelBooking);
			var isClaimer = !app.current_user.isResaManager();

			var self = this;
			// Retrieve the template //
			$.get(app.menus.openresa+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang: app.lang,
					inter: self.model.toJSON(),
					isClaimer: isClaimer});

				self.modal.html(template);
				$('.make-switch').bootstrapSwitch();
				self.modal.modal('show');
			});

			return this;
	    },


		/** Cancel Booking
		*/
		cancelBooking: function(e){
			e.preventDefault();
			var self = this;

			var params = {}
			params.cancelNote = $('#modelCancelBookingNote').val();
			params.send_email = $('#modelCancelBookingSendMail').bootstrapSwitch('state');
			//params.email_text = InterventionModel.status.cancelled.translation;

			//cancel the booking and fetch all tasks associated to display there new state
			this.model.save(params, {patch: true, silent: true})
				.done(function(data) {
					self.model.destroy().done(function(){
						self.modal.modal('hide');
					})
				});
		},

	});
	return ModalCancelBookingView;
})
