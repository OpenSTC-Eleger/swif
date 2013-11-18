define([
	'app',
	'appHelpers',
	'claimersServicesCollection',
	'claimerServiceModel',
	'officersCollection',
	
	'genericModalView',
	'advancedSelectBoxView',
	'bsSwitch'

], function(app, AppHelpers, ClaimersServicesCollection, ClaimerServiceModel, OfficersCollection, GenericModalView, AdvancedSelectBoxView, bootstrapSwitch){

	'use strict';

		
	
	/******************************************
	* Service Modal View
	*/
	var ModalServiceView = GenericModalView.extend({
	
	
		templateHTML : 'modals/modalService',
	
	
	
		// The DOM events //
		events: function(){
			return _.defaults({
				'submit #formSaveService'     : 'saveService'
			}, 
				GenericModalView.prototype.events
			);
		},
	
	
	
		/** View Initialization
		*/
		initialize : function() {
			var self = this;
	
			this.modal = $(this.el);
	
	
			// Check if it's a create or an update //
			if(_.isUndefined(this.model)){
				
				this.model = new ClaimerServiceModel();
				this.render();
			}
			else{
				// Render with loader //
				this.render(true);
				this.model.fetch({silent: true, data : {fields : this.model.fields}}).done(function(){
					self.render();
				});
			}
	
		},
	
	
	
		/** Display the view
		*/
		render : function(loader) {
			var self = this;
	
	
			// Retrieve the template // 
			$.get("templates/" + this.templateHTML + ".html", function(templateData){
	
				var template = _.template(templateData, {
					lang   : app.lang,
					service: self.model,
					loader : loader
				});
	
	
				self.modal.html(template);
	
				if(!loader){
					// Advance Select List View //
					app.views.advancedSelectBoxManagerView = new AdvancedSelectBoxView({el: $("#serviceManager"), collection: OfficersCollection.prototype })
					app.views.advancedSelectBoxManagerView.render();
	
					app.views.advancedSelectBoxServiceParentView = new AdvancedSelectBoxView({el: $("#serviceParentService"), collection: ClaimersServicesCollection.prototype })
					app.views.advancedSelectBoxServiceParentView.render();
	
					$('.make-switch').bootstrapSwitch();
				}
	
				self.modal.modal('show');
			});
	
			return this;
		},
	
	
	
		/** Save the model pass in the view
		*/
		saveService: function(e){
			e.preventDefault();
	
			var self = this;
	
			// Set the button in loading State //
			$(this.el).find("button[type=submit]").button('loading');
	
	
			// Set the properties of the model //
			var params = {
				name     : $('#serviceName').val(),
				code     : $('#serviceCode').val().toUpperCase(),
				technical: $('#switchTechnicalService').bootstrapSwitch('status'),
				manager_id : app.views.advancedSelectBoxManagerView.getSelectedItem(),
				service_id : app.views.advancedSelectBoxServiceParentView.getSelectedItem()
			};
	
			this.model.unset('user_ids', { silent: true });
	
			this.model.save(params, {silent: true})
				.done(function(data) {
					self.modal.modal('hide');
	
					// Create mode //
					if(self.model.isNew()) {
						self.model.setId(data);
						self.model.fetch({silent: true, data : {fields : ClaimersServicesCollection.prototype.fields} }).done(function(){
							app.views.servicesListView.collection.add(self.model);
						})
					// Update mode //
					} else {
						self.model.fetch({ data : {fields : self.model.fields} });
					}
				})
				.fail(function (e) {
					AappHelpers.printError(e);
				})
				.always(function () {
					$(self.el).find("button[type=submit]").button('reset');
				});
		}
	
	});
	return ModalServiceView;
})