/******************************************
* Row Intervention Task List View
*/
app.Views.ItemInterventionTaskListView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemInterventionTaskList',
	
//	className   : function(){
//
//		var classRow = '';
//
//		if(this.model.getState() == app.Models.Request.status.wait.key && app.models.user.isManager() && _.contains(app.models.user.getServices(), this.model.getService('id'))) {
//			classRow = app.Models.Request.status.wait.color + ' bolder';
//		}
//		else if(this.model.getState() == app.Models.Request.status.confirm.key && app.models.user.isDST()){
//			classRow = app.Models.Request.status.confirm.color + ' bolder';
//		}
//
//		return classRow;
//	},

	// The DOM events //
	events       : {
		
		'change .taskEquipment'				: 'fillDropdownEquipment',
		'click .btn.addTask'                : 'displayModalAddTask',
	},



	
	/** View Initialization
	*/
	initialize : function() {
		this.options.tasks.off();
		this.listenTo(this.options.tasks, 'add', this.add);
	},



	add: function(model){
		var itemTaskView  = new app.Views.ItemInterventionTaskView({ model: model, inter: this.options.inter});
		$(this.el).find('#row-nested-objects').append(itemTaskView.render().el);
		itemTaskView.highlight();
		this.updateList();
		app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.inteventionAddTaskOK);
		//@TOCHECK: repercute task creation to main tasks collection to be usable by other itemViews
		app.views.interventions.collections.tasks.add(model);
		app.views.interventions.partialRender();

		app.router.navigate(app.views.interventions.urlBuilder(), {trigger: false, replace: false});
	},
	
	destroyTask: function(model){
		//check if there is tasks, if not, display message infos instead of table
		this.updateList();
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

			//check if there is tasks, if not, display message infos instead of table
			self.updateList();
			
			//Create item task for each one associated to inter
			_.each(self.options.tasks.models, function(task, i){
				self.options.tasks.listenTo(task, 'destroy', this.destroyTask);
				var itemInterventionTaskView = new app.Views.ItemInterventionTaskView({model: task, inter: self.options.inter});
				$(self.el).find('#row-nested-objects').append(itemInterventionTaskView.render().el);
			});
			
		});
		return this;
	},
	
	displayModalAddTask: function(e){
		e.preventDefault();
		var self = this;
		new app.Views.ModalInterventionAddTaskView({el: '#modalAddTask', inter: self.options.inter, tasks: self.options.tasks});
		
	},

	/** Highlight the row item
	*/
	highlight: function(){
		var self = this;

		$(this.el).addClass('highlight');

		var deferred = $.Deferred();

		// Once the CSS3 animation are end the class are removed //
		$(this.el).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
			function(e) {
				$(self.el).removeClass('highlight');
				deferred.resolve();
		});

		return deferred;
	}


});