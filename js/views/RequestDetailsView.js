/******************************************
* Requests Details View
*/
openstm.Views.RequestDetailsView = Backbone.View.extend({

	el : '#rowContainer',
	
	templateHTML: 'requestDetails',
	
	places: openstm.collections.places,
	
	create: false,

	events: {
		'click .save'   : 'saveRequest',
		'click .delete' : 'deleteRequest',
	},



	/** View Initialization
	*/
	initialize: function (model, create) {
		
		// Check if the view is instantiate //
		if(openstm.views.RequestDetailsView != null ){
			return openstm.views.RequestDetailsView;
		}

		this.create = create;
		this.render();
	},



	/** Display the view
	*/
    render: function () {
    	var self = this;

    	// Change the page title depending on the create value //
        if(this.create){
        	openstm.router.setPageTitle(openstm.lang.viewsTitles.newRequest);
        }
        else{
        	openstm.router.setPageTitle(openstm.lang.viewsTitles.requestDetail + 'n° ' + this.model.id);
        	console.debug(this.model);
        }

        // Change the active menu item //
        openstm.views.headerView.selectMenuItem(openstm.router.mainMenus.manageInterventions);


    	// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		  
		     var template = _.template(templateData, {lang: openstm.lang, request: self.model.toJSON()});
		     $(self.el).html(template);
		     
		     if( openstm.views.selectListPlacesView == null) {
		    	 	openstm.collections.places = new openstm.Collections.Places();
					openstm.views.selectListPlacesView = new openstm.Views.SelectListPlacesView({el: $("#requestPlace"), collection: openstm.collections.places})
					
					openstm.collections.places.fetch({
						success: function(){
							if (self.model.get("site1") != null && self.model.get("site1") != false)
								openstm.views.selectListPlacesView.setSelectedPlace( self.model.get("site1").get(0) );
						},	
						error: function(){
							console.log("Error: unable to load places - RequestDetailsView.js");
						}
					});				
			}		     
		    else {
		    	if (self.model!= null && self.model.get("site1") != null && self.model.get("site1") != false ){		    		
		    		openstm.views.selectListPlacesView.setSelectedPlace( self.model.get("site1").get(0) );	
		    		//openstm.collections.Sites.reset();
		    	}
		    }

		    
		 });

		$(this.el).hide().fadeIn('slow');     
		return this;
	},



	/** Save the request
	*/
    saveRequest: function (e) {
		e.preventDefault();
		
		var self = this;    

		this.model.save(self.model, 
			this.$('#requestName').val(),
			this.$('#requestDescription').val(),
			this.$('#requestPlace').val(),
		{
            success: function (data) {
                console.log(data);
                if(data.error){
            		openstm.notify('', 'error', openstm.lang.errorMessages.unablePerformAction, openstm.lang.errorMessages.sufficientRights);
                }
                else{
	                self.render();
	                openstm.router.navigate('#demandes-dinterventions' , true);
		            console.log('Success SAVE REQUEST');
                }
            },
            error: function () {
				console.log('ERROR - Unable to save the Request - RequestDetailsView.js');
            },           
        },this.create);
    },



	/** Delete the request
    */
    deleteRequest: function () {
        this.model.destroy({
            success: function () {
                //alert('Ask deleted successfully');
				window.history.back();
            },
            error: function () {
				console.log('ERROR - Unable to delete the Request - RequestDetailsView.js');
            },   
        });
        return false;
    }


});

