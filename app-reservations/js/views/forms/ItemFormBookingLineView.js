define(['app', 
        'appHelpers', 
        
        'bookingLineModel',
        'bookingLinesCollection',
        'bookablesCollection',
        'claimersCollection',
        'claimersContactsCollection',
        
        
        'advancedSelectBoxView',
        'moment',
        'moment-timezone',
        'moment-timezone-data',
        'bsTimepicker',
        'bsDatepicker'

], function (app, AppHelpers, BookingLineModel, BookingLinesCollection, BookablesCollection, ClaimersCollection, ClaimersContactsCollection, AdvancedSelectBoxView, moment) {

    'use strict';

	/******************************************
	* Row Bookable FormBooking View
	*/
	var ItemFormBookingLineView = Backbone.View.extend({
	
		tagName      : 'tr',
	
		className    :  function() {
				var classRow = 'row-nested-objects';
				if(this.model.getAvailable()){
					classRow += ' ' + BookingLineModel.status.dispo.color;
				}
				else{
					classRow += ' ' + BookingLineModel.status.not_dispo.color;
				}
				return classRow;
			},
	
		templateHTML : '/templates/forms/itemFormBookingLine.html',
	
	
		// The DOM events //
		events: {
			'change #bookingLineQty': 'changeBookingLineQty',
			'change #bookingLinePricing': 'changeBookingLinePricing',
			'click .removeLine'				: 'removeLine'
		},
	
	
	
		/** View Initialization
		*/
		initialize : function() {
			this.model.off();
	
			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);
	
			// When the model are destroy //
			this.listenTo(this.model,'destroy', this.destroy);

		},
	
		/** When the model is updated //
		*/
		change: function(e,options){
			console.log(options);
			$(this.el).attr('class',this.className());
			this.render();
			//AppHelpers.highlight($(this.el));
			//app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.placeUpdateOk);
		},
	
		/** When the model is destroy //
		*/
		destroy: function(e){
			var self = this;
			self.remove();		
		},
		
		/**Compute popover value
		 */
		popoverValue: function(){
			if(!this.model.getAvailable()){
				var qty = parseInt(this.model.getAvailableQtity());
				if(qty < 0){
					qty = 0;
				}
				var val = '<p>' + app.lang.resa.available_qty + ': ' + qty.toString() + '</p>';
				$(this.el).data('toggle','popover');
				$(this.el).data('html','true');
				$(this.el).data('placement','top');
				$(this.el).popover({trigger: 'hover', content: val});
			}
			else{
				$(this.el).popover('destroy');
			}
		},
		
		/** Display the view
		*/
		render : function() {
			var self = this;
			var readonly = this.model.getParentBookingModel().getAttribute('state','draft') != 'draft';
			var pricingEnabled = this.model.getParentBookingModel().hasActions('update') && app.current_user.isResaManager();
			// Retrieve the template // 
			$.get(app.menus.openresa + this.templateHTML, function(templateData){

				var template = _.template(templateData, {
					lang	: app.lang,
					line	: self.model,
					bookable: self.model.bookable,
					linesStat: BookingLineModel.status,
					readonly: readonly,
					pricingEnabled: pricingEnabled
				});

				$(self.el).html(template);
				self.popoverValue();
				// Set the Tooltip //
				$('*[data-toggle="tooltip"]').tooltip();
	
			});
	
			return this;
		},
		
		changeBookingLineQty: function(e){
			e.preventDefault();
			var val = $(this.el).find('#bookingLineQty').val();
			if(val != ''){
				this.model.setQuantity(parseFloat(val));
			}
		},
		
		changeBookingLinePricing: function(e){
			e.preventDefault();
			var val = $(this.el).find('#bookingLinePricing').val();
			if(val != ''){
				this.model.set({pricelist_amount:parseFloat(val)},{silent:true});
			}
		},
		
	    
	    removeLine: function(e){
	    	e.preventDefault();
			$(this.el).popover('hide');
			$(this.el).popover('destroy');
	    	this.model.destroyOnBackend();
	    }
	});
	return ItemFormBookingLineView;
})