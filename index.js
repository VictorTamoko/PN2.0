//Déclarion des variables publiques
const Discord = require('discord.js')
const bot = new Discord.Client()
const fs = require('fs')
Config = require(__dirname+"/config.json")
const LamesMajeures = new Set(['le Mat','le Bateleur','la Papesse','l’Impératrice','l’Empereur','le Pape','l’Amoureux','le Chariot','la Justice','l’Hermite','la Roue','la Force','le Pendu','l’Arcane sans Nom','la Tempérance','le Diable','la Maison-Dieu','l’Étoile','la lune','le Soleil','le Jugement','le Monde','le Bateleur renversé','la Papesse renversée','l’Impératrice renversée','l’Empereur renversé','le Pape renversé','l’Amoureux renversé','le Chariot renversé','la Justice renversée','l’Hermite renversé','la Roue renversée','la Force renversée','le Pendu renversé','l’Arcane sans Nom renversée','la Tempérance renversée','le Diable renversé','la Maison-Dieu renversée','l’Étoile renversée','la lune renversée','le Soleil renversé','le Jugement renversé','le Monde renversé'])
const LamesMineures = new Set(['valet de coupes','cavalier de coupes','reine de coupes','roi de coupes','valet d’épées','cavalier d’épées','reine d’épées','roi d’épées','valet de batons','cavalier de batons','reine de batons','roi de batons','valet de deniers','cavalier de deniers','reine de deniers','roi de deniers'])
const Serveurs = new Map() // liste des serveurs sur lesquel est le botUne collection de type Map permet d'utiliser la méthode get(clé) pour faire référence à un de ses éléments. Ce qui n'est pas possible dans un Set.
var message

//Définition des types
class Joueur
{
    constructor(guildmember,username) 
    {
        //Propriétés
        this.Surnom = guildmember.displayName   //Allias du joueur
        this.Nom = username                     //Nom du joueur
        this.Id = guildmember.id                //Id du joueur
        this.LamesMa = new Set()                //Pioche des lames majeures
        this.DefausseMa = new Set()             //Défausse des lames majeures
        this.LamesMi = new Set()                //Pioche des lames mineures
        this.DefausseMi = new Set()             //Défausse des lames mineures
        this.LamesRenversees = new Set()        //Nombre de lames renversées tirées
    //A la création, les défausses sont initialisées avec les cartes et les pioches sont vides pour que dès le premier tirage il y ait un brassage de cartes
    }
    //Méthodes
    SetDefausses = function()
    {
        var that=this
        LamesMajeures.forEach(function(carte){
            that.DefausseMa.add(carte) 
        })
        LamesMineures.forEach(function(carte){
            that.DefausseMi.add(carte)
        })
        that.LamesRenversees.clear()
    }
    MelangerMa = function() //permet de mélanger la défausse des lames majeures pour les remettre dans la pioche
    {
        //le mélange se fait en replaçant aléatoirement une valeur de la collection de défausse en bas de la dans la pioche
        //Action répétée tant qu'il y a encore des cartes dans la défausse
        var index
        var taille
        var lame

        var that = this
        that.LamesMa.forEach(function(carte){ //au moment de mélanger, on regroupe la pioche et la défausse en conservant les lames renversées
            that.DefausseMa.add(carte)
        })
        that.LamesMa.clear()

        //on procède au mélange
        taille = this.DefausseMa.size
        for(index=0; index < taille; index++)
        {
            var it = Array.from(this.DefausseMa) //converti la collection en tableau pour pouvoir atteinde les élément grâce à un index
            lame = Math.floor(Math.random() * Math.floor(taille-index)) //détermination aléatoire de l'index à remettre dans la pioche
            lame= it[lame]//détermination de la valeur de la lame ciblée
            this.DefausseMa.delete(lame)//suppression de la lame dans la défausse
            this.LamesMa.add(lame)//remise de la lame en bas de la pioche
        }
    }
    MelangerMi = function() //permet de mélanger la défausse des lames mineures pour les remettre dans la pioche
    {
        //même principe que MelangerMa mais sur les pioches et défausses des lames mineures
        var index
        var taille
        var lame

        var that = this
        that.LamesMi.forEach(function(carte){ //au moment de mélanger, on regroupe la pioche et la défausse en conservant les lames renversées
            that.DefausseMi.add(carte)
        })
        that.LamesMi.clear()

        //on procède au mélange
        taille = this.DefausseMi.size
        for(index=0; index < taille; index++)
        {
            var it = Array.from(this.DefausseMi)
            lame = Math.floor(Math.random() * Math.floor(taille-index))
            lame= it[lame]
            this.DefausseMi.delete(lame)
            this.LamesMi.add(lame)
        }
    }
    PiocherMa = function() //permet de piocher une lame majeure
    {
        //Si la pioche est vide, on procède au mélange de la défausse avant de tirer une carte
        if(this.LamesMa.size == 0){ 
            console.log('Plus de carte dispo, rebattage')
            this.MelangerMa()}

        //Comme pour le battage des carte, on passe par un tableau pour récupérer la valeur de la lame piochée
        var it = this.LamesMa.values()
        var first = it.next()
        this.LamesMa.delete(first.value)
        if (first.value.includes('renversé')){ // || first.includes('deniers') || first.includes('épées')
            this.LamesRenversees.add(first.value)
        }
        else {
            this.DefausseMa.add(first.value)
        }
        return first.value //renvoi la lame piochée pour afficher le message à l'utilisateur
    }
    PiocherMi = function() //permet de piocher une lame mineure
    {
        //fonctionne comme PiocherMa
        if(this.LamesMi.size == 0){
            console.log('Plus de carte dispo, rebattage')
            this.MelangerMi()}

        var it = this.LamesMi.values()
        var first = it.next()
        this.LamesMi.delete(first.value)
        if(first.value.includes('coupes') || first.value.includes('batons')){
            this.LamesRenversees.add(first.value)
        }
        else {
            this.DefausseMi.add(first.value)
        }
        return first.value
    }
}
class Serveur{
    constructor(guild)
    {
        this.Nom = guild.name
        this.Id = guild.id
        this.Joueurs = new Map()
    }
}


//Définition des fonctions
function Init() //Permet de d'initialiser le bot
{
    Serveurs.clear()
    bot.guilds.cache.each(guild =>{
        NouveauServeur= new Serveur(guild)
        guild.members.cache.each(guildmember =>{
            if (!guildmember.user.bot){//Crée un utilisateur par user du salon qui n'est pas un bot
                NouveauJoueur = new Joueur(guildmember, guildmember.user.username)
                NouveauJoueur.SetDefausses()
                NouveauJoueur.MelangerMa() 
                NouveauJoueur.MelangerMi()
                NouveauServeur.Joueurs.set(NouveauJoueur.Id,NouveauJoueur)
            }
        })
        Serveurs.set(guild.id,NouveauServeur)
    }) 
}
function Sauvegarder(GuildId) //Permet de sauvegarder le contexte
{
    //pour chaque utilisateur on va sauvegarder l'état des 4 collections de cartes
    var guild = Serveurs.get(GuildId)
    var Contexte = new Object()
    var Fichier = __dirname+ "\\context_"+guild.Nom+".json"
    
    guild.Joueurs.forEach(function(joueur) 
    {
        Contexte[joueur.Id]= //Les utilisateurs sont référencés par leur id 
        {
            Nom: joueur.Surnom, //On sauvegarde aussi le mom, pour une meilleure lisibilité du fichier
            LamesMa: Array.from(joueur.LamesMa), //Afin de les sauvegarde au format JSON, il faut les transformer en tableau
            DefausseMa: Array.from(joueur.DefausseMa),
            LamesMi: Array.from(joueur.LamesMi),
            DefausseMi: Array.from(joueur.DefausseMi),
            LamesRenversees: Array.from(joueur.LamesRenversees)
        }
        console.log(typeof(Contexte))
    })
     //écriture du fichier JSON
     fs.writeFile(Fichier,JSON.stringify(Contexte,null,4), err =>
     {
         if(err) throw  err
         })
}
function Charger(GuildId) {//Permet de charger le contexte précédement sauvegardé
        var guild = Serveurs.get(GuildId)
        var Fichier = __dirname+ "\\context_"+guild.Nom+".json"

        var JSONfile = JSON.parse(fs.readFileSync(Fichier, "utf8")) //On ouvre le fichier de contexte
        guild.Joueurs.forEach(function(utilisateur){ //Pour chaque utilisateur
            var utilisateurJSON = JSONfile[utilisateur.Id] //On vérifie au'il existe dans le fichier de contexte
            if( utilisateurJSON){   //Si oui, on récupère létat des piles
                utilisateur.LamesMa =  new Set(utilisateurJSON.LamesMa)
                utilisateur.DefausseMa = new Set(utilisateurJSON.DefausseMa)
                utilisateur.LamesMi = new Set(utilisateurJSON.LamesMi)
                utilisateur.DefausseMi = new Set(utilisateurJSON.DefausseMi)
                utilisateur.LamesRenversees = new Set(utilisateurJSON.LamesRenversees)
            }
         })
    }


//Initialisation du bot
bot.login(Config.token)
bot.on('ready', () => 
{
    //s'exécute lorsque le bot est démarré sur le serveur
    Init()
    console.log('I am ready!')
    bot.user.setActivity(Config.Prefix + 'help')
})

//Détection des commandes dans les messages du serveur
bot.on('message', function (msg)
{
    if(msg.content.startsWith(Config.Prefix) && !msg.author.bot)
    {
        msg.content = msg.content.toLowerCase()
        switch (msg.content)
        {
            
            case Config.Prefix + 'ma':{//Demande d'une lame majeure
                console.log(msg.author.username + ' pioche une lame majeure')
                var joueur = Serveurs.get(msg.channel.guild.id).Joueurs.get(msg.author.id)
                var lame = joueur.PiocherMa()//On exécute la méthode PiocherMa pour l'utilisateur ayant envoyé le méssage grâce à son id
                message = '***' + joueur.Surnom +'*** a pioché la lame majeure suivante : **' + lame+'**\n'
                message = message + '***' + joueur.Surnom +'*** en est à **' + joueur.LamesRenversees.size + '** lames renversées' 
                console.log(message)
                var PieceJointe = new Discord.MessageAttachment (__dirname+'\\Images/'+lame+'.jpg')
                msg.channel.send(message,PieceJointe)  
                break
            }
             
            case Config.Prefix + 'mi':{//Demande d'une lame mineure, fonctionne pareil que pour les lames majeures
                console.log(msg.author.username + ' pioche une lame mineure')
                var joueur=Serveurs.get(msg.channel.guild.id).Joueurs.get(msg.author.id)
                var lame = joueur.PiocherMi() //On exécute la méthode PiocherMi pour l'utilisateur ayant envoyé le méssage grâce à son id
                message = '***' + joueur.Surnom +'*** a pioché la lame mineure suivante : **' + lame+'**\n'
                message = message + '***' + joueur.Surnom +'*** en est à **' + joueur.LamesRenversees.size + '** lames renversées' 
                console.log(message)
                var PieceJointe = new Discord.MessageAttachment (__dirname+'\\Images/'+lame+'.jpg')
                msg.channel.send(message,PieceJointe)  
                break
            }

            case Config.Prefix + 'mel':{//Demande de mélange des cartes pour initier un nouveau tirage
                console.log(msg.author.username + ' mélange ses cartes')
                var joueur = Serveurs.get(msg.channel.guild.id).Joueurs.get(msg.author.id)
                joueur.MelangerMa()
                joueur.MelangerMi()
                break
            }
           
            case Config.Prefix + 'guilds':{//Affiche la liste des serveurs o'u est le bot
                console.log(msg.author.username + ' demande de liste des serveurs référencés')
                message = ''
                Serveurs.forEach(function(guild){ 
                    message = message + guild.Nom + '\n'
                } )
                msg.channel.send(message)
                break
            }
           
            case Config.Prefix + 'users':{//Affiche la liste des utilisateurs
                console.log(msg.author.username + ' demande de liste des utilisateurs référencés')
                message = ''
                var Guild=Serveurs.get(msg.channel.guild.id)
                Guild.Joueurs.forEach(function(utilisateur){
                     message = message + utilisateur.Nom + ' allias : ' + utilisateur.Surnom+ '\n'
                } )
                msg.channel.send(message)
                break
            }
           
            case Config.Prefix + 'init':{//réinitialisation de la partie du bot
                console.log(msg.author.username + ' réinitilaise le bot')
                msg.channel.send('On remet tout à zéro et on recommence ? OK ! ')
                Init()
                break
            }
           
            case Config.Prefix + 'save':            case Config.Prefix + 'sauve':{//Sauvegarde du contexte, c'est à dire de l'état des piles de cartes de chaque utilisateurs
                console.log(msg.author.username + ' sauvegarde le contexte')
                Sauvegarder(msg.channel.guild.id)
                msg.channel.send("sauvegarde effectuée")
                break
            }

            case Config.Prefix + 'load':{ //Récupération du contexte, restaure l'état des piles qui a été sauvegardé
                console.log(msg.author.username + ' recharge le contexte')
                Charger(msg.channel.guild.id)
                msg.channel.send("Vous vous souvenez des cartes déjà tirées ? Non ? bah moi oui ! \nC'est bon vous pouvez reprendre :) ")
                break
            }
            
            case Config.Prefix + 'help':    case Config.Prefix + '?' : {//Affichage l'aide aux joueurs
                console.log(msg.author.username + ' demande de l\'aide')
                message = Config.Prefix + 'r : permet de faire un jet de dé(s), la commande est sous la forme --r3d10[f7] avec : \n'
                message = message + '          - 3 = nombre de dés à lancer\n'
                message = message + '          - 10 = nombre de face dés dés lancés\n'
                message = message + '          - 7 = résultat à obtenir pour que le dé soit un succès. cette partie f7 est optionnelle\n'
                message = message + Config.Prefix + 'ma : permet de piocher une lame majeure \n'
                message = message + Config.Prefix + 'mi : permet de piocher une lame mineure\n'
                message = message + Config.Prefix + 'mel : permet de mélanger ses cartes dans le but de démarrer un nouveau tirage\n'
                msg.channel.send(message)
                break
            }
            case Config.Prefix + 'helpmj':{//Affiche l'aide complète
                message = Config.Prefix + ' : permet de faire un jet de dé(s), la commande est sous la forme '+ Config.Prefix +'3d10[f7] avec : \n'
                message = message + '          - 3 = nombre de dés à lancer\n'
                message = message + '          - 10 = nombre de face dés dés lancés\n'
                message = message + '          - 7 = résultat à obtenir pour que le dé soit un succès. cette partie f7 est optionnelle\n'
                message = message + Config.Prefix + 'ma : permet de piocher une lame majeure \n'
                message = message + Config.Prefix + 'mi : permet de piocher une lame mineure\n'
                message = message + Config.Prefix + 'mel : permet de mélanger ses cartes dans le but de démarrer un nouveau tirage\n'
                message = message + Config.Prefix + 'guilds : permet d\'afficher la liste des serveurs sur lesquels se trouve le bot\n'
                message = message + Config.Prefix + 'users : permet d\'afficher les utilisateurs\n'
                message = message + Config.Prefix + 'init : permet de réinitialiser le bot\n'
                message = message + Config.Prefix + 'save : permet de sauvegarder le contexte dans le fichier ./context_'+msg.channel.guild.name+'.JSON\n'
                message = message + Config.Prefix + 'load : permet de récupéré le contexte depuis le fichier ./context_'+msg.channel.guild.name+'.JSON\n'
                message = message + Config.Prefix + 'lr : permet de retirer des lames renversées de leurs piches en citant des joueurs, sous la forme : ' + Config.Prefix + 'lr x @joueur1 @joueur2...\n'
                message = message + '          - x = nombre de cartes à retirer\n'
                message = message + '          - @joueur = nom de joueur **cité** en utilisant le caractère @\n'

                msg.channel.send(message)
                break
            }       
            
            default: //Toutes les autres commandes

            //Détection d'une commande de jet de dés : débute par le préfixe défini et contient la lettre "d"
            if (msg.content.startsWith(Config.Prefix) && msg.content.includes('d') ) //format de la commande : rXdY[fZ] : X = nb dés, Y = nb faces dés, Z = facilité
            {
                console.log(msg.author + ' lance les dés : ' + msg.content)
                var commande = msg.content.slice(Config.Prefix.length).trim() //on supprime le préfixe (slice) et on supprime aussi les espaces avant et après (trim)
                var resultats =[]
                var index =0
                var NbJets =0
                var TailleDes =0
                var Facilite =0
                var succes = 0 
                var resultatDe =0
                var EchecCritique = true //si tous les dés sont >10, c'est un échec critique. Le premier dé qvec une valeur inférieure à 1 viendra réseter ce flag
                var JetAvecFacilite = commande.includes('f')

                //Détermination du nombre de dés, de leur taille et de facilité (si cette dernière est souhaitée)
                if (JetAvecFacilite)
                {
                    //initialistion des jets avec facilité
                    NbJets = parseInt(commande.substr(0,commande.indexOf('d')))
                    TailleDes= parseInt(commande.substr(commande.indexOf('d')+1,commande.indexOf('f')-commande.indexOf('d')))
                    Facilite = parseInt(commande.slice(commande.indexOf('f')+1))
                    if(isNaN(NbJets) || isNaN(TailleDes) || isNaN(Facilite))
                    {
                        console.log(NbJets +' '+TailleDes +' '+Facilite +' : erreur de commande') 
                        break
                    }
                }
                else
                {
                    //initialistion des jets sans facilité
                    NbJets = parseInt(commande.substr(0,commande.indexOf('d')))
                    TailleDes= parseInt(commande.slice(commande.indexOf('d')+1))
                    if(isNaN(NbJets) || isNaN(TailleDes))
                    {
                        console.log(NbJets +' '+TailleDes +' : erreur de commande') 
                        break
                    }
                }
                
                //Exécution des jets de dés
                for(index=0; index< NbJets; index++)
                {
                    resultatDe = Math.round(Math.random() * (TailleDes-1))+1 //calcul aléatoire du résultat
                    resultats.push(resultatDe) //enregistrement du résultat
                    if(JetAvecFacilite)//Pour les jets avec facilité, on ne regarde que les succès
                    {
                        if(resultatDe == 1){succes +=2}else{if(resultatDe<=Facilite){succes+=1}} //Les "1" sont comptés comme 2 succès. Sinon on regarder si le résultat est < facilité 
                        if(resultatDe<10){EchecCritique=false}
                        
                        //création du message envoyé
                        if(EchecCritique)
                        {
                            message = '***' + msg.member.displayName + '*** a réalisé un __**ECHEC CRITIQUE**__ **! ! ! ! ! !** \n'
                            message = message + '[ ' + resultats + ' ]'
                        }
                        else
                        {
                            message = '***' + msg.member.displayName + '*** a réalisé **' + succes + '** succès \n'
                            message = message + '[ ' + resultats + ' ] D =<' + Facilite
                        }
                    }
                    else //sans facilité, on renvoi juste la valeur des dés
                    {
                        message = '***' + msg.member.displayName + '*** a obtenu : [ **' + resultats +'** ]'
                    }
                }
                
                msg.channel.send(message)
                console.log(message)
            }

            //Détection d'une commande pour retirer des lames renversées à un joueur
            if (msg.content.startsWith(Config.Prefix + 'lr') && msg.mentions.members.size >0) { //format de la commande : lr x @joueur
                var commande = msg.content.slice(Config.Prefix.length+2).trim()
                var NbCartes = parseInt(commande.substr(0,commande.indexOf(' ')))
                var NomsJoueurs = msg.mentions.users.entries()
                var ExisteJoueur = false
                var joueur
                var index = 0 

                if((!commande.startsWith('<')) && isNaN(NbCartes)){
                    console.log('Problème dans le nombre de cartes à retirer')
                }else{if(commande.startsWith('<')){ NbCartes=1}}

                var valeur = NomsJoueurs.next()
                while(!valeur.done) // pour chaque joueur passé en paramètre de la commande
                {   
                    Serveurs.get(msg.channel.guild.id).Joueurs.forEach(function(joueur){ // on parse les joueurs du serveurs
                        if(joueur.Id === valeur.value[0]){ //si le nom correspond
                            ExisteJoueur = true //on indique que le joueur existe
                            while ( joueur.LamesRenversees.size > 0 && index<NbCartes){ // on retire une lame renversée de la pile autant de fois qu'on l'a demandé. On s'arrête s'il n'y en a plus.
                                var it = joueur.LamesRenversees.values()
                                var first = it.next()
                                joueur.LamesRenversees.delete(first.value) // on retire la première lame arrivée
               
                                if(first.value.includes('renversé')){ // et on la remet dans la bonne défausse
                                    joueur.DefausseMa.add(first.value)
                                }
                                else{
                                    joueur.DefausseMi.add(first.value)
                                }
                                index+=1
                            }
                            if(index == 1 ){ //on affiche un message en accordant en nombre de carte retirées
                                message = index + ' lame renversée a été suprimée de la pile de ' + joueur.Surnom + '. Il lui en reste ' + joueur.LamesRenversees.size + '.'
                            }
                            else {
                                message = index + ' lames renversées ont été suprimées de la pile de ' + joueur.Surnom + '. Il lui en reste ' + joueur.LamesRenversees.size + '.'
                            }
                            console.log(message)
                            msg.channel.send(message)
                        }
                    })
                    if(!ExisteJoueur){console.log('Le joueur ' + valeur.value[1].username + ' n\'existe pas')}

                    valeur = NomsJoueurs.next()
                }   

                
        }

    
            break
            

        }
    }
})
