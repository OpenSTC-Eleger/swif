/******************************************
 * Requests Details View
 */
app.Views.RequestDetailsView = Backbone.View.extend({

el : '#rowContainer',

templateHTML: 'requestDetails',

places: app.collections.places,
claimersTypes: app.collections.claimersTypes,

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
			app.router.setPageTitle(app.lang.viewsTitles.newRequest);
		}
		else{
			app.router.setPageTitle(app.lang.viewsTitles.requestDetail + 'n° ' + this.model.id);
			console.debug(this.model);
		}

		// Change the active menu item //
		app.views.headerView.selectMenuItem(app.router.mainMenus.manageInterventions);

		self.collection = this.collection;
		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

				var template = _.template(templateData, {lang: app.lang, request: self.model.toJSON()});
				$(self.el).html(template);		     


				// Fill select Places  //
				app.views.selectListPlacesView = new app.Views.DropdownSelectListView({el: $("#requestPlace"), collection: app.collections.places})
				app.views.selectListPlacesView.addAll();
				if(!self.create){	
				app.views.selectListPlacesView.setSelectedItem( self.model.get("site1")[0]	 );
				}

				// Fill select ClaimersTypes //
					app.views.selectListClaimersTypesView = new app.Views.DropdownSelectListView({el: $("#requestClaimerType"), collection: app.collections.claimersTypes})
					app.views.selectListClaimersTypesView.clearAll();
					app.views.selectListClaimersTypesView.addEmptyFirst();
					app.views.selectListClaimersTypesView.addAll();
	//				if(!self.create){	
	//				app.views.selectListClaimersTypesView.setSelectedItem( self.model.get("partner_type")[0] );
	//				}

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
app.notify('', 'error', app.lang.errorMessages.unablePerformAction, app.lang.errorMessages.sufficientRights);
}
else{
self.render();
app.router.navigate('#demandes-dinterventions' , true);
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

				app.views.selectListClaimersTypesView.removeOne(0);
				$('#requestContactService').attr('value', '' );
				$('#requestContactServiceBlock').attr('style', 'display:none');

				if(!app.collections.claimers){
					app.collections.claimers = new app.Collections.Claimers();
				}

				claimerTypeModel = app.views.selectListClaimersTypesView.getSelected();

				if ( claimerTypeModel.attributes.claimers.length != 0) {

					$('#requestClaimerBlock').attr('style', 'display:inline');
					app.views.selectListClaimersView = new app.Views.DropdownSelectListView({el: $("#requestClaimer"), collection: claimerTypeModel.attributes.claimers});
					app.views.selectListClaimersView.clearAll();
					app.views.selectListClaimersView.addEmptyFirst();
					app.views.selectListClaimersView.addAll();

					$('#requestContactInputBlock').attr('style', 'display:none');
					$('#requestContactInput').attr('readonly', 'readonly');
					$('#requestContactPhone').attr('readonly', 'readonly');
					$('#requestContactEmail').attr('readonly', 'readonly');
					$('#requestContactInput').attr('value', '');
					$('#requestContactPhone').attr('value', '');
					$('#requestContactEmail').attr('value', '');
					$('#requestContactSelectBlock').attr('style', 'display:inline');
					$('#requestContactSelect').attr('disabled', 'disabled');

				} else {

					$('#requestContactInputBlock').attr('style', 'display:inline');
					$('#requestContactInput').removeAttr('readonly');
					$('#requestContactSelectBlock').attr('style', 'display:none');

					$('#requestContactPhone').removeAttr('readonly');
					$('#requestContactEmail').removeAttr('readonly');

					$('#requestClaimerBlock').attr('style', 'display:none');
					if (app.views.selectListClaimersView) {
						app.views.selectListClaimersView.clearAll();
					}
				}
			 },

fillDropdownClaimer: function(){
				app.views.selectListClaimersView.removeOne(0);
				$('#requestContactInputBlock').attr('style', 'display:none');
				$('#requestContactInput').attr('readonly', 'readonly');
				$('#requestContactSelectBlock').attr('style', 'display:inline');
				$('#requestContactSelect').removeAttr('disabled');
				$('#requestContactPhone').removeAttr('readonly');
				$('#requestContactEmail').removeAttr('readonly');

				claimer = app.views.selectListClaimersView.getSelected();

				if(!app.collections.claimersServices){
					app.collections.claimersServices = new app.Collections.ClaimersServices();
				}

				if (claimer.attributes.service_id.attributes[1]) {
					$('#requestContactServiceBlock').attr('style', 'display:inline');
					$('#requestContactService').attr('value', claimer.attributes.service_id.attributes[1] );
				} else {
					$('#requestContactServiceBlock').attr('style', 'display:none');
					$('#requestContactService').attr('value', '' );
				}

				if(!app.collections.claimersContacts){
					app.collections.claimersContacts = new app.Collections.ClaimersContacts();
				}

				currentContacts = new app.Collections.ClaimersContacts();
				_.each(app.collections.claimersContacts, function(contact, i) {
					if (contact.attributes.partner_id.models[0].attributes.id = claimer.attributes.id) {
						currentContacts.add(contact);
					}
				});

				app.views.selectListClaimersContactsView = new app.Views.DropdownSelectListView({el: $("#requestContactSelect"), collection: currentContacts});
				app.views.selectListClaimersContactsView.clearAll();
				app.views.selectListClaimersContactsView.addAll();
		     }

});

