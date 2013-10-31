/******************************************
* Booking Model
*/
app.Models.BookingLine = app.Models.GenericModel.extend({
	
	urlRoot: "/api/openresa/booking_lines",
	
	fields : ['id', 'name', 'reserve_product'],


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
	
	getResource : function(type) {

		if(this.get('reserve_product')){
			switch(type){
				case 'id': 
					return this.get('reserve_product')[0];
				break;
				default:
					return _.titleize(this.get('reserve_product')[1].toLowerCase());
			}
		}
		else{
			return false;
		}
	},
	
	
	/** Model Initialization
	*/
	initialize: function(){
		//console.log('Booking Model initialization');
		//this.fetchRelated('tasks');
	},


}, {
	// Request State Initialization //
	status : {

	}

});