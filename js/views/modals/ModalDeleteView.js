/******************************************
* Modal Delete View
*/
app.Views.ModalDeleteView = app.Views.GenericModalView.extend({


	templateHTML: 'modals/modalDelete',

	
	// The DOM events //
	events: function(){
		return _.defaults({
			'click .btnDelete' : 'deleteModel',
		}, 
			app.Views.GenericModalView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize : function() {
		this.modal = $(this.el);

		this.render();
	},



	/** Display the view
	*/
	render : function() {
		var self = this;

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		 
			var template = _.template(templateData, {
				lang  : app.lang,
				model : self.model
			});

			self.modal.html(template);
			self.modal.modal('show');
		});

		return this;
	},



	/** Delete the model pass in the view
	*/
	deleteModel: function(e){
		var self = this;


		// Set the button in loading State //
		$(e.target).button('loading');

		// Delete the Model //
		this.model.delete({
			success: function(data){
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					self.modal.modal('hide');
					self.collection.remove(self.model);
				}
			},
			complete: function(){
				// Reset the button state //
				$(e.target).button('reset');
			},
			error: function(e){
				alert("Impossible de contacter le serveur");
			}

		});
	}

});