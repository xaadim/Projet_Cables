

PostgreSQL sauvegarde et de restauration
Il ya un certain nombre d'options pour la sauvegarde d'une base de données PostgreSQL. Choisir l'option la plus appropriée dépend de la façon dont vous utilisez la base de données. Pour les bases de données relativement statiques avec quelques mises à jour, les outils de pg_dump et pg_restore vous permettent de prendre des instantanés périodiques des données chaque fois que nécessaire. Si vos données changent fréquemment, en utilisant un service de sauvegarde en ligne vous permettra de mises à jour en continu archive dans un emplacement sécurisé.

La sauvegarde en ligne est la base pour la réplication et des systèmes stand-by pour la haute disponibilité, en particulier la version de PostgreSQL 9.0 ou supérieure.

Structurer vos données
Il est de bonne pratique pour stocker toujours vos données de production dans les schémas de PostgreSQL séparés et nous recommandons que vous adoptez cette approche pour gérer vos données dans une base de données PostgreSQL. Ceci est important pour deux raisons:

Sauvegarde et restauration des données structurées dans des schémas distincts est plus simple que la compilation des listes de tables à sauvegarder individuellement.
Garder tableaux de données sur le schéma publique rend plus facile à mettre à jour votre système.
Sauvegarde et de restauration de base
Sauvegarde d'une base de données complète est une opération simple en utilisant l'outil de pg_dump, un outil de ligne de commande qui le rend facile à automatiser le processus avec les scripts. Il est également disponible avec une interface utilisateur graphique (GUI) de l'application de gestion de base de données pgAdmin.

Pour démarrer une sauvegarde, cliquez-droit sur la base de données que vous souhaitez sauvegarder dans le navigateur de l'objet de pgAdmin et cliquez sur Sauvegarde.
