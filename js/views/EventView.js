openstm.Views.EventView = Backbone.View.extend({
	  
		 el : '#task_duration',

		 templateHTML: 'task_duration',

       
        initialize: function() {
            _.bindAll(this);           
        },
        render: function() {
        	var self= this;
        	$.get("templates/" + this.templateHTML + ".html", function(templateData){
         
	            var template = _.template(templateData);
	            //$(this.el).html( this.template());
	            
//	            var buttons = {'Ok': this.save};
//	            //if (!this.model.isNew()) {
//                _.extend(buttons, {'Delete': this.destroy});
//                //}
//                _.extend(buttons, {'Cancel': this.close});   
//	            
//	            template.dialog({
//	                modal: true,
//	                //title: (this.model.isNew() ? 'New' : 'Edit') + ' Event',
//	                title: ' Task',
//	                buttons: buttons,
//	                open: this.open
//	            });
	            $(self.el).append(template);
        	});
        	// $(this.el).append(template)
        	//$(this.el).fadeIn('slow');
            return this;
        },        
        open: function() {
            this.$('#title').val(this.model.get('title'));
            this.$('#color').val(this.model.get('color'));            
        },        
        save: function() {
            this.model.set({'title': this.$('#title').val(), 'color': this.$('#color').val()});
            
            if (this.model.isNew()) {
                this.collection.create(this.model, {success: this.close});
            } else {
                this.model.save({}, {success: this.close});
            }
        },
        close: function() {
            this.el.dialog('close');
        },
        destroy: function() {
            this.model.destroy({success: this.close});
        }        
    });