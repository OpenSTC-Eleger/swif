/******************************************
* Footer View
*/
app.Views.FooterView = Backbone.View.extend({

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
				app  : app.properties,
				lang : app.lang
			});

			$(self.el).html(template);
		});
		return this;
	}


});