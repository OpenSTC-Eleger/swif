define([
	'app',

	'inputFieldView',
	'dateFieldView',
	'advancedSelectBoxView'

], function(app, InputFieldView, DateFieldView, AdvancedSelectBoxView){

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


				
				// Create widget corresponding to field's type  //
				switch (field.type) {
					case 'text':
					case 'char':
						var inputFieldView = new InputFieldView({ field: field });
						$(self.el).append(inputFieldView.render().el);
						self.components.push(inputFieldView);
						break;

					case 'date':
					case 'datetime':
						var dateFieldView = new DateFieldView({ field: field });
						$(self.el).append(dateFieldView.render().el);
						self.components.push(dateFieldView);
						break;

					case 'many2one':
						var advancedSelectBoxView = new AdvancedSelectBoxView({ field: field, url: field.url, template: true, multiple: true, minimumInputLength: 2 });
						$(self.el).append(advancedSelectBoxView.render().el);
						self.components.push(advancedSelectBoxView);
						break;

					case 'selection':
						var data = [];
						_.each(field.selection, function(val) {
							data.push({ id: val[0], text: _.capitalize(app.lang[val[0]]) });
						});

						var advancedSelectBoxView2 = new AdvancedSelectBoxView({ field: field, data: data, template: true, multiple: true });
						$(self.el).append(advancedSelectBoxView2.render().el);
						self.components.push(advancedSelectBoxView2);
						break;
				}
			});
		}


	});

	return FieldContainerView;

});