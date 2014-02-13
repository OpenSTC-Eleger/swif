define([
	'app'

], function(app){

	'use strict';


	/******************************************
	* Number Field View
	*/
	var NumberFieldView = Backbone.View.extend({
		
		tagName      : 'div',
	
		className    : 'form-group',
		
		templateHTML : 'templates/form-components/inputNumber.html',

		input        : null,
		
		operators    : {
			egal   : { key: '=', symbol: '=' },
			lower  : { key: '<', symbol: '&lt;' },
			upper  : { key: '>', symbol: '&gt;' }
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
			this.operators.egal.label = app.lang.equalTo;
			this.operators.lower.label = app.lang.lowerThan;
			this.operators.upper.label = app.lang.upperThan;

			// Check if field has operator //
			if(_.isUndefined(this.field.value)){
				this.currentOperator = this.operators.upper;
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
					currentOperator : self.currentOperator
				});

				$(self.el).html(template);

				self.input = $(self.el).find('input');
			});

			return this;
		},



		/** Get the value of the input
		*/
		getValue: function(){
			var val = parseInt(this.input.val());


			if(!_.isNaN(val)){
				return val;
			}
			else{
				return null;
			}

		},

		/** Set the value 
		*/
		setValue: function(value){
			this.input.val(value);
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

	return NumberFieldView;

});