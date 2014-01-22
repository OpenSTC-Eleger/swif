define([
	'app',
	'appHelpers',


], function(app, AppHelpers){

	'use strict';


	/******************************************
	* Advanced Filter Bar View
	*/
	var InputFieldView = Backbone.View.extend({
		
		tagName      : 'div',
	
		className    : 'form-group',
		
		templateHTML : 'others/inputField.html',
		
		// The DOM events //
		events: function(){
			return _.defaults({

			});
		},


		/** View Initialization
		*/
		initialize: function(options){
			this.field = options.field;
			
			this.render();
		},



		/** View Render
		*/
		render: function(){
			var self = this;
			
			// Retrieve the template //
			$.get("templates/" + this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang             : app.lang,
					name			 : self.field.key, 

				});

				$(self.el).html(template);



			});

			$(this.el).hide().fadeIn();

			return this;


		},


	});

return InputFieldView;

});