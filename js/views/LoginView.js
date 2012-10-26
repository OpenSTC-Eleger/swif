/******************************************
* Login View
*/
openstm.Views.LoginView = Backbone.View.extend({


   el : '#rowContainer',

    templateHTML: 'login',

    
    // The DOM events //
    events: {
        'submit #formConnection'    :    'login',
        'keypress #loginUser'       :    'hideLastConnection'
    },



    /** View Initialization
    */
    initialize : function(user) {
        console.log('Login view Initialize');
        this.setModel(user).render();


    },



    /** Display the view
    */
    render : function() {
        var self = this;

        // Change the page title //
        openstm.router.setPageTitle(openstm.lang.viewsTitles.login);

        // Retrieve the Login template // 
        $.get("templates/" + this.templateHTML + ".html", function(templateData){
         
            var template = _.template(templateData, {lang: openstm.lang, user: self.model.toJSON()});
            $(self.el).html(template);

        });



        $(this.el).hide().fadeIn('slow');
        return this;
    },



    /** Set a user model to the view
    */
    setModel : function(model) {
        this.model = model;
        return this;
    },



    /** Login Function
    */
    login: function(e){
        e.preventDefault();

        // Retrieve data from the form //
        var login = $('#loginUser').val();
        var pass = $('#passUser').val();


        // Execution userr login function //
        openstm.models.user.login(login, pass);
        
        $('#passUser').val('');

    },



    /** Hide the last connection information if the user change
    */
    hideLastConnection: function(){
        var infoLastConnection = $('#lastConnection');
        if(infoLastConnection.length != 0){
            infoLastConnection.fadeOut();
        }
       
    },

  
});

