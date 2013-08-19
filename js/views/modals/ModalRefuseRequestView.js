/******************************************
* Refuse Request Modal View
*/
app.Views.ModalRefuseRequestView = app.Views.GenericModalView.extend({


	templateHTML : 'modals/modalRefuseRequest',


	// The DOM events //
	events: function(){
		return _.defaults({
			'submit #formRefuseRequest'     : 'refuseRequest'
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



	/** Delete the model pass in the view
	*/
	refuseRequest: function(e){
		e.preventDefault();

		var self = this;

		// Set the button in loading State //
		$(this.el).find("button[type=submit]").button('loading');


		var params = {
			refusal_reason : $('#motifRefuse').val(),
			state          : app.Models.Request.status.refused.key
		}


		// Save Only the params //
		this.model.save(params, {patch: true, silent: true})
			.done(function(data) {
				self.modal.modal('hide');
				self.model.fetch({ data : {fields : self.model.fields} });
			})
			.fail(function (e) {
				console.log(e);
			})
			.always(function () {
				$(self.el).find("button[type=submit]").button('reset');
			});
	}

});