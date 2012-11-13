/******************************************
* Login View
*/
openstm.Views.OpenstmView = Backbone.View.extend({


    el : '#openstm',


    
    // The DOM events //
    events: {
        
    },



    /** View Initialization
    */
    initialize : function(user) {
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaOpenSTM view Initialize');
        this.render();
    },



    /** Display the view
    */
    render : function() {
 
        // Display the Tooltip or Popover //
        $('*[rel="popover"]').popover({trigger: "hover"});
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

