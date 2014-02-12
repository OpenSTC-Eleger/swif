define([
	'app',

], function(app){

	'use strict';


	/******************************************
	* Footer View
	*/
	var FooterView = Backbone.View.extend({

		el           : '#footer-navbar',

		templateHTML : 'templates/others/footer.html',

	 
	 
		/** View Initialization
		*/
		initialize: function () {
			this.render();
		},

		

		/** Display the view
		*/
		render: function () {
			var self = this;

			$.get(this.templateHTML, function(templateData){

				// Templating // 
				var template = _.template(templateData, {
					app  : app.properties,
					lang : app.lang
				});

				$(self.el).html(template);
			});
			return this;
		}


	});

	return FooterView;

});