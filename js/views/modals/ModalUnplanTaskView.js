/******************************************
* Place Modal View
*/
app.Views.ModalUnplanTaskView =  Backbone.View.extend({


	templateHTML: 'modals/modalUnplanTask',

	modal : null,

	createMode : false,


	// The DOM events //
	events: function(){
		'click #btnRemoveTask'      : 'removeTaskFromSchedule'
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
	render : function(action) {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		 

			var template = _.template(templateData, {});	
			

			self.modal.html(template);

			
	        // Reset the modal Buttons //
	        $('#btnRemoveTask').prop('disabled', false);
	       	$('#switchWithForeman').bootstrapSwitch('setActive', true);
	        
			
	        // Retrieve the Task //
			var task = app.collections.tasks.get(self.options.fcEvent);
	
			// Set informations in the modal //
			var taskInter = '';
			if(task.getInterventionId() != ''){ taskInter = "<i class='icon-pushpin'></i> " + task.getInterventionName() + " -"; }
			var tasksInfo = taskInter + " " + task.getName();
	
			// Display a label with the state of the task //
			
			tasksInfo += '<span class="label label-'+app.Models.Task.status[task.getState()].color+' pull-right">'+app.Models.Task.status[task.getState()].translation+'</span>';
	
	
			// Check if the task is set to an officer or a team //
			if(task.getTeamId() == false){ 
				var assignTo = "<br /> <i class='icon-user'></i> " + task.getUserName();
				$('#formModalAboutTask').hide();
			}
			else{
				var assignTo = "<br /><i class='icon-group'></i> " + task.getTeamName();
				$('#formModalAboutTask').show();
			}
	
			$('#infoModalAboutTask p').html(tasksInfo);
			$('#infoModalAboutTask small').html(task.getStartEndDateInformations() + assignTo);
	
			// Disable or not the button "Remove Of The Schedule" //
			if(task.getState() == app.Models.Task.status.done.key || task.getState() == app.Models.Task.status.cancelled.key){
	        	$('#btnRemoveTask').prop('disabled', true);
	        	$('#switchWithForeman').bootstrapSwitch('setActive', false);
			}
	
	
			// Set the ID of the Task in the DOM of the modal //
			$('#modalAboutTask').data('taskId', task.getId());
	
	
			// Display the Modal //
			$("#modalAboutTask").modal('show');


			self.modal.modal('show');
		});

		return this;
	},



	/** Remove the Task from the Calendar
	*/
	removeTaskFromSchedule: function(e){

		// Retrieve the Id of the Task //
		var taskId = $('#modalAboutTask').data('taskId');

		// Retrieve the Task in the collection //
		var taskModel = app.collections.tasks.get(taskId)

		params = {
			state: app.Models.Task.status.draft.key,
			user_id: null,
			team_id: null,
			date_end: null,
			date_start: null,
		};

		// Display the Modal //
		$("#modalAboutTask").modal('hide');

		taskModel.save(taskId, params);
		
		// Refresh the page //
		app.router.navigate(app.routes.planning.url, {trigger: true, replace: true});
	},




});