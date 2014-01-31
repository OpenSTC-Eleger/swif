define([
	'app',
	'appHelpers',
	
	'bsDatepicker',
	'bsTimepicker',
	'moment'

], function(app, AppHelpers, datepicker, timepicker, moment){

	'use strict';


	/******************************************
	* Advanced Filter Bar View
	*/
	var InputFieldView = Backbone.View.extend({
		
		tagName      : 'div',
	
		className    : 'form-group',
		
		templateHTML : 'templates/others/dateField.html',
		


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
				$('input.datepicker').datepicker({ format: 'dd/mm/yyyy', weekStart: 1, autoclose: true, language: 'fr'});
			});

			return this;
		},


	});

	return InputFieldView;

});