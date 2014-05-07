/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'genericModalView'


], function(app, GenericModalView){


	'use strict';



	/******************************************
	* Inter Detail Cost View
	*/
	var modalDetailCostInterView = GenericModalView.extend({


		templateHTML : '/templates/modals/interventions/modalInterDetailCost.html',


		// The DOM events //
		events: function() {
			return	GenericModalView.prototype.events;
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



			console.log(this.model.attributes);


			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang  : app.lang,
					inter : self.model,
					loader: loader
				});

				self.modal.html(template);
				self.modal.modal('show');

				$('*[data-toggle="tooltip"]').tooltip();

			});

			return this;
		}




	});


	return modalDetailCostInterView;

});