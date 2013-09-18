/******************************************
* Place Modal View
*/
app.Views.ModalUnplanTaskView =  app.Views.GenericModalView.extend({


	templateHTML: 'modals/modalUnplanTask',


	
	// The DOM events //
	events: function(){
		return _.defaults({
			'click #btnRemoveTask'     : 'removeTaskFromSchedule'
		}, 
			app.Views.GenericModalView.prototype.events
		);
	},


	/** View Initialization
	*/
	initialize : function() {
		var self = this;

		this.modal = $(this.el);

		// Intervention Model in the Left column //
		this.interModel = this.options.interModel;

		this.render();
	},



	/** Display the view
	*/
	render : function(action) {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		 

			var template = _.template(templateData, {
				lang : app.lang,
				task : self.model
			});
			
			self.modal.html(template);
			self.modal.modal('show');
		});

		return this;
	},



	/** Remove the Task from the Calendar
	*/
	removeTaskFromSchedule: function(e){

		var self = this;

		// Set the button in loading State //
		$(e.target).button('loading');
		
		params = {
			state     : app.Models.Task.status.draft.key,
			user_id   : false,
			team_id   : false,
			date_end  : false,
			date_start: false,
		};

		this.model.save(params, {patch: true, silent: false})
			.done(function(data) {				
				$.when(  self.model.fetch({ data : {fields : self.model.fields} }) )
				.done(function(e){
					self.modal.modal('hide');
				})
				.fail(function(e){
					console.error(e);
				});
				
			})
			.always(function(){
				// Reset the button state //
				$(e.target).button('reset');
			})
	}


});