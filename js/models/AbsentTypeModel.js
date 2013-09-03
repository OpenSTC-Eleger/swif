/******************************************
* Absent Type Model
*/
app.Models.AbsentType = Backbone.Model.extend({

    
    fields  : ['id', 'name', 'code', 'description', 'actions'],
    
    urlRoot : '/api/openstc/absence_categories',

      
    defaults:{
		id : null,
	},


    searchable_fields: [
        {
            key  : 'name', 
            type : 'text'
        },
        {
            key  : 'code', 
            type : 'text'
        }
    ],


      
    getId : function() {
        return this.get('id');
    },
    setId : function(value, silent) {
        this.set({ id : value }, {silent: silent});
    },

    getName : function() {
        return _.titleize(this.get('name').toLowerCase());
    },
    setName : function(value, silent) {
        this.set({ name : value }, {silent: silent});
    },
    
    getCode : function() {
        return this.get('code');
    },
    setCode : function(value, silent) {
        this.set({ code : value }, {silent: silent});
    },
    
    getDescription : function() {
        return this.get('description');
    },
    setDescription : function(value, silent) {
        this.set({ description : value }, {silent: silent});
    },


    /** Get Informations of the model
    */
    getInformations : function(){
        var informations = {};

        informations.name = this.getName();

        if(!_.isEmpty(this.getCode())){
            informations.infos = {};
            informations.infos.key = _.capitalize(app.lang.code);
            informations.infos.value = this.getCode();
        }

        return informations;
    },

    getActions : function(){
        return this.get('actions');
    }


});
