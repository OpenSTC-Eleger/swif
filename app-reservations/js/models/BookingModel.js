/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',

	'genericModel',
	'bookingModel',
	'claimerModel',
	'claimerContactModel',
	'bookingLinesCollection',
	'moment-timezone',
	'moment-timezone-data'


], function(app, AppHelpers, GenericModel, BookingModel, ClaimerModel, ClaimerContactModel, BookingLinesCollection){

	'use strict';

	/******************************************
	* Booking Model
	*/
	var booking = GenericModel.extend({

		urlRoot: '/api/openresa/bookings',

		fields : ['id', 'name', 'checkin', 'note', 'checkout', 'partner_id', 'partner_order_id', 'partner_type',
				'contact_phone', 'partner_mail', 'people_name', 'people_phone', 'is_citizen',
				'create_date', 'write_date', 'deleted_at', 'done_at', 'confirm_at', 'cancel_at', 'state','state_num', 'actions', 'create_uid', 'write_uid',
				'resources', 'all_dispo', 'recurrence_id', 'is_template',
				'pricelist_id', 'confirm_note', 'cancel_note', 'done_note', 'people_street','people_city', 'people_zip', 'whole_day'],

		searchable_fields: [
			{ key: 'id', type : 'numeric' },
			{ key: 'name', type : 'text' }

		],


		//method to retrieve attribute with standard return form
		getAttribute: function(key,default_value){
			var val = this.get(key);
			if(_.isUndefined(default_value)){
				default_value = false;
			}
			if(!_.isUndefined(val) && val !== '' && val !== false && val !== null){
				return val;
			}
			else{
				return default_value;
			}
		},


		getId: function(){
			return this.get('id');
		},

		getName: function(){
			return this.get('name');
		},

		getCreateAuthor: function(type){
			var val = this.getAttribute('create_uid', false);

			var returnVal;
			switch(type){
				case 'id':
					returnVal = val[0];
					break;
				default:
					returnVal = _.capitalize(val[1]);
			}

			return returnVal;
		},

		getWriteAuthor: function(type){

			var returnVal;
			switch(type){
				case 'id':
					returnVal = this.get('write_uid')[0];
					break;
				default:
					returnVal = _.capitalize(this.get('write_uid')[1]);
			}

			return returnVal;
		},

		getResources: function(){
			return this.get('resources');
		},


		isAllDay: function(){
			return this.get('whole_day');
		},

		setAllDay: function(value){
			this.set({whole_day: value});
		},


		getResourcesId : function(){
			return _.pluck(this.getResources(), 'id');
		},

		getDescription: function(){
			return this.get('description');
		},

		getResourceNames : function(type){
			var resourceNames = [];
			_.each(this.getResources(), function(r) {
				resourceNames.push(r.name);
			});
			if(type === 'string'){
				return _.toSentence(resourceNames, ', ', ' '+app.lang.and+' ');
			}
			else if(type === 'newline'){
				return _.join(':',_.toSentence(resourceNames, ':\n\r ', ':\n\r '), ' ');
			}
			else{
				return resourceNames;
			}
		},


		getResourceQuantitiesHtml : function(){
			if( _.size( this.getResources() ) === 0 ){
				return '';
			}

			var bookingResourceQuantities = '<dl>';

			_.each(this.getResources(), function(r){

				var icon;
				if(r.type === 'site'){
					icon = '<i class="fa fa-map-marker fa-fw"></i>';
				}
				else{
					icon = '<i class="fa fa-wrench fa-fw"></i>';
				}


				bookingResourceQuantities += '<dt>' + icon +' '+ r.name + '</dt><dd>' + r.tooltip + '</dd>';
			});

			return bookingResourceQuantities + '</dl>';

		},

		getStateInformationsHtml: function(){
			var html = '<dl>';
			switch (this.getState()){
				case 'confirm':
					html+= this.getConfirmNote() !== false ?  '<dt>' + app.lang.validation + ' <i>' + this.getConfirmDate() + '</i></dt><dd>' + this.getConfirmNote() + '</dd></br>' : '';
					break;
				case 'cancel':
					html+= this.getCancelNote() !== false ?  '<dt>' + app.lang.refusal + ' <i>' + this.getCancelDate() + '</i></dt><dd>' + this.getCancelNote() + '</dd></br>' : '';
					break;
				case 'done':
					html+=  this.getConfirmNote() !== false ?  '<dt>' + app.lang.validation + ' <i>' + this.getConfirmDate() + '</i></dt><dd>' + this.getConfirmNote() + '</dd></br>' : '';
					html+=  this.getDoneNote() !== false ? '<dt>' + app.lang.enclosing + ' <i>' + this.getDoneDate() + '</i></dt><dd>' + this.getDoneNote() + '</dd></br>' : '';
					break;
				default:
					html+= '<small> le ' + this.getWriteDate('human') + '</small>';

			}
			return html+= '</dl>';

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
			if(this.get('recurrence_id') !== false && !_.isUndefined(this.get('recurrence_id'))){

				var returnVal;
				switch(type){
					case 'id':
						returnVal = this.get('recurrence_id')[0];
						break;
					default:
						returnVal = _.capitalize(this.get('recurrence_id')[1]);
				}

				return returnVal;
			}
			else{
				return false;
			}
		},

		setRecurrenceId: function(val){
			this.set({recurrence_id:val}, {silent:true});
		},

		getPricelist: function(type){
			if(this.get('pricelist_id') !== false){

				var returnVal;
				switch(type){
					case 'id':
						returnVal = this.get('pricelist_id')[0];
						break;
					default:
						returnVal = _.titleize(this.get('pricelist_id')[1].toLowerCase());
				}

				return returnVal;
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
			_.each(this.lines.models, function(line){
				ret += line.getPricing();
			});
			return ret;
		},

		getAllDispo: function(){
			var ret = true;
			_.each(this.lines.models, function(line){
				if(!line.getAvailable() && line.bookable.getAttribute('block_booking',false)){
					ret = false;
				}
			});
			return ret;
		},

		isAllDispo: function(){
			return this.get('all_dispo');
		},

		isTemplate: function(){
			if(!_.isUndefined(this.get('is_template'))){
				return this.get('is_template');
			}
			return false;
		},

		getStartDate: function(type){
			var checkin = this.getAttribute('checkin','');
			if(checkin !== ''){
				var checkinDate = AppHelpers.convertDateToTz(checkin);

				var returnVal;
				switch(type){
					case 'human':
						returnVal = checkinDate.format('LLL');
						break;
					case 'fromNow':
						returnVal = checkinDate.fromNow();
						break;
					case 'string':
						returnVal = checkinDate.format('YYYY-MM-DD HH:mm');
						break;
					default:
						returnVal = checkin;
				}

				return returnVal;
			}
			else{
				return '';
			}
		},

		setStartDate: function(dateStr){
			if(dateStr !== ''){
				this.set({checkin:dateStr});
				this.updateLinesData();
			}
			else{
				this.set({checkin:false});
			}
		},

		getEndDate: function(type){
			var checkout = this.getAttribute('checkout','');
			if(checkout !== ''){
				var checkoutDate = AppHelpers.convertDateToTz(checkout);

				var returnVal;
				switch(type){
					case 'human':
						returnVal = checkoutDate.format('LLL');
						break;
					case 'fromNow':
						returnVal = checkoutDate.fromNow();
						break;
					case 'string':
						returnVal = checkoutDate.format('YYYY-MM-DD HH:mm');
						break;
					default:
						returnVal = checkout;
						break;
				}

				return returnVal;
			}
			else{
				return '';
			}
		},

		setEndDate: function(dateStr){
			if(dateStr !== ''){
				this.set({checkout:dateStr});
				this.updateLinesData();
			}
			else{
				this.set({checkout:false});
			}
		},

		getDeletedAt: function(type){
			var detetedDate = this.getAttribute('deleted_at', '');

			if(detetedDate !== ''){
				var detetedAt = AppHelpers.convertDateToTz(detetedDate);

				var returnVal;
				switch(type){
					case 'human':
						returnVal = detetedAt.format('LLL');
						break;
					case 'fromNow':
						returnVal = detetedAt.fromNow();
						break;
					case 'string':
						returnVal = detetedAt.format('YYYY-MM-DD HH:mm');
						break;
					default:
						returnVal = detetedAt;
				}

				return returnVal;
			}
			else{
				return '';
			}
		},

		getWholeDay: function(){
			return this.getAttribute('all_day', false);
		},

		setWholeDay: function(val, silent){
			this.set({all_day:val}, {silent:silent});
		},

		getCreateDate: function(type){
			if(this.get('create_date') !== false){
				var createDate = AppHelpers.convertDateToTz(this.get('create_date'));

				var returnVal;
				switch(type){
					case 'human':
						returnVal = createDate.format('LLL');
						break;
					case 'fromNow':
						returnVal = createDate.fromNow();
						break;
					default:
						returnVal = this.get('create_date');
				}

				return returnVal;
			}
			else{
				return '';
			}
		},

		getWriteDate: function(type){
			if(this.get('write_date') !== false){
				var writeDate = AppHelpers.convertDateToTz(this.get('write_date'));

				var returnVal;
				switch(type){
					case 'human':
						returnVal = writeDate.format('LLL');
						break;
					case 'fromNow':
						returnVal = writeDate.fromNow();
						break;
					default:
						returnVal = this.get('write_date');
						break;
				}

				return returnVal;
			}
			else{
				return '';
			}
		},

		getDoneDate: function(type){
			if(this.get('done_at') !== false){
				var doneDate = AppHelpers.convertDateToTz(this.get('done_at'));

				var returnVal;
				switch(type){
					case 'human':
						returnVal = doneDate.format('LLL');
						break;
					case 'fromNow':
						returnVal = doneDate.fromNow();
						break;
					default:
						returnVal = doneDate.format('DD-MM-YYYY');
						break;
				}

				return returnVal;
			}
			else{
				return '';
			}
		},

		getCancelDate: function(type){
			if(this.get('cancel_at') !== false){
				var cancelDate = AppHelpers.convertDateToTz(this.get('cancel_at'));

				var returnVal;
				switch(type){
					case 'human':
						returnVal = cancelDate.format('LLL');
						break;
					case 'fromNow':
						returnVal = cancelDate.fromNow();
						break;
					default:
						returnVal = cancelDate.format('DD-MM-YYYY');
						break;
				}

				return returnVal;
			}
			else{
				return '';
			}
		},

		getConfirmDate: function(type){
			if(this.get('confirm_at') !== false){
				var confirmDate = AppHelpers.convertDateToTz(this.get('confirm_at'));

				var returnVal;
				switch(type){
					case 'human':
						returnVal = confirmDate.format('LLL');
						break;
					case 'fromNow':
						returnVal = confirmDate.fromNow();
						break;
					default:
						returnVal = confirmDate.format('DD-MM-YYYY');
						break;
				}
				return returnVal;
			}
			else{
				return '';
			}
		},


		getNote: function(){
			if(this.get('note') !== false){
				return this.get('note');
			}
		},

		// Claimer of the booking //
		getClaimer: function(type){
			var claimer = this.getAttribute('partner_id', false);
			if(claimer !== false){

				var returnVal;
				switch (type){
					case 'id':
						returnVal = this.get('partner_id')[0];
						break;
					case 'json':
						returnVal = {id: this.get('partner_id')[0], name: this.get('partner_id')[1]};
						break;
					case 'array':
						returnVal = this.get('partner_id');
						break;
					default:
						returnVal = this.get('partner_id')[1];
				}

				return returnVal;
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

				var returnVal;
				switch (type){
					case 'id':
						returnVal = this.get('partner_type')[0];
						break;
					case 'json':
						returnVal = {id: this.get('partner_type')[0], name: this.get('partner_type')[1]};
						break;
					default:
						returnVal = this.get('partner_type')[1];
				}

				return returnVal;
			}
		},
		setClaimerType: function(value, silent){
			this.set({ partner_type : value }, {silent: silent});
		},

		getCloneVals: function(){
			var self = this;
			var ret = {};
			var toClone = ['partner_invoice_id','partner_order_id','partner_shipping_id','partner_id',
							'openstc_partner_id','pricelist_id','name','note','checkin','checkout',
							'people_name','people_phone','partner_mail', 'people_street', 'people_city', 'people_zip',
							'whole_day', 'is_citizen'];

			_.each(toClone,function(field){
				ret[field] = self.get(field);
			});
			return ret;
		},

		getSaveVals: function(){
			var contact_id = this.getClaimerContact('id') ? this.getClaimerContact('id') : null;
			return {
				partner_invoice_id :contact_id,
				partner_order_id   :contact_id,
				partner_shipping_id: contact_id,
				partner_id         : this.getClaimer('id'),
				openstc_partner_id : this.getClaimer('id'),
				pricelist_id       : this.getPricelist('id'),
				name               : this.getName(),
				checkin            :this.getStartDate(),
				checkout           :this.getEndDate(),
				people_name        :this.getCitizenName(),
				people_phone       : this.getCitizenPhone(),
				partner_mail       : this.getClaimerMail(),
				is_citizen         : this.fromCitizen(),
				people_street      : this.getAttribute('people_street',false),
				people_city        : this.getAttribute('people_city',false),
				people_zip         : this.getAttribute('people_zip',false),
				whole_day          : this.getAttribute('whole_day',false),
				note               : this.getAttribute('note',false)
			};
		},

		getClaimerPhone: function(){
			if(this.get('contact_phone') !== false){
				return this.get('contact_phone');
			}
			else{
				return '';
			}
		},

		getClaimerContact: function(type){
			var contact = this.getAttribute('partner_order_id',false);

			if(contact !== false){

				var returnVal;
				switch (type){
					case 'id':
						returnVal = this.get('partner_order_id')[0];
						break;
					case 'json':
						returnVal = {id: this.get('partner_order_id')[0], name: this.get('partner_order_id')[1]};
						break;
					case 'array':
						returnVal = this.get('partner_order_id');
						break;
					default:
						returnVal = this.get('partner_order_id')[1];
				}

				return returnVal;
			}
			return contact;
		},

		setClaimerContact: function(value, silent){

			this.set({ partner_order_id : value }, {silent: silent});

			if(value !== false){
				new ClaimerContactModel({id: value});
			}
		},

		getClaimerMail : function(){
			if(this.get('partner_mail') !== false){
				return this.get('partner_mail');
			}
			else{
				return '';
			}
		},

		setClaimerMail : function(val, silent){
			return this.set({partner_mail:val},{silent:silent});
		},

		fromCitizen: function(){
			return this.getAttribute('is_citizen',false);
		},
		setFromCitizen: function(value, silent){
			this.set({ is_citizen : value }, {silent: silent});
		},

		getCitizenName: function(){
			if(this.fromCitizen()){
				return this.getAttribute('people_name','');
			}
			else{
				return '';
			}
		},
		setCitizenName: function(value, silent){
			this.set({ people_name : value }, {silent: silent});
		},

		getCitizenPhone: function(){
			if(this.fromCitizen()){
				return this.getAttribute('people_phone','');
			}
			return '';
		},

		setCitizenPhone: function(value, silent){
			this.set({ people_phone : value }, {silent: silent});
		},
		getCitizenAddress: function(){
			if(this.fromCitizen()){
				return this.get('people_street') +' '+ this.get('people_zip') +' '+ this.get('people_city');
			}
			else{
				return '';
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
		//@param options: object containing flags 'pricing' and / or 'dispo', associated with a boolean to set which data to fetch (default, fetch all data)
		updateLinesData: function(options){
			var pricing = true;
			var dispo = true;
			if(!_.isUndefined(options)){
				if(!_.isUndefined(options.pricing)){
					pricing = options.pricing;
				}
				if(!_.isUndefined(options.dispo)){

					dispo = options.dispo;
				}
			}
			var checkin = this.getStartDate();
			var checkout = this.getEndDate();
			var partner_id = this.getClaimer('id');
			var deferred = $.Deferred();
			if(this.lines.models.length <= 0){
				deferred.resolve();
			}
			if(checkin !== '' && checkout !== ''){
				_.each(this.lines.models, function(lineModel){
					if(partner_id > 0 && pricing){
						deferred = $.when(lineModel.fetchAvailableQtity(checkin,checkout),lineModel.fetchPricing(partner_id, checkin, checkout))
						.fail(function(e){console.log(e);});
					}
					else if(dispo){
						deferred = $.when(lineModel.fetchAvailableQtity(checkin,checkout))
						.fail(function(e){console.log(e);});
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
					if(self.get('is_template') && self.recurrence !== null){
						//add template to occurrence_ids
						self.recurrence.set({'reservation_ids':[[4,self.getId()]]});
						self.recurrence.saveToBackend();
					}
					self.lines.each(function(lineModel){
						lineModel.saveToBackend().fail(function(e){console.log(e);});
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
					if(self.get('is_template') && self.recurrence !== null){
						//add template to occurrence_ids
						self.recurrence.set({'reservation_ids':[[4,self.getId()]]});
						self.recurrence.saveToBackend();
					}
					self.lines.each(function(lineModel){
						lineModel.saveToBackend().fail(function(e){console.log(e);});
					});
					self.linesToRemove.each(function(lineToRemove){
						lineToRemove.destroy();
					});
					_.each(self.recurrencesToRemove,function(recurrenceToRemove){
						recurrenceToRemove.persistentDestroyOnBackend();
					});
				});
			}
			return false;
		},

		//TOREMOVE ?
		destroyOnBackend: function(){
			if(this.recurrence !== null){
				this.set({id:null},{silent:true});
				this.destroy();
				this.recurrence.occurrences.remove(this);
				this.recurrence.occurrencesToRemove.add(this.clone().off());
			}
			this.destroy();
		},

		destroyRecurrenceOnBackend: function(){
			this.recurrencesToRemove.push(this.recurrence.clone());
			this.recurrence.set({id:null});
			this.recurrence.destroy();
			this.recurrence = null;
			this.set({template:false});
		},

		/** Model Initialization
		*/
		initialize: function(){
			this.lines = new BookingLinesCollection();
			//collection to store lines to remove (because form persist modifications only after clicking on 'validate' btn)
			this.linesToRemove = new BookingLinesCollection();
			this.recurrence = null;
			this.recurrencesToRemove = [];
			//set default values to model
			if(this.isNew()){
				this.set({ state:'remplir' });
			}

		},


	}, {
		// Request State Initialization //
		status : {
			//= égal au 'wait' STC
			remplir: {
				key        : 'remplir',
				color      : 'info',
				translation: app.lang.wait
			},
			//= égal au 'valid' STC
			confirm: {
				key        : 'confirm',
				color      : 'success',
				icon       : 'fa-check',
				translation: app.lang.valid
			},
			//= égal au 'refused' STC
			cancel: {
				key        : 'cancel',
				color      : 'danger',
				icon       : 'fa-times',
				translation: app.lang.refused
			},
			//= égal au 'closed' STC
			done: {
				key        : 'done',
				color      : 'default',
				icon       : 'fa-thumbs-o-up',
				translation: app.lang.closed
			},
		},

			// Actions of the requests //
		actions : {
			confirm: {
				key        : 'confirm',
				color      : 'success',
				icon       : 'fa-check',
				translation: app.lang.actions.validate
			},
			cancel: {
				key        : 'cancel',
				color      : 'danger',
				icon       : 'fa-times',
				translation: app.lang.actions.refuse
			},
			resolve_conflict: {
				key          : 'resolve_conflict',
				color        : 'warning',
				icon         : 'fa-medkit',
				translation  : 'Traiter le conflit'
				//translation: app.lang.resa.actions.resolveConflict
			},
			done: {
				key        : 'done',
				color      : 'default',
				icon       : 'fa-thumbs-o-up',
				translation: app.lang.actions.close
			}
		}

	});


	return booking;

});