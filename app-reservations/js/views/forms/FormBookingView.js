
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
        'bsDatepicker'

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
			'change #bookingName'				: 'changeName',
			
			//Form Buttons
			'submit #formSaveBooking'			: 'saveBookingForm',
			'click #getRecurrenceDates'			: 'getRecurrenceDates',
			'click #addRecurrence'				: 'addRecurrence'
		},
	
		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;
			var self = this;
			//this.lineViews = [];
			// Check if it's a create or an update //
			if(_.isUndefined(this.options.id)){
				
				this.model = new BookingModel();
				app.router.render(this);
			}
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
					if(self.model.get('is_template') && self.model.getRecurrence() != false){
						var recurrence = new BookingRecurrenceModel({id:self.model.getRecurrence('id')});
						recurrence.setTemplate(self.model);
						recurrence.fetch()
						.done(function(){
							var recurrenceView = new FormRecurrenceView({model:recurrence});
							$(self.el).find('#recurrence').html(recurrenceView.render().el);
						});
					}
				});
			}
	
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
				var startDate = '';
				var startHour = '';
				var endDate = '';
				var endHour = '';
				if(!self.model.isNew()){
					var checkin = moment.utc((self.model.getStartDate())).local();
					var checkout = moment.utc((self.model.getEndDate())).local();
					
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
				});
	
				$(self.el).html(template);
	
				$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
				$(".datepicker").datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });
				
					$('.make-switch').bootstrapSwitch();
	
				// Request Claimer //
				app.views.selectListClaimersView = new AdvancedSelectBoxView({el: $('#bookingPartner'), collection: ClaimersCollection.prototype});
				app.views.selectListClaimersView.resetSearchParams();
				app.views.selectListClaimersView.render();
	
				// Request Contact //
				app.views.selectListClaimersContactsView = new AdvancedSelectBoxView({el: $('#bookingContact'), collection: ClaimersContactsCollection.prototype});
				app.views.selectListClaimersContactsView.resetSearchParams();
				app.views.selectListClaimersContactsView.render();
	
				app.views.selectListAddBookableView = new AdvancedSelectBoxView({el: $('#bookingAddBookable'), collection: BookablesCollection.prototype}),
				app.views.selectListAddBookableView.resetSearchParams();
				app.views.selectListAddBookableView.render();
	
				$(this.el).hide().fadeIn('slow');
			});
			return this;
	    },
	    
	    /*
	     * Update searchParam of ClaimerContact (partner.id = self if partner_id is set, else, remove searchParams)
	     */	
	    changeBookingPartner: function(e){
	    	e.preventDefault();
	    	var partner_id = app.views.selectListClaimersView.getSelectedItem();
	    	if(partner_id != ''){
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
	    	e.preventDefault();
	    	var contact_id = app.views.selectListClaimersContactsView.getSelectedItem();
	    	if(contact_id){
	    		this.model.setClaimerContact([contact_id], app.views.selectListClaimersContactsView.getSelectedText());
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
		    	//finally, reset selection to be able to add another bookable to booking
		    	app.views.selectListAddBookableView.reset();
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
	    },
	    
	    changeBookingCheckout: function(e){
	    	e.preventDefault();
	    	if($("#bookingCheckout").val() != '' && $("#bookingCheckoutHour").val() != ''){
		    	var dateVal = new moment( $("#bookingCheckout").val(),"DD-MM-YYYY")
				.add('hours',$("#bookingCheckoutHour").val().split(":")[0] )
				.add('minutes',$("#bookingCheckoutHour").val().split(":")[1] );
		    	this.model.setEndDate(moment.utc(dateVal).format('YYYY-MM-DD HH:mm:ss'));
	    	}
	    },
	    
	    changeName: function(e){
	    	this.model.setName($("#bookingName").val());
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
	    addRecurrence: function(e){
			e.preventDefault();
			var recurrenceModel = new BookingRecurrenceModel();
			recurrenceModel.setTemplate(this.model);
			recurrenceModel.setStartDate(this.model.getStartDate());
			var recurrenceView = new FormRecurrenceView({model:recurrenceModel});
			$(this.el).find('#recurrence').html(recurrenceView.render().el);
		}

	});
	return FormBookingView;
})