/******************************************
* Booking Model
*/
app.Models.Booking = app.Models.GenericModel.extend({
	
	urlRoot: "/api/openresa/booking",
	
	fields : ['id', 'name', 'prod_id', 'checkin', 'checkout', 'partner_id', 'create_date', 'state','state_num', 'actions', 'reservation_line', 'create_uid', 'resource_names', 'resource_quantities', 'all_dispo', 'recurrence_id', 'is_template'],


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
	
	getPartner : function(type) {

		if(this.get('partner_id')){
			switch(type){
				case 'id': 
					return this.get('partner_id')[0];
				break;
				default:
					return _.titleize(this.get('partner_id')[1].toLowerCase());
			}
		}
		else{
			return false;
		}
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
		
		app.Models.Booking.actions.resolve_conflict.translation   = 'Traiter conflit';
		app.Models.Booking.actions.refused.translation   = app.lang.actions.refuse;
		
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
		resolve_conflict: {
			key 		: 'resolve_conflict',
			color 		: 'warning',
			icon 		: 'icon-level-up',
			translation : ''
		},
		refused: {
			key 		: 'refused',
			color 		: 'danger',
			icon 		: 'icon-remove',
			translation : ''
		},
		
	}

});