# Projet Avifaune/câbles dangereux

## Développement d'une application de cartographie interactive sur internet

### Présentation du contexte métier et technique actuel

D'un point de vue métier, depuis plusieurs années, le parc national de la Vanoise s'est investi dans

un projet de recensement de la dangerosité de câbles et poteaux (lignes électriques et remontées

mécaniques) pour l'avifaune et de l'inventaire et le suivi des équipements de neutralisation mis en

place sur ces éléments dangereux.

D'un point de vue technique, une application de cartographie dynamique sur internet est

actuellement en place. Elle a été réalisée depuis une solution de développement propriétaire

(Système de base de données associé : PostgreSQL/PostGIS, OS Windows).

### Objectifs de l'établissement

L'objectif est de redévelopper cette application sur un environnement de développement open source

et potentiellement faire évoluer ses fonctionnalités.

Présentation des principales fonctionnalités de l'application

- Consultation, saisie, modification, suppression géographique et attributaire uniquement de

points (poteaux, dangerosité/neutralisation) et de segments (tout ou partie de câbles,

dangerosité/neutralisation).

- Reporting/export des données géographiques et attributaires (couches, tables...).

### Nouveau contexte de développement (open source)

- Système d'exploitation : Linux (Debian ou Ubuntu).

- Système de base de données : PostgreSQL/PostGIS (identique à l'actuel).

- Serveur cartographique : WMS fonds cartographiques IGN depuis l'API Géoportail®,

Mapserver/QGIS Server (à définir) et tuilage (MbTiles).

− Backend : 

− Frontend : Angular/BackBone-Bootstrap (à définir) et OpenLayers. HTML et CSS.

Objectifs du stage

− Participation à la définition de potentielles nouvelles fonctionnalités , au développement de

la nouvelle application.

− Participation à l'animation technique du projet (présentation du contexte technique, de

l'application si finalisée...).

− Autres

