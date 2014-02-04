define([
	'app',

	'genericModalView',


], function(app, GenericModalView){

	'use strict';


	/******************************************
	* Modal Delete View
	*/
	var ModalSaveFilterView = GenericModalView.extend({


		templateHTML : 'templates/modals/modalSaveFilter.html',


		// The DOM events //
		events: function(){
			return _.defaults({
				'submit ' : 'saveFilter',
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
			$.get(this.templateHTML, function(templateData){
			 
				var template = _.template(templateData, {
					lang      : app.lang,
					filter    : self.model
				});

				self.modal.html(template);
				self.modal.modal('show');
			});

			return this;
		},



		/** Save the filter
		*/
		saveFilter: function(e){
			var self = this;


			// Set the button in loading State //
			$(e.target).button('loading');

		}

	});

	return ModalSaveFilterView;

});