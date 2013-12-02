define(['app', 
        'appHelpers', 
        
        'bookingModel',
        
        'moment',
        'moment-timezone',
        'moment-timezone-data',
        'bsTimepicker',
        'bsDatepicker'

], function (app, AppHelpers, BookingModel, moment) {

    'use strict';

	/******************************************
	* Row Bookable FormBooking View
	*/
	var ItemFormBookingOccurrenceView = Backbone.View.extend({
	
		tagName      : 'tr',
	
		className    :  function() {
				var classRow = 'row-nested-objects';
				if(this.model.getAllDispo()){
					classRow += ' ' + BookingModel.actions.confirm.color;
					return classRow;
				}
				else{
					return classRow += ' ' + BookingModel.actions.cancel.color;
				}
			},
	
		templateHTML : 'forms/item_form_booking_occurrence',
	
	
		// The DOM events //
		events: {
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
	
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
			
		// Retrieve the template // 
		$.get(app.menus.openresa + "/templates/" + this.templateHTML + ".html", function(templateData){
			//we wait for bookable fetch finished
			var template = _.template(templateData, {
				lang	: app.lang,
				booking: self.model,
				bookingStat: BookingModel.actions,
			});

			$(self.el).html(template);

			// Set the Tooltip //
			$('*[data-toggle="tooltip"]').tooltip();
		});

		return this;
		},
			    
	    removeLine: function(e){
	    	e.preventDefault();
	    	this.model.recurrence.destroyOccurrenceFromBackend(this.model);
	    }
	});
	return ItemFormBookingOccurrenceView;
})