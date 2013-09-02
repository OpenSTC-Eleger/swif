/******************************************
* Row Intervention Task View
*/
app.Views.ItemPlanningInterTaskView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemPlanningInterTask',
	
	className   : 'row-nested-objects',

	// The DOM events //
	events       : {
		'click .btn.addTask'                : 'displayModalAddTask',
		'submit #formAddTask'         		: 'saveTask',

		'click a.modalDeleteTask'   		: 'displayModalDeleteTask',
		'click button.btnDeleteTask'   		: 'deleteTask',
		
		'click a.buttonCancelTask'			: 'displayModalCancelTask',
		'submit #formCancelTask' 			: 'cancelTask',

		'click a.printTask'					: 'print',

		'click .buttonTaskDone, .buttonNotFinish' : 'displayModalTaskDone',
		'submit #formTaskDone'   			: 'taskDone',
		'click a.linkSelectUsersTeams'		: 'changeSelectListUsersTeams',
		'click .linkRefueling'				: 'accordionRefuelingInputs',

	},



	/** View Initialization
	*/
	initialize : function() {
		this.model.off();
//		if(!_.isUndefined(this.options.templateHTML))
//			this.templateHTML = this.options.templateHTML;

		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);
	},



	/** When the model ara updated //
	*/
	change: function(model){
		var self = this;

		this.render();

		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+infoMessage);

		// Partial Render //
		//app.views.interventions.partialRender();
	},



	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var model = self.model.toJSON()
			var template = _.template(templateData, {
				lang                   : app.lang,
				interventionsState     : app.Models.Intervention.status,
				task					: model,
			});

			$(self.el).html(template);

			// Set the Tooltip / Popover //$(self.el).html(template);
			$('*[data-toggle="tooltip"]').tooltip();
			$('*[rel="popover"]').popover({trigger: 'hover'});
			
			//Ask update modals
			$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
			$(".datepicker").datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr' });
			$('#equipmentsDone, #equipmentsListDone').sortable({
				connectWith: 'ul.sortableEquipmentsList',
				dropOnEmpty: true,
				forcePlaceholderSize: true,
				forceHelperSize: true,
				placeholder: 'sortablePlaceHold',
				containment: '.equipmentsDroppableAreaDone',
				cursor: 'move',
				opacity: '.8',
				revert: 300,
				receive: function(event, ui){
					//self.saveServicesCategories();
				}

			});
			// Set the focus to the first input of the form //
			$('#modalDeleteTask, #modalAddTask, #modalCancelTask').on('shown', function (e) {
				$(this).find('input, textarea').first().focus();
			})
			
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
			
			el = $('li#task_'+model.id+':not(.disabled)');

				var eventObject = {
					state: model.state,
					id: model.id,
					title: model.name,
					project_id: model.project_id[0],
					//user_id: model.user_id[0],
					planned_hours: model.planned_hours,
					total_hours: model.total_hours,
					effective_hours: model.effective_hours,
					remaining_hours: model.remaining_hours,
					//allDay: true,
				};
				
				// Store the Event Object in the DOM element so we can get to it later //
				el.data('eventObject', eventObject);
				
				// Make the event draggable using jQuery UI //
				el.draggable({
					zIndex: 9999,
					revert: true,
					revertDuration: 500,
					appendTo: '#app',
					opacity: 0.8,
					scroll: false,
					cursorAt: { top: 0, left: 0 },
					helper: function(e){
						return $("<p class='well well-small'>"+eventObject.title+"</p>");
					},
					reverting: function() {
						console.log('reverted');
					},


				});

		});
		return this;
	},


});