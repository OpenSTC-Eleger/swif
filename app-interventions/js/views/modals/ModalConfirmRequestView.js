/*!
 * SWIF-OpenSTC
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
	* Confirm Request Modal View
	*/
	var ModalConfirmRequestView = GenericModalView.extend({


		templateHTML : '/templates/modals/modalConfirmRequest.html',


		// The DOM events //
		events: function(){
			return _.defaults({
				'submit #formConfirmRequest'   : 'confirmRequest'
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
			$.get(app.menus.openstc + this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang    : app.lang,
					request : self.model
				});

				self.modal.html(template);

				self.modal.modal('show');
			});

			return this;
		},



		/** Confirm the request to the DST
		*/
		confirmRequest: function(e){
			e.preventDefault();

			var self = this;

			// Set the button in loading State //
			$(this.el).find('button[type=submit]').button('loading');


			var params = {
				state   : RequestModel.status.confirm.key,
				note    : $('#informationForDST').val()
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

	return ModalConfirmRequestView;
});