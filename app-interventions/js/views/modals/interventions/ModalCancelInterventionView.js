define([
	'app',

	'genericModalView',

], function(app, GenericModalView){
	'use strict';

	/******************************************
	 * Intervention Details View
	 */
	var ModalCancelInterventionView = GenericModalView.extend({


		templateHTML: '/templates/modals/interventions/modalCancelIntervention.html',


		// The DOM events //
		events: function() {
			return _.defaults({
			'submit #formCancelInter'          : 'cancelInter',
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
			app.router.setPageTitle(app.lang.viewsTitles.newTask);


			var self = this;
			// Retrieve the template //
			$.get(app.menus.openstc+this.templateHTML, function(templateData){

				var template = _.template(templateData, {lang: app.lang, inter: self.model.toJSON()});

				self.modal.html(template);
				self.modal.modal('show');
			});

			return this;
	    },


		/** Cancel Intervention
		*/
		cancelInter: function(e){
			e.preventDefault();
			var self = this;
			//cancel the intervention and fetch all tasks associated to display there new state
			this.model.cancel($('#motifCancel').val()).done(function(data){
				self.modal.modal('hide');
				if(!_.isUndefined(self.options.tasks)){
					_.each(self.model.toJSON().tasks, function(taskId, i){
						var task = self.options.tasks.get(taskId);
						task.fetch();
					});
				}
			});
		},

	});
	return ModalCancelInterventionView;
})
