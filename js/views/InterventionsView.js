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
    initialize : function(user) {
        console.log('Interventions view Initialize');
        this.render();

    },



    /** Display the view
    */
    render : function() {
        var self = this;

        // Change the page title //
        openstm.router.setPageTitle(openstm.lang.viewsTitles.interventions);

        // Retrieve the Login template // 
        $.get("templates/" + this.templateHTML + ".html", function(templateData){
         
            var template = _.template(templateData, {});
            $(self.el).html(template);
        });

        $(this.el).hide().fadeIn('slow');
        return this;
    },
  
});




