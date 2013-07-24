/******************************************
* Intervention Categorie Collection - Intervention classification for budget
*/
// fields = ["code", "id", "name"]

app.Collections.CategoriesInterventions = app.Collections.GenericCollection.extend({

    model: app.Models.CategoryIntervention,

    // Model name in the database //
    model_name : 'openstc.intervention.assignement',
    
   	url: '/api/openstc/intervention_categories',
   

    /** Collection Initialization
    */
    initialize: function (options) {
    	//console.log('Categorie Intervention collection Initialization');
    },


    /** Comparator for ordering collection
    */
    comparator: function(item) {
	  return item.get('name');
	},

});
