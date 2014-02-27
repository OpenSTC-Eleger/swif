define([
	'app',
	'appHelpers',

	


], function(app, AppHelpers){


	/******************************************
	* Row Request View
	*/
	var ItemContractView = Backbone.View.extend({

		tagName     : 'tr',

//		className   : function(){
//
//			if(this.model.getState() == RequestModel.status.wait.key && app.current_user.isManager() && _.contains(app.current_user.getServices(), this.model.getService('id'))) {
//				classRow = RequestModel.status.wait.color + ' bolder';
//				return classRow;
//			}
//			else if(this.model.getState() == RequestModel.status.confirm.key && app.current_user.isDST()){
//				classRow = RequestModel.status.confirm.color + ' bolder';
//				return classRow;
//			}
			
		},

		templateHTML : '/templates/items/itemRequest.html',


		// The DOM events //
		events       : {
			
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
			var self = this;

			this.render();

			// Highlight the Row and recalculate the className //
			AppHelpers.highlight($(this.el)).done(function(){
				
			});

			app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+infoMessage);

			// Partial Render //
			app.views.contractsListView.partialRender();
		},



		/** Display the view
		*/
		render : function() {
			var self = this;


			// Retrieve the template // 
			$.get(app.menus.patrimoine+this.templateHTML, function(templateData){


				var template = _.template(templateData, {
					lang        : app.lang,
					request     : self.model,
					user        : app.current_user,
					ContractModel: ContractModel
				});

				$(self.el).html(template);

				// Set the Tooltip / Popover //
				$('*[data-toggle="tooltip"]').tooltip();
				$('*[data-toggle="popover"]').popover({trigger: 'hover'});
			});

			return this;
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

	return ItemContractView;

});