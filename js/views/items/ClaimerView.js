app.Views.ClaimerView = Backbone.View.extend({

	tagName      : 'tr',

	className    : 'row-item',

	templateHTML : 'items/claimer',

//
//	// The DOM events //
//	events: {
//		'click'                    : 'modalUpdateclaimer',
//		'click a.modalDeleteclaimer' : 'modalDeleteclaimer'
//	},
//


	/** View Initialization
	 */
	initialize : function() {
		this.model.off();

		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);

		// When the model are destroy //
		this.listenTo(this.model,'destroy', this.destroy);
	},


	render : function() {
		var self = this;
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
			var template = _.template(templateData, {
				lang  : app.lang,
				claimer : self.model.toJSON()
			})
			$(self.el).html(template);
			$('*[data-toggle="tooltip"]').tooltip();
		});
		return this;
	},


	/** When the model is updated //
	 */
	change: function(e){

		this.render();
		this.highlight();
		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+app.lang.infoMessages.claimerUpdateOk);
	},



	/** When the model is destroy //
	 */
	destroy: function(e){
		var self = this;

		this.highlight().done(function(){
			self.remove();
		});

		app.notify('', 'success', app.lang.infoMessages.information, e.getCompleteName()+' : '+app.lang.infoMessages.claimerDeleteOk);
		app.views.claimersListView.collection.cpt--;
		app.views.claimersListView.partialRender();
	},



	/** Display the view
	 */




	/** Display Modal form to add/sav a new claimer
	 */
	modalUpdateClaimer: function(e){
		e.preventDefault(); e.stopPropagation();

		app.views.modalClaimerView = new app.Views.ModalClaimerView({
			el      : '#modalSaveClaimer',
			model   : this.model,
			elFocus : $(e.target).data('form-id')
		});
	},



	/** Modal to remove a claimer
	 */
	modalDeleteClaimer: function(e){
		e.preventDefault(); e.stopPropagation();

		app.views.modalDeleteView = new app.Views.ModalDeleteView({
			el         : '#modalDeleteClaimer',
			model      : this.model
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