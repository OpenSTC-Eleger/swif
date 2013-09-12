/******************************************
* Row Intervention Task List View
*/
app.Views.ItemPlanningInterTaskListView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemPlanningInterTaskList',

	// The DOM events //
	events       : {
		'switch-change .calendarSwitch'     : 'scheduledInter',		
		'click .btn.addTask'		        : 'displayModalAddTask',
	},
	
	/** View Initialization
	*/
	initialize : function() {
		this.options.tasks.off();
		this.listenTo(this.options.tasks, 'add', this.add);
		this.model = this.options.inter;
		this.listenTo(this.model, 'change', this.change);
	},


	/** When the model has updated //
	*/
	change: function(model){
		var self = this;

		this.render();
		
		app.Helpers.Main.highlight($(this.el))

		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.interventionUpdateOk);

		// Partial Render //
		//app.views.interventions.partialRender();
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
			
			$('#switch-'+self.options.inter.id).bootstrapSwitch();

			//<tr class="" id="collapse_<%= intervention.id %>">
			//$(self.el).addClass('row-nested-objects-collapse').addId('collapse_' + self.options.inter.toJSON().id);
			$(self.el).addClass('row-nested-objects-collapse').attr('id','collapse_' + self.options.inter.toJSON().id);
			
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });

			//Create item task for each one associated to inter
			_.each(self.options.inter.attributes.tasks, function(taskId, i){	
				var task = new app.Models.Task();
				task.setId(taskId);
				task.fetch().done(function(){
					var itemPlanningInterTaskView = new app.Views.ItemPlanningInterTaskView({model: task, inter: self.options.inter});
					$(self.el).find('#row-nested-objects').append(itemPlanningInterTaskView.render().el);
				});
			});
			
		});
		return this;
	},
	
	
	updateList: function(){
		if(this.options.tasks.length == 0){
			$(this.el).find('.noTask').css({display:'block'});
			$(this.el).find('.table-nested-objects').css({display: 'none'});
		}
		else{
			$(this.el).find('.noTask').css({display: 'none'});
			$(this.el).find('.table-nested-objects').css({display: 'table'});
		}
	},
	
	/** Display the view
	*/
	
	partialRender: function(){
		this.updateList();
		if(this.options.inter.toJSON().actions.indexOf('add_task') == -1){
			$('button.addTask').attr('disabled','disabled');
		}
	},

	add: function(model){
		var itemPlanningInterTaskView  = new app.Views.ItemPlanningInterTaskView({ model: model, inter: this.options.inter, tasks:this.options.tasks});
		$(this.el).find('#row-nested-objects').append(itemPlanningInterTaskView.render().el);		
		itemPlanningInterTaskView.highlight();
		this.partialRender();
		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.inteventionAddTaskOK);
		//@TOCHECK: repercute task creation to main tasks collection to be usable by other itemViews
		app.views.planningInterListView.collections.tasks.add(model);
		
		app.views.planningInterListView.partialRender();

		//app.router.navigate(app.views.planningInterListView.urlBuilder(), {trigger: false, replace: false});
	
	},	
		
	scheduledInter: function(e) {
		var self = this;
		
		var intervention = $(e.target);
		var id = _(intervention.parents('.accordion-body').attr('id')).strRightBack('_');

		// Retrieve the new status //
		if(intervention.bootstrapSwitch('status')){
			params = { state: app.Models.Intervention.status.scheduled.key, };
		}
		else{
			params = { state: app.Models.Intervention.status.open.key, };
		}

		this.model.save(params,{patch:true, wait: true}).done(function(data){
			//self.model.fetch();
		})
		.fail(function(e){
			console.log(e);
		});
	},
	
	displayModalAddTask: function(e){
		e.preventDefault();
		var self = this;
		new app.Views.ModalInterventionAddTaskView({el: '#modalAddTask', inter: self.options.inter, tasks: self.options.tasks});
		
	},


});