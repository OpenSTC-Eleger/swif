/******************************************
* Place Model
*/
app.Models.Intervention = Backbone.RelationalModel.extend({
    
	model_name : 'project.project',	
	
	url: "/#demandes-dinterventions/:id",

	
	relations: [
	   {
			type: Backbone.HasMany,
			key: 'tasks',
			relatedModel: 'app.Models.Task',
			collectionType: 'app.Collections.Tasks',
			includeInJSON: true,
			//autoFetch: true,
			reverseRelation: {
				key: 'intervention',
				includeInJSON: ['id','name','state','tasks','service_id','site1','date_start', 'date_end'],
			},
		},		
//		{
//			type: Backbone.HasOne,
//			key: 'service_id',
//			relatedModel: 'app.Models.ClaimerService',
//			collectionType: 'app.Collections.ClaimerServices',
//			includeInJSON: 'id'
//		}
	],
	
	 defaults:{
		id:0,
		state: null,
		cancel_reason: null,
		infoMessage: null,
		classColor: null,
		overPourcent:0,
	},



	getState : function() {
        return this.get('state');
    },
    setState : function(value) {
    	if( value == 'undefined') return;
        this.set({ state : value });
    },
    
    getOverPourcent : function() {
        return this.get('overPourcent');
    },
    setOverPourcent : function(value) {
    	if( value == 'undefined') return;
        this.set({ overPourcent : value });
    },
    
    getInfoMessage : function() {
        return this.get('infoMessage');
    },
    setInfoMessage : function(value) {
    	if( value == 'undefined') return;
        this.set({ infoMessage : value });
    },
    
    getClassColor : function() {
        return this.get('classColor');
    },
    setClassColor : function(value) {
    	if( value == 'undefined') return;
        this.set({ classColor : value });
    },
    
    getCancelReason : function() {
        return this.get('cancel_reason');
    },
    setCancelReason : function(value) {
    	if( value == 'undefined') return;
        this.set({ cancel_reason : value });
    },  



	/** Model Initialization
	*/
    initialize: function(){
        console.log('Intervention Model initialization');
        this.fetchRelated('tasks');

        app.Models.Intervention.state[0].traduction = app.lang.planningFenced;
        app.Models.Intervention.state[1].traduction = app.lang.toScheduled;        
        app.Models.Intervention.state[2].traduction = app.lang.closed;
        app.Models.Intervention.state[3].traduction = app.lang.pending;
        app.Models.Intervention.state[4].traduction = app.lang.cancelled;
        app.Models.Intervention.state[5].traduction = "template"; //'app.lang.template';
    },


    
    /** Model Parser */
    parse: function(response) {    	
        return response;
    },



    update: function(params) {
		this.setState( params.state );
		this.setCancelReason( params.cancel_reason );
	},



    /** Save Model*/
	save: function(data,options) { 
		app.saveOE(this.get("id"), data, this.model_name, app.models.user.getSessionID(), options);
	},



	//save method with all redondant code
	saveAndRoute: function(id,data,closeModal, view, strRoute) {
		app.saveOE(id, data, this.model_name,app.models.user.getSessionID(), {
            beforeSend: function(){
                app.loader('display');
            },
		    success: function (data) {
		        console.log(data);
		        if(data.error){
		    		app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
		        }
		        else{
		        	if( closeModal!= null )
		            	closeModal.modal('hide');
		        	if( view ) {
		                if(app.collections.interventions == null ){
		                    app.collections.interventions = new app.Collections.Interventions();
		                }		        		
				 		app.collections.interventions.fetch({
			                success: function(){				 			
				 				if( strRoute ) {
									route = Backbone.history.fragment;
									Backbone.history.loadUrl(route);
								}
								else if (view){
									view.render();
                                }

                                app.loader('hide');
					 		}					 
				 		});					 	
					}
		        }
		    },
		    error: function () {
				console.log('ERROR - Unable to save the Request - RequestDetailsView.js');
		    }, 
		});
	},
	

    
	//When save intervention and just after save task (TaskListView L.187 et L.190) postgres send this error:
	//TransactionRollbackError: could not serialize access due to concurrent update
	//We must wait intervention save callback before save task
	saveWithCallback: function(id,data,options) { 
		app.saveOE(id, data, this.model_name, app.models.user.getSessionID(), options);
	},
	
	cancel: function(cancel_reason, options) {
		var params = {}
		params.state = app.Models.Intervention.state[4].value;
		params.cancel_reason = cancel_reason;
		app.callObjectMethodOE([[this.get("id")],params], this.model_name, "cancel", app.models.user.getSessionID(), options);
	}


}, {

    // Request State Initialization //
    state:  [
        {
            value       		: 'scheduled',
            color       		: 'info',
            htmlColor   		: '#3a87ad',
            externalGraphic   	: 'marker-gold.png',
            traduction  		: '',
        },
    	{
            value       		: 'open',
            color       		: 'warning',
    	    htmlColor   		: '#f89406',
    	    externalGraphic   	: 'marker-green.png',
            traduction  		: '',
        },
        {
            value       		: 'closed',
            color       		: 'success',
            htmlColor   		: '#468847',
            externalGraphic   	: 'marker-blue.png',
            traduction  		: '',   
        },
        {
            value       		: 'pending',
            color       		: 'muted',
            htmlColor   		: '#999999',
            externalGraphic   	: 'marker.png',
            traduction  		: '', 
        },
        {
            value       		: 'cancelled',
            color       		: 'important',
            htmlColor   		: '#b94a48',
            externalGraphic   	: 'marker.png',
            traduction  		: '',  
        },
        {
            value       		: 'template',
            color       		: 'template',
            htmlColor   		: '#ffc40d',
            externalGraphic   	: 'marker-blue.png',
            traduction  		: '',  
        }
    ]

});
