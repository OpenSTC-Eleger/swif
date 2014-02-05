define([
	'app',
	'officerModel',
	'officersCollection',
	'stcGroupsCollection',
	'claimersServicesCollection',
	
	'genericModalView',
	'advancedSelectBoxView'

], function(app, OfficerModel, OfficersCollection, StcGroupsCollection, ClaimersServicesCollection, GenericModalView, AdvancedSelectBoxView){

	'use strict';

		

	/******************************************
	* Officer Modal View
	*/
	var ModalOfficerView = GenericModalView.extend({
	
	
		templateHTML : 'modals/modalOfficer',
	
	
	
		// The DOM events //
		events: function(){
			return _.defaults({
				'submit #formSaveOfficer'     : 'saveOfficer'
			}, 
				GenericModalView.prototype.events
			);
		},
	
	
	
		/** View Initialization
		*/
		initialize : function(params) {
			this.options = params;
	
			var self = this;
	
			this.modal = $(this.el);
	
	
			// Check if it's a create or an update //
			if(_.isUndefined(this.model)){
	
				this.model = new OfficerModel();
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
					lang    : app.lang,
					officer : self.model,
					loader  : loader,
					service : (!_.isUndefined(self.options.officersListView) ? self.options.officersListView.options.model : '')
				});
	
	
	
				self.modal.html(template);
	
				if(!loader){
					// Advance Select List View //
					app.views.advancedSelectBoxOfficerGroupView = new AdvancedSelectBoxView({el: $("#officerGroup"), url: StcGroupsCollection.prototype.url })
					app.views.advancedSelectBoxOfficerGroupView.setSearchParam({ field : 'name', operator : 'ilike', value : 'openstc' }, true);
					app.views.advancedSelectBoxOfficerGroupView.render();
					
					app.views.advancedSelectBoxResaGroupView = new AdvancedSelectBoxView({el: $("#resaGroup"), url: StcGroupsCollection.prototype.url })
					app.views.advancedSelectBoxResaGroupView.setSearchParam({ field : 'name', operator : 'ilike', value : 'openresa' }, true);
					app.views.advancedSelectBoxResaGroupView.render();
	
					app.views.advancedSelectBoxOfficerServiceView = new AdvancedSelectBoxView({el: $("#officerService"), url: ClaimersServicesCollection.prototype.url })
					app.views.advancedSelectBoxOfficerServiceView.render();
	
					app.views.advancedSelectBoxOfficerServicesView = new AdvancedSelectBoxView({el: $("#officerOtherServices"), url: ClaimersServicesCollection.prototype.url })
					app.views.advancedSelectBoxOfficerServicesView.render();
				}
	
				self.modal.modal('show');
			});
	
			return this;
		},
	
	
	
		/** Save the model pass in the view
		*/
		saveOfficer: function(e){
			e.preventDefault();
	
			var self = this;
	
			// Set the button in loading State //
			$(this.el).find("button[type=submit]").button('loading');
	
	
			var params = {
				firstname   : $('#officerFirstname').val(),
				name        : $('#officerName').val(),
				user_email  : $('#officerEmail').val(),
				groups_id   : [[6, 0, [app.views.advancedSelectBoxOfficerGroupView.getSelectedItem() , app.views.advancedSelectBoxResaGroupView.getSelectedItem() ]]],
				service_id  : app.views.advancedSelectBoxOfficerServiceView.getSelectedItem(),
				
			};
	
			if(!_.isEmpty(app.views.advancedSelectBoxOfficerServicesView.getSelectedItems())){
				params.service_ids = [[6, 0, app.views.advancedSelectBoxOfficerServicesView.getSelectedItems()]];
			}
			// Set login and password if the user is new //
			if(this.model.isNew()){
				params.login     = $('#officerLogin').val();
				params.password  = $('#officerPassword').val();
			}
	
	
	
			this.model.save(params, {silent: true, patch: !self.model.isNew()})
				.done(function(data) {
					self.modal.modal('hide');
	
					// Create mode //
					if(self.model.isNew()) {
						self.model.setId(data);
						self.model.fetch({silent: true, data : {fields : OfficersCollection.prototype.fields} }).done(function(){
							self.options.officersListView.collection.add(self.model);
						})
					// Update mode //
					} else {
						self.model.fetch({ data : {fields : self.model.fields} });
					}
				})
				.fail(function (e) {
					console.log(e);
					alert('impossible de créer l\'utilisateur');
				})
				.always(function () {
					$(self.el).find("button[type=submit]").button('reset');
				});
		}
	
	});
	return ModalOfficerView;
})