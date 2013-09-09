/******************************************
* Absent Type Modal View
*/
app.Views.ModalAbsentTaskView = app.Views.GenericModalView.extend({


	templateHTML : 'modals/tasks/modalAbsentTask',



	// The DOM events //
	events: function(){
		return _.defaults({
			'submit #formSaveAbsentTask'  : 'saveAbsentTask'
		}, 
			app.Views.GenericModalView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize : function() {

		this.modal = $(this.el);

		// Check if it's a create or an update //
		if(_.isUndefined(this.model)){
			this.model = new app.Models.Task();
		}

		this.render();
	},



	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang      : app.lang,
				task 	  : self.model
			});

			self.modal.html(template);

			self.modal.modal('show');
		});

		return this;
	},



	/** Delete the model pass in the view
	*/
	saveAbsentTask: function(e){
		e.preventDefault();

		var self = this;

		// Set the button in loading State //
		$(this.el).find("button[type=submit]").button('loading');


		var params = {
			name       : this.$('#absentTaskName').val(),
			code       : this.$('#absentTaskCode').val(),
			description: this.$('#absentTaskDescription').val()
		}

		this.model.save(params)
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
	},

});