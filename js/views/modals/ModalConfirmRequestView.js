/******************************************
* Confirm Request Modal View
*/
app.Views.ModalConfirmRequestView = app.Views.GenericModalView.extend({


	templateHTML : 'modals/modalConfirmRequest',


	// The DOM events //
	events: function(){
		return _.defaults({
			'submit #formConfirmRequest'     : 'confirmRequest'
		}, 
			app.Views.GenericModalView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize : function() {
		var self = this;

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
				lang    : app.lang,
				request : self.model
			});

			self.modal.html(template);

			self.modal.modal('show');
		});

		return this;
	},



	/** Confirm the request to the DST
	*/
	confirmRequest: function(e){
		e.preventDefault();

		var self = this;

		// Set the button in loading State //
		$(this.el).find("button[type=submit]").button('loading');

/*
		// Set the properties of the model //
		this.model.setRefusalReason(this.$('#motifRefuse').val(), true);

		this.model.save()
			.done(function(data) {
				self.modal.modal('hide');
				self.model.fetch({ data : {fields : self.model.fields} });
			})
			.fail(function (e) {
				console.log(e);
			})
			.always(function () {
				$(self.el).find("button[type=submit]").button('reset');
			});*/


		alert('TODO');
	},

});