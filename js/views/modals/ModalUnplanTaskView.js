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
		
		//Cancel absent task (no intervention)
		if(( app.Models.Task.status[this.model.toJSON().state].key == 
				app.Models.Task.status.absent.key ) ) 
		{
				this.model.destroy({wait: true})
				.done(function(data){				
					self.modal.modal('hide');
				})
				.fail(function(){
					console.error(e);
				})
				.always(function(){
					// Reset the button state //
					$(e.target).button('reset');
				})			
		}
		//Template task unplanned
		else if(	!_.isNull(this.interModel) && 
				( app.Models.Intervention.status[this.interModel.toJSON().state].key == 
				app.Models.Intervention.status.template.key ) )
		{
			//remove template task
			this.model.destroy({wait: true})
				.done(function(data){
					//re-fetch intervention
					$.when(  self.interModel.fetch() )
						.done(function(e){
							self.modal.modal('hide');
						})
				})
				.fail(function(){
					console.error(e);
				})
				.always(function(){
					// Reset the button state //
					$(e.target).button('reset');
				})
		} 
		//others tasks to unplanned
		else 
		{
			//Set Task fields 
			params = {
				state     : app.Models.Task.status.draft.key,
				user_id   : false,
				team_id   : false,
				date_end  : false,
				date_start: false,
			};
			//Update task
			this.model.save(params, {patch: true, silent: false})
				.done(function(data) {				
					$.when(  self.model.fetch({ data : {fields : self.model.fields} } ), self.interModel.fetch() )
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
	}


});