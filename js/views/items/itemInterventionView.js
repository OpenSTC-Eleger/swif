/******************************************
* Row Intervention View
*/
app.Views.ItemInterventionView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemIntervention',
	
	className   : 'row-item',

	// The DOM events //
	events       : {
		
		'click a.printInter'				: 'print',
		'change .taskEquipment'				: 'fillDropdownEquipment',
		'click a.buttonCancelInter'			: 'displayModalCancelInter',
		'submit #formCancelInter' 			: 'cancelInter',
		'click a.accordion-object'    		: 'tableAccordion',
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
		this.highlight().done(function(){
//			self.$el.attr('class', _.result(self, 'className'));
		});


		// Set the info message for the notification //
//		switch(model.getState()){
//			case app.Models.Request.status.refused.key: 
//				var infoMessage = app.lang.infoMessages.requestRefuseOk;
//			break;
//			case app.Models.Request.status.confirm.key:
//				var infoMessage = app.lang.infoMessages.requestConfirmOk;
//			break;
//			case app.Models.Request.status.valid.key:
//				var infoMessage = app.lang.infoMessages.requestValidOk;
//			break;
//		}


		app.notify('', 'success', app.lang.infoMessages.information, this.model.getName()+' : '+infoMessage);

		// Partial Render //
		app.views.interventions.partialRender();
	},



	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

		 
			var template = _.template(templateData, {
				lang                   : app.lang,
				interventionsState     : app.Models.Intervention.status,
				intervention          : self.model.toJSON(),
			});

			$(self.el).html(template);

			// Set the Tooltip / Popover //$(self.el).html(template);
			$('*[data-toggle="tooltip"]').tooltip();
			$('*[rel="popover"]').popover({trigger: 'hover'});

			// Set the focus to the first input of the form //
			$('#modalCancelInter').on('shown', function (e) {
				$(this).find('input, textarea').first().focus();
			})
			
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
			
		});
		$(this.el).hide().fadeIn('slow'); 
		return this;
	},

	tableAccordion: function(e){

		e.preventDefault();
		// Retrieve the intervention ID //
		//var id = _($(e.target).attr('href')).strRightBack('_');
		var id = this.model.toJSON().id.toString();

		var isExpend = $('#collapse_'+id).hasClass('expend');

		// Reset the default visibility //
		$('tr.expend').css({ display: 'none' }).removeClass('expend');
		$('tr.row-object').css({ opacity: '0.45'});
		$('tr.row-object > td').css({ backgroundColor: '#FFF'});
		
		// If the table row isn't already expend //       
		if(!isExpend){
			// Set the new visibility to the selected intervention //
			$('#collapse_'+id).css({ display: 'table-row' }).addClass('expend');
			$(e.target).parents('tr.row-object').css({ opacity: '1'});  
			$(e.target).parents('tr.row-object').children('td').css({ backgroundColor: "#F5F5F5" }); 
		}
		else{
			$('tr.row-object').css({ opacity: '1'});
			$('tr.row-object > td').css({ backgroundColor: '#FFF'});
			$('tr.row-object:nth-child(4n+1) > td').css({backgroundColor: '#F9F9F9' });
		}
		   
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