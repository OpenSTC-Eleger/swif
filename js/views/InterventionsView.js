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
        var interventionsValidated = _.filter(interventions, function(item){ return item.attributes.state == app.Models.Request.state[3].value; });
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

            $('*[rel="tooltip"]').tooltip({placement: "right"});

        });

        $(this.el).hide().fadeIn('slow');
        return this;
    },


    /** Display the form to add a new Task
    */
    displayFormAddTask: function(e){
        
        // Retrieve the ID of the intervention //
        var idIntervention = $(e.target).parents('tr').attr('id');
        $('#modalAddTask').modal();
   },


    /** Save the Task
    */
    saveTask: function(e){

        // Retrieve the ID of the intervention //
        alert('todo');
   }


  
});




