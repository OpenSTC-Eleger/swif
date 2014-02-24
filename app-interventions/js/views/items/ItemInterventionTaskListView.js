/*! 
 * SWIF
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

define([
	'app',
	'appHelpers',


	'itemInterventionTaskView',
	'modalInterventionAddTaskView'

], function(app, AppHelpers, ItemInterventionTaskView, ModalInterventionAddTaskView){

	'use strict';


	/******************************************
	* Row Intervention Task List View
	*/
	var ItemInterventionTaskListView = Backbone.View.extend({

		tagName     : 'tr',

		templateHTML: '/templates/items/itemInterventionTaskList.html',


		// The DOM events //
		events       : {

			'change .taskEquipment'   : 'fillDropdownEquipment',
			'click .btn.addTask'      : 'displayModalAddTask',
		},




		/** View Initialization
		*/
		initialize : function(params) {

			this.options = params;

			this.options.tasks.off();
			this.listenTo(this.options.tasks, 'add', this.add);
			this.listenTo(this.options.tasks, 'remove', this.destroyTask);
			this.listenTo(this.options.inter,'change',this.changeInter);

		},



		add: function(model){
			var itemTaskView  = new ItemInterventionTaskView({ model: model, inter: this.options.inter, tasks:this.options.tasks});
			$(this.el).find('#row-nested-objects').append(itemTaskView.render().el);
			AppHelpers.highlight($(itemTaskView.el));
			this.partialRender();
			app.notify('', 'success', app.lang.infoMessages.information, model.getName()+' : '+app.lang.infoMessages.inteventionAddTaskOK);
			//@TOCHECK: repercute task creation to main tasks collection to be usable by other itemViews
			app.views.interventions.collections.tasks.add(model);
			app.views.interventions.partialRender();

			app.router.navigate(app.views.interventions.urlBuilder(), {trigger: false, replace: false});
		},

		changeInter: function(){
			this.partialRender();
		},

		destroyTask: function(){
			//check if there is tasks, if not, display message infos instead of table
			this.partialRender();
		},

		updateList: function(){
			if(this.options.tasks.length === 0){
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

		render : function() {
			var self = this;


			// Retrieve the template //
			$.get(app.menus.openstc + this.templateHTML, function(templateData){


				var template = _.template(templateData, {
					lang        : app.lang,
					intervention: self.options.inter.toJSON()
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
				_.each(self.options.tasks.models, function(task){
					self.options.tasks.listenTo(task, 'destroy', self.options.tasks.remove);
					var itemInterventionTaskView = new ItemInterventionTaskView({model: task, inter: self.options.inter, tasks: self.options.tasks});
					$(self.el).find('#row-nested-objects').append(itemInterventionTaskView.render().el);
				});

			});
			return this;
		},



		displayModalAddTask: function(e){
			e.preventDefault();
			var self = this;
			new ModalInterventionAddTaskView({el: '#modalAddTask', inter: self.options.inter, tasks: self.options.tasks});
		}

	});

	return ItemInterventionTaskListView;
});