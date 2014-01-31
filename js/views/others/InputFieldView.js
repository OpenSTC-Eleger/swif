define([
	'app'

], function(app){

	'use strict';


	/******************************************
	* Input form
	*/
	var InputFieldView = Backbone.View.extend({
		
		tagName      : 'div',

		className    : 'form-group',
		
		templateHTML : 'templates/others/inputField.html',


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
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					field	: self.field 
				});

				$(self.el).html(template);
			});

			return this;
		},


	});

	return InputFieldView;

});