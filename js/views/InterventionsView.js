/******************************************
* Interventions View
*/
app.Views.InterventionsView = Backbone.View.extend({

    el : '#rowContainer',

    templateHTML: 'interventions',
    
    
    selectedInter : '',
    selectedTask : '',

    
    // The DOM events //
    events: {
        'click .btn.addTask'                : 'displayFormAddTask',
        'click button.saveTask'             : 'saveTask',
        'click a.accordion-intervention'    : 'tableAccordion'
    },



    /** View Initialization
    */
    initialize : function() {
        console.log('Interventions view Initialize');
        
        
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
        var interventionsValidated = _.filter(interventions, function(item){ 
        	return (item.attributes.progress_rate <= 99) 
        			/*&&
        			item.attributes.state != app.Models.Intervention.state[0].value &&
        			item.attributes.state != app.Models.Intervention.state[1].value); */
        });
        var nbInterventions = _.size(interventionsValidated);
        
        interventionsValidated = _.sortBy(interventionsValidated, function(item){ 
        	 return item.attributes.date_start; 
        });


        // Retrieve the HTML template // 
        $.get("templates/" + this.templateHTML + ".html", function(templateData){
                var template = _.template(templateData, {
                    lang: app.lang,
                    nbInterventions: nbInterventions,
                    interventionsState: app.Models.Intervention.state,
                    interventions: (new app.Collections.Interventions(interventionsValidated)).toJSON(),
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
    




    /** Fonction collapse table row
    */
    tableAccordion: function(e){

        e.preventDefault();
        
        // Retrieve the intervention ID //
        var id = _($(e.target).attr('href')).strRightBack('_');


        var isExpend = $('#collapse_'+id).hasClass('expend');

        // Reset the default visibility //
        $('tr.expend').css({ display: 'none' }).removeClass('expend');
        $('tr.row-intervention').css({ opacity: '0.5'});
        $('tr.row-intervention > td').css({ backgroundColor: '#FFF'});
        
        // If the table row isn't already expend //       
        if(!isExpend){
            // Set the new visibility to the selected intervention //
            $('#collapse_'+id).css({ display: 'table-row' }).addClass('expend');
            $(e.target).parents('tr.row-intervention').css({ opacity: '1'});
            $(e.target).parents('tr.row-intervention').children('td').css({ backgroundColor: '#F5F5F5'});
        }
        else{
            $('tr.row-intervention').css({ opacity: '1'});
            $('tr.row-intervention > td').css({ backgroundColor: '#FFF'});
            $('tr.row-intervention:nth-child(4n+1) > td').css({ backgroundColor: '#F9F9F9'});
        }
           
    },



    /** Display the form to add a new Task
    */
    displayFormAddTask: function(e){
        
        // Retrieve the ID of the intervention //
        this.pos = e.currentTarget.id;
        $('#modalAddTask').modal();
   },


    /** Save the Task
    */
    saveTask: function(e){
    	 var self = this;

		e.preventDefault();
		
		 
		 input_category_id = null;
	     if( app.views.selectListAssignementsView != null )
	    	 input_category_id = app.views.selectListAssignementsView.getSelected().toJSON().id;

	     var params = {
	         project_id: this.pos,
	         name: this.$('#taskName').val(),
	         category_id: input_category_id,	         
		     planned_hours: this.$('#taskHour').val(),
	     };
	     //TODO : test
	     app.models.task.save(0,params,$('#modalAddTask'), null, "interventions");
   }
  
});




