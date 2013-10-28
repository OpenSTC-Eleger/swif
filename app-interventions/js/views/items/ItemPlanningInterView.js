/******************************************
* Row Intervention View
*/
app.Views.ItemPlanningInterView = Backbone.View.extend({

	tagName     : 'tr',

	templateHTML : 'items/itemPlanningInter',
	
		
	className   : function(){
		this.classColor = app.Models.Intervention.status[this.model.getState()].color;
		return "row-item border-emphasize border-emphasize-" + this.classColor;	
	},

	// The DOM events //
	events       : {		
		'click a.accordion-object'    		: 'tableAccordion',
		'click a.modalSaveInter'			: 'displayModalSaveInter',
		'click a.buttonCancelInter'			: 'displayModalCancelInter',
	},

	/** View Initialization
	*/
	initialize : function(params) {
		this.options = params;

		this.detailedView = this.options.detailedView;
		
		this.model.off();
		// When the model are updated //
		this.listenTo(this.model, 'change', this.change);	
	},

	/** When the model ara updated //
	*/
	change: function(model){
		
		var self = this;		

		self.detailedView.model = self.model;
		if(	this.itemIsToRemove( model ) ) {
				//Unexpend inter
				$('tr.expend').css({ display: 'none' }).removeClass('expend');
				//remove inter
				self.remove();
				self.detailedView.remove();
		}
		else {
			self.$el.removeAttr("class").addClass(self.className());	
			self.render();
			if(!_.isUndefined(self.detailedView)){
				self.detailedView.fetchData().done(function () {
					self.detailedView.render();
				});
			}
			self.highlight().done();
		}
		app.notify('', 'success', app.lang.infoMessages.information, self.model.getName()+' : '+ app.lang.infoMessages.interventionUpdateOK);	

	},



	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

			var modelJSON = self.model.toJSON();
			var informationHour = '';
			//var classColor = app.Models.Intervention.status[modelJSON.state].color;
			
			if( modelJSON.state != app.Models.Intervention.status.template.key  ){
				informationHour = (modelJSON.planned_hours != false ? app.Helpers.Main.decimalNumberToTime(modelJSON.planned_hours, 'human') : '');
			}
			else{
				informationHour = (modelJSON.total_hours != false ? app.Helpers.Main.decimalNumberToTime(modelJSON.total_hours, 'human') : '');
			}

			var template = _.template(templateData, {
				lang                   	: app.lang,
				interventionsState     	: app.Models.Intervention.status,
				intervention          	: modelJSON,
				informationHour			: informationHour,
				classColor 				: self.classColor
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
	
	/**
	 * Remove item in term of status filter
	 */
    itemIsToRemove: function(model){
		var state = model.toJSON().state;
		if( !_.isUndefined( app.views.planningInterListView.filterValue ) ){
			var filter = _(app.views.planningInterListView.filterValue).strRight('-');
			if( state!=filter )	{
				if ( 	state==app.Models.Intervention.status.cancelled.key ||
						state==app.Models.Intervention.status.scheduled.key ||
						state==app.Models.Intervention.status.open.key )
					return true;						
			}
		}
		return false;
	},
	
	/**
	 * Process Table accordion event
	 */
	tableAccordion: function(e){	
		e.preventDefault();
		//fold up current accordion and expand 
		this.expendAccordion();		   
	},
	
	/**
	 * Expan accordion
	 */
	expendAccordion: function(){
		// Retrieve the intervention ID //
		//var id = _($(e.target).attr('href')).strRightBack('_');
		var id = this.model.toJSON().id.toString();
		var self = this;
	
		var isExpend = $('#collapse_'+id).hasClass('expend');
	
		// Reset the default visibility //
		$('tr.expend').css({ display: 'none' }).removeClass('expend');
		$('tr.row-object').css({ opacity: '0.45'});
		$('tr.row-object > td').css({ backgroundColor: '#FFF'});
		
		
		// If the table row isn't already expend //       
		if(!isExpend){
			// Fetch tasks
			if(!_.isUndefined(this.detailedView)){
				this.detailedView.fetchData().done(function () {
					self.detailedView.render();
				});
			}
			
			// Set the new visibility to the selected intervention //
			$('#collapse_'+id).css({ display: 'table-row' }).addClass('expend');
			$(this.el).parents('tr.row-object').css({ opacity: '1'});  
			$(this.el).parents('tr.row-object').children('td').css({ backgroundColor: "#F5F5F5" }); 
		}
		else {
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
	},		
	
	/** Display the form to add / update an intervention
		*/
	displayModalSaveInter: function(e){
		e.preventDefault();
		var params = {el:'#modalSaveInter'}
		params.model = this.model;
		new app.Views.ModalInterventionView(params);
	},
	
	/**
	 * Display the form to cancel intervention
	 */
	displayModalCancelInter: function(e) {
		e.preventDefault();
		new app.Views.ModalCancelInterventionView({el: '#modalCancelInter', model: this.model });
	},


});