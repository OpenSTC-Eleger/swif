define([
	'app',
	'appHelpers',
	
	'inputFieldView',
	'dynamicAdvancedSelectBoxView',
	
	'claimersServicesCollection',
	'equipmentsCollection',
	'placesCollection',


], function(app, AppHelpers, InputFieldView, DynamicAdvancedSelectBoxView, ClaimersServicesCollection, EquipmentsCollection, PlacesCollection){

	'use strict';


	/******************************************
	* Advanced Filter Bar View
	*/
	var FieldContainerView = Backbone.View.extend({
		
		
		
		
		components : [],
		
		// The DOM events //
		events: function(){
			return _.defaults({

			});
		},


		/** View Initialization
		*/
		initialize: function(options){
			this.searchableFields = options.searchableFields
			
		},



		/** View Render
		*/
		render: function(){
			var self = this;
			
			// Retrieve the template //
			
				self.components = [];
				_.each(self.searchableFields, function(field,i){
						
						switch (field.type) {
							case 'text':
							case 'char':
								var inputFieldView = new InputFieldView({ field:field })
								inputFieldView.$el.on('change', function(event) {self.updateComponent(event)})								
								$(self.el).append(inputFieldView.render().el);
								self.components.push(inputFieldView);
								break;
							case 'many2one':
								var collection = null 
								if(field.key == 'service_id') {
									collection = ClaimersServicesCollection.prototype ;
								}
								else if(field.key == 'equipment_id' ) {
									collection = EquipmentsCollection.prototype ;
								}
								else {
									collection = PlacesCollection.prototype ;
								}
								var dynamicAdvancedSelectBoxView = new DynamicAdvancedSelectBoxView({ field:field, collection: collection })
								//dynamicAdvancedSelectBoxView.$el.on('change', function(event) {self.updateSelectBox(event)})								
								$(self.el).append(dynamicAdvancedSelectBoxView.render().el);
								self.components.push(dynamicAdvancedSelectBoxView);
								break;

							break;				
						}
				})



		},
		
		updateComponent: function(e){
			var self = this;
			var component = _.find(self.components,function(c){ 
				return e.target.id == c.field.key				
			});
			self.components = _.without(self.components, component)
			$(component.el).val($(e.target).val())
			self.components.push(component);
		},




	});

return FieldContainerView;

});