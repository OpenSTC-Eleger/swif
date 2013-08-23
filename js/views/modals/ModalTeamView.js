/******************************************
* Team Modal View
*/
app.Views.ModalTeamView = app.Views.GenericModalView.extend({


	templateHTML : 'modals/modalTeam',



	// The DOM events //
	events: function(){
		return _.defaults({
			'submit #formSaveTeam'   : 'saveTeam'
		}, 
			app.Views.GenericModalView.prototype.events
		);
	},



	/** View Initialization
	*/
	initialize : function() {
		var self = this;

		this.modal = $(this.el);

		
		// Check if it's a create or an update //
		if(_.isUndefined(this.model)){
			this.model = new app.Models.Team();
		}

		self.render();
	},



	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang  : app.lang,
				team  : self.model
			});


			self.modal.html(template);

			// Advance Select List View //
			app.views.advancedSelectBoxForemanView = new app.Views.AdvancedSelectBoxView({el: $("#teamForeman"), collection: app.Collections.Officers.prototype })
			app.views.advancedSelectBoxForemanView.render();

			self.modal.modal('show');
		});

		return this;
	},



	/** Delete the model pass in the view
	*/
	saveTeam: function(e){
		e.preventDefault();

		var self = this;

		// Set the button in loading State //
		$(this.el).find("button[type=submit]").button('loading');


		// Set the properties of the model //
		this.model.setName(this.$('#teamName').val(), true);
		this.model.setManager(app.views.advancedSelectBoxForemanView.getSelectedItem(), true);


		this.model.save()
			.done(function(data) {
				self.modal.modal('hide');

				// Create mode //
				if(self.model.isNew()) {
					self.model.setId(data);
					self.model.fetch({silent: true, data : {fields : app.Collections.Teams.prototype.fields} }).done(function(){
						app.views.teamsListView.collection.add(self.model);
					})
				// Update mode //
				} else {
					self.model.fetch({ data : {fields : self.model.fields} });
				}
			})
			.fail(function (e) {
				console.log(e);
			})
			.always(function () {
				$(self.el).find("button[type=submit]").button('reset');
			});
	},

});