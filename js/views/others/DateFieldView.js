define([
	'app',
	
	'bsDatepicker',
	'bsTimepicker',
	'moment'

], function(app, datepicker, timepicker, moment){

	'use strict';


	/******************************************
	* Advanced Filter Bar View
	*/
	var InputFieldView = Backbone.View.extend({
		
		tagName      : 'div',
	
		className    : 'form-group',
		
		templateHTML : 'templates/others/dateField.html',
		
		operator	 : '>',


		events: {
			'click .dropdown-menu li'  : 'selectOperator'
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
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang   : app.lang, 
					field  : self.field 
				});

				$(self.el).html(template);
				$('input.datepicker').datepicker({ format: 'dd/mm/yyyy', weekStart: 1, autoclose: true, language: 'fr'});
			});

			return this;
		},



		/** Get the value of the input
		*/
		getValue: function(){
			var val = $(this.el).find('input').val();

			if(val != ""){
				return moment(val, 'DD/MM/YYYY').format('YYYY-MM-DD');
			}
			else{
				return null;
			}
		},
		
		/** Get operator selected (always '>')
		*/
		getOperator: function(){
			return this.operator;
		},


		/** Select the operator
		*/
		selectOperator: function(e){
			e.preventDefault();

			var link = $(e.currentTarget);

			// Set selected liste active //
			$(this.el).find('.dropdown-menu li').removeClass('active');
			link.addClass('active');


			// Set the operator //
			$(this.el).find('.dropdown-toggle').html(link.data('operator'));

		}

	});

	return InputFieldView;

});