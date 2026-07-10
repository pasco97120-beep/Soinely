// Contenu spécifique par fiche (clé = "hubSlug/ficheSlug"), en remplacement du gabarit
// générique unique. Conserve strictement le format "Objectif / Points clés / Quand alerter"
// attendu par lib/fiche-content.ts. Contenu pédagogique d'exemple — cf. bandeau de la fiche :
// à valider par un professionnel de santé avant tout usage clinique réel.
// Volontairement générique sur les points réglementés (NGAP, posologies précises) :
// SOINELY ne doit jamais afficher une donnée chiffrée non vérifiée comme si elle faisait autorité.

function fiche(objectif, pointsCles, quandAlerter) {
  return [
    "Objectif",
    objectif,
    "",
    "Points clés",
    ...pointsCles.map((p) => `- ${p}`),
    "",
    "Quand alerter",
    ...quandAlerter.map((p) => `- ${p}`),
  ].join("\n");
}

const FICHES_CONTENU = {
  "diabete/reconnaitre-et-gerer-une-hypoglycemie": fiche(
    "Identifier rapidement une hypoglycémie chez un patient diabétique à domicile et appliquer la conduite à tenir adaptée à son état de conscience.",
    [
      "Rechercher les signes évocateurs : sueurs, tremblements, pâleur, faim brutale, troubles de la concentration, irritabilité.",
      "Confirmer par une glycémie capillaire dès que possible plutôt que de se fier aux seuls signes cliniques.",
      "Si le patient est conscient et capable de déglutir : resucrage oral (sucre rapide puis collation avec sucre lent).",
      "Si le patient est confus ou inconscient : ne jamais faire boire ou manger, position latérale de sécurité, alerter immédiatement.",
      "Recontrôler la glycémie 15 à 20 minutes après le resucrage pour confirmer la remontée.",
    ],
    [
      "Absence d'amélioration après un premier resucrage.",
      "Perte de connaissance, convulsions ou troubles de la déglutition.",
      "Hypoglycémies répétées chez le même patient : le traitement doit être réévalué par le médecin.",
    ]
  ),

  "diabete/technique-d-injection-d-insuline": fiche(
    "Réaliser une injection d'insuline sous-cutanée dans de bonnes conditions et prévenir les complications liées à la technique.",
    [
      "Vérifier le type d'insuline, la dose prescrite et la date de péremption du stylo ou du flacon avant chaque injection.",
      "Privilégier l'abdomen, la face externe des cuisses ou l'arrière des bras selon le protocole du patient.",
      "Faire un pli cutané si nécessaire selon la longueur de l'aiguille et l'épaisseur du tissu sous-cutané.",
      "Alterner systématiquement les sites d'injection pour limiter le risque de lipodystrophie à long terme.",
      "Ne jamais réutiliser une aiguille et éliminer le matériel piquant dans un collecteur dédié.",
    ],
    [
      "Zone d'injection indurée, chaude ou douloureuse évoquant une lipodystrophie ou une infection locale.",
      "Doute sur la dose prescrite ou sur le schéma d'insuline : ne jamais improviser, contacter le prescripteur.",
      "Glycémies incohérentes avec les doses habituelles malgré une technique correcte.",
    ]
  ),

  "plaies-et-cicatrisation/evaluer-une-plaie-chronique": fiche(
    "Structurer l'observation d'une plaie chronique pour suivre son évolution dans le temps et adapter la prise en charge.",
    [
      "Décrire la plaie selon des critères stables d'une visite à l'autre : taille (longueur, largeur, profondeur), couleur du lit de la plaie, berges.",
      "Observer la quantité et l'aspect de l'exsudat (séreux, purulent, hémorragique) et l'odeur éventuelle.",
      "Rechercher des signes locaux d'infection : rougeur périphérique, chaleur, douleur croissante, œdème.",
      "Photographier la plaie si le protocole du cabinet le permet, avec un repère d'échelle constant, pour objectiver l'évolution.",
      "Consigner systématiquement l'évaluation dans le dossier pour permettre un suivi comparatif fiable.",
    ],
    [
      "Absence d'amélioration après plusieurs semaines de prise en charge adaptée.",
      "Apparition de signes d'infection locale ou de fièvre chez le patient.",
      "Plaie malodorante, nécrotique ou creusant en profondeur : avis médical rapide nécessaire.",
    ]
  ),

  "plaies-et-cicatrisation/choisir-un-pansement-selon-le-stade-de-la-plaie": fiche(
    "Orienter le choix du pansement en fonction du stade et des caractéristiques de la plaie, en lien avec la prescription.",
    [
      "Adapter le type de pansement à la phase de cicatrisation : détersion, bourgeonnement ou épithélialisation.",
      "Tenir compte du niveau d'exsudat : un pansement trop absorbant assèche, un pansement inadapté macère les berges.",
      "Respecter la fréquence de renouvellement indiquée par le produit et par la prescription médicale.",
      "Protéger systématiquement la peau périlésionnelle, particulièrement fragile chez les patients âgés ou dénutris.",
      "Ne jamais associer plusieurs produits sans validation médicale, au risque d'interactions ou d'inefficacité.",
    ],
    [
      "Changement notable de l'aspect de la plaie ou de l'exsudat par rapport aux visites précédentes.",
      "Douleur importante au retrait du pansement, pouvant traduire une adhérence excessive.",
      "Absence de prescription claire sur le type de pansement à utiliser : demander confirmation avant de poursuivre.",
    ]
  ),

  "perfusions/surveillance-d-une-perfusion-a-domicile": fiche(
    "Sécuriser le suivi d'une perfusion à domicile entre deux passages infirmiers, en anticipant les principales complications.",
    [
      "Vérifier à chaque passage le débit, le volume perfusé et la concordance avec la prescription.",
      "Observer le point de ponction : rougeur, chaleur, gonflement, douleur ou écoulement.",
      "Contrôler la perméabilité de la voie et l'absence de reflux ou d'occlusion de la tubulure.",
      "Vérifier la fixation du dispositif et l'intégrité du pansement de maintien.",
      "Informer le patient et l'entourage des signes qui doivent motiver un appel entre deux visites.",
    ],
    [
      "Douleur, rougeur ou œdème au point de ponction évoquant une phlébite ou une infiltration.",
      "Arrêt ou ralentissement anormal du débit non expliqué par la position du bras.",
      "Fièvre ou frissons chez un patient porteur d'une voie veineuse.",
    ]
  ),

  "perfusions/reperer-une-complication-au-point-de-ponction": fiche(
    "Identifier précocement les complications locales d'une perfusion pour limiter leur aggravation.",
    [
      "Distinguer les principales complications : infiltration (gonflement, peau froide), extravasation, phlébite (cordon veineux induré et douloureux), infection locale.",
      "Comparer systématiquement l'aspect du point de ponction à celui observé lors de la visite précédente.",
      "Interroger le patient sur une douleur, une sensation de brûlure ou de tension apparue entre les visites.",
      "En cas de doute sur l'intégrité de la voie, ne pas poursuivre la perfusion avant validation.",
      "Tracer précisément l'observation et la conduite tenue dans le dossier de soins.",
    ],
    [
      "Suspicion d'extravasation, en particulier avec un produit irritant : arrêt immédiat de la perfusion.",
      "Cordon veineux induré et douloureux le long du trajet de la veine, évocateur de phlébite.",
      "Signes généraux associés (fièvre, malaise) en plus des signes locaux.",
    ]
  ),

  "picc-line-midline-pac/entretien-d-un-picc-line-entre-deux-passages": fiche(
    "Maintenir un PICC Line fonctionnel et sécurisé entre deux passages infirmiers.",
    [
      "Vérifier la fixation, la propreté et l'étanchéité du pansement de protection à chaque visite.",
      "Respecter la fréquence de rinçage et le protocole de verrouillage indiqués par le prescripteur ou l'équipe référente.",
      "Observer le point d'insertion : rougeur, écoulement, douleur ou chaleur locale.",
      "Mesurer et noter la longueur externe du cathéter pour repérer tout déplacement progressif.",
      "Informer le patient sur les gestes à éviter (mouillage non protégé, traction sur la ligne).",
    ],
    [
      "Résistance inhabituelle ou impossibilité de rincer la ligne : ne jamais forcer, contacter l'équipe référente.",
      "Signes locaux d'infection au point d'insertion ou le long du trajet veineux.",
      "Cathéter visiblement déplacé par rapport à la longueur externe habituelle.",
    ]
  ),

  "picc-line-midline-pac/signes-d-alerte-autour-d-un-pac": fiche(
    "Repérer les signes devant faire suspecter une complication sur une chambre implantable (PAC).",
    [
      "Observer la zone d'implantation : gonflement, rougeur, chaleur ou douleur à la palpation.",
      "Surveiller l'apparition d'un œdème du bras, du cou ou du visage du côté du PAC, pouvant évoquer une thrombose veineuse.",
      "Vérifier le bon retour veineux et la facilité de rinçage lors de l'utilisation du dispositif, si cela relève du rôle infirmier prévu.",
      "Interroger le patient sur une douleur thoracique, une gêne à la déglutition ou un essoufflement nouveau.",
      "Ne jamais utiliser un PAC douloureux ou dont le fonctionnement paraît anormal sans validation médicale.",
    ],
    [
      "Œdème brutal du bras ou du visage, douleur thoracique ou essoufflement : orientation urgente.",
      "Rougeur, chaleur ou écoulement au site d'implantation évoquant une infection.",
      "Difficulté ou impossibilité de rinçage alors que le dispositif était fonctionnel auparavant.",
    ]
  ),

  "sonde-urinaire/entretien-quotidien-d-une-sonde-urinaire": fiche(
    "Assurer l'hygiène et la surveillance quotidienne d'une sonde urinaire à demeure pour limiter le risque infectieux.",
    [
      "Réaliser une toilette du méat urinaire à l'eau et au savon doux, sans antiseptique systématique sauf prescription contraire.",
      "Vérifier que le système de drainage reste clos et que la poche est positionnée sous le niveau de la vessie.",
      "Contrôler l'aspect et la quantité des urines : couleur, présence de sang, de dépôts ou de mauvaise odeur.",
      "S'assurer de l'absence de tension ou de traction sur la sonde, source de lésions urétrales.",
      "Encourager une hydratation suffisante du patient si son état le permet.",
    ],
    [
      "Urines troubles, malodorantes ou hématuriques associées à de la fièvre.",
      "Douleurs pelviennes ou lombaires pouvant évoquer une infection urinaire haute.",
      "Fuite persistante autour de la sonde ou absence de diurèse malgré une hydratation correcte.",
    ]
  ),

  "sonde-urinaire/conduite-a-tenir-devant-une-sonde-bouchee": fiche(
    "Réagir de façon structurée face à un arrêt du drainage urinaire sur sonde à demeure.",
    [
      "Vérifier en premier lieu les causes simples : coudure de la tubulure, poche positionnée trop haute, sonde comprimée.",
      "Contrôler que le patient n'est pas simplement en anurie ou en rétention en amont pour une autre raison.",
      "Ne jamais tenter de désobstruction instrumentale si cela ne relève pas du protocole en vigueur pour l'IDEL.",
      "Rechercher des globe vésical à la palpation en cas de doute sur une rétention.",
      "Tracer l'heure du dernier drainage efficace pour orienter la décision médicale si nécessaire.",
    ],
    [
      "Absence de reprise du drainage après vérification des causes mécaniques simples.",
      "Douleurs pelviennes importantes ou globe vésical palpable.",
      "Fièvre associée à l'arrêt du drainage, évoquant une complication infectieuse.",
    ]
  ),

  "gastrostomie-jejunostomie/surveillance-du-site-de-gastrostomie": fiche(
    "Surveiller l'état cutané autour de l'orifice de gastrostomie pour prévenir les complications locales.",
    [
      "Observer la peau péristomiale : rougeur, macération, bourgeon charnu ou écoulement.",
      "Nettoyer quotidiennement à l'eau et au savon doux, puis sécher soigneusement la zone.",
      "Vérifier la bonne fixation du dispositif et l'absence de traction excessive sur la sonde.",
      "Contrôler que le disque de fixation externe n'est ni trop serré (risque d'ischémie cutanée) ni trop lâche (risque de fuite).",
      "S'assurer de la mobilité normale de la sonde dans le trajet, selon les recommandations du fabricant.",
    ],
    [
      "Écoulement purulent, rougeur extensive ou douleur importante autour de l'orifice.",
      "Fuite digestive ou gastrique persistante autour de la sonde.",
      "Sonde bloquée, non mobilisable ou visiblement déplacée.",
    ]
  ),

  "gastrostomie-jejunostomie/bonnes-pratiques-d-administration-de-la-nutrition-enterale": fiche(
    "Administrer la nutrition entérale en toute sécurité en respectant la position du patient et le débit prescrit.",
    [
      "Installer le patient en position semi-assise (au moins 30°) pendant et après l'administration pour limiter le risque de reflux.",
      "Vérifier la perméabilité de la sonde et l'absence de résidu gastrique excessif avant de débuter, selon le protocole.",
      "Respecter le débit et le volume prescrits, en utilisant si besoin un régulateur de débit.",
      "Rincer systématiquement la sonde à l'eau avant et après l'administration, et après chaque médicament.",
      "Surveiller la tolérance digestive : nausées, ballonnements, diarrhée.",
    ],
    [
      "Toux, encombrement ou détresse respiratoire pendant l'administration, évocateurs d'une fausse route.",
      "Résidu gastrique important ou distension abdominale marquée.",
      "Diarrhée importante ou signes de déshydratation chez un patient sous nutrition entérale exclusive.",
    ]
  ),

  "stomies/changer-un-appareillage-de-stomie": fiche(
    "Réaliser le changement d'une poche de stomie dans de bonnes conditions d'hygiène et de confort pour le patient.",
    [
      "Préparer le matériel à l'avance pour limiter le temps d'exposition cutanée pendant le change.",
      "Retirer délicatement l'ancien support, de haut en bas, en maintenant la peau tendue.",
      "Nettoyer la peau péristomiale à l'eau tiède et au savon doux, sans frotter, puis sécher par tamponnement.",
      "Découper le nouveau support à la taille exacte de la stomie pour éviter tout contact cutané avec les effluents.",
      "Vérifier la bonne adhérence et l'absence de plis avant de repositionner le patient.",
    ],
    [
      "Modification récente de la taille ou de la forme de la stomie non prise en compte par le découpage habituel.",
      "Saignement inhabituel, douleur ou prolapsus au niveau de la stomie.",
      "Peau péristomiale rouge, érodée ou douloureuse malgré une technique correcte.",
    ]
  ),

  "stomies/prevenir-les-irritations-peristomiales": fiche(
    "Limiter les irritations cutanées autour d'une stomie par une prévention adaptée au quotidien.",
    [
      "Ajuster précisément la découpe du support à la taille de la stomie pour éviter tout contact direct des effluents avec la peau.",
      "Utiliser des produits de protection cutanée (pâte, anneau, film protecteur) selon les besoins identifiés.",
      "Respecter un rythme de change adapté au type de stomie et au débit des effluents, sans excès ni délai trop long.",
      "Éviter les produits parfumés ou irritants lors de la toilette de la zone péristomiale.",
      "Surveiller régulièrement l'apparition de plis cutanés ou de zones de fragilité pouvant favoriser les fuites.",
    ],
    [
      "Irritation cutanée qui s'aggrave malgré les mesures de protection habituelles.",
      "Douleur importante ou saignement persistant de la peau péristomiale.",
      "Fuites répétées malgré un appareillage a priori bien ajusté : réévaluation du matériel nécessaire.",
    ]
  ),

  "urgences/conduite-a-tenir-face-a-une-chute-a-domicile": fiche(
    "Évaluer un patient après une chute à domicile et orienter la décision de prise en charge.",
    [
      "Ne jamais relever immédiatement le patient sans avoir évalué l'absence de douleur évocatrice de fracture ou de traumatisme.",
      "Rechercher une perte de connaissance, une confusion ou des signes neurologiques associés à la chute.",
      "Vérifier la prise de traitements anticoagulants ou antiagrégants, majorant le risque hémorragique en cas de traumatisme crânien.",
      "Examiner les points d'appui et les zones douloureuses avant toute mobilisation.",
      "Rechercher une cause potentiellement corrigible à la chute (hypotension, trouble du rythme, environnement à risque).",
    ],
    [
      "Traumatisme crânien chez un patient sous anticoagulant, même en l'absence de symptôme immédiat.",
      "Douleur évocatrice de fracture, impotence fonctionnelle ou déformation visible.",
      "Chutes répétées : signal à transmettre pour une évaluation globale du risque.",
    ]
  ),

  "urgences/reperer-les-signes-d-une-detresse-respiratoire": fiche(
    "Reconnaître rapidement les signes de détresse respiratoire pour engager les premiers réflexes adaptés.",
    [
      "Observer la fréquence respiratoire, l'amplitude et le caractère régulier ou non de la respiration.",
      "Rechercher des signes de lutte : tirage, battement des ailes du nez, mise en jeu des muscles accessoires.",
      "Évaluer la coloration cutanée et des lèvres (cyanose) et l'état de conscience du patient.",
      "Mesurer la saturation en oxygène si le matériel est disponible, en gardant en tête ses limites (mauvaise perfusion périphérique, vernis à ongles).",
      "Installer le patient en position demi-assise, favorable au confort respiratoire, sauf contre-indication.",
    ],
    [
      "Détresse respiratoire franche, cyanose ou trouble de la conscience : appel des secours sans délai.",
      "Saturation basse ou en baisse rapide par rapport aux valeurs habituelles du patient.",
      "Douleur thoracique associée à la gêne respiratoire.",
    ]
  ),

  "soins-palliatifs/evaluer-la-douleur-en-soins-palliatifs": fiche(
    "Objectiver la douleur d'un patient en soins palliatifs pour adapter la prise en charge antalgique en lien avec l'équipe médicale.",
    [
      "Utiliser une échelle adaptée à l'état de communication du patient (échelle numérique, verbale simple, ou comportementale si le patient ne peut s'exprimer).",
      "Évaluer la douleur au repos et lors des mobilisations ou des soins.",
      "Rechercher les caractéristiques de la douleur : localisation, intensité, type (continue, par accès), facteurs déclenchants.",
      "Réévaluer systématiquement après toute adaptation thérapeutique pour objectiver son efficacité.",
      "Transmettre une évaluation chiffrée et datée plutôt qu'une appréciation générale, pour permettre un suivi comparatif.",
    ],
    [
      "Douleur non soulagée malgré le traitement en cours.",
      "Douleur d'apparition brutale ou de caractéristiques nouvelles par rapport à d'habitude.",
      "Signes de détresse associés (agitation, épuisement) faisant suspecter une douleur mal évaluée.",
    ]
  ),

  "soins-palliatifs/accompagner-la-famille-en-fin-de-vie": fiche(
    "Soutenir l'entourage d'un patient en fin de vie à travers une communication claire et bienveillante.",
    [
      "Prendre le temps d'écouter les inquiétudes de la famille sans se précipiter sur les gestes techniques.",
      "Expliquer simplement ce qui est observé et ce qui est fait, sans détourner les questions directes.",
      "Respecter le rythme et les besoins de chaque proche, certains souhaitant être présents, d'autres non.",
      "Orienter vers les ressources disponibles (équipe de soins palliatifs, associations, soutien psychologique) si besoin.",
      "Veiller à sa propre disponibilité émotionnelle et ne pas hésiter à s'appuyer sur l'équipe pluridisciplinaire.",
    ],
    [
      "Détresse psychologique majeure d'un proche nécessitant un relais professionnel.",
      "Conflit ou incompréhension entre les proches et l'équipe soignante sur la prise en charge.",
      "Questionnement de la famille sur des directives anticipées ou une décision médicale à clarifier avec le médecin.",
    ]
  ),

  "ngap/comprendre-la-cotation-d-une-seance-de-soins": fiche(
    "Comprendre les principes généraux qui structurent la cotation d'une séance de soins infirmiers à domicile.",
    [
      "Identifier la nature de l'acte réalisé (soin infirmier, acte médico-infirmier, séance de surveillance) pour orienter le type de cotation.",
      "Distinguer les actes cotés à l'acte de ceux couverts par un forfait, selon la situation du patient.",
      "Vérifier la cohérence entre la prescription médicale et l'acte réellement réalisé avant de coter.",
      "Tenir à jour ses connaissances : la nomenclature évolue régulièrement et les codes précis doivent être vérifiés sur la version en vigueur.",
      "Conserver une traçabilité claire de chaque acte réalisé, utile en cas de contrôle.",
    ],
    [
      "Doute sur la cotation applicable à une situation inhabituelle ou complexe.",
      "Écart entre la prescription et l'acte réalisé sur le terrain.",
      "Évolution récente de la nomenclature dont l'application concrète n'est pas claire : se référer aux sources officielles à jour plutôt qu'à une habitude ancienne.",
    ]
  ),

  "ngap/bien-renseigner-une-demarche-de-soins-infirmiers": fiche(
    "Structurer une démarche de soins infirmiers (DSI) complète pour les patients relevant d'une prise en charge complexe.",
    [
      "Décrire précisément la situation clinique et le contexte de vie du patient justifiant la prise en charge.",
      "Détailler les actes de soins de base et les besoins d'aide identifiés, en cohérence avec l'évaluation réalisée.",
      "Fixer des objectifs de soins réalistes et mesurables, réévalués périodiquement.",
      "Associer le médecin traitant à la validation de la démarche lorsque cela est requis.",
      "Mettre à jour la DSI en cas d'évolution significative de l'état du patient plutôt que d'attendre l'échéance habituelle.",
    ],
    [
      "Évolution de l'état du patient rendant la DSI en cours obsolète.",
      "Désaccord ou question du prescripteur sur le contenu de la démarche.",
      "Incertitude sur les éléments obligatoires à faire figurer : se référer à la nomenclature en vigueur.",
    ]
  ),

  "bsi/structurer-un-bilan-de-soins-infirmiers": fiche(
    "Construire un bilan de soins infirmiers (BSI) clair, complet et exploitable par l'ensemble de l'équipe.",
    [
      "Recueillir les éléments médicaux, fonctionnels et environnementaux nécessaires à une vision globale du patient.",
      "Évaluer l'autonomie du patient dans les actes de la vie quotidienne à l'aide d'une grille adaptée.",
      "Identifier les risques associés (chute, escarre, dénutrition) pour orienter les actions de prévention.",
      "Formuler des objectifs de soins concrets, priorisés selon les besoins identifiés.",
      "Présenter le bilan de façon structurée pour faciliter sa lecture par les autres professionnels impliqués.",
    ],
    [
      "Élément nouveau modifiant significativement l'évaluation initiale du patient.",
      "Risque identifié nécessitant une action immédiate (risque de chute majeur, dénutrition sévère).",
      "Incohérence entre le bilan et l'évolution clinique observée sur le terrain.",
    ]
  ),

  "bsi/reevaluer-un-bsi-dans-le-temps": fiche(
    "Déterminer le bon moment et la bonne méthode pour réévaluer un bilan de soins infirmiers déjà établi.",
    [
      "Réévaluer systématiquement à échéance prévue, mais aussi dès qu'un changement clinique significatif survient.",
      "Comparer explicitement la nouvelle évaluation à la précédente pour objectiver une amélioration, une stagnation ou une dégradation.",
      "Ajuster les objectifs de soins en fonction de l'évolution réelle du patient, sans reconduire un bilan par habitude.",
      "Impliquer le patient et son entourage dans la réévaluation lorsque cela est pertinent.",
      "Documenter clairement les raisons d'une réévaluation anticipée si elle intervient avant l'échéance habituelle.",
    ],
    [
      "Dégradation rapide de l'autonomie ou de l'état général du patient.",
      "Événement intercurrent (hospitalisation, chute, changement de traitement) modifiant la situation.",
      "Décalage persistant entre le bilan documenté et la réalité observée en visite.",
    ]
  ),

  "prelevements/bonnes-pratiques-du-prelevement-veineux": fiche(
    "Réaliser un prélèvement veineux dans des conditions optimales de sécurité et de qualité préanalytique.",
    [
      "Vérifier l'identité du patient et la concordance avec la prescription et les tubes préparés.",
      "Choisir un site de ponction adapté, en évitant les zones inflammatoires, les fistules ou le bras perfusé.",
      "Respecter l'ordre de remplissage des tubes recommandé pour éviter toute contamination croisée entre additifs.",
      "Homogénéiser chaque tube selon les recommandations, sans agitation excessive pouvant hémolyser l'échantillon.",
      "Étiqueter les tubes immédiatement après le prélèvement, en présence du patient.",
    ],
    [
      "Difficulté de ponction répétée : privilégier un autre site plutôt que de multiplier les tentatives sur la même zone.",
      "Malaise vagal du patient pendant ou après le prélèvement.",
      "Doute sur l'identité du patient ou sur la conformité de la prescription.",
    ]
  ),

  "prelevements/gerer-un-prelevement-a-jeun-ou-sous-traitement": fiche(
    "Adapter la réalisation d'un prélèvement sanguin au contexte de jeûne ou de traitement en cours du patient.",
    [
      "Vérifier auprès du patient le respect effectif du jeûne demandé avant de réaliser le prélèvement.",
      "Identifier les traitements en cours pouvant influencer certains résultats (anticoagulants, corticoïdes, etc.) et le signaler si pertinent.",
      "Noter l'heure exacte du prélèvement lorsque celle-ci a une importance pour l'interprétation (dosages hormonaux, pics médicamenteux).",
      "Informer le patient des modalités de reprise de son traitement habituel après le prélèvement si besoin.",
      "Signaler toute non-conformité (jeûne non respecté, horaire décalé) plutôt que de la passer sous silence.",
    ],
    [
      "Jeûne non respecté pour un dosage qui l'exige strictement : en informer le laboratoire et le prescripteur.",
      "Traitement anticoagulant avec risque de saignement prolongé au point de ponction.",
      "Doute sur la compatibilité entre un traitement en cours et le prélèvement demandé.",
    ]
  ),

  "medicaments-injectables/realiser-une-injection-sous-cutanee": fiche(
    "Réaliser une injection sous-cutanée en respectant les sites, l'angle d'injection et les règles de sécurité.",
    [
      "Choisir un site adapté (abdomen, face externe des cuisses, face postérieure des bras) selon le produit injecté.",
      "Vérifier systématiquement la date de péremption et l'intégrité de l'emballage avant toute injection.",
      "Réaliser un pli cutané si nécessaire, injecter avec un angle adapté à la longueur de l'aiguille utilisée.",
      "Ne pas masser le point d'injection après un anticoagulant, au risque de favoriser un hématome.",
      "Alterner les sites d'injection pour préserver la qualité du tissu sous-cutané.",
    ],
    [
      "Douleur inhabituelle, saignement important ou hématome extensif après l'injection.",
      "Doute sur la dose ou le produit prescrit : ne jamais injecter en cas d'incertitude.",
      "Zone d'injection présentant des signes d'infection ou d'induration ancienne.",
    ]
  ),

  "medicaments-injectables/realiser-une-injection-intramusculaire": fiche(
    "Réaliser une injection intramusculaire en toute sécurité, en respectant les repères anatomiques appropriés.",
    [
      "Choisir le site en fonction du volume à injecter et du profil du patient (quadrant supéro-externe de la fesse, deltoïde, face antérolatérale de la cuisse).",
      "Vérifier l'absence de contre-indication connue (trouble de la coagulation, allergie au produit).",
      "Aspirer avant injection si le protocole du produit le recommande, pour vérifier l'absence de reflux sanguin.",
      "Injecter lentement et régulièrement pour limiter la douleur et améliorer la diffusion du produit.",
      "Surveiller le patient dans les minutes suivant l'injection en cas de produit à risque allergique connu.",
    ],
    [
      "Douleur intense, irradiante ou trouble sensitif après l'injection, pouvant évoquer une atteinte nerveuse.",
      "Signes de réaction allergique dans les minutes suivant l'injection.",
      "Doute sur le site anatomique adapté chez un patient très maigre ou très corpulent.",
    ]
  ),

  "anticoagulants/surveiller-un-patient-sous-anticoagulant": fiche(
    "Repérer les signes évocateurs d'un surdosage ou d'une complication hémorragique chez un patient anticoagulé.",
    [
      "Rechercher des signes de saignement à chaque visite : ecchymoses inhabituelles, saignement des gencives, sang dans les selles ou les urines.",
      "Interroger sur des céphalées inhabituelles ou des troubles neurologiques, pouvant évoquer un saignement intracrânien.",
      "Vérifier la bonne prise du traitement et l'absence d'interaction récente (nouveau médicament, automédication).",
      "S'assurer du suivi biologique prévu (INR ou autre) lorsque le traitement le nécessite.",
      "Sensibiliser le patient aux situations à risque : chute, plaie, geste invasif prévu (dentaire, chirurgical).",
    ],
    [
      "Saignement actif, extériorisé ou non, chez un patient anticoagulé.",
      "Traumatisme crânien même mineur chez un patient sous anticoagulant.",
      "Résultat biologique très éloigné de la cible thérapeutique habituelle.",
    ]
  ),

  "anticoagulants/education-du-patient-sous-anticoagulant-oral": fiche(
    "Transmettre au patient les messages essentiels pour sécuriser son traitement anticoagulant au quotidien.",
    [
      "Expliquer l'importance de la régularité de prise, à heure fixe, sans oubli ni doublement de dose.",
      "Alerter sur les risques liés à l'automédication, en particulier les anti-inflammatoires et certains compléments alimentaires.",
      "Informer sur la conduite à tenir en cas de saignement mineur (compression prolongée) et sur les signes justifiant un avis médical urgent.",
      "Rappeler l'importance de signaler ce traitement à tout professionnel de santé consulté, y compris le dentiste.",
      "Vérifier que le patient dispose d'une carte ou d'un document mentionnant son traitement anticoagulant.",
    ],
    [
      "Patient exprimant une mauvaise compréhension de son traitement ou des risques associés.",
      "Oubli répété de prise rapporté par le patient ou l'entourage.",
      "Projet de geste invasif (chirurgie, soin dentaire) sans consigne claire sur la gestion du traitement.",
    ]
  ),

  "retour-hospitalisation/preparer-la-premiere-visite-apres-une-sortie-d-hopital": fiche(
    "Sécuriser la première visite à domicile après une sortie d'hospitalisation, moment à risque de rupture de prise en charge.",
    [
      "Récupérer et lire attentivement le compte-rendu d'hospitalisation et la nouvelle ordonnance avant la visite si possible.",
      "Comparer le traitement de sortie à celui pris avant l'hospitalisation pour repérer les changements.",
      "Vérifier la compréhension du patient et de l'entourage sur les nouvelles consignes et le suivi prévu.",
      "Évaluer l'état général et l'autonomie du patient, potentiellement modifiés par l'hospitalisation.",
      "Identifier les rendez-vous de suivi programmés et s'assurer qu'ils sont bien planifiés.",
    ],
    [
      "Divergence importante entre l'ordonnance de sortie et le traitement habituel du patient.",
      "Absence de compte-rendu ou d'ordonnance disponible au moment de la visite.",
      "Dégradation de l'état général par rapport à ce qui était attendu à la sortie.",
    ]
  ),

  "retour-hospitalisation/reperer-les-traitements-a-risque-apres-une-hospitalisation": fiche(
    "Identifier les traitements nécessitant une vigilance particulière sur l'ordonnance de sortie d'hospitalisation.",
    [
      "Repérer les traitements à marge thérapeutique étroite (anticoagulants, antiarythmiques, insuline) fraîchement introduits ou modifiés.",
      "Vérifier l'absence de doublon entre un traitement habituel et un traitement introduit à l'hôpital sous un autre nom commercial.",
      "S'assurer que les modalités précises (dose, horaire, durée) sont claires pour le patient et pour l'IDEL.",
      "Signaler au médecin traitant toute incohérence repérée entre l'ancien et le nouveau traitement.",
      "Réévaluer régulièrement la pertinence de poursuivre un traitement introduit temporairement à l'hôpital.",
    ],
    [
      "Doublon ou interaction potentielle identifiée entre deux traitements de l'ordonnance de sortie.",
      "Traitement à risque introduit sans consigne de surveillance claire.",
      "Patient ou entourage manifestement en difficulté pour gérer le nouveau traitement.",
    ]
  ),

  "hygiene-et-prevention/precautions-standard-a-domicile": fiche(
    "Appliquer les précautions standard d'hygiène lors de chaque intervention à domicile, quel que soit le patient.",
    [
      "Réaliser une friction hydro-alcoolique avant et après chaque contact avec le patient ou son environnement proche.",
      "Porter des gants pour tout contact avec du sang, des liquides biologiques ou une peau lésée.",
      "Utiliser un matériel à usage unique dès que possible, ou assurer une désinfection rigoureuse du matériel réutilisable.",
      "Éliminer les déchets de soins selon la filière adaptée (DASRI pour le matériel piquant, coupant, tranchant).",
      "Adapter les précautions complémentaires en cas de pathologie transmissible connue du patient.",
    ],
    [
      "Exposition accidentelle à du sang ou un liquide biologique (piqûre, projection).",
      "Patient présentant des symptômes évocateurs d'une infection transmissible non signalée.",
      "Doute sur la filière d'élimination adaptée pour un déchet de soin particulier.",
    ]
  ),

  "hygiene-et-prevention/prevenir-la-transmission-croisee-entre-patients": fiche(
    "Limiter le risque de transmission croisée entre patients au cours d'une tournée d'IDEL.",
    [
      "Organiser sa trousse de soins pour séparer clairement le matériel propre du matériel utilisé.",
      "Nettoyer et désinfecter le matériel réutilisable entre chaque patient selon le protocole en vigueur.",
      "Réaliser l'hygiène des mains de façon systématique à l'entrée et à la sortie de chaque domicile.",
      "Éviter de poser la trousse de soins directement sur des surfaces potentiellement contaminées.",
      "Prioriser l'ordre de la tournée en tenant compte des patients les plus à risque (immunodéprimés, plaies) si l'organisation le permet.",
    ],
    [
      "Patient connu porteur d'une bactérie multirésistante ou d'une infection transmissible.",
      "Rupture de stock de matériel à usage unique obligeant à improviser une solution non conforme.",
      "Doute sur l'efficacité de la désinfection réalisée sur un matériel réutilisable.",
    ]
  ),

  "education-therapeutique/structurer-un-temps-d-education-therapeutique": fiche(
    "Construire un temps d'échange pédagogique efficace pour accompagner un patient dans la gestion de sa pathologie.",
    [
      "Partir des connaissances et des représentations déjà présentes chez le patient plutôt que de tout réexpliquer depuis le début.",
      "Fixer un objectif clair et limité pour chaque échange, plutôt que de vouloir tout couvrir en une seule fois.",
      "Utiliser un langage simple, illustré d'exemples concrets liés au quotidien du patient.",
      "Vérifier la compréhension en demandant au patient de reformuler avec ses propres mots.",
      "Planifier un temps de suivi pour consolider les messages abordés.",
    ],
    [
      "Patient manifestement en difficulté de compréhension malgré plusieurs reformulations.",
      "Écart important entre ce que le patient dit avoir compris et son comportement observé.",
      "Besoin d'éducation dépassant le cadre du rôle infirmier, nécessitant une orientation spécialisée.",
    ]
  ),

  "education-therapeutique/evaluer-l-autonomie-d-un-patient-dans-son-traitement": fiche(
    "Repérer les signaux indiquant le niveau d'autonomie réel d'un patient dans la gestion de son traitement.",
    [
      "Observer la concordance entre le nombre de comprimés restants et le nombre théorique attendu depuis la dernière visite.",
      "Interroger le patient sur sa façon d'organiser la prise de ses médicaments au quotidien (pilulier, horaires).",
      "Repérer les signes d'oubli répété : traitement non pris à l'heure habituelle, confusion entre plusieurs médicaments.",
      "Évaluer l'environnement du patient : aide de l'entourage disponible, difficultés visuelles ou cognitives.",
      "Adapter l'accompagnement proposé au niveau d'autonomie réellement observé, et non supposé.",
    ],
    [
      "Écart important et répété entre la prescription et la prise réelle constatée.",
      "Signes de confusion ou de trouble cognitif nouveau impactant la gestion du traitement.",
      "Absence d'aide disponible pour un patient manifestement en difficulté d'autonomie.",
    ]
  ),

  "gestion-du-cabinet-idel/organiser-sa-tournee-efficacement": fiche(
    "Structurer l'organisation d'une tournée quotidienne pour gagner en efficacité sans dégrader la qualité des soins.",
    [
      "Regrouper les patients par secteur géographique plutôt que par ordre chronologique de prescription.",
      "Tenir compte des contraintes horaires réelles (soins à jeun, horaires de médicaments) dans l'ordre de passage.",
      "Prévoir des marges de temps réalistes pour absorber les imprévus sans reporter systématiquement sur les derniers patients.",
      "Anticiper le matériel nécessaire pour chaque patient avant de partir, pour éviter les allers-retours.",
      "Réévaluer régulièrement l'organisation de la tournée à mesure que la patientèle évolue.",
    ],
    [
      "Tournée systématiquement rallongée au point de compromettre la qualité de la prise en charge.",
      "Patient régulièrement visité en dehors de la fenêtre horaire adaptée à son traitement.",
      "Difficulté récurrente à absorber les imprévus malgré les ajustements d'organisation.",
    ]
  ),

  "gestion-du-cabinet-idel/gerer-le-materiel-et-les-stocks-du-cabinet": fiche(
    "Assurer un suivi fiable du matériel et des stocks consommables du cabinet pour éviter les ruptures.",
    [
      "Tenir un inventaire régulier du matériel critique (pansements, matériel de perfusion, protections).",
      "Vérifier les dates de péremption lors de chaque réapprovisionnement et organiser une rotation des stocks.",
      "Anticiper les besoins liés à des patients spécifiques (pansements particuliers, matériel de stomie) plutôt que de les découvrir sur le terrain.",
      "Centraliser le suivi des stocks si le cabinet compte plusieurs professionnels, pour éviter les doublons ou les oublis.",
      "Prévoir une marge de sécurité pour le matériel utilisé en urgence.",
    ],
    [
      "Rupture de stock sur un matériel indispensable à une prise en charge en cours.",
      "Matériel périmé découvert lors d'une visite, à ne jamais utiliser.",
      "Besoin récurrent non anticipé pour un patient particulier.",
    ]
  ),

  "documents-professionnels/rediger-une-transmission-ciblee": fiche(
    "Rédiger une transmission claire, utile et exploitable par les autres professionnels intervenant auprès du patient.",
    [
      "Décrire un fait observé plutôt qu'une interprétation, en restant factuel et précis.",
      "Structurer la transmission autour d'un problème identifié, des actions réalisées et du résultat observé.",
      "Dater et horodater systématiquement chaque transmission pour permettre un suivi chronologique fiable.",
      "Éviter les abréviations ambiguës qui pourraient être mal comprises par un autre professionnel.",
      "Prioriser l'information réellement utile à la continuité des soins plutôt que de tout consigner sans hiérarchie.",
    ],
    [
      "Élément clinique nouveau nécessitant une transmission urgente plutôt qu'une simple note différée.",
      "Doute sur la bonne compréhension d'une transmission antérieure par l'équipe.",
      "Absence de retour ou de prise en compte d'une transmission importante déjà réalisée.",
    ]
  ),

  "documents-professionnels/modele-de-courrier-de-liaison": fiche(
    "Structurer un courrier de liaison efficace à destination du médecin traitant ou d'un autre professionnel.",
    [
      "Rappeler brièvement le contexte de la prise en charge et le motif du courrier.",
      "Présenter les éléments cliniques observés de façon synthétique et chronologique.",
      "Formuler clairement la question ou la demande adressée au destinataire, si le courrier en comporte une.",
      "Joindre les éléments utiles (constantes, évolution d'une plaie) sans surcharger le courrier de détails superflus.",
      "Relire le courrier avant envoi pour vérifier sa clarté pour un lecteur qui n'a pas suivi le patient au quotidien.",
    ],
    [
      "Situation nécessitant une réponse rapide du médecin : privilégier un contact direct plutôt qu'un courrier différé.",
      "Absence de réponse à un courrier de liaison portant sur un point important.",
      "Incertitude sur le bon destinataire du courrier dans une prise en charge multi-intervenants.",
    ]
  ),

  "calculateurs-et-echelles/utiliser-l-echelle-de-braden": fiche(
    "Comprendre les dimensions évaluées par l'échelle de Braden pour estimer le risque d'escarre d'un patient alité ou à mobilité réduite.",
    [
      "L'échelle évalue six dimensions : perception sensorielle, humidité, activité, mobilité, nutrition, friction et cisaillement.",
      "Chaque dimension est cotée sur une échelle de points ; le score total oriente le niveau de risque global.",
      "Un score plus bas traduit un risque plus élevé de développer une escarre.",
      "Réévaluer l'échelle à intervalles réguliers et à chaque changement significatif de l'état du patient.",
      "Utiliser le résultat pour orienter les actions de prévention (positionnement, support adapté, surveillance cutanée), pas comme une fin en soi.",
    ],
    [
      "Score traduisant un risque élevé chez un patient sans mesure de prévention en place.",
      "Dégradation rapide du score entre deux évaluations.",
      "Apparition de lésions cutanées malgré un score initialement rassurant : réévaluer sans délai.",
    ]
  ),

  "calculateurs-et-echelles/calculer-un-debit-de-perfusion": fiche(
    "Rappeler la méthode de calcul d'un débit de perfusion en gouttes par minute à partir du volume et de la durée prescrits.",
    [
      "Identifier le volume total à perfuser et la durée prescrite pour la perfusion.",
      "Connaître le facteur de gouttes du dispositif utilisé, généralement indiqué sur l'emballage de la tubulure.",
      "Appliquer la formule : débit (gouttes/min) = (volume en mL × facteur de gouttes) ÷ (durée en minutes).",
      "Vérifier le résultat obtenu en le confrontant au bon sens clinique (un débit très rapide ou très lent doit interroger).",
      "Recontrôler le débit réel régulièrement pendant la perfusion, un réglage initial pouvant dériver dans le temps.",
    ],
    [
      "Débit calculé qui semble incompatible avec l'état du patient (surcharge, fragilité cardiaque).",
      "Écart important entre le débit calculé et le débit observé en cours de perfusion.",
      "Doute sur le facteur de gouttes du dispositif utilisé : vérifier avant de calculer plutôt que de supposer.",
    ]
  ),
};

module.exports = { FICHES_CONTENU };
