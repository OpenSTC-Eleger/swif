define([
	'app',
	'appHelpers',

	'bookingModel',
	
	'itemBookingOccurrenceView'

], function( app, AppHelpers, BookingModel ){

	'use strict';

	/******************************************
	* Row Intervention Task View
	*/
	var itemBookingOccurrenceView = Backbone.View.extend({
	
		tagName     : 'tr',
	
		templateHTML : '/templates/items/itemBookingOccurrence',
		
		// The DOM events //
		events       : {
		},
	
		/** View Initialization
		*/
		initialize : function() {
			this.model.off();
			this.id = this.model.id;			
		},
		
		destroyTask: function(model){	
			//remove model
			this.remove();		
			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.taskDeleteOk);	
		},
	
		/** When the model ara updated //
		*/
		change: function(model){
			var self = this;	
			this.render();			
			AppHelpers.highlight($(this.el));	
		},
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;	
	
			// Retrieve the template // 
			$.get(app.menus.openresa + this.templateHTML, function(templateData){
	
				//var model = self.model.toJSON()
				var template = _.template(templateData, {
					lang                   : app.lang,					
					booking				   : self.model,
					BookingModel     	   : BookingModel
				});
	
				$(self.el).html(template);
	
				// Set the Tooltip / Popover //$(self.el).html(template);
				$('*[data-toggle="tooltip"]').tooltip();
				$('*[rel="popover"]').popover({trigger: 'hover'});
	
				
				$('tr.row-object').css({ opacity: '1'});
				$('tr.row-object > td').css({ backgroundColor: '#FFF'});
				$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
			});
			return this;
		},	
	
	});	
			
	return itemBookingOccurrenceView;

});