define([
	'app',

], function(app){


	/******************************************
	* Header View
	*/
	var HeaderView = Backbone.View.extend({

		el           : '#header-navbar',

		templateHTML : 'header',


		// The DOM events //
		events: {
			'click li.disabled' : 'preventDefault'
		},


		/** View Initialization
		*/
		initialize: function () {
			this.render();
		},



		/** Display the view
		*/
		render: function(){
			var self = this;


			$.get("templates/" + this.templateHTML + ".html", function(templateData) {


				var template = _.template(templateData, {
					lang         : app.lang,
					user         : app.models.user,
					menusToLoad  : app.config.menus,
					currentModule: _(Backbone.history.fragment).strLeft('/'),
					currentUrl   : _(_(Backbone.history.fragment).strRight('/')).strLeft('/')
				});

				$(self.el).html(template);

			});

		},


		preventDefault: function(event){
			event.preventDefault();
		},


	});

return HeaderView;

});