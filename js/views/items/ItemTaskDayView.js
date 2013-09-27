/******************************************
* Row Intervention View
*/
app.Views.ItemTaskDayView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemTaskDay',

	// The DOM events //
	events       : {
		
		'click a.taskNotDone' 			: 'taskNotDone',
		'click .buttonTaskDayTimeSpent'		: 'setModalTimeSpent',
		'click .buttonTaskDayDone'			: 'setModalTaskDone',
		'click .updateTask' 				: 'displayModalUpdateTask',
	},



	/** View Initialization
	*/
	initialize : function() {

		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);
	},
	
	//Update the model in the collection, it's not expected that this model is new in the collection and must no trigger 'add' event
	change: function(model){
		this.render();
		app.Helpers.Main.highlight($(this.el));
		this.options.tasks.add(model,{merge:true});
	},
	
	/** Display the view
	*/
	render : function() {
		var self = this;

		var date_start = moment.utc(this.model.toJSON().date_start).tz(app.models.user.getContext().tz);
		var date_end = moment.utc(this.model.toJSON().date_end).tz(app.models.user.getContext().tz);
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

		 
			var template = _.template(templateData, {
				lang                   : app.lang,
				task					: self.model.toJSON(),
				date_start				: date_start,
				date_end				: date_end
			});
			$(self.el).attr('id', self.model.toJSON().id);
			$(self.el).html(template);

			
		});
		//$(this.el).hide().fadeIn('slow'); 
		return this;
	},

	/** Save Task as not beginning
	*/
    taskNotDone: function(e) {
    	var self = this;
		e.preventDefault();
		var taskParams = {
			state: app.Models.Task.status.draft.key,
			user_id: null,
			team_id:null,
			date_end: null,
			date_start: null,
		};
		
			//app.models.task.save(this.model.id, taskParams);
		this.model.save(taskParams, {patch: true, wait: true, silent: true})
		.done(function(){
			app.Helpers.Main.highlight($(self.el)).done(function(){
				self.remove();
			});
			self.options.tasks.remove(self.model);
			
		})
		.fail(function(e){
			console.log(e)
		});
	},
	
	setModalTimeSpent: function(e){
		e.preventDefault();
		new app.Views.ModalTaskDayDoneView({el:'#modalTaskDone', model: this.model, taskDone: false, tasks: this.options.tasks});
	},
	
	setModalTaskDone: function(e){
		e.preventDefault();
		new app.Views.ModalTaskDayDoneView({el:'#modalTaskDone', model: this.model, taskDone: true, tasks: this.options.tasks});
	},
	
	displayModalUpdateTask: function(e){
		e.preventDefault();
		new app.Views.ModalAddTaskView({el:'#modalAddTask', model:this.model});
	},

});