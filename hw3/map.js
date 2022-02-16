var tableObjects = [];
var markers = [];
let geocoder;
let map;

class Contact{
  constructor(name, address, info, img){
    this.name = name;
    this.address = address;
    this.info = info;
    this.img = img;
  }
}

function initMap() {
  // The location of Uluru
  const uofM = { lat: 44.9727, lng: -93.23540000000003 };
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
}

function getTableObjects(){
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
    tableObjects.push(new Contact(name, address, info, img));
  }
  geocodeTableObjects();
}

function geocode(request) {
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      map.setCenter(results[0].geometry.location);
      const marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
      });
      markers.push(marker);
      return results;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}

function geocodeTableObjects(){
  for(var object of tableObjects){
    geocode({address : object.address});
  }
}
  

window.addEventListener("load", getTableObjects);
