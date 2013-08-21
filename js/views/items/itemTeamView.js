/******************************************
* Row Team View
*/
app.Views.ItemTeamView = Backbone.View.extend({

	tagName      : 'tr',

	className    : 'row-item',

	templateHTML : 'items/itemTeam',


	// The DOM events //
	events: {
		'click a.modalDeleteTeam'  : 'modalDeleteTeam',
		'click a.modalUpdateTeam'  : 'modalUpdateTeam'
	},



	/** View Initialization
	*/
	initialize : function() {
		this.model.off();

		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);

		// When the model are destroy //
		this.listenTo(this.model,'destroy', this.destroy);
	},



	/** When the model is updated //
	*/
	change: function(e){

		this.render();
		this.highlight();
		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.teamUpdateOk);
	},



	/** When the model is destroy //
	*/
	destroy: function(e){
		var self = this;

		this.highlight().done(function(){
			self.remove();
		});

		app.notify('', 'success', app.lang.infoMessages.information, e.getName()+' : '+app.lang.infoMessages.teamDeleteOk);
		app.views.teamsListView.partialRender();
	},



	/** Display the view
	*/
	render : function() {
		var self = this;

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var template = _.template(templateData, {
				lang  : app.lang,
				team : self.model
			});

			$(self.el).html(template);

			// Set the Tooltip //
			$('*[data-toggle="tooltip"]').tooltip();
		});

		return this;
	},



	/** Display Modal form to add/sav a new place
	*/
	modalUpdateTeam: function(e){  
		e.preventDefault(); e.stopPropagation();

		app.views.modalTeamView = new app.Views.ModalTeamView({
			el      : '#modalSaveTeam',
			model   : this.model,
		});
	},



	/** Modal to remove a place
	*/
	modalDeleteTeam: function(e){
		e.preventDefault(); e.stopPropagation();

		app.views.modalDeleteView = new app.Views.ModalDeleteView({
			el           : '#modalDeleteTeam',
			model        : this.model,
			modalTitle   : app.lang.viewsTitles.deleteTeam,
			modalConfirm : app.lang.warningMessages.confirmDeleteTeam
		});
	},



	/** Highlight the row item
	*/
	highlight: function(){
		var self = this;

		$(this.el).addClass('highlight');

		var deferred = $.Deferred();

		// Once the CSS3 animation are end the class are removed //
		$(this.el).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
			function(e) {
			$(self.el).removeClass('highlight');
			deferred.resolve();
		});

		return deferred;
	}


});