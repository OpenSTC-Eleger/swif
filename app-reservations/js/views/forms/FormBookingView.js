
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
			
			
			//Form Buttons
			'submit #formSaveBooking'			: 'saveBookingForm',
			'click #getRecurrenceDates'			: 'getRecurrenceDates',
			'change #addRecurrence'				: 'changeAddRecurrence',
			'change #isCitizen'					: 'changeIsCitizen',
		},
	
		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;
			var self = this;
			//if view is called with a filled model (new booking from calendar)
			if(!_.isUndefined(this.model)){
				self.renderLines();
			}
			//else, if view is called without an id (new booking from scratch)
			else if(_.isUndefined(this.options.id)){
				
				this.model = new BookingModel();
				app.router.render(this);
			}
			//else, mean that id option is set (update booking from list, for example)
			else{
				// Render with loader //
				this.model = new BookingModel({id:this.options.id});
				this.model.fetch({silent: true}).done(function(){
					app.router.render(self);
					
					//fetch and render lines
					self.model.fetchLines()
					.done(function(){
						self.renderLines();
					});
					
					//fetch and render recurrence if exists
					if(self.model.getRecurrence() != false){
						var recurrence = new BookingRecurrenceModel({id:self.model.getRecurrence('id')});
						if(self.model.isTemplate()){
							recurrence.setTemplate(self.model);
							recurrence.fetch()
							.done(function(){
								var recurrenceView = new FormRecurrenceView({model:recurrence});
								$(self.el).find('#recurrence').html(recurrenceView.render().el);
							});
						}
						else{
							self.model.recurrence = recurrence;
						}
					}
				});
			}
			//TOCHECK
			this.listenTo(this.model, 'change', this.updateDisplayDoms);
			this.listenTo(this.model.lines, 'add', this.updateDisplayDoms);
			this.listenTo(this.model.linesToRemove, 'add', this.updateDisplayDoms);
			
		},
		
		//compute if form can be modified or not
		isEditable: function(){
			return this.model.getState() == BookingModel.status.remplir.key;
		},
		
	    //compute display of button addBookable (readonly or visible)
	    updateDisplayAddBookable: function(){
	    	var elt = $('#bookingAddBookable');
	    	if(this.isEditable() && this.model.getStartDate() != '' && this.model.getEndDate() != '' && this.model.getClaimer('id') > 0){
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
	    	if(this.isEditable() && this.model.getStartDate() != '' && this.model.getEndDate() != '' && this.model.getClaimer('id') > 0 && this.model.lines.length > 0){
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
	    	
	    	if(!isHidden){
	    		elt.removeClass('hide-soft');
	    		if(this.isEditable() ){
	    			elt.removeAttr('disabled');
	    		}
	    		else{
	    			elt.attr('disabled','');
	    		}
	    	}
	    	else{
	    		elt.addClass('hide-soft');
	    	}

	    },
	    
	    updateDisplayCitizenInfos: function(){
	    	var val = $('#bookingIsCitizen').bootstrapSwitch('status');
	    	if(val){
	    		$('#blockBookingContact').addClass('hide-soft');
	    		$('#citizenInfos').removeClass('hide-soft');
	    	}
	    	else{
	    		$('#blockBookingContact').removeClass('hide-soft');
	    		$('#citizenInfos').addClass('hide-soft');
	    	}
	    	if(!_.isUndefined(app.views.selectListClaimersContactsView)){
	    		app.views.selectListClaimersContactsView.render();
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
			this.model.lines.each(function(lineModel){
	        	var lineView = new ItemFormBookingLineView({model:lineModel});
	        	//self.lineViews.push(lineView);
	        	$(self.el).find('#bookingLines').append(lineView.render().el);
			});
		},
		
	
		/** Display the view
		*/
		render: function(loader) {
	
			var self = this;
			// Retrieve the template //
			$.get(app.menus.openresa + this.templateHTML, function(templateData){			
				//compute dates with browser-local TZ
				var startDate = '';
				var startHour = '';
				var endDate = '';
				var endHour = '';
				if(!self.model.isNew()){
					var checkin = AppHelpers.convertDateToTz(self.model.getStartDate());
					var checkout = AppHelpers.convertDateToTz(self.model.getEndDate());
					
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
				if(!self.model.isNew()){
					self.changeBookingPartner();
					self.changeBookingContact();
				}
				
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
	    	app.views.selectListClaimersContactsView.render();
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
	    	app.views.selectListClaimersView.render();
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
	    	console.log('----------------------');
	    	
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