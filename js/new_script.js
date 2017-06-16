
      		var map;
      		var markers = [];
      		var info_windows = [];
      		var my_neighbourhood = {lat: 39.5364820,lng: -104.8970680};
      		
        // These are the initial options

	      	function initMap()
	      	{
	      		var style_blue_essence = 
				[{"featureType":"landscape.natural",
				"elementType":"geometry.fill","stylers":[{"visibility":"on"},
				{"color":"#e0efef"}]},{"featureType":"poi",
				"elementType":"geometry.fill","stylers":[{"visibility":"on"},
				{"hue":"#1900ff"},{"color":"#c0e8e8"}]},
				{"featureType":"road","elementType":"geometry",
				"stylers":[{"lightness":100},{"visibility":"simplified"}]},
				{"featureType":"road","elementType":"labels",
				"stylers":[{"visibility":"off"}]},
				{"featureType":"transit.line","elementType":"geometry",
				"stylers":[{"visibility":"on"},{"lightness":700}]},
				{"featureType":"water","elementType":"all",
				"stylers":[{"color":"#7dcdcd"}]}];

		        map = new google.maps.Map(document.getElementById('map'), {
		          center: my_neighbourhood,
		          zoom: 15,
		          styles: style_blue_essence
		        });

		        ko.applyBindings(new myViewModel());

		        function myViewModel(){
		        	var self = this;
		        	self.availablePlaces = ko.observableArray(['bakery', 'cafe', 'restaurant', 'store']); 
					self.selectedOptionValue = ko.observable('cafe'); 
					allItems = ko.observableArray();
					self.searchPlaces = ko.observable();
					
					ko.computed(function(){
						//console.log(self.selectedOptionValue);
						var request = {
							location: my_neighbourhood,
							radius: '500',
							query: self.selectedOptionValue()
						};
						service = new google.maps.places.PlacesService(map);
						service.textSearch(request,callback);
						});
					
					function callback(results,status){
							allItems.removeAll();
							for(i=0;i<results.length;i++){
								allItems.push(results[i].name);
								//console.log(results[i].name);
							}
						}
				
				}
			}


