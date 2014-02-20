define([
	'app',
	'genericModalView',''

], function(app, GenericModalView){
	'use strict';


	/******************************************
	 * Intervention Details View
	 */
	var ModalCancelTaskView = GenericModalView.extend({


		templateHTML: '/templates/modals/interventions/modalCancelTask.html',


		// The DOM events //
		events: function() {
			return _.defaults({
			'submit #formCancelTask' 			: 'cancelTask',
			},
			GenericModalView.prototype.events);

		},

		/** View Initialization
		 */
		initialize: function (params) {
		    var self = this;
		    //backward compatibility for last version of SWIF, must be changed to make a better use of Backbone View
		    this.options = params;
		    console.log("Cancel Intervention view intialization")
		    this.modal = $(this.el);
	    	self.render();
	    },

	    /** Display the view
	     */
	    render: function () {


			var self = this;
			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){

				var template = _.template(templateData, {lang: app.lang, task: self.model.toJSON()});

				self.modal.html(template);
				self.modal.modal('show');
			});

			return this;
	    },



		/** Cancel Task
		*/
		cancelTask: function(e){
			e.preventDefault();
			var self = this;
			this.model.cancel($('#motifCancelTask').val())
				.done(function(){
					$.when(self.model.fetch({wait: true}))
					.fail(function(e){
						console.log(e)}
					);
					if(!_.isUndefined(self.options.inter)){
						self.options.inter.fetch().fail(function(e){console.log(e)});
					}
					self.modal.modal('hide');
				})
				.fail(function(e){
					console.log(e)
				});

			//alert("Merci de laisser du temps pour pouvoir développer cette fonctionnalité");
		}


	});
	return ModalCancelTaskView;
})
