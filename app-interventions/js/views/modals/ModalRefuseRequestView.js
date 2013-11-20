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
	
	
		templateHTML : 'modals/modalRefuseRequest',
	
	
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
			var self = this;
	
			this.modal = $(this.el);
	
			this.render();
		},
	
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
	
			// Retrieve the template // 
			$.get(app.moduleUrl + "/	templates/" + this.templateHTML + ".html", function(templateData){
	
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
			$(this.el).find("button[type=submit]").button('loading');
	
	
			var params = {
				state          : RequestModel.status.refused.key,
				refusal_reason : $('#motifRefuse').val()
			}
	
	
			// Save Only the params //
			this.model.save(params, {patch: true, silent: true})
				.done(function(data) {
					self.modal.modal('hide');
					self.model.fetch({ data : {fields : self.model.fields} });
				})
				.fail(function (e) {
					console.log(e);
				})
				.always(function () {
					$(self.el).find("button[type=submit]").button('reset');
				});
		}
	
	});
	return ModalRefuseRequestView;
})