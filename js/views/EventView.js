app.Views.EventView = Backbone.View.extend({
	  
	
		templateHTML: 'tooltip',
		

       
        initialize: function() {
            _.bindAll(this);           
        },
        
        render: function(event) {
        	this.event = event;
        	var self= this;
        	
	        $.get("templates/" + this.templateHTML + ".html", function(templateData){
		  
				var template = _.template(templateData, {
					lang: app.lang,
					task: self.model.toJSON(),
				});
			
				$(self.el).html(template);
				self.template = template;
				event.qtip({ 

	        		content: {    
		            	title: { text: self.model.get('name'),button: true, },            	
		            	text: self.template ,
		            	
	        		},
	        		//hide: {event: "mouseout"}, // Don't' hide unless we call hide()
					events: {
		                render: function(event, api) {
	        			   $('#taskNote').val(self.model.get('notes'));	        			   
	                	},
	                    text: function() {
	                		$('#taskNote').val(self.model.get('notes'));
	                        return $(this);
	                    }
	        			//hide: function(event, api) { api.destroy(); }
	        			   					      
					},
	                position: {
	                    at: 'top center',
	                    // Position the tooltip above the link
	                    my: 'bottom center',
	                    adjust: {
	                        y: -2,
	                        resize: false // We'll handle it manually
	                    },
	                    viewport: self.el,
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
	                //hide: 'mousedown',
	                style: {
	                    classes: 'daytooltip ui-tooltip-light ui-tooltip-shadow ui-tooltip-default width400',
	                    tip: { width: 20, height: 8 }                                                 
	                },	

				})
	
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