/******************************************
* Booking Model
*/
app.Models.Bookable= app.Models.GenericModel.extend({
	
	urlRoot: "/api/openresa/bookables",
	
	fields : ['id', 'name', 'product_image'],

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

	getId: function(){
		return this.get('id');
	},
	
	getName: function(){
		return this.get('name');
	},
	
	getQtyAvailable: function(dateStart, dateEnd){
		
	},
	
	getProductImage: function(){
		return this.get('product_image');
	}


}, {
	// Bookable State Initialization //
	status : {

	}

});