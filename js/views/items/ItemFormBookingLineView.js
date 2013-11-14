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



	/** When the model is updated //
	*/
	change: function(e){

		this.render();
		app.Helpers.Main.highlight($(this.el));
		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.placeUpdateOk);
	},



	/** When the model is destroy //
	*/
	destroy: function(e){
		var self = this;

		app.Helpers.Main.highlight($(this.el)).done(function(){
			self.remove();
			app.views.placesListView.partialRender();
		});

		app.notify('', 'success', app.lang.infoMessages.information, e.getCompleteName()+' : '+app.lang.infoMessages.placeDeleteOk);
		
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

});