/******************************************
* About View
*/
app.Views.AboutView = Backbone.View.extend({

	el           : '#rowContainer',

	templateHTML : 'about',

	

	/** View Initialization
	*/
	initialize : function(user) {
		//this.render();
   },



	/** Display the view
	*/
	render : function() {
		var self = this;

		// Change the page title //
		app.router.setPageTitle(app.lang.viewsTitles.about);

		
		// Retrieve the Login template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		 
			var template = _.template(templateData, {
				lang: app.lang, 
				version: app.versionOpenSTM
			});

			$(self.el).html(template);
		});

		$(this.el).hide().fadeIn('slow');

		return this;
	}

 
});