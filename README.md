# Bot Discord pour Pavillon Noir 2
Ce bot a été développé pour améliorer l'expérience du jeu de rôle Pavillon Noir lors des parties virtuelle sur l'application Discord. 
Les commandes existantes permettent aux joueurs de : 
  - Réaliser des jets de dés en affichant directement si besoin le nombre de succès obtenus
  - Gérer les piles de cartes permettant de jouer les voies d'arcanes
  - Afficher les commandes des joueurs
 
 Des commandes supplémentaires existent afin de : 
  - Afficher les utilisateurs gérés par le bot
  - Sauvegarder le contexte (l'état des piles de cartes de chacun des joueurs)
  - Restaurer un contexte sauvegardé
  - Afficher l'ensemble des commandes existantes
  
#Comment utiliser le bot sur son serveur Discord ? 
Le bot n'est pas hébergé sur un serveur online. Il faut le télécharger et le lancer sur son poste.
//installation de node js
Node JS permet de faire tourner le bot sur votre poste. Pour l'installer, il suffit de récupérer le fichier d'installation (prendre la version LTS) sur le site https://nodejs.org/en/ et de suivre les étapes.

//Déclaration du bot sur discord
Il faut se rendre sur le portail développeur Discor https://discord.com/developers et créer une nouvelle application. 
La section "General Information" permet de donner un nom et une description à votre application et d'y mettre une description.
La section "OAuth2" permet de générer le lien d'invitation de votre application dans votre serveur Discord. Pour ce bot, j'ai utilisé le scop et les permissions suivantes : 
    - scop : Bot
    - Permissions : 
        + View Channels
        + Send messages
L'étape suivante est la création du bot dans votre applicaiton. Pour se faire, se rendre dans la scetion "Bot" et cliquer sur le bouton "Add bot" et valider par le bouton "Yes, Do it!". Nous reviendrons plus tard sur cette page pour récupérer le "Token" qui permettra de lier le code exécuté sur la machine et votre bot Discord.

//Récupérer les sources
Récupérer le fichier "Bot_PN2.0 v1.0.zip". Ensuite, le placer dans le dossier de votre choix et l'extraire. Ouvrir le dossier Bot ainsi créé. 
Ouvrir le fichier "Config.json", remplacé la valeur du "token" existant par celui de votre bot. Dans ce fichier, il est possible modifier le préfixe des commande si celui proposé ne convient pas. Sauvegarder les modifications et fermer le fichier. 
Profiter d'être dans le dossier où les sources du bot sont stockées pour cliquer sur la barre d'adresse et copier le chemin. 

//lancer depuis l'invite de commande
Lancer l'invite de commandes. 
Ecrire cd et coller le chemin du dossier oú sont les sources du bot et appuyer sur "entrée". (pour moi ca donne : cd C:\Users\Victor\Documents\Jeux de rôles\Pavillon noir\bot )
saisir la commande suivante :  node index.js et valider avec "entrée". Le bot se lance et au bout d'un court instant, il devrait vous dire : "I am ready!". 
Le bot fonctionne tant que l'invite de commande reste ouvert. Vous pourrez aussi y ce que fait le bot.

pour plus d'informations : victor.prevot@free.fr
