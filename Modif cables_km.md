# Modifications sur cables_km

## 1- Ajout du breadcrumb 

### a- Dans Symfony: voir  BreadConfigController.php
Mise à jour des requêtes SQL dans le fichier


### b- Dans AngularJS: voir la directive breadcrumbs dans displayDirectives.js 

voir aussi fichier template htm: js/templates/display/breadcrumbs.htm

ajout du breadcrumb dans les pages avec la div 
```javascript 
<div breadcrumbs appname="{{cables}}"></div> 
```

## 2- Label à afficher sur Géom carte et dans détail objet

Pour : 

##### Zones sensibles
```javascript
$scope.title = 'tronçon' + data.id;
```
##### Cas de Mortalité 
```javascript
$scope.title = 'tronçon' + data.id;
```
##### Inventaires troncons ERDF : Tronçon + ID
```javascript
$scope.title = 'tronçon ' + data.id;
```
##### Inventaires poteaux ERDF : Poteau + ID
```javascript
$scope.title = 'poteau' + data.id;
```
##### Equipements poteaux ERDF : Type d'équipement
```javascript
$scope.title = data.type_equipement_troncon;
```
##### Equipements tronçons ERDF
```javascript
$scope.title = 'tronçon' + data.id;
```
##### Sites de nidifications
```javascript
$scope.title = 'tronçon' + data.id;
```
##### Observations
```javascript
$scope.title = 'tronçon' + data.id;
```
 





