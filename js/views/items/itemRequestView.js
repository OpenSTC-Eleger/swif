/******************************************
* Row Request View
*/
app.Views.ItemRequestView = Backbone.View.extend({

	tagName     : 'tr',

	className   : function(){

		var classRow = '';

		if(this.model.getState() == app.Models.Request.status.wait.key && app.models.user.isManager() && _.contains(app.models.user.getServices(), this.model.getService('id'))) {
			classRow = app.Models.Request.status.wait.color + ' bolder';
		}
		else if(this.model.getState() == app.Models.Request.status.confirm.key && app.models.user.isDST()){
			classRow = app.Models.Request.status.confirm.color + ' bolder';
		}

		return classRow;
	},

	templateHTML : 'items/itemRequest',


	// The DOM events //
	events       : {
		'click .buttonValidRequest'	      : 'modalValidRequest',
		'click .buttonRefusedRequest'	  : 'modalRefuseRequest',
		'click .buttonConfirmRequest'	  : 'modalConfirmRequest'
	},



	/** View Initialization
	*/
	initialize : function() {
		this.model.off();

		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);
	},



	/** When the model ara updated //
	*/
	change: function(model){

		this.render();
		this.highlight();


		// Set the info message for the notification //
		if(model.getState() == app.Models.Request.status.refused.key){
			var infoMessage = app.lang.infoMessages.requestRefuseOk;
		}
		else if(model.getState() == app.Models.Request.status.confirm.key){
			var infoMessage = app.lang.infoMessages.requestConfirmOk;
		}

		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+infoMessage);
	},



	/** Display the view
	*/
	render : function() {
		var self = this;

		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){
		 
			var template = _.template(templateData, {
				lang    : app.lang,
				request : self.model
			});

			$(self.el).html(template);

			// Set the Tooltip / Popover //
			$('*[data-toggle="tooltip"]').tooltip();
			$('*[data-toggle="popover"]').popover({trigger: 'hover'});

		});

		return this;
	},



	/** Display Modal form to valid an Intervention Request
	*/
	modalValidRequest: function(e){
		e.preventDefault(); e.stopPropagation();

		app.views.modalValidRequestView = new app.Views.ModalValidRequestView({
			el      : '#modalValidRequest',
			model   : this.model
		});
	},



	/** Display Modal form to Refuse an Intervention Request
	*/
	modalRefuseRequest: function(e){
		e.preventDefault(); e.stopPropagation();

		app.views.modalRefuseRequestView = new app.Views.ModalRefuseRequestView({
			el      : '#modalRefuseRequest',
			model   : this.model
		});
	},



	/** Display Modal form to Confirm an Intervention Request
	*/
	modalConfirmRequest: function(e){
		e.preventDefault(); e.stopPropagation();

		app.views.modalConfirmRequestView = new app.Views.ModalConfirmRequestView({
			el      : '#modalConfirmRequest',
			model   : this.model
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