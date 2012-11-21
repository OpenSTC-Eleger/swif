/******************************************
* Interventions View
*/
openstm.Views.InterventionsView = Backbone.View.extend({

    el : '#rowContainer',

    templateHTML: 'interventions',

    
    // The DOM events //
    events: {

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
        openstm.router.setPageTitle(openstm.lang.viewsTitles.interventions);

        // Change the active menu item //
        openstm.views.headerView.selectMenuItem(openstm.router.mainMenus.manageInterventions);

        // Change the Grid Mode of the view //
        openstm.views.headerView.switchGridMode('fluid');


        var interventions = openstm.collections.interventions.models;

        // Retrieve the number of validated Interventions //
        var interventionsValidated = _.filter(interventions, function(item){ return item.attributes.state == openstm.Models.Request.state[3].value; });
        var nbInterventions = _.size(interventionsValidated);


        // Retrieve the HTML template // 
        $.get("templates/" + this.templateHTML + ".html", function(templateData){
         
                var template = _.template(templateData, {
                    lang: openstm.lang,
                    nbInterventions: nbInterventions,
                    interventions: interventionsValidated
                });

            console.debug(interventions);
        
            $(self.el).html(template);

            $('*[rel="tooltip"]').tooltip({placement: "right"});

        });

        $(this.el).hide().fadeIn('slow');
        return this;
    },
  
});




