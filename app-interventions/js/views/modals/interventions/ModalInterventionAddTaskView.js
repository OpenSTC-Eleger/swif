/******************************************
 * Intervention Details View
 */
app.Views.ModalInterventionAddTaskView = app.Views.GenericModalView.extend({

	//el : '#rowContainer',
	
	templateHTML: 'modals/interventions/modalInterventionAddTask',

	
	// The DOM events //
	events: function() {
		return _.defaults({
		'submit #formAddTask'          : 'saveTask',
		},
		app.Views.GenericModalView.prototype.events);
		
	},



	/** View Initialization
	 */
	initialize: function (params) {
	    var self = this;
	    
	    this.options = params;

	    this.modal = $(this.el);
		this.model = new app.Models.Task();
    	self.render();    
    },


    /** Display the view
     */
    render: function () {
		
		
		//self.collection = this.collection;
		var self = this;
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			
			var template = _.template(templateData, {lang: app.lang});
			
			self.modal.html(template);
			self.modal.modal('show');
		
			$('.timepicker-default').timepicker({ showMeridian: false, disableFocus: true, showInputs: false, modalBackdrop: false});
			
			// Display only categories in dropdown belongs to intervention //
			var interJSON = self.options.inter.toJSON();
			app.views.advancedSelectBoxCategoriesInterventionAddTaskView = new app.Views.AdvancedSelectBoxView({el: $("#taskCategory"), collection: app.Collections.CategoriesTasks.prototype}) 
			if(interJSON.service_id.length > 0){
				app.views.advancedSelectBoxCategoriesInterventionAddTaskView.setSearchParam({field:'service_ids.id',operator:'=','value':interJSON.service_id[0]}, true);
			}

			app.views.advancedSelectBoxCategoriesInterventionAddTaskView.render();
		});
 
		return this;
    },



    getIdInDopDown: function(view) {
    	if ( view && view.getSelected() )
    		return view.getSelected().toJSON().id;
    	else 
    		return 0
    },


	
	/** Save the Task
	*/
	saveTask: function(e){
		var self = this;

		e.preventDefault();

		 var duration = $("#taskHour").val().split(":");
		 var mDuration = moment.duration ( { hours:duration[0], minutes:duration[1] });

		 var params = {
			 project_id: this.options.inter.toJSON().id,
			 //equipment_id: input_equipment_id,
			 name: this.$('#taskName').val(),
			 category_id: app.views.advancedSelectBoxCategoriesInterventionAddTaskView.getSelectedItem(),
			 planned_hours: mDuration.asHours(),
		 };

		 
		 this.model.save(params, {silent: true}).done(function(data){
			 self.model.setId(data);
			 self.model.fetch().done(function(){
				 if(!_.isUndefined(self.options.tasks)){
					 self.options.tasks.add(self.model);
				 }
			 });
			 //force re-calculation asynchronously of intervention to update functional fields (planned_hours for example)
			 self.options.inter.fetch();
			$('#modalAddTask').modal('hide');
		 })
		 .fail(function(e){
			 console.log(e);
		 });
	},
});

