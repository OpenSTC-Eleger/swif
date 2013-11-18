/******************************************
* Row Bookable FormBooking View
*/
app.Views.ItemFormBookingLineView = Backbone.View.extend({

	tagName      : 'tr',

	className    :  function() {
			var classRow = 'row-nested-objects';
			if(this.model.getAvailable()){
				classRow += ' ' + app.Models.BookingLine.status.dispo.color;
				return classRow;
			}
			else{
				return classRow += ' ' + app.Models.BookingLine.status.not_dispo.color;
			}
		},

	templateHTML : 'items/itemFormBookingLine',


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
		this.bookableModel = new app.Models.Bookable({id:this.model.getResource('id')});
		this.deferredBookable = this.bookableModel.fetch({silent:true});
	},
	/*
	 * Method to perform smart update of models according to some conditions (dates changed, partner changed,...)
	 */
	updateData: function(){
		var parentModel = this.model.getParentBookingModel();
		
		if(parentModel != null){
			var checkin = parentModel.getStartDate();
			var checkout = parentModel.getEndDate();
			var partner_id = parentModel.getPartner('id');
			if(checkin != '' && checkout != ''){
				this.model.fetchAvailableQtity(checkin,checkout);
				if(partner_id > 0){
					this.model.fetchPricing(partner_id, checkin, checkout);
				}
			}
		}

	},

	/** When the model is updated //
	*/
	change: function(e){
		$(this.el).attr('class',this.className());
		this.render();
		app.Helpers.Main.highlight($(this.el));
		//app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.placeUpdateOk);
	},



	/** When the model is destroy //
	*/
	destroy: function(e){
		var self = this;

		//app.Helpers.Main.highlight($(this.el)).done(function(){
			self.remove();
		//});

		//app.notify('', 'success', app.lang.infoMessages.information, e.getCompleteName()+' : '+app.lang.infoMessages.placeDeleteOk);
		
	},



	/** Display the view
	*/
	render : function() {
		var self = this;
		
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			//we wait for bookable fetch finished
			self.deferredBookable.done(function(){
				var template = _.template(templateData, {
					lang	: app.lang,
					line	: self.model,
					bookable: self.bookableModel
				});

				$(self.el).html(template);

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
		val = $(this.el).find('#bookingLineQty').val();
		if(val != ''){
			this.model.setQuantity(parseFloat(val));
		}
	},
	
	changeBookingLinePricing: function(e){
		e.preventDefault();
		val = $(this.el).find('#bookingLinePricing').val();
		if(val != ''){
			this.model.set({pricelist_amount:parseFloat(val)},{silent:true});
		}
	},
	
    
    removeLine: function(e){
    	e.preventDefault();
    	this.model.destroy();
    }
});