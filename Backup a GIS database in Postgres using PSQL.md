PostgreSQL:sauvegarde et de restauration
===
Il ya un certain nombre d'options pour la sauvegarde d'une base de données PostgreSQL. Choisir l'option la plus appropriée dépend de la façon dont vous utilisez la base de données. 


Sauvegarder une base de données PostgreSQL
----
Il y a trois approches fondamentalement différentes pour sauvegarder les données de PostgreSQL™ :

- La sauvegarde SQL ;
- La sauvegarde de niveau système de fichiers ;
- La sauvegarde à chaud (ou en ligne).

Chacune a ses avantages et inconvénients.

####  1-Sauvegarde depuis PgAdmin

On peut faire une sauvegarde directement via l'interface graphique de PgAmin, qui va utiliser "Pour démarrer une sauvegarde, cliquez-droit sur la base de données ou le schéma que vous souhaitez sauvegarder dans le navigateur de l'objet de pgAdmin et cliquez sur Sauvegarde. Choisissez vos options de sauvegarde et le format de fichier (.sql, .tar, .gz ...). Cependant, vous ne pouvez pas restaurer une sauvegarde en .sql depuis l'interface graphique. 

####  2- Sauvegarde SQL

On peut aussi faire une sauvegarde en ligne de commande. Le but est de générer un fichier texte de commandes SQL (appelé « fichier dump »), qui, si on le renvoie au serveur, recrée une base de données identique à celle sauvegardée. PostgreSQL™ propose pour cela le programme utilitaire pg_dump. 

L'usage basique est :

```sql
pg_dump base_de_donnees > /chemin/fichier_de_sortie
```
Exemple: 
```sql
pg_dump mabase > /home/votre_projet/mabase.sql
```





sudo pg_dump -h [SERVEUR]  -d [BDD] -U [USERBDD] --column-inserts -t [SCHEMA].[TABLE] > /[CHEMIN_FICHIER_SQL]/[NOM].sql
sudo shp2pgsql -s [PROJECTION] /[CHEMIN_FICHIER_SQL]/[NOM_SHAPE] [SCHEMA].[TABLE] > /[CHEMIN_FICHIER_SQL]/[NOM].sql
sudo psql -h [SERVEUR] -d [BDD] -U [USERBDD] -f /[CHEMIN_FICHIER_SQL]/[NOM].sql

