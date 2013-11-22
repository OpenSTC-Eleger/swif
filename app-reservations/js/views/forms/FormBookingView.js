
define(['app', 
        'appHelpers', 
        
        'bookingModel',
        'bookingLineModel',
        'bookingLinesCollection',
        'bookablesCollection',
        'claimersCollection',
        'claimersContactsCollection',
        
        'itemFormBookingLineView',
        'advancedSelectBoxView',
        'moment',
        'moment-timezone',
        'moment-timezone-data',
        'bsTimepicker',
        'bsDatepicker'

], function (app, AppHelpers, BookingModel, BookingLineModel, BookingLinesCollection, BookablesCollection, ClaimersCollection, ClaimersContactsCollection, ItemFormBookingLineView, AdvancedSelectBoxView, moment) {

    'use strict';
	/******************************************
	* Requests Details View
	*/
	var FormBookingView = Backbone.View.extend({
	
	
		templateHTML : 'forms/form_booking',
		el: '#rowContainer',
	
	
		// The DOM events //
		events: {
			'change #bookingPartner'		: 'changeBookingPartner',
			'change #bookingContact'		: 'changeBookingContact',
			'change #bookingAddBookable'	: 'changeBookingAddBookable',
			'change #bookingCheckin'		: 'changeBookingCheckin',
			'change #bookingCheckout'		: 'changeBookingCheckout',
			'change #bookingCheckinHour'	: 'changeBookingCheckin',
			'change #bookingCheckoutHour'	: 'changeBookingCheckout',
			'submit #formSaveBooking'		: 'saveBookingForm',
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
				this.render();
			}
			else{
				// Render with loader //
				this.model = new BookingModel({id:this.options.id});
				this.model.fetch({silent: true}).done(function(){
					self.render(true);
					self.model.fetchLines()
					.done(function(){
						self.renderLines();
					});
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
			$.get(app.moduleUrl + "/templates/" + this.templateHTML + ".html", function(templateData){			
				var startDate = '';
				var startHour = '';
				var endDate = '';
				var endHour = '';
				if(!self.model.isNew()){
					var tz = app.models.user.getContext().tz;
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
	
	    saveBookingForm: function(e){
	    	e.preventDefault();
	    	this.model.setName($("#bookingName").val());
	    	this.model.saveToBackend()
	    	.done(function(){
	    		
	    	})
	    	.fail(function(e){
	    		console.log(e);
	    	});
	    }
	    
	});
	return FormBookingView;
})