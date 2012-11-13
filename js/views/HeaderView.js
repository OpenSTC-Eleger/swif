/******************************************
* Header View
*/
openstm.Views.HeaderView = Backbone.View.extend({

    el: '#header-navbar',

    templateHTML: 'header',



    /** View Initialization
    */
    initialize: function () {
        this.render();
    },

    

    /** Display the view
    */
    render: function (activeMenu) {
        var self = this;

        // If the user is connect, retrieve his menu from OpenERP //
        if(openstm.models.user.hasSessionID()) {
            
            console.log("Retrieve menu");
            openstm.models.user.getMenus({
                error: function (){
                    console.log('ERROR: Unable to retrieve menu');
                },
                success: function (data) {
                    console.debug(data.result.data.children);
	                self.initHeader(data.result.data.children, activeMenu);
                }
            });
        }
        else{
            this.initHeader('', '');
        }

        console.log('---> Header Render');
        return this;
    },



    /** Retrieve the Header template
    */
    initHeader: function(menus, activeMenu){
        var self = this; self.menus = menus;
        
        $.get("templates/" + this.templateHTML + ".html", function(templateData) {

            var template = _.template(templateData, {lang: openstm.lang, menus: self.menus, user:{fullname: openstm.models.user.getFullname(), fields: openstm.models.user.toJSON()}});
            $(self.el).html(template);

            self.selectMenuItem(activeMenu);
        });
    },



    /** Change the active menu item
    */
    selectMenuItem: function (menuItem) {
        $('#nav-menu-app li').removeClass('active');
        
        if (menuItem) {
            $('#' + menuItem).addClass('active');
        }        
    },
    

    /** Change the Grid view of the page
    */
    switchGridMode: function(type){
        
        switch(type){

            case 'fluid' :
                $('#container').removeClass('container').addClass('container-fluid');
                $('#rowContainer').removeClass('row').addClass('row-fluid');
            break;

            case 'default' :
                $('#rowContainer').removeClass('row-fluid').addClass('row');
                $('#container').removeClass('container-fluid').addClass('container');
            break;
        }
    }

});
