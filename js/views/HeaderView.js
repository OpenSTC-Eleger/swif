define([
	'jquery',
	'underscore',
	'backbone',
	'global'

], function($, _, Backbone, global){


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
					lang  : app.lang,
					user  : global.models.user
				});

				$(self.el).html(template);

			});

		},



		/** Change the active menu item
		*/
		selectMenuItem: function (menuItem) {
			$('#nav-menu-app li').removeClass('active');

			if(menuItem){
				$('#' + menuItem).addClass('active');
			}
		},



		/** Change the Grid view of the page
		*/
		switchGridMode: function(type){

			switch(type){

				case 'fluid' :
					$('#container').removeClass('container').addClass('container-fluid');
					$('#rowContainer').removeClass('row').addClass('row-fluid');
				break;

				case 'default' :
					$('#rowContainer').removeClass('row-fluid').addClass('row');
					$('#container').removeClass('container-fluid').addClass('container');
				break;
			}
		},


		preventDefault: function(event){
			event.preventDefault();
		},


	});

return HeaderView;

});