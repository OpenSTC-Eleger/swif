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

	   	// Initialization Traduction request state //
	   	openstm.Models.Request.state[0].traduction = openstm.lang.refused;
	   	openstm.Models.Request.state[0].traduction = openstm.lang.wait;
	   	openstm.Models.Request.state[0].traduction = openstm.lang.confirm;
	   	openstm.Models.Request.state[0].traduction = openstm.lang.valid;
	   	openstm.Models.Request.state[0].traduction = openstm.lang.closed;
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

	// Request State Initialization //
	state:  [        
		{
            value       : 'refused',
            color       : 'label-important',
            traduction  : '',
        },
        {
            value       : 'wait',
            color       : 'label-info',
            traduction  : ,
        },
        {
            value       : 'confirm',
            color       : 'label-warning',
            traduction  : '', 
        },
        {
            value       : 'valid',
            color       : 'label-success',
            traduction  : '',   
        },
        {
            value       : 'closed',
            color       : '',
            traduction  : '',  
        }
    ]

});