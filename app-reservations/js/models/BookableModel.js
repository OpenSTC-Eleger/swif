define([
	'genericModel',

], function(GenericModel){


	/******************************************
	* Booking Model
	*/
	var BookableModel = GenericModel.extend({
		
		urlRoot: "/api/openresa/bookables",
		
		fields : ['id', 'name', 'product_image', 'qty_available', 'type_prod', 'color', 'categ_id'],
	
		searchable_fields: [
			{
				key  : 'id',
				type : 'numeric'
			},
			{
				key  : 'name', 
				type : 'text'
			},
			{
				key  : 'type_prod', 
				type : 'text'
			}
		],
	
		
		getQtyAvailable: function(){
			return this.get('qty_available');
		},

		getProductImage: function(){
			return this.get('product_image');
		},

		getColor: function(){
			if(this.get('color') != false){
				return this.get('color');
			}
			else{
				return '#0BA4D8';
			}
		},
	
	
	}, {
		// Bookable State Initialization //
		status : {
	
		}
	
	});

return BookableModel;

})