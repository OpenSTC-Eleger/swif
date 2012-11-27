/******************************************
* Login View
*/
app.Views.AppView = Backbone.View.extend({


    el : '#rowContainer',


    
    // The DOM events //
    events: {
        
    },



    /** View Initialization
    */
    initialize : function(user) {
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaApp view Initialize');
        this.render();
    },



    /** Display the view
    */
    render : function() {
 
        // Display the Tooltip or Popover //
        $('*[rel="popover"]').popover({trigger: "hover"});
        console.log("00000000000000000000000000000000000"+$('*[rel="popover"]').length);
        $('*[rel="tooltip"]').tooltip({placement: "right"});

        // Initialisation du Plugin Affix //
        $('[data-spy="affix"]').affix();

        // Initialisation du Plugin Scrollspy //
        $('[data-spy="scroll"], .navListAgents').scrollspy();

        // Animated Scroll //
        $('ul.nav li a[href^="#"]').click(function(){  
            var elementID = $(this).attr("href");  
            
            $('html, body').animate({  
                scrollTop:$(elementID).offset().top -5
            }, 'slow');
            
            return false;
        });


    },

 
});

