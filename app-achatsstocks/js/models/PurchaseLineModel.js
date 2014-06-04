define([
	'app',
	'appHelpers',
	'genericModel',
	'moment'


], function(app, AppHelpers, GenericModel){

	'use strict';
	
	/******************************************
	* ContractLine Model
	*/
	return GenericModel.extend({
		
		urlRoot: '/api/open_achats_stock/purchase_lines',

		fields: ['id', 'name', 'product_id', 'product_qty', 'taxes_id', 'price_unit', 'budget_line_id', 'order_id'],
		
		searchable_fields: [
			{
				key  : 'id',
				type : 'numeric'
			},
			{
				key  : 'name',
				type : 'text'
			}
			
		],
		readonlyFields: ['id'],
		
//		relatedFields: {
//			technical_service_id:'technical_service_id',
//			partner_id:'supplier_id',
//			internal_inter:'internal_inter',
//			date_end:'date_end_order'
//		},
		
		getId: function(){
			return this.get('id');
		},
		
		getName: function(){
			return this.get('name');
		},
		
//		/**
//		 * Copy all related data from parentModel to this model
//		 */
//		bubbleData: function(model){
//			var vals = {};
//			_.map(this.relatedFields, function(parentField, field){
//				vals[field] = model.getAttribute(parentField, false);
//			});
//			this.set(vals);
//			this.trigger('related',this);
//		},
		
		/** Model Initialization
		 * if some related fields are declared, retrieve there data and add them to the model attribute
		 * Add a listener to always keep its related data up-to-date
		*/
		initialize: function(vals, options){
			GenericModel.prototype.initialize.apply(this, arguments);
			if(options.parentModel){
				this.parentModel = options.parentModel;
//				this.listenTo(this.parentModel, 'change', self.bubbleData);
//				this.bubbleData(this.parentModel);
			}
		},
	
	
	}, {
		// Request State Initialization //
		status : {
			
		},
		
			// Actions of the requests //
		actions : {
			update: {
				key					: 'update',
				icon				: 'fa-pencil',
				translation			: app.lang.actions.update
			},
			
			foo: {
				key					: 'foo',
				icon				: 'fa-ban-circle',
				translation			: 'bar'
			}

		}
	});
});