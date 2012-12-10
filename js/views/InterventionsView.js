/******************************************
* Interventions View
*/
app.Views.InterventionsView = Backbone.View.extend({

    el : '#rowContainer',

    templateHTML: 'interventions',

    
    // The DOM events //
    events: {
        'click .btn.addTask'    : 'displayFormAddTask',
        'click button.saveTask'       : 'saveTask'
    },



    /** View Initialization
    */
    initialize : function() {
        console.log('Interventions view Initialize');
        this.render();
    },



    /** Display the view
    */
    render : function() {
        var self = this;

        // Change the page title //
        app.router.setPageTitle(app.lang.viewsTitles.interventions);

        // Change the active menu item //
        app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('fluid');


        var interventions = app.collections.interventions.models;

        // Retrieve the number of validated Interventions //
        var interventionsValidated = _.filter(interventions, function(item){ return item.attributes.progress_rate <= 99; });
        var nbInterventions = _.size(interventionsValidated);


        // Retrieve the HTML template // 
        $.get("templates/" + this.templateHTML + ".html", function(templateData){
                var template = _.template(templateData, {
                    lang: app.lang,
                    nbInterventions: nbInterventions,
                    interventions: interventionsValidated
                });

            console.debug(interventionsValidated);
        
            $(self.el).html(template);
			
			app.views.selectListAssignementsView = new app.Views.DropdownSelectListView({el: $("#taskCategory"), collection: app.collections.categories})
			app.views.selectListAssignementsView.clearAll();
			app.views.selectListAssignementsView.addEmptyFirst();
			app.views.selectListAssignementsView.addAll();

            $('*[rel="tooltip"]').tooltip({placement: "right"});

        });

        $(this.el).hide().fadeIn('slow');
        return this;
    },


    /** Display the form to add a new Task
    */
    displayFormAddTask: function(e){
        
        // Retrieve the ID of the intervention //
        this.pos = $(e.target).parents('tr').attr('id');
        $('#modalAddTask').modal();
   },


    /** Save the Task
    */
    saveTask: function(e){
    	
		e.preventDefault();
		
		 var task = new app.Models.Task();
		 input_category_id = null;
	     if( app.views.selectListAssignementsView != null )
	    	 input_category_id = app.views.selectListAssignementsView.getSelected().toJSON().id;

	     var params = {
	         project_id: this.pos,
	         name: this.$('#taskName').val(),
	         category_id: input_category_id,	         
		     planned_hours: this.$('#taskHour').val(),
	     };

	    task.save(params,{
			success: function (data) {
				console.log(data);
				if(data.error){
					app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
				}
				else{
					$('#modalAddTask').modal('hide');
					app.router.navigate('#interventions' , true);
					console.log('Success SAVE TASK');
				}
			},
			error: function () {
				console.log('ERROR - Unable to save the Request - RequestDetailsView.js');
			},	     
		});
   }
  
});




