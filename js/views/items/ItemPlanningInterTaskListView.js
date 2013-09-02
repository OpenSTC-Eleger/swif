/******************************************
* Row Intervention Task List View
*/
app.Views.ItemPlanningInterTaskListView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemPlanningInterTaskList',

	// The DOM events //
	events       : {
		'click .btn.addTask'		              : 'displayModalAddTask',
	},
	
	/** View Initialization
	*/
	initialize : function() {
		this.options.tasks.off();
		this.listenTo(this.options.tasks, 'add', this.add);
	},




	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

		 
			var template = _.template(templateData, {
				lang                   : app.lang,
				intervention			: self.options.inter.toJSON(),
			});

			$(self.el).html(template);
			//<tr class="" id="collapse_<%= intervention.id %>">
			//$(self.el).addClass('row-nested-objects-collapse').addId('collapse_' + self.options.inter.toJSON().id);
			$(self.el).addClass('row-nested-objects-collapse').attr('id','collapse_' + self.options.inter.toJSON().id);
			
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });

			//Create item task for each one associated to inter
			_.each(self.options.tasks.models, function(task, i){
				//var itemInterventionTaskView = new app.Views.ItemInterventionTaskView({model: task, templateHTML:"items/itemPlanningTask"});
				var itemPlanningInterTaskView = new app.Views.ItemPlanningInterTaskView({model: task});
				$(self.el).find('#row-nested-objects').append(itemPlanningInterTaskView.render().el);
			});
			
		});
		return this;
	},

	add: function(model){
		var itemPlanningInterTaskView  = new app.Views.ItemPlanningInterTaskView({ model: model, inter: this.options.inter, tasks:this.options.tasks});
		$(this.el).find('#row-nested-objects').append(itemPlanningInterTaskView.render().el);		
		//this.partialRender();
		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.inteventionAddTaskOK);
		//@TOCHECK: repercute task creation to main tasks collection to be usable by other itemViews
		app.view.planningInterListView.collections.tasks.add(model);
	
	},
	
	displayModalAddTask: function(e){
		e.preventDefault();
		var self = this;
		new app.Views.ModalInterventionAddTaskView({el: '#modalAddTask', inter: self.options.inter, tasks: self.options.tasks});
		
	},


});