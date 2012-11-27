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
	
				});
			
				$(self.el).html(template);
				self.template = template;
				event.qtip({ 

	        		content: {    
		            	title: { text: self.model.get('name'),button: true, },            	
		            	text: self.template           	
	        		},
					   events: {
	        			 render: function(event, api) {
	        			   $('form', this).bind('submit', function(event) {
	        				   
	        				   	params = { 
							               id: self.model.get('id'),
							    		   state: $('#eventState').is(':checked')?"done":self.model.get('state'),
							               total_hours: $('#eventTimeSpent').val(),
							               remaining_hours: $('#eventTimeRemaining').val(),
							    };
							    self.save(params);  
							    $(this).destroy();							    
	        					event.preventDefault();
	        				 });
	        			}					      
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
	                    ready: true,
	                    event: false,
	               	 	//event: "submit form",
	                    //effect: self.save(),
	                    modal: {
	                        // 'true' = Make it modal (darken the rest of the page)...
	                        on: false,                                
	                        blur: false // ... but don't close the tooltip when clicked
	                    }
	                },
	                hide: 'unfocus',
	                style: {
	                    classes: 'daytooltip ui-tooltip-dark ui-tooltip-shadow ui-tooltip-default width400',
	                    tip: { width: 20, height: 8 }                                                 
	                },	
				});
	
			});	
		
			//$(this.el).hide().fadeIn('slow');
	        return this;
        },        
        open: function() {
        	//this.$('#total_hours').val(this.model.get('total_hours'));
            //this.$('#remaining_hours').val(this.model.get('remaining_hours'));                        
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