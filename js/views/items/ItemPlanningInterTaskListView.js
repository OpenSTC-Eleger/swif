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
		//this.model.off();
		this.listenTo(this.model, 'change', this.change);
		//this.listenTo(this.model, 'add', this.change);
	},


	/** When the model has updated //
	*/
	change: function(model){
		var self = this;
		//Update model and his tasks
		$.when( self.fetchData(), self.model.fetch({ data : {fields : self.model.fields} }) )
		.done(function(e){
			self.render();	
		})
		app.Helpers.Main.highlight($(this.el))
		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.interventionUpdateOk);
	},

	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			
			var template = _.template(templateData, {
				lang                   	: app.lang,
				intervention			: self.model.toJSON(),
			});

			$(self.el).html(template);
			
			$('#switch-'+self.model.id).bootstrapSwitch();

			$(self.el).addClass('row-nested-objects-collapse').attr('id','collapse_' + self.model.toJSON().id);
			
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });

			// Render tasks
			if (!_.isUndefined(self.tasksCollection)) {
				$('#row-nested-objects').empty();
				_.each(self.tasksCollection.models, function (task) {
					var itemPlanningInterTaskView = new app.Views.ItemPlanningInterTaskView({model: task});
					$(self.el).find('#row-nested-objects').append(itemPlanningInterTaskView.render().el);
					self.listenTo(task, 'destroy', self.change);
					self.listenTo(task, 'change', self.change);
				});
				
			};
			
			if(self.model.toJSON().actions.indexOf('add_task') == -1){
				$('button.addTask').attr('disabled','disabled');
			}
			
		});
		return this;
	},

	/**
	 * Fetch tasks
	 */
	fetchData: function () {
		var self = this;
		var deferred = $.Deferred();
		self.tasksCollection = new app.Collections.Tasks();
		if( self.model.get('tasks')!= false ) {
			self.tasksCollection.fetch({silent: true,data: {filters: {0: {'field': 'id', 'operator': 'in', 'value': self.model.get('tasks')}}}}).done(function(){				
				deferred.resolve();
			});
		}
		return deferred
	},
		
	/**
	 * To Plan/unplanned Intervention
	 */
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
	
	/**
	 * Display modal Add task
	 */
	displayModalAddTask: function(e){
		e.preventDefault();
		var self = this;
		new app.Views.ModalInterventionAddTaskView({el: '#modalAddTask', inter: self.model});		
	},

});