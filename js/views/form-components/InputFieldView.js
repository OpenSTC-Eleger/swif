/*!
 * SWIF-OpenSTC
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

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

		templateHTML : 'templates/form-components/input.html',

		operator     : 'ilike',

		input        : null,


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

				self.input = $(self.el).find('input');
			});

			return this;
		},



		/** Get the value of the input
		*/
		getValue: function(){
			var val = this.input.val();

			if(val !== ''){
				return val;
			}
			else{
				return null;
			}
		},

		/** Set the value in the input
		*/
		setValue: function(value){
			$(this.el).find('input').val(value);
		},



		/** Get operator selected (always 'ilike')
		*/
		getOperator: function(type){
			var returnVal;

			switch(type){
				case 'key':
					returnVal = this.operator;
					break;
				default:
					returnVal = app.lang.equalTo;
			}

			return returnVal;
		},

	});

	return InputFieldView;

});