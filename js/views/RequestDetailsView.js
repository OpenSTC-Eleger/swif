/******************************************
 * Requests Details View
 */
openstm.Views.RequestDetailsView = Backbone.View.extend({

el : '#rowContainer',

templateHTML: 'requestDetails',

places: openstm.collections.places,
claimersTypes: openstm.collections.claimersTypes,

create: false,

// The DOM events //
events: {
'submit #formRequest'		: 'saveRequest',
'click .delete'			: 'deleteRequest',
'change #requestClaimerType'	: 'fillDropdownClaimerType',
'change #requestClaimer'	: 'fillDropdownClaimer',
},



	/** View Initialization
	 */
initialize: function (model, create) {
		    this.model = model;
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

		self.collection = this.collection;
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

				var template = _.template(templateData, {lang: openstm.lang, request: self.model.toJSON()});
				$(self.el).html(template);		     


				// Fill select Places  //
				openstm.views.selectListPlacesView = new openstm.Views.DropdownSelectListView({el: $("#requestPlace"), collection: openstm.collections.places})
				openstm.views.selectListPlacesView.addAll();
				if(!self.create){	
				openstm.views.selectListPlacesView.setSelectedItem( self.model.get("site1")[0]	 );
				}

				// Fill select ClaimersTypes //
				openstm.views.selectListClaimersTypesView = new openstm.Views.DropdownSelectListView({el: $("#requestClaimerType"), collection: openstm.collections.claimersTypes})
				openstm.views.selectListClaimersTypesView.addEmptyFirst();
				openstm.views.selectListClaimersTypesView.addAll();
				if(!self.create){	
				openstm.views.selectListClaimersTypesView.setSelectedItem( self.model.get("partner_type")[0] );
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
				     this.$('#requestDateDeadline').val(),			
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
deleteRequest: function() {
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
},


	/** Fill the dropdown select list claimer
	 */
fillDropdownClaimerType: function(){

				// Remove the disabled attribut to the dropdown list //
				$('#requestClaimer').removeAttr('disabled');
				openstm.views.selectListClaimersTypesView.removeOne(0);

				if(!openstm.collections.claimers){
					openstm.collections.claimers = new openstm.Collections.Claimers();
				}

				claimerTypeModel = openstm.views.selectListClaimersTypesView.getSelected();

				openstm.views.selectListClaimersView = new openstm.Views.DropdownSelectListView({el: $("#requestClaimer"), collection: claimerTypeModel.attributes.claimers});
				openstm.views.selectListClaimersView.clearAll();
				openstm.views.selectListClaimersView.addEmptyFirst();
				openstm.views.selectListClaimersView.addAll();
			 },

fillDropdownClaimer: function(){
				$('#requestContactService').removeAttr('disabled');
				$('#requestContact').removeAttr('readonly');
				$('#requestContactPhone').removeAttr('readonly');
				$('#requestContactEmail').removeAttr('readonly');
				openstm.views.selectListClaimersView.removeOne(0);

				if(!openstm.collections.claimersServices){
					openstm.collections.claimersServices = new openstm.Collections.ClaimersServices();
				}

//				claimerModel = openstm.views.selectListClaimersView.getSelected();

				openstm.views.selectListClaimersServicesView = new openstm.Views.DropdownSelectListView({el: $("#requestContactService"), collection: openstm.collections.claimersServices});
//				openstm.views.selectListClaimersServicesView.clearAll();
//				openstm.views.selectListClaimersServicesView.addEmptyFirst();
				openstm.views.selectListClaimersServicesView.addAll();
				openstm.views.selectListClaimersTypesView.setSelectedItem( openstm.views.selectListClaimersView.getSelected().attributes.service_id[0] );
		     }

});

