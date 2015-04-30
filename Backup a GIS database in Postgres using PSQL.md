PostgreSQL:sauvegarde et de restauration
===
Il ya un certain nombre d'options pour la sauvegarde d'une base de données PostgreSQL. Choisir l'option la plus appropriée dépend de la façon dont vous utilisez la base de données. 


Sauvegarder une base de données PostgreSQL
----
Il y a trois approches fondamentalement différentes pour sauvegarder les données de PostgreSQL :

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

Ici, le serveur par défaut est localhost. Pour préciser quel serveur de bases de données pg_dump doit contacter, il faut lui préciser en utilisant les options de ligne de commande -h serveur et -p port. 

Exemple: 
```sql
pg_dump -h 000.00.000.000 - p 0000  -d mabase > /home/votre_projet/mabase.sql
```
ou encore plus récuper un schéma d'une base de données 
```sql
pg_dump -h [SERVEUR]  -d [BDD] -U [USERBDD] --column-inserts -t [SCHEMA].[TABLE] > /[CHEMIN_FICHIER_SQL]/[NOM].sql
```

####  3- Restaurer la sauvegarde

On utiluse le programme psql pour restaurer les fichiers texte créés par pg_dump qui sont prévus pour être lus par le programme. La syntaxe générale est :
```sql
psql base_de_donnees < fichier_d_entree
```
Pour notre exemple:
```sql
psql mabase < /home/votre_projet/mabase.sql
```
On peut aussi faire:

```sql
psql -h [SERVEUR] -d [BDD] -U [USERBDD] -f /[CHEMIN_FICHIER_SQL]/[NOM].sql
```
### 4- Les grosses bases de données

Il est conseiller de faire une compression pour la sauvegarde des grosses bases de données. 


