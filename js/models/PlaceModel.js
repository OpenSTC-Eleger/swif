/******************************************
* Place Model
*/
app.Models.Place = Backbone.RelationalModel.extend({
	
	model_name : 'openstc.site',	
    
	url: "/#places/:id",
	
	relations: [ {
		type: Backbone.HasMany,
		key: 'asksBelongsto',
		relatedModel: 'app.Models.Request',
		//includeInJSON: true,
	    reverseRelation: {
			type: Backbone.HasOne,
			key: 'belongsToSite',
			includeInJSON: 'id',
		}
	},],


	/** Model Initialization
	*/
    initialize: function(){
        console.log('Place Model initialization');
    },

    
    /** Model Parser */
    parse: function(response) {    	
        return response;
    },
    
    /** Save Model
	*/
	save: function(data,options) { 
		app.saveOE(this.get("id"), data, this.model_name, app.models.user.getSessionID(), {
			success: function(){
				app.collections.Places.add(this);
			}
		});
	},

	
	/** Delete place
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