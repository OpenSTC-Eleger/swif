
define(['app', 
        'appHelpers', 
        
        'bookingModel',
        'bookingLineModel',
        'bookingRecurrenceModel',
        'bookingLinesCollection',
        'bookablesCollection',
        'claimersCollection',
        'claimersContactsCollection',
        
        'itemFormBookingLineView',
        'formRecurrenceView',
        'advancedSelectBoxView',
        'moment',
        'moment-timezone',
        'moment-timezone-data',
        'bsTimepicker',
        'bsDatepicker',
        'bsSwitch'

], function (app, AppHelpers, BookingModel, BookingLineModel, BookingRecurrenceModel, BookingLinesCollection, BookablesCollection, ClaimersCollection, ClaimersContactsCollection, ItemFormBookingLineView, FormRecurrenceView, AdvancedSelectBoxView, moment) {

    'use strict';


	/******************************************
	* Requests Details View
	*/
	var FormBookingView = Backbone.View.extend({
	

		el          : '#rowContainer',

		templateHTML: '/templates/forms/form_booking.html',

	
	
		// The DOM events //
		events: {
			'change #bookingPartner'			: 'changeBookingPartner',
			'change #bookingContact'			: 'changeBookingContact',
			'change #bookingAddBookable'		: 'changeBookingAddBookable',
			
			'change #bookingCheckin'			: 'changeBookingCheckin',
			'change #bookingCheckout'			: 'changeBookingCheckout',
			'change #bookingCheckinHour'		: 'changeBookingCheckin',
			'change #bookingCheckoutHour'		: 'changeBookingCheckout',

			'blur #bookingName'					: 'changeName',
			'blur #bookingPeopleName'			: 'changePeopleName',
			'blur #bookingPeoplePhone'			: 'changePeoplePhone',
			'blur #bookingPeopleMail'			: 'changePeopleEmail',
			'blur #bookingPeopleStreet'			: 'changePeopleStreet',
			'blur #bookingPeopleCity'			: 'changePeopleCity',
			'blur #bookingPeopleZip'			: 'changePeopleZip',
			
			//Form Buttons
			'submit #formSaveBooking'			: 'saveBookingForm',
			'click #getRecurrenceDates'			: 'getRecurrenceDates',
			'change #addRecurrence'				: 'changeAddRecurrence',
			'switch-change #bookingIsCitizen'	: 'changeIsCitizen',
			'switch-change #bookingWholeDay'	: 'changeWholeDay',
		},
		
		initializeWithNonPersistedModel: function(){
			var self = this;
			
			this.model.updateLinesData().done(function(){
				app.router.render(self);
			});
		},
		
		initializeWithId: function(){
			// Render with loader, store ajax calls in var 'waitDeferred' to call $.when at the end of  function//
			var self = this;
			this.model = new BookingModel({id:this.options.id});
			this.model.fetch({silent: true}).done(function(){
				app.router.render(self);
				var waitDeferred = [];
				//fetch and render lines
				waitDeferred.push(self.model.fetchLines());
				
				//fetch and render recurrence if exists
				if(self.model.getRecurrence() != false){
					var recurrence = new BookingRecurrenceModel({id:self.model.getRecurrence('id')});
					if(self.model.isTemplate()){
						recurrence.setTemplate(self.model);
						waitDeferred.push(recurrence.fetch());
					}
					else{
						self.model.recurrence = recurrence;
					}
				}
				$.when.apply(self, waitDeferred).done(function(){
					app.router.render(self);
				})
			});
		},
		
		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;
			var self = this;
			if(_.isUndefined(this.model)){
				this.model = new BookingModel();
			}
			/*TODO:(remove this calculation by properer one)
			 *check if user is claimer or manager (to know if he can see or not 'Claimer' and 'Contact' selectBoxes,
			 *if user can not fetch any partner, means that he has only claimer rights
			 */
			this.claimers = new ClaimersCollection();
			this.isClaimer = false;
			this.claimers.count().always(function(){
				self.isClaimer = parseInt(self.claimers.cpt) == 0;
				//fill the 2 selectBoxes with service_id.partner_id values
				var ret = {};
				
				//if view is called with a filled model (new booking from calendar)
				if(_.isUndefined(self.options.id)){
					if(self.isClaimer){
						app.models.user.fetchContactAndClaimer(ret).done(function(){
							self.model.setClaimer([ret.claimer.id, ret.claimer.name]);
							self.model.setClaimerContact([ret.contact.id, ret.contact.name]);
							self.initializeWithNonPersistedModel();
						});
					}
					else{
						self.initializeWithNonPersistedModel();
					}
				}
				//else, init view fetching model from db
				else{
					self.initializeWithId();
				}
				
				self.listenTo(self.model, 'change', self.updateDisplayDoms);
				self.listenTo(self.model.lines, 'add', self.updateDisplayDoms);
				self.listenTo(self.model.linesToRemove, 'add', self.updateDisplayDoms);
			});
		},
		
		//compute if form can be modified or not
		isEditable: function(){
			return this.model.getState() == BookingModel.status.remplir.key;
		},
		
	    //compute display of button addBookable (readonly or visible)
	    updateDisplayAddBookable: function(){
	    	var elt = $('#bookingAddBookable');
	    	if(this.isEditable() && this.model.getStartDate() != '' && this.model.getEndDate() != '' && this.model.getClaimer('id') != false){
	    		elt.removeAttr('disabled');
	    	}
	    	else{
	    		elt.attr('disabled','');
	    	}
	    	if(!_.isUndefined(app.views.selectListAddBookableView)){
	    		app.views.selectListAddBookableView.render();
	    	}
	    },

	    //compute display of button save (readonly or visible)
	    updateDisplaySave: function(){
	    	var elt = $('#saveFormBooking');
	    	if(this.isEditable() && this.model.getStartDate() != '' && this.model.getEndDate() != '' && this.model.getClaimer('id') != false && this.model.lines.length > 0){
	    		elt.removeAttr('disabled');
	    	}
	    	else{
	    		elt.attr('disabled','');
	    	}
	    },
	    
	    //compute display of button addRecurrence (readonly or visible)
	    updateDisplayAddRecurrence: function(){
	    	var elt = $('#bookingAddRecurrence');
	    	var isHidden = this.recurrence != null && !this.isTemplate();
	    	
	    	if(!isHidden && this.isEditable() && this.model.lines.length > 0 && parseInt(this.claimers.cpt) > 0){
    			elt.bootstrapSwitch('setActive',true);
    		}
	    	else{
	    		elt.bootstrapSwitch('setActive',false);
	    	}
	    },
	    
	    updateDisplayCitizenInfos: function(){
	    	
	    	var val = $('#bookingIsCitizen').bootstrapSwitch('status');
	    	if(parseInt(this.claimers.cpt) == 0){
	    		$('#bookingIsCitizen').bootstrapSwitch('setActive', false);
	    	}
	    	if(val){
	    		$('#blockBookingContact').addClass('hide-soft');
	    		$('#citizenInfos').removeClass('hide-soft');
	    	}
	    	else{
	    		$('#blockBookingContact').removeClass('hide-soft');
	    		$('#citizenInfos').addClass('hide-soft');
	    	}
	    	if(!_.isUndefined(app.views.selectListClaimersContactsView)){
	    	}
	    },
	    
	    //main method to compute all conditionnal display of form inputs
	    updateDisplayDoms: function(model){
	    	this.updateDisplayAddBookable();
	    	this.updateDisplayAddRecurrence();
	    	this.updateDisplaySave();
	    	this.updateDisplayCitizenInfos();
	    },
		
		//split rendering of form and rendering of lines to avoid change-events conflicts 
		//(which perform unwanted updates on lineModels)
		renderLines: function(){
			var self = this;
			_.each(this.model.lines.models, function(lineModel){
	        	var lineView = new ItemFormBookingLineView({model:lineModel});
	        	$(self.el).find('#bookingLines').append(lineView.render().el);
			});
		},
		
		renderRecurrence: function(){
			if(this.model.recurrence != null){
				var recurrenceView = new FormRecurrenceView({model:this.model.recurrence});
				$(this.el).find('#recurrence').html(recurrenceView.render().el);
			}
		},
		
	
		/** Display the view
		*/
		render: function(loader) {
	
			var self = this;
			// Retrieve the template //
			$.get(app.menus.openresa + this.templateHTML, function(templateData){			
				//compute dates with user TZ
				var checkin = self.model.getAttribute('checkin',false);
				var checkout = self.model.getAttribute('checkout',false);;
				var startDate = '';
				var startHour = '';
				var endDate = '';
				var endHour = '';
				
				if(checkin != false && checkout != false){
					checkin = AppHelpers.convertDateToTz(checkin);
					checkout = AppHelpers.convertDateToTz(checkout);
					
					startDate = checkin.format('D/M/YYYY');
					startHour = checkin.format('H:m');
					endDate = checkout.format('D/M/YYYY');
					endHour = checkout.format('H:m');	
				}
				
				var template = _.template(templateData, {
					lang   		: app.lang,
					booking		: self.model,
					loader 		: loader,
					startDate	: startDate,
					startHour	: startHour,
					endDate 	: endDate,
					endHour		: endHour,
					readonly	: !self.isEditable()
				});
	
				$(self.el).html(template);
				
				self.renderLines();
				self.renderRecurrence();
				
				if(self.isClaimer){
					$('#bookingPartner').attr('disabled');
					$('#bookingContact').attr('disabled');
				}
				
				$('.make-switch').bootstrapSwitch();
				$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
				$(".datepicker").datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });
					
				// Booking Claimer //
				app.views.selectListClaimersView = new AdvancedSelectBoxView({el: $('#bookingPartner'), collection: ClaimersCollection.prototype});
				app.views.selectListClaimersView.resetSearchParams();
				app.views.selectListClaimersView.render();
	
				// Booking Contact //
				app.views.selectListClaimersContactsView = new AdvancedSelectBoxView({el: $('#bookingContact'), collection: ClaimersContactsCollection.prototype});
				app.views.selectListClaimersContactsView.resetSearchParams();
				app.views.selectListClaimersContactsView.render();
				
				//selectBox to add bookables to booking
				app.views.selectListAddBookableView = new AdvancedSelectBoxView({el: $('#bookingAddBookable'), collection: BookablesCollection.prototype}),
				app.views.selectListAddBookableView.resetSearchParams();
				app.views.selectListAddBookableView.render();
						
				
				//i initialize advancedSelectBox here to correclty trigger change event at init (and so, perform correct view updates)
				var partner = self.model.getClaimer('array');
				if(partner != 0){
					app.views.selectListClaimersView.setSelectedItem(partner);
					self.changeBookingPartner();
				}
				var contact = self.model.getClaimerContact('array');
				if(contact != 0){
					app.views.selectListClaimersContactsView.setSelectedItem(self.model.getClaimerContact('array'));
					self.changeBookingContact(contact);
				}
				//manually fire listeners to apply dynamic DOM visibilities and filter to selectBoxes
				self.changeIsCitizen();
				self.changeWholeDay();
				$(this.el).hide().fadeIn('slow');
			});
			return this;
	    },
	    
	    /*
	     * Update searchParam of ClaimerContact (partner.id = self if partner_id is set, else, remove searchParams)
	     */	
	    changeBookingPartner: function(e){
	    	var partner_id = app.views.selectListClaimersView.getSelectedItem();
	    	if(partner_id != ''){
	    		//TODO: implement filter to fetch only bookables authorized for partner
	    		app.views.selectListClaimersContactsView.setSearchParam({'field':'partner_id.id','operator':'=','value':partner_id},true);
	    		
	    		this.model.setClaimer([partner_id,app.views.selectListClaimersView.getSelectedText()]);
	    	}
	    	else{
	    		app.views.selectListClaimersContactsView.resetSearchParams();
	    		this.model.setClaimer(false);
	    	}
	    	
	    },
	    
	    changeBookingContact: function(e){
	    	var contact_id = app.views.selectListClaimersContactsView.getSelectedItem();
	    	if(contact_id){
	    		this.model.setClaimerContact([contact_id, app.views.selectListClaimersContactsView.getSelectedText()]);
	    	}
	    	else{
	    		this.model.setClaimerContact(false);
	    	}
	    },
	    
	    /*
	     * each time a bookable is selected on AdvancedSelectBox, we create a new itemView (not any save before user click on validate)
	     */
	    changeBookingAddBookable: function(e){
	    	var self = this;
	    	e.preventDefault();
	    	//create lineModel and initialize values
	    	var bookable_id = app.views.selectListAddBookableView.getSelectedItem();
	    	if(bookable_id != ''){
		    	var bookable_name = app.views.selectListAddBookableView.getSelectedText();
		    	var lineModel = new BookingLineModel({
		    		reserve_product:[bookable_id, bookable_name],
					pricelist_amount:0});
		    	lineModel.setQuantity(1);
		    	//reset selection to be able to add another bookable to booking
		    	app.views.selectListAddBookableView.reset();
		    	
		    	this.model.addLine(lineModel);
		    	
		    	//perform manually updates to lineModel to get pricing, dispo, ...
		    	var partner_id = this.model.getClaimer('id');
		    	var checkin = this.model.getStartDate();
		    	var checkout = this.model.getEndDate();
		    	$.when(lineModel.fetchAvailableQtity(checkin,checkout),lineModel.fetchPricing(partner_id,checkin,checkout)).always(function(){
		        	var lineView = new ItemFormBookingLineView({model:lineModel});
		        	//self.lineViews.push(lineView);
		        	$(self.el).find('#bookingLines').append(lineView.render().el);
		    	})
		    	.fail(function(e){
		    		console.log(e);
		    	});
	    	}
	    },
	    
	    changeBookingCheckin: function(e){
	    	e.preventDefault();
	    	if($("#bookingCheckin").val() != '' && $("#bookingCheckinHour").val() != ''){
		    	var dateVal = new moment( $("#bookingCheckin").val(),"DD-MM-YYYY")
				.add('hours',$("#bookingCheckinHour").val().split(":")[0] )
				.add('minutes',$("#bookingCheckinHour").val().split(":")[1] );
		    	this.model.setStartDate(moment.utc(dateVal).format('YYYY-MM-DD HH:mm:ss'));
	    	}
	    	else{
	    		this.model.setStartDate('');
	    	}
	    },
	    
	    changeBookingCheckout: function(e){
	    	e.preventDefault();
	    	if($("#bookingCheckout").val() != '' && $("#bookingCheckoutHour").val() != ''){
		    	var dateVal = new moment( $("#bookingCheckout").val(),"DD-MM-YYYY")
				.add('hours',$("#bookingCheckoutHour").val().split(":")[0] )
				.add('minutes',$("#bookingCheckoutHour").val().split(":")[1] );
		    	this.model.setEndDate(moment.utc(dateVal).format('YYYY-MM-DD HH:mm:ss'));
	    	}
	    	else{
	    		this.model.setEndDate('');
	    	}
	    },
	    
	    changeName: function(e){
	    	this.model.setName($("#bookingName").val());
	    },
	    
	    changeIsCitizen: function(e){
	    	var val = $('#bookingIsCitizen').bootstrapSwitch('status');
	    	this.model.setFromCitizen(val, false);
	    	if(val){
	    		app.views.selectListClaimersView.setSearchParam({field:'type_id.code', operator:'ilike', value:'PART'},true);
	    	}
	    	else{
	    		app.views.selectListClaimersView.resetSearchParams();
	    	}
	    	//$('#citizenInfos').find('input').val('');
	    	//app.views.selectListClaimersView.reset();
	    	this.changeBookingPartner();
	    },
	    
	    changePeopleName: function(e){
	    	this.model.setCitizenName($('#bookingPeopleName').val(),true);
	    },
	    
	    changePeoplePhone: function(e){
	    	this.model.setCitizenPhone($('#bookingPeoplePhone').val(),true);
	    },
	    
	    changePeopleEmail: function(e){
	    	this.model.setClaimerMail($('#bookingPeopleMail').val(),true);
	    },
	    
	    changePeopleStreet: function(e){
	    	this.model.set({'people_street':$('#bookingPeopleStreet').val()},{silent:true});
	    },
	    
	    changePeopleCity: function(e){
	    	this.model.set({'people_city':$('#bookingPeopleCity').val()},{silent:true});
	    },
	    
	    changePeopleZip: function(e){
	    	this.model.set({'people_zip':$('#bookingPeopleZip').val()},{silent:true});
	    },
	    
	    changeWholeDay: function(e){
	    	var val = $('#bookingWholeDay').bootstrapSwitch('status');
	    	this.model.set({'whole_day':val},{silent:true});
	    	if(val){
	    		$('#bookingCheckinHour').val('00:00');
	    		$('#blockBookingCheckinHour').addClass('hide');
	    		$('#bookingCheckoutHour').val('23:59');
	    		$('#blockBookingCheckoutHour').addClass('hide');
	    		
	    	}
	    	else{
	    		$('#blockBookingCheckinHour').removeClass('hide');
	    		$('#blockBookingCheckoutHour').removeClass('hide');
	    	}
	    },
	    
	    saveBookingForm: function(e){
	    	e.preventDefault();
	    	this.model.saveToBackend()
	    	.done(function(){
	    		//TODO: redirect to list ?
	    	})
	    	.fail(function(e){
	    		console.log(e);
	    	});
	    },
	    
	    changeAddRecurrence: function(e){
	    	var val = $('#bookingAddRecurrence').bootstrapSwitch('status');
	    	if(val){
	    		this.addRecurrence(e);
	    	}
	    	else{
	    		this.removeRecurrence(e);
	    	}
	    },
	    
	    addRecurrence: function(e){
			e.preventDefault();
			var recurrenceModel = new BookingRecurrenceModel();
			recurrenceModel.setTemplate(this.model);
			recurrenceModel.setStartDate(this.model.getStartDate());
			var recurrenceView = new FormRecurrenceView({model:recurrenceModel});
			$(this.el).find('#recurrence').html(recurrenceView.render().el);
		},
	    
	    removeRecurrence: function(e){
	    	e.preventDefault();
	    	if(this.model.recurrence != null){
	    		this.model.destroyRecurrenceOnBackend();
	    	}
	    }

	});
	return FormBookingView;
})