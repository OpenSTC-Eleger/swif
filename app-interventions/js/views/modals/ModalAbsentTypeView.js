define([
	'app',
	'appHelpers',

	'genericModalView',
	'advancedSelectBoxView',

	'absentTypesCollection',	
	
	'absentTypeModel'

], function(app, AppHelpers, GenericModalView, AdvancedSelectBoxView, AbsentTypesCollection, AbsentTypeModel){


	'use strict';
	

	/******************************************
	* Absent Type Modal View
	*/
	var modalAbsentTypeView = GenericModalView.extend({
	
	
		templateHTML : 'modals/modalAbsentType',
	
	
	
		// The DOM events //
		events: function(){
			return _.defaults({
				'submit #formSaveAbsentType'  : 'saveAbsentType'
			}, 
				GenericModalView.prototype.events
			);
		},
	
	
	
		/** View Initialization
		*/
		initialize: function (params) {
			this.options = params;
	
			this.modal = $(this.el);
	
			// Check if it's a create or an update //
			if(_.isUndefined(this.model)){
				this.model = new AbsentTypeModel();
			}
	
			this.render();
		},
	
	
	
		/** Display the view
		*/
		render : function() {
			var self = this;
	
	
			// Retrieve the template // 
			$.get(app.moduleUrl+"/templates/" + this.templateHTML + ".html", function(templateData){
	
				var template = _.template(templateData, {
					lang      : app.lang,
					absentType: self.model
				});
	
				self.modal.html(template);
	
				self.modal.modal('show');
			});
	
			return this;
		},
	
	
	
		/** Delete the model pass in the view
		*/
		saveAbsentType: function(e){
			e.preventDefault();
	
			var self = this;
	
			// Set the button in loading State //
			$(this.el).find("button[type=submit]").button('loading');
	
	
			// Set the properties of the model //
			//this.model.setName(this.$('#absentTypeName').val(), true);
			//this.model.setCode(this.$('#absentTypeName').val(), true);
			//this.model.setDescription(this.$('#absentTypeDescription').val(), true);
	
			var params = {
				name       : this.$('#absentTypeName').val(),
				code       : this.$('#absentTypeCode').val().toUpperCase(),
				description: this.$('#absentTypeDescription').val()
			}
	
			this.model.save(params)
				.done(function(data) {
					self.modal.modal('hide');
	
					// Create mode //
					if(self.model.isNew()) {
						self.model.setId(data);
						self.model.fetch({silent: true, data : {fields : AbsentTypesCollection.prototype.fields} }).done(function(){
							app.views.absentTypesListView.collection.add(self.model);
						})
					// Update mode //
					} else {
						self.model.fetch({ data : {fields : self.model.fields} });
					}
				})
				.fail(function (e) {
					AppHelpers.printError(e);
				})
				.always(function () {
					$(self.el).find("button[type=submit]").button('reset');
				});
		},
	
	});
	
	return modalAbsentTypeView;

});