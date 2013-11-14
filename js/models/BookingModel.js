/******************************************
* Booking Model
*/
app.Models.Booking = app.Models.GenericModel.extend({
	
	urlRoot: "/api/openresa/booking",
	
	fields : ['id', 'name', 'prod_id', 'checkin', 'checkout', 'partner_id', 'partner_order_id', 'partner_type', 'partner_phone', 'people_name', 'people_email', 'people_phone', 'is_citizen', 'create_date', 'state','state_num', 'actions', 'reservation_line', 'create_uid', 'resource_names', 'resource_quantities', 'all_dispo', 'recurrence_id', 'is_template'],


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
		if( this.getState()==app.Models.Booking.status.done.key || 
				this.getState()==app.Models.Booking.status.cancel.key) return "";
	
		var bookingResourceQuantities = [];
		
		_.each(this.get('resource_quantities'), function(s){
				bookingResourceQuantities.push( s[0] + " " + s[1] );			
		});		
	
		return _.toSentence(bookingResourceQuantities, ', ', ' '+app.lang.and+' ')

	},
	
	getDescription: function(){
		return this.get('description');	
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

	
	getName: function(){
		return this.get('name');
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
		//console.log('Booking Model initialization');
		//this.fetchRelated('tasks');
		var self = this;

		app.Models.Booking.status.confirm.translation  = app.lang.confirm;
		app.Models.Booking.status.cancel.translation  = app.lang.refused;
		app.Models.Booking.status.done.translation   = app.lang.finished;
		app.Models.Booking.status.remplir.translation     = app.lang.wait;
		
		app.Models.Booking.actions.done.translation   = app.lang.actions.validate;
		app.Models.Booking.actions.confirm.translation = app.lang.wait;
		app.Models.Booking.actions.resolve_conflict.translation = 'Traiter conflit';
		app.Models.Booking.actions.refuse.translation   = app.lang.actions.refuse;

		
//		this.computeResources().done(function (data) {
//			// self.set( {'resources' :  data.resources, 'description': data.description} , {silent:false} );	
//			 //self.set( 'resources',  data.resources , {silent:true} );	
//			 //self.set( 'description',  data.description , {silent:true} );	
//		});	

	},


}, {
	// Request State Initialization //
	status : {
//		draft: {
//			key                 : 'draft',
//			color               : '',
//			translation         : ''
//		},
		confirm: {
			key                 : 'confirm',
			color               : 'warning',
			translation         : ''
		},
		cancel: {
			key                 : 'cancel',
			color               : 'danger',
			translation         : ''
		},
//		in_use: {
//			key                 : 'in_use',
//			color               : 'default',
//			translation         : ''
//		},
		done: {
			key                 : 'done',
			color               : 'success',
			translation         : ''
		},
		remplir: {
			key                 : 'remplir',
			color               : 'info',
			translation         : ''
		},
//		wait_confirm: {
//			key                 : 'wait_confirm',
//			color               : '',
//			translation         : ''
//		},
	},
	
		// Actions of the requests //
	actions : {
		confirm: {
			key 		: 'confirm',
			color 		: 'warning',
			icon 		: 'icon-question',
			translation : ''
		},
		done: {
			key 		: 'valid',
			color 		: 'success',
			icon 		: 'icon-ok',
			translation : ''
		},
		resolve_conflict: {
			key 		: 'resolve_conflict',
			color 		: 'info',
			icon 		: 'icon-medkit',
			translation : ''
		},
		refuse: {
			key 		: 'refused',
			color 		: 'danger',
			icon 		: 'icon-remove',
			translation : ''
		},
//		create: {},
//		update: {},
//		delete: {},
	}

});