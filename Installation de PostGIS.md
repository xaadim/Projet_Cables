Installer PostGis et ses composants sur Postgres 
===


Avant de commencer, vérifier bien si POSTGIS n'est pas installé. Pour cela, sur PgAdmin, il faut faire cette requete SQL dans une de vos bases de données : 

```sql
SELECT PostGIS_full_version();
```
Vous aurez comme résultat ça, si POSTGIS est installé :</br>
"POSTGIS="2.1.2 r12389" GEOS="3.4.2-CAPI-1.8.2 r3921" PROJ="Rel. 4.8.0, 6 March 2012" GDAL="GDAL 1.10.1, released 2013/08/26" LIBXML="2.9.1" LIBJSON="UNKNOWN" RASTER",

Installation 
---
```sql
sudo apt-get install postgresql-9.3-postgis    
```
Remplacer 9.3 par la version de votre postgresql

Ensuite, nous devons créer une nouvelle base de modèle (optionnel mais recommandé).

```sql
createdb -E UTF8 template_postgis2
createlang -d template_postgis2 plpgsql
psql -d postgres -c "UPDATE pg_database SET datistemplate='true' WHERE datname='template_postgis2'"
psql -d template_postgis2 -f /usr/share/postgresql/9.3/contrib/postgis-2.1/postgis.sql
psql -d template_postgis2 -f /usr/share/postgresql/9.3/contrib/postgis-2.1/spatial_ref_sys.sql
psql -d template_postgis2 -f /usr/share/postgresql/9.3/contrib/postgis-2.1/rtpostgis.sql
psql -d template_postgis2 -c "GRANT ALL ON geometry_columns TO PUBLIC;"
psql -d template_postgis2 -c "GRANT ALL ON geography_columns TO PUBLIC;"
psql -d template_postgis2 -c "GRANT ALL ON spatial_ref_sys TO PUBLIC;"
createdb training -T template_postgis2
```
L'installation de Postgis et ces extensions est terminée, vous pouvez maintenant utiliser vos tables de types geometry, 
