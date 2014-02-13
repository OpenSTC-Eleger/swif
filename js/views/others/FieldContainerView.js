define([
	'app',

	'inputFieldView',
	'dateFieldView',
	'numberFieldView',
	'advancedSelectBoxView'

], function(app, InputFieldView, DateFieldView, NumberFieldView, AdvancedSelectBoxView){

	'use strict';


	/******************************************
	* Advanced Filter Bar View
	*/
	var FieldContainerView = Backbone.View.extend({

		el         : '.fields-container',

		components : [],



		/** View Initialization
		*/
		initialize: function(options){
			this.searchableFields = options.searchableFields;
			this.activeSearch = options.activeSearch;

			this.render();
		},



		/** View Render
		*/
		render: function(){
			var self = this;

			this.components = [];



			_.each(this.searchableFields, function(field){


				// Set value to the field if 
				var tab = _.filter(self.activeSearch, function(f){
					return f.field == field.key;
				});

				if(!_.isEmpty(tab)) {
					field.value = tab[0].value;
					field.operator = tab[0].operator;
				}
				else{
					delete field.value;
				}


				var fieldView;
				// Create widget corresponding to field's type  //
				switch (field.type) {
					case 'text':
					case 'char':
						fieldView = new InputFieldView({ field: field });
						break;

					case 'integer':
						fieldView = new NumberFieldView({ field: field });
						break;

					case 'date':
					case 'datetime':
						fieldView = new DateFieldView({ field: field });
						break;

					case 'many2one':
						fieldView = new AdvancedSelectBoxView({ field: field, url: field.url, template: true, multiple: true, minimumInputLength: 2 });
						break;

					case 'selection':
						var data = [];
						_.each(field.selection, function(val) {
							data.push({ id: val[0], text: _.capitalize(app.lang[val[0]]) });
						});

						fieldView = new AdvancedSelectBoxView({ field: field, data: data, template: true, multiple: true });
						break;
				}


				// Add the component //
				$(self.el).append(fieldView.render().el);
				self.components.push(fieldView);
			});
		}


	});

	return FieldContainerView;

});