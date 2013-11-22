define([
	'app',
	'genericModel',
	'bookingModel',
	'claimerModel',
	'bookingLinesCollection'

], function(app, GenericModel, BookingModel, ClaimerModel, BookingLinesCollection){

	'use strict';
	
	/******************************************
	* Booking Model
	*/
	var booking = GenericModel.extend({
		
		urlRoot: "/api/openresa/bookings",
		
		fields : ['id', 'name', 'prod_id', 'checkin', 'checkout', 'partner_id', 'partner_order_id', 'partner_type', 'partner_phone', 'people_name', 'people_email', 'people_phone', 'is_citizen', 'create_date', 'write_date', 'state','state_num', 'actions', 'reservation_line', 'create_uid', 'write_uid', 'resource_names', 'resource_quantities', 'all_dispo', 'recurrence_id', 'is_template', 'note', 'pricelist_id'],	
	
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
		
		getCreateAuthor: function(type){
			switch(type){
				case 'id': 
					return this.get('create_uid')[0];
				break;
				default:
					return _.capitalize(this.get('create_uid')[1]);
			}
		},
		
		getWriteAuthor: function(type){
			switch(type){
				case 'id': 
					return this.get('write_uid')[0];
				break;
				default:
					return _.capitalize(this.get('write_uid')[1]);
			}
		},
		
		getResourceNames : function(type){
		
			var bookingResourceNames = [];
			
			_.each(this.get('resource_names'), function(s){
				switch (type){
					case 'id': 
						bookingResourceNames.push(s[0]);
					break;
					case 'json': 
						bookingResourceNames.push({id: s[0], name: s[1]});
					break;
					default:
						bookingResourceNames.push(s[1]);
				}
			});
			
			if(type == 'string'){
				return _.toSentence(bookingResourceNames, ', ', ' '+app.lang.and+' ')
			}
			else{
				return bookingResourceNames;
			}
		},
		
		getResourceQuantities : function(){
			if( this.getState()=='closed' || 
					this.getState()=='refused') return "";
		
			var bookingResourceQuantities = [];
			
			_.each(this.get('resource_quantities'), function(s){
					bookingResourceQuantities.push( s[0] + " " + s[1] );			
			});		
		
			return _.toSentence(bookingResourceQuantities, ', ', ' '+app.lang.and+' ')
	
		},
		
		getDescription: function(){
			return this.get('description');	
		},
		
		getInformations: function(){
			return "Par " + this.getWriteAuthor() + " le " + this.getWriteDate() + (this.getNote()!=false ? " : " + this.getNote() : "");
		},
		
		getNote: function(){
			return this.get('note');
		},
		
		getRecurrence: function(type){
			switch(type){
				case 'id': 
					return this.get('recurrence_id')[0];
				break;
				default:
					return _.capitalize(this.get('recurrence_id')[1]);
			}	
		},
		
		getPricelist: function(type){
			if(this.get('pricelist_id')){
				switch(type){
					case 'id': 
						return this.get('pricelist_id')[0];
					break;
					default:
						return _.titleize(this.get('pricelist_id')[1].toLowerCase());
				}
			}
			else{
				return false;
			}
		},
		
		setPricelist: function(id){
			this.set({pricelist_id:id});
		},
		
		isAllDispo: function(){
			return this.get('all_dispo');	
		},
		
		isTemplate: function(){
			return this.get('is_template');
		},
		
		getStartDate: function(type){
			if(this.get('checkin') != false){
				switch(type){
					case 'human':	
						return moment(this.get('checkin')).format('LL');
					break;
					default:
						return this.get('checkin');
					break;
				}
			}
			else{
				return '';
			}
		},	
		
		setStartDate: function(dateStr){
			if(dateStr != ''){
				this.set({checkin:dateStr});
				this.updateLinesData();
			}
		},
		
		getEndDate: function(type){
			if(this.get('checkout') != false){
				switch(type){
					case 'human':	
						return moment(this.get('checkout')).format('LL');
					break;
					default:
						return this.get('checkout');
					break;
				}
			}
			else{
				return '';
			}
		},
		
		setEndDate: function(dateStr){
			if(dateStr != ''){
				this.set({checkout:dateStr});
				this.updateLinesData();
			}
		},
		
		getCreateDate: function(type){
			if(this.get('create_date') != false){
				switch(type){
					case 'human':	
						return moment(this.get('create_date')).format('LL');
					break;
					default:
						return this.get('create_date');
					break;
				}
			}
			else{
				return '';
			}
		},
		
		getWriteDate: function(type){
			if(this.get('write_date') != false){
				switch(type){
					case 'human':	
						return moment(this.get('write_date')).format('LL');
					break;
					default:
						return this.get('write_date');
					break;
				}
			}
			else{
				return '';
			}
		},
	
		// Claimer of the booking //
		getClaimer: function(type){
			var claimer = {};
		
			switch (type){
				case 'id': 
					return this.get('partner_id')[0];
				break;
				case 'json':
					return {id: this.get('partner_id')[0], name: this.get('partner_id')[1]};
				break;
				default:
					return this.get('partner_id')[1];
			}
			return claimer;
		},
		
		setClaimer: function(value, silent){
			var self = this;
			this.set({ partner_id : value }, {silent: silent});
			var modelClaimer = new ClaimerModel({id:this.getClaimer('id')});
			modelClaimer.fetch({data:{fields:['property_product_pricelist']}}).done(function(){
				self.setPricelist(modelClaimer.get('property_product_pricelist'));
			})
			.always(function(){
				self.updateLinesData();
			});
		},

		getClaimerType: function(type){
			if(this.get('partner_type')){
				switch (type){
					case 'id': 
						return this.get('partner_type')[0];
					break;
					case 'json':
						return {id: this.get('partner_type')[0], name: this.get('partner_type')[1]};
					break;
					default:
						return this.get('partner_type')[1];
				}
			}
		},
		setClaimerType: function(value, silent){
			this.set({ partner_type : value }, {silent: silent});
		},
		
		//method to add a bookingLine to collection on this model
		addLine: function(lineModel){
			this.lines.add(lineModel);
			lineModel.setParentBookingModel(this);
		},
		
		fetchLines: function(){
			var self = this;
			return this.lines.fetch({data:{filters:{0:{field:'line_id.id',operator:'=',value:this.getId()}}}}).done(function(){
				self.lines.each(function(lineModel){
					lineModel.setParentBookingModel(self);
				});
			});
		},
		
		//method to perform updates on bookingLines (pricing, dispo, ...) when some fields value change
		updateLinesData: function(){
			var checkin = this.getStartDate();
			var checkout = this.getEndDate();
			var partner_id = this.getClaimer('id');
			if(checkin != '' && checkout != ''){
				_.each(this.lines.models, function(lineModel,i){
					lineModel.fetchAvailableQtity(checkin,checkout);
					if(partner_id > 0){
						lineModel.fetchPricing(partner_id, checkin, checkout);
					}
				});
				
			}
		},
		
		//used for OpenERP to format many2one data to be writable in OpenERP
		saveToBackend: function(){
			var self = this;
			var vals = {
					partner_invoice_id:this.getClaimerContact('id'),
					partner_order_id:this.getClaimerContact('id'),
					partner_shipping_id: this.getClaimerContact('id'),
					partner_id: this.getClaimer('id'),
					openstc_partner_id: this.getClaimer('id'),
					pricelist_id: this.getPricelist('id'),
					name: this.getName(),
					checkin:this.getStartDate(),
					checkout:this.getEndDate()};
			
			//if new, POST new values and fetch the model to retrieve values stored on backend
			if(this.isNew()){
				return this.save(vals,{wait:true}).done(function(data){
					self.set({id:data});
					self.fetch({silent:true});
					self.lines.each(function(lineModel){
						lineModel.saveToBackend().fail(function(e){console.log(e)});
					});
				});
			}
			
			//if already exists, PATCH values and fetch the model to retrieve values updated on backend
			//also perform save/update for lineModels
			else{
				vals.user_id = this.getCreateAuthor('id');
				return this.save(vals, {wait:true, patch:true}).always(function(){
					self.lines.each(function(lineModel,i)	{
						self.fetch({silent:true});
						lineModel.saveToBackend().fail(function(e){console.log(e)});
					});
				});
			}
			return false;
		},

		getClaimerPhone: function(){
			return this.get('partner_phone');
		},
		
		getClaimerContact: function(type){
			if(this.get('partner_order_id')){
				switch (type){
					case 'id': 
						return this.get('partner_order_id')[0];
					break;
					case 'json':
						return {id: this.get('partner_order_id')[0], name: this.get('partner_order_id')[1]};
					break;
					default:
						return this.get('partner_order_id')[1];
				}
			}
		},
		
		setClaimerContact: function(value, silent){
			this.set({ partner_order_id : value }, {silent: silent});
		},	
		
		fromCitizen: function(){
			return this.get('is_citizen');
		},
		setFromCitizen: function(value, silent){
			this.set({ is_citizen : value }, {silent: silent});
		},
		
		getCitizenName: function(){
			if(this.fromCitizen()){
				return this.get('people_name');
			}
		},
		setCitizenName: function(value, silent){
			this.set({ people_name : value }, {silent: silent});
		},	
		
		getCitizenPhone: function(){
			if(this.fromCitizen()){
				return this.get('people_phone');
			}
		},
		setCitizenPhone: function(value, silent){
			this.set({ people_phone : value }, {silent: silent});
		},
		getCitizenEmail: function(){
			if(this.fromCitizen()){
				return this.get('people_email');
			}
		},
		setCitizenEmail: function(value, silent){
			this.set({ people_email : value }, {silent: silent});
		},

		getState : function() {
			return this.get('state');
		},
		
		getActions: function(){
			return this.get('actions');
		},
		
		hasActions: function(action){
			return this.getActions().indexOf(action) > -1;
		},
	
		
		/** Model Initialization
		*/
		initialize: function(){
			this.lines = new BookingLinesCollection();
//			this.computeResources().done(function (data) {
//				// self.set( {'resources' :  data.resources, 'description': data.description} , {silent:false} );	
//				 //self.set( 'resources',  data.resources , {silent:true} );	
//				 //self.set( 'description',  data.description , {silent:true} );	
//			});	
		},
	
	
	}, {
		// Request State Initialization //
		status : {
			//= égal au 'wait' STC
			remplir: {
				key                 : 'wait',
				color               : 'info',
				translation         : app.lang.wait
			},
			//= égal au 'valid' STC
			confirm: {
				key                 : 'valid',
				color               : 'success',
				translation         : app.lang.valid
			},
			//= égal au 'refused' STC
			cancel: {
				key                 : 'refused',
				color               : 'danger',
				translation         : app.lang.refused
			},
			//= égal au 'closed' STC
			done: {
				key                 : 'closed',
				color               : 'success',
				translation         : app.lang.finished
			},
		},
		
			// Actions of the requests //
		actions : {
			valid: {
				key 		: 'valid',
				color 		: 'success',
				icon 		: 'fa-check',
				translation : app.lang.actions.validate
			},
			refused: {
				key 		: 'refused',
				color 		: 'danger',
				icon 		: 'fa-times',
				translation : app.lang.finished
			},
			resolve_conflict: {
				key 		: 'resolve_conflict',
				color 		: 'warning',
				icon 		: 'fa-medkit',
				translation : 'Traiter conflit'
			},
			closed: {
				key 		: 'closed',
				color 		: 'default',
				icon 		: 'fa-eye-slash',
				translation : app.lang.actions.refuse
			},
	
	
	//		create: {},
	//		update: {},
	//		delete: {},
		}
	
	});
	

	return booking;

});