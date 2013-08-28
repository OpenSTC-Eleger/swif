/******************************************
* Row Intervention Task List View
*/
app.Views.ItemPlanningInterTaskListView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemPlanningInterTaskList',

	// The DOM events //
	events       : {
		'click .btn.addTask'		              : 'displayModalAddTask',
		'submit #formAddTask'                     : 'saveTask', 
	},



	/** View Initialization
	*/
	initialize : function() {
//		this.model.off();
//
//		// When the model are updated //
//		this.listenTo(this.model, 'change', this.change);
	},



	/** When the model ara updated //
	*/
	change: function(model){
		var self = this;

		this.render();

		// Highlight the Row and recalculate the className //
		this.highlight().done(function(){
//			self.$el.attr('class', _.result(self, 'className'));
		});

		//app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+infoMessage);

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
			//<tr class="" id="collapse_<%= intervention.id %>">
			//$(self.el).addClass('row-nested-objects-collapse').addId('collapse_' + self.options.inter.toJSON().id);
			$(self.el).addClass('row-nested-objects-collapse').attr('id','collapse_' + self.options.inter.toJSON().id);
			
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });

			//Create item task for each one associated to inter
			_.each(self.options.tasks, function(task, i){
				//var itemInterventionTaskView = new app.Views.ItemInterventionTaskView({model: task, templateHTML:"items/itemPlanningTask"});
				var itemPlanningInterTaskView = new app.Views.ItemPlanningInterTaskView({model: task});
				$(self.el).find('#row-nested-objects').append(itemPlanningInterTaskView.render().el);
			});
			
		});
		return this;
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
	},
	
	displayModalAddTask: function(e){
		e.preventDefault();
		var self = this;
		new app.Views.ModalInterventionAddTaskView({el: '#modalAddTask', inter: self.options.inter, tasks: self.options.tasks});
		
	},


});