/******************************************
* Request Model
*/
openstm.Models.Request = Backbone.RelationalModel.extend({

	// Model name in the database //
	model_name : 'openctm.ask',	

    
    defaults: {
		id: null,
		name: "",
		description: ""
	},




	relations: [{
		type: Backbone.HasOne,
		key: 'site1',
		relatedModel: 'Place',
		includeInJSON: true,
	}],



	/** Model Initialization
	*/
	initialize: function (model) {
	   	console.log("Request Model Initialization");
	},



    /** Model Parser
    */
    parse: function(response) {
        return response;
    },


		
	/** Save Model
	*/
	save: function(model, name, description, site, options, create) {
		var data = {};
		data.name = name;
		data.description = description;  
		data.site1 = site;
		data.service_id = 1;
		data.date_deadline = '2012-11-29';	    	      	
		openstm.saveOE(data, this.get("id"), this.model_name,openstm.models.user.getSessionID(), options);
	},



	/** Destroy Model
	*/
	destroy: function (options) {	
		openstm.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			openstm.models.user.getSessionID(),
			options
		);
	},






}, {

	state:  [        
		{
            value       : 'refused',
            color       : 'label-important',
            traduction  : openstm.lang.refused,
        },
        {
            value       : 'wait',
            color       : 'label-info',
            traduction  : openstm.lang.wait,
        },
        {
            value       : 'confirm',
            color       : 'label-warning',
            traduction  : openstm.lang.confirm, 
        },
        {
            value       : 'valid',
            color       : 'label-success',
            traduction  : openstm.lang.valid,   
        },
        {
            value       : 'closed',
            color       : '',
            traduction  : openstm.lang.closed,  
        }
    ]

});