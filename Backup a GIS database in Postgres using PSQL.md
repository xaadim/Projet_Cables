PostgreSQL sauvegarde et de restauration
===
Il ya un certain nombre d'options pour la sauvegarde d'une base de données PostgreSQL. Choisir l'option la plus appropriée dépend de la façon dont vous utilisez la base de données. 


Sauvegarder une base de données
----
Il n'y deux façons pour sauvegarder une base de données: 

- d'une manière graphique 
- ou line de commande

1-La méthode graphique 

Pour démarrer une sauvegarde, cliquez-droit sur la base de données ou le schéma que vous souhaitez sauvegarder dans le navigateur de l'objet de pgAdmin et cliquez sur Sauvegarde.

sudo pg_dump -h [SERVEUR]  -d [BDD] -U [USERBDD] --column-inserts -t [SCHEMA].[TABLE] > /[CHEMIN_FICHIER_SQL]/[NOM].sql
sudo shp2pgsql -s [PROJECTION] /[CHEMIN_FICHIER_SQL]/[NOM_SHAPE] [SCHEMA].[TABLE] > /[CHEMIN_FICHIER_SQL]/[NOM].sql
sudo psql -h [SERVEUR] -d [BDD] -U [USERBDD] -f /[CHEMIN_FICHIER_SQL]/[NOM].sql

(en rédactiob)
