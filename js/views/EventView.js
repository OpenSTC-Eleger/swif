app.Views.EventView = Backbone.View.extend({
	  
	
		templateHTML: 'tooltip',

       
        initialize: function() {
            _.bindAll(this);           
        },
        
        render: function(event, planning, calendar) {
        	this.event = event;
        	this.planning = planning;
        	this.calendar = calendar;
        	var self= this;
        	
	        $.get("templates/" + this.templateHTML + ".html", function(templateData){
		  
				var template = _.template(templateData, {
					lang: app.lang,
					task: self.model.toJSON(),
				});
			
				self.template = template;
				event.qtip({ 

	        		content: {    
		            	title: { text: self.model.get('name'),button: true, },  
		                text: function(api) {
		                    return self.template;
		                }
	        		},
					events: {
		                render: function(event, api) {
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
	                        // 'true' = Make it modal (darken the rest of the page)...
	                        on: true,                                
	                        blur: true // ... but don't close the tooltip when clicked
	                    }
	                },
	                hide: 'mousedown',
	                style: {
	                    classes: 'daytooltip ui-tooltip-light  ui-tooltip-shadow ui-tooltip-default width400',
	                    tip: { width: 20, height: 8 }                                                 
	                },	

				})					
			});	
	        
			$('.btnUnlink').live('click',function(){
				params = {
				        state: app.Models.Task.state[2].value,
						user_id: null,
						team_id: null,
						date_end: null,
						date_start: null,
					};

				self.model.save(self.model.get('id'),params,null,null,'#planning');
				
				//$(self.event).qtip("destroy");
				$(".event-create").remove();

			});
		
			$(this.el).hide().fadeIn('slow');
	        return this;
        }, 
        
        open: function() {
        	//this.$('#effective_hours').val(this.model.get('effective_hours'));
            //this.$('#remaining_hours').val(this.model.get('remaining_hours'));                        
        }, 
        
        duplicate: function(params) {
        	//TODO
        	
        },
        
        save: function(params) {

            if (this.model.isNew()) {
                this.collection.create(this.model, {success: this.close});
            } else {
                this.model.save(params,{success: this.close},false);
            }
            $(this.event).css('border-color', 'red');
            //$("#myModal").modal('hide');
        },
        
        
        close: function() {
            //this.el.dialog('close');
        },
        destroy: function() {
            //this.model.destroy({success: this.close});
        }        
    });