/******************************************
* Footer View
*/
openstm.Views.FooterView = Backbone.View.extend({

    el: '#footer-navbar',

    templateHTML: 'footer',

    data: {version: openstm.versionOpenSTM},

 
 
    /** View Initialization
    */
    initialize: function () {
        this.render();
    },

    

    /** Display the view
    */
    render: function () {
        var self = this;

       $.get("templates/" + this.templateHTML + ".html", function(templateData){
         
            // Templating // 
            var template = _.template(templateData, self.data);
            $(self.el).html(template);
        });
        return this;
    }


});
