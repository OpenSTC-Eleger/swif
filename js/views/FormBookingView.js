/******************************************
* Requests Details View
*/
app.Views.FormBooking = Backbone.View.extend({


	templateHTML : 'form_booking',
	el: '#rowContainer',


	// The DOM events //
	events: {
		'change #bookingPartner'		: 'changeBookingPartner',
		'change #bookingAddBookable'	: 'changeBookingAddBookable',
		'change #bookingCheckin'		: 'changeBookingCheckin',
		'change #bookingCheckout'		: 'changeBookingCheckout'
	},



	/** View Initialization
	*/
	initialize : function() {
		var self = this;
		this.lines = new app.Collections.BookingLines();
		// Check if it's a create or an update //
		if(_.isUndefined(this.booking_id)){
			
			this.model = new app.Models.Booking();
			this.render();
		}
		else{
			// Render with loader //
			this.render(true);
			this.model = new app.Models.Booking({id:this.booking_id});
			this.model.fetch({silent: true, data : {fields : this.model.fields}}).done(function(){
				self.render();
			});
		}

	},



	/** Display the view
	*/
	render: function(loader) {

		var self = this;

		// Retrieve the template //
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang   : app.lang,
				booking: self.model,
				loader : loader
			});

			$(self.el).html(template);

			$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
			$(".datepicker").datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });
			
			if(!loader){
				$('.make-switch').bootstrapSwitch();

				// Request Claimer //
				app.views.selectListClaimersView = new app.Views.AdvancedSelectBoxView({el: $('#bookingPartner'), collection: app.Collections.Claimers.prototype});
				app.views.selectListClaimersView.resetSearchParams();
				app.views.selectListClaimersView.render();

				// Request Contact //
				app.views.selectListClaimersContactsView = new app.Views.AdvancedSelectBoxView({el: $('#bookingContact'), collection: app.Collections.ClaimersContacts.prototype});
				app.views.selectListClaimersContactsView.resetSearchParams();
				app.views.selectListClaimersContactsView.render();

				app.views.selectListAddBookableView = new app.Views.AdvancedSelectBoxView({el: $('#bookingAddBookable'), collection: app.Collections.Bookables.prototype}),
				app.views.selectListAddBookableView.resetSearchParams();
				app.views.selectListAddBookableView.render();
				// Set Information about the booking if needed //
				if(!self.model.isNew()){

				}
			}

			$(this.el).hide().fadeIn('slow');
		});
		return this;
    },
    
    
    /*
     * Update searchParam of ClaimerContact (partner.id = self if partner_id is set, else, remove searchParams)
     */	
    changeBookingPartner: function(e){
    	e.preventDefault();
    	partner_id = app.views.selectListClaimersView.getSelectedItem();
    	if(partner_id != ''){
    		app.views.selectListClaimersContactsView.setSearchParam({'field':'partner_id.id','operator':'=','value':partner_id},true);
    		this.model.set({partner_id:partner_id});
    	}
    	else{
    		app.views.selectListClaimersContactsView.resetSearchParams();
    		this.model.set({partner_id:0});
    	}
    	app.views.selectListClaimersContactsView.render();
    },
    
    /*
     * each time a bookable is selected on AdvancedSelectBox, we create a new itemView (not any save before user click on validate)
     */
    changeBookingAddBookable: function(e){
    	var self = this;
    	e.preventDefault();
    	bookable_id = app.views.selectListAddBookableView.getSelectedItem();
    	bookable_name = app.views.selectListAddBookableView.getSelectedText();
    	var lineModel = new app.Models.BookingLine({
    		reserve_product:[bookable_id, bookable_name],
			qte_reserves: 1,
			pricelist_amount:0});
    	var partner_id = this.model.getPartner('id');
    	var checkin = this.model.getStartDate();
    	var checkout = this.model.getEndDate();
    	$.when(lineModel.fetchAvailableQtity(checkin,checkout),lineModel.fetchPricing(partner_id,checkin,checkout)).done(function(){
        	var lineView = new app.Views.ItemFormBookingLineView({model:lineModel});
        	self.lines.add(lineModel);
        	$(self.el).find('#bookingLines').append(lineView.render().el);
    	})
    	.fail(function(e){
    		console.log(e);
    	});
    	app.views.selectListAddBookableView.reset();
    },
    
    changeBookingCheckin: function(e){
    	e.preventDefault();
    	var dateVal = new moment( $("#bookingCheckin").val(),"DD-MM-YYYY")
		.add('hours',$("#bookingCheckinHour").val().split(":")[0] )
		.add('minutes',$("#bookingCheckinHour").val().split(":")[1] );
    	this.model.set({checkin:moment.utc(dateVal).format('YYYY-MM-DD hh:mm:ss')});
    },
    
    changeBookingCheckout: function(e){
    	e.preventDefault();
    	var dateVal = new moment( $("#bookingCheckout").val(),"DD-MM-YYYY")
		.add('hours',$("#bookingCheckoutHour").val().split(":")[0] )
		.add('minutes',$("#bookingCheckoutHour").val().split(":")[1] );
    	this.model.set({checkout:moment.utc(dateVal).format('YYYY-MM-DD hh:mm:ss')});
    }
});