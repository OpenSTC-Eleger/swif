define([
	'app',
	
	'genericModel',
	'bookingModel',
	'claimerModel',
	'userModel',
	'bookingLinesCollection',
	'moment',
	'moment-timezone',
	'moment-timezone-data',

], function(app, GenericModel, BookingModel, ClaimerModel, UserModel, BookingLinesCollection, moment){

	'use strict';
	
	/******************************************
	* Booking Model
	*/
	var booking = GenericModel.extend({
		
		urlRoot: "/api/openresa/bookings",
		
		fields : ['id', 'name', 'prod_id', 'checkin', 'checkout', 'partner_id', 'partner_order_id', 'partner_type', 'contact_phone', 'partner_mail', 'people_name', 'people_email', 'people_phone', 'is_citizen', 'create_date', 'write_date', 'state','state_num', 'actions', 'reservation_line', 'create_uid', 'write_uid', 'resource_names', 'resource_quantities', 'all_dispo', 'recurrence_id', 'is_template', 'pricelist_id', 'confirm_note', 'cancel_note', 'done_note'],	
	
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
			else if(type == 'newline'){	
				return _.join(":",_.toSentence(bookingResourceNames, ':\n\r ', ':\n\r '), " ");
			}
			else{
				return bookingResourceNames;
			}
		},
		
		getResourceQuantities : function(){
			if( this.getState()=='done' || 
					this.getState()=='cancel') return "";
		
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
			switch (this.getState()){ 
				case 'confirm': 
					return "Par " + this.getWriteAuthor() + " le " + this.getWriteDate() + (this.getConfirmNote()!=false ? " : " + this.getConfirmNote() : "");
				break;
				case 'cancel':
					return "Par " + this.getWriteAuthor() + " le " + this.getWriteDate() + (this.getCancelNote()!=false ? " : " + this.getCancelNote() : "");
				break;
				case 'done':
					return "Par " + this.getWriteAuthor() + " le " + this.getWriteDate() + (this.getDoneNote()!=false ? " : " + this.getDoneNote() : "");
				break;
				default: 
					return "Par " + this.getWriteAuthor() + " le " + this.getWriteDate();
			}
			return ;
		},
		
		getConfirmNote: function(){
			return this.get('confirm_note');
		},
		
		getCancelNote: function(){
			return this.get('cancel_note');
		},
		
		getDoneNote: function(){
			return this.get('done_note');
		},
		
		getRecurrence: function(type){
			if(this.get('recurrence_id') != false){
				switch(type){
					case 'id': 
						return this.get('recurrence_id')[0];
					break;
					default:
						return _.capitalize(this.get('recurrence_id')[1]);
				}
			}
			else{
				return false;
			}
		},
		
		setRecurrenceId: function(val){
			this.set({recurrence_id:val}, {silent:true});
		},
		
		getPricelist: function(type){
			if(this.get('pricelist_id') != false){
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
		
		getAmount: function(){
			var ret = 0.0;
			_.each(this.lines.models, function(line,i){
				ret += line.getPricing();
			});
			return ret;
		},
		
		getAllDispo: function(){
			var ret = true;
			_.each(this.lines.models, function(line,i){
				if(!line.getAvailable()){
					ret = false;
				}
			});
			return ret;
		},
		
		isAllDispo: function(){
			return this.get('all_dispo');	
		},
		
		isTemplate: function(){
			return this.get('is_template');
		},
		
//		getStartDate: function(type){
//			if(this.get('checkin') != false){
//				var checkinDate = moment(this.get('checkin')).tz(UserModel.getContext().tz)
//				checkinDate.add('minutes',-checkinDate.zone());
//				switch(type){
//					case 'human':	
//						return checkinDate.format('LLL');
//					break;
//					default:
//						return checkinDate;
//					break;
//				}
//			}
//			else{
//				return '';
//			}
//		},	
		
		getStartDate: function(type){
			if(this.get('checkin') != false){
				switch(type){
					case 'human':	
						return moment.utc(this.get('checkin')).local().format('LLL');
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
		
//		getEndDate: function(type){
//			if(this.get('checkout') != false){
//				var checkoutDate = moment(this.get('checkout')).tz(UserModel.getContext().tz)
//				checkoutDate.add('minutes',-checkoutDate.zone());
//				switch(type){
//					case 'human':	
//						return checkoutDate.format('LLL');
//					break;
//					default:
//						return checkoutDate;
//					break;
//				}
//			}
//			else{
//				return '';
//			}
//		},
		
		getEndDate: function(type){
			if(this.get('checkout') != false){
				switch(type){
					case 'human':	
						return moment.utc(this.get('checkout')).local().format('LLL');
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
		
		getCloneVals: function(){
			var self = this;
			var ret = {};
			var toClone = ['partner_invoice_id','partner_order_id','partner_shipping_id','partner_id','openstc_partner_id','pricelist_id','name','checkin','checkout'];
			_.each(toClone,function(field,i){
				ret[field] = self.get(field);
			});
			return ret;
		},
		
		getSaveVals: function(){
			return {
				partner_invoice_id:this.getClaimerContact('id'),
				partner_order_id:this.getClaimerContact('id'),
				partner_shipping_id: this.getClaimerContact('id'),
				partner_id: this.getClaimer('id'),
				openstc_partner_id: this.getClaimer('id'),
				pricelist_id: this.getPricelist('id'),
				name: this.getName(),
				checkin:this.getStartDate(),
				checkout:this.getEndDate()
			}
		},

		getClaimerPhone: function(){
			return this.get('contact_phone');
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
		
		getClaimerMail : function(){
			return !_.isUndefined(this.get('partner_mail')) && !_.isNull(this.get('partner_mail')) && this.get('partner_mail')!=false ? this.get('partner_mail') : "";
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
		//by default, fetch dispo, and if partner is set, fetch pricing too
		updateLinesData: function(){
			var checkin = this.getStartDate();
			var checkout = this.getEndDate();
			var partner_id = this.getClaimer('id');
			var deferred = $.Deferred();
			if(checkin != '' && checkout != ''){
				_.each(this.lines.models, function(lineModel,i){
					if(partner_id > 0){
						deferred = $.when(lineModel.fetchAvailableQtity(checkin,checkout),lineModel.fetchPricing(partner_id, checkin, checkout))
						.fail(function(e){console.log(e)});
					}
					else{
						deferred = $.when(lineModel.fetchAvailableQtity(checkin,checkout))
						.fail(function(e){console.log(e)});
					}
				});
				
			}
			return deferred;
		},
		
		//used for OpenERP to format many2one data to be writable in OpenERP
		saveToBackend: function(){
			var self = this;
			var vals = this.getSaveVals();
			
			//if new, POST new values and fetch the model to retrieve values stored on backend
			//and, if set, save recurrence too
			if(this.isNew()){
				return this.save(vals,{wait:true}).done(function(data){
					self.set({id:data});
					self.fetch({silent:true});
					if(self.get('is_template') && self.recurrence != null){
						self.recurrence.saveToBackend();
					}
					self.lines.each(function(lineModel){
						lineModel.saveToBackend().fail(function(e){console.log(e)});
					});
				});
			}
			
			//if already exists, PATCH values and fetch the model to retrieve values updated on backend
			//also perform save/update for lineModels
			//and, if set, save recurrence too
			else{
				vals.user_id = this.getCreateAuthor('id');
				return this.save(vals, {wait:true, patch:true}).always(function(){
					self.fetch({silent:true});
					if(self.get('is_template') && self.recurrence != null){
						self.recurrence.saveToBackend();
					}
					self.lines.each(function(lineModel,i){
						lineModel.saveToBackend().fail(function(e){console.log(e)});
					});
					self.linesToRemove.each(function(lineToRemove,i){
						lineToRemove.destroy();
					});
				});
			}
			return false;
		},
		
		destroyOnBackend: function(){
			if(this.recurrence != null){
				this.set({id:null},{silent:true});
				this.destroy();
				this.recurrence.occurrences.remove(this);
				this.recurrence.occurrencesToRemove.add(this.clone().off());
			}
			this.destroy();
			
		},

	
		
		/** Model Initialization
		*/
		initialize: function(){
			this.lines = new BookingLinesCollection();
			//collection to store lines to remove (because form persist modifications only after clicking on 'validate' btn)
			this.linesToRemove = new BookingLinesCollection();
			this.recurrence = null;
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
				key                 : 'remplir',
				color               : 'info',
				translation         : app.lang.wait
			},
			//= égal au 'valid' STC
			confirm: {
				key                 : 'confirm',
				color               : 'success',
				translation         : app.lang.valid
			},
			//= égal au 'refused' STC
			cancel: {
				key                 : 'cancel',
				color               : 'danger',
				translation         : app.lang.refused
			},
			//= égal au 'closed' STC
			done: {
				key                 : 'done',
				color               : 'default',
				translation         : app.lang.closed
			},
		},
		
			// Actions of the requests //
		actions : {
			confirm: {
				key 		: 'confirm',
				color 		: 'success',
				icon 		: 'fa-check',
				translation : app.lang.actions.validate
			},
			cancel: {
				key 		: 'cancel',
				color 		: 'danger',
				icon 		: 'fa-times',
				translation : app.lang.actions.refuse
			},
			resolve_conflict: {
				key 		: 'resolve_conflict',
				color 		: 'warning',
				icon 		: 'fa-medkit',
				translation : 'Traiter le conflit'
				//translation : app.lang.resa.actions.resolveConflict
			},
			done: {
				key 		: 'done',
				color 		: 'default',
				icon 		: 'fa-eye-slash',
				translation : app.lang.actions.close
			},
	
	
	//		create: {},
	//		update: {},
	//		delete: {},
		}
	
	});
	

return booking;

});