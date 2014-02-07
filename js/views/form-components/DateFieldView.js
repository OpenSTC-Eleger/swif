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
		
		templateHTML : 'templates/form-components/inputDate.html',

		input        : null,
		
		operators    : {
			egal   : { key: '=', symbol: '=' },
			before : { key: '<', symbol: '&lt;' },
			after  : { key: '>', symbol: '&gt;' }
		},


		events: {
			'click .dropdown-menu li'  : 'selectOperator'
		},



		/** View Initialization
		*/
		initialize: function(options){
			this.field = options.field;


			// Set the translation //
			this.operators.egal.label = app.lang.the;
			this.operators.before.label = app.lang.beforeThe;
			this.operators.after.label = app.lang.afterThe;

			this.currentOperator = this.operators.after;
		},



		/** View Render
		*/
		render: function(){
			var self = this;

			// Retrieve the template //
			$.get(this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					field           : self.field,
					operators       : self.operators,
					currentOperator : self.currentOperator,
					moment          : moment
				});

				$(self.el).html(template);

				self.input = $(self.el).find('input.datepicker');

				self.input.datepicker({ format: 'dd/mm/yyyy', weekStart: 1, autoclose: true, language: 'fr'});
			});

			return this;
		},



		/** Get the value of the input
		*/
		getValue: function(){
			var val = this.input.val();

			if(val != ""){
				return moment(val, 'DD/MM/YYYY').format('YYYY-MM-DD');
			}
			else{
				return null;
			}
		},

		/** Set the value 
		*/
		setValue: function(value){
			this.input.val(moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY'));
		},



		/** Select the operator
		*/
		selectOperator: function(e){
			e.preventDefault();

			var link = $(e.currentTarget);


			// Set selected liste active //
			$(this.el).find('.dropdown-menu li').removeClass('active');
			link.addClass('active');

			var operator = link.data('operator');


			// Set the operator //
			$(this.el).find('.dropdown-toggle').html(this.operators[operator].symbol);
			
			this.currentOperator = this.operators[operator];
		},


		/** Return the current selected Operator
		*/
		getOperator: function(){
			return this.currentOperator.key;
		}

	});

	return InputFieldView;

});