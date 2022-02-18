var tableObjects = [];
var markers = [];
var infoWindows = [];
let geocoder;
let userPosition;
let map;
let map2;
let directionsRenderer;
const uofM = { lat: 44.9727, lng: -93.23540000000003 };

class Contact{
  constructor(name, address, info, img, pos, row){
    this.name = name;
    this.address = address;
    this.info = info;
    this.img = img;
    this.pos = pos;
    this.row = row;
  }
}

function initMap() {
  // The location of Uluru
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: uofM,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: uofM,
    map: map,
  });
  geocoder = new google.maps.Geocoder();
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        let latElement = document.getElementById("targetLat");
        let lngElement = document.getElementById("targetLng");
        let distElement = document.getElementById("targetDistance");
        let d = dist(userPosition, uofM);
        latElement.value = uofM.lat;
        lngElement.value = uofM.lng;
        distElement.value = d;
      }
    )
  }
  var input = document.getElementById('directionsFrom'); 
  var autocomplete = new google.maps.places.Autocomplete(input); 
}

function getTableObjects(){
  document.getElementById("locationCategory").onchange = toggleOther;
  document.getElementById("submitLocation").addEventListener("click", submitLocation);
  document.getElementById("submitDirections").addEventListener("click", displayDirections);
  let contactSelectElement = document.getElementById("contactDirectionSelect");
  var table = document.getElementById("contacts");
  var rows = table.rows;
  for(let row of rows){
    var name = row.cells[0].innerText;
    if(name == "Name"){
      continue;
    }
    var address = row.cells[2].innerText;
    var info = row.cells[3].innerText;
    var img = row.querySelector("img");
    tableObjects.push(new Contact(name, address, info, img, undefined, row));
    let option = document.createElement("option");
    option.text = name;
    contactSelectElement.add(option);
  }
  geocodeTableObjects();
}

function dist(pos1, pos2){ //from https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
  var R = 6371.0710;
  var rlat1 = pos1.lat * (Math.PI/180);
  var rlat2 = pos2.lat * (Math.PI/180);
  var difflat = rlat2- rlat1;
  var difflon = (pos2.lng - pos1.lng) * (Math.PI/180);

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  return d * 1000;
}

function geocode(request, contact) {
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;
      contact.pos = {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()};
      let marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
      });
      markers.push(marker);
      const contentString = '<div class="listbox"><p>' + "<strong>" + contact.name + "</strong>" + "<br>" + "<div><img src=" + contact.img.src + " alt=" + contact.img.alt + ' class="infowindowimg"' + "/></div>" + contact.address + "<br>" + contact.info + "<br></p></div>";
      let infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
      infoWindows.push(infowindow);
      google.maps.event.addListener(marker, "click", function(){
          infowindow.open({
            anchor : marker,
            map,
            shouldFocus : false,
          })
      });
      contact.row.addEventListener("mouseover", function(){
        let latElement = document.getElementById("targetLat");
        let lngElement = document.getElementById("targetLng");
        let distElement = document.getElementById("targetDistance");
        let d = dist(userPosition, contact.pos);
        latElement.value = contact.pos.lat;
        lngElement.value = contact.pos.lng;
        distElement.value = d;
      })
      return results;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}

function geocodeTableObjects(){
  for(let i = 0; i < tableObjects.length; i++){
    let contact = tableObjects[i];
    geocode({address : contact.address}, contact);
  }
}

function submitLocation(event){
  event.preventDefault();
  let radiusElement = document.getElementById("locationRadius");
  let categoryElement = document.getElementById("locationCategory");
  let otherElement = document.getElementById("otherKeyword");
  var request = {
    location : uofM,
    radius : radiusElement.value,
    name : categoryElement.options[categoryElement.selectedIndex].innerText == "Other" ? otherElement.value : categoryElement.options[categoryElement.selectedIndex].innerText
  };
  console.log(request);
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // while(markers){
      //   markers[0].setMap(null);
      //   markers.pop();
      // }
      while(markers.length > 0){
        markers[0].setMap(null);
        markers.shift();
      }
      for (let i = 0; i < results.length; i++) {
        let infowindow;
        let marker = new google.maps.Marker({
          map,
          position: results[i].geometry.location,
        })
        marker.place_id = results[i].place_id;
        markers.push(marker);
        infowindow = new google.maps.InfoWindow({
          content: ""
        })
        google.maps.event.addListener(marker, "click", function(){
          var detailsRequest = {
            placeId: marker.place_id,
            fields: ['name', 'formatted_address']
          };
          service.getDetails(detailsRequest, function(place, status){
            console.log(place);
            if(status == google.maps.places.PlacesServiceStatus.OK){
              infowindow.setContent("<strong>" + place.name + "</strong>" + "<br>" + place.formatted_address);
              infowindow.open({
                anchor : marker,
                map,
                shouldFocus : false,
              })
            }
          })
        })
        // service.getDetails(detailsRequest, function(place, status){
        //   console.log(status);
        //   if(status == google.maps.places.PlacesServiceStatus.OK){
        //     infowindow = new google.maps.InfoWindow({
        //       content: place.name + "<br>" + place.formatted_address
        //     });
        //     infoWindows.push(infowindow);
        //     google.maps.event.addListener(marker, "click", function() {
        //       infowindow.open({
        //         anchor : marker,
        //         map,
        //         shouldFocus : false,
        //       })
        //     })
        //   }
        // })
      }
      //map.setCenter(results[0].geometry.location);
    }
  });
}

function toggleOther(){
  let listElement = document.getElementById("locationCategory");
  let otherKeywordElement = document.getElementById("otherKeyword");
  if(listElement.options[listElement.selectedIndex].innerText == "Other"){
    otherKeywordElement.disabled = false;
  }
  else{
    otherKeywordElement.disabled = true;
  }
}

function displayDirections(){ //from https://developers.google.com/maps/documentation/javascript/directions
  var directionsService = new google.maps.DirectionsService();
  if(directionsRenderer){
    directionsRenderer.setMap(null);
    directionsRenderer = null;
  }
  directionsRenderer = new google.maps.DirectionsRenderer();
  var srcElement = document.getElementById("directionsFrom");
  var src = srcElement.value == "Default (current location)" ? new google.maps.LatLng(userPosition.lat, userPosition.lng) : srcElement.value;
  var dest;
  var contactSelectElement = document.getElementById("contactDirectionSelect");
  var selectedMode = document.querySelector('input[name="directionsType"]:checked').value;
  for(let i in tableObjects){
    let contact = tableObjects[i];
    if(contactSelectElement.value == contact.name){
      console.log(contactSelectElement.value, contact.name);
      dest = new google.maps.LatLng(contact.pos.lat, contact.pos.lng);
    }
  }
  if(src && dest){
    directionsRenderer.setMap(map);
    var request = {
      origin: src,
      destination: dest,
      travelMode: google.maps.TravelMode[selectedMode],
    }
    console.log(request);
    directionsService.route(request, function(response, status){
      if(status == 'OK'){
        directionsRenderer.setDirections(response);
      }
    })
  }
}
  

window.addEventListener("load", getTableObjects);
//document.getElementById("submitLocation").addEventListener("click", submitLocation);
