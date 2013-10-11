/******************************************
* Absent Type Modal View
*/
app.Views.ModalAbsentTypeView = app.Views.GenericModalView.extend({


	templateHTML : 'modals/modalAbsentType',



	// The DOM events //
	events: function(){
		return _.defaults({
			'submit #formSaveAbsentType'  : 'saveAbsentType'
		}, 
			app.Views.GenericModalView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize : function() {

		this.modal = $(this.el);

		// Check if it's a create or an update //
		if(_.isUndefined(this.model)){
			this.model = new app.Models.AbsentType();
		}

		this.render();
	},



	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

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
					self.model.fetch({silent: true, data : {fields : app.Collections.AbsentTypes.prototype.fields} }).done(function(){
						app.views.absentTypesListView.collection.add(self.model);
					})
				// Update mode //
				} else {
					self.model.fetch({ data : {fields : self.model.fields} });
				}
			})
			.fail(function (e) {
				app.Helpers.Main.printError(e);
			})
			.always(function () {
				$(self.el).find("button[type=submit]").button('reset');
			});
	},

});