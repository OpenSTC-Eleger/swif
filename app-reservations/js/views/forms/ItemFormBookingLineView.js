define(['app', 
        'appHelpers', 
        
        'bookingLineModel',
        'bookableModel',
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

], function (app, AppHelpers, BookingLineModel, BookableModel, BookingLinesCollection, BookablesCollection, ClaimersCollection, ClaimersContactsCollection, AdvancedSelectBoxView, moment) {

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
					return classRow;
				}
				else{
					return classRow += ' ' + BookingLineModel.status.not_dispo.color;
				}
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
			
			//I store bookableModel (and base64 image value) on object directly
			//TODO: set a default picture if no one is found
			this.deferredBookable = $.Deferred();
			this.bookableModel = new BookableModel({id:this.model.getResource('id')});
			this.deferredBookable = this.bookableModel.fetch({silent:true});
		},
	
	
		/** When the model is updated //
		*/
		change: function(e){
			$(this.el).attr('class',this.className());
			this.render();
			AppHelpers.highlight($(this.el));
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
				var val = '<p>' + app.lang.resa.missing_qty + ': ' + parseInt(this.model.getQuantity() - this.model.getAvailableQtity()).toString() + '</p>';
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
			
			// Retrieve the template // 
			$.get(app.menus.openresa + this.templateHTML, function(templateData){
				//we wait for bookable fetch finished
				self.deferredBookable.done(function(){
					var template = _.template(templateData, {
						lang	: app.lang,
						line	: self.model,
						bookable: self.bookableModel,
						linesStat: BookingLineModel.status,
					});
	
					$(self.el).html(template);
					self.popoverValue();
					// Set the Tooltip //
					$('*[data-toggle="tooltip"]').tooltip();
				})
				.fail(function(e){
					console.log(e);
				});
	
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
	    	this.model.destroyOnBackend();
	    }
	});
	return ItemFormBookingLineView;
})