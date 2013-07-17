/******************************************
* Modal Delete View
*/
app.Views.ModalDeleteView = Backbone.View.extend({


	templateHTML: 'modals/modalDelete',

	modal : null,

	
	// The DOM events //
	events: {
		'click .btnDelete' : 'deleteModel',
		
		'show'             : 'show',
		'hidden'           : 'hidden',
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
				model : self.options.model
			});

			self.modal.html(template);
			self.modal.modal('show');
		});

		return this;
	},



	/** Trigger when the modal is show
	*/
	show: function(){
		this.delegateEvents(this.events);

		console.log('Japparait Modal delte');
	},



	/** Trigger when the modal is hidden
	*/
	hidden: function(){
		this.undelegateEvents(this.events);

		console.log('je disparait Modal delete HIDDEN');
	},



	/** Delete the model pass in the view
	*/
	deleteModel: function(e){
		var self = this;

		this.model.delete({
			success: function(data){
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					self.modal.modal('hide');
					app.notify('', 'info', app.lang.infoMessages.information, app.lang.infoMessages.placeDeleteOk);
					Backbone.history.loadUrl(Backbone.history.fragment);
				}
			},
			error: function(e){
				alert("Impossible de contacter le serveur");
			}

		});
	}

});