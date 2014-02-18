define([
	'app',

	'bsDatepicker-lang',
	'bsTimepicker',
	'moment'

], function(app, datepicker, timepicker, moment){

	'use strict';


	/******************************************
	* Date Field View
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
			var self = this;

			this.field = options.field;

			// Set the translation //
			this.operators.egal.label = app.lang.the;
			this.operators.before.label = app.lang.beforeThe;
			this.operators.after.label = app.lang.afterThe;

			// Check if field has operator //
			if(_.isUndefined(this.field.value)){
				this.currentOperator = this.operators.after;
			}
			else{
				var op = _.filter(this.operators, function(o){
					return o.key == self.field.operator;
				});
				this.currentOperator = op[0];
			}
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

				self.input.datepicker({ format: 'dd/mm/yyyy', weekStart: 1, autoclose: true, language: 'fr', todayHighlight: true});
			});

			return this;
		},



		/** Get the value of the input
		*/
		getValue: function(humanize){
			var val = this.input.val();

			if(val !== ''){

				if(_.isUndefined(humanize)){
					return moment(val, 'DD/MM/YYYY').format('YYYY-MM-DD');
				}
				else{
					return moment(val, 'DD/MM/YYYY').format('LL');
				}
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
			this.input.focus();
		},



		/** Return the current selected Operator
		*/
		getOperator: function(type){
			var returnVal;

			switch(type){
				case 'key':
					returnVal = this.currentOperator.key;
					break;
				case 'symbol':
					returnVal = this.currentOperator.symbol;
					break;
				default:
					returnVal = this.currentOperator.label;
			}

			return returnVal;
		}

	});

	return InputFieldView;

});