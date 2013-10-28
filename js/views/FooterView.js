define([
	'jquery',
	'underscore',
	'backbone',
	'global'

], function($, _, Backbone, global){


	/******************************************
	* Footer View
	*/
	var FooterView = Backbone.View.extend({

		el           : '#footer-navbar',

		templateHTML : 'footer',

	 
	 
		/** View Initialization
		*/
		initialize: function () {
			this.render();
		},

		

		/** Display the view
		*/
		render: function () {
			var self = this;

			$.get("templates/" + this.templateHTML + ".html", function(templateData){

				// Templating // 
				var template = _.template(templateData, {
					app  : global.properties,
					lang : global.lang
				});

				$(self.el).html(template);
			});
			return this;
		}


	});

return FooterView;

});