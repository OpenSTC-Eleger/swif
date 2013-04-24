/******************************************
* Event View
*/
app.Views.EventView = Backbone.View.extend({
	  

	templateHTML: 'modalTest',

    el : '#modalContainer',
    
   
    initialize: function() {
        _.bindAll(this);           
    },


    events: {
        'click #btnRemoveTask'                          : 'removeTaskFromSchedule'
    },


    render: function(event, planning, calendar) {
    	this.event = event;
    	var self= this;
    	
        $.get("templates/" + this.templateHTML + ".html", function(templateData){
	  
			var template = _.template(templateData, {
				lang: app.lang,
				task: self.model.toJSON(),
			});
		
            $(self.el).html(template);

            $('#modalAboutTask').modal('show');
			
            /*var qtip =event.qtip({ 

        		content: {    
	            	title: { text: self.model.get('name'),button: true },  
	                text: function(api) {
	                    return self.template;
	                },
	            	target: $('#event-create'),
        		},
				events: {
	                render: function(event, api) {					    
					    $( this ).on( "click", "#btnUnlinkTask", function( e ) {
					    	console.debug(".ON");
	        				params = {
	        				        state: app.Models.Task.state[3].value, 
	        						user_id: null,
	        						team_id: null,
	        						date_end: null,
	        						date_start: null,
	        					};
	
	        				self.model.save(self.model.get('id'),params,null,null,'#planning');
	        				$(qtip).remove();
					    } );
                	},	
				},
                position: {
                    at: 'top center',
                    // Position the tooltip above the link
                    my: 'bottom center',
                    adjust: {
                        y: -2,
                        resize: false // We'll handle it manually
                    },
                    viewport: $(window),
                    container: self.el
                },
                show: {
                	when: 'click',
                	event: true,
                    ready: true,
                    modal: {	                        
                        on: true, // 'true' = Make it modal (darken the rest of the page)...                               
                        blur: true // ... but don't close the tooltip when clicked
                    }
                },
                hide: {
                    fixed: true
                },
                style: {
                    classes: 'daytooltip ui-tooltip-light  ui-tooltip-shadow ui-tooltip-default width400',
                    tip: { width: 20, height: 8 } ,
                    //title: { 'font-size': 50 } ,
                },	

			});*/

		});	
	
        return this;
    }, 
    


    removeTaskFromSchedule: function(){
        console.log('Supeerere');
    }

 
});