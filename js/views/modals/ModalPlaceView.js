/******************************************
* Place Modal View
*/
app.Views.ModalPlaceView = Backbone.View.extend({


	templateHTML: 'modals/modalPlace',

	modal : null,

	
	// The DOM events //
	events: {
		'submit #formSavePlace' : 'saveModel',
		
		'show'                  : 'show',
		'shown'                 : 'shown',
		'hidden' 				: 'hidden'
	},



	/** View Initialization
	*/
	initialize : function() {
		this.modal = $(this.el);
	},



	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		 
			var template = _.template(templateData, {
				lang  : app.lang,
				place : self.options.model
			});

			self.modal.html(template);


			// Advance Select List View //
			app.views.advancedSelectBoxPlaceTypeView = new app.Views.AdvancedSelectBoxView({el: $("#placeType"), model: app.Models.PlaceType.prototype.model_name })
			app.views.advancedSelectBoxPlaceTypeView.render();

			app.views.advancedSelectBoxPlaceParentView = new app.Views.AdvancedSelectBoxView({el: $("#placeParentPlace"), model: app.Models.Place.prototype.model_name })
			app.views.advancedSelectBoxPlaceParentView.render();

			app.views.advancedSelectBoxPlaceServices = new app.Views.AdvancedSelectBoxView({el: $("#placeServices"), model: app.Models.ClaimerService.prototype.model_name })
			app.views.advancedSelectBoxPlaceServices.render();


			self.modal.modal('show');
		});

		return this;
	},



	/** Trigger when the modal is show
	*/
	show: function(){
		this.delegateEvents(this.events);
	},


	/** Trigger when the modal is shown
	*/
	shown: function(){

		// Set the focus to the first input of the form //
		this.modal.find('input, textarea').first().focus();
	},



	/** Trigger when the modal is hide
	*/
	hidden: function(){
		this.undelegateEvents(this.events);
	},



	/** Delete the model pass in the view
	*/
	saveModel: function(e){
		e.preventDefault();

		var self = this;

		console.log('Model Save lol');
		
	}

});