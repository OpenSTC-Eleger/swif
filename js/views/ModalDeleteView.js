/******************************************
* About View
*/
app.Views.ModalDeleteView = Backbone.View.extend({


	templateHTML: 'modalDelete',

	modal : null,

	
	// The DOM events //
	events: {
	   'click .btnDelete' : 'delete'
	},



	/** View Initialization
	*/
	initialize : function(user) {
		modal = $(this.el);
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

			modal.html(template);
			modal.modal('show');
		});

		return this;

	},



	delete: function(e){
		var self = this;

		this.model.delete({
			success: function(data){
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					modal.modal('hide');
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




