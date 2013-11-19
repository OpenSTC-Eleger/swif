define([
	'app',
	'appHelpers',
	
	'interventionModel',
	'itemPlanningInterTaskView',
	'modalInterventionAddTaskView'

], function(app, AppHelpers, InterventionModel, ItemPlanningInterTaskView,  ModalInterventionAddTaskView){

	'use strict';

	/******************************************
	* Row Intervention Task List View
	*/
	var itemPlanningInterTaskListView = Backbone.View.extend({
	
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
		},
	
	
		/** When the model has updated //
		*/
		change: function(model){
			var self = this;
			//Update Inter model
			self.model.fetch();
			AppHelpers.highlight($(this.el));
		},
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
	
			// Retrieve the template // 
			$.get(app.moduleUrl+"/templates/" + this.templateHTML + ".html", function(templateData){
	
				
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
						var itemPlanningInterTaskView = new ItemPlanningInterTaskView({model: task});
						$(self.el).find('#row-nested-objects').append(itemPlanningInterTaskView.render().el);
						self.tasksCollection.off();
						self.listenTo(task, 'destroy', self.change);
						self.listenTo(task, 'change', self.change);
					});
					
				};
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
			return deferred;
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
				params = { state: InterventionModel.status.scheduled.key, };
			}
			else{
				params = { state: InterventionModel.status.open.key, };
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
			new ModalInterventionAddTaskView({el: '#modalAddTask', inter: self.model});		
		},
	
	});
	
				
	return itemPlanningInterTaskListView;

});