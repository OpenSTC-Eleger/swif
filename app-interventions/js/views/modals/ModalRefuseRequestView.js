/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'requestModel',

	'genericModalView'

], function(app, RequestModel, GenericModalView){

	'use strict';

	/******************************************
	* Refuse Request Modal View
	*/
	var ModalRefuseRequestView = GenericModalView.extend({


		templateHTML : '/templates/modals/modalRefuseRequest.html',


		// The DOM events //
		events: function(){
			return _.defaults({
				'submit #formRefuseRequest'   : 'refuseRequest'
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
		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang    : app.lang,
					request : self.model
				});

				self.modal.html(template);

				self.modal.modal('show');
			});

			return this;
		},



		/** Delete the model pass in the view
		*/
		refuseRequest: function(e){
			e.preventDefault();

			var self = this;

			// Set the button in loading State //
			$(this.el).find('button[type=submit]').button('loading');


			var params = {
				state          : RequestModel.status.refused.key,
				refusal_reason : $('#motifRefuse').val()
			};


			// Save Only the params //
			this.model.save(params, {patch: true, silent: true})
				.done(function() {
					self.modal.modal('hide');
					self.model.fetch({ data : {fields : self.model.fields} });
				})
				.fail(function (e) {
					console.log(e);
				})
				.always(function () {
					$(self.el).find('button[type=submit]').button('reset');
				});
		}

	});

	return ModalRefuseRequestView;
});