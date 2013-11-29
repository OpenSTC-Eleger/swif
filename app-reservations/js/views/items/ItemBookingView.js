define([
	'app',
	'appHelpers',

	'bookingModel',
	
	'modalUpdateBookingView'

], function(app, AppHelpers, BookingModel, ModalUpdateBookingView){

	'use strict';


	/******************************************
	* Row Intervention View
	*/
	var itemBookingView = Backbone.View.extend({
	
		tagName     : 'tr',
	
		templateHTML : '/templates/items/itemBooking.html',
		
		className   : 'row-item',
	
		// The DOM events //
		events       : {
			'click a.accordion-object'    			: 'tableAccordion',
			'click a.displayOccurences'				: 'displayOccurences',
			
			'click .actions'						: 'modalUpdateBooking'
		},
	
	
	
		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;
			
			this.detailedView = this.options.detailedView;
	
			this.model.off();
	
			// When the model are updated //
			this.listenTo(this.model, 'change', this.change);
		},
	
	
	
		/** When the model ara updated //
		*/
		change: function(model){
			var self = this;
			self.render();
	
			//Not apply notification for resources because field is calculated.
			if(! model.hasChanged('resources') ){
				// Highlight the Row and recalculate the className //
				AppHelpers.highlight($(self.el)).done(function(){});
		
				app.notify('', 'success', app.lang.infoMessages.information, self.model.getName()+' : '+ app.lang.infoMessages.interventionUpdateOK);
		
				// Partial Render //
				app.views.bookingsListView.partialRender();
			}
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
					BookingModel			: BookingModel
				});
	
				$(self.el).html(template);
				
	
				// Set the Tooltip / Popover //$(self.el).html(template);
				$('*[data-toggle="tooltip"]').tooltip();
				$('*[data-toggle="popover"]').popover({trigger: 'hover'});
				
				$('tr.row-object').css({ opacity: '1'});
				$('tr.row-object > td').css({ backgroundColor: '#FFF'});
				$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
				
				if( !self.model.isAllDispo() )
					//this.el.effect("highlight", {color: 'blue'});
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
			app.router.navigate(app.views.bookingsListView.urlBuilder(), {trigger: true, replace: true});			
		},
	
		/**
		 * Process Table accordion event
		 */
		tableAccordion: function(e){	
			e.preventDefault();
			//fold up current accordion and expand 
			this.expendAccordion();		   
		},
		
		/**
		 * Expan accordion
		 */
		expendAccordion: function(){
			// Retrieve the intervention ID //
			//var id = _($(e.target).attr('href')).strRightBack('_');
			var id = this.model.toJSON().id.toString();
			var self = this;
		
			var isExpend = $('#collapse_'+id).hasClass('expend');
		
			// Reset the default visibility //
			$('tr.expend').css({ display: 'none' }).removeClass('expend');
			$('tr.row-object').css({ opacity: '0.45'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			
			
			// If the table row isn't already expend //       
			if(!isExpend){
				// Fetch tasks
				if(!_.isUndefined(this.detailedView) && !_.isNull(this.detailedView)){
					this.detailedView.fetchData().done(function () {
						self.detailedView.render();
					});
				}
				
				// Set the new visibility to the selected intervention //
				$('#collapse_'+id).css({ display: 'table-row' }).addClass('expend');
				$(this.el).parents('tr.row-object').css({ opacity: '1'});  
				$(this.el).parents('tr.row-object').children('td').css({ backgroundColor: "#F5F5F5" }); 
			}
			else {
				$('tr.row-object').css({ opacity: '1'});
				$('tr.row-object > td').css({ backgroundColor: '#FFF'});
				$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
			}
		},
		
		
		/** Display Modal form to valid an Intervention Request
		*/
		modalUpdateBooking: function(e){
			e.preventDefault(); e.stopPropagation();
	
			app.views.modalUpdateBookingView = new ModalUpdateBookingView({
				el      : '#modalUpdateBooking',
				model   : this.model,
				state	: e.currentTarget.id
			});
		},
	
	});	
	
	return itemBookingView;

});