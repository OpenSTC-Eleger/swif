/******************************************
* Row Intervention View
*/
app.Views.ItemBookingView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemBooking',
	
	className   : 'row-item',

	// The DOM events //
	events       : {

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
		self.render();

		//Not apply notification for resources because field is calculated.
		if(! model.hasChanged('resources') ){
			// Highlight the Row and recalculate the className //
			app.Helpers.Main.highlight($(self.el)).done(function(){
			});
	
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
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

		 
			var template = _.template(templateData, {
				lang                   : app.lang,
				bookingsState     	   : app.Models.Booking.status,
				booking          	   : self.model,
			});

			$(self.el).html(template);

			// Set the Tooltip / Popover //$(self.el).html(template);
			$('*[data-toggle="tooltip"]').tooltip();
			$('*[data-toggle="popover"]').popover({trigger: 'hover'});
			
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
			
		});
		$(this.el).hide().fadeIn('slow'); 
		return this;
	},


});