define([
	'app',
	'appHelpers',

	'bookingModel',
	
	'modalUpdateBookingView',
	'modalCancelBookingView'

], function(app, AppHelpers, BookingModel, ModalUpdateBookingView, ModalCancelBookingView){

	'use strict';


	/******************************************
	* Row Booking View
	*/
	var itemBookingView = Backbone.View.extend({
	
		tagName     : 'tr',
	
		templateHTML : '/templates/items/itemBooking.html',
		
		className   : 'row-item',
	
		// The DOM events //
		events       : {			
			'click a.displayOccurences'				: 'displayOccurences',			
			'click .actions'						: 'modalUpdateBooking',
			'click a.buttonCancelBooking'			: 'displayModalCancelBooking',
		},	
	
	
		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;
				
			this.model.off();
	
			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);			
		},
	
	
	
		/** When the model ara updated //
		*/
		change: function(model){
			var self = this;
			if( !_.isBlank(model.getDeletedAt()) ) {
				AppHelpers.highlight($(this.el)).done(function(){
					self.remove();
					//app.views.bookingsListView.partialRender();
	
				});			
			}
			else
				self.render();
				
			// Highlight the Row and recalculate the className //
			//AppHelpers.highlight($(self.el)).done(function(){});
	
			//app.notify('', 'success', app.lang.infoMessages.information, self.model.getName()+' : '+ app.lang.infoMessages.interventionUpdateOK);
	
			// Partial Render //
			app.views.bookingsListView.partialRender();			
		},
	
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
	
			// Retrieve the template // 
			$.get(app.menus.openresa + this.templateHTML, function(templateData){
	
			 
				var template = _.template(templateData, {
					lang                   : app.lang,
					bookingsState     	   : BookingModel,
					booking          	   : self.model,
					BookingModel			: BookingModel,
                    downloadToken : app.current_user.get('authToken')
				});
	
				$(self.el).html(template);
				
	
				// Set the Tooltip / Popover //$(self.el).html(template);
				$('*[data-toggle="tooltip"]').tooltip();
				$('*[data-toggle="popover"]').popover({trigger: 'hover'});
				
				$('tr.row-object').css({ opacity: '1'});
				$('tr.row-object > td').css({ backgroundColor: '#FFF'});
				$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
				
				//Apply warning color when some ressources are not disponible
				if( !self.model.isAllDispo() )					
					$(self.el).addClass('danger');
				
			});
			$(this.el).hide().fadeIn('slow'); 
			return this;
		},
		
		/** Displays occurences booking
		*/
		displayOccurences: function(e){
			e.preventDefault();
			app.views.bookingsListView.options.recurrence = this.model.getRecurrence('id'); 
			delete app.views.bookingsListView.options.page;
			app.router.navigate(app.views.bookingsListView.urlBuilder(), {trigger: true, replace: false});			
		},
		
		
		/** Display Modal form to valid an Booking Request
		*/
		modalUpdateBooking: function(e){
			e.preventDefault();

			var state = $(e.target).data('action');
			
	
			app.views.modalUpdateBookingView = new ModalUpdateBookingView({
				el      : '#modalUpdateBooking',
				model   : this.model,
				state	: state
			});
		},
		
		displayModalCancelBooking: function(e) {
			e.preventDefault();
			new ModalCancelBookingView({el: '#modalCancelBooking', model: this.model});
		},
	
	});	
	
	return itemBookingView;

});