/******************************************
* Place Modal View
*/
app.Views.ModalUnplanTaskView =  app.Views.GenericModalView.extend({


	templateHTML: 'modals/modalUnplanTask',

	modal : null,

	createMode : false,

	
	// The DOM events //
	events: function(){
		return _.defaults({
			'click #btnRemoveTask'      : 'removeTaskFromSchedule'
		}, 
			app.Views.GenericModalView.prototype.events
		);
	},


	/** View Initialization
	*/
	initialize : function() {
		var self = this;
		this.calendarModel = this.options.calendarModel;
		this.panelModel = this.options.panelModel;
		this.modal = $(this.el);
		this.render();


	},



	/** Display the view
	*/
	render : function(action) {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		 

			var template = _.template(templateData, {lang: app.lang});	
			

			self.modal.html(template);
			
			
	        // Reset the modal Buttons //
	        $('#btnRemoveTask').prop('disabled', false);
	       	$('#switchWithForeman').bootstrapSwitch('setActive', true);
	        
			
	       
	
			// Set informations in the modal //
			var taskInter = '';
			if(self.calendarModel.getInterventionId() != ''){ taskInter = "<i class='icon-pushpin'></i> " + self.calendarModel.getInterventionName() + " -"; }
			var tasksInfo = taskInter + " " + self.calendarModel.getName();
	
			// Display a label with the state of the task //
			
			tasksInfo += '<span class="label label-'+app.Models.Task.status[self.calendarModel.getState()].color+' pull-right">'+app.Models.Task.status[self.calendarModel.getState()].translation+'</span>';
	
	
			// Check if the task is set to an officer or a team //
			if(self.calendarModel.getTeamId() == false){ 
				var assignTo = "<br /> <i class='icon-user'></i> " + self.calendarModel.getUserName();
				$('#formModalAboutTask').hide();
			}
			else{
				var assignTo = "<br /><i class='icon-group'></i> " + self.calendarModel.getTeamName();
				$('#formModalAboutTask').show();
			}
	
			$('#infoModalAboutTask p').html(tasksInfo);
			$('#infoModalAboutTask small').html(self.calendarModel.getStartEndDateInformations() + assignTo);
	
			// Disable or not the button "Remove Of The Schedule" //
			if(self.calendarModel.getState() == app.Models.Task.status.done.key || self.calendarModel.getState() == app.Models.Task.status.cancelled.key){
	        	$('#btnRemoveTask').prop('disabled', true);
	        	$('#switchWithForeman').bootstrapSwitch('setActive', false);
			}
	
	
			// Set the ID of the Task in the DOM of the modal //
			$('#modalAboutTask').data('taskId', self.calendarModel.getId());
	
	
			// Display the Modal //
			//$("#modalAboutTask").modal('show');


			self.modal.modal('show');
		});

		return this;
	},



	/** Remove the Task from the Calendar
	*/
	removeTaskFromSchedule: function(e){

		var self = this;
		
		params = {
			state: app.Models.Task.status.draft.key,
			user_id: false,
			team_id: false,
			date_end: false,
			date_start: false,
		};

		this.calendarModel.save(params, {patch: true, silent: false})
			.done(function(data) {
				self.modal.modal('hide');
				if(!_.isUndefined(self.panelModel))
					self.panelModel.fetch({ data : {fields : self.panelModel.fields} });
				self.calendarModel.fetch({ data : {fields : self.calendarModel.fields} });
			})
			.fail(function (e) {
				console.log(e);
			})
		
	},




});