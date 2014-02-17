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
					filter    : self.model,
					filterInfo: app.views.advanceSearchView.humanizeFilter()
				});

				self.modal.html(template);
				self.modal.modal('show');
			});

			return this;
		},



		/** Save the filter
		*/
		saveFilter: function(e){
			e.preventDefault();
			var self = this;

			// Set the button in loading State //
			$(this.el).find('button[type=submit]').button('loading');

			this.model.setName(this.$('#filterName').val(), true);
			this.model.setDescription(this.$('#filterDescription').val(), true);

			this.model.save().done(function(){
				self.modal.modal('hide');
				app.notify('', 'success', app.lang.infoMessages.information, app.lang.infoMessages.filterSaveOk);
			})
			.fail(function(e){
				console.error(e);
			})
			.always(function () {
				$(self.el).find('button[type=submit]').button('reset');
			});
		}

	});

	return ModalSaveFilterView;

});