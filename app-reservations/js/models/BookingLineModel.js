/******************************************
* Booking Model
*/
app.Models.BookingLine = app.Models.GenericModel.extend({
	
	urlRoot: "/api/openresa/booking_lines",
	
	fields : ['id', 'name', 'reserve_product', 'qte_dispo', 'qte_reserves', 'pricelist_amount','dispo'],


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
	
	getAvailableQtity: function(){
		return this.get('qte_dispo');
	},
	
	setAvailableQtity: function(qty){
		this.set({qte_dispo:qty},{silent:true});
		this.updateAvailable();
	},
	
	getQuantity: function(){
		return this.get('qte_reserves');
	},
	
	setQuantity: function(qty){
		this.set({qte_reserves:qty},{silent:true});
		this.updateAvailable();
	},
	
	getAvailable: function(){
		return this.get('dispo');
	},
	
	// not really a setter, used by other setters of the module to trigger change event
	updateAvailable: function(){
		this.set({dispo:this.getAvailableQtity() >= this.getQuantity()})
	},
	
	getPricing: function(){
		return this.get('pricelist_amount');
	},
	
	fetchAvailableQtity: function(checkin, checkout){
		var self = this;
		return $.when($.ajax({
			url:'/api/openresa/bookables/' + self.getResource('id') + '/available_quantity',
			type: 'GET',
			data: app.objectifyFilters({
				checkin:checkin,
				checkout:checkout}
			),
			success: function(data){
				self.setAvailableQtity(data);
			},
			error: function(e){
				console.log(e);
			}
		}));
	},
	
	fetchPricing: function(partner_id, checkin, checkout){
		var self = this;
		var prodAndQty = [{prod_id:this.getResource('id'),qty:this.getQuantity()}]
		return $.when($.ajax({
			url:'/api/open_object/partners/' + partner_id + '/get_bookables_pricing',
			type: 'GET',
			data: app.objectifyFilters({
				checkin:checkin,
				checkout:checkout,
				prodAndQties:prodAndQty}
			),
			success: function(data){
				self.set({pricelist_amount:data[self.getResource('id').toString()]});
			},
			error: function(e){
				console.log(e);
			}
		}));
	},
	
	getParentBookingModel: function(){
		return this.parentBookingModel;
	},
	
	setParentBookingModel: function	(model){
		this.parentBookingModel = model;
		if(!model.isNew()){
			this.set({line_id:model.getId()});
		}
	},
	
	/** Model Initialization
	*/
	initialize: function(){
		//console.log('Booking Model initialization');
		//this.fetchRelated('tasks');
		this.parentBookingModel = null;
	},


}, {
	// BookingLine State Initialization //
	status : {
		dispo:{
			icon	: 'icon-ok',
			key		: 'dispo',
			color	: 'success'
		},
		not_dispo:{
			icon	: 'icon-remove',
			key		: 'not_dispo',
			color	: 'danger'
		}
	}

});