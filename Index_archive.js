
      		var map;
      		var info_windows = [];
      		var my_neighbourhood = {lat: 39.5364820,lng: -104.8970680};

      		

      		
      		
        // These are the initial options

	      	function initMap()
	      	{
	      		var placeNames = [];
	      		var markers = [];
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

		        request = {
							location: my_neighbourhood,
							radius: '500',
							query: 'restaurant'
						};

				service = new google.maps.places.PlacesService(map);
				service.textSearch(request,callback);

				function callback(results,status){
					geocoding_service = new google.maps.Geocoder();
					for(i=0;i<20;i++){
						//fetching required info from results into indi vairables for easy reference
						placeAddress = results[i].formatted_address;
						placeName = results[i].name;
						placeID = results[i].place_id;
						
						placeNames.push(placeName);

						

						geocoding_service.geocode({'placeId': placeID},geoCallback);

						

						function geoCallback(results,status){
							if (status == 'OK'){
								this.marker = new google.maps.Marker({
									position: results[0].geometry.location,
			        				animation: google.maps.Animation.DROP
			        			});
			        			this.marker.setMap(map);
			        			updateMarkerArray(marker);
		
		        			}
		        			

		        			//places[i].marker = marker;
		        			//places.push({'name': this.placeName, 'marker': marker});
						} 
					}

					//console.log('Total Places:' +placeNames.length);
					//console.log(this.markers_inside.length);
					ko.applyBindings(new myViewModel(placeNames, markers));
					
				}


				
				

		        
				

		        function myViewModel(placeNames, markers){
		        	var self = this;
		        	//self.availablePlaces = ko.observableArray(['bakery', 'cafe', 'restaurant', 'store']); 
					//self.selectedOptionValue = ko.observable('cafe'); 
					
					self.searchString = ko.observable();
					allPlaces = ko.observableArray();
					
					console.log('Total Places:' +placeNames.length);
					console.log('Total Markers:' +markers.length);
					
				}
				
				}
			


