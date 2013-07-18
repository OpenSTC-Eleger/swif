/******************************************
* About View
*/
app.Views.AboutView = Backbone.View.extend({

    el : '#rowContainer',

    templateHTML: 'about',

    
    // The DOM events //
    events: {
       
    },



    /** View Initialization
    */
    initialize : function(user) {
        //this.render();
   },



    /** Display the view
    */
    render : function() {
        var self = this;

        // Change the page title //
        app.router.setPageTitle(app.lang.viewsTitles.about);

        // Change the active menu item //
        app.views.headerView.selectMenuItem('');

        // Change the Grid Mode of the view //
        app.views.headerView.switchGridMode('default');

        
        // Retrieve the Login template // 
        $.get("templates/" + this.templateHTML + ".html", function(templateData){
         
            var template = _.template(templateData, {lang: app.lang, version: app.versionOpenSTM});
            $(self.el).html(template);
        });

		$(this.el).hide().fadeIn('slow');
        return this;


    }





  
});




