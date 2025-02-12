var map = L.map('map', {
center: [48.11, -1.64], // y,x
zoom: 14, 
attributionControl: true});

// Ajouter une attribution personnalisée directement via la carte
map.attributionControl.addAttribution
('Réalisation : <a href="https://sites-formations.univ-rennes2.fr/mastersigat/" target="_blank">Master SIGAT</a> / Sources : OSM & Rennes Métropole');

// Ajouter des fonds de carte
var basemaps = {
  OSM: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {opacity: 0.5}).addTo(map), // .addTo(map) permet de dire le fond de carte de base
  STADIA: L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'),
  ESRI: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'),
  // Fond WMS
OrthoRM: L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers: 'raster:ortho2021'}),
PlanRM: L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers: 'ref_fonds:pvci_simple_gris'})
};

// Ajout de couches WMS
var Cadastre = L.tileLayer.wms('http://geobretagne.fr/geoserver/cadastre/wms',
{layers: 'CP.CadastralParcel',format: 'image/png',transparent: true}); // transparent: true permet de voir comme une couche et non un fond de carte
var TrafficTR = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'trp_rout:v_rva_trafic_fcd',format: 'image/png',transparent: true, opacity: 0.7});
var Batiments = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'ref_cad:batiment',format: 'image/png',transparent: true});
var Velo = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'trp_doux:v_voirie_amenagement_velo',format: 'image/png',transparent: true});

// Ajout des marqueurs de Stations de vélos
var url = 'https://raw.githubusercontent.com/mastersigat/data/main/velostar.geojson';
$.getJSON(url, function (geojson) {
var velos = L.geoJson(geojson).addTo(map);
  // Ajout Popup avec infos du jeu de données
velos.bindPopup(function(velos) {console.log(velos.feature.properties);
return "<h1> Station : "+velos.feature.properties.nom+"</h1>"+"<hr><h2>"
+velos.feature.properties.nombreemplacementstheorique+ "&nbsp; vélos</h2>" ;
});
})

// Ajouter l'echelle cartographique
L.control.scale().addTo(map);

// Ajouter une MiniMap
var miniMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png');
var miniMap = new L.Control.MiniMap(miniMapLayer, { toggleDisplay: true, minimized: false, position: 'bottomright'}).addTo(map);

// Ajouter des marqueurs manuels
  // Commande pour définir le contenue de la pop-up
var popuprennes2 = '<h1>Université Rennes 2 </h1> <h2>Où se situe la salle SIGAT</h2> <br> <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Campus_Villejean_-_Rennes.jpg" width="350px">';
var customOptions = {'maxWidth': '500', 'className' : 'custom'}

  // Type d'icone
var rennes2icone = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/fr/2/23/Logo_univ-rennes2-2016.svg',
  iconSize: [40, 40]}); 
var gareicone = L.icon({
  iconUrl: 'https://malignej.transilien.com/wp-content/uploads/2015/03/gare.png',
  iconSize: [50, 50]}); 

  // Position de l'icone
var Rennes2 = L.marker([48.119, -1.7013], {icon: rennes2icone}).bindPopup(popuprennes2,customOptions);
var Gare = L.marker([48.103, -1.672], {icon: gareicone}).bindPopup('<b>Gare SNCF Renne</b>');

  // Ajouter un gestionnaire d'événements pour le survol (hover)
Gare.on('mouseover', function (e) {
this.openPopup();
});
  // Ajouter un gestionnaire d'événements pour quitter le survol (hover)
Gare.on('mouseout', function (e) {
this.closePopup();
});

  // Gestion & centarlisation des marqueurs 
var couches = {"Université Rennes2": Rennes2, "Gare de Rennes": Gare, "Cadastre": Cadastre, "Traffic en temps réelle": TrafficTR, "Bâtiments": Batiments, "Vélo": Velo};

// Ajout des menus
  // Fonction pour ajouter un titre à un menu
function ajouterTitre(menu, titre) {
    var container = menu.getContainer();
    var titreElement = L.DomUtil.create('div', 'menu-title', container);
    titreElement.innerHTML = `<strong>${titre}</strong>`;
}

  // Menu : Fond de carte
var menu1 = L.control.layers(basemaps, null, {position: 'topright', collapsed : true }).addTo(map); // collapsed permet d'avoir un menu ouvert ou fermé

  // Menu : Couches
var menu2 = L.control.layers(null, couches, {position: 'topleft', collapsed : false }).addTo(map); // Peut mettre le deux ou plus L.control.layers en un seul juste besoin des bons null, marqueurs, ect...

// Ajouter les titres
ajouterTitre(menu1, "Fonds de carte");
ajouterTitre(menu2, "Couches thématiques");

// Ajouter un peu de style CSS (optionnel)
var style = document.createElement('style');
style.innerHTML = `
    .menu-title {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 5px;
    }
`;
document.head.appendChild(style);