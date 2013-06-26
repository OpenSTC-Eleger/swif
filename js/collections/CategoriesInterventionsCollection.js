/******************************************
* Intervention Categorie Collection - Intervention classification for budget
*/
app.Collections.CategoriesInterventions = Backbone.Collection.extend({

    model: app.Models.CategoryIntervention,

    // Model name in the database //
    model_name : 'openstc.intervention.assignement',
    
   	url: 'affectation',
   

    /** Collection Initialization
    */
    initialize: function (options) {
    	//console.log('Categorie Intervention collection Initialization');
    },



    /** Collection Sync
    */
    sync: function(method, model, options) {
        var fields = ["code", "id", "name"];

    	app.readOE(this.model_name, app.models.user.getSessionID(), options, fields);
    },



    /** Collection Parse
    */
    parse: function(response) {    	
        return response.result.records;
    },



    /** Comparator for ordering collection
    */
    comparator: function(item) {
	  return item.get('name');
	},

});
