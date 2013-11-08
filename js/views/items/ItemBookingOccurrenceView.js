/******************************************
* Row Intervention Task View
*/
app.Views.ItemBookingOccurrenceView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemBookingOccurrence',
	
//	className   : function(){
//		var elementClass = 'external-event';
//		
//		if(this.model.getState() != app.Models.Task.status.draft.key){
//			elementClass += ' disabled';
//		}
//
//		return elementClass;
//	},

	// The DOM events //
	events       : {		

		//'click a.modalDeleteBookingLine'   		: 'displayModalDeleteBookingLine',		
		//'click a.buttonCancelBookingLine'			: 'displayModalCancelBookingLine',

	},

	/** View Initialization
	*/
	initialize : function() {
		this.model.off();
		this.id = this.model.id;
		
		//this.listenTo(this.model, 'change', this.change);
		this.listenTo(this.model, 'destroy', this.destroyBookingLine);
	},
	
	destroyTask: function(model){	
		//remove model
		this.remove();		
		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.taskDeleteOk);	
	},

	/** When the model ara updated //
	*/
	change: function(model){
		var self = this;

		this.render();
		
		app.Helpers.Main.highlight($(this.el))

	},


	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			//var model = self.model.toJSON()
			var template = _.template(templateData, {
				lang                   : app.lang,
				interventionsState     : app.Models.Intervention.status,
				booking			: self.model,
			});

			$(self.el).html(template);

			// Set the Tooltip / Popover //$(self.el).html(template);
			$('*[data-toggle="tooltip"]').tooltip();
			$('*[rel="popover"]').popover({trigger: 'hover'});
			

			// Set the focus to the first input of the form //
//			$('#modalDeleteTask, #modalAddTask, #modalCancelTask').on('shown', function (e) {
//				$(this).find('input, textarea').first().focus();
//			})
			
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
		});
		return this;
	},


	
//	/** 
//	 * Display modal Add to delete task
//	*/
//	displayModalDeleteTask: function(e){
//		e.preventDefault();
//		var name = this.model.toJSON().name;
//		new app.Views.ModalDeleteView({el: '#modalDeleteTask', model: this.model, modalTitle: app.lang.viewsTitles.deleteTask, modalConfirm: app.lang.warningMessages.confirmDeleteTask});
//	},
//
//
//	
//	/**
//	 * Display modal Add to cancel task
//	 */
//	displayModalCancelTask: function(e) {
//		e.preventDefault();
//		new app.Views.ModalCancelTaskView({el: '#modalCancelTask', model: this.model});
//	},


});