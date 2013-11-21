define([
	'app',
	'genericModel',
	'bookingModel'

], function(app, GenericModel, BookingModel){

	'use strict';

	/******************************************
	* Booking Model
	*/
	var booking = GenericModel.extend({
		
		urlRoot: "/api/openresa/bookings",
		
		fields : ['id', 'name', 'prod_id', 'checkin', 'checkout', 'partner_id', 'partner_order_id', 'partner_type', 'partner_phone', 'people_name', 'people_email', 'people_phone', 'is_citizen', 'create_date', 'write_date', 'state','state_num', 'actions', 'reservation_line', 'create_uid', 'write_uid', 'resource_names', 'resource_quantities', 'all_dispo', 'recurrence_id', 'is_template', 'note'],
	
	
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
			this.set({ partner_id : value }, {silent: silent});
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
						return {id: this.get('partner_order_id')[0], name: this.get('partner_address')[1]};
					break;
					default:
						return this.get('partner_order_id')[1];
				}
			}
		},
		
		setClaimerContact: function(value, silent){
			this.set({ partner_address : value }, {silent: silent});
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