/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',

	'genericModalView',

	'bookingModel',
	'moment'

], function(app, GenericModalView, BookingModel, moment){

	'use strict';


	/******************************************
	* Requests Details View
	*/
	var ModalReservationDetailsView = GenericModalView.extend({


		templateHTML : '/templates/modals/modalReservationDetails.html',



		// The DOM events //
		events: function() {
			return	GenericModalView.prototype.events
		},



		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;
			var self = this;

			this.modal = $(this.el);


			this.render(true);

			if(_.isUndefined(this.model)){

				this.model = new BookingModel({id: params.modelId});

				this.model.fetch({silent: true, data : {fields : BookingModel.prototype.fields}}).done(function(){
					self.render();
				});
			}

		},



		/** Display the view
		*/
		render: function(loader) {

			var self = this;


			// Retrieve the template //
			$.get(app.menus.openresa+this.templateHTML, function(templateData){

				console.log(self.model);

				var template = _.template(templateData, {
					lang         : app.lang,
					loader       : loader,
					moment       : moment,
					BookingModel : BookingModel,
					booking      : self.model
				});

				self.modal.html(template);


				self.modal.modal('show');
			});

			return this;
	    },

	});

return ModalReservationDetailsView;

});