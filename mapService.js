app = angular.module('mapServices');

app.factory('mapService', function(){
    return {};
});


app.directive('leafletMap', function(){
    return {
        restrict: 'A',
        scope: {
            data: '=',
        },
         templateUrl: 'js/templates/display/map.htm',
        // template: '<div dw-loading="map-loading" dw-loading-options="{text: \'Chargement des données\'}" ng-options="{ text: \'\', className: \'custom-loading\', spinnerOptions: {radius:30, width:8, length: 16, color: \'#f0f\', direction: -1, speed: 3}}"></div><div id="mapd"></div>',
        controller: function($scope, $routeParams, $http, $filter, $q, $rootScope, LeafletServices, mapService, configServ, dataServ, $timeout, $loading){
            /*
             */

            // Déclaration des variables globales dans la directive leafletMap
            var map = null; // la carte 
            var toutesDonnees = null; // couche de données 
            var zoneSensibles = null; // couche de données "zones sensibles"
            var mortalite = null; // couche de données "mortalités"
            var troncons = null; // couche de données "troncons à risque"
            var tileLayers = {}; // couche pour les fonds de référence
            var geoms = []; //
            var currentSel = null; // la géometrie séléctionnée en détail
            var layerControl = null; // couches de contrôle pour la légende Leaflet
            var resource = null;  // fait référence au fichier JSON de la gestion des couches dans la carte 

    
/* Configuration des fonds de référence ==> dans  js/resource
*  et initialisation de la carte et ses contrôles
*/
            var initializeCarte = function(configUrl){ 
                var dfd = $q.defer();
                // Ajout de la carte 
                try{
                    map = L.map('mapd', { 
                            maxZoom: 17,
                            fullscreenControl:true, // ajout de l'option plein écran 
                            fullscreenControlOptions:{
                                position:'topright',
                                title: 'Afficher en plein écran !',
                            }                           
                          });
                    //Initialisation des couches géométriques sur la carte 
                    // toutesDonnees  = L.markerClusterGroup();
                    zoneSensibles  = L.markerClusterGroup();
                    mortalite	   = L.markerClusterGroup();
                    troncons	   = L.markerClusterGroup();
                    zoneSensibles.addTo(map);

                    /* Condition qui vérifie dans la légende js/template/display/map.html (div legende)
                     * si les Zones Sensibles sont cochées par défault "checked"
                     * Cela évite de faire directement "zoneSensibles.addTo(map)" qui va afficher les zones 
                     * zones sensibles si la case est décochée (sauvegarde en localStorage) et qu'on change de page 
                     */
                    // if ($('input[id="zs"]').is(':checked')){
                    //     zoneSensibles.addTo(map); 
                    // }

                                     
                    /* Récupération de l'url de données avec getUrl de configServ
                     * Url fourni dans les contôles des base (exemple : cablesControllers.js)
                     */
                    configServ.getUrl(configUrl, function(res){
                        resource = res[0];
                        /* Chargement des fonds de référence : 
                         *  layers ==> baselayers définis defaultMap.json
                         */
                        resource.layers.baselayers.forEach(function(_layer, name){ 
                            var layerData = LeafletServices.loadData(_layer);
                            tileLayers[layerData.name] = layerData.map;
                            if(layerData.active){
                                layerData.map.addTo(map);
                            }
                        });
                        // Ajout du boutton pour ouvrir et fermer le bloc contenant la légende
                        L.easyButton('fa-bars', function(){
                            sidebar.toggle()}, {
                            position:"topright"}
                        ).addTo(map);
                            
                        /* Initialisation de la vue de la carte avec les fonds
                        *  center: {lat, lng et zoom} défini dans defaulMap.json
                        */
                        map.setView(
                            [resource.center.lat, resource.center.lng], 
                            resource.center.zoom);

                            // ajout d'un panneau de type sidebar pour contenir la légende
                        var sidebar = L.control.sidebar('legende', {
                            closeButton: true,
                            position: 'left', 
                        });
                        map.addControl(sidebar);

                        // Ouverture automatiqument du panneau 
                        setTimeout(function () {
                            sidebar.show();
                        },500);

                        /* Fonction qui sauvegarde des choix au niveau de la légende
                         * pendant toute l'utilisation de l'application
                         * A simplifier 
                         */
                        (function() {
                            var boxes = document.querySelectorAll("input[type='checkbox']");
                            for (var i = 0; i < boxes.length; i++) {
                                var box = boxes[i];
                                if (box.hasAttribute("value")) {
                                    setupBox(box);
                                }
                            }
                            function setupBox(box) {
                                var storageId = box.getAttribute("value");
                                var oldVal    = localStorage.getItem(storageId);
                                box.checked = oldVal === "true" ? true : false;
                                
                                box.addEventListener("change", function() {
                                    localStorage.setItem(storageId, this.checked); 
                                });
                            }
                        })();                                       
                        
                        /* Sauvegarde de la vue et niveau de zoom de la carte
                         * pendant toute l'utilisation de l'application
                         */
                        if (!map.restoreView()) {
                            map.setView([45.6662213, 6.8417282], 9);
                        }
  
                        /* Initialisation de la fonction pour afficher et masquer les couches
                         * avec un checkbox sur la légende ==> voir js/template/display/map.html (div legende)
                         */
                        $scope.layerToggle = function(){
                            layerClicked = event.currentTarget.value;
                            layerClicked = eval(layerClicked);

                            if (map.hasLayer(layerClicked)) {
                                map.removeLayer(layerClicked);
                            }
                            else{
                                map.addLayer(layerClicked);
                            } 
                        };     

                                  
                        layerControl = L.control.layers(
                        ///////////////// Fonds ////////////////
                        tileLayers, {
                            'Zones Sensibles': zoneSensibles,
                            'Mortalité': mortalite,
                            'troncons à risque': troncons,
                        }, { collapsed: false
                        });


                        layerControl.addTo(map);  
                        layerControl._container.remove(); // suppression de la légande de Leaflet par défaut
                        document.getElementById('legende').appendChild(layerControl.onAdd(map));
                                
                        //Ajout de l'échelle 
                        L.control.scale().addTo(map);                     

                        dfd.resolve();
                    });

                }
                catch(e){
                	// vidange des données à chaque fois que la page est rechargée
                    // toutesDonnees.clearLayers();
                    zoneSensibles.clearLayers();
                    mortalite.clearLayers();
                    troncons.clearLayers();
                    geoms.splice(0);
                    dfd.resolve();
                }

                // var getVisibleItems = function(){
                //     var bounds = map.getBounds();
                //     var visibleItems = [];
                //     geoms.forEach(function(item){
                //         try{
                //             var _coords = item.getLatLng();
                //         }
                //         catch(e){
                //             var _coords = item.getLatLngs();
                //         }
                //         try{
                //             if(bounds.intersects(_coords)){
                //                 visibleItems.push(item.feature.properties.id);
                //             }
                //         }
                //         catch(e){
                //             if(bounds.contains(_coords)){
                //                 visibleItems.push(item.feature.properties.id);
                //             }
                //         }
                //     });
                
                //     return visibleItems;
                // };
                // mapService.getVisibleItems = getVisibleItems;

// déclaration des controles sur la cartes depuis d'autres fonctionnalités (formDirective = création, édition...)
                var getLayerControl = function(){
                    return layerControl;
                };
                mapService.getLayerControl = getLayerControl;

// déclaration des objets JSON qui sont vides depuis d'autres fonctionnalités (formDirective = création, édition...)
// seront remplis par la suite avec addgeoms
                var getLayer = function(){
                    // return toutesDonnees;
                    return zoneSensibles;
                    return mortalite;
                    return troncons;
                };
                mapService.getLayer = getLayer;

// déclaration de la carte depuis d'autres fonctionnalités (formDirective = création, édition...)
                var getMap = function(){
                    return map;
                }
                mapService.getMap = getMap;

//retourne la liste des géométries
                var getGeoms = function(){
                    return geoms;
                }
                mapService.getGeoms = getGeoms;

// filtre qui afiiche uniquement la géometrie filtrée sur la carte à partir du tableau
                var filterData = function(ids){
                    angular.forEach(geoms, function(geom){
                        if(ids.indexOf(geom.feature.properties.id) < 0){
                            geom.feature.$shown = false;
                            zoneSensibles.removeLayer(geom);
                            mortalite.removeLayer(geom);
                            troncons.removeLayer(geom);
                        }
                        else{
                            if(geom.feature.$shown === false){
                                geom.feature.$shown = true;
                                zoneSensibles.addLayer(geom);
                                mortalite.addLayer(geom);
                                troncons.addLayer(geom);
                            }
                        }
                    });
                };
                mapService.filterData = filterData;

//factorisation de la selection des points, lignes et polygones
// recentrage des objets (emprise et zoom) quand on clique sur un objet sur la carte
// fonction à factoriser peut être //////////////////////////////
                var getItem = function(_id, geoms){
                    var res = geoms.filter(function(item){
                        return item.feature.properties.id == _id;
                    });             
                    if(res){
                        try{
                            /*
                             * centre la carte sur le point sélectionné
                             */
                            map.setView(res[0].getLatLng(), Math.max(map.getZoom(), 13));
                            return res[0];
                        }
                        catch(e){
                            /*
                             * centre la carte sur la figure sélectionnée
                             */
                            map.fitBounds(res[0].getBounds());
                            return res[0];
                        }
                    }
                    return null;
                };
               
                mapService.getItem = getItem;

/* factorisation aussi du changement d'état :points , lignes et polygones 
 * changement de couleur lorsqu'un élément est sélectionné sur la carte et la liste
 */
                var changeColorItem = function(item, _status){
                    var iconUrl = 'js/lib/leaflet/images/marker-icon.png';
                    var polygonColor = '#03F'; 
                    var zOffset = 0;
                    if(_status){
                        iconUrl = 'js/lib/leaflet/images/marker-rouge.png';
                        polygonColor = '#F00'; 
                        zOffset = 1000;
                    }
                    try{
                        item.setIcon(L.icon({
                            iconUrl: iconUrl, 
                            shadowUrl: 'js/lib/leaflet/images/marker-shadow.png',
                            iconSize: [25, 41], 
                            iconAnchor: [13, 41],
                            popupAnchor: [0, -41],
                        }));
                        item.setZIndexOffset(zOffset);
                    }
                    catch(e){
                        item.setStyle({
                            color: polygonColor,
                        });
                    }
                };

 // recentrage sur un objet dans la carte quand on clique sur une ligne dans tableau
                var selectItem = function(_id){
                    var sel = getItem(_id, geoms);
                                        
                    if(currentSel){
                        changeColorItem(currentSel, false);
                    }
                    
                    changeColorItem(sel, true);
                    currentSel = sel;
                    return sel;

                };
                mapService.selectItem = selectItem; 

/////////////////// Debut ajout des couches metier //////////////////////////////////////
                /* Debut 
                 * Ajout des zones sensibles
                 */
                addZoneS = function(jsonData){
                    // Création de la couche GeoJSON leaflet
                    var geom = L.GeoJSON.geometryToLayer(jsonData);                    
                    // Initialisation des évenements onclick et show label 
                    geom.feature = jsonData;
                    geom.on('click', function(e){
                        $rootScope.$apply(
                            $rootScope.$broadcast('mapService:itemClick', geom)    
                        );
                    });
                    // On click == affiche le label et recentrage 
                    if(jsonData.properties.geomLabel){
                        geom.bindPopup(jsonData.properties.geomLabel);
                    }
                    try{
                        geom.setZIndexOffset(0);
                    }
                    catch(e){}
                    /* ajout de la géometrie dans le tableau [geoms]
                     * pour l'utiliser dans les fonctions d'évenements 
                     */                
                    geoms.push(geom);                       
                    //ajout du JSON à la couche geom
                    zoneSensibles.addLayer(geom);                  
                };
                mapService.addZoneS = addZoneS;

                var setZoneS = function(resp){

                    var tmp = [];
                
                    $scope.items = resp;
                    resp.forEach(function(item){
                        mapService.addZoneS(item);
                      });
                    $scope.geoms = resp; 
                    $scope.data = tmp;
                    dfd.resolve('loading data');
                };
                dataServ.get('cables/aires' , setZoneS);
                
/////////////////// Fin  Zones sensibles //////////////////////////////////////

                /* Debut 
                 * Ajout des mortalités
                 */
                addMort = function(jsonData){
                    // Création de la couche GeoJSON leaflet
                    var geom = L.GeoJSON.geometryToLayer(jsonData);
                    // Initialisation des évenements onclick 
                    geom.feature = jsonData;
                    geom.on('click', function(e){
                        $rootScope.$apply(
                            $rootScope.$broadcast('mapService:itemClick', geom)    
                        );
                    });
                    // On click == affiche le label et recentrage 
                    if(jsonData.properties.geomLabel){
                        geom.bindPopup(jsonData.properties.geomLabel);
                    }
                    try{
                        geom.setZIndexOffset(0);
                    }
                    catch(e){}
                                   
                    /* ajout de la géometrie dans le tableau [geoms]
                     * pour l'utiliser dans les fonctions d'évenements 
                     */   
                    geoms.push(geom); 
                      
                    mortalite.addLayer(geom);
                  
                };
                mapService.addMort = addMort;

                
                var setMort = function(resp){
                    var tmp = [];
                
                    $scope.items = resp;
                    resp.forEach(function(item){
                        tmp.push(item.properties);
                        mapService.addMort(item);
                      });
                    $scope.geoms = resp; 
                    $scope.data = tmp;
                    dfd.resolve('loading data');
                };
                    
                dataServ.get('cables/mortelec' , setMort);
/////////////////// Fin Mortalité //////////////////////////////////////
                /* Debut 
                 * Ajout des troncons 
                 */
                addTron = function(jsonData){
                    // Création de la couche GeoJSON leaflet
                    var geom = L.GeoJSON.geometryToLayer(jsonData);
                    // Initialisation des évenements onclick 
                    geom.feature = jsonData;
                    geom.on('click', function(e){
                        $rootScope.$apply(
                            $rootScope.$broadcast('mapService:itemClick', geom)    
                        );
                    });
                    // On click == affiche le label et recentrage 
                    if(jsonData.properties.geomLabel){
                        geom.bindPopup(jsonData.properties.geomLabel);
                    }
                    try{
                        geom.setZIndexOffset(0);
                    }
                    catch(e){}

                    /* ajout de la géometrie dans le tableau [geoms]
                     * pour l'utiliser dans les fonctions d'évenements 
                     */                 
                    geoms.push(geom); 
                      
                    troncons.addLayer(geom);
                  
                };
                mapService.addTron = addTron;

                var setTron = function(resp){
                    var tmp = [];
                
                    $scope.items = resp;
                    resp.forEach(function(item){
                        tmp.push(item.properties);
                        mapService.addTron(item);
                      });
                    $scope.geoms = resp; 
                    $scope.data = tmp;
                    dfd.resolve('loading data');
                };
                    
                dataServ.get('cables/tronconserdf' , setTron);
/////////////////// Fin Tronçons à risque//////////////////////////////////////
                

                    
//Chargement de la géometrie en mode détail édition de données. Utilisé aussi dans formDirective
               var loadData = function(url){
                    var defd = $q.defer();
                    $loading.start('map-loading');
                    configServ.get(url, function(resp){
                        if(resp){
                            url = resp.url;
                        }
                    });
                    dataServ.get(url, dataLoad(defd));
                    return defd.promise;
                };
                mapService.loadData = loadData;


                var dataLoad = function(deferred){
                    return function(resp){
                        if(resp.filtered){
                            resp.filtered.forEach(function(geom){
                                // addGeom(geom);
                            });
                        }
                        else{
                            resp.forEach(function(geom){
                                // addGeom(geom);
                            });
                        }
                        $rootScope.$broadcast('mapService:dataLoaded');
                        $loading.finish('map-loading');
                        deferred.resolve();
                    };
                };

                return dfd.promise;
            };
            // chargement de la fonction initializeCarte en ligne 68
            mapService.initializeCarte = initializeCarte;

            // vide la carte 
            $scope.$on('$destroy', function(evt){
                if(map){
                    map.remove();
                    geoms = [];
                }
            });
        }
    };
});
