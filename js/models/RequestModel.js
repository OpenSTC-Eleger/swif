/******************************************
* Request Model
*/
app.Models.Request = Backbone.RelationalModel.extend({

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
	   	app.Models.Request.state[0].traduction = app.lang.refused;
	   	app.Models.Request.state[1].traduction = app.lang.wait;
	   	app.Models.Request.state[2].traduction = app.lang.confirm;
	   	app.Models.Request.state[3].traduction = app.lang.valid;
	   	app.Models.Request.state[4].traduction = app.lang.closed;

	   	//this.fetchRelated(this.relations[key]);
	   	//this.fetchRelated("site1");
	},



    /** Model Parser
    */
    parse: function(response) {
        return response;
    },


		
	/** Save Model
	*/
	save: function(model, name, description, site, date_deadline, options, create) {
		var data = {};
		data.name = name;
		data.description = description;  
		data.site1 = site;
		data.service_id = 1;
		data.date_deadline = date_deadline;	   
		data.id = this.get("id");
		app.saveOE(data, this.model_name, app.models.user.getSessionID(), options);
	},



	/** Destroy Model
	*/
	destroy: function (options) {	
		app.deleteOE( 
			[[this.get("id")]],
			this.model_name,
			app.models.user.getSessionID(),
			options
		);
	},






}, {

	// Request State Initialization //
	state:  [        
		{
            value       : 'refused',
            color       : 'important',
            traduction  : '',
        },
        {
            value       : 'wait',
            color       : 'info',
            traduction  : '',
        },
        {
            value       : 'confirm',
            color       : 'warning',
            traduction  : '', 
        },
        {
            value       : 'valid',
            color       : 'success',
            traduction  : '',   
        },
        {
            value       : 'closed',
            color       : '',
            traduction  : '',  
        }
    ]

});