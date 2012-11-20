/******************************************
* Dropdown List View
*/
openstm.Views.DropdownSelectListView = Backbone.View.extend({
	
	dropdownListView: new Array(),
			
	
	/** View Initialization
	*/
	initialize: function(){
	    _.bindAll(this, 'addOne', 'addAll');
	    this.collection.bind('reset', this.addAll);
	},


	addOne: function(model){        	
		dropdownSelectItemView = new openstm.Views.DropdownSelectItemView({ model: model });
		this.dropdownListView[model.get("id")] = dropdownSelectItemView;
		$(this.el).append(dropdownSelectItemView.render(false).el); 
	},


	addAll: function(){
	    this.collection.each(this.addOne);
	    console.log($(this.el));
	},  


	setSelectedItem: function(id) {
		this.dropdownListView[id].setSelected();
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
		$(this.el).attr('value', this.model.get('id')).html(this.model.get('name'));
		if (select)
			$(this.el).attr('selected', 'true');      	
		
		return this;
	},
    

	/** Selected the site
	*/
    setSelected: function() {
    	this.render(true);
    }
        
});