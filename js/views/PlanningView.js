/******************************************
* Login View
*/
openstm.Views.PlanningView = Backbone.View.extend({


    el : '#rowContainer',

    templateHTML: 'planning',

    
    // The DOM events //
    events: {

    },



    /** View Initialization
    */
    initialize : function(user) {
        console.log('Planning view');
        this.render();

    },



    /** Display the view
    */
    render : function() {
        var self = this;

        // Change the page title //
        openstm.router.setPageTitle(openstm.lang.viewsTitles.planning);

        // Retrieve the Login template // 
        $.get("templates/" + this.templateHTML + ".html", function(templateData){
         
            var template = _.template(templateData, {lang: openstm.lang});
            $(self.el).html(template);

        });
        return this;
    },



    /** Set a user model to the view
    */
    setModel : function(model) {
        this.model = model;
        return this;
    },


  
});

