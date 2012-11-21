/******************************************
* Dropdown List View
*/
openstm.Views.DropdownSelectListView = Backbone.View.extend({
	
	events: {
		"change": "changeSelected"
	},

	dropdownListView: new Array(),
			
	
	/** View Initialization
	*/
	initialize: function(){
	    _.bindAll(this, 'addOne', 'addAll');
	    this.collection.bind('reset', this.addAll);
	},

	addEmptyFirst: function(){        	
		dropdownSelectItemView = new openstm.Views.DropdownSelectItemView({});
		this.dropdownListView[0] = dropdownSelectItemView;
		$(this.el).append(dropdownSelectItemView.render(false).el); 
	},

	addOne: function(model){        	
		dropdownSelectItemView = new openstm.Views.DropdownSelectItemView({ model: model });
		this.dropdownListView[model.get("id")] = dropdownSelectItemView;
		$(this.el).append(dropdownSelectItemView.render(false).el); 
	},

	removeOne: function(id){
		this.dropdownListView[0].hide();
	},

	addAll: function(){
	    this.collection.each(this.addOne);
	},

	clearAll: function(){
		$(this.el).empty(); 
	},  

	setSelectedItem: function(id) {
		this.dropdownListView[id].setSelected();
	},

	getSelected: function() {
		if (typeof this.dropdownListView[this.selected_id] != "undefined") {
			return this.dropdownListView[this.selected_id].model;
		} else {
			return false;
		}
	},

	changeSelected: function() {
		this.selected_id = $(this.el).val();	
	}
});



/******************************************
* Dropdown list item View
*/
openstm.Views.DropdownSelectItemView = Backbone.View.extend({
        
    tagName: "option",
    selected: false,

        
	/** View Initialization
	*/
	initialize: function(){
		_.bindAll(this, 'render');
	},


	/** Display the view
	*/
	render: function(select){
		if (this.model) {
			$(this.el).attr('value', this.model.get('id')).html(this.model.get('name'));
		} else  {
			$(this.el).attr('value', '');
		}
		if (select)
			$(this.el).attr('selected', 'true');      	
		
		return this;
	},
    

	/** Selected the site
	*/
    setSelected: function() {
    	this.render(true);
    },
        
    hide: function() {
	$(this.el).attr('disabled', 'disabled');
	$(this.el).attr('style', 'display:none');
    },
        
    show: function() {
	$(this.el).removeAttr('disabled');
	$(this.el).attr('style', 'display:inline');
    },
});
