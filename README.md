# Bot Discord pour Pavillon Noir 2
Ce bot a été développé pour améliorer l'expérience du jeu de rôle Pavillon Noir lors des parties virtuelle sur l'application Discord. 
Les commandes existantes permettent aux joueurs de : 
  - Réaliser des jets de dés en affichant directement si besoin le nombre de succès obtenus
  - Gérer les piles de cartes permettant de jouer les règles de Entre Ciel et Terre
  - Afficher les commandes des joueurs
 
 Des commandes supplémentaires existent afin de : 
  - Afficher les utilisateurs gérés par le bot
  - Sauvegarder le contexte (l'état des piles de cartes de chacun des joueurs)
  - Restaurer un contexte sauvegardé
  - Afficher l'ensemble des commandes existantes
  
# Liste de commandes : 
  !1d12 : Permet de lancer 1 dé à 12 faces et affiche le résultat du ou des dés
  !3d10f6 : Permet de lancer 3 dés à 10 faces, avec une facilité de 6. Le bot affiche le résultat des dés ainsi que le nombre de succès (les 1 sont comptés comme deux succès)
  !ma : Permet de tirer une lame majeure. Le bot indique le nom de la lame. Lorsque toutes les lames majeures ont été tirées, le bot remélange automatiquement le paquet 
  !mi : Permet de tirer une lame mineure. Le bot indique le nom de la lame. Lorsque toutes les lames mineures ont été tirées, le bot remélange automatiquement le paquet
  !help : Permet d'afficher les commandes destinées aux joueurs
  !helpmj : Permet d'afficher toutes les commandes du bot
  !save : Permet de sauvegarder l'état des piles de cartes des joueurs dans le fichier contexte.json
  !load : Permet de rétablir un état des piles de cartes des joueurs sauvegardé dans le fichier contexte.json
  !init : Permet de réinitialiser l'état des piles de cartes de tous les joueurs
  
# Comment utiliser le bot sur son serveur Discord ? 
Le bot n'est pas hébergé sur un serveur online. Il faut le télécharger et le lancer sur son poste.

//installation de node js
Node JS permet de faire tourner le bot sur votre poste. Pour l'installer, il suffit de récupérer le fichier d'installation (prendre la version LTS) sur le site https://nodejs.org/en/ et de suivre les étapes.

//Déclaration du bot sur discord
Il faut se rendre sur le portail développeur Discord https://discord.com/developers et créer une nouvelle application. 
La section "General Information" permet de donner un nom et un avatar à votre application ainsi que d'y inscrire une description.
La section "OAuth2" permet de générer le lien d'invitation de votre application dans votre serveur Discord. Pour ce bot, j'ai utilisé le scop et les permissions suivantes : 
    - scop : Bot
    - Permissions : 
        + View Channels
        + Send messages
L'étape suivante est la création du bot dans votre applicaiton. Pour se faire, se rendre dans la scetion "Bot", cliquer sur le bouton "Add bot" et valider par le bouton "Yes, Do it!". Nous reviendrons plus tard sur cette page pour récupérer le "Token" qui permettra de lier le code exécuté sur la machine et votre bot Discord.

//Récupérer les sources
Récupérer le fichier "Bot_PN2.0 v1.0.zip". Ensuite, le placer dans le dossier de votre choix et extraire tout. Ouvrir le dossier "Bot" ainsi créé. 
Ouvrir le fichier "Config.json", remplacer la valeur du "token" existant par celui de votre bot. Dans ce fichier, il est possible modifier le préfixe des commandes si celui proposé ne convient pas. Sauver les modifications et fermer le fichier. 
Profitez d'être dans le dossier où les sources du bot sont stockées pour cliquer sur la barre d'adresse et copier le chemin. 

//lancer depuis l'invite de commande
Lancer l'invite de commandes. 
Ecrire "cd" et coller le chemin du dossier oú sont les sources du bot et appuyer sur "entrée". P
      Pour moi ca donne : cd C:\Users\Victor\Documents\Jeux de rôles\Pavillon noir\bot
Saisir la commande suivante :  node index.js et valider avec "entrée". 
Le bot se lance et au bout d'un court instant, il devrait vous dire : "I am ready!". 
Le bot fonctionne tant que l'invite de commande reste ouvert. Vous pourrez aussi y ce que fait le bot.

pour plus d'informations : victor.prevot@free.fr
