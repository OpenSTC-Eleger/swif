/******************************************
* Row Intervention View
*/
app.Views.ItemTaskDayListView = Backbone.View.extend({

	tagName     : 'section',

	templateHTML : 'items/itemTaskDayList',
	
	className   : 'accordion-group',

	// The DOM events //
	events       : {
		

	},



	/** View Initialization
	*/
	initialize : function() {

		// When the model are updated //
		this.listenTo(this.options.tasks, 'change', this.change);
	},
	
	change: function(model){
		this.partialRender();
	},
	
	displayTodayAccordion: function(){
		$(this.el).addClass('collapse-selected');
		//@TODO: Perhaps need another name for day data ;)

		this.accordion.addClass('in');
	},
	
	//Render only Badges and table or alert msg (according presence or not of tasks)
	partialRender: function(){
		//Display table if there is tasks, else display info msg
		if(this.options.tasks.length > 0){
			$(this.el).find('.alert').css('display','none');
			$(this.el).find('.table').css('display','table');
		}
		else{
			$(this.el).find('.alert').css('display','block');			
			$(this.el).find('.table').css('display','none');
		}
		//get Nb of pending Tasks
		var pendingTasks = 0;
		_.each(this.options.tasks.models, function(task, i){
			if(task.toJSON().state == app.Models.Task.status.open.key){
				pendingTasks++;
			}
		});
		//If there is pending Tasks, we display it with badge, else, we let badge without html content (making it hidden)
		if(pendingTasks>0){
			$(this.el).find('.badge.pendingTasks').html(pendingTasks.toString());
		}
		$(this.el).find('.badge.nbTasks').html(this.options.tasks.length.toString());
		
	},
	
	/** Display the view
	*/
	render : function() {
		var self = this;


		// Retrieve the template // 
		$.get("templates/" + this.templateHTML + ".html", function(templateData){

		 
			var template = _.template(templateData, {
				lang                    : app.lang,
				pendingTask				: self.options.tasks.length,
				day						: self.options.day
			});

			$(self.el).html(template);
			
			if(_.isUndefined(this.accordion)){
				self.accordion = $('#accordion_' + self.options.day.day());
			}
			
			//create itemTaskDay for each task of the day
			_.each(self.options.tasks.models, function(task, i){
				self.accordion.find('tbody').append(new app.Views.ItemTaskDayView({parent: self, model: task}).render().el);
			});
			
			self.partialRender();
			
			
			if(self.options.day.isSame(moment(), "day")){
				self.displayTodayAccordion();
			}
			
		});
		$(this.el).hide().fadeIn('slow'); 
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