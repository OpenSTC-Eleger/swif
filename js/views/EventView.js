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
		            	text: self.template ,
		            	
	        		},
	        		//hide: {event: "mouseout"}, // Don't' hide unless we call hide()
					   events: {
	        			 render: function(event, api) {
	        			   $('#eventTimeSpent').val(self.model.get('effective_hours'))
	        			   $('#eventTimeRemaining').val(self.model.get('remaining_hours'))
	        			   var params = {};
	        			   $('#form', this).bind('submit', function(event) {
	        				   
	        				   	params = { 
							               id: self.model.get('id'),
							    		   state: $('#eventState').is(':checked')?"done":self.model.get('state'),
							               effective_hours: $('#eventTimeSpent').val(),
							               remaining_hours: $('#eventTimeRemaining').val(),
							    };	 
	        				   	
							    //state = $("input[name=view-opt-bt-group-value]").val();
								switch( params.state ) {
								  
									case 'done' :
										params.user_id = null;
										params.date_end = null;
										params.date_start = null;
										break;
								  
									case 'notdone' :
										params.state = 'open';
										//self.duplicate(params)
										break;
									  
								}
							    self.save(params);
							    //$(this).destroy();							    
	        					//event.preventDefault();
	        				});
	        			   	        			  	
	        			  $("form",this).find(".btn").each(function(){
						    $(this).bind('click', function(){
						      $("input[name=view-opt-bt-group-value]").value = this.value;	
						      params.state = this.value;
						      switch( this.value ) {
						      
						    	case 'done' :
						    	  params.state = this.value;
						    	  $("label[for=eventTimeSpent],#eventTimeSpent").removeAttr("disabled");
						    	  $("label[for=eventTimeRemaining],#eventTimeRemaining").attr("disabled", "disabled");
						    	  //$("#timeSpent").show();
						    	  //$("#timeRemaining").hide();
						    	  break;
						    	  
						      	case 'notdone' :
						    	  params.state = 'pending';
						    	  $("label[for=eventTimeSpent],#eventTimeSpent").attr("disabled", "disabled");
						    	  $("label[for=eventTimeRemaining],#eventTimeRemaining").attr("disabled", "disabled");
						    	  //$("#timeSpent").hide();
						    	  //$("#timeRemaining").hide();
						    	  break;

						    	default  :
						    	  params.state = this.value;
						    	  //$("#timeSpent").show();
						    	  //$("#timeRemaining").show();
						    	  $("label[for=eventTimeSpent],#eventTimeSpent").removeAttr("disabled");
						    	  $("label[for=eventTimeRemaining],#eventTimeRemaining").removeAttr("disabled");
						    	  break;
						      }
						      
						    	  
						    });
						  });

	        			},
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
	                	//when: 'click',
	                	event: false,
	                    ready: true,
	                    //event: false,
	               	 	//event: "submit form",
	                    //effect: self.save(),
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
				// Remove the previous tooltips data
.removeData('qtip')
 
// Create our second tooltip
.qtip({
	content: 'I\'m just one of many tooltips that will render on this element...',
	style: {
		classes: 'ui-tooltip-blue'
	}
});
	
			});	
		
			//$(this.el).hide().fadeIn('slow');
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