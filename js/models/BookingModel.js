/******************************************
* Booking Model
*/
app.Models.Booking = app.Models.GenericModel.extend({
	
	urlRoot: "/api/openresa/booking",
	
	fields : ['id', 'name', 'prod_id', 'checkin', 'checkout', 'partner_id', 'create_date', 'state', 'actions', 'reservation_line'],


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
	
	
	getResources: function(){
		var self = this;
		if( !_.isUndefined(this.get('resources')) ){
			return this.get('resources');		
		}
		else
		{
			this.computeResources().done(function (data) {
				 self.set( 'resources',  data , {silent:false} );				 
			});		
		}
	},
	
	getName: function(){
		return this.get('name');
	},
	
	computeResources : function() {

		var self = this;
		var deferred = $.Deferred();
		self.resources = "";
		self.bookingLines = new app.Collections.BookingLines();
		if( self.get('reservation_line')!= false ) {
			self.bookingLines.fetch({silent: true,data: {filters: {0: {'field': 'id', 'operator': 'in', 'value': self.get('reservation_line')}}}})
			.done(function(data){	
				_.each(self.bookingLines.models, function(bookingLine, i){	
					self.resources +=  _.titleize(bookingLine.get('reserve_product')[1].toLowerCase());
					if(i!=self.bookingLines.length-1) self.resources += ", "
				});
				deferred.resolve(self.resources);
				
			});
		}
		return deferred;

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
	},


}, {
	// Request State Initialization //
	status : {
		draft: {
			key                 : 'draft',
			color               : '',
			translation         : ''
		},
		confirm: {
			key                 : 'confirm',
			color               : '',
			translation         : ''
		},
		cancel: {
			key                 : 'cancel',
			color               : '',
			translation         : ''
		},
		in_use: {
			key                 : 'in_use',
			color               : '',
			translation         : ''
		},
		done: {
			key                 : 'done',
			color               : '',
			translation         : ''
		},
		remplir: {
			key                 : 'remplir',
			color               : '',
			translation         : ''
		},
		wait_confirm: {
			key                 : 'wait_confirm',
			color               : '',
			translation         : ''
		},
	}

});