/******************************************
* Claimer Contact Model
*/
app.Models.ClaimerContact = Backbone.RelationalModel.extend({
    
	// Model name in the database //
	model_name : 'res.partner.address',	
	
	url: "/#demandeurs-contacts/:id",

//	relations: [
//	{
//		type: Backbone.HasMany,
//		key: 'partner_id',
//		relatedModel: 'app.Models.Claimer',
//		includeInJSON: true,
//	}],
	
    

	/** Model Initialization
	*/
    initialize: function(){
        console.log('Claimer Contact Model initialization');
        //this.fetchRelated('partner_id');
    },



    /** Model Parser
    */
    parse: function(response) {
        return response;
    },
    
    /** Save Officer
	*/
	save: function(data, id, options) { 
		app.saveOE(id>0?id:0, data, this.model_name, app.models.user.getSessionID(),options);
	},
    


//	save: function(id,data,closeModal, view, strRoute) { 
//		app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), {
//            beforeSend: function(){
//				app.loader('display');
//        	},
//		    success: function (data) {
//		        console.log(data);
//		        if(data.error){
//		    		app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
//		        }
//		        else{
//		        	if( closeModal!= null )
//		            	closeModal.modal('hide');
//		        	if( view || strRoute ) {
//		                if(app.collections.claimersContacts == null ){
//		                    app.collections.claimersContacts = new app.Collections.ClaimersContacts();
//		                }	
//		                //TODO fetch tasks & interventions pê pas necessaires car elles st rechargées dans le routeur
//					 	app.collections.claimersContacts.fetch({  
//					 		success: function(){
//						 		app.collections.claimers.fetch({
//					                success: function(){				 			
//						 				if( strRoute ) {
//											//route = Backbone.history.fragment;
//											Backbone.history.loadUrl(strRoute);
//						 					//app.Router.navigate("planning/"+Backbone.history.fragment,{trigger: true, replace: true})
//										}
//										else if (view)
//											view.render();
//							 		}					 
//						 		});
//					 		}					 
//					 	});
//					}
//		        }
//		    },
//		    error: function () {
//				console.log('ERROR - Unable to save the Request - RequestView.js');
//		    }, 
//		});
//	},



	/** Delete claimer contact
	*/
	delete: function (options) {	
		app.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	}

});
