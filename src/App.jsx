import React, { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "./lib/supabaseClient";

/* ------------------------------------------------------------------ */
/*  LOGOS                                                              */
/* ------------------------------------------------------------------ */

export const LOGOS = {
  sabich: "./assets/sabich.svg",
  tmsk:   "./assets/tmsk.svg",
  riad:   "./assets/riad.svg",
  foyer:  "./assets/foyer.png",
  life:   "./assets/life.webp",
  sabichBlanc:  "./assets/sabichBlanc.svg",
  pictoDash:     "./assets/pictoDash.svg",
  pictoReglages: "./assets/pictoReglages.svg",
  fond:          "./assets/fond.jpg",
  tmskBlanc:    "./assets/tmskBlanc.svg",
  riadBlanc:    "./assets/riadBlanc.svg",
  foyerBlanc:   "./assets/foyerBlanc.png",
  contenuBlanc: "./assets/contenuBlanc.png",
  contenu: "./assets/contenu.png",
  taamBlanc: "./assets/taamBlanc.svg",
  taamVert:  "./assets/taamVert.svg",
};

export const MAISON = { nom: "La maison", marque: "#C97F72", tint: "#FDF3EC",
                 accent: "#9BD08A", ciel: "#8EC5E6", soleil: "#F5E07A" };

const AQUARELLE = "linear-gradient(125deg,#B98FC9 0%,#E9A2C4 32%,#F3BC82 58%,#8FCFC2 82%,#A9C79B 100%)";

/* ------------------------------------------------------------------ */
/*  STYLE                                                              */
/* ------------------------------------------------------------------ */

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;700&display=swap');

.pil * { box-sizing: border-box; }
.pil {
  /* Les six teintes d'un univers. Elles valent le vert sauge de la maison mère
     par défaut, et chaque intercalaire les repeint aux siennes en entrant. */
  --u-encre: #33482C; --u-titre: #3B4F35; --u-doux: #656E62;
  --u-bord: #C8CEB4; --u-filet: #F1F4E9; --u-feuille: transparent;
  font-family: 'Jost', system-ui, sans-serif;
  font-weight: 400;
  color: #33402C;
  /* Le fond de l'appli est un crème doux et fixe, le même partout :
     ce n'est plus la page qui prend la couleur de l'onglet ouvert,
     seuls l'intercalaire et son en-tête la portent (voir .card:has(> .crest)). */
  background: #FAF6EE;
  min-height: 100vh;
  padding: 26px 16px 100px;
  -webkit-font-smoothing: antialiased;
}
.pil input, .pil select { font-family: 'Jost', sans-serif; font-weight: 400; color: #33402C; }
.pil button { font-family: 'Jost', sans-serif; font-weight: 400; }

.wrap { max-width: 980px; margin: 0 auto; }

/* Les libellés sont des repères discrets, pas des étiquettes techniques */
.eyebrow { font-size: 14px; color: var(--u-doux); font-weight: 500;
  letter-spacing: .12em; text-transform: uppercase; }
.heroLbl { font-size: 15.5px; color: var(--u-titre); font-weight: 500;
  letter-spacing: .11em; text-transform: uppercase; }
.h1 { font-size: 36px; font-weight: 300; letter-spacing: .09em; margin: 0;
  text-transform: uppercase; }
.h2 { font-size: 17px; font-weight: 500; margin: 0 0 20px; letter-spacing: .1em;
  text-transform: uppercase; color: var(--u-titre); }

.card { background: #FFFFFF; border-radius: 18px; padding: 24px 26px;
  border: 1px solid var(--u-bord); margin-bottom: 14px;
  box-shadow: 0 1px 2px rgba(90,100,70,.04); }
.card .card { border:none; background:transparent; padding:0; margin:0; }

/* Un tableau de bord se lit d'un coup d'œil : deux colonnes qui se
   remplissent, pas une page qu'on déroule. */
.board { display:grid; grid-template-columns: 1.08fr .92fr; gap:14px; align-items:start; }
.board > .col { display:flex; flex-direction:column; gap:14px; min-width:0; }
.board .card { margin-bottom:0; }
.bandeau { margin-bottom:14px; }
@media (max-width: 900px) {
  .board { grid-template-columns:1fr; }
  /* Sur téléphone, ce qui demande une décision remonte avant le constat */
  .board > .col:last-child { order:-1; }
}

.hero { display:grid; grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
  gap:0; margin-bottom:18px; }
.hero .card { border:none; background:transparent; border-radius:0; margin:0;
  padding: 4px 30px 4px 0; }
.hero .card + .card { border-left:1px solid var(--u-bord); padding-left:30px; }
.heroNum { font-size: 54px; font-weight: 300; line-height:1.05; margin-top:6px;
  letter-spacing:-.025em; font-variant-numeric: tabular-nums; }
.heroNote { font-size: 16.5px; color:var(--u-doux); margin-top:10px; line-height:1.55; }

.bar { display:flex; height:12px; border-radius:6px; overflow:hidden; margin-bottom:20px; background:var(--u-filet); }
.barSeg { transition: width .3s; }

.row { display:flex; justify-content:space-between; align-items:center; gap:12px;
  padding: 12px 0; border-bottom: 1px solid var(--u-filet); font-size: 16.5px; }
.row:last-child { border-bottom: none; }
.row .lbl { color:var(--u-titre); }
.row .val { font-variant-numeric: tabular-nums; white-space: nowrap; }
.rowTot { font-size:19px; font-weight:500; padding-top:15px; border-top:1px solid var(--u-bord);
  border-bottom:none; margin-top:5px; }

/* ---- Les intercalaires : cinq affaires, cinq couleurs, un seul gabarit ---- */
.tabs { display:flex; gap:8px; margin: 22px 0 0; padding: 0;
  align-items:flex-end; overflow-x:auto; scrollbar-width:none; }
.tabs::-webkit-scrollbar { display:none; }
.tab { flex:1 1 96px; max-width:158px; height:82px; border:none; cursor:pointer;
  border-radius: 15px 15px 0 0; padding: 0 12px; position:relative;
  display:flex; align-items:center; justify-content:center; overflow:hidden;
  box-shadow: 0 1px 2px rgba(40,30,20,.10);
  transition: filter .18s; filter: grayscale(.45) brightness(1.14); }
.tab:hover { filter: grayscale(.15) brightness(1.05); }
/* L'ivoire de TMSK est sa marque, pas un accident — mais seul clair d'une
   rangee d'aplats, il se lisait comme un onglet vide. Un filet interieur lui
   rend le poids des autres, sans lui prendre sa couleur. */
/* Le liseré des languettes claires court sur le haut et les côtés seulement :
   rien en bas, la languette se fond dans sa feuille. */
.tab.clair { box-shadow: none; }
.tab.on { filter:none; z-index:2; }
/* TAAM garde son ivoire même au repos : éclairci, il virait au blanc. */
.tab.garde, .tab.garde:hover { filter:none; }
.tab .lib { color:#fff; font-size:13px; font-weight:500; letter-spacing:.13em;
  text-transform:uppercase; white-space:nowrap; text-align:center; line-height:1.35; }
.tab img { max-height:46px; max-width:88px; width:auto; object-fit:contain; display:block; }
/* Pas de cadre blanc intérieur au clic : sur les languettes claires il
   dessinait un double contour. */
.tab:focus, .tab:focus-visible { outline:none; }

.nav { display:flex; gap:5px; margin: 22px 0 0; padding: 0 2px;
  align-items:flex-end; overflow-x:auto; scrollbar-width:none; border-bottom:2px solid #E4E9D6; }
.nav::-webkit-scrollbar { display:none; }
.navSimple { display:flex; gap:9px; flex-wrap:wrap; }

/* Saisir : une action, un bouton plein, impossible à manquer */
.btnSaisie { border:none; border-radius:12px; padding:15px 22px; cursor:pointer;
  font-size:15px; font-weight:500; color:#fff; display:inline-flex;
  align-items:center; gap:9px; min-height:52px; letter-spacing:.11em;
  text-transform:uppercase; transition:filter .15s, box-shadow .15s; }
.btnSaisie { box-shadow:0 2px 7px rgba(30,20,10,.14); }
.btnSaisie:hover { filter:brightness(1.09); }
.btnSaisie.ouvert { filter:brightness(.93); }
.btnSaisie.ouvert:hover { filter:brightness(.82); }
.btnSaisie:focus-visible { outline:2px solid var(--u-encre); outline-offset:2px; }
.plus { font-size:21px; line-height:1; font-weight:300; letter-spacing:0; }

/* Consulter : léger, souligné */
.sections { display:flex; gap:24px; flex-wrap:wrap; border-bottom:1px solid var(--u-filet); margin-top:4px; }
.sections button { border:none; background:none; cursor:pointer; padding:14px 1px 12px;
  font-size:14px; font-weight:500; letter-spacing:.11em; text-transform:uppercase;
  color:var(--u-doux); border-bottom:2.5px solid transparent; margin-bottom:-1px;
  transition:color .15s; }
.sections button:hover { color:var(--u-titre); }
.sections button.on { color:var(--u-encre); font-weight:500; border-bottom-color:var(--u-encre); }
.sections button:focus-visible { outline:2px solid #5E8F1E; outline-offset:2px; }

/* La maison garde ses formes à elle : plus rondes que celles des commerces.
   Ses couleurs, elles, viennent de l'univers comme partout ailleurs. */
.maison .card { border-radius: 24px; }
.maison .btnSaisie { border-radius:16px; }

/* Boutons secondaires : contour net, cible large */
.pill { padding: 12px 19px; border-radius: 12px; border:1.5px solid var(--u-bord); background:#fff;
  cursor:pointer; font-size:14px; color:var(--u-titre); font-weight:500; min-height:46px;
  letter-spacing:.1em; text-transform:uppercase; transition: all .15s; }
.pill:hover { border-color:var(--u-titre); background:#FCFDF8; }
.pill.on, .pil button.pill.on { background:var(--u-encre); color:#FFFFFF; border-color:var(--u-encre); }
.pill:focus-visible { outline:2px solid #5E8F1E; outline-offset:2px; }

.dot { width:11px; height:11px; border-radius:3px; display:inline-block; margin-right:12px; flex:none; }

.aff { display:flex; align-items:center; justify-content:space-between; gap:10px;
  padding:14px 0; border-bottom:1px solid var(--u-filet); }
.aff:last-child { border-bottom:none; }
.affName { display:flex; align-items:center; font-size:18px; }
.affNum { font-size:20.5px; font-weight:400; font-variant-numeric:tabular-nums; white-space:nowrap; }

.crest { display:flex; align-items:center; padding:18px 30px; margin:-24px -26px 18px;
  border-radius:0; height:98px; }
/* Toutes les bandes d'en-tête au même gabarit : même hauteur de bande du logo
   (celle du plus haut, le riad), et la carte d'en-tête à la hauteur de celles
   qui portent des boutons — les sous-onglets se calent en bas. */
.card:has(> .crest):has(> .sections) { display:flex; flex-direction:column; min-height:273px; }
.card:has(> .crest) > .sections { margin-top:auto; }
/* Paramètres : pas de sous-onglets, sa liste vit dans la carte d'en-tête.
   La bande de la feuille descend quand même à la hauteur des autres
   (273px), la carte blanche commence dessous. */
.panneau[data-vue="reglages"] .crest { margin-bottom:199px; }
.crest img { width:auto; object-fit:contain; display:block; }
.crestName { font-size:24px; font-weight:300; color:#fff; letter-spacing:.14em;
  text-transform:uppercase; }
.swatch { width:46px; height:46px; border-radius:12px; flex:none; }

.pos { color:#5E8F1E; }
.neg { color:#C9503A; }
.mut { color:var(--u-doux); }

label.f { display:block; font-size:16px; color:var(--u-doux); margin-bottom:7px; font-weight:400; }
input.f, select.f { width:100%; padding:14px 15px; border:1.5px solid var(--u-bord); border-radius:12px;
  background:#FDFEFA; font-size:17px; min-height:50px; }
input.f:hover, select.f:hover { border-color:var(--u-titre); }
/* Le calendrier du navigateur arrivait gris et bleu au milieu d'une interface
   entierement dessinee : on le repasse a l'encre de l'univers. */
.pil input[type="date"]::-webkit-calendar-picker-indicator {
  filter: grayscale(1) opacity(.55); cursor:pointer; }
input.f:focus, select.f:focus { outline:2px solid #5E8F1E; outline-offset:0; border-color:transparent; }
.grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
.grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:14px; }

/* Bouton principal : plein, large, une seule action par écran */
.btn, .pil button.btn { padding:16px 30px; border-radius:12px; border:none; background:var(--u-encre);
  color:#FFFFFF; font-size:15px; font-weight:500; cursor:pointer; min-height:52px;
  letter-spacing:.12em; text-transform:uppercase; transition:filter .15s; }
.btn:hover { filter:brightness(1.14); }
.btn:active { filter:brightness(.94); }
.btn:focus-visible { outline:2px solid #5E8F1E; outline-offset:3px; }

.mini { font-size:16px; color:var(--u-doux); line-height:1.6; }
.note { border-top:1px solid var(--u-filet); padding:14px 0 0; font-size:16px;
  color:var(--u-doux); line-height:1.6; margin-top:18px; max-width:64ch; }

.tag { font-size:13px; font-weight:500; letter-spacing:.09em; text-transform:uppercase;
  color:var(--u-doux); border:1px solid var(--u-bord); border-radius:8px;
  padding:4px 10px; white-space:nowrap; }

.empty { text-align:center; padding:40px 18px; color:var(--u-doux); font-size:16.5px; line-height:1.65; }

.mvBar { display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:13px 0; border-bottom:1px solid var(--u-filet); font-size:16.5px; }
.del, .pil button.del { border:none; background:none; color:var(--u-bord); cursor:pointer;
  font-size:22px; padding:2px 8px; line-height:1; border-radius:8px; }
.del:hover { color:#C9503A; background:#FBF0ED; }

/* Vue ACHATS — tableau d'audit des pièces d'achat. Une ligne par pièce,
   colonnes triables : trier par fournisseur ou par montant colle les
   doublons les uns aux autres, c'est ce qui les rend visibles. */
.achBloc { width:100%; overflow-x:auto; }
.achLigne { display:grid; grid-template-columns:104px 88px 140px 1fr 116px 96px 104px 34px;
  align-items:center; gap:12px; padding:12px 10px; border-bottom:1px solid var(--u-filet);
  font-size:16.5px; min-width:900px; }
.achTete { font-size:13px; letter-spacing:.08em; text-transform:uppercase;
  color:var(--u-doux); font-weight:500; border-bottom:1px solid var(--u-bord); }
.achTete button { border:none; background:none; cursor:pointer; padding:0; font:inherit;
  color:inherit; letter-spacing:inherit; text-transform:inherit; text-align:left; }
.achTete button:hover { color:var(--u-encre); }
.achCorps { cursor:pointer; }
.achCorps:hover { background:#FAF7F0; }
.achCorps.dbl { background:#FDECEC; }
.achCorps.dbl:hover { background:#FBE0E0; }
.achMt { text-align:right; font-variant-numeric:tabular-nums; }
.achEtat { font-size:14px; color:var(--u-doux); }
.achEtat.du { color:#B07C1E; }

@media (max-width: 640px) {
  .grid2, .grid3 { grid-template-columns:1fr; }
  .heroNum { font-size:44px; }
  .h1 { font-size:25px; letter-spacing:.07em; }
  .card { padding:20px 18px; border-radius:16px; }
  .crest { padding:14px 18px; margin:-20px -18px 14px; height:76px; }
  .card:has(> .crest):has(> .sections) { min-height:0; }
  .panneau[data-vue="reglages"] .crest { margin-bottom:14px; }
  .panneau[data-vue="reglages"] .card:has(> .crest) {
    background: linear-gradient(180deg, rgba(255,255,255,0) 0, rgba(255,255,255,0) 76px, #FFFFFF 76px) !important; }
  .crest img { transform: scale(.78); transform-origin: left center; }
  /* Les onglets reprenaient telles quelles leurs dimensions d'ordinateur :
     sur un téléphone, ça ne laissait voir que 3-4 affaires à la fois et ça
     dominait l'écran. Un gabarit spécifique, plus compact, pour le mobile. */
  .tab { flex:0 0 auto; width:66px; height:56px; border-radius:11px 11px 0 0; }
  .tab img { transform: scale(.58); }
  .tab .lib { font-size:11.5px; letter-spacing:.09em; }
  .hero { gap:0; }
  .hero .card { padding:14px 0; }
  .hero .card + .card { border-left:none; border-top:1px solid var(--u-bord); padding-left:0; padding-top:18px; }

  /* L'en-tête (logo + mois + flèches) ne tenait pas sur la largeur d'un
     téléphone : les flèches sortaient de l'écran et forçaient tout le site
     à défiler horizontalement. Sur petit écran, le mois passe sur sa
     propre ligne, pleine largeur, sous le titre. */
  .topbar { flex-wrap: wrap; row-gap: 12px; }
  .topbar .brand img { height: 58px; }
  .moisNav { width: 100%; }
  .moisNav .pill { flex: 1; padding: 12px 8px; }

  /* Une ligne (libellé + valeur/actions) trop chargée pour tenir sur une
     seule ligne passe sur deux plutôt que de déborder de l'écran. */
  .row { flex-wrap: wrap; row-gap: 6px; }
}
@media (prefers-reduced-motion: reduce) { .pil * { transition:none !important; } }

/* LE CLASSEUR — la languette arrondie dépasse en haut, le panneau descend
   d'un seul tenant en dessous. Pas de filet, pas de blanc, pas de coin qui
   se referme au raccord : l'onglet ouvert et sa page sont la même matière. */
/* La page du classeur. Elle prend la teinte de sa languette et la tient de
   haut en bas : c'est elle, et non un titre, qui dit sur quel commerce on est
   en train de saisir. Aucun filet ni blanc au raccord — la languette et sa
   page sont la même feuille. */
/* La feuille passe DEVANT les languettes fermées (elles s'arrêtent net sur
   son bord, rien ne déborde dessus) ; seule la languette ouverte passe devant
   la feuille, pour s'y souder. */
.panneau { margin-top:-1px; background: var(--u-feuille); padding: var(--u-feuillePad, 0);
  border-radius: 0 0 18px 18px; position:relative; z-index:1; }
.panneau > :first-child {
  border-top-left-radius:0 !important; border-top-right-radius:0 !important;
  border-top:none !important; border-left:none !important; border-right:none !important;
  margin-top:0 !important; box-shadow:none !important; }
/* La maison enveloppe ses cartes : la soudure doit descendre d'un cran */
.panneau > :first-child > .card:first-child {
  border-top-left-radius:0 !important; border-top-right-radius:0 !important;
  border-top:none !important; border-left:none !important; border-right:none !important;
  margin-top:0 !important; box-shadow:none !important; }

/* La carte d'en-tête (celle qui porte l'intercalaire, son nom et les
   sous-onglets) tient la couleur pleine en haut — sous le nom de la maison —
   puis s'éteint petit à petit vers un ton très clair au fil des sous-onglets.
   La carte suivante reprend ce ton clair et finit de blanchir sur son début :
   la teinte ne s'arrête jamais net, elle se referme en douceur. */
.card:has(> .crest) {
  background: var(--u-entete,
    linear-gradient(180deg, var(--u-marque) 0%, var(--u-marque) 42%, var(--u-clair) 100%));
  margin-bottom:0 !important; border-bottom:none !important;
  border-bottom-left-radius:0 !important; border-bottom-right-radius:0 !important; }
/* Un libelle pose sur la couleur pleine du bandeau : il prend l'encre qui
   porte sur la marque, pas le gris des textes courants. */
.surMarque { color: var(--u-surMarque); }
/* Sous-onglets posés sur l'en-tête : l'encre de l'univers, sauf quand
   l'en-tête finit dans une couleur foncée (TAAM) — ils passent alors en clair. */
.card:has(> .crest) .sections button { color: var(--u-entDoux, var(--u-doux)); }
.card:has(> .crest) .sections button.on { color: var(--u-entOn, var(--u-encre));
  border-bottom-color: var(--u-entOn, var(--u-encre)); }
.card:has(> .crest) + .card {
  background: linear-gradient(180deg, var(--u-clair) 0, #FFFFFF var(--u-fondu, 70px));
  margin-top:0 !important; border-top:none !important;
  border-top-left-radius:0 !important; border-top-right-radius:0 !important;
  box-shadow:none !important; }
`;

/* ------------------------------------------------------------------ */
/*  CONFIG PAR DÉFAUT                                                  */
/* ------------------------------------------------------------------ */

const DEFAULT_CONFIG = {
  /* Règle de métier en restauration : 25 % de matière, 30 % de variables
     hors salaires et hors loyer. Réglable affaire par affaire. */
  /* Naps prélève sa commission avant de virer : ce n'est pas le même
     taux selon l'origine de la carte. */
  /* Ta caisse ne distingue pas l'origine des cartes : on estime la part
     étrangère par activité, puis le relevé de fin de mois tranche. */
  /* Le contrat Naps : 3 % HT de commission, TVA 10 % dessus (3,3 % TTC).
     Sert à vérifier ce que Naps prélève vraiment, jamais à estimer. */
  naps: { tauxHT: 3, tva: 10 },
  /* Les poches où l'argent dort vraiment. Jusqu'ici l'appli savait ce qui
     rentrait et ce qui sortait, mais pas d'OÙ : elle annonçait un solde
     unique qu'Amal ne pouvait comparer ni à son tiroir ni à son relevé.
     Une poche par endroit réel : le tiroir de chaque comptoir, le compte
     qui reçoit les cartes, celui qui reçoit Airbnb. */
  /* Sabich et TMSK ne partagent que le compte bancaire et la borne Naps :
     chacune garde son tiroir et son fond de caisse. */
  poches: [
    { id: "cs", nom: "Caisse Sabich",     type: "caisse", affaires: ["sabich"], depart: 1500 },
    { id: "ct", nom: "Caisse TMSK",       type: "caisse", affaires: ["tmsk"],   depart: 1000 },
    { id: "cr", nom: "Caisse Riad",       type: "caisse", affaires: ["riad"],   depart: 0 },
    { id: "np", nom: "Naps en attente",    type: "transit", depart: 0 },
    { id: "bm", nom: "Banque Le Mi-Chui", type: "banque", depart: 0 },
    { id: "ba", nom: "Banque Airbnb",     type: "banque", depart: 0 },
  ],
  /* Une carte encaissée n'est pas encore de l'argent en banque : Naps garde
     l'argent un à trois jours. Sans cette étape, le relevé ne collerait jamais
     avec l'appli et chaque pointage afficherait un faux manque. Les cartes
     tombent donc dans « Naps en attente », et le virement les fait passer
     sur Le Mi-Chui le jour où il arrive vraiment. */
  pocheCartes: "np",
  banqueCartes: "bm",
  banqueAirbnb: "ba",
  seuils: {
    sabich: { matiere: 25, variable: 30 },
    tmsk:   { matiere: 25, variable: 30 },
    taam:   { matiere: 25, variable: 30 },
  },
  /* En dessous, une erreur de comptage normale. Au-dessus, ça se regarde. */
  seuilFondCaisse: { orange: 50, rouge: 100 },
  /* Les chantiers d'investissement, dans l'ordre où ils se financent */
  chantiers: [
    { id: "tmsk-coffee", nom: "Comptoir coffee shop TMSK", cible: 40000 },
    { id: "taam-ouvre",  nom: "Ouverture de Ta'âm",        cible: 100000 },
    { id: "appart",      nom: "Travaux de l'appartement",  cible: 300000 },
  ],
  /* Ce qui explique un mois : fermeture, travaux, arrivée de quelqu'un */
  notes: {},
  societes: [
    { id: "michui",  nom: "LE MI-CHUI SARL" },
    { id: "gourmet", nom: "Gourmet Souk" },
  ],
  affaires: {
    sabich:  { nom: "Sabich",   marque: "#005227", chip: "#1E7A45", tint: "#EAF3ED", matierePct: 30, type: "vente", societe: "michui", fonds: 1500 },
    tmsk:    { nom: "TMSK",     marque: "#5E3B26", chip: "#8A5A3C", tint: "#F3E7DA", bouton: "#F2E7D6", matierePct: 22, type: "vente", societe: "michui", fonds: 1000 },
    riad:    { nom: "Riad Itto", marque: "#B49A6F", chip: "#B49A6F", tint: "#F8F3EA", matierePct: 0,
               type: "hebergement", societe: "gourmet",
               hebergement: {
                 comAirbnb: 15.5, comDirect: 3,
                 extras: {
                   pdj:   { nom: "Petit-déjeuner", prix: 65,  matiere: 25, com: 10 },
                   dej:   { nom: "Déjeuner",       prix: 215, matiere: 50, com: 30 },
                   diner: { nom: "Dîner",          prix: 215, matiere: 50, com: 40 },
                 },
               } },
    taam:    { nom: "Ta'âm",    marque: "#315A46", chip: "#315A46", tint: "#F2E9D8", bouton: "#315A46", matierePct: 30, type: "vente", societe: "michui" },
    contenu: { nom: "Le Mi-Chui", marque: "#A7748C", chip: "#A7748C", tint: "#F7F0F8", matierePct: 0, type: "vente", societe: "michui" },
  },
  fixes: [
    { id: "f1",  lbl: "Loyer boutique médina",       montant: 8500,  affaire: "sabich"  , jour: 5 },
    { id: "f2",  lbl: "Eau / électricité Sabich",    montant: 1500,  affaire: "sabich"  , jour: 15, variable: true },
    { id: "f4",  lbl: "Simohamed — vendeur",         montant: 4000,  affaire: "sabich",  sal: true , jour: 30 },
    { id: "f5",  lbl: "Yassine — vendeur",           montant: 4000,  affaire: "sabich",  sal: true , jour: 30 },
    { id: "f6",  lbl: "Loyer Guéliz — Ta'âm et labo", montant: 14000, affaire: "taam",
      partagePct: 50, jour: 5 },
    /* Toute la paie est portée par Sabich, sauf Ibtissam qui est sur TMSK et la
       house manager qui reste sur le riad. Latifa, Bahija et Youssef étaient
       dans le pot « labo partagé » et leurs 13 500 DH se répartissaient sur
       trois activités, dont Ta'âm qui n'est pas ouvert : Amal ne savait plus
       qui payait quoi. Un salaire est désormais rangé là où la personne
       travaille, un point c'est tout. */
    { id: "f7",  lbl: "Latifa — cheffe",             montant: 6500,  affaire: "sabich",  sal: true , jour: 30 },
    { id: "f8",  lbl: "Bahija — commis",             montant: 4000,  affaire: "sabich",  sal: true , jour: 30 },
    { id: "f9",  lbl: "Youssef — plongeur",          montant: 3000,  affaire: "sabich",  sal: true , jour: 30 },
    { id: "f10", lbl: "Serveur",                     montant: 4000,  affaire: "sabich",  sal: true , jour: 30 },
    { id: "f11", lbl: "Loyer boutique TMSK",         montant: 14000, affaire: "tmsk"    , jour: 5 },
    { id: "f12", lbl: "Ibtissam — vendeuse",         montant: 4500,  affaire: "tmsk",    sal: true , jour: 30 },
    { id: "f13", lbl: "Traites riad (conso + immo)", montant: 10300, affaire: "riad"    , jour: 5 },
    { id: "f14", lbl: "House manager",               montant: 3000,  affaire: "riad",    sal: true , jour: 30 },
    { id: "f15", lbl: "Eau / électricité riad",      montant: 1500,  affaire: "riad"    , jour: 15, variable: true },
    { id: "f16", lbl: "Internet riad",               montant: 300,   affaire: "riad"    , jour: 15 },
  ],
  fournisseurs: [
    { id: "p14", nom: "Coursier",             affaires: ["sabich"],         rythme: "mois" },
    { id: "p1",  nom: "Boucher",              affaires: ["sabich", "taam"], rythme: "mois" },
    { id: "p2",  nom: "Poulet",               affaires: ["sabich", "taam"], rythme: "mois" },
    { id: "p3",  nom: "Pain",                 affaires: ["sabich", "taam"], rythme: "semaine" },
    { id: "p13", nom: "Légumes",              affaires: ["sabich", "taam"], rythme: "semaine" },
    { id: "p4",  nom: "Épicerie pro",         affaires: ["sabich", "taam"], rythme: "quinzaine" },
    { id: "p5",  nom: "Épicerie non pro",     affaires: ["sabich", "taam"], rythme: "besoin" },
    { id: "p6",  nom: "Packaging",            affaires: ["sabich", "taam"], rythme: "besoin" },
    { id: "p7",  nom: "SANAD — épices",       affaires: ["tmsk"],           rythme: "besoin" },
    { id: "p8",  nom: "Imprimeur — étiquettes", affaires: ["tmsk"],         rythme: "besoin" },
    { id: "p9",  nom: "Packaging TMSK",       affaires: ["tmsk"],           rythme: "besoin" },
    { id: "p10", nom: "Blanchisserie",        affaires: ["riad"],           rythme: "mois" },
    { id: "p11", nom: "Courses house manager", affaires: ["riad"],          rythme: "besoin" },
    { id: "p12", nom: "Produits d'accueil",   affaires: ["riad"],           rythme: "besoin" },
  ],
  cle: { sabich: 50, tmsk: 10, taam: 40 },
  /* Les honoraires de comptable ne sont plus comptés : les factures n'arrivent
     pas chaque mois et brouillaient le résultat. À rétablir sur demande. */
  structures: [],
  cnss: {
    michui:  { actif: false, montant: 9930 },
    gourmet: { actif: false, montant: 0 },
  },
  jourEnveloppe: 30,
  /* Ce qui sort du résultat vers la famille : ni charge d'exploitation,
     ni dépense du ménage. Une destination à part entière. */
  solidarite: { montant: 10000, jour: 20 },
  foyer: {
    fixes: [
      { id: "h1", lbl: "Traite nouvel appartement", montant: 8500, jour: 5,  transitoire: false },
      { id: "h2", lbl: "Loyer appartement actuel",  montant: 8300, jour: 1,  transitoire: true },
      { id: "h4", lbl: "Femme de ménage",           montant: 2000, jour: 30 },
      { id: "h5", lbl: "Téléphone",                 montant: 1000, jour: 10, variable: true },
      { id: "h6", lbl: "Carburant",                 montant: 1000, jour: 15, variable: true },
      { id: "h7", lbl: "Eau / électricité",         montant: 600,  jour: 15, variable: true },
    ],
    remunerations: [
      { id: "r1", nom: "Salaire Amal", montant: 5000, jour: 30 },
      { id: "r2", nom: "Salaire SAIB", montant: 5000, jour: 30 },
    ],
    finDoubleLogement: "",
  },
};

/* ------------------------------------------------------------------ */
/*  OUTILS                                                             */
/* ------------------------------------------------------------------ */

const RYTHMES = { mois: "au mois", semaine: "à la semaine", quinzaine: "2×/mois", besoin: "au besoin" };

/* Le blanc doit rester lisible sur n'importe quelle couleur de marque :
   on assombrit juste ce qu'il faut, la teinte reste reconnaissable. */
const lum = (r, g, b) => {
  const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
};
const hexRgb = (h) => {
  const s = String(h).replace("#", "");
  const c = s.length === 3 ? s.split("").map((x) => x + x).join("") : s;
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
};
const rgbHex = (r, g, b) => "#" + [r, g, b]
  .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");

const contraste = (a, b) => {
  const la = lum(...hexRgb(a)), lb = lum(...hexRgb(b));
  return (Math.max(la, lb) + .05) / (Math.min(la, lb) + .05);
};

const lisible = (couleur, ratio = 3.6) => {
  let [r, g, b] = hexRgb(couleur);
  for (let i = 0; i < 24; i++) {
    if (1.05 / (lum(r, g, b) + .05) >= ratio) break;
    r *= .92; g *= .92; b *= .92;
  }
  return rgbHex(r, g, b);
};

/* Mélanger deux couleurs : t = 0 donne la première, t = 1 la seconde */
const melange = (a, b, t) => {
  const [r1, g1, b1] = hexRgb(a), [r2, g2, b2] = hexRgb(b);
  return rgbHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
};

/* Une couleur qu'on peut voir au travers */
const voile = (hex, a) => {
  const [r, g, b] = hexRgb(hex);
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
};

/* Chaque intercalaire repeint la page à ses couleurs. Une seule teinte suffit
   à en déduire les six : c'est ce qui garantit qu'aucun univers ne bave sur
   un autre, et qu'on voit d'un coup d'œil sur quel commerce on saisit.
   Le vert n'appartient donc qu'à Sabich, et nulle part ailleurs. */
const SOUCHE = { dash: "#A0B6A9", foyer: "#E0A479", reglages: "#8F8478",
                 /* TMSK vit en noir et ivoire : ses libellés aussi. */
                 tmsk: "#1C1A17" };
/* Boutons de saisie propres à une maison : TMSK noir, lettrage ivoire. */
const BOUTON = { tmsk: { fond: "#1C1A17", texte: "#F2E9D8" } };

const baseUnivers = (vue, config) => SOUCHE[vue]
  || (config.affaires[vue] ? config.affaires[vue].marque : null);

/* La feuille de chaque intercalaire (l'onglet ouvert et tout ce qui pend
   dessous) porte le dégradé dessiné par Amal sur toute sa hauteur. Le fond
   de l'application, lui, reste le même ivoire partout. TAAM (fichier « BACK
   TAAM LIFE ») : ivoire plein jusqu'au tiers, bascule linéaire, vert plein
   à partir des deux tiers. L'en-tête est transparent : le logo vert se pose
   sur l'ivoire de la feuille. Les cartes restent blanches dessus. */
/* Ses fichiers « BACK » (dossier TREE) : un dégradé linéaire de la couleur
   de la maison, en haut, jusqu'au blanc en bas. TMSK se lit à l'envers
   (blanc en haut, grège en bas) — c'est son fichier. */
const lineaire = (haut, bas) => "linear-gradient(180deg, " + haut + " 0%, " + bas + " 100%)";
const FEUILLE = {
  taam:     { haut: "#F2E9D8",
              fond: "linear-gradient(180deg, #F2E9D8 0%, #F2E9D8 33%, #315A46 67%, #315A46 100%)" },
  dash:     { haut: "#94D4DD", fond: lineaire("#94D4DD", "#FEFFFF") },
  sabich:   { haut: "#015227", fond: lineaire("#015227", "#FCFDFD") },
  riad:     { haut: "#B49A70", fond: lineaire("#B49A70", "#FEFEFD") },
  tmsk:     { haut: "#FFFFFF", fond: lineaire("#FFFFFF", "#A69E89") },
  contenu:  { haut: "#A7748C", fond: lineaire("#A7748C", "#FEFDFE") },
  foyer:    { haut: "#F1B597", fond: lineaire("#F1B597", "#FEFBF9") },
  reglages: { haut: "#7B797A", fond: lineaire("#7B797A", "#FEFEFE") },
};
/* Sur une feuille, l'en-tête n'a plus de couleur à lui : il laisse voir la
   feuille. Ce qui s'y écrit prend du blanc si le haut de la feuille est
   foncé, l'encre de la maison sinon. La carte suivante part blanche. */
const DEGRADE = Object.fromEntries(Object.entries(FEUILLE).map(([k, f]) => {
  const fonce = contraste(f.haut, "#FFFFFF") >= 2.4;
  return [k, { clair: "#FFFFFF", fondu: "0px", entete: "transparent",
               surMarque: fonce ? "rgba(255,255,255,.92)" : null,
               on: fonce ? "#FFFFFF" : null,
               doux: fonce ? "rgba(255,255,255,.78)" : null }];
}));
/* Les Paramètres n'ont pas de sous-onglets : leur liste vit dans la carte
   d'en-tête. Seule la bande du logo y laisse voir la feuille, le reste est
   une carte blanche comme les autres. */
DEGRADE.reglages.entete = "linear-gradient(180deg, rgba(255,255,255,0) 0, rgba(255,255,255,0) 273px, #FFFFFF 273px)";

function univers(vue, config) {
  const base = baseUnivers(vue, config);
  if (!base) return {};
  /* La même couleur que la languette et son bandeau (voir onglets()/Crest) —
     parfois assombrie pour porter du blanc — pour que le haut de la carte
     d'en-tête et l'intercalaire soient rigoureusement la même matière,
     sans raccord visible entre les deux. */
  const habitVue = HABIT_VUE[vue] || (config.affaires[vue] ? habit(vue, config.affaires[vue]) : null);
  const marque = habitVue ? habitVue.fond : base;
  /* La couleur pleine de la languette quand c'en est une ; null pour une aquarelle. */
  const marqueHex = String(marque).charAt(0) === "#" ? marque : null;
  /* L'encre part de la marque assombrie jusqu'à porter sur blanc — sans quoi
     un jaune ou un beige donnerait des libellés illisibles. Les teintes
     claires, elles, partent de la marque telle quelle : mélangée à de l'encre
     grisée, une couleur perd le peu de chair qui la rendait reconnaissable. */
  const enc = lisible(base, 7.5);
  return {
    "--u-encre":   enc,
    "--u-titre":   melange(enc, "#FFFFFF", .04),
    /* Le gris des explications etait mele a 44 % de blanc : 2,9 pour 1 sur le
       creme, sous le seuil de lecture. On garde sa teinte, puis on l'assombrit
       juste assez pour tenir 4,5 pour 1 sur le fond de l'appli. */
    "--u-doux":    lisible(melange(enc, "#FFFFFF", .44), 4.9),
    "--u-bord":    melange(base, "#FFFFFF", .76),
    "--u-filet":   melange(base, "#FFFFFF", .94),
    /* La couleur pleine de la languette, et le ton très clair où elle
       s'éteint au fil des sous-onglets — voir .card:has(> .crest). */
    "--u-marque":  marque,
    /* Une marque est presque toujours une couleur — le Mi-Chui, lui, porte une
       aquarelle, donc un degrade. Un degrade ne peut pas servir d'etape a
       l'interieur d'un autre degrade : la carte d'en-tete se retrouvait sans
       fond. On compose donc le fond complet ici, et le voile blanc passe en
       couche par-dessus quand la marque est une aquarelle. */
    "--u-clair":   DEGRADE[vue] ? DEGRADE[vue].clair : melange(marqueHex || base, "#FFFFFF", .90),
    "--u-entete":  DEGRADE[vue] ? DEGRADE[vue].entete : marqueHex
      ? "linear-gradient(180deg, " + marqueHex + " 0%, " + marqueHex + " 42%, "
        + melange(marqueHex, "#FFFFFF", .90) + " 100%)"
      : "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 42%, "
        + melange(base, "#FFFFFF", .90) + " 100%), " + marque,
    /* Ce qui est ecrit sur la couleur pleine du bandeau ne peut pas prendre
       le gris des textes courants, calcule pour un fond clair : blanc sur
       une marque foncee, l'encre de l'univers sur une marque claire. */
    "--u-fondu":   DEGRADE[vue] ? DEGRADE[vue].fondu : null,
    "--u-entDoux": DEGRADE[vue] ? DEGRADE[vue].doux : null,
    "--u-entOn":   DEGRADE[vue] ? DEGRADE[vue].on : null,
    "--u-surMarque": (DEGRADE[vue] && DEGRADE[vue].surMarque) ? DEGRADE[vue].surMarque : (!marqueHex || contraste(marqueHex, "#FFFFFF") >= 3.2)
                       ? "rgba(255,255,255,.88)" : enc,
    /* La feuille garde la teinte de sa languette, mais la laisse traverser :
       le fond de l'application reste visible d'un bout à l'autre. */
    /* Entre les cartes, rien : le fond de l'application court d'un bord à
       l'autre sans qu'aucun panneau vienne le remplacer par un autre. */
    "--u-feuille": FEUILLE[vue] ? FEUILLE[vue].fond : "transparent",
    "--u-feuillePad": FEUILLE[vue] ? "0 14px 14px" : "0",
  };
}

/* Un intercalaire par affaire, tous au même gabarit :
   fond plein à la couleur de la marque, contenu en blanc. */
const LOGO_BLANC = { sabich: "sabichBlanc", tmsk: "tmskBlanc",
                     riad: "riadBlanc", contenu: "contenuBlanc",
                     foyer: "foyerBlanc", dash: "pictoDash",
                     reglages: "pictoReglages", taam: "taamVert" };

/* L'habit d'un intercalaire : le fond de la languette et l'encre qui doit s'y
   lire. Toutes les maisons portent leur logo en blanc. Une seule exception,
   voulue : TMSK se lit à l'envers, encre pleine sur ivoire — c'est sa marque,
   pas un accident de contraste. Les logos sont fournis en blanc :
   brightness(0) les repasse à l'encre sans rien redessiner. */
const HABIT = {
  /* Chaque languette prend le haut exact de sa feuille (fichiers TREE). */
  tmsk: { fond: "#FFFFFF", sombre: true, opa: 1, texte: "#2E2822", clair: true },
  riad: { fond: "#B49A70" },
  contenu: { fond: "#A7748C" },
  /* Ta'am : son jaune exact, releve sur son logo officiel (#F1C40D sur le
     nacre #FDFAF3). La regle generale l'assombrissait jusqu'a #9F8109 pour
     qu'un blanc tienne dessus — mais c'est precisement ce que fait sa marque,
     blanc sur jaune plein. On garde donc sa couleur telle qu'elle l'a dessinee. */
  /* Octobre 2026 : nouvelle identité. L'intercalaire se lit à l'envers, comme
     TMSK : logo vert #315A46 sur ivoire #F2E9D8 — en aplat vert il se
     confondait avec Sabich. Le vert vient ensuite, dans l'en-tête. */
  taam: { fond: "#F2E9D8", clair: true, garde: true },
};

const habit = (k, c) => HABIT[k]
  || (c && c.aquarelle ? { fond: AQUARELLE_FONCE } : null)
  || { fond: lisible(c.marque) };

/* Passer un logo blanc à l'encre sombre, sans toucher au fichier */
const encre = (h) => h && h.sombre
  ? { filter: "brightness(0)", opacity: h.opa === undefined ? .82 : h.opa }
  : {};

/* Le dégradé du Mi-Chui, assombri juste assez pour porter du blanc */
const AQUARELLE_FONCE = AQUARELLE.replace(/#[0-9A-Fa-f]{6}/g, (c) => lisible(c, 3.4));
/* Chaque logo est recadré sur son dessin : ces tailles s'appliquent donc à
   l'encre elle-même, pas à un cadre. Elles ne sont pas choisies à l'œil mais
   calculées : à surface d'encre égale, corrigée de moitié pour que les
   dessins au trait (le riad, la clé) ne prennent pas toute la place face aux
   aplats pleins (la maison). Les sept marques pèsent alors pareil. */
const TAILLE_BLANC = {
  sabich:   { width: 76, height: 19 },
  tmsk:     { width: 66, height: 27 },
  riad:     { width: 64, height: 43 },
  contenu:  { width: 49, height: 40 },
  foyer:    { width: 38, height: 34 },
  dash:     { width: 38, height: 38 },
  reglages: { width: 40, height: 44 },
  taam:     { width: 66, height: 24 },
};

/* Les trois intercalaires qui ne sont pas un commerce se reconnaissent à leur
   couleur avant même d'être lus : le tableau de bord en safran, qui réveille ;
   les réglages en gris chaud, neutre, hors du monde des marques ; la maison en
   pot-pourri. Tous portent la même encre blanche que les commerces — une seule
   règle dans toute l'app, aucun logo noir. */
const HABIT_DASH     = { fond: "#94D4DD" };
const HABIT_FOYER    = { fond: "#F1B597" };
/* Le gris etait trop sombre pour que le degrade s'eteigne : il tenait toute
   la hauteur du panneau et avalait le texte pose dessus. Un gris perle clair
   rend sa course au degrade — le picto passe a l'encre, comme TMSK. */
const HABIT_REGLAGES = { fond: "#7B797A" };

/* L'ordre des intercalaires suit l'histoire d'Amal : ses affaires dans
   l'ordre où elle les a créées, la maison après, les paramètres au bout. */
const ORDRE_ONGLETS = ["sabich", "tmsk", "riad", "taam", "contenu"];
const rangOnglet = (k) => { const i = ORDRE_ONGLETS.indexOf(k); return i < 0 ? 99 : i; };

function onglets(config) {
  return [
    { id: "dash", nom: "Tableau de bord", ...HABIT_DASH,
      logo: LOGOS.pictoDash, taille: TAILLE_BLANC.dash },
    ...vivantes(config).sort(([a], [b]) => rangOnglet(a) - rangOnglet(b)).map(([k, c]) => {
      const cle = LOGO_BLANC[k];
      /* Un aplat pour chacune, sans exception : le dégradé reste sur la fiche */
      return { id: k, nom: c.nom, ...habit(k, c),
               logo: cle ? LOGOS[cle] : null,
               taille: TAILLE_BLANC[k] };
    }),
    { id: "foyer", nom: "La maison", ...HABIT_FOYER,
      logo: LOGOS.foyerBlanc, taille: TAILLE_BLANC.foyer },
    { id: "reglages", nom: "Paramètres", ...HABIT_REGLAGES,
      logo: LOGOS.pictoReglages, taille: TAILLE_BLANC.reglages },
  ];
}

const MOIS = ["janvier","février","mars","avril","mai","juin","juillet","août",
              "septembre","octobre","novembre","décembre"];

const fmt = (n) => Math.round(n || 0).toLocaleString("fr-FR") + " DH";
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);
const thisMonth = () => new Date().toISOString().slice(0, 7);
const monthLabel = (ym) => {
  const [y, m] = ym.split("-");
  return MOIS[parseInt(m, 10) - 1] + " " + y;
};
const shiftMonth = (ym, d) => {
  const [y, m] = ym.split("-").map(Number);
  const dt = new Date(y, m - 1 + d, 1);
  return dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0");
};
/* Lire un montant tel qu'un humain l'écrit. L'ancienne version faisait
   parseFloat(String(v).replace(",", ".")) : elle ne remplaçait que la PREMIÈRE
   virgule et ne retirait aucune espace, et parseFloat s'arrête au premier
   caractère non numérique. « 2 395,29 » recopié d'une facture devenait donc 2,
   « 12 000 » devenait 12 — et l'app affichait quand même sa confirmation verte.
   Ici on nettoie d'abord, on décide ensuite qui est le séparateur décimal :
   c'est toujours le dernier des deux signes, l'autre marque les milliers. */
const normaliseMontant = (v) => {
  let t = String(v ?? "")
    .replace(/[\s\u00A0\u202F]/g, "")   /* espaces, insécables, fines */
    .replace(/[^\d,.-]/g, "");           /* « DH », lettres, symboles */
  const vg = t.lastIndexOf(","), pt = t.lastIndexOf(".");
  if (vg >= 0 && pt >= 0) {
    t = vg > pt ? t.replace(/\./g, "").replace(",", ".") : t.replace(/,/g, "");
  } else if (vg >= 0) {
    /* Une virgule seule : décimale (« 12,5 »), sauf si elle sépare des
       milliers (« 1,500 » — en dirham c'est mille cinq cents, pas 1,5). */
    t = t.replace(/,(?=\d{3}(\D|$))/g, "").replace(",", ".");
  } else {
    t = t.replace(/\.(?=\d{3}(\D|$))/g, "");
  }
  return t;
};
const num = (v) => { const n = parseFloat(normaliseMontant(v)); return isNaN(n) ? 0 : n; };
/* Vide est acceptable (le champ n'est pas encore rempli) ; « abc » ne l'est pas. */
const montantLisible = (v) => String(v ?? "").trim() === ""
                           || !isNaN(parseFloat(normaliseMontant(v)));
const teinte = (a) => a.aquarelle ? AQUARELLE : a.chip;

/* Un bouton qui ne fait rien est le pire des messages : il laisse croire à une
   panne, et on ressaisit. Partout où une saisie peut être refusée, elle est
   désormais refusée à voix haute, en nommant ce qui manque. */
/* Qui saisit. Amal et SAIB ont chacun leur compte : chaque écriture porte
   désormais le nom de celui qui l'a créée, et celui qui l'a corrigée. Rien
   n'est bloqué — ils voient et corrigent tout — mais plus rien n'est anonyme.
   Une erreur a un nom, on la demande au lieu de la chercher. */
const MEMBRES = {
  "elmadadeamal@gmail.com": "Amal",
  "khodeir.saib@gmail.com": "SAIB",
};
/* ------------------------------------------------------------------ */
/*  LES POCHES — où l'argent se trouve vraiment                        */
/* ------------------------------------------------------------------ */
/* Amal : « quand je dis que j'ai payé un truc, je suis censée dire d'où
   j'ai pris l'argent ». Exactement. Sans ça, l'appli donne un solde global
   qu'elle ne peut vérifier contre rien. Presque tout s'aiguille tout seul :
   une recette du jour porte déjà sa part espèces et sa part carte, un séjour
   porte déjà sa source. Il ne reste à dire que pour ce qui sort. */
const lesPoches = (config) => (config && config.poches) || [];
const pocheParId = (config, id) => lesPoches(config).find((p) => p.id === id) || null;
const nomPoche = (config, id) => (pocheParId(config, id) || {}).nom || "";
/* Une caisse peut servir plusieurs activités : le comptoir de la médina tient
   Sabich et TMSK dans le même tiroir. */
const caisseDe = (config, affaire) => {
  const p = lesPoches(config).find((x) => x.type === "caisse"
    && ((x.affaires || []).includes(affaire) || x.affaire === affaire));
  if (p) return p.id;
  const q = lesPoches(config).find((x) => x.type === "caisse");
  return q ? q.id : null;
};
const banqueCartes = (config) => (config && config.banqueCartes)
  || ((lesPoches(config).find((x) => x.type === "banque") || {}).id) || null;
const banqueAirbnb = (config) => (config && config.banqueAirbnb) || banqueCartes(config);
/* Où atterrit une carte encaissée : chez Naps, pas encore à la banque. */
const pocheCartes = (config) => (config && config.pocheCartes) || banqueCartes(config);
/* D'où sort l'argent quand on paie, si Amal n'a rien précisé : le tiroir du
   comptoir concerné pour ce qui s'achète sur place, la banque pour le reste. */
const pocheSortieParDefaut = (config, e) => {
  if (!e) return banqueCartes(config);
  if (e.affaire && caisseDe(config, e.affaire)) return caisseDe(config, e.affaire);
  return banqueCartes(config);
};

const nomMembre = (config, email) => {
  if (!email) return "";
  const e = String(email).trim().toLowerCase();
  const perso = (config && config.membres) || {};
  if (perso[e]) return perso[e];
  if (MEMBRES[e]) return MEMBRES[e];
  const base = e.split("@")[0].replace(/[._-]+/g, " ").trim();
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : "";
};

/* La signature affichée sous une écriture : qui l'a saisie, et qui l'a
   corrigée si ce n'est pas la même personne. */
const signature = (e) => {
  if (!e || !e.par) return "";
  if (e.majPar && e.majPar !== e.par) return e.par + ", corrigé par " + e.majPar;
  return e.par;
};

/* ------------------------------------------------------------------ *
 *  TRACE DES RÉGLAGES                                                  *
 * ------------------------------------------------------------------ *
 *  Les Réglages ne sont pas verrouillés : SAIB doit tout voir et tout
 *  pouvoir corriger pour apprendre à lire le business. Mais un salaire
 *  ou une clé de répartition changée là fausse TOUT, partout, en
 *  silence. On ne bloque pas : on garde un témoin.
 *  Ici on prend une photo des chiffres qui comptent ; deux photos
 *  comparées donnent la liste de ce qui a bougé.                        */
const photoReglages = (c) => {
  const p = {};
  if (!c) return p;
  const mt = (v) => String(num(v));
  (c.fixes || []).forEach((f) =>
    { p["Charge · " + f.lbl] = mt(f.montant); });
  (c.structures || []).forEach((f) =>
    { p["Structure · " + f.lbl] = mt(f.montant); });
  ((c.foyer || {}).fixes || []).forEach((f) =>
    { p["Maison · " + f.lbl] = mt(f.montant); });
  ((c.foyer || {}).remunerations || []).forEach((r) =>
    { p["Rémunération · " + r.nom] = mt(r.montant); });
  Object.entries(c.cle || {}).forEach(([k, v]) =>
    { p["Clé de répartition · " + k] = mt(v) + " %"; });
  Object.entries(c.cnss || {}).forEach(([k, v]) =>
    { p["CNSS · " + k] = (v && v.actif ? mt(v.montant) : "désactivée"); });
  Object.entries(c.affaires || {}).forEach(([k, a]) => {
    p["Activité · " + k + " · nom"] = a.nom || "";
    p["Activité · " + k + " · % matière"] = mt(a.matierePct) + " %";
    const H = a.hebergement;
    if (H) {
      p["Activité · " + k + " · commission Airbnb"] = mt(H.comAirbnb) + " %";
      p["Activité · " + k + " · commission directe"] = mt(H.comDirect) + " %";
      Object.entries(H.extras || {}).forEach(([id, x]) => {
        p["Activité · " + k + " · " + (x.nom || id) + " · prix"] = mt(x.prix);
        p["Activité · " + k + " · " + (x.nom || id) + " · matière"] = mt(x.matiere);
      });
    }
  });
  p["Solidarité · montant"] = mt((c.solidarite || {}).montant);
  p["Commission Naps (contrat, HT)"] = mt((c.naps || {}).tauxHT) + " %";
  return p;
};

/* Ce qui a bougé entre deux photos, en clair. */
const diffReglages = (avant, apres) => {
  const a = photoReglages(avant), b = photoReglages(apres);
  const lignes = [];
  Object.keys(b).forEach((k) => {
    if (!(k in a)) lignes.push({ quoi: k, avant: null, apres: b[k] });
    else if (a[k] !== b[k]) lignes.push({ quoi: k, avant: a[k], apres: b[k] });
  });
  Object.keys(a).forEach((k) => {
    if (!(k in b)) lignes.push({ quoi: k, avant: a[k], apres: null });
  });
  return lignes;
};

const MSG_MONTANT = "Montant manquant — écris le montant en chiffres avant d'enregistrer.";

/* Une date mal tapée — 2027 au lieu de 2026 — sort l'écriture de tous les
   totaux sans un mot. On ne l'interdit pas, saisir une pièce d'un autre mois
   est légitime : on la signale. */
function HorsMois({ date, defDate }) {
  if (!date || !defDate || date.slice(0, 7) === defDate.slice(0, 7)) return null;
  return (
    <div style={{ background: "#FDF3E0", color: "#8A5B10", borderRadius: 10,
                  padding: "10px 12px", marginBottom: 12, fontSize: 15.5 }}>
      Cette date n'est pas dans le mois affiché — l'écriture ira sur
      {" " + monthLabel(date.slice(0, 7))}. Vérifie qu'elle est juste.
    </div>
  );
}

function Alerte({ children }) {
  if (!children) return null;
  return (
    <div style={{ background: "#FDECEC", color: "#A4262C", borderRadius: 10,
                  padding: "10px 12px", marginBottom: 12, fontSize: 15.5 }}>{children}</div>
  );
}

/* Une activité peut être une vente au comptoir ou un hébergement.
   Archivée, elle sort des menus mais reste dans l'historique. */
const vivantes   = (config) => Object.entries(config.affaires).filter(([, a]) => !a.archive);
const vendeuses  = (config) => vivantes(config).filter(([, a]) => a.type !== "hebergement");
const hebergeurs = (config) => vivantes(config).filter(([, a]) => a.type === "hebergement");
/* La société qui emploie : celle du salarié, sinon celle de son activité */
const socDefaut = (config) => ((config.societes || [])[0] || {}).id || "michui";
const socDe = (config, x) => x.societe
  || (x.affaire && config.affaires[x.affaire] && config.affaires[x.affaire].societe)
  || socDefaut(config);

const HEB = (config, k) => (config.affaires[k] && config.affaires[k].hebergement) || null;

const slug = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "").slice(0, 14) || ("a" + Math.random().toString(36).slice(2, 6));

/* Teintes proposées à la création : claires, lumineuses, sans noir */
const TEINTES = [
  { nom: "Vert",     marque: "#2F5D3A", chip: "#4C8355", tint: "#EBF2EC" },
  { nom: "Terre",    marque: "#A65B2E", chip: "#C87A45", tint: "#FBF0E8" },
  { nom: "Rouge",    marque: "#9A2F2F", chip: "#C4544B", tint: "#FBECEA" },
  { nom: "Bleu",     marque: "#2E5A73", chip: "#5389A5", tint: "#EBF2F6" },
  { nom: "Sable",    marque: "#8A7440", chip: "#B49A6F", tint: "#F8F3EA" },
  { nom: "Prune",    marque: "#6E4A78", chip: "#A183AC", tint: "#F4EFF6" },
  { nom: "Rose",     marque: "#A6537A", chip: "#CE8AA8", tint: "#FBEEF3" },
  { nom: "Ardoise",  marque: "#4A5540", chip: "#8A9578", tint: "#F1F3EC" },
];

/* Les treize mois relevés de Sabich, repris de l'historique réel.
   Répartition 80 % espèces / 20 % carte, conforme aux encaissements observés. */
const HISTORIQUE_SABICH = [
  ["2025-05", 144842], ["2025-06", 69916],  ["2025-07", 36810],
  ["2025-09", 92065],  ["2025-10", 169957], ["2025-11", 206310],
  ["2025-12", 210627], ["2026-01", 227617], ["2026-02", 280715],
  ["2026-03", 269280], ["2026-04", 332487], ["2026-05", 301172],
  ["2026-06", 132342],
].map(([m, ca]) => ({
  id: "h-" + m, seed: true, type: "vente", date: m + "-15", affaire: "sabich",
  montant: ca, espece: Math.round(ca * 0.8), carte: Math.round(ca * 0.2),
}));

/* ------------------------------------------------------------------ */
/*  TÂCHES                                                             */
/* ------------------------------------------------------------------ */

const PRIORITES = [
  { id: "haute",   nom: "Urgent",  couleur: "#C9503A" },
  { id: "normale", nom: "Normal",  couleur: "#C98A1E" },
  { id: "basse",   nom: "Quand tu peux", couleur: "#8B9678" },
];
const ETATS = [
  { id: "afaire",  nom: "À faire" },
  { id: "encours", nom: "En cours" },
  { id: "fait",    nom: "Fait" },
];
const REPETITIONS = [
  { id: "", nom: "Une seule fois" },
  { id: "semaine", nom: "Chaque semaine", jours: 7 },
  { id: "quinzaine", nom: "Tous les 15 jours", jours: 14 },
  { id: "mois", nom: "Chaque mois", jours: 30 },
];

const aujourdhui = () => new Date().toISOString().slice(0, 10);

/* Quand on choisit le début d'une tâche, l'échéance suit d'un jour — le
   couple avance ensemble tant qu'on ne retouche pas l'échéance à la main. */
const lendemain = (date) => {
  const d = new Date((date || aujourdhui()) + "T12:00:00");
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

const joursAvant = (date) => {
  if (!date) return null;
  const a = new Date(date + "T12:00:00"), b = new Date(aujourdhui() + "T12:00:00");
  return Math.round((a - b) / 86400000);
};

const prochaine = (date, repete) => {
  const r = REPETITIONS.find((x) => x.id === repete);
  if (!r || !r.jours) return date;
  const d = new Date((date || aujourdhui()) + "T12:00:00");
  /* On avance jusqu'à dépasser aujourd'hui : une tâche oubliée trois semaines
     ne doit pas ressusciter trois fois de suite. */
  do { d.setDate(d.getDate() + r.jours); } while (joursAvant(d.toISOString().slice(0, 10)) < 0);
  return d.toISOString().slice(0, 10);
};

/* Une tâche qui repart pour un tour garde la même durée : son début avance
   du même nombre de jours que son échéance. */
const decaler = (t, nouvelleEcheance) => {
  if (!t.debut) return {};
  const delta = Math.round((new Date(nouvelleEcheance + "T12:00:00")
                           - new Date(t.echeance + "T12:00:00")) / 86400000);
  const d = new Date(t.debut + "T12:00:00");
  d.setDate(d.getDate() + delta);
  return { debut: d.toISOString().slice(0, 10) };
};

/* Au chargement, on remet à faire les tâches récurrentes dont l'heure est revenue */
const reveiller = (liste) => liste.map((t) => {
  if (t.repete && t.etat === "fait" && joursAvant(t.echeance) <= 0) {
    const echeance = prochaine(t.echeance, t.repete);
    return { ...t, etat: "afaire", echeance, ...decaler(t, echeance) };
  }
  return t;
});

const joliDate = (date) => date ? date.slice(8, 10) + "/" + date.slice(5, 7) : "";

const echeanceTexte = (date) => {
  const j = joursAvant(date);
  if (j === null) return "sans échéance";
  if (j < -1) return "en retard de " + (-j) + " jours";
  if (j === -1) return "en retard d'un jour";
  if (j === 0) return "aujourd'hui";
  if (j === 1) return "demain";
  if (j <= 7) return "dans " + j + " jours";
  return "le " + date.slice(8, 10) + "/" + date.slice(5, 7);
};

const urgence = (t) => {
  if (t.etat === "fait") return "faite";
  const j = joursAvant(t.echeance);
  if (j === null) return "sansdate";
  if (j < 0) return "retard";
  if (j <= 2) return "imminent";
  if (j <= 7) return "bientot";
  return "plustard";
};

const RANG = { retard: 0, imminent: 1, bientot: 2, sansdate: 3, plustard: 4, faite: 5 };
const RANG_P = { haute: 0, normale: 1, basse: 2 };
const trierTaches = (l) => [...l].sort((a, b) =>
  (RANG[urgence(a)] - RANG[urgence(b)])
  || (RANG_P[a.priorite || "normale"] - RANG_P[b.priorite || "normale"])
  || String(a.echeance || "9").localeCompare(String(b.echeance || "9")));

/* Qui peut recevoir une tâche : toi, ton mari, et tes salariés déclarés */
const responsables = (config) => {
  const gens = [{ id: "moi", nom: "Amal" }, { id: "mari", nom: "Saib" }];
  config.fixes.filter((f) => f.sal).forEach((f) => {
    const nom = (f.lbl || "").replace(/^Salaire\s+/i, "").trim();
    if (nom && !gens.some((g) => g.nom.toLowerCase() === nom.toLowerCase()))
      gens.push({ id: f.id, nom });
  });
  (config.responsablesExtra || []).forEach((nom) => {
    if (!gens.some((g) => g.nom.toLowerCase() === nom.toLowerCase()))
      gens.push({ id: "x" + slug(nom), nom });
  });
  return gens;
};

/* ------------------------------------------------------------------ */
/*  REPRISE DE LA CONFIGURATION ENREGISTRÉE                            */
/* ------------------------------------------------------------------ */

/* Ce que tu as réglé fait foi. On ne complète que ce qui manque —
   une activité que tu as supprimée ne doit jamais réapparaître. */
function reprendre(saved) {
  const c = { ...DEFAULT_CONFIG, ...saved };

  c.affaires = (saved.affaires && Object.keys(saved.affaires).length)
    ? { ...saved.affaires } : { ...DEFAULT_CONFIG.affaires };

  Object.keys(c.affaires).forEach((k) => {
    const d = DEFAULT_CONFIG.affaires[k] || {};
    const a = { ...d, ...c.affaires[k] };
    if (!a.type) a.type = "vente";
    if (a.type === "hebergement" && !a.hebergement) {
      a.hebergement = (DEFAULT_CONFIG.affaires[k] && DEFAULT_CONFIG.affaires[k].hebergement)
        || { comAirbnb: 15.5, comDirect: 3, extras: {} };
    }
    c.affaires[k] = a;
  });

  /* Le rouge quitte TMSK : il est réservé au coffee shop qui vient. Le taupe
     qui l'a remplacé se confondait avec l'ivoire du fond : la marque passe à
     une cannelle plus chaude, y compris dans une config déjà en place. */
  if (c.affaires.tmsk && ["#950808", "#2B2723", "#5C5043"]
        .includes(String(c.affaires.tmsk.marque).toUpperCase())) {
    c.affaires.tmsk = { ...c.affaires.tmsk,
                        marque: "#5E3B26", chip: "#8A5A3C", tint: "#F3E7DA",
                        bouton: "#F2E7D6" };
  }

  /* TAAM quitte le jaune pour son vert, y compris dans une config déjà en place. */
  if (c.affaires.taam && (["#F1C40D", "#F3CB2A"]
        .includes(String(c.affaires.taam.marque).toUpperCase()) || c.affaires.taam.bouton !== "#315A46")) {
    c.affaires.taam = { ...c.affaires.taam, marque: "#315A46", chip: "#315A46", tint: "#F2E9D8",
                        bouton: "#315A46" };
  }

  /* Le Mi-Chui portait une aquarelle — un dégradé, là où toutes les autres
     marques sont un aplat. Il passe à son mauve, y compris dans une config
     déjà en place. */
  if (c.affaires.contenu && c.affaires.contenu.aquarelle) {
    c.affaires.contenu = { ...c.affaires.contenu, aquarelle: false,
                           marque: "#A7748C", chip: "#A7748C", tint: "#F7F0F8" };
  }

  /* Ancienne configuration : le riad avait ses réglages dans un coin à part */
  if (saved.riad && c.affaires.riad) {
    c.affaires.riad.type = "hebergement";
    c.affaires.riad.hebergement = { ...(c.affaires.riad.hebergement || {}), ...saved.riad };
  }
  delete c.riad;

  c.fournisseurs = saved.fournisseurs || DEFAULT_CONFIG.fournisseurs;
  c.structures = [];
  c.societes = (saved.societes && saved.societes.length) ? saved.societes : DEFAULT_CONFIG.societes;
  c.seuils = { ...(saved.seuils || DEFAULT_CONFIG.seuils) };
  c.chantiers = saved.chantiers || DEFAULT_CONFIG.chantiers;
  /* La solidarité est versée le 20 de chaque mois : le jour est fixe, même si une
     ancienne configuration enregistrée portait le 1er. */
  c.solidarite = { ...DEFAULT_CONFIG.solidarite, ...(saved.solidarite || {}), jour: 20 };
  /* Une configuration ancienne portait la solidarité dans les charges du foyer */
  const ancienneAide = (c.foyer.fixes || []).find((f) => f.id === "h3");
  if (ancienneAide) {
    c.foyer.fixes = c.foyer.fixes.filter((f) => f.id !== "h3");
    if (!saved.solidarite) c.solidarite = { montant: num(ancienneAide.montant), jour: 20 };
  }
  c.notes = { ...(saved.notes || {}) };
  c.poches = (saved.poches && saved.poches.length) ? saved.poches : DEFAULT_CONFIG.poches;
  c.banqueCartes = saved.banqueCartes || DEFAULT_CONFIG.banqueCartes;
  c.pocheCartes = saved.pocheCartes || DEFAULT_CONFIG.pocheCartes;
  c.banqueAirbnb = saved.banqueAirbnb || DEFAULT_CONFIG.banqueAirbnb;
  c.naps = { tauxHT: num((saved.naps || {}).tauxHT) || DEFAULT_CONFIG.naps.tauxHT,
             tva: num((saved.naps || {}).tva) || DEFAULT_CONFIG.naps.tva };

  /* Chaque activité relève d'une société ; le riad est chez Gourmet Souk */
  const socParDefaut = ((c.societes[0] || {}).id) || "michui";
  Object.keys(c.affaires).forEach((k) => {
    if (!c.affaires[k].societe) {
      const d = DEFAULT_CONFIG.affaires[k];
      c.affaires[k].societe = (d && d.societe) || socParDefaut;
    }
  });

  /* La CNSS se déclarait globalement ; elle se déclare maintenant par société */
  if (c.cnss && ("actif" in c.cnss || "montant" in c.cnss)) {
    const ancien = { actif: !!c.cnss.actif, montant: num(c.cnss.montant) };
    c.cnss = {};
    c.societes.forEach((s, i) => {
      c.cnss[s.id] = i === 0 ? ancien : { actif: false, montant: 0 };
    });
  } else {
    c.cnss = { ...(c.cnss || {}) };
    c.societes.forEach((s) => { if (!c.cnss[s.id]) c.cnss[s.id] = { actif: false, montant: 0 }; });
  }

  /* Le loyer de la médina était coupé en deux lignes pour un seul paiement */
  const rdc = c.fixes.find((f) => f.id === "f6");
  const mez = c.fixes.find((f) => f.id === "f17");
  if (rdc && mez) {
    const total = num(rdc.montant) + num(mez.montant);
    c.fixes = c.fixes
      .filter((f) => f.id !== "f17")
      .map((f) => f.id === "f6"
        ? { ...f, lbl: "Loyer Guéliz — Ta'âm et labo", montant: total,
            partagePct: total > 0 ? Math.round((num(mez.montant) / total) * 100) : 0 }
        : f);
  }

  c.fixes = c.fixes.map((f) => f.id === "f6" && /médina/i.test(f.lbl || "")
    ? { ...f, lbl: "Loyer Guéliz — Ta'âm et labo" } : f);

  /* TAAM, octobre 2026 (Amal) : plus de pourcentages. TAAM est un restaurant
     qui va ouvrir ; il porte seul son loyer entier de 14 000 DH, dont la
     première échéance est le 1er novembre 2026. Plus de labo partagé. */
  c.fixes = c.fixes.map((f) => f.id === "f6" && !f.tamOk
    ? { ...f, lbl: "Loyer Guéliz — TAAM", partagePct: 0, jour: 1, depuis: "2026-11", tamOk: true } : f);

  /* Le coursier est payé à la tâche, pas au mois : il passe en fournisseur */
  if (c.fixes.some((f) => f.id === "f3" && /coursier/i.test(f.lbl || ""))) {
    c.fixes = c.fixes.filter((f) => f.id !== "f3");
    if (!c.fournisseurs.some((f) => /coursier/i.test(f.nom || ""))) {
      c.fournisseurs = [{ id: "p14", nom: "Coursier", affaires: ["sabich"], rythme: "mois" },
                        ...c.fournisseurs];
    }
  }
  c.cle          = saved.cle || DEFAULT_CONFIG.cle;
  c.foyer = { ...DEFAULT_CONFIG.foyer, ...(saved.foyer || {}) };
  if (saved.foyer && saved.foyer.remunerations) c.foyer.remunerations = saved.foyer.remunerations;
  /* La maison, octobre 2026 (Amal) : la traite passe le 6, vos deux salaires
     se versent le 1er, et le carburant n'est plus suivi — il est dans l'argent
     de poche de chacun. */
  if (c.foyer) {
    c.foyer = { ...c.foyer,
      fixes: (c.foyer.fixes || []).filter((f) => !(f.id === "h6" && /carburant/i.test(f.lbl || "")))
        .map((f) => (f.id === "h1" && num(f.jour) === 5) ? { ...f, jour: 6 } : f),
      remunerations: (c.foyer.remunerations || [])
        .map((r) => num(r.jour) === 30 ? { ...r, jour: 1 } : r) };
  }

  return c;
}

/* ------------------------------------------------------------------ */
/*  APP                                                                */
/* ------------------------------------------------------------------ */

export default function App({ session, onLogout }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [entries, setEntries] = useState([]);
  const [taches, setTaches] = useState([]);
  const [ready, setReady] = useState(false);
  const [panne, setPanne] = useState(false);
  /* Le jeton de version de chaque clé, et la dernière valeur qu'on lui connaît.
     Dans une ref et non dans l'état : une sauvegarde doit lire la valeur du
     moment, pas celle figée au rendu qui a déclenché le clic. */
  const versions = useRef({ config: { jeton: null, valeur: null },
                            entries: { jeton: null, valeur: null },
                            taches: { jeton: null, valeur: null } });
  const moi = nomMembre(config, session && session.user && session.user.email);
  const [ym, setYm] = useState(thisMonth());
  const [vue, setVue] = useState("dash");

  useEffect(() => {
    (async () => {
      try {
        const c = await window.storage.get("pilotage:config");
        if (c && c.value) {
          const parse = JSON.parse(c.value);
          versions.current.config = { jeton: c.version, valeur: parse };
          setConfig(reprendre(parse));
        }
      } catch (e) { /* première ouverture */ }
      try {
        const e = await window.storage.get("pilotage:entries");
        if (e && e.value) {
          const parse = JSON.parse(e.value);
          versions.current.entries = { jeton: e.version, valeur: parse };
          setEntries(parse);
        }
      } catch (e) { /* première ouverture */ }
      /* La remise à zéro du 1er septembre 2026 a eu lieu. Le code qui
         l'exécutait a été retiré : un effacement de masse n'a rien à faire
         dans le démarrage de l'app, retenu par un drapeau écrit en dernier.
         Une coupure réseau au mauvais moment, ou une base restaurée sans ce
         drapeau, et tout ce qui est daté avant septembre disparaissait —
         y compris les factures d'août saisies depuis. */

      try {
        const s = await window.storage.get("pilotage:seed");
        if (!s || !s.value) {
          const e2 = await window.storage.get("pilotage:entries");
          const dejaLa = e2 && e2.value ? JSON.parse(e2.value) : [];
          if (!dejaLa.some((x) => x.seed)) {
            /* Écriture conditionnelle : si l'autre appareil a saisi quelque
               chose entre notre lecture et notre écriture, on ne l'écrase pas. */
            const w = await window.storage.setIf("pilotage:entries",
              JSON.stringify([...dejaLa, ...HISTORIQUE_SABICH]), e2 ? e2.version : null);
            if (w.ok) {
              const fusion = [...dejaLa, ...HISTORIQUE_SABICH];
              setEntries(fusion);
              versions.current.entries = { jeton: w.version, valeur: fusion };
            }
          }
          await window.storage.set("pilotage:seed", "1");
        }
      } catch (e) { /* première ouverture */ }
      try {
        const t = await window.storage.get("pilotage:taches");
        if (t && t.value) {
          const parse = JSON.parse(t.value);
          versions.current.taches = { jeton: t.version, valeur: parse };
          setTaches(reveiller(parse));
        }
      } catch (e) { /* première ouverture */ }
      setReady(true);
    })();
  }, []);

  /* Synchronisation en direct : quand l'un des deux modifie une donnée,
     l'autre la voit apparaître sans recharger la page. On ne touche que
     l'état local, la sauvegarde elle-même reste gérée par saveConfig /
     saveEntries / saveTaches ci-dessous. */
  useEffect(() => {
    const channel = supabase
      .channel("kv_store-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "kv_store" }, (payload) => {
        const row = payload.new;
        if (!row || typeof row.value !== "string") return;
        const quoi = row.key === "pilotage:config" ? "config"
                   : row.key === "pilotage:entries" ? "entries"
                   : row.key === "pilotage:taches" ? "taches" : null;
        if (!quoi) return;
        /* C'est notre propre écriture qui nous revient : rien à faire. */
        if (row.version && versions.current[quoi].jeton === row.version) return;
        try {
          const parse = JSON.parse(row.value);
          versions.current[quoi] = { jeton: row.version, valeur: parse };
          if (quoi === "config") setConfig(reprendre(parse));
          else if (quoi === "entries") setEntries(parse);
          else setTaches(reveiller(parse));
        } catch (e) { /* ignore */ }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  /* ------------------------------------------------------------------ *
   *  SAUVEGARDE PARTAGÉE — personne n'écrase personne                    *
   * ------------------------------------------------------------------ *
   *  Avant : chaque sauvegarde réécrivait tout le tableau depuis la copie
   *  locale. SAIB enregistrant une recette à 20h02 pendant qu'Amal saisit
   *  une facture, le dernier des deux effaçait l'autre, sans un mot.
   *
   *  Maintenant : on n'envoie plus un résultat, on envoie un GESTE. La base
   *  n'accepte l'écriture que si personne n'est passé depuis notre dernière
   *  lecture ; sinon on relit le frais et on rejoue le même geste dessus.
   *  Les deux saisies survivent, quel que soit l'ordre d'arrivée.           */

  const setLocal = { config: setConfig, entries: setEntries, taches: setTaches };
  const relire   = { config: reprendre, entries: (x) => x, taches: reveiller };

  const appliquer = async (quoi, geste, refuseConflit) => {
    const cle = "pilotage:" + quoi;
    let courant = versions.current[quoi] ? versions.current[quoi].valeur : null;
    for (let essai = 0; essai < 5; essai++) {
      const suivant = geste(courant);
      setLocal[quoi](relire[quoi](suivant));
      versions.current[quoi] = { ...versions.current[quoi], valeur: suivant };
      let r;
      try {
        r = await window.storage.setIf(cle, JSON.stringify(suivant),
                                       versions.current[quoi].jeton);
      } catch (e) {
        console.error("sauvegarde", cle, e);
        setPanne(true);
        return false;
      }
      if (r.ok) {
        versions.current[quoi].jeton = r.version;
        setPanne(false);
        return true;
      }
      /* Quelqu'un est passé : on repart de SA version et on rejoue notre geste. */
      try { courant = r.value ? JSON.parse(r.value) : (quoi === "config" ? {} : []); }
      catch (e) { courant = quoi === "config" ? {} : []; }
      versions.current[quoi] = { jeton: r.version, valeur: courant };
      /* Les réglages ne sont pas un geste rejouable mais une photo complète de
         l'écran : la rejouer effacerait ce que l'autre vient de changer. On
         recharge sa version et on rend la main. */
      if (refuseConflit) {
        setLocal[quoi](relire[quoi](courant));
        return "conflit";
      }
    }
    console.error("sauvegarde impossible après 5 essais", cle);
    setPanne(true);
    return false;
  };

  const saveConfig = async (c) => {
    const avant = config;
    const ok = await appliquer("config", () => c, true);
    if (ok !== true) return ok;
    const lignes = diffReglages(avant, c);
    if (lignes.length > 0) {
      try {
        const j = await window.storage.get("pilotage:journal-config");
        const liste = j && j.value ? JSON.parse(j.value) : [];
        const quand = new Date().toISOString();
        const ajout = lignes.map((l) => ({ ...l, quand, qui: moi || "—" }));
        /* On garde les 300 derniers changements : de quoi remonter loin
           sans faire gonfler le fichier indéfiniment. */
        await window.storage.set("pilotage:journal-config",
          JSON.stringify([...ajout, ...liste].slice(0, 300)));
      } catch (e) { console.error("journal des réglages", e); }
    }
    return true;
  };
  const saveEntries = (list) => appliquer("entries", () => list);
  const saveTaches  = (list) => appliquer("taches",  () => list);
  /* Les gestes qui comptent passent par un delta rejouable, pas par un résultat. */
  const gesteEntries = (fn) => appliquer("entries", (list) => fn(list || []));
  const gesteTaches  = (fn) => appliquer("taches",  (list) => fn(list || []));
  const addTache = (t) => gesteTaches((l) =>
    [...l, { ...t, id: uid(), creee: aujourdhui(), par: moi }]);
  const majTache = (id, champs) => gesteTaches((l) => l.map((t) => {
    if (t.id !== id) return t;
    const t2 = { ...t, ...champs, majPar: moi };
    /* Une tâche qui revient se replante toute seule à la prochaine échéance */
    if (champs.etat === "fait" && t.repete) {
      const echeance = prochaine(t.echeance, t.repete);
      return { ...t2, etat: "afaire", echeance, ...decaler(t, echeance),
               faitLe: aujourdhui() };
    }
    return t2;
  }));
  const delTache = (id) => gesteTaches((l) => l.filter((t) => t.id !== id));

  /* Chaque écriture garde le nom de qui l'a créée et de qui l'a corrigée. */
  const addEntry = (e) => gesteEntries((l) => {
    /* Une facture qui solde des bons de livraison les met à jour dans le même
       geste que son enregistrement : une seule écriture, jamais à moitié faite. */
    const { solde, ...entree } = e;
    const base = (solde && solde.ids)
      ? l.map((x) => solde.ids.includes(x.id)
          ? { ...x, ...solde.champs, majPar: moi, majLe: aujourdhui() } : x)
      : l;
    return [...base, { ...entree, id: uid(), par: moi, saisiLe: aujourdhui() }];
  });
  const delEntry = (id) => gesteEntries((l) => l.filter((e) => e.id !== id));
  /* L'export Naps : une écriture par télécollecte, jamais deux fois la même.
     Une télécollecte déjà connue est mise à jour (son statut peut passer à
     « Versé » d'un export à l'autre). Tout l'import tient en un seul geste. */
  const importerNaps = (lignes) => gesteEntries((l) => {
    const out = [...l];
    lignes.forEach((x) => {
      const champs = { tc: x.tc, nb: x.nb, ventes: x.ventes, commission: x.commission,
                       ajust: x.ajust, verse: x.verse, statut: x.statut, dateVir: x.dateVir,
                       date: x.dateVir, pdv: x.pdv };
      const i = out.findIndex((e) => e.type === "napsTc" && String(e.tc) === x.tc);
      if (i >= 0) out[i] = { ...out[i], ...champs, majPar: moi, majLe: aujourdhui() };
      else out.push({ ...champs, type: "napsTc", affaire: "contenu", id: uid(), par: moi,
                      saisiLe: aujourdhui(), importeLe: aujourdhui() });
    });
    return out;
  });
  /* Une charge de septembre peut très bien avoir été payée fin août. Tant que le
     pointage ne portait qu'un mois, « ce que j'ai réellement payé » comptait en
     septembre de l'argent sorti en août. Le pointage garde donc deux dates :
     `date` dit de quel mois est la charge, `regleLe` dit quand l'argent est
     vraiment sorti. Par défaut, le jour d'échéance — ou aujourd'hui si elle
     paie en avance. Elle peut corriger la date ligne par ligne. */
  const jourEcheance = (ref) => {
    const t = [...config.fixes, ...config.structures, ...config.foyer.fixes,
               ...(config.foyer.remunerations || [])]
      .find((x) => x.id === String(ref).replace(/^retard:/, ""));
    return t ? (num(t.jour) || 5) : 5;
  };
  const dateReglementParDefaut = (ref) => {
    const [an, mo] = ym.split("-").map(Number);
    const fin = new Date(an, mo, 0).getDate();
    const j = Math.min(Math.max(1, jourEcheance(ref)), fin);
    const prevu = ym + "-" + String(j).padStart(2, "0");
    const auj = aujourdhui();
    return (ym === thisMonth() && prevu > auj) ? auj : prevu;
  };
  const regler = (ref, oui) => gesteEntries((l) => {
    /* Solidarité : la cocher, c'est DONNER ce qu'il reste à donner ce mois-ci.
       Avant, le pointage ne créait qu'un « payé » : l'argent sortait mais le don
       restait à 0, donc la carte affichait toujours « prévu ». On enregistre
       maintenant un vrai don (marqué `pointe`), qu'on peut annuler en décochant.
       Un ancien pointage « payé » du mois est remplacé, jamais compté en double. */
    if (ref === "solidarite") {
      const dumois = (e) => (e.date || "").startsWith(ym);
      const sans = l.filter((e) => !((e.type === "paye" && e.ref === "solidarite" && dumois(e))
                                  || (e.type === "solidarite" && e.pointe && dumois(e))));
      if (!oui) return sans;
      /* L'ancien pointage n'a jamais compté comme un don : le reste à donner est
         donc bien celui que l'app affiche. */
      const reste = num(M.soliReste);
      if (reste <= 0) return l;
      const jj = String(Math.min(31, num((config.solidarite || {}).jour) || 1)).padStart(2, "0");
      const prevu = ym + "-" + jj;
      const date = (ym === thisMonth() && prevu > aujourdhui()) ? aujourdhui() : prevu;
      return [...sans, { id: uid(), type: "solidarite", date, montant: reste, lbl: "Solidarité",
                         pointe: true, par: moi, saisiLe: aujourdhui() }];
    }
    const cle = (e) => e.type === "paye" && e.ref === ref && (e.date || "").startsWith(ym);
    /* On enregistre le montant réellement dû au moment du pointage — prime et
       avance comprises, plusieurs mois de retard compris, solidarité déjà
       versée déduite. Recalculé plus tard, ce montant aurait changé. */
    const ligne = (M.lignesAPayer || []).find((x) => x.id === ref);
    const cleI = (e) => e.type === "impaye" && e.ref === ref && (e.date || "").startsWith(ym);
    if (oui) {
      return [...l.filter((e) => !cleI(e)), { id: uid(), type: "paye", ref, date: ym + "-01",
                          ...(ligne ? { montant: ligne.montant } : {}),
                          regleLe: dateReglementParDefaut(ref), par: moi }];
    }
    /* Décocher une charge, c'est dire « celle-là n'a pas été payée » : sans cette
       trace, elle redeviendrait payée toute seule à son échéance. */
    const sans = l.filter((e) => !cle(e));
    return (String(ref).startsWith("retard:") || sans.some(cleI)) ? sans
      : [...sans, { id: uid(), type: "impaye", ref, date: ym + "-01", par: moi }];
  });
  /* Corriger après coup la date de sortie d'argent d'une charge déjà pointée. */
  const daterReglement = (ref, quand) => gesteEntries((l) => l.map((e) =>
    (e.type === "paye" && e.ref === ref && (e.date || "").startsWith(ym))
      ? { ...e, regleLe: quand, majPar: moi, majLe: aujourdhui() } : e));
  /* …et dire de quelle poche l'argent est sorti. */
  const pocherReglement = (ref, poche) => gesteEntries((l) => l.map((e) =>
    (e.type === "paye" && e.ref === ref && (e.date || "").startsWith(ym))
      ? { ...e, poche, majPar: moi, majLe: aujourdhui() } : e));
  /* Le vrai montant d'une charge qui varie, quand la facture arrive. Écrire 0
     ou vider le champ remet l'estimation. */
  const chiffrer = (ref, montant) => gesteEntries((l) => {
    const cle = (e) => e.type === "reel" && e.ref === ref && (e.date || "").startsWith(ym);
    const sans = l.filter((e) => !cle(e));
    /* « Écrire 0 ou vider le champ remet l'estimation » : un 0 créait en fait
       une charge à zéro, qui effaçait la ligne du résultat et de la caisse. */
    if (String(montant).trim() === "" || num(montant) <= 0) return sans;
    return [...sans, { id: uid(), type: "reel", ref, date: ym + "-01",
                       montant: num(montant), par: moi, saisiLe: aujourdhui() }];
  });
  /* Déplacer de l'argent d'une poche à l'autre : un dépôt en banque, un retrait. */
  const transferer = (de, vers, montant, date, motif) => addEntry({
    type: "transfert", de, vers, montant: num(montant), date: date || aujourdhui(), motif });
  /* Le comptage du soir : ce qu'il y a VRAIMENT dans le tiroir. À partir de là,
     c'est lui la référence — l'appli repart de ce chiffre. */
  const compter = (poche, reel, theorique, motif, date, avant) => addEntry({
    type: "comptage", poche, montant: num(reel), theorique: num(theorique),
    motif: motif || "", date: date || aujourdhui(), ...(avant ? { avant: true } : {}) });
  const reporter = (ref) => gesteEntries((l) => {
    const cle = (e) => e.type === "reporte" && e.ref === ref && (e.date || "").startsWith(ym);
    return l.some(cle) ? l.filter((e) => !cle(e))
                       : [...l, { id: uid(), type: "reporte", ref, date: ym + "-01", par: moi }];
  });
  /* On solde des pièces précises, quel que soit leur mois : le filtre sur le mois
     affiché rendait un bon de livraison d'août impossible à solder depuis
     septembre — il restait « à régler » pour toujours. */
  /* Solder, c'est sortir l'argent AUJOURD'HUI — pas à la date de la facture.
     Sans cette date de règlement, payer en mars un bon de livraison de février
     vidait la caisse de février, rétroactivement. */
  const solder = (ids) => gesteEntries((l) => l.map((e) =>
    ids.includes(e.id)
      ? { ...e, aPayer: false, regleLe: aujourdhui(), majPar: moi, majLe: aujourdhui() }
      : e));
  /* id peut être une liste : payer une facture solde du même coup tous ses bons de livraison. */
  const majEntry = (id, champs) => gesteEntries((l) => l.map((e) =>
    (Array.isArray(id) ? id.includes(e.id) : e.id === id)
      ? { ...e, ...champs, majPar: moi, majLe: aujourdhui() } : e));

  /* Si l'activité ouverte vient d'être archivée ou supprimée, on revient au tableau de bord */
  useEffect(() => {
    const fixes = ["dash", "foyer", "reglages"];
    if (!fixes.includes(vue) && (!config.affaires[vue] || config.affaires[vue].archive)) setVue("dash");
  }, [config, vue]);

  const M = useMemo(() => calcul(config, entries, ym), [config, entries, ym]);
  const deja = dejaPaye(entries, ym);

  if (!ready) {
    return <div className="pil"><style>{CSS}</style>
      <div className="wrap"><div className="empty">Chargement…</div></div></div>;
  }

  return (
    <div className="pil">
      <style>{CSS}</style>
      <div className="wrap">

        <div className="topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div className="brand" style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <img src={LOGOS.life} alt="Tree of Life" style={{ height: 82, width: "auto", display: "block" }} />
            <h1 className="h1">{monthLabel(ym)}</h1>
          </div>
          <div className="moisNav" style={{ display: "flex", gap: 6 }}>
            <button className="pill" onClick={() => setYm(shiftMonth(ym, -1))} aria-label="Mois précédent">←</button>
            <button className="pill" onClick={() => setYm(thisMonth())}>Ce mois</button>
            <button className="pill" onClick={() => setYm(shiftMonth(ym, 1))} aria-label="Mois suivant">→</button>
          </div>
        </div>

        {/* Ce bandeau vivait en haut de page : sur un téléphone, au moment du
            clic sur « Enregistrer », il était hors écran et un message vert
            « Enregistré » s'affichait sous le doigt. Il colle maintenant au
            haut de l'écran, quoi qu'on regarde. */}
        {panne && (
          <div className="card" style={{ background: "#FDECEC", borderColor: "#F0C6C6",
                                         color: "#A4262C", marginBottom: 14,
                                         position: "sticky", top: 0, zIndex: 50,
                                         boxShadow: "0 6px 18px rgba(0,0,0,.10)" }}>
            <strong>La dernière saisie n'est pas enregistrée.</strong> Vérifie ta connexion,
            puis refais-la. Tant que ce bandeau est là, ce que tu vois à l'écran n'est pas
            sur le serveur — et SAIB ne le voit pas.
          </div>
        )}

        <div className="scene">

        <Alarme entries={entries} config={config} onAller={setVue}
                onPointer={(iso, patch) => saveConfig({ ...config, pointages: { ...(config.pointages || {}), [iso]: { ...((config.pointages || {})[iso] || {}), ...patch } } })} />
        <div className="tabs">
          {onglets(config).map((o) => (
            <button key={o.id} className={"tab" + (vue === o.id ? " on" : "") + (o.clair ? " clair" : "") + (o.garde ? " garde" : "")}
                    onClick={() => setVue(o.id)} aria-label={o.nom} title={o.nom}
                    aria-current={vue === o.id ? "page" : undefined}
                    style={{ background: o.fond }}>
              {o.logo
                ? <img src={o.logo} alt={o.nom} style={{ ...o.taille, ...encre(o) }} />
                : <span className="lib" style={o.texte ? { color: o.texte } : {}}>{o.nom}</span>}
            </button>
          ))}
        </div>

        <div className="panneau" data-vue={vue} style={univers(vue, config)}>
        {vue === "dash"     && <Consolide M={M} config={config} ym={ym} onAller={setVue}
                                          entries={entries} onRegler={regler} onReporter={reporter} onDater={daterReglement}
                                    onPocher={pocherReglement} onChiffrer={chiffrer}
                                          onPocher={pocherReglement} onTransfert={transferer} onCompter={compter}
                                          onChiffrer={chiffrer}
                                          onAdd={addEntry} onDel={delEntry} onMaj={majEntry}
                                          onSaveConfig={saveConfig}
                                          taches={taches} onAddTache={addTache}
                                          onMajTache={majTache} onDelTache={delTache} />}
        {config.affaires[vue] && <FicheActivite k={vue} M={M} config={config} entries={entries}
                                     ym={ym} onSolder={solder} onAdd={addEntry} deja={deja}
                                     onRegler={regler} onReporter={reporter} onDater={daterReglement}
                                     onPocher={pocherReglement} onChiffrer={chiffrer}
                                     onDel={delEntry} onMaj={majEntry} onImporterNaps={importerNaps}
                                     taches={taches} onAddTache={addTache}
                                     onMajTache={majTache} onDelTache={delTache} />}
        {vue === "foyer"    && <FoyerComplet M={M} config={config} onAdd={addEntry} ym={ym}
                                    entries={entries} onRegler={regler} onReporter={reporter} onDater={daterReglement}
                                    onDel={delEntry} onMaj={majEntry} deja={deja}
                                    onPocher={pocherReglement} onChiffrer={chiffrer}
                                    taches={taches} onAddTache={addTache}
                                    onMajTache={majTache} onDelTache={delTache} />}
        {vue === "reglages" && <Reglages config={config} onSave={saveConfig}
                                          session={session} onLogout={onLogout} />}
        </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MOTEUR DE CALCUL                                                   */
/* ------------------------------------------------------------------ */

const caTotalBrut = (keys, A) => keys.reduce((s, k) => s + A[k].ca, 0) || 1;

function calcul(config, entries, ym) {
  const inMonth = entries.filter((e) => (e.date || "").startsWith(ym));
  const keys = Object.keys(config.affaires);

  const A = {};
  keys.forEach((k) => {
    A[k] = { ca: 0, com: 0, matiere: 0, matiereReelle: 0, matiereExtras: 0, variable: 0,
             variableReelle: 0, variableExtras: 0,
             fixes: 0, partage: 0, cnss: 0, salaires: 0, estimee: false, resultat: 0, charges: 0 };
  });

  /* Une recette se décompose : espèces en caisse et cartes (via Naps). */
  let napsBrut = 0, especeTotal = 0, ecartFondsTotal = 0;
  const carteParAffaire = {}, especeParAffaire = {};
  inMonth.filter((e) => e.type === "vente").forEach((v) => {
    if (!A[v.affaire]) return;
    /* Anciennes saisies : les deux colonnes se rassemblent en un seul total carte */
    const carte = v.carte !== undefined ? num(v.carte) : num(v.napsMa) + num(v.napsEtr);
    const esp = v.espece !== undefined ? num(v.espece) : num(v.montant) - carte;
    const total = esp + carte;
    A[v.affaire].ca += total > 0 ? total : num(v.montant);
    carteParAffaire[v.affaire] = (carteParAffaire[v.affaire] || 0) + carte;
    especeParAffaire[v.affaire] = (especeParAffaire[v.affaire] || 0) + esp;
    napsBrut += carte; especeTotal += esp;

    /* Le fond de caisse ne pèse plus sur la recette : son écart se suit à
       part, seulement les jours où quelqu'un l'a vérifié. */
    if (v.fondReel !== undefined && v.fondReel !== "" && v.fondReel !== null) {
      const e = num(v.fondSuppose) - num(v.fondReel); // positif = il manque de l'argent
      A[v.affaire].ecartFonds = (A[v.affaire].ecartFonds || 0) + e;
      ecartFondsTotal += e;
    }
  });

  /* La commission Naps n'est plus estimée : c'est celle de l'export Naps,
     rattachée à son jour de CB, partagée entre Sabich et TMSK au prorata de
     leurs tickets CB. Tant qu'un jour n'est pas dans un export, sa commission
     n'est pas connue et ne compte pas. */
  let napsCom = 0;
  const comParAffaire = {}, carteVue = {};
  {
    const R = rapprocherNaps(entries);
    R.tcs.forEach((t) => {
      if (!t.jour || !t.jour.startsWith(ym)) return;
      const j = R.jours[t.jour];
      POINTS_NAPS.forEach((k) => {
        const cb = j.par[k] || 0;
        const c = j.total > 0 ? t.cout * cb / j.total : 0;
        comParAffaire[k] = (comParAffaire[k] || 0) + c;
        carteVue[k] = (carteVue[k] || 0) + cb;
        napsCom += c;
        if (A[k]) A[k].com += c;
      });
    });
  }

  /* Argent qui dort dans les tiroirs : ni charge ni recette, mais indisponible */
  const fondsCaisse = keys.reduce((s, k) => s + (config.affaires[k].archive ? 0
                        : num(config.affaires[k].fonds)), 0);
  /* Le rythme quotidien : ce qui rentre et ce qui sort, jour par jour.
     C'est là qu'une dérive se voit avant la fin du mois. */
  const dernierJour = new Date(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)), 0).getDate();
  const finFenetre = ym === new Date().toISOString().slice(0, 7)
    ? new Date().toISOString().slice(0, 10)
    : ym + "-" + String(dernierJour).padStart(2, "0");
  const jours7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(finFenetre + "T12:00:00");
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const duJour = entries.filter((e) => e.date === iso);
    const rec = duJour.filter((e) => e.type === "vente")
      .reduce((s, e) => {
        /* Anciennes saisies : ni espèces ni carte, seulement un total */
        const d = num(e.espece) + num(e.carte);
        return s + (d > 0 ? d : num(e.montant));
      }, 0)
      + duJour.filter((e) => e.type === "resa" && !e.aRecevoir)
               .reduce((s, e) => s + num(e.montant), 0);
    const dep = duJour.filter((e) => e.type === "depense")
      .reduce((s, e) => s + num(e.montant), 0);
    /* Ce qui sort aussi de la caisse ce jour-là, sans être un achat courant.
       Les avances sur salaire sont volontairement exclues : le salaire est
       déjà porté par les charges fixes, les compter deux fois gonflerait
       la journée pour rien. */
    const inv = duJour.filter((e) => e.type === "invest")
      .reduce((s, e) => s + num(e.montant), 0);
    const prel = duJour.filter((e) => (e.type === "avance" && e.nature !== "salaire")
                                      || e.type === "perso")
      .reduce((s, e) => s + num(e.montant), 0);
    /* Les charges fixes comptent le jour où l'argent est vraiment sorti — celui
       qu'on a coché payé (`regleLe`), pas une part étalée sur le mois. Un jour
       sans charge réglée n'en porte aucune. */
    const fixe = entries.filter((e) => e.type === "paye" && (e.regleLe || e.date) === iso)
      .reduce((s, e) => s + num(e.montant), 0)
      + duJour.filter((e) => e.type === "solidarite").reduce((s, e) => s + num(e.montant), 0);
    jours7.push({ date: iso, rec, dep, inv, prel, fixe,
                  par: Object.fromEntries(keys.map((k) => [k,
                    duJour.filter((e) => e.affaire === k && e.type === "depense")
                          .reduce((s, e) => s + num(e.montant), 0)])) });
  }
  const hautJour = Math.max(1, ...jours7.map((j) => Math.max(j.rec, j.dep)));

  /* Le détail par activité, pour sa propre fiche */
  const encaissements = {};
  keys.forEach((k) => {
    const carte = carteParAffaire[k] || 0;
    encaissements[k] = { carte, com: comParAffaire[k] || 0, carteVue: carteVue[k] || 0,
                         taux: carteVue[k] > 0 ? (comParAffaire[k] || 0) / carteVue[k] * 100 : null,
                         espece: especeParAffaire[k] || 0,
                         fonds: num(config.affaires[k].fonds),
                         ecartFonds: A[k].ecartFonds || 0 };
  });

  const defautHeb = (hebergeurs(config)[0] || [])[0];

  /* Le même mois, un an plus tôt : la comparaison qui résiste à la saisonnalité */
  const ymAvant = (Number(ym.slice(0, 4)) - 1) + ym.slice(4);
  const anDernier = {};
  entries.filter((e) => (e.date || "").slice(0, 7) === ymAvant).forEach((e) => {
    if (e.type === "vente" && A[e.affaire]) {
      const carte = e.carte !== undefined ? num(e.carte) : num(e.napsMa) + num(e.napsEtr);
      const esp = e.espece !== undefined ? num(e.espece) : num(e.montant) - carte;
      anDernier[e.affaire] = (anDernier[e.affaire] || 0) + esp + carte;
    }
    if (e.type === "resa") {
      if (e.aRecevoir) return;
      const k = (e.affaire && A[e.affaire]) ? e.affaire : defautHeb;
      if (!k) return;
      /* Même périmètre que le mois en cours : séjour + extras vendus.
         Sans les extras, la comparaison d'une année sur l'autre est truquée. */
      const X = (HEB(config, k) || {}).extras || {};
      const px = (id) => (X[id] ? num(X[id].prix) : 0);
      anDernier[k] = (anDernier[k] || 0) + num(e.montant)
                   + num(e.pdj) * px("pdj") + num(e.dej) * px("dej")
                   + num(e.diner) * px("diner");
    }
    if (e.type === "repas") {
      const k = (e.affaire && A[e.affaire]) ? e.affaire : defautHeb;
      if (!k) return;
      anDernier[k] = (anDernier[k] || 0) + (e.statut === "offert" ? 0 : num(e.montant));
    }
  });

  const naps = { brut: napsBrut, com: napsCom, net: napsBrut - napsCom, fondsCaisse,
                 espece: especeTotal, ecartFonds: ecartFondsTotal, parAffaire: encaissements };

  /* Un séjour est saisi à sa date d'ARRIVÉE, avec toutes ses nuits. Un séjour
     de 6 nuits arrivé le 28 septembre mettait donc 6 nuitées en septembre et
     zéro en octobre : le taux d'occupation de septembre pouvait dépasser 100 %,
     celui d'octobre paraissait catastrophique, et le voyant « nuitées requises »
     jugeait octobre sur des charges sans aucune recette en face.
     L'argent, lui, reste au mois d'arrivée : c'est là qu'il est encaissé, et
     l'app suit la caisse. On ne découpe que les NUITS. */
  const nuitsDansLeMois = (r) => {
    const n = num(r.nuits);
    if (n <= 0 || !r.date) return 0;
    const debut = new Date(r.date + "T12:00:00");
    let dedans = 0;
    for (let i = 0; i < n; i++) {
      const j = new Date(debut);
      j.setDate(j.getDate() + i);
      if (j.toISOString().slice(0, 7) === ym) dedans++;
    }
    return dedans;
  };

  /* Les repas d'un séjour pouvaient être comptés DEUX fois : par les champs
     pdj/dej/diner portés par d'anciennes réservations, et par les écritures
     « repas » saisies à part depuis. Le code de la réservation rattache les
     deux : si un repas porte la même référence de séjour, la réservation
     n'apporte plus ses extras. */
  const refsAvecRepas = new Set(entries
    .filter((e) => e.type === "repas" && (e.reference || "").trim())
    .map((e) => (e.reference || "").trim().toLowerCase()));

  /* Chaque hébergement tient ses propres nuitées, à ses propres tarifs */
  const hebStats = {};
  keys.filter((k) => config.affaires[k].type === "hebergement").forEach((k) => {
    hebStats[k] = { nuits: 0, caNuits: 0, nuitsDirect: 0 };
  });
  inMonth.filter((e) => e.type === "resa").forEach((r) => {
    const k = (r.affaire && A[r.affaire]) ? r.affaire : defautHeb;
    const H = HEB(config, k);
    if (!k || !H) return;
    if (!hebStats[k]) hebStats[k] = { nuits: 0, caNuits: 0, nuitsDirect: 0 };
    const X = H.extras || {};
    const px = (id, champ) => (X[id] ? num(X[id][champ]) : 0);
    const nDansMois = nuitsDansLeMois(r);
    hebStats[k].nuits += nDansMois;
    hebStats[k].caNuits += num(r.montant);
    hebStats[k].nuitsSejours = (hebStats[k].nuitsSejours || 0) + num(r.nuits);
    if (r.source === "direct") hebStats[k].nuitsDirect += nDansMois;
    /* Une réservation pas encore encaissée ne compte ni en recette ni en
       commission : l'app suit la caisse, pas les promesses. Ses nuits, elles,
       comptent — le client dort bien dans le riad. */
    if (r.aRecevoir) A[k].caAttente = (A[k].caAttente || 0) + num(r.montant);
    const sejour = r.aRecevoir ? 0 : num(r.montant);
    /* Anciennes réservations : les repas étaient saisis avec le séjour.
       Elles gardent leur CA restauration ainsi, les nouvelles passent par
       leurs propres écritures « repas ». */
    /* La référence rattache proprement les extras à leur séjour. Quand elle
       manque — les tout premiers séjours n'en avaient pas — on regarde si un
       repas a été saisi pendant le séjour : si oui, il fait foi, et les extras
       portés par la réservation ne comptent pas une seconde fois. */
    const repasPendantLeSejour = () => {
      if (!r.date || num(r.nuits) <= 0) return false;
      const fin = new Date(r.date + "T12:00:00");
      fin.setDate(fin.getDate() + num(r.nuits));
      const finIso = fin.toISOString().slice(0, 10);
      return entries.some((e) => e.type === "repas"
        && (((e.affaire && A[e.affaire]) ? e.affaire : defautHeb) === k)
        && (e.date || "") >= r.date && (e.date || "") < finIso);
    };
    const extrasAilleurs = ((r.reference || "").trim()
      && refsAvecRepas.has((r.reference || "").trim().toLowerCase()))
      || repasPendantLeSejour();
    const q = (champ) => (extrasAilleurs || r.aRecevoir) ? 0 : num(r[champ]);
    const caEx = q("pdj") * px("pdj", "prix") + q("dej") * px("dej", "prix")
               + q("diner") * px("diner", "prix");
    A[k].ca += sejour + caEx;
    A[k].caHebergement = (A[k].caHebergement || 0) + sejour;
    A[k].caRestauration = (A[k].caRestauration || 0) + caEx;
    A[k].com += sejour * num(r.source === "direct" ? H.comDirect : H.comAirbnb) / 100;
    /* Le coût matière des extras est une estimation par couvert : il se met
       de côté, pour ne pas s'additionner aux achats réellement saisis. */
    A[k].matiereExtras += q("pdj") * px("pdj", "matiere") + q("dej") * px("dej", "matiere")
                        + q("diner") * px("diner", "matiere");
    /* Comme la matière : une commission par couvert est une estimation. Elle
       ne s'ajoute pas aux frais réellement saisis, elle les remplace tant
       qu'il n'y en a pas. */
    A[k].variableExtras += q("pdj") * px("pdj", "com") + q("dej") * px("dej", "com")
                         + q("diner") * px("diner", "com");
  });

  /* L'autre bout du même problème : un séjour arrivé fin du mois précédent
     occupe encore des nuits de celui-ci. Son argent reste au mois d'arrivée,
     mais ses nuits comptent ici — sinon un début de mois paraît vide alors que
     le riad était plein. */
  /* Un séjour de six semaines arrivé en janvier occupe encore des nuits en
     mars : on remonte sur douze mois, pas sur un seul. L'argent, lui, reste au
     mois d'arrivée. */
  const moisAvant = [];
  for (let i = 1; i <= 12; i++) moisAvant.push(shiftMonth(ym, -i));
  entries.filter((e) => e.type === "resa" && moisAvant.includes((e.date || "").slice(0, 7)))
    .forEach((r) => {
      const k = (r.affaire && A[r.affaire]) ? r.affaire : defautHeb;
      if (!k || !hebStats[k]) return;
      const n = nuitsDansLeMois(r);
      if (n <= 0) return;
      hebStats[k].nuits += n;
      if (r.source === "direct") hebStats[k].nuitsDirect += n;
    });

  /* Les repas et extras saisis à part : ils font la restauration du riad,
     jamais l'hébergement. Offerts, ils ne pèsent jamais sur la recette —
     mais la matière et le temps de la house manager restent de vrais coûts. */
  inMonth.filter((e) => e.type === "repas").forEach((r) => {
    const k = (r.affaire && A[r.affaire]) ? r.affaire : defautHeb;
    const H = HEB(config, k);
    if (!k || !H) return;
    const X = H.extras || {};
    const tarifee = ["pdj", "dej", "diner"].includes(r.categorie);
    const px = (champ) => (tarifee && X[r.categorie]) ? num(X[r.categorie][champ]) : 0;
    const montantVente = r.statut === "offert" ? 0 : num(r.montant);
    A[k].ca += montantVente;
    A[k].caRestauration = (A[k].caRestauration || 0) + montantVente;
    if (tarifee) {
      A[k].matiereExtras += num(r.couverts) * px("matiere");
      A[k].variableExtras += num(r.couverts) * px("com");
    }
  });

  let structExtra = 0, foyerDepenseMois = 0;
  inMonth.filter((e) => e.type === "depense").forEach((d) => {
    if (d.affaire === "structure") { structExtra += num(d.montant); return; }
    /* Une dépense ponctuelle de la maison : elle vit de l'enveloppe déjà
       versée par les affaires, elle ne s'ajoute pas à leurs charges — mais
       elle se garde pour que la maison voie où part son argent. */
    if (d.affaire === "foyer") { foyerDepenseMois += num(d.montant); return; }
    if (!A[d.affaire]) return;
    if (d.categorie === "matiere") A[d.affaire].matiereReelle += num(d.montant);
    else A[d.affaire].variableReelle += num(d.montant);
  });

  /* Une seule matière par activité : le réel quand il est saisi, l'estimation
     sinon. Jamais les deux — c'est ainsi qu'on compte un achat deux fois. */
  keys.forEach((k) => {
    const pct = config.affaires[k].matierePct || 0;
    A[k].matiereTheo = (A[k].ca * pct) / 100 + A[k].matiereExtras;
    /* Octobre 2026, règle d'Amal : l'app ne suppose rien, elle relaie la vérité.
       Le coût matière est ce qui a été réellement acheté et saisi — jamais une
       provision sur le chiffre d'affaires. Ce qui manque se voit dans la
       complétude des saisies, pas dans un chiffre inventé. */
    A[k].matiere = A[k].matiereReelle;
    /* Les frais variables suivent la même règle : le réel quand il existe,
       l'estimation par couvert sinon. Additionner les deux faisait sortir de
       la caisse un argent qui n'en était jamais sorti. */
    A[k].variable += A[k].variableReelle > 0 ? A[k].variableReelle : A[k].variableExtras;
  });

  /* Amal : « le téléphone et le carburant, des fois c'est plus, des fois c'est
     moins — on doit attendre la facture ». Une charge qui varie porte donc une
     ESTIMATION, pas un montant. Elle sert à prévoir tant qu'on ne sait pas ;
     dès qu'Amal saisit le vrai montant du mois, c'est lui qui compte partout.
     « Partout » veut dire ici : le résultat de l'affaire, la trésorerie et
     l'échéancier. Avant, le vrai montant ne remontait que dans l'échéancier —
     une facture d'eau de 2 300 DH laissait un résultat calculé sur 1 500.
     Les vrais montants sont rangés par mois : un règlement de février garde la
     facture de février, même consulté depuis mars. Un solde de caisse ne doit
     pas changer selon l'écran ouvert. Et un montant à zéro n'est pas un vrai
     montant : c'est l'estimation qui reprend la main. */
  const reelParMois = {};
  entries.filter((e) => e.type === "reel").forEach((e) => {
    if (num(e.montant) <= 0) return;
    const m = (e.date || "").slice(0, 7);
    (reelParMois[m] = reelParMois[m] || {})[e.ref] = num(e.montant);
  });
  const reelDuMois = reelParMois[ym] || {};
  const duLigneAu = (f, mois) => {
    const r = reelParMois[mois] || {};
    /* Une charge variable (eau, électricité, téléphone…) ne compte plus pour
       une estimation : Amal ne veut que des chiffres réels. Tant que sa
       facture n'est pas saisie, elle vaut 0 et n'apparaît nulle part — un
       rappel « Factures attendues » la garde en vue. */
    /* Une charge qui ne commence qu'à une date future (« depuis ») ne pèse
       sur aucun mois avant elle. */
    if (f.depuis && mois < f.depuis) return 0;
    return f.variable ? (r[f.id] !== undefined ? r[f.id] : 0) : num(f.montant);
  };
  const duLigne = (f) => duLigneAu(f, ym);
  const estEstime = (f) => !!f.variable && reelDuMois[f.id] === undefined;

  let partageTotal = 0, salPartage = 0, salTotal = 0;
  const salPartageSoc = {};   /* salaires du labo, par société */
  keys.forEach((k) => { A[k].salParSoc = {}; });
  const ajouteSal = (obj, soc, m) => { obj[soc] = (obj[soc] || 0) + m; };
  /* Les primes des bons mois : un vrai coût salarial, imputé au même endroit
     que le salaire qu'elles récompensent. */
  const primesDuMois = inMonth.filter((e) => e.type === "prime");
  const primeDe = (id) => primesDuMois.filter((e) => e.ref === id)
                                      .reduce((s, e) => s + num(e.montant), 0);
  const primesTotal = primesDuMois.reduce((s, e) => s + num(e.montant), 0);

  config.fixes.forEach((c) => {
    const m = duLigne(c) + (c.sal ? primeDe(c.id) : 0);
    if (c.affaire === "partage") {
      partageTotal += m;
      if (c.sal) { salPartage += m; ajouteSal(salPartageSoc, socDe(config, c), m); }
    }
    else if (A[c.affaire]) {
      /* Une ligne peut être payée en une fois mais servir à plusieurs activités :
         la part indiquée rejoint le pot commun, le reste est porté en propre. */
      const part = m * (num(c.partagePct) || 0) / 100;
      partageTotal += part;      if (c.sal) salPartage += part;
      A[c.affaire].fixes += m - part;
      if (c.sal) A[c.affaire].salaires += m - part;
      if (c.sal) {
        ajouteSal(A[c.affaire].salParSoc, socDe(config, c), m - part);
        if (part > 0) ajouteSal(salPartageSoc, socDe(config, c), part);
      }
    }
    if (c.sal) salTotal += m;
  });
  /* La clé est normalisée sur les activités qui existent encore, et sur leur
     somme réelle. Sinon : une activité supprimée emportait sa part du labo
     dans le vide (40 % des charges évaporées, sans un mot), et une clé qui ne
     faisait pas 100 % en inventait ou en perdait. Le labo est toujours payé
     en entier : il se répartit en entier. */
  const clePart = Object.entries(config.cle || {}).filter(([k]) => A[k] && num(config.cle[k]) > 0);
  const cleSomme = clePart.reduce((t, [, pct]) => t + num(pct), 0);
  const partsLabo = cleSomme > 0
    ? clePart.map(([k, pct]) => [k, num(pct) / cleSomme])
    /* Aucune clé exploitable : plutôt que de tout perdre, on partage à parts
       égales entre les activités et on le signale. */
    : keys.map((k) => [k, 1 / Math.max(1, keys.length)]);
  const cleIncomplete = cleSomme === 0 || Math.abs(cleSomme - 100) >= 0.5;
  partsLabo.forEach(([k, q]) => {
    if (!A[k]) return;
    A[k].partage += partageTotal * q;
    A[k].salaires += salPartage * q;
    Object.entries(salPartageSoc).forEach(([soc, m]) =>
      ajouteSal(A[k].salParSoc, soc, m * q));
  });

  /* Chaque société déclare la sienne, répartie sur les activités qui portent ses salaires */
  const cnssSoc = {};
  (config.societes || []).forEach((s) => {
    const r = (config.cnss || {})[s.id] || {};
    cnssSoc[s.id] = r.actif ? num(r.montant) : 0;
  });
  const cnssTotal = Object.values(cnssSoc).reduce((s, v) => s + v, 0);

  /* Marge dégagée par une nuitée, à partir d'un lot de réservations */
  const margeNuitees = (lot) => {
    let marge = 0, nuits = 0;
    lot.forEach((r) => {
      const k = (r.affaire && A[r.affaire]) ? r.affaire : defautHeb;
      const H = HEB(config, k);
      if (!H) return;
      const X = H.extras || {};
      const px = (id, ch) => (X[id] ? num(X[id][ch]) : 0);
      const sejour = num(r.montant);
      const recette = sejour + num(r.pdj) * px("pdj", "prix")
                    + num(r.dej) * px("dej", "prix") + num(r.diner) * px("diner", "prix");
      const cout = sejour * num(r.source === "direct" ? H.comDirect : H.comAirbnb) / 100
        + num(r.pdj) * (px("pdj", "matiere") + px("pdj", "com"))
        + num(r.dej) * (px("dej", "matiere") + px("dej", "com"))
        + num(r.diner) * (px("diner", "matiere") + px("diner", "com"));
      marge += recette - cout; nuits += num(r.nuits);
    });
    return nuits > 0 ? marge / nuits : null;
  };
  Object.entries(cnssSoc).forEach(([soc, montant]) => {
    if (montant <= 0) return;
    const assiette = keys.reduce((s, k) => s + (A[k].salParSoc[soc] || 0), 0);
    if (assiette <= 0) return;
    keys.forEach((k) => { A[k].cnss += (montant * (A[k].salParSoc[soc] || 0)) / assiette; });
  });

  keys.forEach((k) => {
    A[k].charges = A[k].com + A[k].matiere + A[k].variable + A[k].fixes + A[k].partage + A[k].cnss;
    A[k].resultat = A[k].ca - A[k].charges;
  });

  /* La réserve : ce qu'une affaire met de côté les bons mois pour ne pas
     rester à sec à sa réouverture. Un solde cumulé depuis toujours — pas
     un compte en banque simulé, seulement la somme des mouvements décidés
     et saisis un par un, exactement comme un chantier. */
  keys.forEach((k) => { A[k].reserveSolde = 0; A[k].reserveDepotMois = 0; A[k].reserveRetraitMois = 0; });
  entries.filter((e) => e.type === "reserve" && A[e.affaire]).forEach((e) => {
    const m = num(e.montant);
    A[e.affaire].reserveSolde += e.sens === "retrait" ? -m : m;
    if ((e.date || "").startsWith(ym)) {
      if (e.sens === "retrait") A[e.affaire].reserveRetraitMois += m;
      else A[e.affaire].reserveDepotMois += m;
    }
  });
  const reserveDepotsMoisTotal = keys.reduce((s, k) => s + A[k].reserveDepotMois, 0);
  const reserveRetraitsMoisTotal = keys.reduce((s, k) => s + A[k].reserveRetraitMois, 0);

  /* Mettre de côté pour un chantier, c'est le même geste que mettre en réserve :
     l'argent est encore là, mais il est promis. « Ce qu'il reste » doit répondre
     à UNE seule question — ce que tu peux encore engager librement. La réserve
     sortait déjà de la trésorerie, les chantiers n'y entraient nulle part :
     deux gestes identiques, deux réponses opposées. */
  const chantiersMois = inMonth.filter((e) => e.type === "chantier")
                               .reduce((s, e) => s + num(e.montant), 0);

  /* Les avances internes : quand la réserve d'une affaire ne suffit pas et
     qu'il faut vraiment puiser ailleurs (une autre affaire, ou l'enveloppe
     du mois suivant). Ça reste une dette tracée — qui doit quoi à qui,
     depuis quand — jusqu'à ce qu'un remboursement vienne la solder. */
  const rembourseDe = (id) => entries.filter((e) => e.type === "remboursement-interne" && e.ref === id)
                                     .reduce((s, e) => s + num(e.montant), 0);
  const avancesInternes = entries.filter((e) => e.type === "avance-interne")
    .map((e) => {
      const rembourse = rembourseDe(e.id);
      return { ...e, rembourse, solde: Math.max(0, num(e.montant) - rembourse) };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const avancesInternesOuvertes = avancesInternes.filter((a) => a.solde > 0.5);
  keys.forEach((k) => {
    A[k].detteInterne   = avancesInternesOuvertes.filter((a) => a.vers === k)
                                                  .reduce((s, a) => s + a.solde, 0);
    A[k].creanceInterne = avancesInternesOuvertes.filter((a) => a.de === k)
                                                  .reduce((s, a) => s + a.solde, 0);
  });

  /* Les prêts personnels : de l'argent perso qui sort de la maison ou d'une
     affaire (prêté à quelqu'un), ou qui y entre (emprunté à quelqu'un).
     Une dette tracée dans les deux sens, jusqu'au remboursement. */
  const rembourseDuPret = (id) => entries.filter((e) => e.type === "remboursement-pret" && e.ref === id)
                                         .reduce((s, e) => s + num(e.montant), 0);
  const pretsPerso = entries.filter((e) => e.type === "pret-perso")
    .map((e) => {
      const rembourse = rembourseDuPret(e.id);
      return { ...e, rembourse, solde: Math.max(0, num(e.montant) - rembourse) };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const pretsPersoOuverts = pretsPerso.filter((p) => p.solde > 0.5);
  const pretsIdParSens = {};
  pretsPerso.forEach((p) => { pretsIdParSens[p.id] = p.sens; });
  const pretsSortieMois =
    inMonth.filter((e) => e.type === "pret-perso" && e.sens === "prete")
           .reduce((s, e) => s + num(e.montant), 0)
    + inMonth.filter((e) => e.type === "remboursement-pret" && pretsIdParSens[e.ref] === "emprunte")
             .reduce((s, e) => s + num(e.montant), 0);
  const pretsEntreeMois =
    inMonth.filter((e) => e.type === "pret-perso" && e.sens === "emprunte")
           .reduce((s, e) => s + num(e.montant), 0)
    + inMonth.filter((e) => e.type === "remboursement-pret" && pretsIdParSens[e.ref] === "prete")
             .reduce((s, e) => s + num(e.montant), 0);

  const structFixe = config.structures.reduce((s, x) => s + duLigne(x), 0);
  const structure = structFixe + structExtra;
  const remus = config.foyer.remunerations || [];
  const totalFixesFoyer = config.foyer.fixes.reduce((s, x) => s + duLigne(x), 0);
  const salaires = remus.reduce((s, r) => s + num(r.montant), 0);
  const enveloppe = totalFixesFoyer + salaires;

  /* La solidarité se décide, elle ne se subit pas : elle sort de la trésorerie
     sans peser sur le résultat des commerces ni sur le seuil de rentabilité. */
  const soliFixe = num((config.solidarite || {}).montant);
  const soliVerse = inMonth.filter((e) => e.type === "solidarite")
                           .reduce((s, e) => s + num(e.montant), 0);
  /* Le mois porte l'engagement, pas seulement ce qui a déjà été donné : verser
     1 000 DH sur 10 000 prévus ne fait pas disparaître les 9 000 restants de la
     trésorerie. Si elle donne plus que prévu, c'est le versé qui compte. */
  const solidarite = Math.max(soliVerse, soliFixe);
  const soliReste  = Math.max(0, soliFixe - soliVerse);
  const soliPointe = inMonth.filter((e) => e.type === "solidarite" && e.pointe)
                            .reduce((s, e) => s + num(e.montant), 0);
  const soliCumul = entries.filter((e) => e.type === "solidarite"
      && (e.date || "").slice(0, 4) === ym.slice(0, 4))
    .reduce((s, e) => s + num(e.montant), 0);

  const caTotal     = keys.reduce((s, k) => s + A[k].ca, 0);
  const resAffaires = keys.reduce((s, k) => s + A[k].resultat, 0);
  const resultatNet = resAffaires - structure - enveloppe;

  const reportesRef = new Set(inMonth.filter((e) => e.type === "reporte").map((e) => e.ref));
  const avSalaire = inMonth.filter((e) => e.type === "avance" && e.nature === "salaire")
                           .reduce((s, e) => s + num(e.montant), 0);
  const avPerso   = inMonth.filter((e) => e.type === "avance" && e.nature !== "salaire")
                           .reduce((s, e) => s + num(e.montant), 0);
  /* Ce qui a déjà été avancé sur le salaire de quelqu'un ne reste pas à sortir :
     l'écran Paie le déduisait déjà, l'échéancier et le « reste à décaisser » non. */
  const avanceDe = (id) => inMonth
    .filter((e) => e.type === "avance" && e.nature === "salaire" && e.ref === id)
    .reduce((s, e) => s + num(e.montant), 0);
  const avances = avSalaire + avPerso;
  const invests = inMonth.filter((e) => e.type === "invest").reduce((s, e) => s + num(e.montant), 0);
  const encaisse = caTotal - keys.reduce((s, k) => s + A[k].com, 0);
  /* Ce que le mois doit encore à ses fournisseurs. On ne le retire PLUS des
     sorties : l'app comptait les loyers et les salaires même non payés, mais
     retirait les factures fournisseurs en attente — prudente d'un côté,
     généreuse de l'autre. Une seule règle désormais : le mois porte tout ce
     qu'il doit, réglé ou non. Un bon de livraison en attente est de l'argent
     dû, pas de l'argent gagné. Le chiffre reste affiché à part. */
  const nonReglees = inMonth
    .filter((e) => e.type === "depense" && e.aPayer
                   && (A[e.affaire] || e.affaire === "structure"))
    .reduce((s, e) => s + num(e.montant), 0);

  /* Ce qu'il reste à couvrir : on retire tout ce qui est déjà réglé ce mois-ci. */
  /* Une charge fixe (loyer, salaire, traite, facture récurrente) est considérée
     PAYÉE à son échéance : on ne signale que l'exception. Avant, tout restait
     « à payer » tant qu'on ne l'avait pas coché — un total gonflé de ce qui
     était déjà réglé, qui repartait de zéro chaque mois. Une case décochée
     (entrée « impaye ») ou un report remet la charge à payer. */
  const regleExplicite = new Set(inMonth.filter((e) => e.type === "paye").map((e) => e.ref));
  const impayes = new Set(inMonth.filter((e) => e.type === "impaye").map((e) => e.ref));
  const [anR, moR] = ym.split("-").map(Number);
  const aujR = new Date();
  const rangR = anR * 12 + moR, rangAujR = aujR.getFullYear() * 12 + aujR.getMonth() + 1;
  /* Une charge du mois en cours n'est payée que si quelqu'un l'a cochée : la
     date ne fait que la passer « en retard ». Les mois passés, clos, restent
     considérés réglés (ils n'avaient pas toujours de pointage). */
  const coupureR = rangR < rangAujR ? 99 : 0;
  const joursMoisR = new Date(anR, moR, 0).getDate();
  const jourDeR = {};
  [...config.fixes, ...config.structures, ...config.foyer.fixes].forEach((x) => {
    jourDeR[x.id] = Math.min(num(x.jour) || 5, joursMoisR); });
  (config.foyer.remunerations || []).forEach((r) => {
    jourDeR[r.id] = Math.min(num(r.jour) || 30, joursMoisR); });
  (config.societes || []).forEach((so) => { jourDeR["cnss:" + so.id] = Math.min(25, joursMoisR); });
  const regle = new Set(regleExplicite);
  Object.keys(jourDeR).forEach((id) => {
    if (!impayes.has(id) && jourDeR[id] <= coupureR) regle.add(id);
  });
  const reportes = reportesRef;

  /* Les factures variables pas encore arrivées ce mois-ci */
  const facturesAttendues = [
    ...config.fixes.filter(estEstime).map((f) => ({ id: f.id, lbl: f.lbl, jour: f.jour,
                                  groupe: f.affaire === "partage" ? "labo" : f.affaire })),
    ...config.structures.filter(estEstime).map((x) => ({ id: x.id, lbl: x.lbl, jour: x.jour, groupe: "societe" })),
    ...config.foyer.fixes.filter(estEstime).map((x) => ({ id: x.id, lbl: x.lbl, jour: x.jour, groupe: "foyer" })),
  ];

  /* Le catalogue de tout ce qui peut être dû, rangé par propriétaire */
  const base = [
    /* La prime fait partie du salaire du mois : elle pèse dans le résultat,
       elle doit donc peser aussi dans ce qu'il reste à sortir de la caisse. */
    ...config.fixes.map((f) => ({ id: f.id, lbl: f.lbl,
                                  montant: Math.max(0, duLigne(f)
                                    + (f.sal ? primeDe(f.id) - avanceDe(f.id) : 0)),
                                  base: duLigne(f),
                                  variable: !!f.variable, estime: estEstime(f),
                                  groupe: f.affaire === "partage" ? "labo" : f.affaire })),
    ...config.structures.map((s) => ({ id: s.id, lbl: s.lbl, montant: duLigne(s),
                                       variable: !!s.variable, estime: estEstime(s),
                                       groupe: "societe" })),
    ...config.foyer.fixes.map((f) => ({ id: f.id, lbl: f.lbl,
                                        montant: duLigne(f),
                                        variable: !!f.variable, estime: estEstime(f),
                                        groupe: "foyer" })),
    ...remus.map((r) => ({ id: r.id, lbl: "Rémunération — " + r.nom,
                           montant: num(r.montant), groupe: "foyer" })),
    ...(config.societes || []).filter((s) => cnssSoc[s.id] > 0)
      .map((s) => ({ id: "cnss:" + s.id, lbl: "CNSS — " + s.nom,
                     montant: cnssSoc[s.id], groupe: "societe" })),
    /* La solidarité manquait ici : le tableau de bord et l'échéancier affichaient
       deux « reste à décaisser » différents, à l'écart de son montant. */
    ...(soliReste > 0 ? [{ id: "solidarite", lbl: "Solidarité",
                           montant: soliReste, groupe: "contenu" }] : []),
  ].filter((l) => !l.estime);

  /* Un report n'est pas une chaîne d'un mois au suivant : c'est une DETTE qui
     court jusqu'à ce qu'elle soit payée. L'ancienne version ne regardait que
     le mois précédent — un mois d'inattention et un loyer entier disparaissait
     pour de bon ; et deux mois de retard se repliaient sur une seule ligne.
     On compte donc, sur tous les mois passés : combien de fois la charge du
     mois a été repoussée, moins combien de fois un retard a été soldé.
     Repousser un retard déjà existant (ref « retard:x ») ne crée pas une
     nouvelle dette : c'est la même, portée plus loin. */
  const moisDe = (e) => (e.date || "").slice(0, 7);
  const ardoise = {};
  const premierReport = {};
  entries.filter((e) => e.type === "reporte" && moisDe(e) < ym).forEach((e) => {
    const r = String(e.ref);
    if (r.startsWith("retard:")) return;
    ardoise[r] = (ardoise[r] || 0) + 1;
    if (!premierReport[r] || moisDe(e) < premierReport[r]) premierReport[r] = moisDe(e);
  });
  entries.filter((e) => e.type === "paye" && moisDe(e) < ym
                        && String(e.ref).startsWith("retard:")).forEach((e) => {
    const r = String(e.ref).slice(7);
    ardoise[r] = (ardoise[r] || 0) - 1;
  });

  const retards = Object.entries(ardoise).map(([rid, n]) => {
    if (n <= 0) return null;
    const b = base.find((x) => x.id === rid);
    if (!b) return null;
    const depuis = premierReport[rid] || shiftMonth(ym, -1);
    const unitaire = b.base !== undefined ? b.base : b.montant;
    /* Une prime appartient au mois où elle est versée : le retard ne la traîne pas. */
    return { id: "retard:" + rid,
             lbl: b.lbl + " — en retard depuis " + monthLabel(depuis)
                  + (n > 1 ? " (" + n + " mois)" : ""),
             montant: unitaire * n, retard: true, groupe: b.groupe };
  }).filter(Boolean);

  const lignesAPayer = [...retards, ...base]
    .map((l) => ({ ...l, paye: regle.has(l.id), reporte: reportes.has(l.id) }))
    .filter((l) => !l.reporte);

  const metaGroupes = [
    ...keys.map((k) => ({ id: k, nom: config.affaires[k].nom,
                          couleur: teinte(config.affaires[k]), logo: k })),
    { id: "labo",    nom: "Labo partagé",     couleur: "#697E40" },
    { id: "societe", nom: "Structure",        couleur: "#8A9578" },
    { id: "foyer",   nom: "La maison",        couleur: "#E0968A", logo: "foyer" },
    { id: "solidarite", nom: "Solidarité",    couleur: "#C2A878" },
  ];

  const groupes = metaGroupes.map((g) => {
    const lignes = lignesAPayer.filter((l) => l.groupe === g.id);
    return { ...g, lignes,
             total: lignes.reduce((s, l) => s + l.montant, 0),
             reste: lignes.filter((l) => !l.paye).reduce((s, l) => s + l.montant, 0) };
  }).filter((g) => g.lignes.length > 0);

  const enRetard = lignesAPayer.filter((l) => l.retard && !l.paye)
                               .reduce((s, l) => s + l.montant, 0);
  const reporteVers = base.filter((b) => reportes.has(b.id))
                          .reduce((s, b) => s + b.montant, 0);

  /* Ce qui a été repoussé hors de ce mois. Construit à partir de `base` et non
     d'une liste écrite à la main : la CNSS et la solidarité n'y figuraient pas,
     donc les reporter ne changeait rien aux sorties — et la ligne ne revenait
     jamais le mois suivant. */
  const reporteMontant = base.filter((x) => reportesRef.has(x.id))
                             .reduce((s, x) => s + num(x.montant), 0);

  /* Ce qui sort vraiment de la caisse ce mois-ci. Les retards des mois passés
     en font partie : ils avaient été retirés du mois où on les a repoussés,
     sans jamais revenir nulle part — de la trésorerie fantôme, des deux côtés. */
  const sorties = keys.reduce((s, k) =>
      s + A[k].matiereReelle + A[k].variableReelle + A[k].fixes + A[k].partage + A[k].cnss, 0)
    + structure + enveloppe + solidarite + avPerso + invests
    - reporteMontant + enRetard
    + reserveDepotsMoisTotal - reserveRetraitsMoisTotal + chantiersMois
    + pretsSortieMois - pretsEntreeMois;
  const tresorerie = encaisse - sorties;

  /* Le détail, ligne par ligne, de ce que le mois coûte. La somme de ces lignes
     fait exactement `sorties` : c'est fait pour être vérifié à la main, pas pour
     être cru sur parole. */
  const detailSorties = [
    ["Achats et matière",                keys.reduce((s, k) => s + A[k].matiereReelle, 0)],
    ["Commissions et charges variables", keys.reduce((s, k) => s + A[k].variableReelle, 0)],
    ["Charges fixes des activités",      keys.reduce((s, k) => s + A[k].fixes + A[k].partage, 0)],
    ["CNSS",                             keys.reduce((s, k) => s + A[k].cnss, 0)],
    ["Structure (société)",   structure],
    ["La maison et vos rémunérations",   enveloppe],
    ["Solidarité",                       solidarite],
    ["Investissements",                  invests],
    ["Prélèvements exceptionnels",       avPerso],
    /* Un retrait de réserve est de l'argent qui revient : l'appeler « mis en
       réserve − 4 805 DH » se lisait à l'envers. */
    [reserveDepotsMoisTotal - reserveRetraitsMoisTotal < 0
       ? "Repris dans la réserve" : "Mis en réserve",
                                         reserveDepotsMoisTotal - reserveRetraitsMoisTotal],
    ["Mis de côté pour un chantier",     chantiersMois],
    ["Retards des mois passés",          enRetard],
    ["Reporté sur le mois suivant",     -reporteMontant],
  ].filter(([, v]) => Math.abs(v) >= 1);

  /* Le chiffre simple du mois : ce qui est rentré moins TOUTES les charges du
     mois, payées ou non. Il ne dépend donc d'aucune case cochée, et il ne mêle
     ni réserve, ni chantier, ni prêt — ce n'est ni du gain ni de la perte. */
  const reserveNetMois = reserveDepotsMoisTotal - reserveRetraitsMoisTotal;
  const sortiesPures = sorties - reserveNetMois + reserveRetraitsMoisTotal - chantiersMois - pretsSortieMois + pretsEntreeMois;
  const resteMois = encaisse - sortiesPures;
  const detailSimple = [
    ...detailSorties.filter(([lbl]) => !/réserve|chantier/i.test(lbl)),
    ["Dépensé en piochant dans la réserve", reserveRetraitsMoisTotal],
  ].filter(([, v]) => Math.abs(v) >= 1);

  /* Un emprunt reçu n'est pas un coût en moins : c'est de l'argent qui entre.
     Il était noyé dans les sorties, ce qui faisait paraître le mois 50 000 DH
     moins cher qu'il ne l'est. On le sort du coût et on le montre pour ce
     qu'il est — sans changer d'un dirham ce qu'il reste à la fin. */
  const empruntNet = pretsEntreeMois - pretsSortieMois;
  const coutDuMois = sorties + empruntNet;

  /* ------------------------------------------------------------------ */
  /*  CE QUI EST ORDINAIRE, CE QUI EST EXCEPTIONNEL                       */
  /* ------------------------------------------------------------------ */
  /* Amal : « ce qui est normal et ce qui est exceptionnel sont dans le même
     sac ». 7 600 DH de plomberie pesaient comme un loyer, donc elle ne savait
     pas ce que coûte un mois ordinaire — donc pas non plus ce qu'elle doit
     vendre pour vivre. On sépare : est exceptionnel ce qu'elle a coché comme
     tel, plus ce qui l'est par nature (matériel, chantier, frais de structure
     ponctuels). Tout le reste est la vie normale de l'affaire. */
  const achatsExceptionnels = inMonth
    .filter((e) => e.type === "depense" && e.exceptionnel)
    .reduce((s, e) => s + num(e.montant), 0);
  const lignesExceptionnelles = [
    ...inMonth.filter((e) => e.type === "depense" && e.exceptionnel)
              .map((e) => ({ lbl: e.lbl || "Achat", montant: num(e.montant),
                             date: e.date, affaire: e.affaire })),
    ...inMonth.filter((e) => e.type === "invest")
              .map((e) => ({ lbl: e.lbl || "Investissement", montant: num(e.montant),
                             date: e.date, affaire: e.affaire })),
  ].sort((a, b) => b.montant - a.montant);
  const exceptionnelMois = achatsExceptionnels + invests + structExtra;

  /* Ce que le mois doit porter, payé ou non (les reports sont déjà exclus).
     Les frais de structure ponctuels — un acompte d'impôts, une facture du
     comptable — sortent de la caisse mais n'étaient dans aucun catalogue :
     le seuil de rentabilité ne les voyait pas passer. */
  const chargesDuMois = lignesAPayer.reduce((s, l) => s + l.montant, 0) + structExtra;
  /* Ce qui doit encore sortir de la caisse */
  const aCouvrir = lignesAPayer.filter((l) => !l.paye).reduce((s, l) => s + l.montant, 0);
  const dejaRegle = lignesAPayer.filter((l) => l.paye).reduce((s, l) => s + l.montant, 0);

  /* Quand l'argent est vraiment sorti, pour chaque charge pointée. Les pointages
     d'avant cette distinction n'ont pas de `regleLe` : on les rattache au mois
     de la charge, comme avant, jusqu'à ce qu'elle les corrige. */
  const quandRegle = {}, pocheRegle = {};
  inMonth.filter((e) => e.type === "paye").forEach((e) => {
    quandRegle[e.ref] = e.regleLe || e.date || (ym + "-01");
    pocheRegle[e.ref] = e.poche || "";
  });
  const lignesReglees = lignesAPayer.filter((l) => l.paye).map((l) => {
    const quand = quandRegle[l.id] || (ym + "-01");
    return { ...l, quand, poche: pocheRegle[l.id] || "", horsMois: quand.slice(0, 7) !== ym };
  });
  /* Ce qui est sorti de la caisse CE mois-ci : une charge de septembre payée fin
     août ne pèse pas sur septembre, même si elle solde bien une ligne de septembre. */
  const dejaRegleCaisse = lignesReglees.filter((l) => !l.horsMois)
                                       .reduce((s, l) => s + l.montant, 0);
  const regleAvant = dejaRegle - dejaRegleCaisse;

  /* Ce que tu dois encore à tes fournisseurs, tous mois confondus */
  const dettes = entries.filter((e) => e.type === "depense" && e.aPayer)
                        .reduce((s, e) => s + num(e.montant), 0);

  /* Amal veut trois chiffres et rien d'autre : ce qu'elle a fait rentrer, ce
     qu'elle a RÉELLEMENT payé, ce qu'il lui reste à payer. Tous les trois du
     même temps, tous les trois de l'argent qui a bougé ou qui va bouger — pas
     de projection, pas d'engagement théorique. */
  const achatsAcquittes = inMonth
    .filter((e) => e.type === "depense" && !e.aPayer
                   && (A[e.affaire] || e.affaire === "structure"))
    .reduce((s, e) => s + num(e.montant), 0);
  /* Sorti pour de bon : les achats réglés, les échéances pointées, la
     solidarité versée, les prélèvements, les avances données, le matériel
     acheté et les prêts consentis. */
  const dejaPaye = achatsAcquittes + dejaRegleCaisse + soliVerse + avPerso + avSalaire
                 + invests + pretsSortieMois;
  /* Ce qui doit encore quitter la caisse, tous mois confondus. */
  const resteAPayer = aCouvrir + dettes;

  /* Marge réelle de chaque affaire : ce qui reste après marchandise et commissions */
  const marges = {};
  keys.forEach((k) => {
    /* Emballages, coursier, blanchisserie : ils sortent avant que la marge
       serve à payer un loyer. Les oublier abaisse le seuil pour rien. */
    if (A[k].ca > 0) marges[k] = Math.max(.1,
        (A[k].ca - A[k].matiere - A[k].com - A[k].variable) / A[k].ca);
    else {
      const H = HEB(config, k);
      marges[k] = Math.max(.1, 1 - (config.affaires[k].matierePct || 0) / 100
                                 - (H ? num(H.comAirbnb) / 100 : 0));
    }
  });
  const poids = keys.filter((k) => A[k].ca > 0);
  const margeMoy = poids.length
    ? poids.reduce((s, k) => s + marges[k] * A[k].ca, 0) / caTotalBrut(keys, A)
    : keys.reduce((s, k) => s + marges[k], 0) / keys.length;
  /* --- Les voyants : les dépenses restent-elles cohérentes avec les ventes ? --- */
  const jour = new Date().getDate();
  const moisEnCours = ym === new Date().toISOString().slice(0, 7);
  const JOURS_AVANT_DE_JUGER = 8;

  const voyants = keys.map((k) => {
    const a = A[k], c = config.affaires[k];
    if (c.archive) return null;

    /* Un hébergement ne se juge pas en pourcentage : il se juge en nuitées. */
    if (c.type === "hebergement") {
      const st = hebStats[k] || { nuits: 0 };
      /* Blanchisserie, produits d'accueil, courses : ces dépenses tombent que le
         mois soit rempli ou non. Elles pèsent donc avec les charges fixes, et
         non sur les deux ou trois nuitées déjà vendues. */
      const depMois = inMonth.filter((e) => e.type === "depense" && e.affaire === k
                                       && e.categorie !== "matiere")
                             .reduce((s, e) => s + num(e.montant), 0);
      const fixesTotal = a.fixes + a.partage + a.cnss + depMois;
      const duMois = inMonth.filter((e) => e.type === "resa"
                       && ((e.affaire && A[e.affaire]) ? e.affaire : defautHeb) === k);
      const passees = entries.filter((e) => e.type === "resa" && (e.date || "") < ym
                                       && ((e.affaire && A[e.affaire]) ? e.affaire : defautHeb) === k)
                             .sort((x, y) => (x.date || "").localeCompare(y.date || ""));
      /* Une seule définition de la marge : ce que rapporte réellement une nuitée,
         commission de plateforme et coût des extras déduits. */
      const marge = margeNuitees(duMois.length ? duMois : passees.slice(-40));
      if (!marge || marge <= 0) return { k, type: "nuits", etat: "neutre", nuits: st.nuits };
      const requis = Math.ceil(fixesTotal / marge);
      /* Un logement entier ne vend pas plus de nuitées qu'il n'y a de jours. */
      const capacite = new Date(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)), 0).getDate()
                     * Math.max(1, num(c.logements || 1));
      return { k, type: "nuits", etat: st.nuits >= requis ? "vert" : "attente",
               nuits: st.nuits, requis, reste: Math.max(0, requis - st.nuits),
               capacite, horsCapacite: requis > capacite,
               marge, estimee: !duMois.length };
    }

    /* Les affaires de restauration se jugent sur deux ratios. */
    const seuils = (config.seuils || {})[k];
    if (!seuils) return null;
    /* Sans vente encore saisie, l'activité reste visible mais muette :
       une carte qui n'affiche qu'une affaire sur cinq paraît cassée. */
    if (a.ca <= 0) return { k, type: "ratio", etat: "attente", sansVente: true,
                            depense: a.matiereReelle + a.variable + a.com, seuils };
    const reel = a.matiereReelle + a.variable + a.com;
    const rMat = (a.matiereReelle / a.ca) * 100;
    const rVar = (reel / a.ca) * 100;

    /* Trop tôt dans le mois : un gros achat le 3 n'a pas de ventes en face. */
    if (moisEnCours && jour < JOURS_AVANT_DE_JUGER)
      return { k, type: "ratio", etat: "attente", rMat, rVar, seuils,
               depense: reel, jours: JOURS_AVANT_DE_JUGER - jour };

    const note = (r, s) => (r <= s ? "vert" : r <= s * 1.15 ? "orange" : "rouge");
    const eMat = a.matiereReelle > 0 ? note(rMat, seuils.matiere) : "neutre";
    const eVar = note(rVar, seuils.variable);

    /* Un manque au fond de caisse pèse aussi sur le voyant de l'activité —
       seulement s'il a été vérifié et qu'il en manque, jamais s'il y en a trop. */
    const ecartFonds = a.ecartFonds || 0;
    const seuilFonds = config.seuilFondCaisse || { orange: 50, rouge: 100 };
    const eFonds = ecartFonds >= seuilFonds.rouge ? "rouge"
                 : ecartFonds >= seuilFonds.orange ? "orange" : "vert";

    const pire = [eMat, eVar, eFonds].includes("rouge") ? "rouge"
               : [eMat, eVar, eFonds].includes("orange") ? "orange" : "vert";
    return { k, type: "ratio", etat: pire, eMat, eVar, eFonds, rMat, rVar,
             ecartFonds, seuilFonds, seuils, depense: reel };
  }).filter(Boolean);

  const seuil = chargesDuMois / margeMoy;
  const avancement = seuil > 0 ? Math.min(100, (caTotal / seuil) * 100) : 0;
  /* Le mois ordinaire : les charges qui reviennent tous les mois, sans les
     coups de chaud. C'est CE chiffre qui dit ce qu'il faut vendre pour vivre. */
  /* « Ce qu'il faut vendre pour un mois normal » : ni les frais exceptionnels
     de structure, ni les dettes des mois passés. Un loyer reporté trois fois
     quadruplait le seuil et rendait le chiffre illisible. */
  const chargesOrdinaires = chargesDuMois - structExtra - enRetard;
  const seuilOrdinaire = margeMoy > 0 ? chargesOrdinaires / margeMoy : 0;

  const [an, mo] = ym.split("-").map(Number);
  const joursMois = new Date(an, mo, 0).getDate();
  const joursDuMois = joursMois;
  const auj = new Date();
  const jourActuel = (auj.getFullYear() === an && auj.getMonth() + 1 === mo)
    ? auj.getDate() : joursMois;
  const joursRestants = Math.max(0, joursMois - jourActuel);

  /* La paie : par salarié, son net, ses avances, ce qui reste à lui verser */
  const avancesSal = inMonth.filter((e) => e.type === "avance" && e.nature === "salaire");
  const paie = config.fixes.filter((f) => f.sal).map((f) => {
    const pris = avancesSal.filter((e) => e.ref === f.id)
                           .reduce((s, e) => s + num(e.montant), 0);
    const prime = primesDuMois.filter((e) => e.ref === f.id)
                              .reduce((s, e) => s + num(e.montant), 0);
    return { id: f.id, nom: f.lbl, net: num(f.montant), avances: pris, prime,
             societe: socDe(config, f),
             affaire: f.affaire === "partage" ? "labo" : f.affaire,
             partage: f.affaire === "partage",
             reste: num(f.montant) + prime - pris, paye: regle.has(f.id) };
  });
  const paieTotal = paie.reduce((s, p) => s + p.net, 0);
  const paieAvances = paie.reduce((s, p) => s + p.avances, 0);
  const paieReste = paie.filter((p) => !p.paye).reduce((s, p) => s + p.reste, 0);

  /* Les échéances des 30 prochains jours */
  const echeances = [];
  const ajoute = (ref, lbl, montant, jour, groupe) => {
    if (montant <= 0 || reportes.has(ref)) return;
    const j = Math.min(num(jour) || 5, joursMois);
    const paye = regle.has(ref);
    /* Un mois à venir n'a rien de dépassé : préparer octobre affichait tous
       les loyers et les salaires en rouge, et le tableau de bord annonçait
       « 7 échéances sont passées sans être pointées ». */
    const passe = ym <= thisMonth();
    const b = base.find((x) => x.id === ref);
    echeances.push({ ref, lbl, montant, jour: j, groupe, paye,
                     variable: !!(b && b.variable), estime: !!(b && b.estime),
                     enRetard: passe && !paye && j < jourActuel });
  };
  /* les retards du mois précédent s'affichent en tête */
  retards.forEach((r) => ajoute(r.id, r.lbl, r.montant, 1, r.groupe));
  config.fixes.forEach((f) => ajoute(f.id, f.lbl,
        Math.max(0, duLigne(f) + (f.sal ? primeDe(f.id) - avanceDe(f.id) : 0)), f.jour,
        f.affaire === "partage" ? "labo" : f.affaire));
  config.structures.forEach((s) => ajoute(s.id, s.lbl, duLigne(s), s.jour, "societe"));
  config.foyer.fixes.forEach((f) => ajoute(f.id, f.lbl, duLigne(f), f.jour, "foyer"));
  /* Ce qui reste à donner, pas la totalité prévue : sinon l'échéancier réclame
     encore 10 000 DH le lendemain du jour où elle en a versé 1 000. */
  if (soliReste > 0) ajoute("solidarite", "Solidarité", soliReste,
                            num((config.solidarite || {}).jour) || 1, "contenu");
  remus.forEach((r) => ajoute(r.id, "Rémunération — " + r.nom, num(r.montant), r.jour, "foyer"));
  (config.societes || []).filter((s) => cnssSoc[s.id] > 0)
    .forEach((s) => ajoute("cnss:" + s.id, "CNSS — " + s.nom, cnssSoc[s.id], 25, "societe"));
  echeances.sort((a, b) => a.jour - b.jour);
  const resteAPayerMois = echeances.filter((e) => !e.paye).reduce((s, e) => s + e.montant, 0);

  const foyerFixes = totalFixesFoyer;
  const poche = salaires;

  /* Ce qui a réellement été dépensé sur l'argent disponible */
  const depensesPerso = inMonth
    .filter((e) => e.type === "perso" || (e.type === "avance" && e.nature === "perso"))
    .reduce((s, e) => s + num(e.montant), 0);

  /* Le second logement, par nature temporaire */
  const doubleLog = config.foyer.fixes.filter((f) => f.transitoire)
                                      .reduce((s, f) => s + num(f.montant), 0);

  /* ---------------------------------------------------------------- */
  /*  LES POCHES : combien il y a, et où                                */
  /* ---------------------------------------------------------------- */
  /* Un solde de caisse est un stock, pas un flux : il se compte depuis le
     début, pas sur le mois affiché. On repart donc de TOUTES les écritures.
     Et dès qu'Amal a compté une caisse pour de vrai, c'est ce comptage qui
     fait foi : on repart de lui et on n'applique que ce qui a bougé après. */
  /* Combien sort vraiment de la poche quand une échéance est pointée.
     Les pointages récents portent leur montant ; ce calcul ne sert qu'aux
     anciens, saisis avant que le montant ne soit enregistré. */
  /* Combien de mois de retard une charge portait à une date donnée. Compter
     avec l'ardoise du mois AFFICHÉ ferait varier un règlement déjà passé selon
     l'écran ouvert — or un solde de caisse est un stock, pas une vue. */
  const moisDeRetardAu = (id, mois) => {
    const avant = (e) => moisDe(e) < (mois || ym);
    const n = entries.filter((e) => e.type === "reporte" && e.ref === id && avant(e)).length
            - entries.filter((e) => e.type === "paye" && e.ref === "retard:" + id
                                    && avant(e)).length;
    return Math.max(1, n);
  };
  /* Prime, avance et solidarité du mois OÙ L'ARGENT EST SORTI — pas du mois
     qu'on regarde. Sans ça, un salaire payé en mars changeait de montant dès
     qu'on ouvrait avril. */
  const duMoisLa = (m) => entries.filter((e) => (e.date || "").slice(0, 7) === m);
  const primeAu = (id, m) => duMoisLa(m)
    .filter((e) => e.type === "prime" && e.ref === id)
    .reduce((s2, e) => s2 + num(e.montant), 0);
  const avanceAu = (id, m) => duMoisLa(m)
    .filter((e) => e.type === "avance" && e.nature === "salaire" && e.ref === id)
    .reduce((s2, e) => s2 + num(e.montant), 0);
  const soliResteAu = (m) => Math.max(0, soliFixe - duMoisLa(m)
    .filter((e) => e.type === "solidarite")
    .reduce((s2, e) => s2 + num(e.montant), 0));
  const montantDeRef = (ref, quand) => {
    const brut = String(ref);
    const enRetard = brut.startsWith("retard:");
    const id = brut.replace(/^retard:/, "");
    const t = [...config.fixes, ...config.structures, ...config.foyer.fixes,
               ...(config.foyer.remunerations || [])].find((x) => x.id === id);
    if (t) {
      const mois = (quand || "").slice(0, 7) || ym;
      /* Un retard de trois mois sort trois mois de la banque, pas un seul. */
      if (enRetard) return duLigneAu(t, mois) * moisDeRetardAu(id, mois);
      /* Une avance déjà versée ne ressort pas une seconde fois ; une prime, si. */
      return Math.max(0, duLigneAu(t, mois)
        + (t.sal ? primeAu(t.id, mois) - avanceAu(t.id, mois) : 0));
    }
    /* La solidarité déjà versée en partie ne sort que pour son reste. */
    if (id === "solidarite") return soliResteAu((quand || "").slice(0, 7) || ym);
    if (id.startsWith("cnss:")) return cnssSoc[id.slice(5)] || 0;
    return 0;
  };
  const mouvements = [];
  const bouge = (poche, montant, date, lbl) => {
    if (!poche || !montant) return;
    mouvements.push({ poche, montant, date: date || "", lbl });
  };
  entries.forEach((e) => {
    const d = e.date || "";
    const caisse = e.affaire ? caisseDe(config, e.affaire) : null;
    switch (e.type) {
      case "vente":
        /* La part espèces reste dans le tiroir, la part carte part en banque. */
        bouge(caisse, num(e.espece), d, "Recette en espèces");
        bouge(pocheCartes(config), num(e.carte), d, "Recette par carte");
        break;
      case "resa":
        if (!e.aRecevoir)
          bouge(e.source === "direct" ? banqueCartes(config) : banqueAirbnb(config),
                num(e.montant), d, "Séjour");
        break;
      case "repas":
        bouge(e.poche || caisse, num(e.montant), d, "Repas guests");
        break;
      case "depense":
        if (!e.aPayer) bouge(e.poche || pocheSortieParDefaut(config, e),
                             -num(e.montant), e.regleLe || d, e.lbl || "Achat");
        break;
      case "invest":
        bouge(e.poche || pocheSortieParDefaut(config, e), -num(e.montant), d, e.lbl || "Investissement");
        break;
      case "paye":
        bouge(e.poche || banqueCartes(config),
              -(e.montant !== undefined ? num(e.montant) : montantDeRef(e.ref, d)),
              e.regleLe || d, "Échéance réglée");
        break;
      case "solidarite":
        bouge(e.poche || banqueCartes(config), -num(e.montant), d, "Solidarité");
        break;
      case "avance": case "perso":
        bouge(e.poche || pocheSortieParDefaut(config, e), -num(e.montant), d, "Avance");
        break;
      case "pret-perso":
        bouge(e.poche || banqueCartes(config),
              (e.sens === "emprunte" ? 1 : -1) * num(e.montant), d,
              e.sens === "emprunte" ? "Emprunt reçu" : "Prêt consenti");
        break;
      case "remboursement-pret":
        bouge(e.poche || banqueCartes(config),
              (pretsIdParSens[e.ref] === "prete" ? 1 : -1) * num(e.montant), d, "Remboursement");
        break;
      case "reserve":
        /* Mettre de côté vide le tiroir, reprendre le remplit. */
        bouge(e.poche || caisse, (e.sens === "retrait" ? 1 : -1) * num(e.montant), d, "Réserve");
        break;
      case "chantier":
        /* Amal : « l'argent sort vraiment des enveloppes en cash, avant même
           d'être déposé à la banque ». Ce n'est donc pas une promesse : le
           tiroir se vide pour de bon. */
        bouge(e.poche || caisseDe(config, null), -num(e.montant), d,
              "Mis de côté pour un chantier");
        break;
      case "napsTc":
        /* Un virement Naps arrivé : le CB du jour quitte « Naps en attente »,
           le net arrive sur Le Mi-Chui ; la différence est la commission. */
        if (napsVerse(e)) {
          bouge(pocheCartes(config), -num(e.ventes), d, "Virement Naps");
          bouge(banqueCartes(config), num(e.verse), d, "Virement Naps");
        }
        break;
      case "transfert":
        bouge(e.de, -num(e.montant), d, "Transfert");
        bouge(e.vers, num(e.montant), d, "Transfert");
        break;
      default: break;
    }
  });
  /* Amal : « ça risque de cacher un manque, ou du vol ». Exactement — et c'est
     pourquoi un comptage ne DOIT PAS effacer l'écart qu'il révèle. Le solde se
     réaligne sur le réel, mais le trou est enregistré, gardé et cumulé. Un
     tiroir qui perd 500 DH par mois doit le crier au bout de six mois, pas
     avaler la différence à chaque fois. */
  const comptages = entries.filter((e) => e.type === "comptage");
  const ecartDe = (c) => num(c.montant) - num(c.theorique);
  const poches = lesPoches(config).map((p) => {
    const miens = comptages.filter((c) => c.poche === p.id)
                           .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    /* Le tout premier comptage sert à caler la poche, pas à dénoncer un trou :
       avant lui l'appli ne savait rien, son « théorique » ne voulait rien dire. */
    const reels = miens.slice(1);
    const dernier = miens[miens.length - 1] || null;
    const depuis = dernier ? (dernier.date || "") : "";
    const base = dernier ? num(dernier.montant) : num(p.depart);
    /* Un comptage fait AVANT l'activité du jour laisse passer les mouvements
       du jour même ; fait après, il les a déjà dans le tiroir. */
    const apres = mouvements.filter((m) => m.poche === p.id
      && (dernier && dernier.avant ? m.date >= depuis : m.date > depuis));
    const solde = base + apres.reduce((s, m) => s + m.montant, 0);
    return { ...p, solde, dernierComptage: dernier, cale: miens.length > 0,
             ecart: miens.length > 1 ? ecartDe(dernier) : null,
             ecarts: reels.filter((c) => Math.abs(ecartDe(c)) >= 1),
             ecartCumul: reels.reduce((s, c) => s + ecartDe(c), 0),
             ecartMois: reels.filter((c) => (c.date || "").startsWith(ym))
                             .reduce((s, c) => s + ecartDe(c), 0),
             mouvements: mouvements.filter((m) => m.poche === p.id) };
  });
  const especes = poches.filter((p) => p.type === "caisse").reduce((s, p) => s + p.solde, 0);
  const enBanque = poches.filter((p) => p.type === "banque").reduce((s, p) => s + p.solde, 0);
  const enRoute = poches.filter((p) => p.type === "transit").reduce((s, p) => s + p.solde, 0);
  const ecartCumul = poches.reduce((s, p) => s + p.ecartCumul, 0);
  const ecartMois = poches.reduce((s, p) => s + p.ecartMois, 0);
  const ecartsTous = poches.flatMap((p) => p.ecarts.map((c) => ({ ...c, poche: p.id, nomPoche: p.nom })))
                           .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  /* ------------------------------------------------------------------ */
  /*  CE QU'ELLE DOIT, EN TOUT — pas seulement ce mois-ci                 */
  /* ------------------------------------------------------------------ */
  /* Amal : « tu ne vois jamais ce que tu dois au total ». LIFE montrait le
     mois ; on peut très bien faire un bon mois et s'enfoncer. Une traite porte
     un capital qui court encore : il suffit de dire jusqu'à quel mois elle
     tombe, et l'appli compte les échéances qui restent — toute seule, tous les
     mois, sans rien retoucher. */
  const moisEntre = (a, b) => {
    if (!a || !b) return 0;
    const [ya, ma] = a.split("-").map(Number);
    const [yb, mb] = b.split("-").map(Number);
    return (yb - ya) * 12 + (mb - ma);
  };
  const credits = [...config.fixes, ...config.structures, ...config.foyer.fixes]
    .filter((f) => f.fin && moisEntre(ym, f.fin) >= 0)
    .map((f) => {
      const restant = moisEntre(ym, f.fin) + 1;
      return { id: f.id, lbl: f.lbl, mensualite: num(f.montant), fin: f.fin,
               echeances: restant, capital: num(f.montant) * restant };
    })
    .sort((a, b) => b.capital - a.capital);
  const capitalCredits = credits.reduce((s, c) => s + c.capital, 0);
  const empruntsOuverts = pretsPersoOuverts.filter((p) => p.sens === "emprunte");
  const empruntsDus = empruntsOuverts.reduce((s, p) => s + p.solde, 0);
  const prêtsARecevoir = pretsPersoOuverts.filter((p) => p.sens === "prete")
                                          .reduce((s, p) => s + p.solde, 0);
  /* Exigible tout de suite contre engagé sur la durée : ce n'est pas la même
     inquiétude, et les mélanger est exactement ce qui embrouille. */
  const duMaintenant = aCouvrir + dettes;
  const duPlusTard = empruntsDus + capitalCredits;
  const duTotal = duMaintenant + duPlusTard;

  /* Une écriture qui pointe une activité supprimée ne compte dans aucun
     résultat — mais son argent a bien bougé. Une prime dont le salarié a été
     retiré ne compte nulle part non plus. On ne devine pas où les mettre :
     on les compte et on les affiche, pour qu'Amal décide. */
  const typesImputes = ["vente", "depense", "invest", "reserve"];
  const orphelinesLignes = inMonth.filter((e) => typesImputes.includes(e.type)
    && e.affaire && e.affaire !== "structure" && e.affaire !== "foyer" && !A[e.affaire]);
  const primesOrphelines = primesDuMois
    .filter((e) => !config.fixes.some((f) => f.id === e.ref))
    .reduce((t, e) => t + num(e.montant), 0);
  /* Une charge fixe peut elle aussi pointer une activité disparue : elle
     continue d'être réclamée dans l'échéancier sans peser sur aucun résultat. */
  const fixesOrphelines = config.fixes
    .filter((f) => f.affaire && f.affaire !== "partage" && !A[f.affaire]);
  const orphelines = {
    n: orphelinesLignes.length,
    total: orphelinesLignes.reduce((t, e) => t + num(e.montant), 0),
    affaires: [...new Set([...orphelinesLignes.map((e) => e.affaire),
                           ...fixesOrphelines.map((f) => f.affaire)])],
    primes: primesOrphelines,
    fixes: fixesOrphelines.reduce((t, f) => t + duLigne(f), 0),
    fixesLbl: fixesOrphelines.map((f) => f.lbl),
    cleIncomplete,
  };

  /* Part de chaque affaire dans le résultat positif du mois */
  const posTotal = keys.reduce((s, k) => s + Math.max(0, A[k].resultat), 0);

  return { A, keys, orphelines, caTotal, resAffaires, structure, structFixe, structExtra,
           enveloppe, solidarite, soliVerse, soliReste, soliPointe, soliCumul, detailSorties, resteMois, sortiesPures, detailSimple,
           coutDuMois, empruntNet, dejaPaye, resteAPayer, achatsAcquittes,
           pretsEntreeMois, pretsSortieMois, resultatNet, encaisse, sorties, tresorerie,
           avances, avSalaire, avPerso, invests, foyerFixes, foyerDepenseMois, poche, cnssTotal,
           partageTotal, posTotal,
           reserveDepotsMoisTotal, reserveRetraitsMoisTotal, avancesInternes, avancesInternesOuvertes,
           pretsPerso, pretsPersoOuverts,
           naps, anDernier, jours7, hautJour, voyants, aCouvrir, chargesDuMois, seuil, avancement, joursMois, joursRestants, lignesAPayer, dejaRegle,
           dejaRegleCaisse, regleAvant, lignesReglees, poches, especes, enBanque, enRoute,
           ecartCumul, ecartMois, ecartsTous,
           exceptionnelMois, lignesExceptionnelles, chargesOrdinaires, seuilOrdinaire,
           credits, capitalCredits, empruntsOuverts, empruntsDus, prêtsARecevoir,
           duMaintenant, duPlusTard, duTotal,
           enRetard, reporteVers, groupes, moisSuivant: shiftMonth(ym, 1),
           marges, margeMoy, paie, paieTotal, paieAvances, paieReste, dettes,
           echeances, resteAPayerMois, jourActuel, cnssSoc, facturesAttendues,
           remus, salaires, depensesPerso, doubleLog, primesTotal,
           heb: Object.fromEntries(Object.entries(hebStats).map(([k, s]) => {
                 const lots = Math.max(1, num((config.affaires[k] || {}).logements || 1));
                 const dispo = joursMois * lots;
                 return [k, { ...s,
                   /* Le prix moyen rapporte le CA encaissé aux nuits VENDUES ;
                      le taux d'occupation, lui, ne compte que les nuits
                      réellement passées dans le mois affiché. */
                   prixMoyen: s.nuitsSejours > 0 ? s.caNuits / s.nuitsSejours : 0,
                   nuitsSejours: s.nuitsSejours || 0,
                   occupation: Math.min(100, (s.nuits / dispo) * 100),
                   dispo, joursMois }];
               })) };
}

function historique(config, entries, ym, filtre) {
  const mois = [];
  for (let i = 11; i >= 0; i--) mois.push(shiftMonth(ym, -i));
  return mois.map((m) => {
    const c = calcul(config, entries, m);
    if (filtre && c.A[filtre])
      return { ym: m, ca: c.A[filtre].ca, resultat: c.A[filtre].resultat, treso: 0 };
    return { ym: m, ca: c.caTotal, resultat: c.resultatNet, treso: c.tresorerie };
  });
}

/* ------------------------------------------------------------------ */
/*  TABLEAU DE BORD                                                    */
/* ------------------------------------------------------------------ */

function Consolide({ M, config, ym, onAller, entries, onRegler, onReporter, onDater, onPocher, onChiffrer,
                     onTransfert, onCompter, onAdd, onDel, onMaj,
                     onSaveConfig, taches, onAddTache, onMajTache, onDelTache }) {
  const [sous, setSous] = useState("resultat");

  const sections = [
    ["resultat",   "Vue d'ensemble"],
    ["chantiers",  "Chantiers"],
    ["echeancier", "Échéancier"],
    ["paie",       "Paie"],
    ["achats",     "Achats"],
    ["journal",    "Journal"],
    ["exercice",   "Exercice"],
  ];

  return (
    <>
      <div className="card" style={{ paddingBottom: 8 }}>
        <Crest k="dash" c={{ nom: "Tableau de bord" }} />
        <div className="sections">
          {sections.map(([id, lbl]) => (
            <button key={id} className={sous === id ? "on" : ""}
                    onClick={() => setSous(id)}>{lbl}</button>
          ))}
        </div>
      </div>

      {sous === "treso"      && <Tresorerie M={M} config={config} entries={entries}
                                            onAdd={onAdd} onDel={onDel} />}
      {sous === "caisse"     && <Poches M={M} config={config} entries={entries}
                                        onTransfert={onTransfert} onCompter={onCompter} onDel={onDel} />}
      {sous === "reserves"   && <ReservesConsolide M={M} config={config} ym={ym} onAdd={onAdd} />}
      {sous === "prets"      && <PretsPersoConsolide M={M} config={config} ym={ym} onAdd={onAdd} />}
      {sous === "chantiers"  && <Chantiers config={config} entries={entries} ym={ym}
                                           onAdd={onAdd} onDel={onDel} />}
      {sous === "resultat"   && <Dashboard M={M} config={config} ym={ym} onAller={onAller}
                                            onRegler={onRegler} entries={entries} onAdd={onAdd} onDel={onDel} onMaj={onMaj}
                                            onSaveConfig={onSaveConfig} onChiffrer={onChiffrer}
                                            taches={taches} onAddTache={onAddTache}
                                            onMajTache={onMajTache} onDelTache={onDelTache} />}
      {sous === "echeancier" && <Avenir M={M} config={config} ym={ym}
                                        onRegler={onRegler} onReporter={onReporter} onDater={onDater} onPocher={onPocher}
                                        onChiffrer={onChiffrer} />}
      {sous === "paie"       && <Paie M={M} config={config} onRegler={onRegler}
                                      onAdd={onAdd} ym={ym} entries={entries} />}
      {sous === "achats"     && <Achats entries={entries} ym={ym} config={config}
                                        onDel={onDel} onMaj={onMaj} />}
      {sous === "journal"    && <Mouvements entries={entries} ym={ym} config={config}
                                            onDel={onDel} onMaj={onMaj} />}
      {sous === "exercice"   && <Historique config={config} entries={entries} ym={ym} />}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  TÂCHES — AFFICHAGE                                                 */
/* ------------------------------------------------------------------ */

/* Des barres horizontales, pas un camembert : ce qui compte n'est pas la part
   de chacune mais son évolution. La barre claire derrière est le même mois
   de l'an dernier — la seule comparaison qui vaille avec ta saisonnalité. */
function BarresCA({ M, config, onAller }) {
  const lignes = M.keys
    .map((k) => ({ k, c: config.affaires[k], ca: M.A[k].ca, avant: (M.anDernier || {})[k] || 0 }))
    .filter((x) => x.ca > 0 || x.avant > 0)
    .sort((a, b) => b.ca - a.ca);
  const haut = Math.max(1, ...lignes.map((x) => Math.max(x.ca, x.avant)));
  const compare = lignes.some((x) => x.avant > 0);

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "baseline", gap: 12, marginBottom: 18 }}>
        <div className="eyebrow">Chiffre d'affaires par activité</div>
        {compare && <span className="mini">barre claire : le même mois l'an dernier</span>}
      </div>

      {lignes.length === 0 ? (
        <div className="empty" style={{ padding: "20px 0" }}>
          Rien de saisi pour l'instant.<br />
          Ouvre <strong>Saisir</strong> et note le chiffre du jour.
        </div>
      ) : lignes.map(({ k, c, ca, avant }) => {
        const ecart = avant > 0 ? ((ca - avant) / avant) * 100 : null;
        return (
          <button key={k} onClick={() => onAller(k)}
                  style={{ display: "block", width: "100%", textAlign: "left", cursor: "pointer",
                           border: "none", background: "none", font: "inherit",
                           padding: "0 0 17px" }}>
            <div style={{ display: "flex", justifyContent: "space-between",
                          alignItems: "baseline", gap: 10, marginBottom: 7 }}>
              <span style={{ fontSize: 16.5, display: "flex", alignItems: "center", gap: 10 }}>
                <span className="dot" style={{ margin: 0, background: teinte(c) }} />{c.nom}
              </span>
              <span style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                {ecart !== null && (
                  <span style={{ fontSize: 14.5, color: ecart >= 0 ? "#5E8F1E" : "#C9503A" }}>
                    {ecart >= 0 ? "+" : ""}{Math.round(ecart)} %
                  </span>
                )}
                <span className="affNum">{fmt(ca)}</span>
              </span>
            </div>
            {avant > 0 && (
              <div style={{ height: 6, borderRadius: 3, marginBottom: 3,
                            width: Math.max(2, (avant / haut) * 100) + "%",
                            background: teinte(c), opacity: .3 }} />
            )}
            {/* Le pourcentage seul ne disait pas par rapport a quoi : on pose sa base. */}
            {avant > 0 && (
              <div className="mini" style={{ fontSize: 15, marginBottom: 5 }}>
                {fmt(avant)} le même mois l'an dernier
              </div>
            )}
            <div style={{ height: 13, borderRadius: 4,
                          width: Math.max(2, (ca / haut) * 100) + "%",
                          background: teinte(c), transition: "width .4s" }} />
          </button>
        );
      })}
    </div>
  );
}

/* Les chantiers : ce que tu mets de côté, ce qu'il reste, et à quel rythme.
   Aucune saisonnalité supposée — seulement les mois réellement observés. */
function Chantiers({ config, entries, ym, onAdd, onDel }) {
  const [ouvert, setOuvert] = useState("");
  const [montant, setMontant] = useState("");
  const [poche, setPoche] = useState(caisseDe(config, null) || "");
  const [erreur, setErreur] = useState("");

  /* Le rythme vient des trois derniers mois clos qui ont des saisies */
  const rythme = useMemo(() => {
    const res = [];
    for (let i = 1; i <= 6 && res.length < 3; i++) {
      const m = shiftMonth(ym, -i);
      if (!entries.some((e) => (e.date || "").slice(0, 7) === m)) continue;
      /* La trésorerie, pas le résultat : le résultat ignore les investissements,
         les prélèvements, la solidarité et les mises en réserve — c'est-à-dire
         précisément tout ce qui se dispute l'argent avec un chantier. Le rythme
         annoncé était optimiste de façon systématique. */
      res.push(calcul(config, entries, m).tresorerie);
    }
    return res.length ? { moy: res.reduce((s, v) => s + v, 0) / res.length, n: res.length } : null;
  }, [config, entries, ym]);

  const verse = (id) => entries.filter((e) => e.type === "chantier" && e.chantier === id)
    .reduce((s, e) => s + num(e.montant), 0);

  const affecter = (id) => {
    if (num(montant) <= 0) { setErreur(MSG_MONTANT); return; }
    setErreur("");
    onAdd({ type: "chantier", chantier: id, date: ym + "-28", montant: num(montant),
            poche: poche || caisseDe(config, null) });
    setMontant(""); setOuvert("");
  };

  /* Les chantiers se financent dans l'ordre : le suivant attend le précédent */
  let dejaEngage = 0;
  const lignes = (config.chantiers || []).map((ch) => {
    const mis = verse(ch.id);
    const reste = Math.max(0, num(ch.cible) - mis);
    const avant = dejaEngage;
    dejaEngage += reste;
    return { ...ch, mis, reste, cumulAvant: avant, cumulTotal: dejaEngage };
  });

  const horizon = (cumul) => {
    if (!rythme || rythme.moy <= 0) return null;
    const m = cumul / rythme.moy;
    return { bas: Math.ceil(m * 0.8), haut: Math.ceil(m * 1.25) };
  };

  return (
    <div className="card">
      <h2 className="h2">Chantiers</h2>

      {rythme ? (
        <div className="row">
          <span className="lbl">Rythme observé sur {rythme.n} mois</span>
          <span className={"val " + (rythme.moy >= 0 ? "pos" : "neg")}>
            {fmt(rythme.moy)} par mois</span>
        </div>
      ) : (
        <div className="mini" style={{ marginBottom: 14 }}>
          Pas encore assez de mois saisis pour estimer un rythme. Les échéances apparaîtront
          après deux ou trois mois complets.
        </div>
      )}

      {lignes.map((ch) => {
        const pct = Math.min(100, (ch.mis / num(ch.cible)) * 100);
        const fini = ch.reste === 0;
        const h = fini ? null : horizon(ch.cumulTotal);
        return (
          <div key={ch.id} style={{ padding: "18px 0", borderBottom: "1px solid #F1F4E9" }}>
            <div style={{ display: "flex", justifyContent: "space-between",
                          alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 17.5 }}>{ch.nom}</span>
              <span className="val">{fmt(ch.mis)} <span className="mut"
                style={{ fontSize: 15 }}>/ {fmt(num(ch.cible))}</span></span>
            </div>

            <div style={{ height: 11, borderRadius: 6, background: "#EDF0E4",
                          margin: "11px 0 9px", overflow: "hidden" }}>
              <div style={{ width: pct + "%", height: "100%", transition: "width .4s",
                            background: fini ? "#5E8F1E" : "#8FB05F" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between",
                          alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span className="mini">
                {fini ? "Financé. Les dépenses de travaux peuvent commencer."
                  : h ? "Encore " + fmt(ch.reste) + " — environ " + h.bas
                        + (h.haut > h.bas ? " à " + h.haut : "") + " mois au rythme actuel"
                      : "Encore " + fmt(ch.reste)}
              </span>
              {!fini && (
                <button className="pill" onClick={() => setOuvert(ouvert === ch.id ? "" : ch.id)}>
                  {ouvert === ch.id ? "Annuler" : "Mettre de côté"}
                </button>
              )}
            </div>

            {ouvert === ch.id && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end",
                            marginTop: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 150 }}>
                  <label className="f">Montant affecté ce mois-ci</label>
                  <input className="f" autoFocus inputMode="decimal" value={montant}
                         onChange={(e) => { setMontant(e.target.value); setErreur(""); }}
                         onKeyDown={(e) => { if (e.key === "Enter") affecter(ch.id); }} />
                </div>
                <div style={{ minWidth: 160 }}>
                  <label className="f">Sorti de</label>
                  <select className="f" value={poche} onChange={(e) => setPoche(e.target.value)}>
                    {lesPoches(config).map((p) => (
                      <option key={p.id} value={p.id}>{p.nom}</option>
                    ))}
                  </select>
                </div>
                <button className="btn" style={{ margin: 0 }}
                        onClick={() => affecter(ch.id)}>Affecter</button>
              </div>
            )}
            {ouvert === ch.id && <Alerte>{erreur}</Alerte>}
          </div>
        );
      })}

      <div className="note">
        Les chantiers se financent dans l'ordre. Ce que tu affectes ici sort vraiment de
        la poche que tu indiques — les billets quittent l'enveloppe le jour même — et
        n'apparaît plus dans « Ce qu'il reste ». L'estimation part de la
        trésorerie réellement dégagée les mois précédents, sans supposer aucune saisonnalité :
        à Marrakech elle change chaque année, et treize mois ne suffisent pas à la connaître.
        La fourchette reflète cette incertitude — elle se resserrera à mesure que tu saisiras.
      </div>
    </div>
  );
}

const JOURS_COURTS = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];

/* Sept jours en vis-à-vis : ce qui rentre vers le haut, ce qui est vraiment
   sorti vers le bas, empilé par nature. Les charges fixes y figurent le jour où
   elles ont été réglées, jamais étalées : le dessin relaie la caisse, il ne
   suppose rien. */

const SORTIES = [
  { id: "dep",   lbl: "Achats",           couleur: "#C98A1E" },
  { id: "fixe",  lbl: "Charges payées",   couleur: "#E3BE7A" },
  { id: "inv",   lbl: "Investissements",  couleur: "#9C6B12" },
  { id: "prel",  lbl: "Prélèvements",     couleur: "#7A4F0C" },
];

function Rythme({ M, config }) {
  const j = M.jours7 || [];
  if (!j.length) return null;


  const jours = j.map((x) => {
    const parts = { dep: x.dep || 0, fixe: x.fixe || 0, inv: x.inv || 0, prel: x.prel || 0 };
    return { ...x, parts, sortie: SORTIES.reduce((s, p) => s + parts[p.id], 0) };
  });

  const rien = jours.every((x) => x.rec === 0 && x.sortie === 0);
  const recSem = jours.reduce((s, x) => s + x.rec, 0);
  const sortieSem = jours.reduce((s, x) => s + x.sortie, 0);
  /* Une seule échelle pour le haut et pour le bas : sans ça, comparer les deux
     moitiés à l'œil ne veut rien dire. */
  const haut = Math.max(1, ...jours.map((x) => Math.max(x.rec, x.sortie)));
  const H = 74;
  const px = (v) => v > 0 ? Math.max(2, Math.round((v / haut) * H)) : 0;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "baseline", gap: 12, marginBottom: 16 }}>
        <div className="eyebrow">Les sept derniers jours</div>
        {!rien && <span className="mini">{fmt(recSem)} encaissés · {fmt(sortieSem)} sortis</span>}
      </div>

      {rien ? (
        <div className="empty" style={{ padding: "18px 0" }}>
          Rien sur les sept derniers jours.
        </div>
      ) : (
        <>
        <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
          {jours.map((x) => {
            const jour = new Date(x.date + "T12:00:00").getDay();
            const detail = SORTIES.filter((p) => x.parts[p.id] > 0)
              .map((p) => p.lbl.toLowerCase() + " " + fmt(x.parts[p.id])).join(", ");
            return (
              <div key={x.date} style={{ flex: 1, minWidth: 0, textAlign: "center" }}
                   title={JOURS_COURTS[jour] + " " + x.date.slice(8, 10) + " — "
                          + fmt(x.rec) + " encaissés · " + fmt(x.sortie) + " sortis ("
                          + detail + ")"}>
                <div style={{ height: H, display: "flex", alignItems: "flex-end",
                              justifyContent: "center" }}>
                  <div style={{ width: "72%", height: px(x.rec),
                                background: "#5E8F1E", borderRadius: "4px 4px 0 0" }} />
                </div>
                <div style={{ height: 1, background: "#E4E9D6", margin: "3px 0" }} />
                <div style={{ height: H, display: "flex", flexDirection: "column",
                              alignItems: "center", justifyContent: "flex-start" }}>
                  {SORTIES.map((p, i) => px(x.parts[p.id]) > 0 && (
                    <div key={p.id} style={{ width: "72%", height: px(x.parts[p.id]),
                          background: p.couleur,
                          borderRadius: i === 0 ? "0 0 4px 4px" : 0 }} />
                  ))}
                </div>
                <div className="mini" style={{ fontSize: 12.5, marginTop: 4 }}>
                  {JOURS_COURTS[jour]}<br />{x.date.slice(8, 10)}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
          <span className="mini" style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span className="dot" style={{ background: "#5E8F1E", margin: 0 }} />Encaissé
          </span>
          {SORTIES.map((p) => (
            <span key={p.id} className="mini"
                  style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span className="dot" style={{ background: p.couleur, margin: 0 }} />{p.lbl}
            </span>
          ))}
        </div>
        </>
      )}
      <div className="note">
        En vert ce qui rentre, en orange ce qui est vraiment sorti ce jour-là : les achats,
        les charges fixes le jour où tu les as cochées payées (loyer, salaires, CNSS, traites,
        solidarité…), les investissements et les prélèvements. Rien n'est étalé ni estimé :
        une journée sans charge réglée n'en porte aucune. Ne sont pas comptés : ce que tu mets
        en réserve ou de côté pour un chantier, ni les avances sur salaire, déjà comprises
        dans le salaire coché.
      </div>
    </div>
  );
}

/* Ce que tu dois VRAIMENT : tes fournisseurs, plus ce que tu as signalé comme
   non payé. Les loyers, salaires et traites sont considérés payés à leur date ;
   ce qui n'est pas encore échu se lit à part, sans entrer dans le total. */
function Bientot({ M, config, onAller, onRegler, entries, onMaj, onChiffrer }) {
  const [annul, setAnnul] = useState(null);
  const [voirPayes, setVoirPayes] = useState(false);
  const [ouverte, setOuverte] = useState(null);
  const echs = M.echeances || [];
  const dues = echs.filter((e) => !e.paye && e.enRetard).sort((a, b) => a.jour - b.jour);
  const avenir = echs.filter((e) => !e.paye && !e.enRetard).sort((a, b) => a.jour - b.jour);
  const comptesPayes = echs.filter((e) => e.paye).sort((a, b) => a.jour - b.jour);
  const dettes = (entries || []).filter((e) => e.type === "depense" && e.aPayer)
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  /* Un bon de livraison ne se règle pas : on règle la facture qui le couvre.
     Les bons déjà facturés se regroupent donc sous leur facture, et seule la
     facture (ou un bon de dépense) a une case. Un bon pas encore facturé reste
     visible, sans case, « à facturer ». */
  const estBL = (e) => e.piece === "bl";
  const bonsDe = (f) => dettes.filter((b) => estBL(b) && b.facture && f.numero
    && String(b.facture) === String(f.numero) && b.fournisseur === f.fournisseur && b.affaire === f.affaire);
  const cachés = new Set();
  const fourn = dettes.filter((e) => !estBL(e)).map((e) => {
    const bons = e.piece === "facture" ? bonsDe(e) : [];
    bons.forEach((b) => cachés.add(b.id));
    return { ...e, bons, montantAffiche: num(e.montant) + bons.reduce((s, b) => s + num(b.montant), 0) };
  });
  const aFacturer = dettes.filter((e) => estBL(e) && !cachés.has(e.id));
  const toutes = [...fourn.map((e) => ({ ...e, genre: "doc" })), ...aFacturer.map((e) => ({ ...e, genre: "bl", montantAffiche: num(e.montant) }))]
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  if (!dues.length && !avenir.length && !toutes.length && !annul && !comptesPayes.length
      && !(M.facturesAttendues || []).length) return null;
  const total = dues.reduce((s, e) => s + e.montant, 0)
              + toutes.reduce((s, e) => s + e.montantAffiche, 0);
  /* Les ardoises : ce qu'on doit, regroupé par fournisseur, le plus gros
     d'abord. Un « à sortir » sans nom ne veut rien dire ; une ardoise chez
     le boucher, si. Un clic ouvre le détail des pièces. */
  const nomF = (id) => ((config.fournisseurs || []).find((f) => f.id === id) || {}).nom;
  const parArdoise = {};
  toutes.forEach((e) => {
    const cle = e.fournisseur ? "f:" + e.fournisseur : "l:" + String(e.lbl || "?").trim().toLowerCase();
    const x = parArdoise[cle] || (parArdoise[cle] = { cle, nom: nomF(e.fournisseur) || e.lbl || "Sans nom",
                                                    pieces: [], total: 0, nbBL: 0 });
    x.pieces.push(e); x.total += e.montantAffiche; if (e.genre === "bl") x.nbBL += 1;
  });
  const ardoises = Object.values(parArdoise).sort((a, b) => b.total - a.total);
  const totalFourn = ardoises.reduce((s, a) => s + a.total, 0);
  const totalAvenir = avenir.reduce((s, e) => s + e.montant, 0);

  const garde = (a) => {
    setAnnul(a);
    setTimeout(() => setAnnul((x) => (x && x.cle === a.cle ? null : x)), 8000);
  };
  const cocherCharge = (e) => {
    if (!onRegler) return;
    onRegler(e.ref, true);
    garde({ cle: "c" + e.ref, txt: e.lbl + " : payé", defaire: () => onRegler(e.ref, false) });
  };
  const decocherCharge = (e) => {
    if (!onRegler) return;
    onRegler(e.ref, false);
    garde({ cle: "d" + e.ref, txt: e.lbl + " : marqué non payé", defaire: () => onRegler(e.ref, true) });
  };
  const cocherFourn = (e) => {
    if (!onMaj) return;
    const ids = [e.id, ...(e.bons || []).map((b) => b.id)];
    onMaj(ids, { aPayer: false, regleLe: aujourdhui() });
    garde({ cle: "f" + e.id, txt: e.lbl + " : payé",
            defaire: () => onMaj(ids, { aPayer: true, regleLe: null }) });
  };

  const ligne = (e, action, paye) => (
    <div key={e.ref} className="row">
      <span className="lbl" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Coche paye={paye} retard={e.enRetard} onClick={() => action(e)} />
        <span style={{ color: paye ? "#9AA487" : undefined }}>{e.lbl}
          {e.estime && <span className="mini"> · estimation</span>}</span>
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 14.5, color: e.enRetard ? "#C9503A" : "#8B9678" }}>
          {e.enRetard ? "non payé" : "le " + e.jour}
        </span>
        <span className="val" style={{ color: paye ? "#9AA487" : undefined }}>{fmt(e.montant)}</span>
      </span>
    </div>
  );

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "baseline", gap: 12, marginBottom: 4 }}>
        <div className="eyebrow">Ce que tu dois</div>
        <span className="val" style={{ fontSize: 22 }}>{fmt(total)}</span>
      </div>
      {annul && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                      gap: 10, background: "#EEF4E0", borderRadius: 10, padding: "8px 12px",
                      margin: "6px 0", fontSize: 14.5, color: "#4F6B1F" }}>
          <span>✓ {annul.txt}</span>
          <button className="pill" onClick={() => { annul.defaire(); setAnnul(null); }}>
            Annuler
          </button>
        </div>
      )}
      {ardoises.length > 0 && (
        <div className="mini" style={{ margin: "12px 0 2px", display: "flex", justifyContent: "space-between" }}>
          <span>Fournisseurs</span><span>{fmt(totalFourn)}</span>
        </div>
      )}
      {ardoises.map((a) => (
        <div key={a.cle}>
          <button className="row" onClick={() => setOuverte(ouverte === a.cle ? null : a.cle)}
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer",
                           padding: undefined, textAlign: "left", font: "inherit", color: "inherit" }}>
            <span className="lbl" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 22, display: "inline-block", textAlign: "center", fontSize: 13,
                             color: "#8B9678" }}>{ouverte === a.cle ? "▾" : "▸"}</span>
              <span><strong style={{ fontWeight: 500 }}>{a.nom}</strong>
                <span className="mini"> · {a.pieces.length} {a.nbBL === a.pieces.length
                  ? (a.nbBL > 1 ? "BL" : "BL") : (a.pieces.length > 1 ? "pièces" : "pièce")}
                  {a.nbBL > 0 && a.nbBL === a.pieces.length ? " · se règle à la facture" : ""}</span>
              </span>
            </span>
            <span className="val">{fmt(a.total)}</span>
          </button>
          {ouverte === a.cle && a.pieces.map((e) => (
            <div key={e.id} className="row" style={{ paddingLeft: 32 }}>
              <span className="lbl" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {e.genre === "doc"
                  ? <Coche paye={false} onClick={() => cocherFourn(e)} />
                  : <span style={{ width: 22, display: "inline-block" }} />}
                <span className="mini" style={{ fontSize: 15 }}>
                  {(e.date || "").slice(8, 10)}/{(e.date || "").slice(5, 7)}
                  {e.numero ? " · n° " + e.numero : ""}
                  {e.genre === "bl" ? " · bon de livraison" : e.piece === "facture" ? " · facture" : ""}
                  {e.bons && e.bons.length > 0 ? " · couvre " + e.bons.length + " BL" : ""}
                </span>
              </span>
              <span className="val" style={{ fontSize: 15 }}>{fmt(e.montantAffiche)}</span>
            </div>
          ))}
        </div>
      ))}
      {dues.length > 0 && <div className="mini" style={{ margin: "14px 0 2px" }}>Signalé non payé</div>}
      {dues.map((e) => ligne(e, cocherCharge, false))}
      {total === 0 && <div className="note">Rien à payer pour le moment.</div>}
      <FacturesAttendues liste={M.facturesAttendues} onChiffrer={onChiffrer} />

      {avenir.length > 0 && (
        <>
          <div className="mini" style={{ margin: "16px 0 2px", display: "flex", justifyContent: "space-between" }}>
            <span>À venir ce mois-ci (pas encore dû)</span><span>{fmt(totalAvenir)}</span>
          </div>
          {avenir.map((e) => ligne(e, cocherCharge, false))}
        </>
      )}

      {comptesPayes.length > 0 && (
        <>
          <button className="pill" onClick={() => setVoirPayes(!voirPayes)}
                  style={{ width: "100%", margin: "14px 0 4px" }}>
            {voirPayes ? "Masquer" : "Voir"} ce qui est compté comme payé ({comptesPayes.length})
          </button>
          {voirPayes && (
            <>
              {comptesPayes.map((e) => ligne(e, decocherCharge, true))}
              <div className="note">
                Loyers, salaires et traites sont comptés payés à leur date. Décoche seulement
                ce qui n'a pas été payé : il passera dans « Ce que tu dois ».
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

const TEINTE_URGENCE = {
  retard:   { p: "#C9503A", f: "#FBEDEA", mot: "En retard" },
  imminent: { p: "#C98A1E", f: "#FBF3E4", mot: "Ça arrive" },
  bientot:  { p: "#5D6C4B", f: "transparent", mot: "Cette semaine" },
  sansdate: { p: "#8B9678", f: "transparent", mot: "Sans échéance" },
  plustard: { p: "#8B9678", f: "transparent", mot: "Plus tard" },
  faite:    { p: "#9AA487", f: "transparent", mot: "Faite" },
};

function LigneTache({ t, config, gens, onMaj, onDel, affaireFixe }) {
  const [edit, setEdit] = useState(false);
  const u = urgence(t);
  const ton = TEINTE_URGENCE[u];
  const a = config.affaires[t.affaire];
  const qui = gens.find((g) => g.id === t.responsable);
  const prio = PRIORITES.find((p) => p.id === (t.priorite || "normale"));
  const fait = t.etat === "fait";

  const [titre, setTitre] = useState(t.titre);
  const [responsable, setResponsable] = useState(t.responsable);
  const [debut, setDebut] = useState(t.debut || "");
  const [echeance, setEcheance] = useState(t.echeance || "");
  const [priorite, setPriorite] = useState(t.priorite || "normale");
  const [repete, setRepete] = useState(t.repete || "");
  const [affaire, setAffaire] = useState(t.affaire || "");

  const [erreur, setErreur] = useState("");
  const enregistrer = () => {
    if (!titre.trim()) { setErreur("Écris ce qu'il y a à faire."); return; }
    setErreur("");
    onMaj(t.id, { titre: titre.trim(), responsable, debut, echeance, priorite, repete,
                  affaire: affaireFixe || affaire });
    setEdit(false);
  };

  if (edit) {
    return (
      <div style={{ background: "#F5F8EC", borderRadius: 13, padding: 15, marginTop: 9 }}>
        <div style={{ marginBottom: 12 }}>
          <label className="f">Quoi faire</label>
          <input className="f" value={titre} onChange={(e) => setTitre(e.target.value)} />
        </div>
        <div className="grid3">
          <div><label className="f">Qui s'en occupe</label>
            <select className="f" value={responsable} onChange={(e) => setResponsable(e.target.value)}>
              {gens.map((g) => <option key={g.id} value={g.id}>{g.nom}</option>)}
            </select></div>
          <div><label className="f">Début</label>
            <input className="f" type="date" value={debut}
                   onChange={(e) => { setDebut(e.target.value); setEcheance(lendemain(e.target.value)); }} /></div>
          <div><label className="f">Échéance</label>
            <input className="f" type="date" value={echeance} onChange={(e) => setEcheance(e.target.value)} /></div>
        </div>
        <div className="grid2">
          {!affaireFixe && (
            <div><label className="f">Quelle activité</label>
              <select className="f" value={affaire} onChange={(e) => setAffaire(e.target.value)}>
                <option value="">Aucune en particulier</option>
                <option value="foyer">La maison</option>
                {vivantes(config).map(([k, a2]) => <option key={k} value={k}>{a2.nom}</option>)}
              </select></div>
          )}
          <div><label className="f">Importance</label>
            <select className="f" value={priorite} onChange={(e) => setPriorite(e.target.value)}>
              {PRIORITES.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select></div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="f">Ça revient</label>
          <select className="f" value={repete} onChange={(e) => setRepete(e.target.value)}>
            {REPETITIONS.map((r) => <option key={r.id} value={r.id}>{r.nom}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 9 }}>
          <Alerte>{erreur}</Alerte>
          <button className="btn" style={{ margin: 0 }} onClick={enregistrer}>Enregistrer</button>
          <button className="pill" onClick={() => setEdit(false)}>Annuler</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: ton.f, borderRadius: 13, padding: "13px 15px", marginTop: 9,
                  border: ton.f === "transparent" ? "1px solid #F1F4E9" : "none" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
        <span style={{ width: 9, height: 9, borderRadius: 3, marginTop: 7, flex: "none",
                       background: fait ? "#D3DAC4" : prio.couleur }} title={prio.nom} />
        <button onClick={() => setEdit(true)}
                style={{ flex: 1, minWidth: 0, border: "none", background: "none", cursor: "pointer",
                         textAlign: "left", padding: 0, font: "inherit", color: "inherit" }}>
          <div style={{ fontSize: 17, lineHeight: 1.4, fontWeight: 700,
                        color: fait ? "#9AA487" : "#33402C",
                        textDecoration: fait ? "line-through" : "none" }}>{t.titre}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 7 }}>
            {a && <span className="tag" style={{ color: lisible(a.marque),
                          borderColor: "rgba(0,0,0,.08)" }}>{a.nom}</span>}
            {qui && <span className="tag">{qui.nom}</span>}
            {t.debut && <span className="tag">Du {joliDate(t.debut)}</span>}
            <span style={{ fontSize: 14.5, color: ton.p }}>{echeanceTexte(t.echeance)}</span>
            {t.repete && <span className="tag">{
              (REPETITIONS.find((r) => r.id === t.repete) || {}).nom}</span>}
          </div>
        </button>
        <button className="del" aria-label="Supprimer" onClick={() => onDel(t.id)}>×</button>
      </div>

      {/* Trois boutons pleine largeur par tache donnaient un mur de boutons ou
          le titre — la vraie information — passait au second plan. Un seul
          controle compact, cale a droite. */}
      <div style={{ display: "flex", gap: 4, marginTop: 9, flexWrap: "wrap",
                    justifyContent: "flex-end" }}>
        {ETATS.map((e) => (
          <button key={e.id} onClick={() => onMaj(t.id, { etat: e.id })}
                  style={{ flex: "0 0 auto", cursor: "pointer", borderRadius: 8,
                           padding: "7px 14px",
                           fontSize: 13, fontWeight: 500, letterSpacing: ".08em",
                           textTransform: "uppercase", minHeight: 32,
                           border: t.etat === e.id ? "none" : "1.5px solid #DDE4CD",
                           background: t.etat === e.id ? "#33482C" : "#fff",
                           color: t.etat === e.id ? "#fff" : "#5D6C4B" }}>
            {e.nom}
          </button>
        ))}
      </div>
    </div>
  );
}

function NouvelleTache({ config, gens, onAdd, affaireFixe }) {
  const [ouvert, setOuvert] = useState(false);
  const [titre, setTitre] = useState("");
  const [affaire, setAffaire] = useState(affaireFixe || "");
  const [responsable, setResponsable] = useState("moi");
  const [debut, setDebut] = useState(aujourdhui());
  const [echeance, setEcheance] = useState(lendemain(aujourdhui()));
  const [priorite, setPriorite] = useState("normale");
  const [repete, setRepete] = useState("");

  const [erreur, setErreur] = useState("");
  const creer = () => {
    if (!titre.trim()) { setErreur("Écris ce qu'il y a à faire."); return; }
    setErreur("");
    onAdd({ titre: titre.trim(), affaire, responsable, debut, echeance, priorite, repete, etat: "afaire" });
    setTitre(""); setPriorite("normale"); setRepete(""); setOuvert(false);
  };

  if (!ouvert) return (
    <button className="pill" style={{ marginTop: 14 }} onClick={() => setOuvert(true)}>
      + Nouvelle tâche
    </button>
  );

  return (
    <div style={{ background: "#F5F8EC", borderRadius: 14, padding: 16, marginTop: 14 }}>
      <div style={{ marginBottom: 14 }}>
        <label className="f">Quoi faire</label>
        <input className="f" autoFocus placeholder="Revoir la quantité de falafel du matin"
               value={titre} onChange={(e) => setTitre(e.target.value)}
               onKeyDown={(e) => { if (e.key === "Enter") creer(); }} />
      </div>
      <div className="grid3">
        <div><label className="f">Qui s'en occupe</label>
          <select className="f" value={responsable} onChange={(e) => setResponsable(e.target.value)}>
            {gens.map((g) => <option key={g.id} value={g.id}>{g.nom}</option>)}
          </select></div>
        <div><label className="f">Début</label>
          <input className="f" type="date" value={debut}
                 onChange={(e) => { setDebut(e.target.value); setEcheance(lendemain(e.target.value)); }} /></div>
        <div><label className="f">Échéance</label>
          <input className="f" type="date" value={echeance}
                 onChange={(e) => setEcheance(e.target.value)} /></div>
      </div>
      <div className="grid2">
        {!affaireFixe && (
          <div><label className="f">Quelle activité</label>
            <select className="f" value={affaire} onChange={(e) => setAffaire(e.target.value)}>
              <option value="">Aucune en particulier</option>
              <option value="foyer">La maison</option>
              {vivantes(config).map(([k, a]) => <option key={k} value={k}>{a.nom}</option>)}
            </select></div>
        )}
        <div><label className="f">Importance</label>
          <select className="f" value={priorite} onChange={(e) => setPriorite(e.target.value)}>
            {PRIORITES.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </select></div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label className="f">Ça revient</label>
        <select className="f" value={repete} onChange={(e) => setRepete(e.target.value)}>
          {REPETITIONS.map((r) => <option key={r.id} value={r.id}>{r.nom}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Alerte>{erreur}</Alerte>
        <button className="btn" style={{ margin: 0 }} onClick={creer}>Créer la tâche</button>
        <button className="pill" onClick={() => setOuvert(false)}>Annuler</button>
      </div>
      <div className="note">
        Une tâche qui revient se replante toute seule à la date suivante dès que tu la coches.
        Tu ne la ressaisis jamais.
      </div>
    </div>
  );
}

function Taches({ taches, config, onAdd, onMaj, onDel, affaireFixe }) {
  const [toutVoir, setToutVoir] = useState(false);
  const gens = responsables(config);
  const liste = trierTaches(affaireFixe ? taches.filter((t) => t.affaire === affaireFixe) : taches);

  const pressantes = liste.filter((t) => ["retard", "imminent"].includes(urgence(t)));
  const suite = liste.filter((t) => !["retard", "imminent"].includes(urgence(t)));
  const retard = liste.filter((t) => urgence(t) === "retard").length;
  const montrees = toutVoir ? liste : pressantes;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "baseline", gap: 12 }}>
        <div className="eyebrow">Qui fait quoi</div>
        {retard > 0 && <span className="tag" style={{ color: "#C9503A", borderColor: "#EFC7BE" }}>
          {retard} en retard</span>}
      </div>

      {liste.length === 0 && (
        <div className="empty" style={{ padding: "26px 10px" }}>
          Rien en cours. Crée une tâche et elle remontera ici quand son échéance approchera.
        </div>
      )}

      {liste.length > 0 && pressantes.length === 0 && !toutVoir && (
        <div className="mini" style={{ marginTop: 12 }}>
          Rien d'urgent. {suite.length} tâche{suite.length > 1 ? "s" : ""} plus loin dans le temps.
        </div>
      )}

      {montrees.map((t) => (
        <LigneTache key={t.id} t={t} config={config} gens={gens} onMaj={onMaj} onDel={onDel}
                    affaireFixe={affaireFixe} />
      ))}

      {suite.length > 0 && (
        <button className="pill" style={{ marginTop: 12 }} onClick={() => setToutVoir(!toutVoir)}>
          {toutVoir ? "Ne montrer que l'urgent" : "Voir les " + liste.length + " tâches"}
        </button>
      )}

      <NouvelleTache config={config} gens={gens} onAdd={onAdd} affaireFixe={affaireFixe} />
    </div>
  );
}

const TON = { vert:   { p: "#5E8F1E", f: "#F1F7E6", t: "Dans les clous" },
              orange: { p: "#C98A1E", f: "#FBF3E4", t: "À surveiller" },
              rouge:  { p: "#C9503A", f: "#FBEDEA", t: "Au rouge" },
              attente:{ p: "#656E62", f: "#F5F8EC", t: "" },
              neutre: { p: "#656E62", f: "#F5F8EC", t: "" } };

/* Les dépenses suivent-elles les ventes ? Une jauge par affaire. */
function Jauge({ lbl, ratio, seuil, etat }) {
  const t = TON[etat] || TON.neutre;
  const largeur = Math.min(100, (ratio / (seuil * 1.6)) * 100);
  const repere = (seuil / (seuil * 1.6)) * 100;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "baseline", gap: 10 }}>
        <span className="mini">{lbl}</span>
        <span style={{ fontSize: 16.5, color: t.p, fontVariantNumeric: "tabular-nums" }}>
          {ratio.toFixed(1)} % <span className="mut" style={{ fontSize: 14 }}>/ {seuil} %</span>
        </span>
      </div>
      <div style={{ position: "relative", height: 9, borderRadius: 5,
                    background: "#EDF0E4", marginTop: 6, overflow: "hidden" }}>
        <div style={{ width: largeur + "%", height: "100%", background: t.p, transition: "width .4s" }} />
        <div style={{ position: "absolute", left: repere + "%", top: -2, bottom: -2,
                      width: 2, background: "#5D6C4B", opacity: .55 }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  L'ALARME DU SOIR                                                   */
/* ------------------------------------------------------------------ */
/* À partir de 20h, tant que la vente du jour de chaque activité et les achats
   du jour ne sont pas saisis, un bandeau rouge reste en haut de TOUTES les
   pages. Il n'a pas de bouton « plus tard ». Pour sortir : saisir, ou dire
   explicitement « fermé » / « aucun achat » (ce choix est enregistré, donc on
   distingue un jour sans achat d'un oubli). Le lendemain, « Hier non saisi »
   reste affiché jusqu'à régularisation. */
const isoLocal = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0")
                        + "-" + String(d.getDate()).padStart(2, "0");
function manquesDuJour(entries, config, iso) {
  const L = entries || [];
  const pt = ((config.pointages || {})[iso]) || {};
  const d0 = new Date(iso + "T12:00:00");
  const depuis = isoLocal(new Date(d0.getTime() - 14 * 864e5));
  const actives = Object.keys(config.affaires).filter((k) => !config.affaires[k].archive
    && L.some((e) => e.type === "vente" && e.affaire === k && e.date >= depuis && e.date < iso));
  const ventes = actives.filter((k) => !(pt.ferme || {})[k]
    && !L.some((e) => e.type === "vente" && e.affaire === k && e.date === iso));
  /* Comme les ventes : un achat attendu par activité. « Aucun achat » se dit
     activité par activité ; l'ancien pointage global (aucunAchat: true)
     reste respecté. Une activité fermée ce jour-là n'attend pas d'achat. */
  const achats = pt.aucunAchat === true ? [] : actives.filter((k) => !(pt.ferme || {})[k]
    && !((pt.aucunAchat || {})[k])
    && !L.some((e) => e.type === "depense" && e.affaire === k && e.date === iso));
  return { ventes, achats, actives };
}
/* Deux sections dans l'alarme : les ventes, que saisit SAIB, puis les achats,
   que saisit Amal — chacun voit d'un coup d'œil ce qui le regarde. */
const SOUS_TITRE_ALARME = { fontSize: 13, fontWeight: 600, letterSpacing: ".12em",
                            textTransform: "uppercase", opacity: .85, margin: "8px 0 2px" };
function Alarme({ entries, config, onPointer, onAller }) {
  const [, tic] = useState(0);
  useEffect(() => { const t = setInterval(() => tic((n) => n + 1), 60000); return () => clearInterval(t); }, []);
  const maintenant = new Date();
  const auj = isoLocal(maintenant);
  const hier = isoLocal(new Date(maintenant.getTime() - 864e5));
  const soir = maintenant.getHours() >= 20;
  const nomA = (k) => (config.affaires[k] && config.affaires[k].nom) || k;
  const blocs = [];
  if (soir) blocs.push({ iso: auj, titre: "Il est tard et la journée n'est pas saisie", fort: true });
  blocs.push({ iso: hier, titre: "Hier n'est pas saisi", fort: false });
  const rendu = blocs.map((b) => {
    const m = manquesDuJour(entries, config, b.iso);
    if (!m.ventes.length && !m.achats.length) return null;
    const jour = b.iso.slice(8, 10) + "/" + b.iso.slice(5, 7);
    return (
      <div key={b.iso} role="alert" style={{ background: b.fort ? "#7A0E14" : "#9B1B22", color: "#fff",
          padding: "14px 16px", borderRadius: 14, marginBottom: 10,
          boxShadow: b.fort ? "0 0 0 3px #E8B4B8" : "none" }}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
          {b.titre} ({jour})
        </div>
        {m.ventes.length > 0 && <div style={SOUS_TITRE_ALARME}>Ventes — SAIB</div>}
        {m.ventes.map((k) => (
          <div key={k} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", margin: "6px 0" }}>
            <span style={{ flex: 1, minWidth: 160 }}>Vente non saisie : <strong>{nomA(k)}</strong></span>
            <button className="pill" onClick={() => onAller(k)}>Saisir la vente</button>
          </div>
        ))}
        {m.achats.length > 0 && <div style={{ ...SOUS_TITRE_ALARME,
            ...(m.ventes.length > 0 ? { borderTop: "1px solid rgba(255,255,255,.35)", paddingTop: 10, marginTop: 10 } : {}) }}>
          Achats — Amal</div>}
        {m.achats.map((k) => (
          <div key={"a" + k} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", margin: "6px 0" }}>
            <span style={{ flex: 1, minWidth: 160 }}>Achat non saisi : <strong>{nomA(k)}</strong></span>
            <button className="pill" onClick={() => onAller(k)}>Saisir un achat</button>
            <button className="pill" onClick={() => onPointer(b.iso, { aucunAchat: { ...(typeof ((config.pointages || {})[b.iso] || {}).aucunAchat === "object" ? ((config.pointages || {})[b.iso] || {}).aucunAchat : {}), [k]: true } })}>
              Aucun achat ce jour-là</button>
          </div>
        ))}
      </div>
    );
  }).filter(Boolean);
  /* Le rappel du lundi : à partir de 9h, SAIB ramène l'export Naps de la
     semaine. La bande reste jusqu'à ce que ce soit fait (même les jours
     suivants), puis disparaît jusqu'au lundi d'après. */
  const lundi = isoLocal(new Date(maintenant.getTime() - ((maintenant.getDay() + 6) % 7) * 864e5));
  const lundiPasse = maintenant.getDay() !== 1 || maintenant.getHours() >= 9;
  const napsFait = !!(((config.pointages || {})[lundi] || {}).napsExport)
    || (entries || []).some((e) => e.type === "napsTc" && (e.importeLe || e.majLe || "") >= lundi);
  if (lundi >= "2026-10-12" && lundiPasse && !napsFait) {
    rendu.push(
      <div key="naps" role="alert" style={{ background: "#9B1B22", color: "#fff",
          padding: "14px 16px", borderRadius: 14, marginBottom: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
          Export Naps de la semaine</div>
        <div style={SOUS_TITRE_ALARME}>SAIB</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", margin: "6px 0" }}>
          <span style={{ flex: 1, minWidth: 160 }}>Télécharge l'export Excel depuis l'espace Naps et ramène-le dans LIFE.</span>
          <button className="pill" onClick={() => onPointer(lundi, { napsExport: true })}>C'EST FAIT</button>
        </div>
      </div>
    );
  }
  if (!rendu.length) return null;
  return <div style={{ position: "sticky", top: 0, zIndex: 50, marginBottom: 6 }}>{rendu}</div>;
}

/* ------------------------------------------------------------------ */
/*  CONTRÔLE — l'audit de cohérence                                    */
/* ------------------------------------------------------------------ */
/* Pas de nouveau calcul : seulement des vérifications de LIENS entre les
   écritures (une facture et ses bons, un numéro et son fournisseur, un jour
   et sa vente). Chaque anomalie dit quoi, où, et propose son remède. */
const cleNum = (v) => String(v || "").replace(/\s/g, "").toLowerCase().replace(/^0+(?=.)/, "");
function auditer(entries, config, ym) {
  const L = entries || [];
  const auj = new Date().toISOString().slice(0, 10);
  const pm = shiftMonth(ym, -1);
  const recents = L.filter((e) => ["depense", "invest"].includes(e.type)
                                  && [ym, pm].includes((e.date || "").slice(0, 7)));
  const nomF = (id) => ((config.fournisseurs || []).find((f) => f.id === id) || {}).nom || "";
  const nomA = (k) => (config.affaires[k] && config.affaires[k].nom) || k;
  const jj = (d) => (d || "").slice(8, 10) + "/" + (d || "").slice(5, 7);
  const q = [];

  /* 1 — Une dépense qui ne dit pas ce qu'elle est */
  recents.filter((e) => e.type === "depense").forEach((e) => {
    const libre = String(e.lbl || "").trim().toLowerCase();
    if (!e.fournisseur && (libre === "" || libre === "dépense" || libre === "depense")) {
      q.push({ id: "anon-" + e.id, gravite: 2, famille: "Identité",
        titre: "Dépense sans nom", detail: jj(e.date) + " · " + nomA(e.affaire) + " · " + fmt(num(e.montant))
          + " — on ne sait pas ce qui a été acheté.", ids: [e.id], affaire: e.affaire, fix: "lbl" });
    }
  });

  /* 2 — Une pièce sans numéro */
  recents.filter((e) => e.type === "depense" && (e.piece === "bl" || (e.piece === "facture" && e.aPayer))
                         && e.fournisseur && !String(e.numero || "").trim()
                         && num(e.montant) > 0).forEach((e) => {
    q.push({ id: "sansnum-" + e.id, gravite: 2, famille: "Numéro",
      titre: "Pièce sans numéro", detail: nomF(e.fournisseur) + " · " + jj(e.date) + " · " + fmt(num(e.montant))
        + " — impossible de la rapprocher de sa facture ou de repérer un doublon.",
      ids: [e.id], affaire: e.affaire, fix: "numero" });
  });

  /* 3 — Marchandise sans fournisseur */
  recents.filter((e) => e.type === "depense" && e.categorie === "matiere" && !e.fournisseur && e.piece !== "bon"
                         && !/solde \d+ BL/.test(e.lbl || "")).forEach((e) => {
    q.push({ id: "mat-" + e.id, gravite: 1, famille: "Identité",
      titre: "Marchandise sans fournisseur", detail: jj(e.date) + " · " + (e.lbl || "?") + " · " + fmt(num(e.montant)),
      ids: [e.id], affaire: e.affaire, fix: "fournisseur" });
  });

  /* 4 — Doublons probables (tous mois) */
  const vus = {};
  L.filter((e) => e.type === "depense" && cleNum(e.numero) && e.fournisseur).forEach((e) => {
    const c = e.affaire + "|" + e.fournisseur + "|" + cleNum(e.numero);
    (vus[c] = vus[c] || []).push(e);
  });
  Object.values(vus).filter((g) => g.length > 1).forEach((g) => {
    q.push({ id: "dbl-" + g[0].id, gravite: 3, famille: "Doublon",
      titre: "Même numéro saisi " + g.length + " fois",
      detail: nomF(g[0].fournisseur) + " · n° " + g[0].numero + " · "
        + g.map((x) => jj(x.date) + " " + fmt(num(x.montant))).join(" / "),
      ids: g.map((x) => x.id), affaire: g[0].affaire });
  });
  const vus2 = {};
  L.filter((e) => ["depense", "avance", "vente"].includes(e.type)).forEach((e) => {
    const c = [e.type, e.affaire || "", e.date, num(e.montant).toFixed(2), String(e.lbl || e.personne || e.nom || "").trim().toLowerCase(),
               e.precision || "", e.numero || ""].join("|");
    (vus2[c] = vus2[c] || []).push(e);
  });
  Object.values(vus2).filter((g) => g.length > 1 && num(g[0].montant) > 0
      && !(g[0].fournisseur && cleNum(g[0].numero))).forEach((g) => {
    q.push({ id: "dbl2-" + g[0].id, gravite: 3, famille: "Doublon",
      titre: "Même écriture saisie " + g.length + " fois",
      detail: jj(g[0].date) + " · " + (g[0].lbl || g[0].personne || g[0].nom || g[0].type) + " · " + fmt(num(g[0].montant))
        + " — doublon, ou deux vraies opérations identiques ?",
      ids: g.map((x) => x.id), affaire: g[0].affaire });
  });

  /* 5 — Facture qui ne tombe pas juste sur ses bons de livraison */
  L.filter((e) => e.type === "depense" && e.totalFacture && e.fournisseur).forEach((f) => {
    const bons = L.filter((b) => b.piece === "bl" && b.fournisseur === f.fournisseur && b.affaire === f.affaire
                                 && b.facture && String(b.facture) === String(f.numero));
    const somme = bons.reduce((s, b) => s + num(b.montant), 0) + num(f.montant);
    if (Math.abs(somme - num(f.totalFacture)) > 0.5) {
      q.push({ id: "fac-" + f.id, gravite: 3, famille: "Rapprochement",
        titre: "La facture " + f.numero + " ne tombe pas juste",
        detail: nomF(f.fournisseur) + " : facture " + fmt(num(f.totalFacture)) + ", bons + écart "
          + fmt(somme) + " (différence " + fmt(Math.abs(somme - num(f.totalFacture))) + ").",
        ids: [f.id], affaire: f.affaire });
    }
  });

  /* 6 — Bons de livraison qui attendent leur facture depuis trop longtemps */
  const vieux = L.filter((e) => e.type === "depense" && e.piece === "bl" && e.aPayer && !e.facture
                                && e.date && (new Date(auj) - new Date(e.date)) / 864e5 > 35);
  const parF = {};
  vieux.forEach((e) => { (parF[e.fournisseur || "?"] = parF[e.fournisseur || "?"] || []).push(e); });
  Object.entries(parF).forEach(([f, g]) => {
    q.push({ id: "vbl-" + f, gravite: 2, famille: "Rapprochement",
      titre: "Bons de livraison sans facture depuis plus de 35 jours",
      detail: (nomF(f) || "Fournisseur") + " : " + g.length + " bon" + (g.length > 1 ? "s" : "") + ", "
        + fmt(g.reduce((s, e) => s + num(e.montant), 0)) + " — la facture du mois est-elle arrivée ?",
      ids: g.map((e) => e.id), affaire: g[0].affaire });
  });

  /* 7 — Un mois entier à zéro sur une pièce qui n'est pas un lien */
  L.filter((e) => e.type === "depense" && num(e.montant) === 0 && !e.totalFacture).forEach((e) => {
    q.push({ id: "zero-" + e.id, gravite: 1, famille: "Identité",
      titre: "Dépense à 0 DH", detail: jj(e.date) + " · " + (e.lbl || nomF(e.fournisseur) || "?"),
      ids: [e.id], affaire: e.affaire });
  });

  /* 8 — Écritures datées dans le futur */
  L.filter((e) => e.date && e.date > auj && e.type !== "resa").forEach((e) => {
    q.push({ id: "fut-" + e.id, gravite: 2, famille: "Date",
      titre: "Écriture datée dans le futur", detail: jj(e.date) + " · " + (e.lbl || e.type) + " · " + fmt(num(e.montant)),
      ids: [e.id], affaire: e.affaire });
  });

  /* 9 — Jours sans vente (ce mois-ci seulement, hors aujourd'hui) */
  const venteK = {};
  L.filter((e) => e.type === "vente" && (e.date || "").slice(0, 7) === ym).forEach((e) => { venteK[e.affaire] = true; });
  Object.keys(venteK).forEach((k) => {
    const [an, mo] = ym.split("-").map(Number);
    const fin = ym === auj.slice(0, 7) ? Number(auj.slice(8, 10)) - 1 : new Date(an, mo, 0).getDate();
    const trous = [];
    for (let j = 1; j <= fin; j++) {
      const iso = ym + "-" + String(j).padStart(2, "0");
      if (!L.some((e) => e.type === "vente" && e.affaire === k && e.date === iso)
          && !((((config.pointages || {})[iso]) || {}).ferme || {})[k]) trous.push(j);
    }
    if (trous.length) q.push({ id: "trou-" + k, gravite: 2, famille: "Ventes",
      titre: "Ventes non saisies — " + nomA(k),
      detail: "Jours : " + trous.join(", ") + " (" + trous.length + "). Saisis la vente, ou 0 si fermé.",
      ids: [], affaire: k });
  });

  return q.sort((a, b) => b.gravite - a.gravite);
}

function Controle({ entries, config, ym, onMaj, onAller }) {
  const [ouvert, setOuvert] = useState(false);
  const [val, setVal] = useState({});
  const [msg, setMsg] = useState("");
  const liste = auditer(entries, config, ym);
  const ignorees = (() => { try { return JSON.parse(localStorage.getItem("life:ignorees") || "[]"); } catch (e) { return []; } })();
  const [ign, setIgn] = useState(ignorees);
  const visibles = liste.filter((x) => !ign.includes(x.id));
  const ignorer = (id) => { const n = [...ign, id]; setIgn(n); try { localStorage.setItem("life:ignorees", JSON.stringify(n)); } catch (e) {} };

  /* Clôture : trois questions, trois réponses */
  const L = entries || [];
  const ventesOk = !liste.some((x) => x.famille === "Ventes");
  const blsOuverts = L.filter((e) => e.type === "depense" && e.piece === "bl" && e.aPayer && !e.facture);
  const facturesDues = L.filter((e) => e.type === "depense" && e.aPayer && e.piece === "facture" && num(e.montant) > 0);
  const graves = visibles.filter((x) => x.gravite >= 2).length;
  const pret = ventesOk && graves === 0;

  const enregistrer = (x) => {
    const v = (val[x.id] || "").trim();
    if (!v) { setMsg("Écris quelque chose avant d'enregistrer."); return; }
    const id = x.ids[0];
    const e = L.find((y) => y.id === id);
    if (x.fix === "numero") {
      const dup = L.find((y) => y.id !== id && y.type === "depense" && y.affaire === e.affaire
        && y.fournisseur === e.fournisseur && cleNum(y.numero) === cleNum(v));
      if (dup) { setMsg("Ce numéro existe déjà chez ce fournisseur (" + jj2(dup.date) + ", " + fmt(num(dup.montant)) + ")."); return; }
      onMaj(id, { numero: v });
    } else if (x.fix === "lbl") onMaj(id, { lbl: v });
    else if (x.fix === "fournisseur") onMaj(id, { fournisseur: v });
    setMsg("");
  };
  const jj2 = (d) => (d || "").slice(8, 10) + "/" + (d || "").slice(5, 7);
  const couleur = (g) => g >= 3 ? "#C9503A" : g === 2 ? "#B07C1E" : "#8B9678";

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
        <div className="eyebrow">Contrôle</div>
        <span className="tag" style={{ color: visibles.length ? "#C9503A" : "#5E8F1E",
                                       borderColor: visibles.length ? "#EFC7BE" : "#CFE2B5" }}>
          {visibles.length ? visibles.length + " à vérifier" : "rien à signaler"}
        </span>
      </div>

      {visibles.length > 0 && (
        <button className="pill" onClick={() => setOuvert(!ouvert)} style={{ marginBottom: 8 }}>
          {ouvert ? "Masquer la liste" : "Voir la liste"}
        </button>
      )}
      {msg && <div className="mini" style={{ color: "#C9503A", marginBottom: 8 }}>{msg}</div>}

      {ouvert && visibles.map((x) => (
        <div key={x.id} style={{ borderTop: "1px solid #EEE9DA", padding: "12px 0" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
            <span style={{ width: 9, height: 9, borderRadius: 9, background: couleur(x.gravite), display: "inline-block" }} />
            <strong style={{ fontSize: 16.5, flex: 1 }}>{x.titre}</strong>
            <span className="mini">{x.famille}</span>
          </div>
          <div className="mini" style={{ margin: "5px 0 8px" }}>{x.detail}</div>
          {x.fix && x.ids.length === 1 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {x.fix === "fournisseur" ? (
                <select className="f" style={{ flex: 1, minWidth: 160 }} value={val[x.id] || ""}
                        onChange={(e) => setVal({ ...val, [x.id]: e.target.value })}>
                  <option value="">Choisir le fournisseur…</option>
                  {(config.fournisseurs || []).filter((f) => (f.affaires || []).includes(x.affaire))
                    .map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
                </select>
              ) : (
                <input className="f" style={{ flex: 1, minWidth: 160 }}
                       placeholder={x.fix === "numero" ? "Numéro de la pièce" : "Ce qui a été acheté"}
                       value={val[x.id] || ""} onChange={(e) => setVal({ ...val, [x.id]: e.target.value })} />
              )}
              <button className="pill on" onClick={() => enregistrer(x)}>Enregistrer</button>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {x.affaire && config.affaires[x.affaire] && (
              <button className="pill" onClick={() => onAller(x.affaire)}>Ouvrir {config.affaires[x.affaire].nom}</button>
            )}
            <button className="pill" onClick={() => ignorer(x.id)}>C'est normal</button>
          </div>
        </div>
      ))}

      <div style={{ borderTop: "1px solid #EEE9DA", marginTop: 10, paddingTop: 12 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Clôture de {monthLabel(ym)}</div>
        {[
          [ventesOk, ventesOk ? "Toutes les ventes sont saisies" : "Des jours sans vente sont à saisir"],
          [blsOuverts.length === 0, blsOuverts.length === 0 ? "Tous les bons de livraison sont facturés"
            : blsOuverts.length + " bon" + (blsOuverts.length > 1 ? "s" : "") + " de livraison " + (blsOuverts.length > 1 ? "attendent" : "attend") + " leur facture ("
              + fmt(blsOuverts.reduce((s, e) => s + num(e.montant), 0)) + ")"],
          [facturesDues.length === 0, facturesDues.length === 0 ? "Aucune facture à régler"
            : facturesDues.length + " facture" + (facturesDues.length > 1 ? "s" : "") + " à régler ("
              + fmt(facturesDues.reduce((s, e) => s + num(e.montant), 0)) + ")"],
          [graves === 0, graves === 0 ? "Aucune anomalie importante" : graves + " anomalie" + (graves > 1 ? "s" : "") + " à traiter"],
        ].map(([ok, t], i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "4px 0", fontSize: 16 }}>
            <span style={{ color: ok ? "#5E8F1E" : "#B07C1E", width: 18 }}>{ok ? "✓" : "•"}</span>
            <span>{t}</span>
          </div>
        ))}
        <div className="mini" style={{ marginTop: 6, color: pret ? "#5E8F1E" : "#7A5B22" }}>
          {pret ? "Le mois peut être clôturé : ventes complètes et aucune anomalie."
                : "Le mois n'est pas prêt à être clôturé."}
        </div>
      </div>
    </div>
  );
}

function Coherence({ M, config, onAller }) {
  const v = (M.voyants || []).filter(Boolean);
  if (!v.length) return null;
  const alertes = v.filter((x) => x.etat === "rouge" || x.etat === "orange").length;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "baseline", gap: 12, marginBottom: 4 }}>
        <div className="eyebrow">Cohérence des dépenses</div>
        {alertes > 0 && <span className="tag" style={{ color: "#C9503A",
                              borderColor: "#EFC7BE" }}>{alertes} à voir</span>}
      </div>

      {v.map((x) => {
        const c = config.affaires[x.k];
        const t = TON[x.etat] || TON.neutre;
        return (
          <button key={x.k} onClick={() => onAller(x.k)}
                  style={{ display: "block", width: "100%", textAlign: "left", cursor: "pointer",
                           border: "none", background: x.etat === "rouge" || x.etat === "orange"
                             ? t.f : "transparent",
                           borderRadius: 14, padding: "14px 16px", marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span className="dot" style={{ background: lisible(c.marque), margin: 0 }} />
              <span style={{ fontSize: 17.5, flex: 1 }}>{c.nom}</span>
              {t.t && <span style={{ fontSize: 14.5, color: t.p }}>{t.t}</span>}
            </div>

            {x.type === "ratio" && x.etat === "attente" && (
              <div className="mini" style={{ marginTop: 7 }}>
                {x.sansVente
                  ? (x.depense > 0
                      ? fmt(x.depense) + " dépensés, aucune vente encore saisie ce mois-ci."
                      : "Aucune vente encore saisie ce mois-ci.")
                  : fmt(x.depense) + " dépensés. Le voyant s'allume dans " + x.jours
                    + " jour" + (x.jours > 1 ? "s" : "") + " — trop tôt dans le mois pour juger."}
              </div>
            )}

            {x.type === "ratio" && x.etat !== "attente" && (
              <div style={{ marginTop: 2 }}>
                <Jauge lbl="Matière" ratio={x.rMat} seuil={x.seuils.matiere} etat={x.eMat} />
                <Jauge lbl="Total variable" ratio={x.rVar} seuil={x.seuils.variable} etat={x.eVar} />
                {x.eMat === "vert" && x.eVar !== "vert" && (
                  <div className="mini" style={{ marginTop: 9 }}>
                    La matière tient. Le dépassement vient d'ailleurs — coursier, emballages, dépannages.
                  </div>
                )}
                {x.ecartFonds !== 0 && (
                  <div className="mini" style={{ marginTop: 9,
                        fontWeight: x.eFonds !== "vert" ? 500 : 400,
                        color: x.ecartFonds > 0 ? "#C9503A" : "#8B9678" }}>
                    {x.ecartFonds > 0
                      ? "Fond de caisse : " + fmt(x.ecartFonds) + " manquant ce mois-ci."
                      : "Fond de caisse : " + fmt(-x.ecartFonds) + " en trop ce mois-ci."}
                  </div>
                )}
              </div>
            )}

            {x.type === "nuits" && x.etat === "neutre" && (
              <div className="mini" style={{ marginTop: 7 }}>
                Pas encore de quoi calculer le seuil. Saisis une réservation.
              </div>
            )}
            {x.type === "nuits" && x.etat !== "neutre" && (
              <div className="mini" style={{ marginTop: 7 }}>
                {x.horsCapacite
                  ? <>Les charges du mois demandent <strong style={{ color: "#38452F" }}>{x.requis} nuitées</strong>,
                     or le mois n'en compte que {x.capacite}. Même complet, le riad ne les couvre pas à ce tarif.</>
                  : x.reste > 0
                  ? <>Encore <strong style={{ color: "#38452F" }}>{x.reste} nuitée{x.reste > 1 ? "s" : ""}</strong> pour
                     couvrir les charges du mois. {x.nuits} vendue{x.nuits > 1 ? "s" : ""} sur {x.requis}.</>
                  : <>Les charges sont couvertes. {x.nuits - x.requis > 0
                     ? "Les " + (x.nuits - x.requis) + " nuitées suivantes sont du bénéfice." : "À partir d'ici, tout est pour toi."}</>}
                {x.estimee && <> (marge estimée sur les mois passés)</>}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* Deux lignes qui expliquent un mois. Sans elles, un chiffre bas reste
   une énigme deux ans plus tard. */
function NoteDuMois({ config, ym, onSave }) {
  const [edite, setEdite] = useState(false);
  const [txt, setTxt] = useState((config.notes || {})[ym] || "");
  const existante = (config.notes || {})[ym];

  const enregistrer = () => {
    onSave({ ...config, notes: { ...(config.notes || {}), [ym]: txt.trim() } });
    setEdite(false);
  };

  if (!edite) return (
    <button onClick={() => { setTxt(existante || ""); setEdite(true); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "10px 0 0",
                     textAlign: "left", font: "inherit", fontSize: 15,
                     color: existante ? "#5D6C4B" : "#8B9678",
                     textDecoration: existante ? "none" : "underline" }}>
      {existante || "Noter ce qui explique ce mois"}
    </button>
  );

  return (
    <div style={{ marginTop: 12 }}>
      <input className="f" autoFocus value={txt} onChange={(e) => setTxt(e.target.value)}
             placeholder="Fermé du 1er au 15, travaux cuisine, SAIB à plein temps…"
             onKeyDown={(e) => { if (e.key === "Enter") enregistrer(); }} />
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button className="btn" onClick={enregistrer}>Enregistrer</button>
        <button className="pill" onClick={() => setEdite(false)}>Annuler</button>
      </div>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  LES SIGNAUX : quatre dessins pour repérer un problème sans chercher */
/* ------------------------------------------------------------------ */

/* Ce que chaque jour du mois a rapporté et coûté, jusqu'à aujourd'hui. */
function parJourDuMois(entries, ym, M, keys, pointages) {
  const [an, mo] = ym.split("-").map(Number);
  const nbJours = new Date(an, mo, 0).getDate();
  const auj = new Date().toISOString().slice(0, 10);
  const dernier = ym === auj.slice(0, 7) ? Number(auj.slice(8, 10)) : (ym < auj.slice(0, 7) ? nbJours : 0);
  const quota = nbJours > 0 ? (M.chargesDuMois || 0) / nbJours : 0;
  const duMois = (entries || []).filter((e) => (e.date || "").slice(0, 7) === ym);
  const jours = [];
  for (let j = 1; j <= dernier; j++) {
    const iso = ym + "-" + String(j).padStart(2, "0");
    const d = duMois.filter((e) => e.date === iso);
    const venteDe = (e) => { const t = num(e.espece) + num(e.carte); return t > 0 ? t : num(e.montant); };
    const rec = d.filter((e) => e.type === "vente").reduce((s, e) => s + venteDe(e), 0)
      + d.filter((e) => e.type === "resa" && !e.aRecevoir).reduce((s, e) => s + num(e.montant), 0);
    const achats = d.filter((e) => ["depense", "invest"].includes(e.type)).reduce((s, e) => s + num(e.montant), 0);
    const sortie = achats
      + d.filter((e) => (e.type === "avance" && e.nature !== "salaire") || e.type === "perso")
          .reduce((s, e) => s + num(e.montant), 0)
      + quota;
    const parK = {};
    (keys || []).forEach((k) => {
      const v = d.filter((e) => e.type === "vente" && e.affaire === k);
      parK[k] = { vente: v.reduce((s, e) => s + venteDe(e), 0), saisi: v.length > 0 || !!((((pointages || {})[iso]) || {}).ferme || {})[k], ferme: !!((((pointages || {})[iso]) || {}).ferme || {})[k],
                  matiere: d.filter((e) => e.type === "depense" && e.affaire === k && e.categorie === "matiere")
                            .reduce((s, e) => s + num(e.montant), 0) };
    });
    jours.push({ j, iso, rec, sortie, achats, parK });
  }
  return { jours, nbJours, dernier };
}

function CourbeMois({ jours, nbJours, M }) {
  if (!jours.length) return null;
  const W = 600, H = 190, g = 34, b = 22;
  let cr = 0, cs = 0;
  const pts = jours.map((x) => { cr += x.rec; cs += x.sortie; return { j: x.j, cr, cs }; });
  const haut = Math.max(1, ...pts.map((p) => Math.max(p.cr, p.cs)));
  const X = (j) => g + ((j - 1) / Math.max(1, nbJours - 1)) * (W - g - 8);
  const Y = (v) => H - b - (v / haut) * (H - b - 10);
  const ligne = (cle) => pts.map((p) => X(p.j).toFixed(1) + "," + Y(p[cle]).toFixed(1)).join(" ");
  const fin = pts[pts.length - 1];
  const ecart = fin.cr - fin.cs;
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
        <div className="eyebrow">Ventes contre dépenses, jour après jour</div>
        <span className="mini" style={{ color: ecart >= 0 ? "#5E8F1E" : "#C9503A" }}>
          {ecart >= 0 ? "devant de " + fmt(ecart) : "en dessous de " + fmt(-ecart)}
        </span>
      </div>
      <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: "auto", display: "block" }}
           role="img" aria-label="Ventes et dépenses cumulées depuis le 1er du mois">
        {[0, .5, 1].map((t) => (
          <g key={t}>
            <line x1={g} x2={W - 8} y1={Y(haut * t)} y2={Y(haut * t)} stroke="#E4E9D6" strokeWidth="1" />
            <text x={g - 5} y={Y(haut * t) + 4} fontSize="11" textAnchor="end" fill="#8A9680">
              {Math.round(haut * t / 1000)}k
            </text>
          </g>
        ))}
        {[1, 10, 20, nbJours].map((j) => (
          <text key={j} x={X(j)} y={H - 6} fontSize="11" textAnchor="middle" fill="#8A9680">{j}</text>
        ))}
        <polyline points={ligne("cs")} fill="none" stroke="#C98A1E" strokeWidth="2.5" strokeLinejoin="round" />
        <polyline points={ligne("cr")} fill="none" stroke="#5E8F1E" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx={X(fin.j)} cy={Y(fin.cr)} r="4" fill="#5E8F1E" />
        <circle cx={X(fin.j)} cy={Y(fin.cs)} r="4" fill="#C98A1E" />
      </svg>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
        <span className="mini" style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span className="dot" style={{ background: "#5E8F1E", margin: 0 }} />Encaissé : {fmt(fin.cr)}
        </span>
        <span className="mini" style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span className="dot" style={{ background: "#C98A1E", margin: 0 }} />Sorti : {fmt(fin.cs)}
        </span>
      </div>
      <div className="note">
        Le vert est tout ce qui est rentré depuis le 1er, l'orange tout ce qui est sorti (achats, charges
        fixes étalées jour par jour, investissements, prélèvements). Tant que le vert est au-dessus,
        le mois se paie tout seul. Quand l'orange passe devant, le mois est en train de glisser.
      </div>
    </div>
  );
}

function MatiereDuJour({ jours, M, config }) {
  const lignes = (M.keys || []).filter((k) => (config.seuils || {})[k] && M.A[k].ca > 0
    && jours.some((x) => x.parK[k] && x.parK[k].vente > 0));
  if (!lignes.length) return null;
  return (
    <div className="card">
      <div className="eyebrow" style={{ marginBottom: 12 }}>Le coût matière, au fil du mois</div>
      {lignes.map((k) => {
        const cible = config.seuils[k].matiere;
        let v = 0, m = 0;
        const serie = jours.map((x) => { v += x.parK[k].vente; m += x.parK[k].matiere;
                                         return v > 0 ? (m / v) * 100 : null; });
        const reel = M.A[k].ca > 0 ? (M.A[k].matiereReelle / M.A[k].ca) * 100 : 0;
        const etat = reel <= cible ? "#5E8F1E" : reel <= cible * 1.15 ? "#C98A1E" : "#C9503A";
        const vals = serie.filter((x) => x !== null);
        const max = Math.max(cible * 1.6, ...vals, 1);
        const W = 260, H = 46;
        const X = (i) => (i / Math.max(1, serie.length - 1)) * (W - 4) + 2;
        const Y = (p) => H - 4 - (Math.min(p, max) / max) * (H - 8);
        const pts = serie.map((p, i) => p === null ? null : X(i).toFixed(1) + "," + Y(p).toFixed(1)).filter(Boolean).join(" ");
        return (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0",
                                borderBottom: "1px solid #EEF1E4", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 130px", minWidth: 120 }}>
              <div style={{ fontSize: 16.5 }}>{config.affaires[k].nom}</div>
              <div className="mini">cible {cible} %</div>
            </div>
            <svg viewBox={"0 0 " + W + " " + H} style={{ flex: "2 1 160px", width: "100%", maxWidth: 300, height: 46 }}>
              <line x1="0" x2={W} y1={Y(cible)} y2={Y(cible)} stroke="#B9C2A8" strokeDasharray="4 4" />
              <polyline points={pts} fill="none" stroke={etat} strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
            <div style={{ flex: "0 0 74px", textAlign: "right", fontSize: 20, color: etat }}>
              {Math.round(reel)} %
            </div>
          </div>
        );
      })}
      <div className="note">
        Pour 100 DH vendus, combien ont été dépensés en marchandise (viande, légumes, boissons…) depuis le 1er.
        La ligne pointillée est ta cible. Une courbe qui monte au-dessus : on achète trop, ou des ventes
        ne sont pas saisies.
      </div>
    </div>
  );
}

function CalendrierSaisies({ jours, nbJours, M, config, ym }) {
  const lignes = (M.keys || []).filter((k) => jours.some((x) => x.parK[k] && x.parK[k].saisi));
  if (!lignes.length) return null;
  const auj = new Date().toISOString().slice(0, 10);
  const [an, mo] = ym.split("-").map(Number);
  /* La semaine commence le lundi : on décale le 1er du mois d'autant de cases. */
  const decalage = (new Date(an, mo - 1, 1).getDay() + 6) % 7;
  const parJour = {};
  jours.forEach((x) => { parJour[x.j] = x; });
  const court = (v) => v >= 1000 ? (Math.round(v / 100) / 10).toString().replace(".", ",") + "k" : String(Math.round(v));
  const manquants = jours.filter((x) => x.iso !== auj && lignes.some((k) => !x.parK[k].saisi));
  const totRec = jours.reduce((s, x) => s + x.rec, 0);
  const totAch = jours.reduce((s, x) => s + x.achats, 0);
  const cases = [];
  for (let i = 0; i < decalage; i++) cases.push(null);
  for (let j = 1; j <= nbJours; j++) cases.push(j);
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <div className="eyebrow">Le mois, jour par jour</div>
        <span className="mini" style={{ color: manquants.length ? "#C9503A" : "#5E8F1E" }}>
          {manquants.length ? manquants.length + " jour" + (manquants.length > 1 ? "s" : "") + " avec une vente non saisie"
                            : "toutes les ventes sont saisies"}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {["lun", "mar", "mer", "jeu", "ven", "sam", "dim"].map((n) => (
          <div key={n} className="mini" style={{ textAlign: "center", fontSize: 12.5 }}>{n}</div>
        ))}
        {cases.map((j, i) => {
          if (j === null) return <div key={"v" + i} />;
          const x = parJour[j];
          const iso = ym + "-" + String(j).padStart(2, "0");
          const futur = !x;
          const oubli = x && iso !== auj && lignes.some((k) => !x.parK[k].saisi);
          return (
            <div key={j} style={{ minHeight: 70, borderRadius: 8, padding: "5px 4px", minWidth: 0,
                                  background: futur ? "#F4F6EC" : "#FFFFFF",
                                  border: oubli ? "1.5px solid #C9503A" : iso === auj ? "1.5px solid #5E8F1E" : "1px solid #E4E9D6",
                                  display: "flex", flexDirection: "column", gap: 2, textAlign: "center" }}>
              <div style={{ fontSize: 12.5, color: "#8A9680", fontWeight: iso === auj ? 600 : 400 }}>{j}</div>
              {x && x.rec > 0 && <div style={{ fontSize: 13.5, color: "#5E8F1E", lineHeight: 1.15 }}>{court(x.rec)}</div>}
              {x && x.achats > 0 && <div style={{ fontSize: 13.5, color: "#C98A1E", lineHeight: 1.15 }}>−{court(x.achats)}</div>}
              {x && (
                <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: "auto" }}>
                  {lignes.map((k) => (
                    <span key={k} title={config.affaires[k].nom + (x.parK[k].saisi ? " — " + fmt(x.parK[k].vente) : " — rien saisi")}
                          style={{ width: 9, height: 9, borderRadius: 5, boxSizing: "border-box",
                                   background: x.parK[k].saisi ? teinte(config.affaires[k]) : "transparent",
                                   border: x.parK[k].saisi ? "none" : "1.5px solid #C9503A" }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12 }}>
        <span className="mini"><span style={{ color: "#5E8F1E" }}>■</span> encaissé du jour : {fmt(totRec)}</span>
        <span className="mini"><span style={{ color: "#C98A1E" }}>■</span> achats du jour : {fmt(totAch)}</span>
        {lignes.map((k) => (
          <span key={k} className="mini" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="dot" style={{ background: teinte(config.affaires[k]), margin: 0 }} />{config.affaires[k].nom}
          </span>
        ))}
      </div>
      <div className="note">
        Chaque case est un jour : en vert ce qui est rentré, en orange ce qui a été acheté. Les points
        du bas disent, activité par activité, si la vente du jour a été saisie. Un point vide à bordure rouge
        (et la case entourée de rouge) = rien saisi : oubli, ou jour de fermeture.
      </div>
    </div>
  );
}
const ym2 = (iso) => iso.slice(5, 7);

function AchatsParFournisseur({ entries, ym, config }) {
  const noms = {};
  (config.fournisseurs || []).forEach((f) => { noms[f.id] = f.nom; });
  const groupes = {};
  (entries || []).filter((e) => e.type === "depense" && (e.date || "").slice(0, 7) === ym
                              && e.affaire !== "foyer").forEach((e) => {
    const nom = e.fournisseur && noms[e.fournisseur] ? noms[e.fournisseur]
      : String(e.lbl || "Divers").split(/[—–-]/).pop().trim().slice(0, 28) || "Divers";
    const g = groupes[nom] || (groupes[nom] = { nom, total: 0, du: 0 });
    g.total += num(e.montant);
    if (e.aPayer) g.du += num(e.montant);
  });
  const liste = Object.values(groupes).sort((a, b) => b.total - a.total).slice(0, 8);
  if (!liste.length) return null;
  const haut = Math.max(1, ...liste.map((g) => g.total));
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
        <div className="eyebrow">Où vont les achats</div>
        <span className="mini">partie claire : pas encore payé</span>
      </div>
      {liste.map((g) => (
        <div key={g.nom} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>{g.nom}</span>
            <span className="affNum" style={{ fontSize: 16 }}>{fmt(g.total)}</span>
          </div>
          <div style={{ display: "flex", height: 11, width: Math.max(2, (g.total / haut) * 100) + "%" }}>
            <div style={{ flex: g.total - g.du, background: "#C98A1E", borderRadius: "4px 0 0 4px" }} />
            <div style={{ flex: g.du, background: "#C98A1E", opacity: .3, borderRadius: g.total === g.du ? 4 : "0 4px 4px 0" }} />
          </div>
        </div>
      ))}
      <div className="note">
        Les huit plus gros postes d'achats du mois. Un poste qui grossit d'un mois sur l'autre, ou une grosse
        partie claire (non payée), se repère d'un coup d'œil.
      </div>
    </div>
  );
}

function Signaux({ M, config, ym, entries }) {
  const { jours, nbJours } = parJourDuMois(entries, ym, M, M.keys, config.pointages);
  return (
    <>
      <Rythme M={M} config={config} />
      <MatiereDuJour jours={jours} M={M} config={config} />
      <CalendrierSaisies jours={jours} nbJours={nbJours} M={M} config={config} ym={ym} />
      <AchatsParFournisseur entries={entries} ym={ym} config={config} />
    </>
  );
}

function Dashboard({ M, config, ym, onAller, onRegler, entries, onAdd, onDel, onMaj, onSaveConfig, onChiffrer,
                    taches, onAddTache, onMajTache, onDelTache }) {
  const [detail, setDetail] = useState(false);
  const enCours = ym >= thisMonth();

  return (
    <>
      {(M.orphelines.n > 0 || M.orphelines.primes > 0 || M.orphelines.fixes > 0
        || M.orphelines.cleIncomplete) && (
        <div className="card" style={{ background: "#FDF4E7", borderColor: "#EBD7B4",
                                       color: "#7A5B22", marginBottom: 14 }}>
          <strong>Des écritures ne sont comptées nulle part.</strong>
          {M.orphelines.n > 0 && (
            <div style={{ marginTop: 6 }}>
              {M.orphelines.n} écriture{M.orphelines.n > 1 ? "s" : ""} de ce mois, pour
              {" " + fmt(M.orphelines.total)}, pointe{M.orphelines.n > 1 ? "nt" : ""} une
              activité qui n'existe plus ({M.orphelines.affaires.join(", ")}). L'argent a
              bougé, mais il ne compte dans aucun résultat.
            </div>
          )}
          {M.orphelines.fixes > 0 && (
            <div style={{ marginTop: 6 }}>
              {fmt(M.orphelines.fixes)} de charges fixes ({M.orphelines.fixesLbl.join(", ")})
              sont rattachées à une activité qui n'existe plus : elles sont encore
              réclamées dans l'échéancier, mais ne pèsent sur aucun résultat.
            </div>
          )}
          {M.orphelines.primes > 0 && (
            <div style={{ marginTop: 6 }}>
              {fmt(M.orphelines.primes)} de primes versées à quelqu'un qui n'est plus dans
              la liste des salariés : elles ne pèsent nulle part.
            </div>
          )}
          {M.orphelines.cleIncomplete && (
            <div style={{ marginTop: 6 }}>
              La clé de répartition du labo ne fait pas 100 %. Les charges du labo sont
              réparties au prorata en attendant, mais le mieux est de la corriger dans
              Paramètres.
            </div>
          )}
        </div>
      )}

      {/* Une seule question : combien il me reste ce mois-ci ? Le chiffre compte
          TOUTES les charges du mois, cochées ou non : il ne bouge pas selon ce
          qu'on a pensé à pointer. */}
      <div className="card bandeau" style={{ padding: "26px 24px" }}>
        <div className="heroLbl">{monthLabel(ym)}</div>
        {M.resteMois >= 0 ? (
          <>
            <div className="eyebrow" style={{ marginTop: 14 }}>Ce qu'il te reste ce mois-ci</div>
            <div className="heroNum pos" style={{ fontSize: 46 }}>{fmt(M.resteMois)}</div>
          </>
        ) : enCours ? (
          <>
            <div className="eyebrow" style={{ marginTop: 14 }}>Encore à encaisser pour couvrir le mois</div>
            <div className="heroNum" style={{ fontSize: 46, color: "#B07C1E" }}>{fmt(-M.resteMois)}</div>
          </>
        ) : (
          <>
            <div className="eyebrow" style={{ marginTop: 14 }}>Le mois s'est terminé en dessous des charges de</div>
            <div className="heroNum neg" style={{ fontSize: 46 }}>{fmt(-M.resteMois)}</div>
          </>
        )}
        <div className="mini" style={{ marginTop: 6 }}>
          {fmt(M.encaisse)} encaissés, moins {fmt(M.sortiesPures)} de charges du mois
          (payées ou pas encore).
          {M.resteMois < 0 && enCours
            ? " Le mois n'est pas fini : les charges comptent dès le 1er, les ventes arrivent jour après jour."
            : ""}
        </div>
        <NoteDuMois config={config} ym={ym} onSave={onSaveConfig} />
      </div>

      <Controle entries={entries} config={config} ym={ym} onMaj={onMaj} onAller={onAller} />
      <Bientot M={M} config={config} onAller={onAller} onRegler={onRegler} onChiffrer={onChiffrer}
               entries={entries} onMaj={onMaj} />

      <Signaux M={M} config={config} ym={ym} entries={entries} />

      <div className="card">
        <h2 className="h2">Où part l'argent</h2>
        {M.detailSimple.map(([lbl, v]) => (
          <div className="row" key={lbl}>
            <span className="lbl">{lbl === "Reporté sur le mois suivant" ? "Dont repoussé au mois suivant" : lbl}</span>
            <span className="val">{v < 0 ? "− " + fmt(-v) : fmt(v)}</span>
          </div>
        ))}
        <div className="row rowTot">
          <span className="lbl">Total des charges du mois</span>
          <span className="val">{fmt(M.sortiesPures)}</span>
        </div>
      </div>

      <button className="pill" onClick={() => setDetail(!detail)}
              style={{ width: "100%", padding: "13px", margin: "14px 0" }}>
        {detail ? "Masquer le détail" : "Voir le détail"}
      </button>

      {detail && (
        <>
      {/* Le chiffre du mois d'abord, qui fait quoi juste après. */}
      <Taches taches={taches} config={config} onAdd={onAddTache}
              onMaj={onMajTache} onDel={onDelTache} />

      {/* Ce qu'un mois ordinaire coûte, et ce qui s'est ajouté par-dessus. Sans
          cette séparation, une plomberie à 7 600 DH se lit comme une charge
          permanente et fausse tout ce qu'Amal en conclut. */}
      <div className="board">
        <div className="col">
          <div className="card">
            <h2 className="h2">Ton mois ordinaire</h2>
            <div className="row"><span className="lbl">Ce que coûte un mois normal</span>
              <span className="val">{fmt(M.chargesOrdinaires)}</span></div>
            <div className="row"><span className="lbl">Ce qu'il faut encaisser pour y arriver</span>
              <span className="val">{fmt(M.seuilOrdinaire)}</span></div>
            <div className="note" style={{ marginTop: 10 }}>
              Loyers, salaires, structure, maison et solidarité — ce qui revient tous les mois,
              quoi qu'il arrive. C'est ce chiffre-là qu'il faut battre pour vivre, pas le total
              du mois.
            </div>
          </div>

          {M.exceptionnelMois > 0 && (
            <div className="card">
              <h2 className="h2">Ce mois-ci, en plus</h2>
              <div className="row rowTot"><span className="lbl">Exceptionnel</span>
                <span className="val neg">{fmt(M.exceptionnelMois)}</span></div>
              {M.lignesExceptionnelles.slice(0, 8).map((l, i) => (
                <div className="row" key={i}>
                  <span className="lbl">{l.lbl}
                    {config.affaires[l.affaire] && (
                      <span className="mini"> · {config.affaires[l.affaire].nom}</span>)}
                  </span>
                  <span className="val">{fmt(l.montant)}</span>
                </div>
              ))}
              <div className="note" style={{ marginTop: 10 }}>
                Des travaux, du matériel, un acompte d'impôts : ça sort de la caisse mais ça ne
                reviendra pas le mois prochain. Ne juge pas ton mois là-dessus.
              </div>
            </div>
          )}
        </div>

        <div className="col">
          {/* Un bon mois n'empêche pas de s'enfoncer : ce qui est dû au-delà du
              mois doit se voir quelque part. */}
          <div className="card">
            <h2 className="h2">Ce que tu dois, en tout</h2>
            <div className="row rowTot"><span className="lbl">Total</span>
              <span className="val neg" style={{ fontSize: 22 }}>{fmt(M.duTotal)}</span></div>
            <div className="row"><span className="lbl">Exigible maintenant</span>
              <span className="val">{fmt(M.duMaintenant)}</span></div>
            <div className="row"><span className="lbl">Engagé sur la durée</span>
              <span className="val">{fmt(M.duPlusTard)}</span></div>

            {M.empruntsOuverts.length > 0 && (
              <>
                <div className="mini" style={{ margin: "14px 0 4px" }}>Emprunts à rendre</div>
                {M.empruntsOuverts.map((p) => (
                  <div className="row" key={p.id}>
                    <span className="lbl">{p.qui || "Emprunt"}
                      {p.echeance && <span className="mini"> · avant le {joliDate(p.echeance)}</span>}
                    </span>
                    <span className="val">{fmt(p.solde)}</span>
                  </div>
                ))}
              </>
            )}

            {M.credits.length > 0 && (
              <>
                <div className="mini" style={{ margin: "14px 0 4px" }}>Traites et crédits en cours</div>
                {M.credits.map((c) => (
                  <div className="row" key={c.id}>
                    <span className="lbl">{c.lbl}
                      <span className="mini"> · {c.echeances} échéance{c.echeances > 1 ? "s" : ""} jusqu'à {monthLabel(c.fin).toLowerCase()}</span>
                    </span>
                    <span className="val">{fmt(c.capital)}</span>
                  </div>
                ))}
              </>
            )}

            {M.prêtsARecevoir > 0 && (
              <div className="row" style={{ marginTop: 10 }}>
                <span className="lbl">À l'inverse, on te doit</span>
                <span className="val pos">{fmt(M.prêtsARecevoir)}</span>
              </div>
            )}

            <div className="note" style={{ marginTop: 10 }}>
              {M.credits.length === 0
                ? "Tes traites ne sont pas encore comptées ici : dans les Réglages, indique jusqu'à "
                  + "quel mois chacune tombe, et l'appli calculera toute seule ce qu'il en reste."
                : "Les traites se recalculent toutes seules chaque mois : tu n'as indiqué que la "
                  + "date de la dernière échéance."}
            </div>
          </div>
        </div>
      </div>

      {/* Ligne 1 — ce qui appelle une décision aujourd'hui, écarts de fond de
          caisse compris (repère par activité juste en dessous des jauges) */}
      <Coherence M={M} config={config} onAller={onAller} />

      {/* Ligne 2 — ce qui s'est passé, et qu'on peut encore corriger */}
      <BarresCA M={M} config={config} onAller={onAller} />

      {/* Ligne 3 — ce qui arrive. En deux colonnes, la gauche se vidait et
          laissait une demi-page de creme sous le bloc le plus consulte : les
          deux blocs prennent maintenant toute la largeur, l'un sous l'autre. */}
      {M.enRetard > 0 && (
        <div className="card" style={{ background: "#FDF6E7", borderColor: "#E9D9AE" }}>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#B07C1E" }}>
            {fmt(M.enRetard)} viennent du mois dernier
          </div>
          <div className="mini" style={{ marginTop: 6, color: "#8A7440" }}>
            Ce montant s'ajoute aux charges de ce mois-ci. Il est déjà compris dans le total
            à décaisser.
          </div>
        </div>
      )}
        </>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  EN-TÊTE DE MARQUE                                                  */
/* ------------------------------------------------------------------ */

/* La bande de marque : un aplat plein aux couleurs de l'affaire,
   son logo en blanc dedans. Le nom n'est répété que si le logo manque. */
/* Les memes rapports qu'avant, a 68 % : le bandeau prenait 200 px de haut
   pour ne porter qu'un logo, et repoussait le premier chiffre hors de l'ecran. */
const TAILLE_CREST = {
  dash:     { width: 53, height: 53 },
  reglages: { width: 56, height: 62 },
  sabich:  { width: 107, height: 27 },
  tmsk:    { width: 93, height: 39 },
  riad:    { width: 90, height: 61 },
  contenu: { width: 69, height: 57 },
  foyer:   { width: 53, height: 48 },
  taam:    { width: 96, height: 35 },
};

const HABIT_VUE = { dash: HABIT_DASH, foyer: HABIT_FOYER, reglages: HABIT_REGLAGES };

function Crest({ k, c }) {
  const blanc = LOGO_BLANC[k] ? LOGOS[LOGO_BLANC[k]] : null;
  const h = HABIT_VUE[k] || habit(k, c);
  return (
    <div className="crest">
      {blanc
        ? <img src={blanc} alt={c.nom} style={{ ...TAILLE_CREST[k], ...encre(h) }} />
        : <div className="crestName" style={h.texte ? { color: h.texte } : {}}>{c.nom}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SAISIE                                                             */
/* ------------------------------------------------------------------ */

const dejaPaye = (entries, ym) => (affaire, fid) => entries
  .filter((e) => e.type === "depense" && (e.date || "").startsWith(ym)
                 && e.affaire === affaire && e.fournisseur === fid)
  .reduce((s, e) => s + num(e.montant), 0);

function Saisie({ config, ym, onAdd, entries }) {
  const deja = dejaPaye(entries, ym);
  const [type, setType] = useState("vente");
  const [ok, setOk] = useState("");
  const flash = (m) => { setOk(m); setTimeout(() => setOk(""), 2600); };
  const defDate = ym === thisMonth() ? today() : ym + "-01";

  return (
    <>
      <div className="card">
        <h2 className="h2">Nature de l'écriture</h2>
        <div className="navSimple" style={{ margin: 0 }}>
          {[["vente","Recette du jour"],
            ...(hebergeurs(config).length ? [["resa","Réservation"], ["repas","Repas & extras"]] : []),
            ["depense","Achat ou charge"],
            ["avance","Avance ou prélèvement"],["invest","Investissement"]].map(([k, l]) => (
            <button key={k} className={"pill" + (type === k ? " on" : "")} onClick={() => setType(k)}>{l}</button>
          ))}
        </div>
      </div>

      {ok && <div className="card" style={{ background: "#F0F6E2", borderColor: "#CFE0A8" }}>
        <div className="pos" style={{ fontSize: 16.5 }}>{ok}</div></div>}

      {type === "vente"   && <FVente   config={config} defDate={defDate} onAdd={onAdd} flash={flash} entries={entries} />}
      {type === "resa"    && <FResa    config={config} defDate={defDate} onAdd={onAdd} flash={flash} entries={entries} />}
      {type === "repas"   && <FRepas   config={config} defDate={defDate} onAdd={onAdd} flash={flash} />}
      {type === "depense" && <FDepense config={config} defDate={defDate} onAdd={onAdd} flash={flash} deja={deja} entries={entries} />}
      {type === "avance"  && <FAvance  defDate={defDate} onAdd={onAdd} flash={flash} config={config} entries={entries} />}
      {type === "invest"  && <FInvest  config={config} defDate={defDate} onAdd={onAdd} flash={flash} />}
    </>
  );
}

function FVente({ config, defDate, onAdd, flash, fixe, entries }) {
  const liste = vendeuses(config);
  const [date, setDate] = useState(defDate);
  const [affaire, setAffaire] = useState(fixe || (liste[0] ? liste[0][0] : ""));
  const [espece, setEspece] = useState("");
  const [carte, setCarte] = useState("");
  const [fondSuppose, setFondSuppose] = useState("");
  const [fondReel, setFondReel] = useState("");
  const [tickets, setTickets] = useState([]);
  const [stan, setStan] = useState("");
  const [mtStan, setMtStan] = useState("");
  const [erreur, setErreur] = useState("");
  const c = config.affaires[affaire];

  /* Le fond théorique proposé est celui de l'activité, corrigeable au cas par
     cas. Le fond réel, lui, ne se propose jamais : il ne se remplit que si
     quelqu'un a effectivement recompté le tiroir ce jour-là. */
  useEffect(() => {
    setFondSuppose(String(num((config.affaires[affaire] || {}).fonds) || ""));
    setFondReel("");
  }, [affaire, config]);

  if (!c) return <div className="card"><div className="empty">Aucune activité à créditer.</div></div>;

  /* Un STAN ne doit jamais revenir deux fois : c'est ce qui évite de compter
     un même ticket sur deux journées. */
  const dejaVus = new Map();
  (entries || []).filter((e) => e.type === "vente" && e.tickets)
    .forEach((e) => e.tickets.forEach((t) => dejaVus.set(String(t.stan), e.date)));

  const doublonAilleurs = stan.trim() && dejaVus.get(stan.trim());
  const doublonIci = tickets.some((t) => String(t.stan) === stan.trim());

  const sommeTickets = tickets.reduce((s, t) => s + num(t.montant), 0);
  /* Le cash compté EST la recette du jour : le fond de caisse ne s'en déduit
     plus. Son propre écart se contrôle à part, plus bas. */
  const recette = num(espece);
  const total = recette + num(carte);
  const ecartCB = tickets.length ? num(carte) - sommeTickets : 0;
  const fondVerifie = fondReel.trim() !== "";
  const ecartFonds = fondVerifie ? num(fondSuppose) - num(fondReel) : 0;

  const ajouterTicket = () => {
    if (doublonAilleurs || doublonIci) return;   /* déjà signalé juste en dessous */
    if (!stan.trim())      { setErreur("Numéro du ticket manquant."); return; }
    if (num(mtStan) <= 0)  { setErreur("Montant du ticket manquant."); return; }
    setErreur("");
    setTickets([...tickets, { stan: stan.trim(), montant: num(mtStan) }]);
    setStan(""); setMtStan("");
  };

  /* Une journée ne s'encaisse qu'une fois : même jour, même activité, même
     total, c'est une saisie faite deux fois. */
  const memeJournee = (entries || []).filter((e) => e.type === "vente"
      && e.affaire === affaire && (e.date || "") === date
      && Math.abs(num(e.montant) - total) < 0.01);

  const valider = async () => {
    if (total <= 0) {
      setErreur("Rien à enregistrer — écris le montant en espèces et/ou par carte.");
      return;
    }
    if (memeJournee.length > 0) {
      setErreur("Cette journée est déjà enregistrée : " + fmt(total) + " le "
        + date.slice(8, 10) + "/" + date.slice(5, 7)
        + ". Vérifie dans le Journal avant de saisir une seconde fois.");
      return;
    }
    setErreur("");
    /* On ne vide pas les champs avant d'être sûr : une coupure réseau ici
       effaçait des tickets saisis un à un, sous un message vert. */
    const ok = await onAdd({ type: "vente", date, affaire, montant: total,
            espece: recette, carte: num(carte),
            ...(fondVerifie ? { fondReel: num(fondReel), fondSuppose: num(fondSuppose) } : {}),
            ...(tickets.length ? { tickets } : {}) });
    if (ok === false) {
      setErreur("Pas enregistré — ne quitte pas cette page, vérifie ta connexion et réessaie.");
      return;
    }
    flash("Journée enregistrée.");
    setEspece(""); setCarte(""); setFondReel(""); setTickets([]); setStan(""); setMtStan("");
  };

  return (
    <div className="card">
      {!fixe && <Crest k={affaire} c={c} />}
      <div className="grid2">
        <div><label className="f">Jour</label>
          <input className="f" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        {!fixe && (
          <div><label className="f">Activité</label>
            <select className="f" value={affaire} onChange={(e) => setAffaire(e.target.value)}>
              {liste.map(([k, a]) => <option key={k} value={k}>{a.nom}</option>)}
            </select></div>
        )}
      </div>

      <div className="eyebrow" style={{ marginTop: 4, marginBottom: 10 }}>Ce qui a été compté</div>
      <div className="grid2">
        <div><label className="f">Cash compté</label>
          <input className="f" inputMode="decimal" value={espece}
                 onChange={(e) => setEspece(e.target.value)} /></div>
        <div><label className="f">CB compté</label>
          <input className="f" inputMode="decimal" value={carte}
                 onChange={(e) => setCarte(e.target.value)} /></div>
      </div>

      <div className="eyebrow" style={{ marginBottom: 10 }}>Tickets CB</div>
      {tickets.map((t, i) => (
        <div key={t.stan} className="row" style={{ padding: "9px 0" }}>
          <span className="lbl">STAN {t.stan}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="val">{fmt(t.montant)}</span>
            <button className="del" aria-label="Retirer"
                    onClick={() => setTickets(tickets.filter((_, j) => j !== i))}>×</button>
          </span>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginTop: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Numéro STAN</label>
          <input className="f" inputMode="numeric" value={stan}
                 onChange={(e) => setStan(e.target.value)} /></div>
        <div style={{ width: 130 }}>
          <label className="f">Montant</label>
          <input className="f" inputMode="decimal" value={mtStan}
                 onChange={(e) => setMtStan(e.target.value)}
                 onKeyDown={(e) => { if (e.key === "Enter") ajouterTicket(); }} /></div>
        <button className="pill" style={{ marginBottom: 1 }} onClick={ajouterTicket}>Ajouter</button>
      </div>
      <Alerte>{erreur}</Alerte>

      {(doublonAilleurs || doublonIci) && (
        <div className="mini" style={{ marginTop: 8, color: "#C9503A" }}>
          {doublonIci
            ? "Ce STAN est déjà dans la liste du jour."
            : "Ce STAN a déjà été saisi le " + doublonAilleurs.slice(8, 10) + "/"
              + doublonAilleurs.slice(5, 7) + ". Un ticket ne se compte qu'une fois."}
        </div>
      )}

      {tickets.length > 0 && (
        <div style={{ background: Math.abs(ecartCB) < 1 ? "#F1F7E6" : "#FBF3E4",
                      borderRadius: 13, padding: "13px 16px", marginTop: 14 }}>
          <div className="row" style={{ padding: "2px 0", borderBottom: "none" }}>
            <span className="lbl">{tickets.length} ticket{tickets.length > 1 ? "s" : ""}</span>
            <span className="val">{fmt(sommeTickets)}</span>
          </div>
          <div className="mini" style={{ marginTop: 5,
                color: Math.abs(ecartCB) < 1 ? "#5E8F1E" : "#C98A1E" }}>
            {Math.abs(ecartCB) < 1
              ? "Les tickets correspondent au CB compté."
              : ecartCB > 0
                ? "Il manque " + fmt(ecartCB) + " de tickets par rapport au CB compté."
                : "Les tickets dépassent le CB compté de " + fmt(-ecartCB) + "."}
          </div>
        </div>
      )}

      <div style={{ background: "#F5F8EC", borderRadius: 13, padding: "15px 17px", margin: "16px 0" }}>
        <div className="row" style={{ padding: "3px 0", borderBottom: "none" }}>
          <span className="lbl">Recette du jour</span>
          <span className="val" style={{ fontSize: 20 }}>{fmt(total)}</span>
        </div>
      </div>

      <div className="eyebrow" style={{ marginBottom: 10 }}>Contrôle du fond de caisse (optionnel)</div>
      <div className="grid2">
        <div><label className="f">Fond de caisse supposé</label>
          <input className="f" inputMode="decimal" value={fondSuppose}
                 onChange={(e) => setFondSuppose(e.target.value)} /></div>
        <div><label className="f">Fond de caisse réel</label>
          <input className="f" inputMode="decimal" placeholder="Si vérifié aujourd'hui" value={fondReel}
                 onChange={(e) => setFondReel(e.target.value)} /></div>
      </div>
      {fondVerifie && (
        <div className="mini" style={{ marginBottom: 14,
              color: ecartFonds > 0 ? "#C9503A" : ecartFonds < 0 ? "#8B9678" : "#5E8F1E" }}>
          {ecartFonds > 0
            ? "Il manque " + fmt(ecartFonds) + " dans le fond de caisse."
            : ecartFonds < 0
              ? fmt(-ecartFonds) + " en trop dans le fond de caisse."
              : "Le fond de caisse est conforme."}
        </div>
      )}

      <HorsMois date={date} defDate={defDate} />
      <Alerte>{erreur}</Alerte>
      <button className="btn" onClick={valider}>Enregistrer la journée</button>
      <div className="note">
        Le cash compté est directement la recette du jour — le fond de caisse ne s'en déduit
        plus. Ne renseigne le contrôle du fond de caisse que les jours où tu recomptes le
        tiroir : l'écart avec le montant théorique se suit dans Vue d'ensemble, sous chaque
        activité. Chaque numéro STAN est vérifié : s'il a déjà été saisi un autre jour, l'app
        le signale avant que le ticket ne soit compté deux fois.
      </div>
    </div>
  );
}

function FResa({ config, defDate, onAdd, flash, fixe, entries }) {
  const liste = hebergeurs(config);
  const [affaire, setAffaire] = useState(fixe || (liste[0] ? liste[0][0] : ""));
  const [date, setDate] = useState(defDate);
  const [source, setSource] = useState("airbnb");
  const [nuits, setNuits] = useState("");
  const [montant, setMontant] = useState("");
  const [reference, setReference] = useState("");
  const [aRecevoir, setARecevoir] = useState(false);
  const [erreur, setErreur] = useState("");

  const H = HEB(config, affaire);
  const c = config.affaires[affaire];
  const com = H ? num(montant) * num(source === "direct" ? H.comDirect : H.comAirbnb) / 100 : 0;

  const valider = () => {
    if (num(montant) <= 0) { setErreur(MSG_MONTANT); return; }
    if (num(nuits) <= 0)   { setErreur("Nombre de nuits manquant."); return; }
    /* Un code de séjour appartient à une seule réservation : saisi deux fois
       (par toi puis par SAIB), il gonflerait la recette. On refuse. */
    const refSaisie = reference.trim().toLowerCase();
    const dejaResa = refSaisie
      ? (entries || []).find((x) => x.type === "resa" && (x.reference || "").trim().toLowerCase() === refSaisie)
      : null;
    if (dejaResa) {
      setErreur("Code déjà enregistré : réservation du " + (dejaResa.date || "").slice(8, 10) + "/"
        + (dejaResa.date || "").slice(5, 7) + " · " + fmt(num(dejaResa.montant))
        + ". Pas enregistrée une seconde fois.");
      return;
    }
    setErreur("");
    onAdd({ type: "resa", date, affaire, source, nuits: num(nuits), montant: num(montant),
            reference: reference.trim(), aRecevoir });
    flash("Réservation enregistrée.");
    setNuits(""); setMontant(""); setReference(""); setARecevoir(false);
  };

  if (!H) return <div className="card"><div className="empty">Aucun hébergement configuré.</div></div>;

  return (
    <div className="card">
      {!fixe && <Crest k={affaire} c={c} />}
      {!fixe && liste.length > 1 && (
        <div style={{ marginBottom: 4 }}>
          <label className="f">Hébergement</label>
          <select className="f" value={affaire} onChange={(e) => setAffaire(e.target.value)}>
            {liste.map(([k, a]) => <option key={k} value={k}>{a.nom}</option>)}
          </select>
        </div>
      )}
      <div className="grid3">
        <div><label className="f">Arrivée</label>
          <input className="f" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div><label className="f">Venue par</label>
          <select className="f" value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="airbnb">Airbnb</option>
            <option value="direct">Réservation directe</option>
          </select></div>
        <div><label className="f">Nombre de nuits</label>
          <input className="f" inputMode="decimal" value={nuits}
                 onChange={(e) => setNuits(e.target.value)} /></div>
      </div>
      <div className="grid2">
        <div><label className="f">Prix du séjour</label>
          <input className="f" inputMode="decimal" value={montant}
                 onChange={(e) => setMontant(e.target.value)} /></div>
        <div><label className="f">Référence de séjour</label>
          <input className="f" placeholder="Code Airbnb" value={reference}
                 onChange={(e) => setReference(e.target.value)} /></div>
      </div>
      <div className="mini" style={{ marginBottom: 14 }}>
        Commission : {fmt(com)} · versé sur ton compte : {fmt(num(montant) - com)}
      </div>
      {/* Une réservation saisie le jour où elle est prise n'est pas de l'argent
          reçu. Tant qu'elle attend, elle ne gonfle ni la recette ni la caisse. */}
      <label className="f">L'argent est-il arrivé ?</label>
      <div style={{ display: "flex", gap: 9, marginBottom: 14, flexWrap: "wrap" }}>
        <button className={"pill" + (!aRecevoir ? " on" : "")}
                onClick={() => setARecevoir(false)}>Déjà encaissée</button>
        <button className={"pill" + (aRecevoir ? " on" : "")}
                onClick={() => setARecevoir(true)}>Pas encore encaissée</button>
      </div>
      <HorsMois date={date} defDate={defDate} />
      <Alerte>{erreur}</Alerte>
      <button className="btn" onClick={valider}>Enregistrer</button>
      <div className="note">
        Les repas et extras du séjour (petit-déj, dîner, boisson…) se saisissent à part, dans
        <strong> Repas &amp; extras</strong> — ils comptent dans la restauration, pas dans
        l'hébergement. La référence de séjour (le code Airbnb) permet de les rattacher à cette
        réservation.
      </div>
    </div>
  );
}

const NATURES_REPAS = [
  { id: "pdj",       nom: "Petit-déjeuner" },
  { id: "dej",       nom: "Déjeuner" },
  { id: "diner",     nom: "Dîner" },
  { id: "boisson",   nom: "Boisson" },
  { id: "excursion", nom: "Excursion" },
  { id: "transport", nom: "Transport" },
  { id: "autre",     nom: "Autre" },
];

/* Les repas et extras d'un séjour, comptés à part de la nuitée : ils
   font la restauration du riad, pas son hébergement. Un couvert vendu suit
   le tarif de l'activité ; un couvert offert n'entre jamais en recette,
   mais sa matière reste un vrai coût. */
function FRepas({ config, defDate, onAdd, flash, fixe }) {
  const liste = hebergeurs(config);
  const [affaire, setAffaire] = useState(fixe || (liste[0] ? liste[0][0] : ""));
  const [date, setDate] = useState(defDate);
  const [categorie, setCategorie] = useState("diner");
  const [couverts, setCouverts] = useState("1");
  const [montant, setMontant] = useState("");
  const [statut, setStatut] = useState("paye");
  const [motif, setMotif] = useState("");
  const [reference, setReference] = useState("");
  const [erreur, setErreur] = useState("");

  const H = HEB(config, affaire);
  const c = config.affaires[affaire];
  const X = (H && H.extras) || {};
  const tarifee = ["pdj", "dej", "diner"].includes(categorie);
  const prixUnitaire = tarifee && X[categorie] ? num(X[categorie].prix) : 0;

  useEffect(() => {
    if (tarifee) setMontant(String(prixUnitaire * num(couverts) || ""));
  }, [categorie, couverts, affaire]); // eslint-disable-line react-hooks/exhaustive-deps

  const valider = () => {
    if (statut === "paye" && num(montant) <= 0) { setErreur(MSG_MONTANT); return; }
    if (statut === "offert" && !motif.trim()) {
      setErreur("Motif de l'offre manquant — dis pourquoi le repas est offert.");
      return;
    }
    setErreur("");
    onAdd({ type: "repas", date, affaire, categorie, couverts: num(couverts),
            statut, motif: motif.trim(), reference: reference.trim(),
            montant: statut === "offert" ? 0 : num(montant) });
    flash("Repas enregistré.");
    setCouverts("1"); setMontant(""); setMotif(""); setReference("");
  };

  if (!H) return <div className="card"><div className="empty">Aucun hébergement configuré.</div></div>;

  return (
    <div className="card">
      {!fixe && <Crest k={affaire} c={c} />}
      {!fixe && liste.length > 1 && (
        <div style={{ marginBottom: 4 }}>
          <label className="f">Hébergement</label>
          <select className="f" value={affaire} onChange={(e) => setAffaire(e.target.value)}>
            {liste.map(([k, a]) => <option key={k} value={k}>{a.nom}</option>)}
          </select>
        </div>
      )}
      <div className="grid3">
        <div><label className="f">Date</label>
          <input className="f" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div><label className="f">Nature</label>
          <select className="f" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
            {NATURES_REPAS.map((n) => <option key={n.id} value={n.id}>{n.nom}</option>)}
          </select></div>
        <div><label className="f">Couverts</label>
          <input className="f" inputMode="decimal" value={couverts}
                 onChange={(e) => setCouverts(e.target.value)} /></div>
      </div>

      <div style={{ display: "flex", gap: 9, marginBottom: 14 }}>
        <button className={"pill" + (statut === "paye" ? " on" : "")}
                onClick={() => setStatut("paye")}>Payé par le voyageur</button>
        <button className={"pill" + (statut === "offert" ? " on" : "")}
                onClick={() => setStatut("offert")}>Offert</button>
      </div>

      {statut === "paye" ? (
        <div className="grid2">
          <div><label className="f">Montant</label>
            <input className="f" inputMode="decimal" value={montant}
                   onChange={(e) => setMontant(e.target.value)} /></div>
          <div><label className="f">Référence de séjour</label>
            <input className="f" placeholder="Code Airbnb" value={reference}
                   onChange={(e) => setReference(e.target.value)} /></div>
        </div>
      ) : (
        <div className="grid2">
          <div><label className="f">Motif de l'offre</label>
            <input className="f" placeholder="Geste commercial, incident…" value={motif}
                   onChange={(e) => setMotif(e.target.value)} /></div>
          <div><label className="f">Référence de séjour</label>
            <input className="f" placeholder="Code Airbnb" value={reference}
                   onChange={(e) => setReference(e.target.value)} /></div>
        </div>
      )}

      <HorsMois date={date} defDate={defDate} />
      <Alerte>{erreur}</Alerte>
      <button className="btn" onClick={valider}>Enregistrer</button>
      <div className="note">
        {tarifee
          ? "Le montant se propose au tarif de l'activité (" + fmt(prixUnitaire) + " × couverts), corrigeable au cas par cas."
          : "Boisson, excursion ou transport : le montant s'enregistre tel quel, sans matière calculée."}
        {" "}Un repas offert n'entre jamais dans la recette, mais garde son coût matière — pour les
        petits-déj, déjeuners et dîners.
      </div>
    </div>
  );
}

/* Les bons de livraison qu'une facture peut solder : ceux du même fournisseur,
   de la même activité, encore « à régler ». La facture REMPLACE ces BL, elle ne
   s'ajoute pas : on ne compte que l'écart entre son total et leur somme. */
function rapprochementBL(entries, affaire, fournisseurId, totalFacture, exclus) {
  const bls = fournisseurId
    ? (entries || []).filter((e) => e.type === "depense" && e.aPayer && e.piece === "bl" && !e.facture
        && e.affaire === affaire && e.fournisseur === fournisseurId)
        .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
    : [];
  const choisis = bls.filter((b) => !(exclus || []).includes(b.id));
  const somme = choisis.reduce((s, b) => s + num(b.montant), 0);
  const ecart = Math.round((num(totalFacture) - somme) * 100) / 100;
  return { bls, choisis, somme, ecart };
}

function FDepense({ config, defDate, onAdd, flash, deja, fixe, entries }) {
  const [date, setDate] = useState(defDate);
  const [affaire, setAffaire] = useState(fixe || "sabich");
  const [choix, setChoix] = useState("");
  const [lbl, setLbl] = useState("");
  const [montant, setMontant] = useState("");
  /* La norme, c'est la livraison : si on oublie de choisir, c'est un BL,
     à payer plus tard avec la facture du fournisseur. */
  const [piece, setPiece] = useState("bl");
  const [numero, setNumero] = useState("");
  const [aPayer, setAPayer] = useState(true);
  /* Pendant l'enregistrement, la pièce apparaît déjà dans la liste : sans ce
     drapeau, l'app criait « numéro déjà enregistré » sur la pièce qu'elle
     venait elle-même d'enregistrer, et un second clic était refusé. */
  const [envoi, setEnvoi] = useState(false);
  const [poche, setPoche] = useState("");
  const [exceptionnel, setExceptionnel] = useState(false);
  const [marchandise, setMarchandise] = useState(false);
  const [erreur, setErreur] = useState("");

  const liste = (config.fournisseurs || []).filter((f) => (f.affaires || []).includes(affaire));
  const courant = liste.find((f) => f.id === choix);

  const [rapprocher, setRapprocher] = useState(true);
  const [exclus, setExclus] = useState([]);
  const rap = rapprochementBL(entries, affaire, piece === "facture" && courant ? courant.id : null,
                              montant, exclus);
  const actif = rap.bls.length > 0 && rapprocher && rap.choisis.length > 0;

  /* Un numéro de pièce appartient à une seule livraison. Le même numéro chez le
     même fournisseur, c'est la même marchandise : soit le bon de livraison et sa
     facture, soit une double saisie — dans les deux cas le coût matière serait
     compté deux fois. L'app refuse, elle ne se contente plus de prévenir.
     La comparaison ignore les espaces, la casse et les zéros de tête, sinon
     « 000148 » et « 00148 » passent pour deux pièces différentes. */
  const clefNumero = (v) => String(v || "").replace(/\s/g, "").toLowerCase()
                                           .replace(/^0+(?=.)/, "");
  const clefTiers = (fid, libelle) => fid
    ? "f:" + fid : "l:" + String(libelle || "").trim().toLowerCase();
  const tiersCourant = clefTiers(courant ? courant.id : null, lbl);
  const dejaSaisi = clefNumero(numero)
    ? (entries || []).filter((e) => e.type === "depense" && e.affaire === affaire
        && clefNumero(e.numero) === clefNumero(numero)
        && clefTiers(e.fournisseur, e.lbl) === tiersCourant)
    : [];
  /* Même chez un fournisseur connu, savoir CE QU'ON a acheté : « Épicerie pro »
     tout court ne dit rien trois semaines plus tard. */
  const nomTiers = courant
    ? (lbl.trim() ? courant.nom + " — " + lbl.trim() : courant.nom)
    : (lbl.trim() || "Dépense");
  const rappel = (e) => (e.piece === "bl" ? "Bon de livraison" : e.piece === "bon" ? "Bon" : "Facture")
    + " du " + (e.date || "").slice(8, 10) + "/" + (e.date || "").slice(5, 7)
    + " · " + fmt(num(e.montant));

  /* Même jour, même montant, même intitulé : c'est deux fois la même chose.
     L'app refuse, plutôt que de gonfler le coût matière en silence. */
  const memeLigne = (entries || []).filter((e) => e.type === "depense"
      && e.affaire === affaire && (e.date || "") === date
      && Math.abs(num(e.montant) - num(montant)) < 0.01
      && String(e.lbl || "").trim().toLowerCase() === nomTiers.trim().toLowerCase());

  const valider = async () => {
    if (envoi) return;
    if (num(montant) <= 0) {
      setErreur("Montant manquant — écris le montant en chiffres avant d'enregistrer.");
      return;
    }
    if (!courant && !lbl.trim()) {
      setErreur("Intitulé manquant — écris ce qui a été acheté, sinon on ne le retrouvera pas.");
      return;
    }
    if (courant && ["bl", "facture"].includes(piece) && !numero.trim()) {
      setErreur("Numéro manquant — recopie le numéro " + (piece === "bl" ? "du bon de livraison" : "de la facture")
        + ". S'il n'y en a pas, ajoute-le au stylo sur le papier (1, 2, 3…) et saisis-le ici.");
      return;
    }
    if (memeLigne.length > 0) {
      setErreur("Déjà saisi : " + nomTiers + ", " + fmt(num(montant)) + ", le "
        + date.slice(8, 10) + "/" + date.slice(5, 7)
        + ". Si c'est bien un second achat identique le même jour, ajoute un mot "
        + "dans l'intitulé pour les distinguer.");
      return;
    }
    if (dejaSaisi.length > 0) {
      setErreur("Numéro déjà enregistré pour " + nomTiers + " : "
        + dejaSaisi.map(rappel).join(" — ")
        + ". Change le numéro, ou corrige la pièce existante depuis l'onglet Achats.");
      return;
    }
    setErreur("");
    const nom = nomTiers;
    const pocheSortie = aPayer ? "" : (poche || caisseDe(config, affaire));
    /* Une facture qui solde des BL : elle ne s'ajoute pas au coût, seul l'écart
       compte. Les BL passent en réglés si la facture l'est, sinon ils restent dus. */
    const ids = actif ? rap.choisis.map((b) => b.id) : [];
    setEnvoi(true);
    const ok = await onAdd(actif
      ? { type: "depense", date, affaire, categorie: "matiere",
          fournisseur: courant.id, piece, numero: numero.trim(), aPayer, exceptionnel,
          poche: pocheSortie,
          lbl: nom + " — facture solde " + ids.length + " BL",
          montant: rap.ecart, totalFacture: num(montant), blsSoldes: ids,
          solde: { ids, champs: { facture: numero.trim(), factureLe: date,
                    ...(aPayer ? {} : { aPayer: false, regleLe: aujourdhui(), poche: pocheSortie }) } } }
      : { type: "depense", date, affaire,
            categorie: (courant || piece === "bl" || marchandise) ? "matiere" : "autre",
            fournisseur: courant ? courant.id : null,
            piece, numero: numero.trim(), aPayer, exceptionnel,
            poche: pocheSortie,
            lbl: nom, montant: num(montant) });
    if (ok === false) {
      setEnvoi(false);
      setErreur("Pas enregistré — ne quitte pas cette page, vérifie ta connexion et réessaie.");
      return;
    }
    flash(nom + " — enregistré.");
    setNumero(""); setEnvoi(false);
    setMontant(""); setLbl(""); setNumero(""); setExceptionnel(false); setMarchandise(false);
  };

  return (
    <div className="card">
      {!fixe && config.affaires[affaire] && <Crest k={affaire} c={config.affaires[affaire]} />}

      <label className="f">Que veux-tu saisir ?</label>
      <div style={{ display: "flex", gap: 9, marginBottom: 6, flexWrap: "wrap" }}>
        <button className={"pill" + (piece === "bl" ? " on" : "")}
                onClick={() => { setPiece("bl"); setAPayer(true); setErreur(""); }}>Une livraison</button>
        <button className={"pill" + (piece === "facture" ? " on" : "")}
                onClick={() => { setPiece("facture"); setAPayer(false); setErreur(""); }}>Une facture du fournisseur</button>
        <button className={"pill" + (piece === "bon" ? " on" : "")}
                onClick={() => { setPiece("bon"); setAPayer(false); setErreur(""); }}>Un achat payé sur place</button>
      </div>
      <div className="mini" style={{ marginBottom: 16 }}>
        {piece === "bl" ? "Le bon de livraison que le fournisseur te laisse : rien à payer maintenant, tu règles sa facture en fin de mois."
          : piece === "facture" ? "La facture que le fournisseur t'envoie (en fin de mois, en général). Elle remplace ses bons de livraison."
          : "Un achat réglé tout de suite, avec un ticket ou sans papier (pain, courses, petite réparation)."}
      </div>

      <div className={fixe ? "" : "grid2"}>
        {!fixe && (
          <div><label className="f">Activité</label>
            <select className="f" value={affaire}
                    onChange={(e) => { setAffaire(e.target.value); setChoix(""); }}>
              {Object.entries(config.affaires).map(([k, a]) => <option key={k} value={k}>{a.nom}</option>)}
              <option value="structure">Structure (société, impôts…)</option>
            </select></div>
        )}
        <div style={{ marginBottom: 12 }}><label className="f">Date de la pièce</label>
          <input className="f" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      </div>

      {liste.length > 0 && (
        <>
          <label className="f">Fournisseur</label>
          <div className="navSimple" style={{ marginBottom: 14 }}>
            {liste.map((f) => {
              return (
                <button key={f.id} className={"pill" + (choix === f.id ? " on" : "")}
                        onClick={() => setChoix(f.id)}>
                  {f.nom}
                </button>
              );
            })}
            <button className={"pill" + (choix === "" ? " on" : "")} onClick={() => setChoix("")}>
              Autre dépense
            </button>
          </div>
        </>
      )}

      <div className="grid2">
        <div><label className="f">Intitulé</label>
          <input className="f"
                 placeholder={courant ? "Ce que tu as acheté" : "Facture d'électricité, gaz, réparation…"}
                 value={lbl} onChange={(e) => { setLbl(e.target.value); setErreur(""); }} /></div>
        <div><label className="f">Montant</label>
          <input className="f" inputMode="decimal" value={montant}
                 onChange={(e) => { setMontant(e.target.value); setErreur(""); }} /></div>
      </div>

      {!courant && piece !== "bl" && (
        <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
          <button className={"pill" + (marchandise ? " on" : "")}
                  onClick={() => setMarchandise(!marchandise)}>
            {marchandise ? "✓ " : ""}Marchandise (nourriture, boissons, ingrédients)
          </button>
          <span className="mini">Non cochée = charge (nettoyage, réparation, électricité…)</span>
        </div>
      )}

      {piece !== "bon" && (
        <div style={{ marginBottom: 14 }}>
          <label className="f">{piece === "bl" ? "Numéro du bon de livraison" : "Numéro de la facture"} (obligatoire)</label>
          <input className="f" placeholder={piece === "bl" ? "N° du BL — s'il n'y en a pas, numérote au stylo : 1, 2, 3…" : "N° de facture"}
                 value={numero} onChange={(e) => { setNumero(e.target.value); setErreur(""); }} />
        </div>
      )}

      {dejaSaisi.length > 0 && !envoi && (
        <div style={{ background: "#FDECEC", color: "#A4262C", borderRadius: 10,
                      padding: "10px 12px", marginBottom: 14, fontSize: 15.5 }}>
          Ce numéro est déjà enregistré pour {nomTiers} : {dejaSaisi.map(rappel).join(" — ")}.
          Cette pièce ne sera pas enregistrée une seconde fois.
        </div>
      )}

      {piece === "facture" && (
        <>
          <label className="f">Réglée ?</label>
          <div style={{ display: "flex", gap: 9, marginBottom: 14, flexWrap: "wrap" }}>
            <button className={"pill" + (!aPayer ? " on" : "")}
                    onClick={() => setAPayer(false)}>Déjà payée</button>
            <button className={"pill" + (aPayer ? " on" : "")}
                    onClick={() => setAPayer(true)}>À payer plus tard</button>
          </div>
          {/* Payée avec quoi : le tiroir du comptoir par défaut, puisque c'est
              le cas courant. Un geste pour dire « par virement ». */}
          {!aPayer && (
            <>
              <label className="f">Payée depuis</label>
              <select className="f" style={{ marginBottom: 14 }}
                      value={poche || caisseDe(config, affaire)}
                      onChange={(e) => setPoche(e.target.value)}>
                {lesPoches(config).map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
              </select>
            </>
          )}
        </>
      )}
      {piece === "bon" && (
        <>
          <label className="f">Payé depuis</label>
          <select className="f" style={{ marginBottom: 14 }}
                  value={poche || caisseDe(config, affaire)}
                  onChange={(e) => setPoche(e.target.value)}>
            {lesPoches(config).map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </select>
        </>
      )}
      {piece === "bl" && (
        <div className="mini" style={{ marginBottom: 14, color: "#B07C1E" }}>
          Un bon de livraison part toujours en « à régler ». Tu solderas le fournisseur d'un
          seul geste le jour où tu paies sa facture.
        </div>
      )}

      {piece === "bl" && !courant && liste.length > 0 && (
        <div className="mini" style={{ marginBottom: 14, color: "#C9503A" }}>
          Choisis le fournisseur dans la liste : sans lui, sa facture de fin de mois ne pourra
          pas solder ce bon de livraison.
        </div>
      )}

      {piece === "facture" && rap.bls.length > 0 && (
        <div style={{ background: "#FDF6E7", border: "1px solid #E9D9AE", borderRadius: 12,
                      padding: "12px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#8A6A1C" }}>
            {rap.bls.length} bon{rap.bls.length > 1 ? "s" : ""} de livraison non payé
            {rap.bls.length > 1 ? "s" : ""} chez {courant.nom}
          </div>
          <div style={{ display: "flex", gap: 9, margin: "10px 0", flexWrap: "wrap" }}>
            <button className={"pill" + (rapprocher ? " on" : "")}
                    onClick={() => setRapprocher(true)}>Cette facture les solde</button>
            <button className={"pill" + (!rapprocher ? " on" : "")}
                    onClick={() => setRapprocher(false)}>Non, autre achat</button>
          </div>
          {rapprocher && (
            <>
              {rap.bls.map((b) => {
                const pris = !exclus.includes(b.id);
                return (
                  <div className="row" key={b.id}>
                    <span className="lbl" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Coche paye={pris} onClick={() => setExclus(pris ? [...exclus, b.id]
                                                                       : exclus.filter((x) => x !== b.id))} />
                      <span>BL du {(b.date || "").slice(8, 10)}/{(b.date || "").slice(5, 7)}
                        {b.numero ? " · n° " + b.numero : ""}</span>
                    </span>
                    <span className="val">{fmt(num(b.montant))}</span>
                  </div>
                );
              })}
              <div className="row rowTot">
                <span className="lbl">Total des BL cochés</span>
                <span className="val">{fmt(rap.somme)}</span>
              </div>
              {num(montant) > 0 && (
                <div className="mini" style={{ marginTop: 8, color: "#8A6A1C" }}>
                  {Math.abs(rap.ecart) < 1
                    ? "La facture correspond exactement aux BL : aucun coût en plus."
                    : rap.ecart > 0
                      ? "La facture dépasse les BL de " + fmt(rap.ecart) + " : seul cet écart s'ajoute au coût. À vérifier avec le fournisseur."
                      : "La facture est plus basse que les BL de " + fmt(-rap.ecart) + " : le coût du mois baisse d'autant."}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Un achat qui ne reviendra pas le mois prochain ne doit pas peser dans
          ce qu'on croit être le coût normal du mois. */}
      <label className="f">Ça revient tous les mois ?</label>
      <div style={{ display: "flex", gap: 9, marginBottom: 6, flexWrap: "wrap" }}>
        <button className={"pill" + (!exceptionnel ? " on" : "")}
                onClick={() => setExceptionnel(false)}>Achat courant</button>
        <button className={"pill" + (exceptionnel ? " on" : "")}
                onClick={() => setExceptionnel(true)}>Exceptionnel</button>
      </div>
      <div className="mini" style={{ marginBottom: 14 }}>
        Exceptionnel : des travaux, une réparation, un achat qui ne se répétera pas.
        Il sortira du « mois ordinaire ».
      </div>

      <HorsMois date={date} defDate={defDate} />
      <Alerte>{erreur}</Alerte>
      <button className="btn" onClick={valider}>Enregistrer</button>
      <div className="note">
        Chaque fournisseur a son rythme : le pain à la semaine, le boucher au mois, l'épicerie au besoin.
        Saisis quand la facture arrive — le chiffre à côté du nom montre ce que tu lui as déjà payé ce mois-ci.
        Saisis le bon de livraison le soir même : en fin de mois tu vérifieras la facture du
        fournisseur au lieu de la découvrir. Le numéro permet de retrouver la pièce quand le
        comptable la demande.
      </div>
    </div>
  );
}

function FAvance({ defDate, onAdd, flash, config, natureFixe, entries }) {
  const [date, setDate] = useState(defDate);
  const [nature, setNature] = useState(natureFixe || "salaire");
  const [ref, setRef] = useState("");
  const [qui, setQui] = useState("");
  const [montant, setMontant] = useState("");
  const [precision, setPrecision] = useState("");
  const [erreur, setErreur] = useState("");

  const salaries = (config.fixes || []).filter((f) => f.sal);
  const perso = salaries.find((s) => s.id === ref);

  /* Chaque avance d'une personne porte un numéro dans le mois (n°1, n°2…) :
     on voit tout de suite combien ont été données, et une saisie en double saute aux yeux. */
  const duMois = (entries || []).filter((e) => e.type === "avance" && e.nature === nature
    && (e.date || "").slice(0, 7) === (date || "").slice(0, 7)
    && (nature === "salaire" ? e.ref === ref : String(e.qui || "").trim().toLowerCase() === qui.trim().toLowerCase()));
  const prochain = duMois.length + 1;

  const valider = () => {
    if (num(montant) <= 0) { setErreur(MSG_MONTANT); return; }
    /* Une avance sans nom ne se déduit d'aucune paie : l'argent est perdu. */
    if (nature === "salaire" && !ref) {
      setErreur("Choisis la personne — sans elle, l'avance ne sera déduite d'aucun salaire.");
      return;
    }
    /* Même personne, même jour, même montant, même précision : c'est deux fois la
       même avance. L'app refuse ; pour une vraie seconde avance, ajoute un mot. */
    const jumelle = duMois.find((e) => e.date === date && Math.abs(num(e.montant) - num(montant)) < 0.01
      && String(e.precision || "").trim().toLowerCase() === precision.trim().toLowerCase());
    if (jumelle) {
      setErreur("Déjà saisi : avance n°" + (jumelle.numero || "?") + ", " + fmt(num(montant)) + ", le "
        + date.slice(8, 10) + "/" + date.slice(5, 7)
        + ". Si c'est bien une seconde avance identique, ajoute un mot dans « Précision » (ex. « le soir »).");
      return;
    }
    setErreur("");
    onAdd({ type: "avance", date, nature, numero: prochain, precision: precision.trim(),
            affaire: nature === "perso" ? "foyer" : null,
            ref: nature === "salaire" ? ref : null,
            qui: nature === "salaire" ? (perso ? perso.lbl : "—") : (qui || "—"),
            montant: num(montant) });
    flash("Avance n°" + prochain + " enregistrée.");
    setQui(""); setMontant(""); setPrecision("");
  };

  return (
    <div className="card">
      <h2 className="h2">{natureFixe === "perso" ? "Enregistrer un prélèvement" : "Enregistrer une avance"}</h2>
      <div className="grid3">
        <div><label className="f">Date</label>
          <input className="f" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        {!natureFixe && (
          <div><label className="f">Nature</label>
            <select className="f" value={nature} onChange={(e) => setNature(e.target.value)}>
              <option value="salaire">Avance sur salaire</option>
              <option value="perso">Prélèvement exceptionnel</option>
            </select></div>
        )}
        <div><label className="f">Montant</label>
          <input className="f" inputMode="decimal" value={montant} onChange={(e) => setMontant(e.target.value)} /></div>
      </div>
      <div style={{ marginBottom: 12 }}>
        {nature === "salaire" ? (
          <>
            <label className="f">Pour qui</label>
            <select className="f" value={ref} onChange={(e) => setRef(e.target.value)}>
              <option value="">— choisis la personne —</option>
              {salaries.map((s) => <option key={s.id} value={s.id}>{s.lbl}</option>)}
            </select>
          </>
        ) : (
          <>
            <label className="f">Pour quoi</label>
            <input className="f" placeholder="Réparation voiture, santé…"
                   value={qui} onChange={(e) => setQui(e.target.value)} />
          </>
        )}
      </div>
      <div style={{ marginBottom: 12 }}><label className="f">Précision (facultatif)</label>
        <input className="f" placeholder="Pour distinguer deux avances identiques" value={precision}
               onChange={(e) => { setPrecision(e.target.value); setErreur(""); }} /></div>
      {duMois.length > 0 && (
        <div className="mini" style={{ marginBottom: 12 }}>
          Déjà ce mois-ci : {duMois.map((e) => "n°" + (e.numero || "?") + " " + fmt(num(e.montant))
            + " (" + (e.date || "").slice(8, 10) + "/" + (e.date || "").slice(5, 7) + ")").join(" · ")}.
          Celle-ci sera la n°{prochain}.
        </div>
      )}
      <Alerte>{erreur}</Alerte>
      <button className="btn" onClick={valider}>Enregistrer</button>
      <div className="note">
        Choisis bien la personne : c'est ce qui permet à l'écran <strong>La paie</strong> de déduire
        l'avance du solde à lui verser en fin de mois. Une avance n'est jamais une charge de plus —
        le salaire complet l'est déjà.
      </div>
    </div>
  );
}

/* Une dépense de la maison au-delà des salaires, prise dans la caisse d'une affaire. */
function FExtra({ config, defDate, onAdd, flash }) {
  const affs = Object.keys(config.affaires).filter((k) => !config.affaires[k].archive)
    .sort((a, b) => rangOnglet(a) - rangOnglet(b));
  const [date, setDate] = useState(defDate);
  const [source, setSource] = useState(affs[0] || "");
  const [quoi, setQuoi] = useState("");
  const [montant, setMontant] = useState("");
  const [erreur, setErreur] = useState("");
  const valider = () => {
    if (num(montant) <= 0) { setErreur(MSG_MONTANT); return; }
    if (!quoi.trim()) { setErreur("Écris pour quoi — santé, cadeau, réparation…"); return; }
    setErreur("");
    onAdd({ type: "avance", nature: "perso", date, affaire: "foyer", source, qui: quoi.trim(),
            poche: caisseDe(config, source) || undefined, montant: num(montant) });
    flash("Dépense de " + fmt(num(montant)) + " enregistrée, prise sur " + config.affaires[source].nom + ".");
  };
  return (
    <div style={{ marginTop: 14 }}>
      <div className="grid3">
        <div><label className="f">Date</label>
          <input className="f" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div><label className="f">Pris sur</label>
          <select className="f" value={source} onChange={(e) => setSource(e.target.value)}>
            {affs.map((k) => <option key={k} value={k}>{config.affaires[k].nom}</option>)}
          </select></div>
        <div><label className="f">Montant</label>
          <input className="f" inputMode="decimal" value={montant}
                 onChange={(e) => { setMontant(e.target.value); setErreur(""); }} /></div>
      </div>
      <div style={{ marginBottom: 12 }}><label className="f">Pour quoi</label>
        <input className="f" placeholder="Santé, cadeau, réparation…" value={quoi}
               onChange={(e) => { setQuoi(e.target.value); setErreur(""); }} /></div>
      <Alerte>{erreur}</Alerte>
      <button className="btn" onClick={valider}>Enregistrer</button>
    </div>
  );
}

function FInvest({ config, defDate, onAdd, flash, fixe }) {
  const [date, setDate] = useState(defDate);
  const [affaire, setAffaire] = useState(fixe || "taam");
  const [lbl, setLbl] = useState("");
  const [montant, setMontant] = useState("");
  const [poche, setPoche] = useState("");
  const [erreur, setErreur] = useState("");

  const valider = () => {
    if (num(montant) <= 0) {
      setErreur("Montant manquant — écris le montant en chiffres avant d'enregistrer.");
      return;
    }
    setErreur("");
    onAdd({ type: "invest", date, affaire, lbl: lbl || "Investissement", montant: num(montant),
            poche: poche || caisseDe(config, affaire) });
    flash("Investissement enregistré.");
    setLbl(""); setMontant("");
  };

  return (
    <div className="card">
      {!fixe && config.affaires[affaire] && <Crest k={affaire} c={config.affaires[affaire]} />}
      <div className={fixe ? "grid2" : "grid3"}>
        <div><label className="f">Date</label>
          <input className="f" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        {!fixe && (
          <div><label className="f">Activité</label>
            <select className="f" value={affaire} onChange={(e) => setAffaire(e.target.value)}>
              {Object.entries(config.affaires).map(([k, a]) => <option key={k} value={k}>{a.nom}</option>)}
            </select></div>
        )}
        <div><label className="f">Payé depuis</label>
          <select className="f" value={poche || caisseDe(config, affaire)}
                  onChange={(e) => setPoche(e.target.value)}>
            {lesPoches(config).map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </select></div>
        <div><label className="f">Montant</label>
          <input className="f" inputMode="decimal" value={montant} onChange={(e) => { setMontant(e.target.value); setErreur(""); }} /></div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label className="f">Quoi</label>
        <input className="f" placeholder="Travaux du local, machine à café, packaging" value={lbl} onChange={(e) => setLbl(e.target.value)} />
      </div>
      <HorsMois date={date} defDate={defDate} />
      <Alerte>{erreur}</Alerte>
      <button className="btn" onClick={valider}>Enregistrer</button>
      <div className="note">
        Ce que tu achètes une fois et que tu gardes : ça sort de la caisse mais ce n'est pas une charge
        du mois. Le suivre à part évite de croire qu'un mois d'investissement est un mauvais mois.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AFFAIRES                                                           */
/* ------------------------------------------------------------------ */

function GroupeCharges({ g, onRegler, onReporter }) {
  const solde = g.reste === 0;
  const [ouvert, setOuvert] = useState(!solde);

  return (
    <div style={{ marginBottom: 10, border: "1px solid #E3E8D8", borderRadius: 12,
                  overflow: "hidden" }}>
      <button onClick={() => setOuvert(!ouvert)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12,
                       padding: "13px 15px", border: "none", cursor: "pointer",
                       background: solde ? "#F3F7EA" : "#FBFCF7", font: "inherit",
                       textAlign: "left" }}>
        <span style={{ width: 6, height: 30, borderRadius: 3, flex: "none", background: g.couleur }} />
        {g.logo && LOGOS[g.logo]
          ? <img src={LOGOS[g.logo]} alt={g.nom}
                 style={{ height: g.logo === "riad" ? 34 : 24, width: "auto",
                          maxWidth: 110, objectFit: "contain" }} />
          : <span style={{ fontSize: 17, fontWeight: 500 }}>{g.nom}</span>}
        <span style={{ flex: 1 }} />
        {solde
          ? <span className="pos" style={{ fontSize: 15.5 }}>Tout est payé ✓</span>
          : <span style={{ fontSize: 18, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
              {fmt(g.reste)}
            </span>}
        <span className="mini">{ouvert ? "▾" : "▸"}</span>
      </button>

      {ouvert && (
        <div style={{ padding: "2px 15px 8px" }}>
          {g.lignes.map((l) => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 10,
                                     padding: "10px 0", borderBottom: "1px solid #F2F5EA" }}>
              <button onClick={() => onRegler(l.id, !l.paye)}
                      style={{ display: "flex", alignItems: "center", gap: 11, border: "none",
                               background: "none", cursor: "pointer", font: "inherit",
                               padding: 0, textAlign: "left", flex: 1 }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, flex: "none",
                               border: "1.5px solid " + (l.paye ? "#6BA023" : l.retard ? "#D9A03F" : "#C6D2AC"),
                               background: l.paye ? "#6BA023" : "#fff", color: "#fff",
                               display: "flex", alignItems: "center", justifyContent: "center",
                               fontSize: 15 }}>{l.paye ? "✓" : ""}</span>
                <span style={{ fontSize: 16, color: l.paye ? "#9AA487" : l.retard ? "#B07C1E" : "#5F6E4C",
                               textDecoration: l.paye ? "line-through" : "none" }}>{l.lbl}</span>
              </button>
              {!l.paye && (
                <button onClick={() => onReporter(l.id)} title="Reporter sur le mois suivant"
                        style={{ border: "1px solid #DCE2CE", background: "#fff", cursor: "pointer",
                                 borderRadius: 7, padding: "4px 10px", fontSize: 14,
                                 color: "#8A9578", font: "inherit" }}>→</button>
              )}
              <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 16,
                             color: l.paye ? "#9AA487" : "#38452F" }}>{fmt(l.montant)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ titre, montant, lignes }) {
  const [ouvert, setOuvert] = useState(false);
  const utiles = (lignes || []).filter(([, v]) => v > 0);
  return (
    <>
      <button onClick={() => setOuvert(!ouvert)}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                       width: "100%", gap: 12, padding: "11px 0", fontSize: 16.5,
                       borderTop: "none", borderLeft: "none", borderRight: "none",
                       borderBottom: "1px solid #EFF2E7", background: "none",
                       cursor: "pointer", font: "inherit", textAlign: "left" }}>
        <span style={{ color: "#5F6E4C" }}>
          {titre} <span className="mini">{ouvert ? "▾" : "▸"}</span>
        </span>
        <span className="val neg">− {fmt(montant)}</span>
      </button>
      {ouvert && (
        <div style={{ background: "#F7FAF0", borderRadius: 10, padding: "8px 14px", margin: "2px 0 8px" }}>
          {utiles.map(([l, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between",
                                  padding: "7px 0", fontSize: 15.5, color: "#5F6E4C" }}>
              <span>{l}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(v)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function SaisieActivite({ k, c, config, ym, onAdd, deja, entries }) {
  const [form, setForm] = useState(null);
  const [ok, setOk] = useState("");
  const flash = (m) => { setOk(m); setTimeout(() => setOk(""), 2600); };
  const defDate = ym === thisMonth() ? today() : ym + "-01";

  const choix = c.type === "hebergement"
    ? [["resa", "Réservation"], ["repas", "Repas & extras"], ["depense", "Achat"], ["invest", "Investissement"]]
    : [["vente", "Recette"], ["depense", "Achat"], ["invest", "Investissement"]];

  /* On ne referme le formulaire qu'une fois la saisie vraiment enregistrée. */
  const ajouter = async (e) => { const ok = await onAdd(e); if (ok !== false) setForm(null); return ok; };

  return (
    <div style={{ marginBottom: 18 }}>
      <div className="eyebrow surMarque" style={{ marginBottom: 9 }}>Enregistrer</div>
      <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
        {choix.map(([id, lbl]) => {
          const actif = form === id;
            /* Le bouton doit rester net sur le bandeau coloré de sa page :
               un fond nacré très clair, quelle que soit la marque, pour
               qu'il se détache toujours — jamais la couleur du fond derrière. */
            const fond = (BOUTON[k] && BOUTON[k].fond) || c.bouton || melange(c.marque, "#FFFFFF", .88);
            const clair = contraste(fond, "#FFFFFF") < 3;
            const encreBtn = (BOUTON[k] && BOUTON[k].texte) || (clair ? lisible(c.marque, 7) : "#FFFFFF");
            return (
            <button key={id} className={"btnSaisie" + (actif ? " ouvert" : "")}
                    onClick={() => setForm(actif ? null : id)}
                    style={{ background: fond, color: encreBtn,
                             textShadow: clair ? "none" : "0 1px 1px rgba(0,0,0,.16)",
                             boxShadow: actif
                               ? "inset 0 0 0 2.5px " + (clair ? "rgba(60,40,25,.42)"
                                                              : "rgba(255,255,255,.85)")
                               : "none" }}>
              <span className="plus">{actif ? "×" : "+"}</span> {lbl}
            </button>
          );
        })}
      </div>

      {ok && <div className="pos" style={{ marginTop: 12, fontSize: 16 }}>{ok}</div>}

      {form && (
        <div style={{ background: c.tint, borderRadius: 12, padding: "4px 16px 16px",
                      marginTop: 12 }}>
          {form === "vente"   && <FVente   config={config} defDate={defDate} onAdd={ajouter} flash={flash} fixe={k} entries={entries} />}
          {form === "resa"    && <FResa    config={config} defDate={defDate} onAdd={ajouter} flash={flash} fixe={k} entries={entries} />}
          {form === "repas"   && <FRepas   config={config} defDate={defDate} onAdd={ajouter} flash={flash} fixe={k} />}
          {form === "depense" && <FDepense config={config} defDate={defDate} onAdd={ajouter} flash={flash} deja={deja} fixe={k} entries={entries} />}
          {form === "invest"  && <FInvest  config={config} defDate={defDate} onAdd={ajouter} flash={flash} fixe={k} />}
        </div>
      )}
    </div>
  );
}

/* Les dettes fournisseurs ne connaissent pas les mois : un bon de livraison d'août
   reste dû en septembre. L'ancienne version filtrait sur le mois affiché — les
   pièces d'un autre mois étaient invisibles ET le bouton « Régler » ne pouvait pas
   les atteindre. Elle ignorait aussi les pièces saisies en « Autre dépense », sans
   fournisseur : celles-là n'étaient soldables nulle part, jamais. */
function ARegler({ config, affaire, entries, ym, onSolder }) {
  const liste = (config.fournisseurs || []).filter((f) => (f.affaires || []).includes(affaire));
  const nomFournisseur = (fid) => (liste.find((f) => f.id === fid) || {}).nom;

  const ouvertes = (entries || []).filter((e) => e.type === "depense" && e.aPayer
                                                 && e.affaire === affaire);
  /* Regroupées par fournisseur quand il y en a un, par intitulé sinon. */
  const paquets = [];
  ouvertes.forEach((e) => {
    const cle = e.fournisseur || ("lbl:" + (e.lbl || "Sans intitulé"));
    let g = paquets.find((x) => x.cle === cle);
    if (!g) {
      g = { cle, nom: (e.fournisseur && nomFournisseur(e.fournisseur)) || e.lbl || "Sans intitulé",
            lignes: [] };
      paquets.push(g);
    }
    g.lignes.push(e);
  });
  paquets.forEach((g) => {
    g.lignes.sort((a, b) => (a.date < b.date ? -1 : 1));
    g.total = g.lignes.reduce((s, e) => s + num(e.montant), 0);
    g.vieilles = g.lignes.filter((e) => !(e.date || "").startsWith(ym)).length;
  });
  paquets.sort((a, b) => b.total - a.total);

  if (!paquets.length) return null;
  const somme = paquets.reduce((s, g) => s + g.total, 0);
  const vieillesTotal = paquets.reduce((s, g) => s + g.vieilles, 0);
  const jour = (d) => (d || "").slice(8, 10) + "/" + (d || "").slice(5, 7);

  return (
    <div className="card" style={{ background: "#FDF6E7", borderColor: "#E9D9AE" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline",
                    marginBottom: 14, gap: 12 }}>
        <span style={{ fontSize: 19, fontWeight: 500, color: "#B07C1E" }}>Dettes fournisseurs</span>
        <span style={{ fontSize: 24, fontWeight: 500, color: "#B07C1E",
                       fontVariantNumeric: "tabular-nums" }}>{fmt(somme)}</span>
      </div>

      {vieillesTotal > 0 && (
        <div className="mini" style={{ marginBottom: 12, color: "#8A5B10" }}>
          Dont {vieillesTotal} pièce{vieillesTotal > 1 ? "s" : ""} d'un autre mois — elles
          restent dues tant que tu ne les as pas réglées.
        </div>
      )}

      {paquets.map((g) => (
        <div key={g.cle} style={{ padding: "11px 0", borderBottom: "1px solid #F0E6CE" }}>
          <div style={{ display: "flex", justifyContent: "space-between",
                        alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 16.5, color: "#7A6428" }}>{g.nom}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span style={{ fontSize: 17, fontWeight: 500, fontVariantNumeric: "tabular-nums",
                             color: "#7A6428" }}>{fmt(g.total)}</span>
              <button onClick={() => onSolder(g.lignes.map((e) => e.id))}
                      style={{ border: "none", background: "#B07C1E", color: "#fff",
                               borderRadius: 8, padding: "9px 15px", cursor: "pointer",
                               font: "inherit", fontSize: 15, fontWeight: 500,
                               whiteSpace: "nowrap" }}>
                Régler
              </button>
            </span>
          </div>
          <div className="mini" style={{ color: "#A08B4E", marginTop: 4 }}>
            {g.lignes.map((e) => jour(e.date)
              + (e.numero ? " · n° " + e.numero : "")
              + " · " + fmt(num(e.montant))
              + ((e.date || "").startsWith(ym) ? "" : " — autre mois")).join("   ·   ")}
          </div>
        </div>
      ))}

      <div className="mini" style={{ marginTop: 12, color: "#8A7440" }}>
        Le jour où tu paies un fournisseur, appuie sur « Régler » : toutes ses pièces en
        attente passent en payé d'un coup, quel que soit le mois où elles ont été saisies.
      </div>
    </div>
  );
}

function Fournisseurs({ config, affaire, entries, ym }) {
  const liste = (config.fournisseurs || []).filter((f) => (f.affaires || []).includes(affaire));
  if (!liste.length) return null;

  const total = (fid, mois) => (entries || [])
    .filter((e) => e.type === "depense" && (e.date || "").startsWith(mois)
                   && e.affaire === affaire && e.fournisseur === fid)
    .reduce((s, e) => s + num(e.montant), 0);

  const prec = shiftMonth(ym, -1);
  const lignes = liste.map((f) => ({ f, m: total(f.id, ym), p: total(f.id, prec) }))
                      .filter((x) => x.m > 0 || x.p > 0);
  if (!lignes.length) return null;

  const somme = lignes.reduce((s, x) => s + x.m, 0);

  return (
    <div style={{ marginTop: 20 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Achats du mois</div>
      {lignes.map(({ f, m, p }) => {
        const ecart = p > 0 ? ((m - p) / p) * 100 : null;
        return (
          <div className="row" key={f.id}>
            <span className="lbl">{f.nom}</span>
            <span style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              {ecart !== null && Math.abs(ecart) >= 5 && (
                <span className={"mini " + (ecart > 0 ? "neg" : "pos")}>
                  {ecart > 0 ? "+" : ""}{Math.round(ecart)} %
                </span>
              )}
              <span className="val">{fmt(m)}</span>
            </span>
          </div>
        );
      })}
      <div className="row rowTot">
        <span className="lbl">Total des achats</span>
        <span className="val">{fmt(somme)}</span>
      </div>
      <div className="mini" style={{ marginTop: 8 }}>
        Tout ce qui a été livré ce mois-ci, payé ou non. Le pourcentage compare au mois précédent :
        c'est là que se voit un fournisseur qui dérape.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  RÉSERVE ET AVANCES INTERNES                                        */
/* ------------------------------------------------------------------ */

/* Le coussin d'une affaire : ce qu'elle a mis de côté les bons mois, pour ne
   pas rester à sec à sa réouverture. On ne suppose rien — seulement les
   dépôts et les retraits réellement saisis, comme un chantier. */
function ReserveCarte({ k, M, config, ym, onAdd }) {
  const a = M.A[k], c = config.affaires[k];
  const [sens, setSens] = useState("depot");
  const [montant, setMontant] = useState("");
  const [motif, setMotif] = useState("");
  const [ok, setOk] = useState("");
  const [erreur, setErreur] = useState("");
  const defDate = ym === thisMonth() ? today() : ym + "-01";
  /* Un mouvement de réserve se fait rarement le jour où on le saisit : la date
     se choisit, comme partout ailleurs. */
  const [date, setDate] = useState(defDate);

  const verser = () => {
    if (num(montant) <= 0) { setOk(""); setErreur(MSG_MONTANT); return; }
    setErreur("");
    onAdd({ type: "reserve", affaire: k, date, sens, montant: num(montant),
             ...(motif.trim() ? { motif: motif.trim() } : {}) });
    setOk(sens === "retrait" ? "Sorti de la réserve." : "Mis en réserve.");
    setTimeout(() => setOk(""), 2600);
    setMontant(""); setMotif("");
  };

  const dette = a.detteInterne || 0, creance = a.creanceInterne || 0;
  const anDernierCa = (M.anDernier || {})[k] || 0;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "baseline", marginBottom: 6 }}>
        <span className="eyebrow">Réserve</span>
        <span className="heroNum" style={{ fontSize: 30, marginTop: 0 }}>{fmt(a.reserveSolde)}</span>
      </div>

      {(a.reserveDepotMois > 0 || a.reserveRetraitMois > 0) && (
        <div className="row">
          <span className="lbl">Ce mois-ci</span>
          <span className="val">
            {a.reserveDepotMois > 0 && ("+ " + fmt(a.reserveDepotMois))}
            {a.reserveDepotMois > 0 && a.reserveRetraitMois > 0 && "  ·  "}
            {a.reserveRetraitMois > 0 && ("− " + fmt(a.reserveRetraitMois))}
          </span>
        </div>
      )}
      {dette > 0 && (
        <div className="row">
          <span className="lbl">Avances internes reçues, à rembourser</span>
          <span className="val neg">{fmt(dette)}</span>
        </div>
      )}
      {creance > 0 && (
        <div className="row">
          <span className="lbl">Avances internes faites, à récupérer</span>
          <span className="val pos">{fmt(creance)}</span>
        </div>
      )}
      {anDernierCa > 0 && (
        <div className="mini" style={{ marginTop: dette || creance ? 8 : 2 }}>
          Repère : l'an dernier à la même période, {c.nom} avait fait {fmt(anDernierCa)} de
          chiffre d'affaires.
        </div>
      )}

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginTop: 14 }}>
        <div>
          <label className="f">Date</label>
          <input className="f" type="date" value={date}
                 onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="f">Mouvement</label>
          <select className="f" value={sens} onChange={(e) => setSens(e.target.value)}>
            <option value="depot">Mettre de côté</option>
            <option value="retrait">Piocher dedans</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Montant</label>
          <input className="f" inputMode="decimal" value={montant}
                 onChange={(e) => setMontant(e.target.value)}
                 onKeyDown={(e) => { if (e.key === "Enter") verser(); }} />
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <label className="f">Pour quoi</label>
        <input className="f" placeholder="Réouverture après l'été, achat de matériel…"
               value={motif} onChange={(e) => setMotif(e.target.value)}
               onKeyDown={(e) => { if (e.key === "Enter") verser(); }} />
      </div>
      <Alerte>{erreur}</Alerte>
      <button className="btn" style={{ marginTop: 10 }} onClick={verser}>Enregistrer</button>
      {ok && <div className="note" style={{ color: lisible(c.marque, 5) }}>{ok}</div>}
      <div className="note">
        Ce que tu mets de côté les bons mois sort de la trésorerie du groupe sans peser sur le
        résultat de {c.nom} — il attend d'être repioché quand l'affaire redémarre après une
        fermeture ou traverse un creux, plutôt que d'entamer l'enveloppe d'un autre mois.
      </div>
    </div>
  );
}

/* La vue d'ensemble des réserves et des avances internes : qui a mis quoi de
   côté, et qui doit quoi à qui quand la réserve n'a pas suffi. */
function ReservesConsolide({ M, config, ym, onAdd }) {
  const keys = M.keys;
  const totalReserve = keys.reduce((s, k) => s + (M.A[k].reserveSolde || 0), 0);
  const ouvertes = M.avancesInternesOuvertes || [];
  const defDate = ym === thisMonth() ? today() : ym + "-01";

  const [erreur, setErreur] = useState("");
  const [de, setDe] = useState("foyer");
  const [vers, setVers] = useState(keys[0]);
  const [montant, setMontant] = useState("");
  const [motif, setMotif] = useState("");
  const [ok, setOk] = useState("");

  const nom = (x) => x === "foyer" ? "La maison" : (config.affaires[x] ? config.affaires[x].nom : x);

  const enregistrer = () => {
    if (num(montant) <= 0) { setOk(""); setErreur(MSG_MONTANT); return; }
    if (de === vers) {
      setOk("");
      setErreur("« Depuis » et « Vers » sont la même affaire — choisis deux affaires différentes.");
      return;
    }
    setErreur("");
    onAdd({ type: "avance-interne", date: defDate, de, vers,
             montant: num(montant), motif: motif.trim() || "—", affaire: vers });
    setOk("Avance interne enregistrée.");
    setTimeout(() => setOk(""), 2600);
    setMontant(""); setMotif("");
  };

  const rembourser = (a) => {
    onAdd({ type: "remboursement-interne", ref: a.id, date: today(),
             montant: a.solde, affaire: a.vers });
  };

  return (
    <>
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 12 }}>Réserves, affaire par affaire</div>
        {keys.map((k) => (
          <div className="row" key={k}>
            <span className="lbl" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="dot" style={{ margin: 0, background: teinte(config.affaires[k]) }} />
              {config.affaires[k].nom}
            </span>
            <span className="val">{fmt(M.A[k].reserveSolde)}</span>
          </div>
        ))}
        <div className="row rowTot">
          <span className="lbl">Total des réserves</span>
          <span className="val">{fmt(totalReserve)}</span>
        </div>
      </div>

      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 12 }}>Avances internes en cours</div>
        {ouvertes.length === 0 ? (
          <div className="empty">Aucune avance interne ouverte pour l'instant.</div>
        ) : ouvertes.map((a) => (
          <div className="row" key={a.id}>
            <span className="lbl">
              {nom(a.de)} → {nom(a.vers)}
              <span className="mini" style={{ display: "block" }}>
                {a.motif}{a.motif !== "—" ? " · " : ""}depuis le {a.date}
              </span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span className="val neg">{fmt(a.solde)}</span>
              <button className="pill" onClick={() => rembourser(a)}>Remboursée</button>
            </span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="h2">Enregistrer une avance interne</h2>
        <div className="grid3">
          <div><label className="f">Depuis</label>
            <select className="f" value={de} onChange={(e) => setDe(e.target.value)}>
              <option value="foyer">La maison</option>
              {keys.map((k) => <option key={k} value={k}>{config.affaires[k].nom}</option>)}
            </select></div>
          <div><label className="f">Vers</label>
            <select className="f" value={vers} onChange={(e) => setVers(e.target.value)}>
              {keys.map((k) => <option key={k} value={k}>{config.affaires[k].nom}</option>)}
            </select></div>
          <div><label className="f">Montant</label>
            <input className="f" inputMode="decimal" value={montant}
                   onChange={(e) => setMontant(e.target.value)} /></div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label className="f">Pour quoi</label>
          <input className="f" placeholder="Réouverture Sabich après l'été…"
                 value={motif} onChange={(e) => setMotif(e.target.value)} />
        </div>
        <Alerte>{erreur}</Alerte>
        <button className="btn" onClick={enregistrer}>Enregistrer</button>
        {ok && <div className="note" style={{ marginTop: 10 }}>{ok}</div>}
        <div className="note">
          À utiliser quand la réserve d'une affaire ne suffit pas et qu'il faut vraiment puiser
          ailleurs — une autre affaire, ou l'enveloppe du mois suivant. Ça reste affiché comme une
          dette jusqu'à ce que tu appuies sur « Remboursée ».
        </div>
      </div>
    </>
  );
}

/* L'argent prêté ou emprunté à titre personnel — jamais confondu avec les
   affaires. Une seule liste, dans les deux sens : ce qu'on te doit (tu as
   prêté) et ce que tu dois (tu as emprunté à un proche). */
function PretsPersoConsolide({ M, config, ym, onAdd }) {
  const keys = M.keys;
  const ouverts = M.pretsPersoOuverts || [];
  const onTeDoit = ouverts.filter((p) => p.sens === "prete");
  const tuDois = ouverts.filter((p) => p.sens === "emprunte");
  const defDate = ym === thisMonth() ? today() : ym + "-01";

  const [erreur, setErreur] = useState("");
  const [sens, setSens] = useState("prete");
  const [qui, setQui] = useState("");
  const [motif, setMotif] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState(defDate);
  const [echeance, setEcheance] = useState("");
  const [affaire, setAffaire] = useState("foyer");
  const [ok, setOk] = useState("");

  const nom = (x) => x === "foyer" ? "La maison" : (config.affaires[x] ? config.affaires[x].nom : x);

  const enregistrer = () => {
    if (num(montant) <= 0) { setOk(""); setErreur(MSG_MONTANT); return; }
    if (!qui.trim()) {
      setOk("");
      setErreur("Nom manquant — écris à qui tu prêtes, ou de qui tu empruntes.");
      return;
    }
    setErreur("");
    onAdd({ type: "pret-perso", date, echeance, sens, qui: qui.trim(),
             motif: motif.trim(), montant: num(montant), affaire });
    setOk(sens === "prete" ? "Prêt enregistré." : "Emprunt enregistré.");
    setTimeout(() => setOk(""), 2600);
    setQui(""); setMotif(""); setMontant(""); setEcheance("");
  };

  const rembourser = (p) => {
    onAdd({ type: "remboursement-pret", ref: p.id, date: today(), montant: p.solde });
  };

  const Liste = ({ titre, liste, vide, negatif }) => (
    <div className="card">
      <div className="eyebrow" style={{ marginBottom: 12 }}>{titre}</div>
      {liste.length === 0 ? (
        <div className="empty">{vide}</div>
      ) : liste.map((p) => (
        <div className="row" key={p.id}>
          <span className="lbl">
            {p.qui}
            <span className="mini" style={{ display: "block" }}>
              {p.motif ? p.motif + " · " : ""}sorti de {nom(p.affaire)} le {p.date}
              {p.echeance ? " · échéance " + p.echeance : ""}
            </span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span className={"val " + (negatif ? "neg" : "pos")}>{fmt(p.solde)}</span>
            <button className="pill" onClick={() => rembourser(p)}>Remboursé</button>
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Liste titre="On te doit" liste={onTeDoit}
             vide="Rien en cours — aucun prêt personnel ouvert." negatif={false} />
      <Liste titre="Tu dois" liste={tuDois}
             vide="Rien en cours — aucun emprunt personnel ouvert." negatif={true} />

      <div className="card">
        <h2 className="h2">Enregistrer un prêt personnel</h2>
        <div style={{ display: "flex", gap: 9, marginBottom: 14 }}>
          <button className={"pill" + (sens === "prete" ? " on" : "")}
                  onClick={() => setSens("prete")}>Tu prêtes</button>
          <button className={"pill" + (sens === "emprunte" ? " on" : "")}
                  onClick={() => setSens("emprunte")}>Tu empruntes</button>
        </div>
        <div className="grid2">
          <div><label className="f">{sens === "prete" ? "À qui" : "À qui / de qui"}</label>
            <input className="f" placeholder="Prénom" value={qui}
                   onChange={(e) => setQui(e.target.value)} /></div>
          <div><label className="f">Montant</label>
            <input className="f" inputMode="decimal" value={montant}
                   onChange={(e) => setMontant(e.target.value)} /></div>
        </div>
        <div className="grid3">
          <div><label className="f">Date</label>
            <input className="f" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div><label className="f">Échéance prévue</label>
            <input className="f" type="date" value={echeance} onChange={(e) => setEcheance(e.target.value)} /></div>
          <div><label className="f">{sens === "prete" ? "Sorti de" : "Reçu par"}</label>
            <select className="f" value={affaire} onChange={(e) => setAffaire(e.target.value)}>
              <option value="foyer">La maison</option>
              {keys.map((k) => <option key={k} value={k}>{config.affaires[k].nom}</option>)}
            </select></div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label className="f">Pour quoi</label>
          <input className="f" placeholder="Dépannage, projet…"
                 value={motif} onChange={(e) => setMotif(e.target.value)} />
        </div>
        <Alerte>{erreur}</Alerte>
        <button className="btn" onClick={enregistrer}>Enregistrer</button>
        {ok && <div className="note" style={{ marginTop: 10 }}>{ok}</div>}
        <div className="note">
          Un prêt que tu fais sort réellement de la trésorerie du groupe ce mois-ci ; un emprunt
          y entre. Le solde reste affiché jusqu'à ce que tu appuies sur « Remboursé ».
        </div>
      </div>
    </>
  );
}

function FicheActivite({ k, M, config, entries, ym, onSolder, onAdd, deja,
                        taches, onAddTache, onMajTache, onDelTache,
                         onRegler, onReporter, onDater, onPocher, onChiffrer, onDel, onMaj,
                         onImporterNaps }) {
  const a = M.A[k], c = config.affaires[k];
  const [sous, setSous] = useState("resultat");

  const sections = [
    ["resultat",   "Résultat"],
    ["echeancier", "Échéancier"],
    ["paie",       "Paie"],
    ["achats",     "Achats"],
    ["journal",    "Journal"],
    ["exercice",   "Exercice"],
  ];

  return (
    <>
      <div className="card" style={{ paddingBottom: 8 }}>
        <Crest k={k} c={c} />
        <SaisieActivite k={k} c={c} config={config} ym={ym} onAdd={onAdd} deja={deja} entries={entries} />
        <div className="sections">
          {sections.map(([id, lbl]) => (
            <button key={id} className={sous === id ? "on" : ""}
                    onClick={() => setSous(id)}
                    >{lbl}</button>
          ))}
        </div>
      </div>

      {sous === "echeancier" && <Avenir M={M} config={config} ym={ym} onRegler={onRegler}
                                        onReporter={onReporter} onDater={onDater} onPocher={onPocher}
                                        onChiffrer={onChiffrer} filtre={k} />}
      {sous === "paie"       && <Paie M={M} config={config} onRegler={onRegler}
                                      onAdd={onAdd} ym={ym} filtre={k} entries={entries} />}
      {sous === "achats"     && <Achats entries={entries} ym={ym} config={config}
                                        onDel={onDel} onMaj={onMaj} filtre={k} />}
      {sous === "journal"    && <Mouvements entries={entries} ym={ym} config={config}
                                            onDel={onDel} onMaj={onMaj} filtre={k} />}
      {sous === "exercice"   && <Historique config={config} entries={entries} ym={ym} filtre={k} />}

      {sous === "resultat" && (
      <>
      {/* Le Mi-Chui : le quotidien d'abord (CB des deux comptoirs, virements
          Naps), la solidarité du mois, puis le résultat des prestations de
          contenu, qui ne sert qu'une ou deux fois l'an. */}
      {k === "contenu" && <>
        <CbParPoint config={config} entries={entries} ym={ym} onMaj={onMaj} />
        <CashCbCamembert config={config} entries={entries} ym={ym} />
        <NapsExport config={config} entries={entries} ym={ym} onImporter={onImporterNaps} onDel={onDel} />
      </>}
      <div className="card">

        <div style={{ display: "flex", justifyContent: "space-between",
                      alignItems: "baseline", marginBottom: 6 }}>
          <span className="eyebrow">Résultat du mois</span>
          <span className={"heroNum " + (a.resultat >= 0 ? "pos" : "neg")}
                style={{ fontSize: 30, marginTop: 0 }}>{fmt(a.resultat)}</span>
        </div>

        <div className="row"><span className="lbl">Chiffre d'affaires</span><span className="val">{fmt(a.ca)}</span></div>
        {c.type === "hebergement" && (a.caHebergement > 0 || a.caRestauration > 0) && (
          <>
            <div className="row"><span className="lbl mut">— dont hébergement</span>
              <span className="val mut">{fmt(a.caHebergement || 0)}</span></div>
            <div className="row"><span className="lbl mut">— dont restauration</span>
              <span className="val mut">{fmt(a.caRestauration || 0)}</span></div>
          </>
        )}
        {num(a.caAttente) > 0 && (
          <div className="row"><span className="lbl mut">Réservations pas encore encaissées</span>
            <span className="val mut">{fmt(a.caAttente)}</span></div>
        )}
        {a.com > 0 && <div className="row"><span className="lbl">Commissions</span><span className="val neg">− {fmt(a.com)}</span></div>}
        {(a.matiere > 0 || (c.type !== "hebergement" && a.ca > 0)) && (
          <div className="row">
            <span className="lbl">Coût matière
              {a.ca > 0 && <span className="mini"> · {Math.round(a.matiere / a.ca * 100)} % des ventes</span>}</span>
            <span className="val neg">− {fmt(a.matiere)}</span>
          </div>
        )}
        {/* Le Mi-Chui facture des prestations, pas des ventes de comptoir :
            pas de « ventes X/J jours » qui le dirait toujours incomplet. */}
        {c.type !== "hebergement" && k !== "contenu" && (() => {
          /* La complétude : combien de jours du mois ont leurs ventes et leurs
             achats saisis. Un résultat n'est vrai que si les saisies le sont. */
          const [an, mo] = ym.split("-").map(Number);
          const auj = new Date();
          const enCours = auj.getFullYear() === an && auj.getMonth() + 1 === mo;
          const jours = enCours ? auj.getDate() - 1 : new Date(an, mo, 0).getDate();
          if (jours <= 0) return null;
          const jv = new Set(), ja = new Set();
          entries.forEach((e) => {
            if (e.affaire !== k || !(e.date || "").startsWith(ym)) return;
            const d = Number(e.date.slice(8, 10));
            if (d > jours) return;
            if (e.type === "vente") jv.add(d);
            if (e.type === "depense") ja.add(d);
          });
          Object.entries(config.pointages || {}).forEach(([iso, pt]) => {
            if (!iso.startsWith(ym) || Number(iso.slice(8, 10)) > jours) return;
            if (pt.aucunAchat === true || (pt.aucunAchat || {})[k]) ja.add(Number(iso.slice(8, 10)));
          });
          const complet = jv.size >= jours && ja.size >= jours;
          return (
            <div className="mini" style={{ margin: "-2px 0 8px", color: complet ? "#4F6B1F" : "#B07C1E" }}>
              {complet ? "✓ " : ""}Saisies du mois : ventes {jv.size}/{jours} jours · achats {ja.size}/{jours} jours
              {complet ? "" : " — le résultat sera juste quand tout sera saisi."}
            </div>
          );
        })()}
        {a.variable > 0 && (
          <Detail titre="Charges variables" montant={a.variable}
                  lignes={(() => {
                    /* Le détail ne montrait que les dépenses saisies, alors que
                       le total porte aussi le service des repas et extras (la
                       commission par couvert) : on ouvrait « 4 200 DH » sur une
                       liste qui en totalisait 3 100, sans explication. */
                    const saisies = entries.filter((e) => e.type === "depense" && e.affaire === k
                        && (e.date || "").startsWith(ym) && e.categorie !== "matiere")
                      .map((e) => [e.lbl + (e.numero ? " (n° " + e.numero + ")" : ""), num(e.montant)]);
                    const reste = a.variable - saisies.reduce((s, l) => s + l[1], 0);
                    return Math.abs(reste) >= 1
                      ? [...saisies, ["Service des repas et extras", reste]]
                      : saisies;
                  })()} />
        )}
        {a.fixes > 0 && (
          <Detail titre="Charges fixes" montant={a.fixes}
                  lignes={config.fixes.filter((f) => f.affaire === k && !(f.depuis && ym < f.depuis)).map((f) => {
                    const pp = num(f.partagePct) || 0;
                    const propre = num(f.montant) * (100 - pp) / 100;
                    return [f.lbl + (pp > 0 ? " — sa part (" + (100 - pp) + " %)" : ""), propre];
                  })} />
        )}
        {a.partage > 0 && (
          <Detail titre={"Quote-part du labo (" + (config.cle[k] || 0) + " %)"}
                  montant={a.partage}
                  lignes={[
                    ...config.fixes.filter((f) => f.affaire === "partage")
                      .map((f) => [f.lbl, num(f.montant)]),
                    ...config.fixes.filter((f) => f.affaire !== "partage" && num(f.partagePct) > 0)
                      .map((f) => [f.lbl + " — part du labo (" + num(f.partagePct) + " %)",
                                   num(f.montant) * num(f.partagePct) / 100]),
                    ["— quote-part de " + (config.cle[k] || 0) + " %", a.partage],
                  ]} />
        )}
        {a.cnss > 0 && <div className="row"><span className="lbl">CNSS</span><span className="val neg">− {fmt(a.cnss)}</span></div>}
        <div className="row rowTot">
          <span className="lbl">Résultat</span>
          <span className={"val " + (a.resultat >= 0 ? "pos" : "neg")}>{fmt(a.resultat)}</span>
        </div>


        {c.type === "hebergement" && M.heb[k] && M.heb[k].nuits > 0 && (
          <div style={{ marginTop: 20 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Taux de remplissage</div>
            <div className="row"><span className="lbl">Nuitées occupées ce mois-ci</span>
              <span className="val">{M.heb[k].nuits} / {M.heb[k].dispo}</span></div>
            <div className="row"><span className="lbl">Taux d'occupation</span>
              <span className="val">{Math.round(M.heb[k].occupation)} %</span></div>
            <div className="row"><span className="lbl">Prix moyen par nuitée</span>
              <span className="val">{fmt(M.heb[k].prixMoyen)}</span></div>
            <div className="row"><span className="lbl">Dont réservations directes</span>
              <span className="val">{M.heb[k].nuitsDirect} nuitées</span></div>
            <div className="mini" style={{ marginTop: 8 }}>
              Une nuitée en direct rapporte environ 15 % de plus qu'une nuitée Airbnb.
              {M.heb[k].nuitsSejours !== M.heb[k].nuits && (
                <> Les séjours saisis ce mois-ci totalisent {M.heb[k].nuitsSejours} nuits :
                  celles qui débordent sur le mois suivant y sont comptées, et celles d'un
                  séjour arrivé le mois dernier sont comptées ici.</>
              )}
            </div>
          </div>
        )}

        {M.naps.parAffaire[k] && (M.naps.parAffaire[k].espece > 0
          || M.naps.parAffaire[k].carte > 0 || M.naps.parAffaire[k].fonds > 0) && (
          <div style={{ marginTop: 22 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Encaissements du mois</div>
            <div className="row"><span className="lbl">En espèces</span>
              <span className="val">{fmt(M.naps.parAffaire[k].espece)}</span></div>
            {M.naps.parAffaire[k].carte > 0 && <>
              <div className="row"><span className="lbl">Par carte</span>
                <span className="val">{fmt(M.naps.parAffaire[k].carte)}</span></div>
              <div className="row">
                <span className="lbl">Commission Naps
                  {M.naps.parAffaire[k].taux !== null && <span className="tag" style={{ marginLeft: 7 }}>
                    {M.naps.parAffaire[k].taux.toFixed(2).replace(".", ",")} %</span>}</span>
                <span className="val neg">− {fmt(M.naps.parAffaire[k].com)}</span></div>
              {M.naps.parAffaire[k].carte - M.naps.parAffaire[k].carteVue >= 1 && (
                <div className="mini" style={{ margin: "-4px 0 6px" }}>
                  {fmt(M.naps.parAffaire[k].carte - M.naps.parAffaire[k].carteVue)} de CB pas encore
                  dans un export Naps : leur commission comptera à l'import.</div>
              )}
            </>}
            {M.naps.parAffaire[k].fonds > 0 && (
              <div className="row"><span className="lbl">Fonds de caisse immobilisé</span>
                <span className="val mut">{fmt(M.naps.parAffaire[k].fonds)}</span></div>
            )}
            {Math.abs(M.naps.parAffaire[k].ecartFonds) >= 1 && (
              <div className="row"><span className="lbl">Écart de fond de caisse cumulé</span>
                <span className={"val " + (M.naps.parAffaire[k].ecartFonds > 0 ? "neg" : "mut")}>
                  {M.naps.parAffaire[k].ecartFonds > 0
                    ? "− " + fmt(M.naps.parAffaire[k].ecartFonds) + " manquant"
                    : "+ " + fmt(-M.naps.parAffaire[k].ecartFonds) + " en trop"}
                </span></div>
            )}
          </div>
        )}

        <Fournisseurs config={config} affaire={k} entries={entries} ym={ym} />
      </div>

      <ReserveCarte k={k} M={M} config={config} ym={ym} onAdd={onAdd} />

      <Taches taches={taches} config={config} affaireFixe={k}
              onAdd={onAddTache} onMaj={onMajTache} onDel={onDelTache} />

      <ARegler config={config} affaire={k} entries={entries} ym={ym} onSolder={onSolder} />
      {(() => {
        const pris = (entries || []).filter((e) => e.type === "avance" && e.nature === "perso"
                                            && e.source === k && (e.date || "").startsWith(ym));
        if (!pris.length) return null;
        return (
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 className="h2" style={{ margin: 0 }}>Pioché pour la maison ce mois</h2>
              <span className="val neg">{fmt(pris.reduce((s, e) => s + num(e.montant), 0))}</span>
            </div>
            {pris.map((e) => (
              <div className="row" key={e.id}><span className="lbl">{e.qui}
                <span className="mini"> · {(e.date || "").slice(8, 10)}/{(e.date || "").slice(5, 7)}</span></span>
                <span className="val">{fmt(num(e.montant))}</span></div>
            ))}
          </div>
        );
      })()}
      {/* La solidarité, une fois par mois : tout en bas de Le Mi-Chui. */}
      {k === "contenu" && <SolidariteCarte M={M} config={config} ym={ym} onAdd={onAdd}
                                           onRegler={onRegler} flash={() => {}} />}
      </>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  FOYER                                                              */
/* ------------------------------------------------------------------ */

/* Le rappel des factures variables : un bouton, et au clic la liste, chacune
   avec son champ pour taper le vrai montant dès que la facture arrive. */
function FacturesAttendues({ liste, onChiffrer }) {
  const [ouvert, setOuvert] = useState(false);
  const [saisis, setSaisis] = useState({});
  if (!liste || !liste.length || !onChiffrer) return null;
  return (
    <div style={{ margin: "14px 0 4px" }}>
      <button className="pill" onClick={() => setOuvert(!ouvert)} style={{ width: "100%" }}>
        {ouvert ? "Masquer les factures attendues" : "Factures attendues (" + liste.length + ") — eau, électricité, téléphone…"}
      </button>
      {ouvert && liste.map((f) => (
        <div key={f.id} className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <span className="lbl">{f.lbl}<span className="mini"> · vers le {num(f.jour) || 5}</span></span>
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input className="f" inputMode="decimal" placeholder="Montant" style={{ width: 120 }}
                   value={saisis[f.id] || ""} onChange={(e) => setSaisis({ ...saisis, [f.id]: e.target.value })} />
            <button className="pill" onClick={() => { if (num(saisis[f.id]) > 0) { onChiffrer(f.id, saisis[f.id]);
                                                      setSaisis({ ...saisis, [f.id]: "" }); } }}>
              OK</button>
          </span>
        </div>
      ))}
    </div>
  );
}

function Avenir({ M, config, ym, onRegler, onReporter, onDater, onPocher, onChiffrer, filtre }) {
  const [vue, setVue] = useState("date");

  const nomGroupe = (g) => config.affaires[g] ? config.affaires[g].nom
    : g === "labo" ? "Labo partagé" : g === "societe" ? "Structure" : "Rémunérations";
  const couleurGroupe = (g) => config.affaires[g] ? teinte(config.affaires[g])
    : g === "labo" ? "#697E40" : g === "societe" ? "#8A9578" : "#E0968A";

  const ech = filtre ? M.echeances.filter((e) => e.groupe === filtre) : M.echeances;
  const aVenir = ech.filter((e) => !e.paye && !e.enRetard);
  const retard = ech.filter((e) => !e.paye && e.enRetard);

  return (
    <>
      <div className="card">
        <div className="heroLbl">Restes à décaisser</div>
        <div className="heroNum" style={{ fontSize: 40 }}>
          {fmt(ech.filter((e) => !e.paye).reduce((s, e) => s + e.montant, 0))}
        </div>
        <div className="heroNote">
          {aVenir.length + retard.length} échéances. Coche chaque ligne au moment où tu la paies,
          ou reporte-la sur le mois suivant avec la flèche.
        </div>
        <FacturesAttendues liste={(M.facturesAttendues || []).filter((f) => !filtre || f.groupe === filtre)}
                           onChiffrer={onChiffrer} />
      </div>

      <div className="navSimple" style={{ marginBottom: 14 }}>
        <button className={"pill" + (vue === "date" ? " on" : "")}
                onClick={() => setVue("date")}>Par échéance</button>
        <button className={"pill" + (vue === "activite" ? " on" : "")}
                onClick={() => setVue("activite")}>Par activité</button>
      </div>

      {vue === "activite" && (
        <div className="card">
          {M.groupes.filter((g) => !filtre || g.id === filtre).map((g) => (
            <GroupeCharges key={g.id} g={g} onRegler={onRegler} onReporter={onReporter} onDater={onDater} />
          ))}
        </div>
      )}

      {vue === "date" && (
        <>
          {retard.length > 0 && (
            <div className="card" style={{ background: "#FDF6E7", borderColor: "#E9D9AE" }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: "#B07C1E", marginBottom: 10 }}>
                Échéances dépassées
              </div>
              {retard.map((e) => (
                <LigneEcheance key={e.ref} e={e} nom={nomGroupe(e.groupe)}
                               couleur={couleurGroupe(e.groupe)}
                               onRegler={onRegler} onReporter={onReporter} onChiffrer={onChiffrer} />
              ))}
            </div>
          )}

          <div className="card">
            <h2 className="h2">Échéances à venir</h2>
            {aVenir.length === 0
              ? <div className="empty" style={{ padding: "20px 0" }}>Plus rien à décaisser ce mois-ci.</div>
              : aVenir.map((e) => (
                  <LigneEcheance key={e.ref} e={e} nom={nomGroupe(e.groupe)}
                                 couleur={couleurGroupe(e.groupe)} jourActuel={M.jourActuel}
                                 onRegler={onRegler} onReporter={onReporter} onChiffrer={onChiffrer} />
                ))}
          </div>

          {/* Les lignes pointées disparaissaient de l'écran : impossible de voir ce
              qu'on avait coché, de le décocher, ni de dire qu'une charge de ce
              mois a été payée le mois d'avant. Elles sont ici, avec leur date. */}
          {M.lignesReglees.filter((l) => !filtre || l.groupe === filtre).length > 0 && (
            <div className="card">
              <h2 className="h2">Déjà réglé</h2>
              {M.lignesReglees.filter((l) => !filtre || l.groupe === filtre).map((l) => (
                <LigneReglee key={l.id} l={l} nom={nomGroupe(l.groupe)}
                             couleur={couleurGroupe(l.groupe)}
                             onRegler={onRegler} onDater={onDater} onPocher={onPocher}
                             onChiffrer={onChiffrer} config={config} />
              ))}
              <div className="row rowTot"><span className="lbl">Sorti de la caisse ce mois-ci</span>
                <span className="val pos">{fmt(M.dejaRegleCaisse)}</span></div>
              {M.regleAvant > 0 && (
                <div className="note">
                  {fmt(M.regleAvant)} de charges de {monthLabel(ym).toLowerCase()} ont été payées
                  avant le 1er. Elles soldent bien le mois, mais l'argent est sorti avant :
                  elles ne comptent pas dans « ce que j'ai réellement payé » de ce mois-ci.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {M.dettes > 0 && (
        <div className="card">
          <h2 className="h2">Dettes fournisseurs</h2>
          <div className="row rowTot"><span className="lbl">Solde fournisseurs</span>
            <span className="val">{fmt(M.dettes)}</span></div>
          <div className="note">
            Toutes les pièces non encore réglées, quel que soit le mois où tu les as saisies —
            une livraison de fin de mois reste due le mois suivant. Tu les soldes fournisseur
            par fournisseur depuis la fiche de l'activité concernée.
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  CAISSE — combien il y a, et où                                     */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  TRÉSORERIE COMPTÉE                                                  */
/* ------------------------------------------------------------------ */
/* Amal : « combien de cash a disparu ? ». Une photo, à un instant donné, de
   TOUT ce qu'elle a vraiment — enveloppes, tiroirs, Naps, banques — posée à
   côté de ce que LIFE calcule qu'elle devrait avoir. Contrairement au
   comptage d'une caisse, cette photo ne recale rien : l'écart reste visible
   tant que personne ne l'explique. Un champ laissé vide veut dire « je ne
   sais pas » : il compte pour zéro et l'écart est marqué provisoire. */
function Tresorerie({ M, config, entries, onAdd, onDel }) {
  const banques = M.poches.filter((p) => p.type === "banque");
  const lignes = [
    { id: "especes", nom: "Espèces", aide: "toutes les enveloppes + les tiroirs + ce que tu as sur toi",
      theo: M.especes },
    { id: "naps", nom: "Naps", aide: "le solde affiché sur ton téléphone", theo: M.enRoute },
    ...banques.map((p) => ({ id: p.id, nom: p.nom, aide: "le solde du compte", theo: p.solde })),
  ];
  const [val, setVal] = useState({});
  const [note, setNote] = useState("");
  const [erreur, setErreur] = useState("");

  const theoTotal = lignes.reduce((s, l) => s + l.theo, 0);
  const remplis = lignes.filter((l) => String(val[l.id] ?? "").trim() !== "");
  const inconnus = lignes.filter((l) => String(val[l.id] ?? "").trim() === "");
  const compte = remplis.reduce((s, l) => s + num(val[l.id]), 0);
  const ecart = compte - theoTotal;

  const enregistrer = () => {
    if (!remplis.length) { setErreur("Écris au moins un montant."); return; }
    if (remplis.some((l) => !montantLisible(val[l.id]))) {
      setErreur("Écris les montants en chiffres."); return;
    }
    setErreur("");
    const detail = {}, theo = {};
    lignes.forEach((l) => {
      theo[l.id] = Math.round(l.theo);
      if (String(val[l.id] ?? "").trim() !== "") detail[l.id] = num(val[l.id]);
    });
    onAdd({ type: "treso", date: aujourdhui(), montant: compte, theorique: Math.round(theoTotal),
            detail, theo, inconnus: inconnus.map((l) => l.nom), note });
    setVal({}); setNote("");
  };

  const photos = entries.filter((e) => e.type === "treso")
    .sort((a, b) => (b.date || "").localeCompare(a.date || "") || (b.saisiLe || "").localeCompare(a.saisiLe || ""));
  const derniere = photos[0] || null;
  const ecartDe = (e) => num(e.montant) - num(e.theorique);
  const rouge = "#A4262C", ambre = "#B07C1E", vert = "#4A6B1E";
  const couleur = (d) => Math.abs(d) < 1 ? vert : d < 0 ? rouge : ambre;
  const phrase = (d) => Math.abs(d) < 1 ? "Ça tombe juste"
    : d < 0 ? "Il manque " + fmt(-d) : fmt(d) + " de plus que prévu";

  return (
    <>
      <div className="card bandeau" style={{ padding: "24px" }}>
        <div className="heroLbl">Trésorerie comptée</div>
        <div style={{ display: "grid", gap: 16, margin: "14px 0 2px",
                      gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
          <div>
            <div className="eyebrow">LIFE dit que tu devrais avoir</div>
            <div className="heroNum" style={{ fontSize: 31 }}>{fmt(theoTotal)}</div>
            <div className="mini">espèces + Naps + banques, aujourd'hui</div>
          </div>
          {derniere && (
            <div>
              <div className="eyebrow">Compté le {joliDate(derniere.date)}</div>
              <div className="heroNum" style={{ fontSize: 31 }}>{fmt(num(derniere.montant))}</div>
              <div className="mini">ce que tu avais vraiment</div>
            </div>
          )}
          {derniere && (
            <div>
              <div className="eyebrow">Écart</div>
              <div className="heroNum" style={{ fontSize: 31, color: couleur(ecartDe(derniere)) }}>
                {Math.abs(ecartDe(derniere)) < 1 ? "juste" : fmt(ecartDe(derniere))}</div>
              <div className="mini">
                {(derniere.inconnus || []).length
                  ? "provisoire : " + derniere.inconnus.join(", ") + " pas renseigné"
                  : ecartDe(derniere) < 0 ? "disparu sans trace" : "de plus que prévu"}
              </div>
            </div>
          )}
        </div>
        <div className="mini" style={{ marginTop: 12 }}>
          Compte tout ce que tu as, où que ce soit, et LIFE te dit ce qui manque.
          Ce comptage ne corrige rien : l'écart reste affiché tant qu'il n'est pas expliqué.
        </div>
      </div>

      <div className="card">
        <h2 className="h2">Je compte ce que j'ai aujourd'hui</h2>
        <div className="note" style={{ marginBottom: 12 }}>
          Laisse vide ce que tu ne sais pas : il comptera pour zéro et l'écart sera
          marqué provisoire.
        </div>
        {lignes.map((l) => (
          <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                                   padding: "10px 0", borderBottom: "1px solid #F0F3F8" }}>
            <span style={{ flex: 1, minWidth: 170 }}>
              <span style={{ display: "block", fontSize: 17, color: "#3B4F35" }}>{l.nom}</span>
              <span className="mini">{l.aide} · LIFE dit {fmt(l.theo)}</span>
            </span>
            <input className="f" style={{ width: 150 }} inputMode="decimal" placeholder="je ne sais pas"
                   value={val[l.id] ?? ""}
                   onChange={(e) => setVal({ ...val, [l.id]: e.target.value })} />
          </div>
        ))}
        <div style={{ marginTop: 12 }}>
          <label className="f">Une remarque, si tu veux</label>
          <input className="f" value={note} placeholder="ex. enveloppes de la semaine pas encore récupérées"
                 onChange={(e) => setNote(e.target.value)} />
        </div>
        {remplis.length > 0 && (
          <div style={{ marginTop: 12, borderRadius: 10, padding: "12px 14px",
                        background: Math.abs(ecart) < 1 ? "#F1F7E6" : ecart < 0 ? "#FDECEC" : "#FBF3E4",
                        color: couleur(ecart) }}>
            <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
              <span><span className="mini" style={{ display: "block" }}>LIFE dit</span>
                <span className="val">{fmt(theoTotal)}</span></span>
              <span><span className="mini" style={{ display: "block" }}>Tu as compté</span>
                <span className="val">{fmt(compte)}</span></span>
              <span><span className="mini" style={{ display: "block" }}>Résultat</span>
                <span className="val" style={{ color: couleur(ecart) }}>{phrase(ecart)}</span></span>
            </div>
            {inconnus.length > 0 && Math.abs(ecart) >= 1 && (
              <div className="mini" style={{ marginTop: 8 }}>
                Provisoire : il manque le chiffre de {inconnus.map((l) => l.nom).join(", ")}.
                L'écart baissera d'autant.
              </div>
            )}
          </div>
        )}
        <Alerte>{erreur}</Alerte>
        <button className="pill" style={{ marginTop: 12 }} onClick={enregistrer}>Enregistrer</button>
      </div>

      {photos.length > 0 && (
        <div className="card">
          <h2 className="h2">Mes comptages</h2>
          {photos.map((e, i) => {
            const d = ecartDe(e);
            const prec = photos[i + 1];
            const bouge = prec ? d - ecartDe(prec) : null;
            return (
              <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10,
                                       padding: "11px 0", borderBottom: "1px solid #F0F3F8" }}>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", color: "#5F6E4C", fontSize: 16 }}>
                    {joliDate(e.date)} · compté {fmt(num(e.montant))} · LIFE disait {fmt(num(e.theorique))}
                  </span>
                  <span className="mini">
                    {(e.inconnus || []).length ? "provisoire (" + e.inconnus.join(", ") + " pas renseigné)" : "complet"}
                    {bouge !== null && Math.abs(bouge) >= 1
                      ? " · depuis le comptage précédent : " + (bouge < 0 ? fmt(-bouge) + " de plus disparus"
                                                                           : fmt(bouge) + " retrouvés")
                      : ""}
                    {e.note ? " · " + e.note : ""}
                    {signature(e) ? " · " + signature(e) : ""}
                  </span>
                </span>
                <span className="val" style={{ color: couleur(d) }}>
                  {Math.abs(d) < 1 ? "juste" : fmt(d)}</span>
                <button className="del" aria-label="Supprimer" onClick={() => onDel(e.id)}>×</button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function Poches({ M, config, entries, onTransfert, onCompter, onDel }) {
  const [ouvert, setOuvert] = useState("");
  /* Un tiroir compté le matin n'a pas encore la recette du jour dedans ; compté
     le soir, si. Sans cette question, le comptage jetait tout ce qui bougeait
     le jour même et faisait apparaître un faux écart au comptage suivant. */
  const [avantJournee, setAvantJournee] = useState(false);
  const [reel, setReel] = useState("");
  const [motif, setMotif] = useState("");
  const [erreur, setErreur] = useState("");
  const [de, setDe] = useState((M.poches[0] || {}).id || "");
  const [vers, setVers] = useState((M.poches[1] || {}).id || "");
  const [mt, setMt] = useState("");
  const [dateT, setDateT] = useState(aujourdhui());
  const [errT, setErrT] = useState("");
  const [mtN, setMtN] = useState("");
  const [dateN, setDateN] = useState(aujourdhui());
  const [errN, setErrN] = useState("");

  /* Le virement Naps : le geste le plus fréquent, il a son propre formulaire
     plutôt que d'obliger Amal à choisir deux poches dans une liste. */
  const transit = M.poches.filter((p) => p.type === "transit");
  const versBanque = pocheParId(config, banqueCartes(config));
  const encaisserNaps = () => {
    if (!montantLisible(mtN) || num(mtN) <= 0) {
      setErrN("Écris le montant du virement en chiffres."); return;
    }
    if (!transit[0] || !versBanque) { setErrN("Aucun compte de destination."); return; }
    setErrN(""); onTransfert(transit[0].id, versBanque.id, mtN, dateN); setMtN("");
  };

  const valider = (p) => {
    if (!montantLisible(reel) || String(reel).trim() === "") {
      setErreur("Écris en chiffres ce que tu as compté dans le tiroir."); return;
    }
    setErreur(""); setOuvert("");
    onCompter(p.id, reel, p.solde, motif, "", avantJournee);
    setReel(""); setMotif(""); setAvantJournee(false);
  };

  const transferer = () => {
    if (de === vers) { setErrT("Choisis deux poches différentes."); return; }
    if (!montantLisible(mt) || num(mt) <= 0) {
      setErrT("Écris le montant en chiffres."); return;
    }
    setErrT(""); onTransfert(de, vers, mt, dateT); setMt("");
  };

  const derniers = entries
    .filter((e) => e.type === "transfert" || e.type === "comptage")
    .sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 12);

  return (
    <>
      <div className="card bandeau" style={{ padding: "24px" }}>
        <div className="heroLbl">Ce que tu as, et où</div>
        <div style={{ display: "grid", gap: 16, margin: "14px 0 2px",
                      gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
          <div>
            <div className="eyebrow">En espèces</div>
            <div className={"heroNum " + (M.especes >= 0 ? "pos" : "neg")}
                 style={{ fontSize: 31 }}>{fmt(M.especes)}</div>
            <div className="mini">dans les tiroirs</div>
          </div>
          <div>
            <div className="eyebrow">En banque</div>
            <div className={"heroNum " + (M.enBanque >= 0 ? "pos" : "neg")}
                 style={{ fontSize: 31 }}>{fmt(M.enBanque)}</div>
            <div className="mini">cartes et virements encaissés</div>
          </div>
          {Math.abs(M.enRoute) >= 1 && (
            <div>
              <div className="eyebrow">En route</div>
              <div className="heroNum" style={{ fontSize: 31, color: "#8A7440" }}>
                {fmt(M.enRoute)}</div>
              <div className="mini">cartes encaissées, virement Naps pas encore arrivé</div>
            </div>
          )}
          {/* Le chiffre qu'on ne doit jamais laisser disparaître : la somme de
              tout ce que les comptages ont révélé de manquant. */}
          {Math.abs(M.ecartCumul) >= 1 && (
            <div>
              <div className="eyebrow">Écarts inexpliqués</div>
              <div className="heroNum" style={{ fontSize: 31,
                    color: M.ecartCumul < 0 ? "#A4262C" : "#B07C1E" }}>
                {fmt(M.ecartCumul)}</div>
              <div className="mini">
                {M.ecartCumul < 0 ? "manquants depuis le premier comptage"
                                  : "de trop depuis le premier comptage"}
              </div>
            </div>
          )}
        </div>
        <div className="mini" style={{ marginTop: 12 }}>
          Ces soldes se comptent depuis le début, pas sur le mois affiché — un tiroir
          ne se remet pas à zéro le 1er. Les recettes s'aiguillent toutes seules :
          la part espèces reste au comptoir, la part carte part en banque.
          {(M.poches || []).some((p) => !p.dernierComptage) && (
            <> <b>Pour démarrer, compte chaque tiroir et pointe chaque compte une
            première fois</b> : c'est ce qui donne à l'appli son point de départ.</>
          )}
        </div>
      </div>

      {M.poches.map((p) => (
        <div className="card" key={p.id}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between",
                        gap: 12, flexWrap: "wrap" }}>
            <span>
              <span style={{ fontSize: 19, color: "#3B4F35" }}>{p.nom}</span>
              <span className="tag" style={{ marginLeft: 9 }}>
                {p.type === "caisse" ? "espèces" : p.type === "transit" ? "en route" : "compte"}</span>
            </span>
            <span style={{ textAlign: "right" }}>
              <span className="mini" style={{ display: "block" }}>l'appli dit</span>
              <span className={"val " + (p.solde >= 0 ? "pos" : "neg")}
                    style={{ fontSize: 24 }}>{fmt(p.solde)}</span>
            </span>
          </div>

          {Math.abs(p.ecartCumul) >= 1 && (
            <div className="mini" style={{ marginTop: 6,
                  color: p.ecartCumul < 0 ? "#A4262C" : "#B07C1E" }}>
              {p.ecartCumul < 0 ? "Il manque " + fmt(-p.ecartCumul)
                                : fmt(p.ecartCumul) + " de trop"} en cumulé sur {p.ecarts.length}
              {" "}comptage{p.ecarts.length > 1 ? "s" : ""} — jamais expliqué.
            </div>
          )}

          {/* Amal veut voir les deux chiffres côte à côte, pas une phrase :
              ce que l'appli calculait, ce qu'il y avait vraiment. */}
          {p.dernierComptage && (
            <div style={{ marginTop: 10, borderRadius: 11, background: "#FAFCF5",
                          padding: "11px 13px" }}>
              <div className="mini" style={{ marginBottom: 7 }}>
                {p.type === "caisse" ? "Dernier comptage" : "Dernier pointage"} —
                {" "}{joliDate(p.dernierComptage.date)}
              </div>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
                <span>
                  <span className="mini" style={{ display: "block" }}>Ce que disait l'appli</span>
                  <span className="val">{fmt(num(p.dernierComptage.theorique))}</span>
                </span>
                <span>
                  <span className="mini" style={{ display: "block" }}>Ce qu'il y avait vraiment</span>
                  <span className="val">{fmt(num(p.dernierComptage.montant))}</span>
                </span>
                {p.ecart !== null && (
                  <span>
                    <span className="mini" style={{ display: "block" }}>Écart</span>
                    <span className="val" style={{ color: Math.abs(p.ecart) < 1 ? "#4A6B1E"
                            : p.ecart < 0 ? "#A4262C" : "#B07C1E" }}>
                      {Math.abs(p.ecart) < 1 ? "juste"
                        : (p.ecart > 0 ? "+" : "") + fmt(p.ecart)}
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Pointer vaut aussi pour un compte : le solde du relevé remplace ce
              que l'appli croyait, et c'est comme ça qu'on lui donne son point
              de départ sans rien paramétrer. */}
          {(ouvert === p.id ? (
            <div style={{ marginTop: 12 }}>
              <label className="f">
                {p.type === "caisse" ? "Compté dans le tiroir, en chiffres"
                                     : "Solde du relevé, en chiffres"}</label>
              <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginTop: 5 }}>
                <input className="f" style={{ width: 160 }} inputMode="decimal"
                       placeholder={String(Math.round(p.solde))} value={reel} autoFocus
                       onChange={(e) => setReel(e.target.value)} />
                <button className="pill" onClick={() => valider(p)}>Enregistrer</button>
                <button className="pill" onClick={() => { setOuvert(""); setErreur(""); }}>Annuler</button>
              </div>
              {p.type === "caisse" && (
                <>
                  <label className="f" style={{ marginTop: 10 }}>Compté quand ?</label>
                  <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginBottom: 4 }}>
                    <button className={"pill" + (!avantJournee ? " on" : "")}
                            onClick={() => setAvantJournee(false)}>Après la journée</button>
                    <button className={"pill" + (avantJournee ? " on" : "")}
                            onClick={() => setAvantJournee(true)}>Avant d'ouvrir</button>
                  </div>
                  <div className="mini" style={{ marginBottom: 6 }}>
                    Compté avant d'ouvrir, la recette du jour s'ajoutera à ce montant.
                    Compté après la journée, elle est déjà dans le tiroir.
                  </div>
                </>
              )}
              <Alerte>{erreur}</Alerte>
              {p.cale && montantLisible(reel) && String(reel).trim() !== "" && (
                <div style={{ marginTop: 10, borderRadius: 10, padding: "10px 12px",
                      background: Math.abs(num(reel) - p.solde) < 1 ? "#F1F7E6" : "#FDECEC",
                      color: Math.abs(num(reel) - p.solde) < 1 ? "#4A6B1E" : "#A4262C" }}>
                  {Math.abs(num(reel) - p.solde) < 1
                    ? "Ça tombe juste."
                    : (num(reel) < p.solde
                        ? "Il manque " + fmt(p.solde - num(reel)) + "."
                        : "Il y a " + fmt(num(reel) - p.solde) + " de plus que prévu.")
                      + " Cet écart sera enregistré et cumulé — il ne disparaîtra pas."}
                </div>
              )}
              {p.cale && (
                <div style={{ marginTop: 10 }}>
                  <label className="f">Ce qui l'explique, si tu sais</label>
                  <input className="f" value={motif} placeholder="un achat payé en liquide, un rendu de monnaie…"
                         onChange={(e) => setMotif(e.target.value)} />
                </div>
              )}
              <div className="mini" style={{ marginTop: 7 }}>
                {p.cale
                  ? "L'appli dit " + fmt(p.solde) + ". Le solde se recalera sur ton chiffre, "
                    + "mais la différence reste inscrite : c'est elle qui trahit un trou qui se répète."
                  : "Premier comptage : il sert à caler la poche. Aucun écart ne sera compté."}
              </div>
            </div>
          ) : (
            <button className="pill" style={{ marginTop: 12 }}
                    onClick={() => { setOuvert(p.id); setReel(""); setErreur(""); }}>
              {p.type === "caisse" ? "Je compte cette caisse"
                : p.type === "transit" ? "Je corrige ce montant" : "Je pointe ce compte"}
            </button>
          ))}
        </div>
      ))}

      {transit.length > 0 && versBanque && (
        <div className="card">
          <h2 className="h2">Virements Naps reçus</h2>
          <div className="note" style={{ marginBottom: 12 }}>
            Une carte encaissée reste chez Naps un à trois jours. Elle attend dans
            « {transit[0].nom} », et tu la fais passer sur {versBanque.nom} le jour où le
            virement tombe vraiment sur ton relevé. C'est ce qui fait que l'appli et ta
            banque disent la même chose.
          </div>
          <div className="row rowTot" style={{ marginBottom: 12 }}>
            <span className="lbl">En attente chez Naps</span>
            <span className="val" style={{ color: "#8A7440" }}>{fmt(transit[0].solde)}</span>
          </div>
          <div className="grid2">
            <div><label className="f">Montant reçu</label>
              <input className="f" inputMode="decimal" value={mtN}
                     onChange={(e) => setMtN(e.target.value)} /></div>
            <div><label className="f">Date du virement</label>
              <input className="f" type="date" value={dateN}
                     onChange={(e) => setDateN(e.target.value)} /></div>
          </div>
          <Alerte>{errN}</Alerte>
          <button className="pill" style={{ marginTop: 12 }} onClick={encaisserNaps}>
            Enregistrer le virement
          </button>
          <div className="mini" style={{ marginTop: 9 }}>
            Recopie le montant exact du virement, tel qu'il apparaît sur ton relevé —
            commission Naps déjà déduite s'il y a lieu.
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="h2">Déplacer de l'argent</h2>
        <div className="note" style={{ marginBottom: 12 }}>
          Un dépôt d'espèces en banque, un retrait au distributeur, un virement d'un compte
          à l'autre. C'est la seule chose que l'appli ne peut pas deviner.
        </div>
        <div className="grid2">
          <div><label className="f">De</label>
            <select className="f" value={de} onChange={(e) => setDe(e.target.value)}>
              {M.poches.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select></div>
          <div><label className="f">Vers</label>
            <select className="f" value={vers} onChange={(e) => setVers(e.target.value)}>
              {M.poches.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select></div>
          <div><label className="f">Montant</label>
            <input className="f" inputMode="decimal" value={mt}
                   onChange={(e) => setMt(e.target.value)} /></div>
          <div><label className="f">Date</label>
            <input className="f" type="date" value={dateT}
                   onChange={(e) => setDateT(e.target.value)} /></div>
        </div>
        <Alerte>{errT}</Alerte>
        <button className="pill" style={{ marginTop: 12 }} onClick={transferer}>Enregistrer</button>
      </div>

      {M.ecartsTous.length > 0 && (
        <div className="card" style={{ background: "#FDF6E7", borderColor: "#E9D9AE" }}>
          <h2 className="h2">Écarts relevés</h2>
          <div className="note" style={{ marginBottom: 10 }}>
            Chaque fois que le compté ne correspond pas au calculé. Un écart isolé, c'est une
            erreur de monnaie. Le même écart qui revient au même endroit, ça se regarde de près.
          </div>
          {M.ecartsTous.map((c) => {
            const d = num(c.montant) - num(c.theorique);
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10,
                                       padding: "11px 0", borderBottom: "1px solid #EDE2C6" }}>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", color: "#5F6E4C", fontSize: 16 }}>
                    {c.nomPoche}{c.motif ? " — " + c.motif : ""}
                  </span>
                  <span className="mini">
                    {joliDate(c.date)} · calculé {fmt(num(c.theorique))} · compté {fmt(num(c.montant))}
                  </span>
                </span>
                <span className="val" style={{ color: d < 0 ? "#A4262C" : "#B07C1E" }}>
                  {d > 0 ? "+" : ""}{fmt(d)}</span>
              </div>
            );
          })}
          <div className="row rowTot"><span className="lbl">Total jamais expliqué</span>
            <span className="val" style={{ color: M.ecartCumul < 0 ? "#A4262C" : "#B07C1E" }}>
              {fmt(M.ecartCumul)}</span></div>
        </div>
      )}

      {derniers.length > 0 && (
        <div className="card">
          <h2 className="h2">Derniers mouvements de poche</h2>
          {derniers.map((e) => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10,
                                     padding: "11px 0", borderBottom: "1px solid #F0F3F8" }}>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", color: "#5F6E4C", fontSize: 16 }}>
                  {e.type === "comptage"
                    ? "Comptage — " + nomPoche(config, e.poche)
                      + (Math.abs(num(e.montant) - num(e.theorique)) >= 1
                          ? " · écart de " + fmt(num(e.montant) - num(e.theorique)) : "")
                    : "Transfert — " + nomPoche(config, e.de) + " → " + nomPoche(config, e.vers)}
                </span>
                <span className="mini">{joliDate(e.date)}{signature(e) ? " · " + signature(e) : ""}</span>
              </span>
              <span className="val">{fmt(num(e.montant))}</span>
              <button className="del" aria-label="Supprimer" onClick={() => onDel(e.id)}>×</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* Une charge pointée : on voit quand l'argent est sorti, on peut corriger la
   date, et on peut décocher si on s'est trompée. */
function LigneReglee({ l, nom, couleur, config, onRegler, onDater, onPocher, onChiffrer }) {
  /* Une facture qui varie peut avoir été pointée sur l'estimation : il faut
     pouvoir écrire le vrai montant sans tout décocher. */
  const [saisi, setSaisi] = useState("");
  const [edite, setEdite] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
                  padding: "12px 0", borderBottom: "1px solid #F0F3F8" }}>
      <Coche paye={true} onClick={() => onRegler(l.id, false)} />
      <span style={{ width: 6, height: 30, borderRadius: 3, background: couleur, flex: "none" }} />
      <span style={{ flex: 1, minWidth: 150 }}>
        <span style={{ display: "block", color: "#5F6E4C", fontSize: 16.5 }}>{l.lbl}</span>
        <span className="mini">{nom}{l.horsMois ? " · payé le mois d'avant" : ""}</span>
      </span>
      <span className="mini" style={{ flex: "none" }}>payé le</span>
      <input className="f" type="date" value={l.quand} style={{ width: 172, flex: "none" }}
             onChange={(e) => onDater(l.id, e.target.value)} />
      {/* D'où l'argent est sorti : la banque par défaut, à changer d'un geste
          quand la charge a été réglée en espèces du comptoir. */}
      <span className="mini" style={{ flex: "none" }}>depuis</span>
      <select className="f" style={{ width: 178, flex: "none" }}
              value={l.poche || banqueCartes(config)}
              onChange={(e) => onPocher(l.id, e.target.value)}>
        {lesPoches(config).map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
      </select>
      {l.variable && onChiffrer ? (
        edite ? (
          <span style={{ display: "flex", gap: 7, alignItems: "center", flex: "none" }}>
            <input className="f" style={{ width: 104, textAlign: "right", padding: "6px 9px" }}
                   inputMode="decimal" autoFocus value={saisi}
                   placeholder={String(Math.round(l.montant))}
                   onChange={(x) => setSaisi(x.target.value)} />
            <button className="pill" style={{ padding: "5px 11px" }}
                    onClick={() => { onChiffrer(l.id, saisi); setEdite(false); setSaisi(""); }}>
              OK</button>
          </span>
        ) : (
          <button className="pill" style={{ padding: "5px 11px", flex: "none" }}
                  onClick={() => { setEdite(true); setSaisi(l.estime ? "" : String(Math.round(l.montant))); }}>
            {l.estime ? "Saisir le vrai montant" : "Corriger"}
          </button>
        )
      ) : null}
      <span className="val" style={{ flex: "none",
            color: l.estime ? "#8A9578" : undefined,
            fontStyle: l.estime ? "italic" : undefined }}>
        {l.estime ? "≈ " : ""}{fmt(l.montant)}
      </span>
    </div>
  );
}

function LigneEcheance({ e, nom, couleur, jourActuel, onRegler, onReporter, onChiffrer }) {
  const dans = jourActuel ? e.jour - jourActuel : null;
  /* Une charge qui varie porte une estimation tant que la facture n'est pas
     arrivée. Amal écrit le vrai montant dans la case, et tout le mois se
     recalcule dessus — le seuil, ce qui reste à payer, la poche qui paiera. */
  const [saisi, setSaisi] = useState("");
  const [edite, setEdite] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
                  padding: "12px 0", borderBottom: "1px solid #F0F3F8" }}>
      <Coche paye={false} retard={e.enRetard} onClick={() => onRegler(e.ref, true)} />
      <span style={{ width: 6, height: 30, borderRadius: 3, background: couleur, flex: "none" }} />
      <span style={{ flex: 1, minWidth: 160 }}>
        <span style={{ display: "block", color: "#5F6E4C", fontSize: 16.5 }}>{e.lbl}</span>
        <span className="mini">
          le {e.jour} · {nom}
          {dans !== null && dans >= 0 && (dans === 0 ? " · aujourd'hui" : " · dans " + dans + " j")}
          {e.estime && " · estimation, la facture n'est pas arrivée"}
        </span>
      </span>
      <button onClick={() => onReporter(e.ref)} title="Reporter sur le mois suivant"
              style={{ border: "1px solid #DCE2CE", background: "#fff", cursor: "pointer",
                       borderRadius: 7, padding: "5px 10px", fontSize: 14,
                       color: "#8A9578", font: "inherit" }}>→</button>
      {e.variable && onChiffrer ? (
        edite ? (
          <span style={{ display: "flex", gap: 7, alignItems: "center", flex: "none" }}>
            <input className="f" style={{ width: 108, textAlign: "right", padding: "6px 9px" }}
                   inputMode="decimal" autoFocus value={saisi}
                   placeholder={String(Math.round(e.montant))}
                   onChange={(x) => setSaisi(x.target.value)} />
            <button className="pill" style={{ padding: "5px 11px" }}
                    onClick={() => { onChiffrer(e.ref, saisi); setEdite(false); setSaisi(""); }}>
              OK</button>
          </span>
        ) : (
          <button className="pill" style={{ padding: "5px 11px", flex: "none" }}
                  onClick={() => { setEdite(true); setSaisi(e.estime ? "" : String(Math.round(e.montant))); }}>
            {e.estime ? "Saisir le vrai montant" : "Corriger"}
          </button>
        )
      ) : null}
      <span className="val" style={{ flex: "none",
            color: e.estime ? "#8A9578" : undefined,
            fontStyle: e.estime ? "italic" : undefined }}>
        {e.estime ? "≈ " : ""}{fmt(e.montant)}
      </span>
    </div>
  );
}

function Paie({ M, config, onRegler, onAdd, ym, filtre, entries }) {
  const [prime, setPrime] = useState("");
  const [mtPrime, setMtPrime] = useState("");
  const [erreurPrime, setErreurPrime] = useState("");
  const [ok, setOk] = useState("");
  const flash = (m) => { setOk(m); setTimeout(() => setOk(""), 2600); };
  const defDate = ym === thisMonth() ? today() : ym + "-01";

  /* Chaque activité ne voit que ses propres salariés */
  const liste = filtre ? M.paie.filter((p) => p.affaire === filtre) : M.paie;
  const total = liste.reduce((s, p) => s + p.net, 0);
  const avances = liste.reduce((s, p) => s + p.avances, 0);
  const reste = liste.filter((p) => !p.paye).reduce((s, p) => s + p.reste, 0);

  /* L'équipe du labo est partagée : on montre sa quote-part, pas son salaire entier */
  const primes = liste.reduce((s, p) => s + p.prime, 0);

  const donner = (id, nom) => {
    if (num(mtPrime) <= 0) { setErreurPrime(MSG_MONTANT); return; }
    setErreurPrime("");
    onAdd({ type: "prime", date: defDate, ref: id, lbl: "Prime — " + nom,
            montant: num(mtPrime) });
    flash("Prime de " + fmt(num(mtPrime)) + " ajoutée à " + nom + ".");
    setMtPrime(""); setPrime("");
  };

  const equipeLabo = M.paie.filter((p) => p.partage);
  const quotePart = filtre && M.A[filtre]
    ? Math.max(0, M.A[filtre].salaires - total) : 0;

  return (
    <>
      <div className="hero">
        <div className="card">
          <div className="heroLbl">Net à verser</div>
          <div className="heroNum" style={{ fontSize: 38 }}>{fmt(reste)}</div>
          <div className="heroNote">Avances déjà données déduites.</div>
        </div>
        <div className="card">
          <div className="heroLbl">Masse salariale</div>
          <div className="heroNum" style={{ fontSize: 38 }}>{fmt(total)}</div>
          <div className="heroNote">
            {liste.length} salarié{liste.length > 1 ? "s" : ""}
            {avances > 0 ? " · " + fmt(avances) + " d'avances" : ""}
          </div>
        </div>
      </div>

      <div className="card">
        <FAvance defDate={defDate} onAdd={onAdd} flash={flash} config={config} natureFixe="salaire" entries={entries} />
      </div>

      <div className="card">
        <h2 className="h2">Détail par salarié</h2>
        {(config.societes || []).map((s) => {
          const gens = liste.filter((p) => p.societe === s.id);
          if (!gens.length) return null;
          const masse = gens.reduce((a, p) => a + p.net, 0);
          return (
            <div key={s.id} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between",
                            alignItems: "baseline", gap: 12, marginTop: 12 }}>
                <span className="eyebrow">{s.nom}</span>
                <span className="mini">{gens.length} salarié{gens.length > 1 ? "s" : ""} · {fmt(masse)}</span>
              </div>
            </div>
          );
        })}
        {liste.slice().sort((a, b) =>
          (a.societe || "").localeCompare(b.societe || "")).map((p) => (
          <div key={p.id} style={{ padding: "13px 0", borderBottom: "1px solid #F0F3F8" }}>
            <div style={{ display: "flex", justifyContent: "space-between",
                          alignItems: "center", gap: 12 }}>
              <button onClick={() => onRegler(p.id, !p.paye)}
                      style={{ display: "flex", alignItems: "center", gap: 11, border: "none",
                               background: "none", cursor: "pointer", font: "inherit",
                               padding: 0, textAlign: "left", flex: 1 }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, flex: "none",
                               border: "1.5px solid " + (p.paye ? "#6BA023" : "#C6D2AC"),
                               background: p.paye ? "#6BA023" : "#fff", color: "#fff",
                               display: "flex", alignItems: "center", justifyContent: "center",
                               fontSize: 15 }}>{p.paye ? "✓" : ""}</span>
                <span style={{ fontSize: 16.5, color: p.paye ? "#9AA487" : "#38452F" }}>
                  {p.nom}
                  <span className="tag" style={{ marginLeft: 8 }}>
                    {((config.societes || []).find((s) => s.id === p.societe) || {}).nom || p.societe}
                  </span>
                </span>
              </button>
              <span style={{ fontSize: 18, fontWeight: 500, fontVariantNumeric: "tabular-nums",
                             color: p.paye ? "#9AA487" : "#38452F" }}>
                {fmt(p.paye ? 0 : p.reste)}
              </span>
            </div>
            {(p.avances > 0 || p.prime > 0) && (
              <div className="mini" style={{ marginLeft: 33, marginTop: 4 }}>
                Net {fmt(p.net)}
                {p.prime > 0 && <span className="pos"> + {fmt(p.prime)} de prime</span>}
                {p.avances > 0 && <> — {fmt(p.avances)} déjà avancés</>}
              </div>
            )}

            <div style={{ marginLeft: 33, marginTop: 8 }}>
              {prime === p.id ? (
                <div style={{ display: "flex", gap: 9, alignItems: "flex-end" }}>
                  <div style={{ width: 150 }}>
                    <label className="f">Montant de la prime</label>
                    <input className="f" autoFocus inputMode="decimal" value={mtPrime}
                           onChange={(e) => { setMtPrime(e.target.value); setErreurPrime(""); }}
                           onKeyDown={(e) => { if (e.key === "Enter") donner(p.id, p.nom); }} />
                    <Alerte>{erreurPrime}</Alerte>
                  </div>
                  <button className="pill" onClick={() => donner(p.id, p.nom)}>Donner</button>
                  <button className="pill" onClick={() => setPrime("")}>Annuler</button>
                </div>
              ) : (
                <button onClick={() => { setMtPrime(""); setPrime(p.id); }}
                        style={{ background: "none", border: "none", cursor: "pointer",
                                 padding: 0, font: "inherit", fontSize: 14.5,
                                 color: "#8B9678", textDecoration: "underline" }}>
                  Donner une prime
                </button>
              )}
            </div>
          </div>
        ))}
        {liste.length === 0 && (
          <div className="empty" style={{ padding: "20px 0" }}>
            Aucun salarié rattaché directement à cette activité.
          </div>
        )}
        {primes > 0 && (
          <div className="row rowTot">
            <span className="lbl">Primes du mois</span>
            <span className="val pos">{fmt(primes)}</span>
          </div>
        )}
        <div className="note">
          Les avances se déduisent automatiquement du solde à verser. Choisis bien la personne
          au moment de la saisie, sinon l'avance ne s'impute pas. Une prime s'ajoute au net du
          mois où tu la donnes : elle pèse sur l'activité qui l'a méritée, et elle disparaît le
          mois suivant sans que tu aies à la retirer.
        </div>
      </div>

      {filtre && quotePart > 0 && (
        <div className="card">
          <h2 className="h2">Quote-part de l'équipe du labo</h2>
          {equipeLabo.map((p) => (
            <div className="row" key={p.id}>
              <span className="lbl">{p.nom} <span className="mini">— partagé</span></span>
              <span className="val">{fmt(p.net)}</span>
            </div>
          ))}
          <div className="row rowTot">
            <span className="lbl">Part imputée à cette activité ({config.cle[filtre] || 0} %)</span>
            <span className="val">{fmt(quotePart)}</span>
          </div>
          <div className="note">
            Ces salaires ne sont pas versés par cette activité : ils sont payés une seule fois
            et répartis entre les activités qui utilisent le labo. Seule la quote-part pèse ici.
          </div>
        </div>
      )}
    </>
  );
}

function Historique({ config, entries, ym, filtre }) {
  const brut = useMemo(() => historique(config, entries, ym, filtre), [config, entries, ym, filtre]);
  const premier = brut.findIndex((h) => h.ca > 0);
  const H = premier === -1 ? brut.slice(-1) : brut.slice(premier);
  const actifs = H.filter((h) => h.ca > 0);
  /* Le cumul portait sur les seuls mois avec des ventes. Un mois de fermeture a
     un chiffre d'affaires nul mais paie quand même son loyer, ses salaires et
     sa quote-part : c'est le mois le plus déficitaire de l'année, et c'était
     exactement celui qu'on retirait du total.
     Mais attention à ne pas confondre « fermé » et « pas encore saisi » : un
     mois sans la moindre écriture n'est pas un mois à zéro, c'est un mois
     inconnu. Le compter afficherait une perte imaginaire égale aux charges
     fixes. On ne garde donc que les mois où quelque chose a été saisi. */
  const aDesEcritures = (m) => (entries || []).some((e) => (e.date || "").slice(0, 7) === m);
  const saisis = H.filter((h) => h.ca > 0 || aDesEcritures(h.ym));
  const cumulCA  = saisis.reduce((s, h) => s + h.ca, 0);
  const cumulRes = saisis.reduce((s, h) => s + h.resultat, 0);
  const maxi = Math.max(1, ...H.map((h) => h.ca));

  if (!actifs.length) {
    return <div className="card"><div className="empty">
      Pas encore d'historique.<br />Il se construira mois après mois, au fil de tes saisies.
    </div></div>;
  }

  return (
    <>
      <div className="hero">
        <div className="card">
          <div className="heroLbl">Chiffre d'affaires cumulé</div>
          <div className="heroNum">{fmt(cumulCA)}</div>
          <div className="heroNote">Sur {saisis.length} mois saisis, dont {actifs.length} avec des ventes.</div>
        </div>
        <div className="card">
          <div className="heroLbl">Résultat cumulé</div>
          <div className={"heroNum " + (cumulRes >= 0 ? "pos" : "neg")}>{fmt(cumulRes)}</div>
          <div className="heroNote">Moyenne : {fmt(cumulRes / Math.max(1, saisis.length))} par mois,
            fermetures comprises.</div>
        </div>
      </div>

      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 16 }}>Évolution mensuelle</div>
        {H.map((h) => (
          <div key={h.ym} style={{ marginBottom: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between",
                          alignItems: "baseline", marginBottom: 5 }}>
              <span style={{ fontSize: 16 }}>{monthLabel(h.ym)}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                <span className="mini">
                  {h.ca > 0 ? fmt(h.ca) : aDesEcritures(h.ym) ? "fermé" : "rien de saisi"}
                </span>
                {(h.ca > 0 || aDesEcritures(h.ym)) && (
                  <span className={h.resultat >= 0 ? "pos" : "neg"}
                        style={{ marginLeft: 12, fontWeight: 500 }}>{fmt(h.resultat)}</span>
                )}
              </span>
            </div>
            <div style={{ height: 9, borderRadius: 5, background: "#EDF0E4", overflow: "hidden" }}>
              <div style={{ width: (h.ca / maxi) * 100 + "%", height: "100%",
                            background: h.ym === ym ? "#395232" : "#A4BA31" }} />
            </div>
          </div>
        ))}
        <div className="note">
          La liste démarre à ton premier mois saisi et s'allonge d'elle-même, jusqu'à douze mois
          glissants. Avec ta saisonnalité, c'est ce cumul qui dit la vérité — pas le chiffre d'un
          mois isolé. Le mois affiché en haut de l'app apparaît en vert foncé.
        </div>
      </div>
    </>
  );
}

function Coche({ paye, onClick, retard }) {
  return (
    <button onClick={onClick} aria-label={paye ? "Marquer non payé" : "Marquer payé"}
            style={{ width: 24, height: 24, borderRadius: 7, flex: "none", cursor: "pointer",
                     border: "1.5px solid " + (paye ? "#6BA023" : retard ? "#D9A03F" : "#C6D2AC"),
                     background: paye ? "#6BA023" : "#fff", color: "#fff",
                     display: "flex", alignItems: "center", justifyContent: "center",
                     fontSize: 15, padding: 0 }}>
      {paye ? "✓" : ""}
    </button>
  );
}

function FoyerComplet({ M, config, onAdd, ym, entries, onRegler, onReporter, onDater, onPocher, onChiffrer, onDel, onMaj, deja,
                       taches, onAddTache, onMajTache, onDelTache }) {
  const [sous, setSous] = useState("resultat");
  const sections = [
    ["resultat",   "Postes"],
    ["taches",     "Tâches"],
    ["echeancier", "Échéancier"],
    ["achats",     "Achats"],
    ["journal",    "Journal"],
  ];
  return (
    <>
      <div className="maison">
        <div className="card" style={{ paddingBottom: 8 }}>
          <Crest k="foyer" c={MAISON} />
          <div className="sections">
            {sections.map(([id, lbl]) => (
              <button key={id} className={sous === id ? "on" : ""}
                      onClick={() => setSous(id)}>{lbl}</button>
            ))}
          </div>
        </div>
        {sous === "resultat"   && <Foyer M={M} config={config} onAdd={onAdd} ym={ym} onChiffrer={onChiffrer}
                                         onRegler={onRegler} deja={deja} entries={entries} />}
        {sous === "taches"     && <Taches taches={taches} config={config} onAdd={onAddTache}
                                          onMaj={onMajTache} onDel={onDelTache} affaireFixe="foyer" />}
        {sous === "echeancier" && <Avenir M={M} config={config} ym={ym} onRegler={onRegler}
                                          onReporter={onReporter} onDater={onDater} onPocher={onPocher}
                                          onChiffrer={onChiffrer} filtre="foyer" />}
        {sous === "achats"     && <Achats entries={entries} ym={ym} config={config}
                                          onDel={onDel} onMaj={onMaj} filtre="foyer" />}
        {sous === "journal"    && <Mouvements entries={entries} ym={ym} config={config}
                                              onDel={onDel} onMaj={onMaj} filtre="foyer" />}
      </div>
    </>
  );
}

/* La solidarité n'est ni une facture ni un salaire : elle se décide chaque mois.
   Elle sort de la trésorerie sans peser sur le résultat des commerces. */
/* ------------------------------------------------------------------ */
/*  NAPS — l'export Excel de l'espace Naps fait foi                     */
/* ------------------------------------------------------------------ */
/* Amal : « je ne veux pas que l'app estime quoi que ce soit ». Naps n'envoie
   aucun relevé, mais son espace en ligne exporte un Excel : une ligne par
   télécollecte (la clôture de la borne, une par jour), avec les ventes, la
   commission TTC, les ajustements, le montant versé et la date du virement.
   L'export ne dit pas de quel jour est la télécollecte : on la rattache au
   jour dont le CB saisi par SAIB (Sabich + TMSK, même borne) est EXACTEMENT
   le même montant, dans les 15 jours avant le virement. Si aucun jour ne
   colle au dirham près, LIFE le dit — c'est un écart de saisie ou de borne,
   pas une supposition. La commission réelle est ensuite partagée entre Sabich
   et TMSK au prorata de leurs tickets CB du jour. */
const POINTS_NAPS = ["sabich", "tmsk"];
const jourDecale = (iso, n) => {
  const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const jjmm = (iso) => (iso || "").slice(8, 10) + "/" + (iso || "").slice(5, 7);
const dateFR = (iso) => iso ? iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4) : "—";
/* Un tableau sur une seule ligne par rangée : rien ne passe à la ligne, et
   sur un petit écran il défile sur le côté plutôt que d'écraser les colonnes.
   cols = [{ t: "Titre", w: "1fr", g: true (aligné à gauche) }], rows = [{ k, c: [cellules], s: style }] */
function Tableau({ cols, rows, pied, min = 560 }) {
  const grille = { display: "grid", gridTemplateColumns: cols.map((c) => c.w || "1fr").join(" "),
                   gap: 12, alignItems: "center", padding: "10px 0", whiteSpace: "nowrap",
                   fontSize: 16, borderBottom: "1px solid rgba(0,0,0,.06)" };
  const al = (i) => ({ textAlign: cols[i].g ? "left" : "right" });
  return (
    <div style={{ overflowX: "auto" }}><div style={{ minWidth: min }}>
      <div style={{ ...grille, fontSize: 14, fontWeight: 600, letterSpacing: ".08em",
                    textTransform: "uppercase", color: "var(--u-titre)" }}>
        {cols.map((c, i) => <span key={i} style={al(i)}>{c.t}</span>)}
      </div>
      {rows.map((r) => (
        <div key={r.k} style={{ ...grille, ...(r.s || {}) }}>
          {r.c.map((x, i) => <span key={i} style={al(i)}>{x}</span>)}
        </div>
      ))}
      {pied && <div style={{ ...grille, borderBottom: "none", fontWeight: 600 }}>
        {pied.map((x, i) => <span key={i} style={al(i)}>{x}</span>)}</div>}
    </div></div>
  );
}
const carteDe = (v) => v.carte !== undefined ? num(v.carte) : num(v.napsMa) + num(v.napsEtr);
const napsVerse = (t) => /vers/i.test(String(t.statut || ""));
function rapprocherNaps(entries) {
  const jours = {};
  (entries || []).forEach((v) => {
    if (v.type !== "vente" || !v.date || !POINTS_NAPS.includes(v.affaire)) return;
    const c = carteDe(v);
    const j = jours[v.date] || (jours[v.date] = { total: 0, par: {} });
    j.total += c; j.par[v.affaire] = (j.par[v.affaire] || 0) + c;
  });
  const tcs = (entries || []).filter((e) => e.type === "napsTc")
    .sort((a, b) => (a.dateVir || "").localeCompare(b.dateVir || "")
                    || String(a.tc).localeCompare(String(b.tc)));
  const parJour = {};
  const res = tcs.map((t) => {
    const min = jourDecale(t.dateVir, -15);
    const cands = Object.keys(jours).filter((d) => !parJour[d] && d < t.dateVir && d >= min
      && Math.abs(jours[d].total - num(t.ventes)) < 0.5).sort();
    const jour = cands.length ? cands[cands.length - 1] : null;
    const r = { ...t, jour, cout: num(t.ventes) - num(t.verse) };
    if (jour) parJour[jour] = r;
    return r;
  });
  return { tcs: res, parJour, jours };
}

/* Lecture de l'Excel Naps, dans le navigateur. On repère les colonnes par
   leur nom, pas par leur place : si Naps les réordonne, rien ne casse. */
const sansAccent = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/\s+/g, " ").trim();
const dateNaps = (v) => {
  if (typeof v === "number") {            // date Excel
    const d = new Date(Math.round((v - 25569) * 864e5));
    return d.toISOString().slice(0, 10);
  }
  const m = String(v || "").trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
  if (m) return m[3] + "-" + m[2].padStart(2, "0") + "-" + m[1].padStart(2, "0");
  const m2 = String(v || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m2 ? m2[0] : "";
};
const r2 = (v) => Math.round(num(v) * 100) / 100;
async function lireExportNaps(fichier) {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(await fichier.arrayBuffer(), { type: "array" });
  const lignes = [];
  wb.SheetNames.forEach((nomFeuille) => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[nomFeuille], { header: 1, raw: true, defval: "" });
    const iH = rows.findIndex((r) => r.some((c) => sansAccent(c).includes("telecollecte")));
    if (iH < 0) return;
    const H = rows[iH].map(sansAccent);
    const col = (test) => H.findIndex(test);
    const C = {
      tc: col((h) => h.includes("telecollecte")),
      nb: col((h) => h.includes("transaction")),
      ventes: col((h) => h === "ventes" || h.startsWith("vente")),
      commission: col((h) => h.startsWith("commission")),
      ajust: col((h) => h.startsWith("ajustement")),
      verse: col((h) => h.includes("verse")),
      statut: col((h) => h === "statut"),
      dateVir: col((h) => h.includes("date") && h.includes("virement")),
      pdv: col((h) => h.includes("point de vente")),
    };
    if ([C.tc, C.ventes, C.verse, C.dateVir].some((i) => i < 0)) return;
    rows.slice(iH + 1).forEach((r) => {
      const tc = String(r[C.tc] ?? "").trim();
      if (!tc) return;
      lignes.push({
        tc, nb: C.nb >= 0 ? num(r[C.nb]) : 0,
        ventes: r2(r[C.ventes]), commission: C.commission >= 0 ? r2(r[C.commission]) : 0,
        ajust: C.ajust >= 0 ? r2(r[C.ajust]) : 0, verse: r2(r[C.verse]),
        statut: C.statut >= 0 ? String(r[C.statut] || "").trim() : "",
        dateVir: dateNaps(r[C.dateVir]),
        pdv: C.pdv >= 0 ? String(r[C.pdv] || "").trim() : "",
      });
    });
  });
  return lignes.filter((l) => l.dateVir);
}

/* Espèces ou carte ? La part de chaque mode de paiement sur Sabich + TMSK,
   pour le mois affiché. Un camembert, deux parts, et le détail par comptoir. */
function CashCbCamembert({ config, entries, ym }) {
  const points = ["sabich", "tmsk"];
  const nom = (k) => (config.affaires[k] || {}).nom || k;
  const par = {};
  points.forEach((k) => { par[k] = { esp: 0, cb: 0 }; });
  entries.forEach((e) => {
    if (e.type !== "vente" || !par[e.affaire] || !(e.date || "").startsWith(ym)) return;
    const cb = carteDe(e);
    const esp = e.espece !== undefined ? num(e.espece) : num(e.montant) - cb;
    par[e.affaire].esp += Math.max(0, esp); par[e.affaire].cb += Math.max(0, cb);
  });
  const esp = points.reduce((s, k) => s + par[k].esp, 0);
  const cb = points.reduce((s, k) => s + par[k].cb, 0);
  const tot = esp + cb;
  const COL_ESP = "#A7748C", COL_CB = "#E3CCD7";
  const p = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;

  return (
    <div className="card">
      <h2 className="h2">Espèces ou carte</h2>
      {tot <= 0 ? <div className="mini">Aucune recette saisie ce mois-ci.</div> : (
        <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          <div role="img" aria-label={"Espèces " + p(esp, tot) + " %, carte " + p(cb, tot) + " %"}
               style={{ width: 170, height: 170, borderRadius: "50%", flex: "0 0 auto",
                        background: `conic-gradient(${COL_ESP} 0 ${esp / tot * 360}deg, ${COL_CB} 0 360deg)`,
                        boxShadow: "0 0 0 3px #fff inset" }} />
          <div style={{ flex: 1, minWidth: 200 }}>
            {[["Espèces", esp, COL_ESP], ["Carte (CB)", cb, COL_CB]].map(([lbl, v, col]) => (
              <div className="row" key={lbl}>
                <span className="lbl" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: col, display: "inline-block" }} />
                  {lbl}</span>
                <span className="val"><b style={{ fontWeight: 600 }}>{p(v, tot)} %</b>
                  <span className="mini"> · {fmt(v)}</span></span>
              </div>
            ))}
            {points.map((k) => {
              const t = par[k].esp + par[k].cb;
              if (t <= 0) return null;
              return (
                <div className="mini" key={k} style={{ marginTop: 8 }}>
                  {nom(k)} : {p(par[k].esp, t)} % espèces · {p(par[k].cb, t)} % carte
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CelluleCB({ ventes, onMaj }) {
  const [edit, setEdit] = useState(false);
  const [v, setV] = useState("");
  const total = ventes.reduce((s, e) => s + carteDe(e), 0);
  if (!ventes.length) return <span className="mini" style={{ textAlign: "right" }}>—</span>;
  const unique = ventes.length === 1 ? ventes[0] : null;
  const valider = () => {
    setEdit(false);
    if (!unique || !montantLisible(v) || String(v).trim() === "") return;
    const c = num(v);
    if (Math.abs(c - total) < 0.5) return;
    const esp = unique.espece !== undefined ? num(unique.espece) : num(unique.montant) - total;
    onMaj(unique.id, { carte: c, espece: esp, montant: esp + c, napsMa: undefined, napsEtr: undefined });
  };
  if (edit) return (
    <input className="f" inputMode="decimal" autoFocus value={v}
           style={{ padding: "6px 8px", textAlign: "right", minWidth: 0 }}
           onChange={(e) => setV(e.target.value)} onBlur={valider}
           onKeyDown={(e) => { if (e.key === "Enter") valider(); if (e.key === "Escape") setEdit(false); }} />
  );
  return (
    <button onClick={() => { if (unique) { setV(String(total)); setEdit(true); } }}
            title={unique ? "Corriger" : ""}
            style={{ background: "none", border: "none", padding: 0, textAlign: "right",
                     font: "inherit", color: "inherit", cursor: unique ? "pointer" : "default" }}>
      {fmt(total)}</button>
  );
}

function CbParPoint({ config, entries, ym, onMaj }) {
  const gauche = "sabich", droite = "tmsk";
  const nom = (k) => (config.affaires[k] || {}).nom || k;
  const R = rapprocherNaps(entries);
  const ventes = entries.filter((e) => e.type === "vente" && (e.date || "").startsWith(ym)
                                    && (e.affaire === gauche || e.affaire === droite));
  const jours = [...new Set(ventes.filter(() => true).map((e) => e.date))].sort();
  const de = (iso, k) => ventes.filter((e) => e.date === iso && e.affaire === k);
  const somme = (l) => l.reduce((s, e) => s + carteDe(e), 0);
  const totG = somme(ventes.filter((e) => e.affaire === gauche));
  const totD = somme(ventes.filter((e) => e.affaire === droite));
  /* Ce que Naps a réellement versé pour les jours du mois (net de commission) */
  const totRecu = jours.reduce((s, iso) => s + (R.parJour[iso] && napsVerse(R.parJour[iso])
    ? num(R.parJour[iso].verse) : 0), 0);
  const totCom = jours.reduce((s, iso) => s + (R.parJour[iso] && napsVerse(R.parJour[iso])
    ? R.parJour[iso].cout : 0), 0);
  const fmt2 = (n) => (Math.round(n * 100) / 100).toLocaleString("fr-FR",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DH";
  const grille = { display: "grid", gridTemplateColumns: "minmax(110px, 1fr) 1fr 1fr 1fr 1fr 1.15fr minmax(110px, 1fr)",
                   gap: 10, alignItems: "center", padding: "10px 0", whiteSpace: "nowrap",
                   fontSize: 16, borderBottom: "1px solid rgba(0,0,0,.06)" };
  const d = { textAlign: "right" };

  return (
    <div className="card">
      <h2 className="h2">CB par point de vente</h2>
      {!jours.length ? <div className="mini">Aucune recette saisie ce mois-ci.</div> : (
        <>
          <div style={{ overflowX: "auto" }}><div style={{ minWidth: 820 }}>
          <div style={{ ...grille, fontSize: 14, fontWeight: 600, letterSpacing: ".08em",
                        textTransform: "uppercase", color: "var(--u-titre)" }}>
            <span>Jour</span><span style={d}>{nom(gauche)}</span><span style={d}>{nom(droite)}</span>
            <span style={d}>Total CB</span><span style={d}>Commission</span><span style={d}>Reçu</span><span style={d}>Viré le</span>
          </div>
          {jours.map((iso) => {
            const g = de(iso, gauche), dr = de(iso, droite);
            const vir = R.parJour[iso] && napsVerse(R.parJour[iso])
              ? { date: R.parJour[iso].dateVir, verse: num(R.parJour[iso].verse),
                  com: R.parJour[iso].cout } : null;
            return (
              <div key={iso} style={grille}>
                <span>{dateFR(iso)}</span>
                <span style={d}><CelluleCB ventes={g} onMaj={onMaj} /></span>
                <span style={d}><CelluleCB ventes={dr} onMaj={onMaj} /></span>
                <span style={{ ...d, fontWeight: 500 }}>{fmt(somme(g) + somme(dr))}</span>
                <span style={{ ...d, color: vir ? "#9B1B22" : undefined }}>{vir ? "− " + fmt2(vir.com) : "—"}</span>
                <span style={{ ...d, color: vir ? "#4F6B1F" : undefined }}>{vir ? fmt2(vir.verse) : "—"}</span>
                <span style={d}>{vir ? dateFR(vir.date) : "—"}</span>
              </div>
            );
          })}
          <div style={{ ...grille, borderBottom: "none", fontWeight: 600 }}>
            <span>Mois</span><span style={d}>{fmt(totG)}</span><span style={d}>{fmt(totD)}</span>
            <span style={d}>{fmt(totG + totD)}</span>
            <span style={{ ...d, color: "#9B1B22" }}>{totCom > 0 ? "− " + fmt2(totCom) : "—"}</span>
            <span style={{ ...d, color: "#4F6B1F" }}>{totRecu > 0 ? fmt2(totRecu) : "—"}</span><span />
          </div>
          </div></div>
          <div className="mini" style={{ marginTop: 6 }}>
            Total CB = tickets saisis par SAIB (clique un montant pour le corriger). Commission et Reçu :
            ce que Naps a vraiment pris et versé sur Le Mi-Chui, d'après son export.
          </div>
        </>
      )}
    </div>
  );
}

function NapsExport({ config, entries, ym, onImporter, onDel }) {
  const [msg, setMsg] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);
  const R = rapprocherNaps(entries);
  const pct = (a, b) => b > 0 ? (a / b * 100).toFixed(2).replace(".", ",") + " %" : "—";

  const choisir = async (ev) => {
    const f = ev.target.files && ev.target.files[0];
    ev.target.value = "";
    if (!f) return;
    setErreur(""); setMsg(""); setEnCours(true);
    try {
      const lignes = await lireExportNaps(f);
      if (!lignes.length) {
        setErreur("Ce fichier ne ressemble pas à l'export des virements Naps (colonne « N° télécollecte » introuvable).");
      } else {
        const connus = new Set(entries.filter((e) => e.type === "napsTc").map((e) => String(e.tc)));
        const nouveaux = lignes.filter((l) => !connus.has(l.tc)).length;
        onImporter(lignes);
        setMsg(nouveaux + " télécollecte" + (nouveaux > 1 ? "s" : "") + " ajoutée" + (nouveaux > 1 ? "s" : "")
          + (lignes.length - nouveaux > 0 ? ", " + (lignes.length - nouveaux) + " déjà connue"
             + (lignes.length - nouveaux > 1 ? "s" : "") + " (mise à jour)" : "") + ".");
      }
    } catch (e) {
      setErreur("Impossible de lire ce fichier. Vérifie que c'est bien l'Excel téléchargé depuis l'espace Naps.");
    }
    setEnCours(false);
  };

  /* Le mois affiché = les jours de CB de ce mois */
  const duMois = R.tcs.filter((t) => t.jour && t.jour.startsWith(ym))
    .sort((a, b) => b.jour.localeCompare(a.jour));
  const T = duMois.reduce((s, t) => ({ ventes: s.ventes + num(t.ventes), cout: s.cout + t.cout,
    verse: s.verse + (napsVerse(t) ? num(t.verse) : 0) }), { ventes: 0, cout: 0, verse: 0 });
  const orphelins = R.tcs.filter((t) => !t.jour && (t.dateVir || "") >= jourDecale(ym + "-01", 0)
                                         && (t.dateVir || "") <= jourDecale(ym + "-01", 45));
  const auj = aujourdhui();
  const pasVus = Object.keys(R.jours).filter((d) => d.startsWith(ym) && d < auj
    && R.jours[d].total > 0 && !R.parJour[d]).sort();
  const totPasVus = pasVus.reduce((s, d) => s + R.jours[d].total, 0);
  const dernierImport = entries.filter((e) => e.type === "napsTc")
    .map((e) => e.importeLe || "").sort().pop();

  return (
    <div className="card">
      <h2 className="h2">Naps</h2>

      <label className="btn" style={{ display: "inline-block", cursor: enCours ? "wait" : "pointer", margin: 0 }}>
        {enCours ? "LECTURE…" : "IMPORTER L'EXPORT NAPS"}
        <input type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }}
               onChange={choisir} disabled={enCours} />
      </label>
      <div className="mini" style={{ marginTop: 8 }}>
        L'Excel des virements, téléchargé depuis l'espace Naps. Le recharger ne crée jamais de doublon.
        {dernierImport ? " Dernier import : " + dateFR(dernierImport) + "." : ""}
      </div>
      <Alerte>{erreur}</Alerte>
      {msg && <div className="mini" style={{ marginTop: 8, color: "#4F6B1F" }}>{msg}</div>}

      {duMois.length > 0 && (() => {
        /* Le contrôle du mois : ce que Naps a pris, face à ce que dit le
           contrat (3 % HT + TVA). L'écart est ce qu'Amal leur réclame. */
        const N = config.naps || { tauxHT: 3, tva: 10 };
        const tauxTTC = num(N.tauxHT) * (1 + num(N.tva) / 100);
        const lignes = duMois.map((t) => {
          const du = Math.round(num(t.ventes) * tauxTTC) / 100;
          return { ...t, du, ecart: Math.round((t.cout - du) * 100) / 100 };
        }).sort((a, b) => a.jour.localeCompare(b.jour));
        const pris = lignes.reduce((s, l) => s + l.cout, 0);
        const du = lignes.reduce((s, l) => s + l.du, 0);
        const trop = Math.round((pris - du) * 100) / 100;
        const aReclamer = lignes.filter((l) => Math.abs(l.ecart) >= 0.5);
        const f2 = (n) => (Math.round(n * 100) / 100).toLocaleString("fr-FR",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DH";
        const tx = String(Math.round(tauxTTC * 100) / 100).replace(".", ",");
        return (
          <div style={{ marginTop: 20, border: "2px solid #9B1B22", borderRadius: 14,
                        background: "#FBF1F2", padding: "18px 18px 14px" }}>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: ".12em",
                          textTransform: "uppercase", color: "#7A0E14" }}>
              Contrôle Naps du mois</div>
            <div className="mini" style={{ margin: "4px 0 12px" }}>
              Contrat : {String(N.tauxHT).replace(".", ",")} % HT + TVA {N.tva} % = {tx} % TTC
            </div>
            <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div>
                <div className="eyebrow">{trop > 0.5 ? "Pris en trop" : "Écart"}</div>
                <div style={{ fontSize: 34, fontWeight: 300, lineHeight: 1.1,
                              color: trop > 0.5 ? "#9B1B22" : "#4F6B1F" }}>
                  {Math.abs(trop) < 0.5 ? "0 DH" : f2(trop)}</div>
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div className="row"><span className="lbl">Prélevé par Naps</span>
                  <span className="val">{f2(pris)}</span></div>
                <div className="row"><span className="lbl">Dû selon le contrat</span>
                  <span className="val">{f2(du)}</span></div>
              </div>
            </div>
            {aReclamer.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>À leur signaler</div>
                <Tableau min={640}
                  cols={[{ t: "CB du", g: true, w: "minmax(110px, 1fr)" }, { t: "Télécollecte", w: "1fr" },
                         { t: "Ventes", w: "1fr" }, { t: "Prélevé", w: "1fr" }, { t: "Dû", w: "1fr" },
                         { t: "Écart", w: "1fr" }]}
                  rows={aReclamer.map((l) => ({ k: l.id, c: [dateFR(l.jour), l.tc, fmt(num(l.ventes)),
                    f2(l.cout), f2(l.du),
                    <span style={{ color: l.ecart > 0 ? "#9B1B22" : "#4F6B1F", fontWeight: 600 }}>
                      {l.ecart > 0 ? "+ " : "− "}{f2(Math.abs(l.ecart))}</span>] }))} />
              </div>
            )}
          </div>
        );
      })()}

      {duMois.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div className="row rowTot">
            <span className="lbl">Commission réelle Naps</span>
            <span className="val neg">− {fmt(T.cout)} <span className="mini">· {pct(T.cout, T.ventes)}</span></span>
          </div>
          <div className="row">
            <span className="lbl">CB vu par Naps <span className="mini">· {duMois.length} jour{duMois.length > 1 ? "s" : ""}</span></span>
            <span className="val">{fmt(T.ventes)}</span>
          </div>
          <div className="row">
            <span className="lbl">Versé sur Le Mi-Chui</span>
            <span className="val">{fmt(T.verse)}</span>
          </div>
          <div className="eyebrow" style={{ margin: "18px 0 6px" }}>Jour par jour</div>
          <Tableau min={680}
            cols={[{ t: "CB du", g: true, w: "minmax(110px, 1fr)" }, { t: "Ventes", w: "1fr" },
                   { t: "Commission", w: "1.1fr" }, { t: "Versé", w: "1.1fr" },
                   { t: "Viré le", w: "minmax(110px, 1fr)" }, { t: "", w: "28px" }]}
            rows={[...duMois].sort((a, b) => a.jour.localeCompare(b.jour)).map((t) => ({ k: t.id, c: [
              dateFR(t.jour), fmt(num(t.ventes)),
              <span className="neg">{fmt(t.cout)} <span className="mini">({pct(t.cout, num(t.ventes))})</span></span>,
              napsVerse(t) ? <span style={{ color: "#4F6B1F" }}>{fmt(num(t.verse))}</span> : (t.statut || "—"),
              napsVerse(t) ? dateFR(t.dateVir) : "—",
              <button className="del" aria-label="Supprimer" onClick={() => onDel(t.id)}>×</button>] }))} />
        </div>
      )}

      {pasVus.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="row">
            <span className="lbl">CB saisi, pas encore chez Naps
              <span className="mini"> · {pasVus.map(dateFR).join(", ")}</span></span>
            <span className="val" style={{ color: "#8A7440" }}>{fmt(totPasVus)}</span>
          </div>
          {pasVus.some((d) => d < jourDecale(auj, -15)) && (
            <div className="mini" style={{ color: "#9B1B22" }}>
              Plus de 15 jours sans virement pour {pasVus.filter((d) => d < jourDecale(auj, -15)).map(dateFR).join(", ")} :
              importe un export récent, ou vérifie le CB saisi ce jour-là.
            </div>
          )}
        </div>
      )}

      {orphelins.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {orphelins.map((t) => (
            <div className="row" key={t.id}>
              <span className="lbl" style={{ color: "#9B1B22" }}>
                Naps : {fmt(num(t.ventes))} versé le {dateFR(t.dateVir)} — aucun jour saisi ne correspond
                <span className="mini"> · télécollecte {t.tc}. Vérifie le CB saisi les jours précédents.</span></span>
              <button className="del" aria-label="Supprimer" onClick={() => onDel(t.id)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SolidariteCarte({ M, config, ym, onAdd, onRegler, flash }) {
  const [saisi, setSaisi] = useState("");
  const [erreur, setErreur] = useState("");
  const prevu = num((config.solidarite || {}).montant);

  const verser = () => {
    if (num(saisi) <= 0) { setErreur("Montant manquant — écris ce que tu as réellement donné."); return; }
    setErreur("");
    onAdd({ type: "solidarite", date: ym + "-" + String(num((config.solidarite || {}).jour) || 1)
              .padStart(2, "0"), montant: num(saisi), lbl: "Solidarité" });
    flash("Solidarité de " + fmt(num(saisi)) + " enregistrée.");
    setSaisi("");
  };

  return (
    <div className="card">
      <h2 className="h2">Solidarité</h2>
      <div className="row">
        <span className="lbl">Ce mois-ci</span>
        <span className="val">{fmt(M.solidarite)}
          {M.soliVerse === 0 && <span className="tag" style={{ marginLeft: 8 }}>prévu</span>}</span>
      </div>
      {M.soliPointe > 0 && onRegler && (
        <div className="row">
          <span className="lbl">Pointé « fait » : {fmt(M.soliPointe)}</span>
          <button className="pill" onClick={() => onRegler("solidarite", false)}>Annuler</button>
        </div>
      )}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginTop: 14 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Montant réellement donné</label>
          <input className="f" inputMode="decimal" placeholder={String(prevu)} value={saisi}
                 onChange={(e) => { setSaisi(e.target.value); setErreur(""); }}
                 onKeyDown={(e) => { if (e.key === "Enter") verser(); }} />
        </div>
        <button className="btn" onClick={verser}>Enregistrer</button>
      </div>
      <Alerte>{erreur}</Alerte>
      <div className="note">
        Ce n'est ni une charge de tes commerces ni une dépense du ménage : c'est une décision.
        Elle sort donc de la trésorerie sans entrer dans le résultat ni dans ton seuil de
        rentabilité. Tant que rien n'est saisi, l'app retient le montant prévu.
      </div>
    </div>
  );
}

function Foyer({ M, config, onAdd, ym, onRegler, onChiffrer, entries }) {
  const [ok, setOk] = useState("");
  const [formOuvert, setFormOuvert] = useState(false);
  const flash = (m) => { setOk(m); setTimeout(() => setOk(""), 2600); };
  const defDate = ym === thisMonth() ? today() : ym + "-01";
  const nomA = (k) => (config.affaires[k] && config.affaires[k].nom) || k;
  const ligneCochee = (id) => { const l = M.lignesAPayer.find((x) => x.id === id); return l ? l.paye : false; };
  /* Ce qui se coche : tout ce qui est fixe. Les factures variables (eau,
     électricité, téléphone) attendent leur vrai montant, plus bas. */
  const fixes = config.foyer.fixes.filter((f) => !f.variable);
  const extras = (entries || []).filter((e) => e.type === "avance" && e.nature === "perso"
                                         && (e.date || "").startsWith(ym));
  const totalExtras = extras.reduce((s, e) => s + num(e.montant), 0);

  const ligne = (id, lbl, jour, montant, tag) => {
    const paye = ligneCochee(id);
    return (
      <div className="row" key={id}>
        <span style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <Coche paye={paye} onClick={() => onRegler(id, !paye)} />
          <span style={{ color: paye ? "#9AA487" : "#5F6E4C", textDecoration: paye ? "line-through" : "none" }}>
            {lbl} <span className="mini">— le {jour}</span>{tag}
          </span>
        </span>
        <span className="val" style={{ color: paye ? "#9AA487" : undefined }}>{fmt(montant)}</span>
      </div>
    );
  };

  return (
    <>
      {ok && <div className="note" style={{ color: "#4F6B1F" }}>{ok}</div>}

      <div className="card">
        <h2 className="h2">Traites et charges fixes</h2>
        {fixes.map((f) => ligne(f.id, f.lbl, f.jour, num(f.montant),
          f.transitoire ? <span className="tag" style={{ marginLeft: 8 }}>temporaire</span> : null))}
        <div className="row rowTot"><span className="lbl">Reste à payer</span>
          <span className="val">{fmt(fixes.filter((f) => !ligneCochee(f.id)).reduce((s, f) => s + num(f.montant), 0))}</span>
        </div>
        <FacturesAttendues liste={(M.facturesAttendues || []).filter((f) => f.groupe === "foyer")}
                           onChiffrer={onChiffrer} />
      </div>

      <div className="card">
        <h2 className="h2">Vos salaires — le 1er du mois</h2>
        {M.remus.map((r) => ligne(r.id, r.nom, r.jour, num(r.montant)))}
        <div className="note">
          Ils couvrent les courses, l'épicerie, Glovo, l'essence et l'argent de poche de chacun :
          LIFE ne les suit pas, c'est à chacun de gérer son salaire.
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 className="h2" style={{ margin: 0 }}>Dépenses en plus</h2>
          <span className="val">{fmt(totalExtras)}</span>
        </div>
        {extras.map((e) => (
          <div className="row" key={e.id}>
            <span className="lbl">{e.qui && e.qui !== "—" ? e.qui : "Dépense"}
              <span className="mini"> · {(e.date || "").slice(8, 10)}/{(e.date || "").slice(5, 7)}
                {e.source ? " · pris sur " + nomA(e.source) : ""}</span></span>
            <span className="val">{fmt(num(e.montant))}</span>
          </div>
        ))}
        <button className="pill" style={{ marginTop: 10 }} onClick={() => setFormOuvert(!formOuvert)}>
          {formOuvert ? "× Fermer" : "+ Dépense en plus"}
        </button>
        {formOuvert && <FExtra config={config} defDate={defDate} flash={flash}
                               onAdd={(e) => { onAdd(e); setFormOuvert(false); }} />}
        <div className="note">
          La santé, un cadeau, un imprévu : ce qui dépasse vos salaires. Choisis l'affaire dans
          laquelle tu pioches — c'est sa caisse qui baisse, et elle le voit sur sa fiche.
        </div>
      </div>

      {M.doubleLog > 0 && (
        <div className="card" style={{ background: "#FDF6E7", borderColor: "#E9D9AE" }}>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#B07C1E" }}>
            Double logement — {fmt(M.doubleLog)} par mois
          </div>
          <div className="mini" style={{ marginTop: 8, color: "#8A7440" }}>
            Soit {Math.round((M.doubleLog / M.enveloppe) * 100)} % de vos rémunérations, et
            {" " + fmt(M.doubleLog * 12)} sur une année pleine. Chaque mois gagné sur
            l'emménagement, c'est {fmt(M.doubleLog)} qui reviennent dans la trésorerie.
            {config.foyer.finDoubleLogement
              ? " Fin prévue : " + config.foyer.finDoubleLogement + "."
              : " Note la date prévue dans les Paramètres."}
          </div>
        </div>
      )}

    </>
  );
}

/* ------------------------------------------------------------------ */
/*  ACHATS — vue d'audit des pièces                                    */
/* ------------------------------------------------------------------ */

/* Le Journal sert à relire une journée : il mêle recettes, achats, avances.
   Pour vérifier une série de factures et repérer une saisie faite deux fois,
   il faut l'inverse — les achats seuls, en colonnes, triables. */

const moisDecale = (ym, n) => {
  const [a, m] = ym.split("-").map(Number);
  const d = new Date(a, m - 1 - n, 1);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
};

const PIECES = { bl: "BL", facture: "Facture", bon: "Bon" };

/* Deux règles, volontairement strictes pour ne pas crier au loup :
   - même activité, même intitulé, MÊME NUMÉRO de pièce (quelle que soit la date) ;
   - même activité, même intitulé, même montant, LE MÊME JOUR.
   Le pain à 10 DH tous les jours n'est donc pas signalé, une facture ressaisie l'est. */
const suspectAchat = (e, list) => {
  const l = (e.lbl || "").trim().toLowerCase();
  const n = (e.numero || "").trim().toLowerCase();
  if (num(e.montant) <= 0) return true;
  if (n && list.some((o) => o.id !== e.id && o.affaire === e.affaire
        && (o.lbl || "").trim().toLowerCase() === l
        && (o.numero || "").trim().toLowerCase() === n)) return true;
  return list.some((o) => o.id !== e.id && o.affaire === e.affaire
        && o.date === e.date
        && (o.lbl || "").trim().toLowerCase() === l
        && num(o.montant) === num(e.montant));
};

function Achats({ entries, ym, config, onDel, onMaj, filtre }) {
  const [periode, setPeriode] = useState("mois");
  const [tri, setTri] = useState({ col: "date", sens: -1 });
  const [edit, setEdit] = useState("");

  const nom = (k) => k === "foyer" ? "La maison"
                   : k === "structure" ? "Structure"
                   : config.affaires[k] ? config.affaires[k].nom : k;

  const debut = moisDecale(ym, 2);
  const base = entries.filter((e) => {
    if (e.type !== "depense" && e.type !== "invest") return false;
    if (filtre && e.affaire !== filtre) return false;
    const m = (e.date || "").slice(0, 7);
    if (periode === "mois") return m === ym;
    if (periode === "trois") return m >= debut && m <= ym;
    return true;
  });

  const valeur = (e, col) => {
    if (col === "date")    return e.date || "";
    if (col === "piece")   return e.type === "invest" ? "Investissement" : (PIECES[e.piece] || "Facture");
    if (col === "numero")  return (e.numero || "").toLowerCase();
    if (col === "lbl")     return ((e.lbl || "") + " " + nom(e.affaire)).toLowerCase();
    if (col === "montant") return num(e.montant);
    if (col === "par")     return (e.par || "").toLowerCase();
    return e.aPayer ? 1 : 0;
  };
  const list = [...base].sort((a, b) => {
    const x = valeur(a, tri.col), y = valeur(b, tri.col);
    if (x === y) return (a.date < b.date ? 1 : -1);
    return (x > y ? 1 : -1) * tri.sens;
  });

  const marques = new Set(base.filter((e) => suspectAchat(e, base)).map((e) => e.id));
  const total = base.reduce((s, e) => s + num(e.montant), 0);
  const trier = (col) => setTri(tri.col === col ? { col, sens: -tri.sens } : { col, sens: 1 });
  const fleche = (col) => tri.col === col ? (tri.sens === 1 ? " ▲" : " ▼") : "";

  const PERIODES = [["mois", "Ce mois"], ["trois", "3 derniers mois"], ["tout", "Tout"]];
  const COLS = [["date", "Date"], ["piece", "Pièce"], ["numero", "N°"],
                ["lbl", "Fournisseur / intitulé"], ["montant", "Montant"], ["etat", "État"],
                ["par", "Saisi par"]];

  return (
    <div className="card">
      <h2 className="h2">Achats et investissements</h2>

      <div className="navSimple" style={{ marginBottom: 14 }}>
        {PERIODES.map(([id, lbl]) => (
          <button key={id} className={"pill" + (periode === id ? " on" : "")}
                  onClick={() => { setPeriode(id); setEdit(""); }}>{lbl}</button>
        ))}
      </div>

      {!base.length ? (
        <div className="empty">Aucun achat sur cette période.</div>
      ) : (
        <>
          <div className="row rowTot" style={{ marginBottom: 6 }}>
            <span className="lbl">
              {base.length} pièce{base.length > 1 ? "s" : ""}
              {marques.size > 0 && " · " + marques.size + " à vérifier"}
            </span>
            <span className="val neg">{fmt(total)}</span>
          </div>

          <div className="achBloc">
            <div className="achLigne achTete">
              {COLS.map(([id, lbl]) => (
                <span key={id} className={id === "montant" ? "achMt" : ""}>
                  <button onClick={() => trier(id)}>{lbl}{fleche(id)}</button>
                </span>
              ))}
              <span />
            </div>

            {list.map((e) => edit === e.id ? (
              <MvtLigne key={e.id} e={e} config={config} onDel={onDel} onMaj={onMaj}
                        ouvrir onFerme={() => setEdit("")}
                        couleur={config.affaires[e.affaire] ? teinte(config.affaires[e.affaire]) : "#C3CDAF"}
                        sous={e.date}
                        libelle={(e.lbl || "Achat") + " — " + nom(e.affaire)} />
            ) : (
              <div key={e.id} className={"achLigne achCorps" + (marques.has(e.id) ? " dbl" : "")}
                   onClick={() => setEdit(e.id)}>
                <span>{(e.date || "").slice(8, 10)}/{(e.date || "").slice(5, 7)}/{(e.date || "").slice(2, 4)}</span>
                <span className="achEtat">{e.type === "invest" ? "Invest." : (PIECES[e.piece] || "Facture")}</span>
                <span className="achEtat">{e.numero || "—"}</span>
                <span>{e.lbl || "Achat"}{!filtre && <span className="achEtat"> · {nom(e.affaire)}</span>}</span>
                <span className="achMt">{fmt(num(e.montant))}</span>
                <span className={"achEtat" + (e.aPayer ? " du" : "")}>
                  {e.type === "invest" ? "—" : e.aPayer ? "À régler" : "Payé"}
                </span>
                <span className="achEtat">{signature(e) || "—"}</span>
                <button className="del" onClick={(x) => { x.stopPropagation(); onDel(e.id); }}
                        aria-label="Supprimer">×</button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="note">
        Clique sur une ligne pour corriger la pièce, la croix la supprime. Clique sur un
        titre de colonne pour trier : par fournisseur ou par montant, les doublons se
        retrouvent côte à côte. Les lignes en rouge sont à vérifier — même numéro de pièce
        saisi deux fois, ou même montant saisi deux fois le même jour.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MOUVEMENTS                                                         */
/* ------------------------------------------------------------------ */

function Mouvements({ entries, ym, config, onDel, onMaj, filtre }) {
  const list = entries.filter((e) => (e.date || "").startsWith(ym)
                                     && e.type !== "paye" && e.type !== "reporte" && e.type !== "impaye"
                                     && (!filtre || e.affaire === filtre))
                      .sort((a, b) => (a.date < b.date ? 1 : -1));

  const nom = (k) => k === "foyer" ? "La maison" : config.affaires[k] ? config.affaires[k].nom : k;
  const libelle = (e) => {
    if (e.type === "vente") {
      const parts = [];
      if (num(e.espece) > 0) parts.push(fmt(num(e.espece)) + " en espèces"
        + (num(e.fondsRetire) > 0 ? " (fonds déduit)" : ""));
      const carte = e.carte !== undefined ? num(e.carte) : num(e.napsMa) + num(e.napsEtr);
      if (carte > 0) parts.push(fmt(carte) + " par carte");
      const ec = e.caisse !== undefined ? num(e.montant) - num(e.caisse) : 0;
      return "Recette — " + nom(e.affaire)
        + (parts.length ? " · " + parts.join(", ") : "")
        + (e.tickets ? " · " + e.tickets.length + " ticket" + (e.tickets.length > 1 ? "s" : "") : "")
        + (Math.abs(ec) >= 1 ? " · écart " + fmt(ec) : "");
    }
    if (e.type === "resa")    return "Séjour " + (e.nuits || "?") + " nuits — " + nom(e.affaire)
                                     + " · " + (e.source === "direct" ? "direct" : "Airbnb")
                                     + (e.reference ? " · réf. " + e.reference : "")
                                     + (e.aRecevoir ? " · pas encore encaissé" : "");
    if (e.type === "repas") {
      const natures = { pdj: "Petit-déjeuner", dej: "Déjeuner", diner: "Dîner",
                         boisson: "Boisson", excursion: "Excursion", transport: "Transport", autre: "Extra" };
      return (natures[e.categorie] || "Extra") + " — " + nom(e.affaire)
        + (e.couverts ? " · " + e.couverts + " couvert" + (e.couverts > 1 ? "s" : "") : "")
        + (e.statut === "offert" ? " · offert" + (e.motif ? " (" + e.motif + ")" : "") : "")
        + (e.reference ? " · réf. " + e.reference : "");
    }
    if (e.type === "prime")   return e.lbl || "Prime";
    if (e.type === "solidarite") return "Solidarité";
    if (e.type === "chantier") return "Mis de côté — " + ((config.chantiers || [])
      .find((c) => c.id === e.chantier) || {}).nom;
    if (e.type === "depense") return e.lbl + " — " + (e.affaire === "structure" ? "structure" : nom(e.affaire));
    if (e.type === "avance")  return (e.nature === "salaire" ? "Avance salaire — " : "Prélèvement — ") + e.qui;
    if (e.type === "invest")  return e.lbl + " — " + nom(e.affaire);
    if (e.type === "reserve") return (e.sens === "retrait" ? "Sorti de la réserve — " : "Mis en réserve — ") + nom(e.affaire)
      + (e.motif ? " · " + e.motif : "");
    if (e.type === "avance-interne") return "Avance interne — "
      + (e.de === "foyer" ? "La maison" : nom(e.de)) + " → " + nom(e.vers);
    if (e.type === "remboursement-interne") return "Remboursement d'avance interne — " + nom(e.affaire);
    if (e.type === "pret-perso") return (e.sens === "emprunte" ? "Emprunt perso — " : "Prêt perso — ")
      + (e.qui || "?") + " · " + (e.sens === "emprunte" ? "reçu par " : "sorti de ") + nom(e.affaire)
      + (e.motif ? " · " + e.motif : "") + (e.echeance ? " · échéance " + e.echeance : "");
    if (e.type === "remboursement-pret") return "Remboursement de prêt personnel";
    if (e.type === "napsTc") return "Naps — télécollecte " + e.tc + " · ventes " + fmt(num(e.ventes))
      + " · versé " + fmt(num(e.verse)) + " le " + (e.dateVir || "").slice(8, 10) + "/" + (e.dateVir || "").slice(5, 7);
    if (e.type === "transfert" && e.naps) return "Virement Naps reçu — cartes du "
      + (e.du || "").slice(8, 10) + "/" + (e.du || "").slice(5, 7) + " au "
      + (e.au || "").slice(8, 10) + "/" + (e.au || "").slice(5, 7);
    if (e.type === "treso") return "Trésorerie comptée — LIFE disait " + fmt(num(e.theorique))
      + " · écart " + fmt(num(e.montant) - num(e.theorique));
    return e.type;
  };
  const sousTitre = (e) => {
    if (e.type === "depense") {
      const q = e.piece === "bl" ? "BL" : e.piece === "bon" ? "Bon" : "Facture";
      const n = e.numero ? " n° " + e.numero : "";
      const du = e.aPayer ? " · à régler" : "";
      return e.date + (e.numero || e.piece ? " · " + q + n : "") + du
             + (signature(e) ? " · " + signature(e) : "");
    }
    return e.date + (signature(e) ? " · " + signature(e) : "");
  };
  const couleur = (e) => {
    return config.affaires[e.affaire] ? teinte(config.affaires[e.affaire]) : "#C3CDAF";
  };

  if (!list.length) {
    return <div className="card"><div className="empty">
      Aucun mouvement ce mois-ci.<br />Va dans <strong>Saisir</strong> pour noter le premier.
    </div></div>;
  }

  return (
    <div className="card">
      <h2 className="h2">Journal des écritures</h2>
      {list.map((e) => (
        <MvtLigne key={e.id} e={e} libelle={libelle(e)} couleur={couleur(e)}
                  sous={sousTitre(e)} onDel={onDel} onMaj={onMaj} config={config} />
      ))}
      <div className="note">
        Clique sur un montant ou sur une date pour le corriger. La croix supprime la ligne.
      </div>
    </div>
  );
}

/* Une écriture se corrige entièrement, sans jamais la supprimer et la
   ressaisir : chaque type garde ses propres champs, initialisés depuis
   l'écriture existante. */
function MvtLigne({ e, libelle, couleur, sous, onDel, onMaj, config, ouvrir, onFerme }) {
  const [ouvert, setOuvert] = useState(!!ouvrir);
  const [date, setDate] = useState(e.date);
  const [montant, setMontant] = useState(String(e.montant ?? ""));
  const [numero, setNumero] = useState(e.numero || "");
  const [lbl, setLbl] = useState(e.lbl || "");
  const [piece, setPiece] = useState(e.piece || "facture");
  const [aPayer, setAPayer] = useState(!!e.aPayer);
  const [affaire, setAffaire] = useState(e.affaire || "");
  const [fourn, setFourn] = useState(e.fournisseur || "");
  const [espece, setEspece] = useState(String(e.espece ?? ""));
  const [carte, setCarte] = useState(String(e.carte ?? ""));
  const [fondSuppose, setFondSuppose] = useState(String(e.fondSuppose ?? ""));
  const [fondReel, setFondReel] = useState(e.fondReel !== undefined ? String(e.fondReel) : "");
  const [nuits, setNuits] = useState(String(e.nuits ?? ""));
  const [source, setSource] = useState(e.source || "airbnb");
  const [reference, setReference] = useState(e.reference || "");
  const [categorie, setCategorie] = useState(e.categorie || "pdj");
  const [couverts, setCouverts] = useState(String(e.couverts ?? ""));
  const [statut, setStatut] = useState(e.statut || "paye");
  const [motif, setMotif] = useState(e.motif || "");
  const [sens, setSens] = useState(e.sens || (e.type === "pret-perso" ? "prete" : "depot"));
  const [nature, setNature] = useState(e.nature || "salaire");
  const [qui, setQui] = useState(e.qui || "");
  const [echeance, setEcheance] = useState(e.echeance || "");
  const [aRecevoir, setARecevoir] = useState(!!e.aRecevoir);
  const [erreur, setErreur] = useState("");

  const fourns = (config?.fournisseurs || []).filter((f) => (f.affaires || []).includes(affaire));
  const entrant = e.type === "vente" || e.type === "resa" || e.type === "repas"
                || (e.type === "pret-perso" && e.sens === "emprunte");
  const fermer = () => { setOuvert(false); if (onFerme) onFerme(); };
  const annuler = () => fermer();

  const valider = () => {
    let patch = { date };
    if (e.type === "vente") {
      const esp = num(espece), ct = num(carte);
      if (esp + ct <= 0) {
        setErreur("Rien à enregistrer — écris le montant en espèces et/ou par carte.");
        return;
      }
      const verifie = fondReel.trim() !== "";
      patch = { ...patch, espece: esp, carte: ct, montant: esp + ct,
                fondSuppose: verifie ? num(fondSuppose) : undefined,
                fondReel: verifie ? num(fondReel) : undefined };
    } else if (e.type === "resa") {
      if (num(montant) <= 0) { setErreur(MSG_MONTANT); return; }
      patch = { ...patch, montant: num(montant), nuits: num(nuits), source,
                reference: reference.trim(), aRecevoir };
    } else if (e.type === "repas") {
      patch = { ...patch, categorie, couverts: num(couverts), statut,
                motif: motif.trim(), reference: reference.trim(),
                montant: statut === "offert" ? 0 : num(montant) };
    } else if (e.type === "depense") {
      if (num(montant) <= 0) { setErreur(MSG_MONTANT); return; }
      /* Le fournisseur se choisit aussi à la correction : une pièce saisie en
         « Autre dépense » doit pouvoir retrouver son fournisseur (et son ardoise). */
      const fo = fourns.find((f) => f.id === fourn);
      let titre = lbl.trim() || e.lbl || "";
      const ancien = (config?.fournisseurs || []).find((f) => f.id === e.fournisseur);
      if (ancien && titre.startsWith(ancien.nom)) titre = titre.slice(ancien.nom.length).replace(/^\s*—\s*/, "");
      if (fo) titre = titre ? fo.nom + " — " + titre : fo.nom;
      patch = { ...patch, montant: num(montant), lbl: titre || e.lbl,
                numero: numero.trim(), piece, aPayer, affaire,
                fournisseur: fo ? fo.id : null,
                ...(fo ? { categorie: "matiere" } : {}) };
    } else if (e.type === "invest") {
      if (num(montant) <= 0) { setErreur(MSG_MONTANT); return; }
      patch = { ...patch, montant: num(montant), lbl: lbl.trim() || e.lbl, affaire };
    } else if (e.type === "avance") {
      if (num(montant) <= 0) { setErreur(MSG_MONTANT); return; }
      patch = { ...patch, montant: num(montant), nature, qui: qui.trim() || e.qui };
    } else if (e.type === "reserve") {
      if (num(montant) <= 0) { setErreur(MSG_MONTANT); return; }
      patch = { ...patch, montant: num(montant), sens, motif: motif.trim() };
    } else if (e.type === "pret-perso") {
      if (num(montant) <= 0) { setErreur(MSG_MONTANT); return; }
      patch = { ...patch, montant: num(montant), qui: qui.trim() || e.qui,
                motif: motif.trim(), affaire, sens, echeance };
    } else {
      if (num(montant) <= 0) { setErreur(MSG_MONTANT); return; }
      patch = { ...patch, montant: num(montant), numero: numero.trim() };
    }
    setErreur("");
    onMaj(e.id, patch);
    fermer();
  };

  if (!ouvert) {
    return (
      <div className="mvBar">
        <button onClick={() => setOuvert(true)}
                style={{ display: "flex", alignItems: "center", border: "none",
                         background: "none", cursor: "pointer", textAlign: "left",
                         padding: 0, font: "inherit", color: "inherit", flex: 1 }}>
          <span className="dot" style={{ background: couleur }} />
          <span>
            <span style={{ display: "block" }}>{libelle}</span>
            <span className="mini">{sous}</span>
          </span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => setOuvert(true)}
                  className={entrant ? "pos" : "neg"}
                  style={{ border: "none", background: "none", cursor: "pointer",
                           font: "inherit", fontVariantNumeric: "tabular-nums" }}>
            {fmt(e.montant)}
          </button>
          <button className="del" onClick={() => onDel(e.id)} aria-label="Supprimer">×</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "14px 0", borderBottom: "1px solid #EFF2E7" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <span className="dot" style={{ background: couleur }} />
        <span style={{ fontSize: 16.5 }}>{libelle}</span>
      </div>

      <div className="grid2">
        <div><label className="f">Date</label>
          <input className="f" type="date" value={date} onChange={(x) => setDate(x.target.value)} /></div>
        {e.type === "vente" ? null : e.type === "repas" && statut === "offert" ? null : (
          <div><label className="f">Montant</label>
            <input className="f" inputMode="decimal" value={montant}
                   onChange={(x) => setMontant(x.target.value)} /></div>
        )}
      </div>

      {e.type === "vente" && (
        <>
          <div className="grid2">
            <div><label className="f">Cash compté</label>
              <input className="f" inputMode="decimal" value={espece}
                     onChange={(x) => setEspece(x.target.value)} /></div>
            <div><label className="f">CB compté</label>
              <input className="f" inputMode="decimal" value={carte}
                     onChange={(x) => setCarte(x.target.value)} /></div>
          </div>
          <div className="grid2">
            <div><label className="f">Fond de caisse supposé</label>
              <input className="f" inputMode="decimal" value={fondSuppose}
                     onChange={(x) => setFondSuppose(x.target.value)} /></div>
            <div><label className="f">Fond de caisse réel</label>
              <input className="f" placeholder="Si vérifié ce jour-là" inputMode="decimal"
                     value={fondReel} onChange={(x) => setFondReel(x.target.value)} /></div>
          </div>
        </>
      )}

      {e.type === "resa" && (
        <>
          <div className="grid3">
            <div><label className="f">Venue par</label>
              <select className="f" value={source} onChange={(x) => setSource(x.target.value)}>
                <option value="airbnb">Airbnb</option>
                <option value="direct">Réservation directe</option>
              </select></div>
            <div><label className="f">Nombre de nuits</label>
              <input className="f" inputMode="decimal" value={nuits}
                     onChange={(x) => setNuits(x.target.value)} /></div>
            <div><label className="f">Référence de séjour</label>
              <input className="f" placeholder="Code Airbnb" value={reference}
                     onChange={(x) => setReference(x.target.value)} /></div>
          </div>
          <div style={{ display: "flex", gap: 9, marginBottom: 14, flexWrap: "wrap" }}>
            <button className={"pill" + (!aRecevoir ? " on" : "")}
                    onClick={() => setARecevoir(false)}>Déjà encaissée</button>
            <button className={"pill" + (aRecevoir ? " on" : "")}
                    onClick={() => setARecevoir(true)}>Pas encore encaissée</button>
          </div>
        </>
      )}

      {e.type === "repas" && (
        <>
          <div className="grid3">
            <div><label className="f">Nature</label>
              <select className="f" value={categorie} onChange={(x) => setCategorie(x.target.value)}>
                <option value="pdj">Petit-déjeuner</option>
                <option value="dej">Déjeuner</option>
                <option value="diner">Dîner</option>
                <option value="boisson">Boisson</option>
                <option value="excursion">Excursion</option>
                <option value="transport">Transport</option>
                <option value="autre">Autre</option>
              </select></div>
            <div><label className="f">Couverts</label>
              <input className="f" inputMode="decimal" value={couverts}
                     onChange={(x) => setCouverts(x.target.value)} /></div>
            <div><label className="f">Référence de séjour</label>
              <input className="f" placeholder="Code Airbnb" value={reference}
                     onChange={(x) => setReference(x.target.value)} /></div>
          </div>
          <div style={{ display: "flex", gap: 9, marginBottom: 14 }}>
            <button className={"pill" + (statut === "paye" ? " on" : "")}
                    onClick={() => setStatut("paye")}>Payé par le voyageur</button>
            <button className={"pill" + (statut === "offert" ? " on" : "")}
                    onClick={() => setStatut("offert")}>Offert</button>
          </div>
          {statut === "offert" && (
            <div style={{ marginBottom: 12 }}>
              <label className="f">Motif de l'offre</label>
              <input className="f" placeholder="Geste commercial, incident…" value={motif}
                     onChange={(x) => setMotif(x.target.value)} /></div>
          )}
        </>
      )}

      {(e.type === "depense" || e.type === "invest") && (
        <div style={{ marginBottom: 12 }}>
          <label className="f">Intitulé</label>
          <input className="f" value={lbl} onChange={(x) => setLbl(x.target.value)} />
        </div>
      )}

      {(e.type === "depense" || e.type === "invest" || e.type === "pret-perso") && config && (
        <div style={{ marginBottom: 12 }}>
          <label className="f">Activité</label>
          <select className="f" value={affaire} onChange={(x) => setAffaire(x.target.value)}>
            {e.type === "depense" && <option value="structure">Structure (société, impôts…)</option>}
            <option value="foyer">La maison</option>
            {Object.entries(config.affaires).map(([k, a]) => <option key={k} value={k}>{a.nom}</option>)}
          </select>
        </div>
      )}

      {e.type === "depense" && (
        <>
          <label className="f">Fournisseur</label>
          <div className="navSimple" style={{ marginBottom: 14 }}>
            {fourns.map((f) => (
              <button key={f.id} className={"pill" + (fourn === f.id ? " on" : "")}
                      onClick={() => setFourn(f.id)}>{f.nom}</button>
            ))}
            <button className={"pill" + (!fourns.some((f) => f.id === fourn) ? " on" : "")}
                    onClick={() => setFourn("")}>Autre dépense</button>
          </div>
          <label className="f">Justificatif</label>
          <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
            <button className={"pill" + (piece === "bl" ? " on" : "")}
                    onClick={() => { setPiece("bl"); setAPayer(true); }}>Bon de livraison</button>
            <button className={"pill" + (piece === "facture" ? " on" : "")}
                    onClick={() => setPiece("facture")}>Facture</button>
            <button className={"pill" + (piece === "bon" ? " on" : "")}
                    onClick={() => setPiece("bon")}>Bon de dépense</button>
            <input className="f" style={{ width: 170 }}
                   placeholder="N°" value={numero} onChange={(x) => setNumero(x.target.value)} />
          </div>
          {piece !== "bl" && (
            <div style={{ display: "flex", gap: 9, marginBottom: 14, flexWrap: "wrap" }}>
              <button className={"pill" + (!aPayer ? " on" : "")}
                      onClick={() => setAPayer(false)}>Déjà payée</button>
              <button className={"pill" + (aPayer ? " on" : "")}
                      onClick={() => setAPayer(true)}>À payer plus tard</button>
            </div>
          )}
        </>
      )}

      {e.type === "avance" && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label className="f">Nature</label>
            <select className="f" value={nature} onChange={(x) => setNature(x.target.value)}>
              <option value="salaire">Avance sur salaire</option>
              <option value="perso">Prélèvement exceptionnel</option>
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="f">{nature === "salaire" ? "Qui" : "Pour quoi"}</label>
            <input className="f" value={qui} onChange={(x) => setQui(x.target.value)} /></div>
        </>
      )}

      {e.type === "reserve" && (
        <>
          <div style={{ display: "flex", gap: 9, marginBottom: 14 }}>
            <button className={"pill" + (sens === "depot" ? " on" : "")}
                    onClick={() => setSens("depot")}>Mise en réserve</button>
            <button className={"pill" + (sens === "retrait" ? " on" : "")}
                    onClick={() => setSens("retrait")}>Sortie de réserve</button>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="f">Pour quoi</label>
            <input className="f" value={motif} onChange={(x) => setMotif(x.target.value)} /></div>
        </>
      )}

      {e.type === "pret-perso" && (
        <>
          <div style={{ display: "flex", gap: 9, marginBottom: 14 }}>
            <button className={"pill" + (sens === "prete" ? " on" : "")}
                    onClick={() => setSens("prete")}>Tu prêtes</button>
            <button className={"pill" + (sens === "emprunte" ? " on" : "")}
                    onClick={() => setSens("emprunte")}>Tu empruntes</button>
          </div>
          <div className="grid2">
            <div><label className="f">À qui / de qui</label>
              <input className="f" value={qui} onChange={(x) => setQui(x.target.value)} /></div>
            <div><label className="f">Échéance prévue</label>
              <input className="f" type="date" value={echeance} onChange={(x) => setEcheance(x.target.value)} /></div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="f">Pour quoi</label>
            <input className="f" value={motif} onChange={(x) => setMotif(x.target.value)} /></div>
        </>
      )}

      <Alerte>{erreur}</Alerte>
      <div style={{ display: "flex", gap: 9 }}>
        <button className="btn" onClick={valider}>Corriger</button>
        <button className="pill" onClick={annuler}>Annuler</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  RÉGLAGES                                                           */
/* ------------------------------------------------------------------ */

/* Le champ garde son propre texte pour qu'on puisse taper librement, mais il ne
   doit JAMAIS afficher autre chose que ce qui sera enregistré : c'est ce qui
   permettait d'afficher « 12 000 » pendant que 12 partait dans les réglages.
   On compare donc sur la chaîne normalisée, pas sur num(). */
function Ligne({ lbl, value, onChange, suffix }) {
  const [txt, setTxt] = useState(String(value));
  useEffect(() => {
    if (normaliseMontant(txt) !== normaliseMontant(value)) setTxt(String(value));
  }, [value]);
  const faux = !montantLisible(txt);
  return (
    <div className="row">
      <span className="lbl">{lbl}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <input className="f" style={{ width: 112, textAlign: "right", padding: "8px 11px",
                 borderColor: faux ? "#C9503A" : undefined,
                 color: faux ? "#A4262C" : undefined }}
               inputMode="decimal" value={txt}
               onChange={(e) => { setTxt(e.target.value); onChange(e.target.value); }}
               onBlur={() => setTxt(String(num(txt)))} />
        <span className="mini">{suffix || "DH"}</span>
      </span>
    </div>
  );
}

function Sauvegarde({ config }) {
  const [msg, setMsg] = useState("");

  const exporter = async () => {
    try {
      /* Le catch interne avalait l'échec de lecture : le fichier partait avec
         « entries: [] » et l'app annonçait « Fichier téléchargé ». On ne
         découvrait la sauvegarde vide que le jour où on en avait besoin. */
      let entries = [];
      const e = await window.storage.get("pilotage:entries");
      if (e && e.value) entries = JSON.parse(e.value);
      if (!entries.length) {
        setMsg("Rien n'a pu être lu — aucun fichier n'a été créé. Réessaie dans un instant.");
        setTimeout(() => setMsg(""), 5000);
        return;
      }
      const contenu = JSON.stringify({ version: 1, date: today(), config, entries }, null, 2);
      const blob = new Blob([contenu], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "life-sauvegarde-" + today() + ".json";
      a.click();
      URL.revokeObjectURL(a.href);
      setMsg("Fichier téléchargé (" + entries.length + " écritures). Garde-le dans ton Drive.");
    } catch (x) {
      setMsg("La sauvegarde n'a pas pu se faire.");
    }
    setTimeout(() => setMsg(""), 4000);
  };

  return (
    <>
      <button className="btn" onClick={exporter}>Télécharger mes données</button>
      {msg && <div className="pos" style={{ marginTop: 12 }}>{msg}</div>}
      <div className="note">
        Tes chiffres vivent dans cette application. Télécharge une copie une fois par mois et
        range-la dans ton Drive : c'est ta seule protection si quelque chose se perd.
      </div>
    </>
  );
}

function NouveauFournisseur({ affaires, onAdd }) {
  const [nom, setNom] = useState("");
  const [aff, setAff] = useState(Object.keys(affaires)[0]);
  const [rythme, setRythme] = useState("besoin");

  const [erreur, setErreur] = useState("");
  const ajouter = () => {
    if (!nom.trim()) { setErreur("Donne un nom au fournisseur."); return; }
    setErreur("");
    onAdd({ id: uid(), nom: nom.trim(), affaires: [aff], rythme });
    setNom("");
  };

  return (
    <div style={{ marginTop: 16 }}>
      <div className="grid3">
        <div><label className="f">Nouveau fournisseur</label>
          <input className="f" placeholder="Poissonnier" value={nom} onChange={(e) => setNom(e.target.value)} /></div>
        <div><label className="f">Pour</label>
          <select className="f" value={aff} onChange={(e) => setAff(e.target.value)}>
            {Object.entries(affaires).map(([k, a]) => <option key={k} value={k}>{a.nom}</option>)}
          </select></div>
        <div><label className="f">Rythme</label>
          <select className="f" value={rythme} onChange={(e) => setRythme(e.target.value)}>
            {Object.entries(RYTHMES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select></div>
      </div>
      <Alerte>{erreur}</Alerte>
      <button className="btn" onClick={ajouter}>Ajouter</button>
    </div>
  );
}


/* Une activité existante : son nom, sa nature, ses taux, son sort */
function ActiviteReglage({ k, a, c, maj }) {
  const [ouvert, setOuvert] = useState(false);
  const majA = (champs) => maj({ ...c, affaires: { ...c.affaires, [k]: { ...a, ...champs } } });

  const basculerArchive = () => majA({ archive: !a.archive });

  const [confirmeSuppr, setConfirmeSuppr] = useState(false);
  const supprimer = () => {
    const affaires = { ...c.affaires }; delete affaires[k];
    const cle = { ...c.cle }; delete cle[k];
    maj({ ...c, affaires, cle,
          fixes: c.fixes.filter((f) => f.affaire !== k),
          fournisseurs: (c.fournisseurs || [])
            .map((f) => ({ ...f, affaires: (f.affaires || []).filter((x) => x !== k) }))
            .filter((f) => f.affaires.length) });
  };

  return (
    <div style={{ borderBottom: "1px solid #EFF2E7", padding: "10px 0" }}>
      <div className="row" style={{ borderBottom: "none", padding: 0 }}>
        <span className="lbl" style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span className="swatch" style={{ width: 15, height: 15, borderRadius: 5,
                  background: a.aquarelle ? AQUARELLE : a.chip, flex: "none" }} />
          <span style={{ color: lisible(a.marque, 5), opacity: a.archive ? .5 : 1 }}>{a.nom}</span>
          {a.type === "hebergement" && <span className="tag">hébergement</span>}
          {a.archive && <span className="tag">archivée</span>}
        </span>
        <button className="pill" onClick={() => setOuvert(!ouvert)}>{ouvert ? "Fermer" : "Modifier"}</button>
      </div>

      {ouvert && (
        <div style={{ background: a.tint, borderRadius: 12, padding: 14, marginTop: 10 }}>
          <div className="grid2">
            <div><label className="f">Nom</label>
              <input className="f" value={a.nom} onChange={(e) => majA({ nom: e.target.value })} /></div>
            <div><label className="f">Nature</label>
              <select className="f" value={a.type || "vente"}
                      onChange={(e) => {
                        const t = e.target.value;
                        majA({ type: t, hebergement: t === "hebergement"
                          ? (a.hebergement || { comAirbnb: 15.5, comDirect: 3, extras: {
                              pdj:   { nom: "Petit-déjeuner", prix: 65,  matiere: 25, com: 10 },
                              dej:   { nom: "Déjeuner",       prix: 215, matiere: 50, com: 30 },
                              diner: { nom: "Dîner",          prix: 215, matiere: 50, com: 40 } } })
                          : a.hebergement });
                      }}>
                <option value="vente">Ventes au comptoir</option>
                <option value="hebergement">Hébergement (nuitées)</option>
              </select></div>
          </div>
          <div className="grid2">
            <div><label className="f">Société</label>
              <select className="f" value={a.societe || socDefaut(c)}
                      onChange={(e) => majA({ societe: e.target.value })}>
                {(c.societes || []).map((s) => <option key={s.id} value={s.id}>{s.nom}</option>)}
              </select></div>
          </div>
          <div className="grid2">
            <div><label className="f">Coût matière</label>
              <input className="f" inputMode="decimal" value={a.matierePct ?? 0}
                     onChange={(e) => majA({ matierePct: num(e.target.value) })} /></div>
            <div><label className="f">Fond de caisse théorique</label>
              <input className="f" inputMode="decimal" value={a.fonds ?? 0}
                     onChange={(e) => majA({ fonds: num(e.target.value) })} /></div>
            <div><label className="f">Part du labo partagé</label>
              <input className="f" inputMode="decimal" value={c.cle[k] ?? 0}
                     onChange={(e) => maj({ ...c, cle: { ...c.cle, [k]: num(e.target.value) } })} /></div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label className="f">Couleur</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TEINTES.map((t) => (
                <button key={t.nom} aria-label={t.nom} title={t.nom}
                        onClick={() => majA({ marque: t.marque, chip: t.chip, tint: t.tint, aquarelle: false })}
                        style={{ width: 34, height: 34, borderRadius: 10, cursor: "pointer",
                                 background: t.chip, border: a.chip === t.chip
                                   ? "3px solid #395232" : "1px solid rgba(0,0,0,.08)" }} />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <button className="pill" onClick={basculerArchive}>
              {a.archive ? "Réactiver" : "Archiver"}
            </button>
            {!confirmeSuppr ? (
              <button className="pill" onClick={() => setConfirmeSuppr(true)}
                      style={{ color: "#D9573F", borderColor: "#EFC7BE" }}>
                Supprimer définitivement
              </button>
            ) : (
              <div style={{ flexBasis: "100%" }}>
                <div className="mini" style={{ marginBottom: 8, color: "#A4262C" }}>
                  Ses écritures resteront en base mais ne compteront plus dans aucun
                  résultat, et ses charges fixes seront perdues. <strong>Archiver</strong>{" "}
                  la retire des menus sans rien fausser — c'est presque toujours le
                  bon geste.
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="pill" onClick={() => setConfirmeSuppr(false)}>
                    Annuler
                  </button>
                  <button className="pill" onClick={supprimer}
                          style={{ color: "#D9573F", borderColor: "#EFC7BE" }}>
                    Oui, supprimer {a.nom}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* Les charges fixes rangées par affaire, chaque groupe replié sur son total */
function groupesFixes(c) {
  const ordre = [...Object.keys(c.affaires), "partage"];
  return ordre.map((id) => {
    const lignes = c.fixes.filter((f) => f.affaire === id);
    if (!lignes.length) return null;
    const a = c.affaires[id];
    return { id, nom: id === "partage" ? "Labo partagé" : (a ? a.nom : id),
             couleur: id === "partage" ? "#8B9678" : lisible(a.marque),
             lignes, total: lignes.reduce((s, f) => s + num(f.montant), 0) };
  }).filter(Boolean);
}

function GroupeFixes({ g, c, maj, majFixe }) {
  const [ouvert, setOuvert] = useState(false);
  const majLigne = (id, champs) => maj({ ...c, fixes: c.fixes.map((x) =>
    x.id === id ? { ...x, ...champs } : x) });

  return (
    <div style={{ borderBottom: "1px solid #EFF2E7" }}>
      <button onClick={() => setOuvert(!ouvert)}
              aria-expanded={ouvert}
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer",
                       display: "flex", alignItems: "center", justifyContent: "space-between",
                       gap: 12, padding: "15px 0", textAlign: "left" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
          <span className="dot" style={{ background: g.couleur, margin: 0 }} />
          <span style={{ fontSize: 17 }}>{g.nom}</span>
          <span className="tag">{g.lignes.length}</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="val" style={{ fontSize: 18 }}>{fmt(g.total)}</span>
          <span className="mut" style={{ fontSize: 15 }}>{ouvert ? "−" : "+"}</span>
        </span>
      </button>

      {ouvert && (
        <div style={{ paddingBottom: 12 }}>
          {g.lignes.map((f) => (
            <div key={f.id} style={{ background: "#FAFCF5", borderRadius: 12,
                                     padding: "12px 14px", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input className="f" style={{ flex: 1, padding: "8px 11px", fontSize: 16 }}
                       value={f.lbl} onChange={(e) => majLigne(f.id, { lbl: e.target.value })} />
                <input className="f" style={{ width: 108, textAlign: "right", padding: "8px 11px" }}
                       inputMode="decimal" value={f.montant}
                       onChange={(e) => majFixe(f.id, e.target.value)} />
                <button className="del" aria-label={"Retirer " + f.lbl}
                        onClick={() => maj({ ...c, fixes: c.fixes.filter((x) => x.id !== f.id) })}>×</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 9,
                            flexWrap: "wrap", marginTop: 9 }}>
                <span className="mini">échéance le</span>
                <input className="f" style={{ width: 58, textAlign: "right", padding: "5px 8px" }}
                       inputMode="decimal" value={f.jour ?? 5}
                       onChange={(e) => majLigne(f.id, { jour: num(e.target.value) })} />
                {/* Une traite a une fin : la dire une fois suffit à connaître le
                    capital qui court encore, recalculé tout seul chaque mois. */}
                <span className="mini">jusqu'à</span>
                <input className="f" style={{ width: 128, padding: "5px 8px" }} type="month"
                       value={f.fin || ""}
                       onChange={(e) => majLigne(f.id, { fin: e.target.value })} />
                {/* Une facture qui varie : le montant n'est qu'une prévision. */}
                <button className={"pill" + (f.variable ? " on" : "")}
                        style={{ padding: "4px 10px", fontSize: 13 }}
                        onClick={() => majLigne(f.id, { variable: !f.variable })}>
                  {f.variable ? "montant variable" : "montant fixe"}
                </button>
                {f.affaire !== "partage" && <>
                  <span className="mini">dont labo</span>
                  <input className="f" style={{ width: 54, textAlign: "right", padding: "5px 8px" }}
                         inputMode="decimal" value={f.partagePct ?? 0}
                         onChange={(e) => majLigne(f.id, { partagePct: num(e.target.value) })} />
                  <span className="mini">%</span>
                </>}
                {f.sal && (
                  <select className="f" style={{ width: 150, padding: "5px 8px", fontSize: 13.5 }}
                          value={socDe(c, f)}
                          onChange={(e) => majLigne(f.id, { societe: e.target.value })}>
                    {(c.societes || []).map((s) =>
                      <option key={s.id} value={s.id}>{s.nom}</option>)}
                  </select>
                )}
                {f.sal && <span className="tag">salaire</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Repartir de zéro. Irréversible, donc demandé deux fois. */
function RepartirDeZero() {
  const [etape, setEtape] = useState(0);
  const [fait, setFait] = useState("");

  const effacer = async (aussiHistorique) => {
    try {
      if (aussiHistorique) {
        await window.storage.set("pilotage:entries", JSON.stringify([]));
        await window.storage.set("pilotage:seed", "1");
      } else {
        const e = await window.storage.get("pilotage:entries");
        const gardees = e && e.value ? JSON.parse(e.value).filter((x) => x.seed) : [];
        await window.storage.set("pilotage:entries", JSON.stringify(gardees));
      }
      await window.storage.set("pilotage:taches", JSON.stringify([]));
      setFait("Effacé. Recharge la page pour repartir sur une base propre.");
      setEtape(0);
    } catch (err) { setFait("L'effacement a échoué. Réessaie."); }
  };

  return (
    <div className="card">
      <h2 className="h2">Repartir de zéro</h2>
      {fait ? (
        <div className="mini" style={{ color: "#5E8F1E" }}>{fait}</div>
      ) : etape === 0 ? (
        <>
          <div className="mini" style={{ marginBottom: 14 }}>
            Efface toutes tes saisies et toutes tes tâches. Tes réglages — activités, salariés,
            charges fixes, seuils — sont conservés.
          </div>
          <button className="pill" onClick={() => setEtape(1)}>Effacer mes saisies</button>
        </>
      ) : (
        <>
          <div className="mini" style={{ marginBottom: 14, color: "#C9503A" }}>
            C'est irréversible. Choisis ce que tu effaces.
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="pill" onClick={() => effacer(false)}>
              Saisies seules, garder l'historique
            </button>
            <button className="pill" style={{ color: "#C9503A", borderColor: "#EFC7BE" }}
                    onClick={() => effacer(true)}>
              Tout, historique compris
            </button>
            <button className="pill" onClick={() => setEtape(0)}>Annuler</button>
          </div>
          <div className="note">
            L'historique, ce sont les treize mois de Sabich de 2025-2026. Ils ne comptent dans
            aucun résultat : ils servent uniquement à comparer chaque mois au même mois de
            l'an dernier. Les effacer te prive de cette comparaison pendant un an.
          </div>
        </>
      )}
    </div>
  );
}

/* Ajouter une société */
function NouvelleSociete({ existantes, onAdd }) {
  const [nom, setNom] = useState("");
  const [erreur, setErreur] = useState("");
  const creer = () => {
    if (!nom.trim()) { setErreur("Donne un nom à la société."); return; }
    setErreur("");
    let id = slug(nom);
    while (existantes.some((s) => s.id === id)) id = id + "2";
    onAdd({ id, nom: nom.trim() });
    setNom("");
  };
  return (
    <div style={{ marginTop: 14 }}>
      <Alerte>{erreur}</Alerte>
      <div style={{ display: "flex", gap: 9, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label className="f">Nouvelle société</label>
          <input className="f" placeholder="Nom de la structure" value={nom}
                 onChange={(e) => { setNom(e.target.value); setErreur(""); }} />
        </div>
        <button className="pill" onClick={creer} style={{ marginBottom: 12 }}>Ajouter</button>
      </div>
    </div>
  );
}

/* Ajouter une charge fixe */
function NouvelleCharge({ affaires, onAdd }) {
  const [ouvert, setOuvert] = useState(false);
  const [lbl, setLbl] = useState("");
  const [montant, setMontant] = useState("");
  const [affaire, setAffaire] = useState("partage");
  const [jour, setJour] = useState("5");
  const [sal, setSal] = useState(false);

  const [erreur, setErreur] = useState("");
  const creer = () => {
    if (!lbl.trim())       { setErreur("Intitulé manquant — dis de quelle charge il s'agit."); return; }
    if (num(montant) <= 0) { setErreur(MSG_MONTANT); return; }
    setErreur("");
    onAdd({ id: "x" + uid(), lbl: lbl.trim(), montant: num(montant),
            affaire, jour: num(jour), ...(sal ? { sal: true } : {}) });
    setLbl(""); setMontant(""); setSal(false); setOuvert(false);
  };

  if (!ouvert) return (
    <button className="pill" style={{ marginTop: 12 }} onClick={() => setOuvert(true)}>
      + Ajouter une charge fixe
    </button>
  );

  return (
    <div style={{ background: "#F4F7EC", borderRadius: 12, padding: 14, marginTop: 12 }}>
      <div className="grid2">
        <div><label className="f">Intitulé</label>
          <input className="f" placeholder="Loyer coffee shop" value={lbl}
                 onChange={(e) => setLbl(e.target.value)} /></div>
        <div><label className="f">Montant mensuel</label>
          <input className="f" inputMode="decimal" value={montant}
                 onChange={(e) => setMontant(e.target.value)} /></div>
      </div>
      <div className="grid2">
        <div><label className="f">À la charge de</label>
          <select className="f" value={affaire} onChange={(e) => setAffaire(e.target.value)}>
            <option value="partage">Labo partagé</option>
            {vivantes({ affaires }).map(([k, a]) => <option key={k} value={k}>{a.nom}</option>)}
          </select></div>
        <div><label className="f">Échéance le</label>
          <input className="f" inputMode="decimal" value={jour}
                 onChange={(e) => setJour(e.target.value)} /></div>
      </div>
      <div className="row" style={{ marginTop: 6 }}>
        <span className="lbl">C'est un salaire</span>
        <button className={"pill" + (sal ? " on" : "")} onClick={() => setSal(!sal)}>
          {sal ? "Oui" : "Non"}
        </button>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <Alerte>{erreur}</Alerte>
        <button className="btn" style={{ margin: 0 }} onClick={creer}>Ajouter</button>
        <button className="pill" onClick={() => setOuvert(false)}>Annuler</button>
      </div>
      <div className="note">
        Coché « salaire », le montant entre dans l'écran Paie, dans le calcul de la CNSS,
        et accepte des avances.
      </div>
    </div>
  );
}

/* Créer une activité sans toucher au code */
function NouvelleActivite({ existantes, onAdd }) {
  const [ouvert, setOuvert] = useState(false);
  const [nom, setNom] = useState("");
  const [type, setType] = useState("vente");
  const [pct, setPct] = useState("30");
  const [teinteIdx, setTeinteIdx] = useState(0);

  const [erreur, setErreur] = useState("");
  const creer = () => {
    if (!nom.trim()) { setErreur("Donne un nom à l'activité."); return; }
    setErreur("");
    let id = slug(nom);
    while (existantes[id]) id = id + "2";
    const t = TEINTES[teinteIdx];
    const a = { nom: nom.trim(), marque: t.marque, chip: t.chip, tint: t.tint,
                matierePct: num(pct), type };
    if (type === "hebergement") a.hebergement = { comAirbnb: 15.5, comDirect: 3, extras: {
      pdj:   { nom: "Petit-déjeuner", prix: 65,  matiere: 25, com: 10 },
      dej:   { nom: "Déjeuner",       prix: 215, matiere: 50, com: 30 },
      diner: { nom: "Dîner",          prix: 215, matiere: 50, com: 40 } } };
    onAdd(id, a);
    setNom(""); setPct("30"); setType("vente"); setOuvert(false);
  };

  if (!ouvert) return (
    <button className="pill" style={{ marginTop: 12 }} onClick={() => setOuvert(true)}>
      + Ajouter une activité
    </button>
  );

  return (
    <div style={{ background: TEINTES[teinteIdx].tint, borderRadius: 12, padding: 14, marginTop: 12 }}>
      <div className="grid2">
        <div><label className="f">Nom</label>
          <input className="f" placeholder="Coffee shop médina" value={nom}
                 onChange={(e) => setNom(e.target.value)} /></div>
        <div><label className="f">Nature</label>
          <select className="f" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="vente">Ventes au comptoir</option>
            <option value="hebergement">Hébergement (nuitées)</option>
          </select></div>
      </div>
      <div><label className="f">Coût matière estimé</label>
        <input className="f" inputMode="decimal" value={pct} onChange={(e) => setPct(e.target.value)} /></div>
      <div style={{ marginTop: 12 }}>
        <label className="f">Couleur</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TEINTES.map((t, i) => (
            <button key={t.nom} aria-label={t.nom} title={t.nom} onClick={() => setTeinteIdx(i)}
                    style={{ width: 34, height: 34, borderRadius: 10, cursor: "pointer",
                             background: t.chip, border: i === teinteIdx
                               ? "3px solid #395232" : "1px solid rgba(0,0,0,.08)" }} />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <Alerte>{erreur}</Alerte>
        <button className="btn" style={{ margin: 0 }} onClick={creer}>Créer l'activité</button>
        <button className="pill" onClick={() => setOuvert(false)}>Annuler</button>
      </div>
      <div className="note">
        Elle apparaîtra tout de suite dans les onglets et dans la saisie. Envoie-moi son logo
        quand tu l'auras, je le mettrai à la place du nom.
      </div>
    </div>
  );
}

function Reglages({ config, onSave, session, onLogout }) {
  const [c, setC] = useState(config);
  const assietteLabo = (c.fixes || []).reduce((t, f) => t + (f.affaire === "partage"
    ? num(f.montant) : num(f.montant) * (num(f.partagePct) || 0) / 100), 0);
  const [ok, setOk] = useState(false);
  const [erreur, setErreur] = useState("");
  /* Tant qu'Amal n'a rien touché, l'écran suit les réglages du serveur : sans
     ça, il gardait la photo prise à son ouverture et son « Enregistrer »
     effaçait ce que SAIB avait changé entre-temps. */
  const [modifie, setModifie] = useState(false);
  useEffect(() => { if (!modifie) setC(config); }, [config, modifie]);

  const maj = (n) => { setC(n); setOk(false); setErreur(""); setModifie(true); };
  const majFixe = (id, v) => maj({ ...c, fixes: c.fixes.map((f) => f.id === id ? { ...f, montant: num(v) } : f) });
  const majStruct = (id, v) => maj({ ...c, structures: c.structures.map((f) => f.id === id ? { ...f, montant: num(v) } : f) });
  const majFoyer = (id, v) => maj({ ...c, foyer: { ...c.foyer, fixes: c.foyer.fixes.map((f) => f.id === id ? { ...f, montant: num(v) } : f) } });

  const enregistrer = async () => {
    const r = await onSave(c);
    if (r === "conflit") {
      setOk(false); setModifie(false);
      setErreur("Les réglages ont été modifiés ailleurs pendant que cet écran était "
        + "ouvert. Ils viennent d'être rechargés — refais ta modification, rien n'a "
        + "été écrasé.");
      return;
    }
    if (!r) {
      setOk(false);
      setErreur("Pas enregistré. Vérifie ta connexion et réessaie — ne quitte pas cet écran.");
      return;
    }
    setErreur(""); setModifie(false);
    setOk(true); setTimeout(() => setOk(false), 2600);
  };

  return (
    <>
      <div className="card">
        <Crest k="reglages" c={{ nom: "Paramètres" }} />
        <h2 className="h2">Mes activités</h2>
        {Object.entries(c.affaires).map(([k, a]) => (
          <ActiviteReglage key={k} k={k} a={a} c={c} maj={maj} />
        ))}
        <NouvelleActivite existantes={c.affaires} onAdd={(id, a) =>
          maj({ ...c, affaires: { ...c.affaires, [id]: a } })} />
        <div className="note">
          Archiver une activité la retire des menus et de la saisie, sans toucher aux mois
          déjà enregistrés — son histoire reste consultable. La supprimer efface aussi ses
          charges fixes et ses fournisseurs.
        </div>
      </div>

      <div className="card">
        <h2 className="h2">Charges fixes par activité</h2>
        {groupesFixes(c).map((g) => (
          <GroupeFixes key={g.id} g={g} c={c} maj={maj} majFixe={majFixe} />
        ))}
        <NouvelleCharge affaires={c.affaires} onAdd={(f) => maj({ ...c, fixes: [...c.fixes, f] })} />
        <div className="note">
          <strong>Dont labo</strong> : la part d'une ligne qui sert à plusieurs activités, répartie
          selon une clé. À 0 %, la charge est portée en entier par son activité — c'est le cas
          de toutes tes charges aujourd'hui.
          <br /><br />
          Une charge fixe, c'est un montant qui tombe tous les mois, connu d'avance : un loyer,
          un salaire, une traite. Tout ce qui varie selon le mois — un coursier payé à la tâche,
          la marchandise, un dépannage — est un fournisseur, à saisir dans <strong>Achat ou charge</strong>.
        </div>
      </div>

      {/* Rien à partager : la carte n'a rien à dire, elle ne s'affiche pas. */}
      {assietteLabo > 0 && (
        <div className="card">
          <h2 className="h2">Clé de répartition du labo</h2>
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginBottom: 14 }}>
            <button className="pill" onClick={() => maj({ ...c, cle: { sabich: 80, tmsk: 20, taam: 0 } })}>
              Ta'âm pas encore ouverte — 80 / 20 / 0
            </button>
            <button className="pill" onClick={() => maj({ ...c, cle: { sabich: 50, tmsk: 10, taam: 40 } })}>
              Ta'âm en activité — 50 / 10 / 40
            </button>
          </div>
          {Object.entries(c.cle).map(([k, pct]) => (
            <Ligne key={k} lbl={c.affaires[k]?.nom || k} value={pct} suffix="%"
                   onChange={(v) => maj({ ...c, cle: { ...c.cle, [k]: num(v) } })} />
          ))}
          <div className="mini" style={{ marginTop: 10 }}>
            Total : {Object.values(c.cle).reduce((s, v) => s + num(v), 0)} % — il doit faire 100.
          </div>
          <div className="row rowTot" style={{ marginTop: 10 }}>
            <span className="lbl">Assiette à répartir</span>
            <span className="val">
              {fmt(assietteLabo)}
            </span>
          </div>
          <div className="note">
            Ne sert que si une charge a une part « labo ». Sinon cette carte disparaît.
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="h2">Taux de coût matière</h2>
        {vivantes(c).filter(([, a]) => a.matierePct > 0).map(([k, a]) => (
          <Ligne key={k} lbl={a.nom} value={a.matierePct} suffix="%"
                 onChange={(v) => maj({ ...c, affaires: { ...c.affaires, [k]: { ...a, matierePct: num(v) } } })} />
        ))}
        <div className="note">Ne sert qu'à estimer le seuil d'une activité qui n'a encore rien vendu.
          Le coût matière affiché ailleurs est toujours celui de tes achats réels.</div>
      </div>

      <div className="card">
        <h2 className="h2">Mes sociétés</h2>
        {(c.societes || []).map((s) => {
          const masse = c.fixes.filter((f) => f.sal && socDe(c, f) === s.id)
                               .reduce((a, f) => a + num(f.montant), 0);
          const cn = (c.cnss || {})[s.id] || { actif: false, montant: 0 };
          const majCnss = (champs) => maj({ ...c, cnss: { ...c.cnss, [s.id]: { ...cn, ...champs } } });
          return (
            <div key={s.id} style={{ borderBottom: "1px solid #EFF2E7", padding: "12px 0" }}>
              <div className="grid2">
                <div><label className="f">Nom</label>
                  <input className="f" value={s.nom}
                         onChange={(e) => maj({ ...c, societes: c.societes.map((x) =>
                           x.id === s.id ? { ...x, nom: e.target.value } : x) })} /></div>
                {cn.actif ? (
                  <div><label className="f">CNSS mensuelle</label>
                    <input className="f" inputMode="decimal" value={cn.montant}
                           onChange={(e) => majCnss({ montant: num(e.target.value) })} /></div>
                ) : (
                  <div><label className="f">CNSS</label>
                    <div className="mini" style={{ padding: "12px 0" }}>
                      Pas déclarée — rien n'est compté.
                    </div></div>
                )}
              </div>
              <div className="row" style={{ borderBottom: "none" }}>
                <span className="lbl">
                  Salariés déclarés à la CNSS ?
                  <span className="mini" style={{ marginLeft: 8 }}>
                    {fmt(masse)} de salaires dans cette société
                  </span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button className={"pill" + (cn.actif ? " on" : "")}
                          onClick={() => majCnss({ actif: !cn.actif })}>
                    {cn.actif ? "Oui" : "Non"}
                  </button>
                  {c.societes.length > 1 && (
                    <button className="del" aria-label={"Retirer " + s.nom}
                            onClick={() => maj({ ...c, societes: c.societes.filter((x) => x.id !== s.id) })}>×</button>
                  )}
                </span>
              </div>
            </div>
          );
        })}
        <NouvelleSociete existantes={c.societes || []} onAdd={(s) =>
          maj({ ...c, societes: [...(c.societes || []), s],
                cnss: { ...c.cnss, [s.id]: { actif: false, montant: 0 } } })} />
        <div className="note">
          Chaque salarié et chaque activité relèvent d'une société. La CNSS se déclare société
          par société : elle n'est répartie que sur les activités qui portent les salaires de
          cette société-là. Le riad est chez Gourmet Souk, le reste chez Le Mi-Chui. Tant que la
          réponse est « Non », aucune CNSS n'entre dans les calculs.
        </div>
      </div>

      <div className="card">
        <h2 className="h2">Solidarité</h2>
        <div className="grid2">
          <div><label className="f">Montant habituel</label>
            <input className="f" inputMode="decimal" value={c.solidarite.montant}
                   onChange={(e) => maj({ ...c, solidarite: { ...c.solidarite,
                     montant: num(e.target.value) } })} /></div>
          <div><label className="f">Échéance le</label>
            <input className="f" inputMode="decimal" value={c.solidarite.jour}
                   onChange={(e) => maj({ ...c, solidarite: { ...c.solidarite,
                     jour: num(e.target.value) } })} /></div>
        </div>
        <div className="note">
          Le montant habituel sert de repère tant que tu n'as rien saisi dans le mois. Dès que
          tu enregistres le montant réel sur l'écran La maison, c'est lui qui compte.
        </div>
      </div>



      <div className="card">
        <h2 className="h2">Contrat Naps</h2>
        <Ligne lbl="Commission HT" value={c.naps.tauxHT} suffix="%"
               onChange={(v) => maj({ ...c, naps: { ...c.naps, tauxHT: num(v) } })} />
        <Ligne lbl="TVA sur la commission" value={c.naps.tva} suffix="%"
               onChange={(v) => maj({ ...c, naps: { ...c.naps, tva: num(v) } })} />
        <div className="note">
          Sert uniquement au contrôle Naps sur Le Mi-Chui : ce que Naps prélève vraiment
          (d'après son export) face à ce que dit ton contrat.
        </div>
      </div>

      <div className="card">
        <h2 className="h2">Seuils de cohérence</h2>
        {vivantes(c).filter(([, a]) => a.type !== "hebergement").map(([k, a]) => {
          const s = (c.seuils || {})[k];
          const majS = (champs) => maj({ ...c, seuils: { ...c.seuils,
            [k]: { ...(s || { matiere: 25, variable: 30 }), ...champs } } });
          return (
            <div key={k} style={{ borderBottom: "1px solid #EFF2E7", padding: "12px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
                <span className="dot" style={{ background: lisible(a.marque), margin: 0 }} />
                <span style={{ fontSize: 17, flex: 1 }}>{a.nom}</span>
                {!s && <button className="pill" onClick={() => majS({})}>Surveiller</button>}
              </div>
              {s && (
                <div className="grid2" style={{ marginBottom: 0 }}>
                  <div><label className="f">Matière max</label>
                    <input className="f" inputMode="decimal" value={s.matiere}
                           onChange={(e) => majS({ matiere: num(e.target.value) })} /></div>
                  <div><label className="f">Total variable max</label>
                    <input className="f" inputMode="decimal" value={s.variable}
                           onChange={(e) => majS({ variable: num(e.target.value) })} /></div>
                </div>
              )}
            </div>
          );
        })}
        <div className="note">
          Ces pourcentages se mesurent sur les ventes du mois en cours, pas sur un mois clos :
          le voyant est donc juste dès la deuxième semaine. Le total variable comprend la
          matière, le coursier, les emballages, les dépannages — mais ni les salaires ni le loyer,
          qui ne bougent pas quand tu vends plus.
        </div>

        <div style={{ borderTop: "1px solid #EFF2E7", paddingTop: 14, marginTop: 6 }}>
          <div style={{ fontSize: 17, marginBottom: 4 }}>Fond de caisse</div>
          <Ligne lbl="À surveiller (orange) à partir de"
                 value={(c.seuilFondCaisse || { orange: 50, rouge: 100 }).orange}
                 onChange={(v) => maj({ ...c, seuilFondCaisse: {
                   ...(c.seuilFondCaisse || { orange: 50, rouge: 100 }), orange: num(v) } })} />
          <Ligne lbl="Au rouge à partir de"
                 value={(c.seuilFondCaisse || { orange: 50, rouge: 100 }).rouge}
                 onChange={(v) => maj({ ...c, seuilFondCaisse: {
                   ...(c.seuilFondCaisse || { orange: 50, rouge: 100 }), rouge: num(v) } })} />
        </div>
        <div className="note">
          Un manque en dessous du premier seuil reste une erreur de comptage normale. Au-dessus,
          le voyant de l'activité passe orange puis rouge dans Vue d'ensemble — jamais un
          surplus, seulement un manque.
        </div>
      </div>

      <RepartirDeZero />

      <div className="card">
        <h2 className="h2">Mes fournisseurs</h2>
        {(c.fournisseurs || []).map((f) => (
          <div className="row" key={f.id}>
            <span className="lbl">
              {f.nom}
              <span className="tag" style={{ marginLeft: 8 }}>
                {(f.affaires || []).map((k) => c.affaires[k]?.nom).filter(Boolean).join(" · ")}
              </span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="mini">{RYTHMES[f.rythme]}</span>
              <button className="del" aria-label="Retirer"
                      onClick={() => maj({ ...c, fournisseurs: c.fournisseurs.filter((x) => x.id !== f.id) })}>×</button>
            </span>
          </div>
        ))}
        <NouveauFournisseur affaires={c.affaires} onAdd={(f) =>
          maj({ ...c, fournisseurs: [...(c.fournisseurs || []), f] })} />
      </div>

      {c.structures.length > 0 && (
      <div className="card">
        <h2 className="h2">Charges de structure</h2>
        {c.structures.map((s) => (
          <Ligne key={s.id} lbl={s.lbl} value={s.montant} onChange={(v) => majStruct(s.id, v)} />
        ))}
      </div>
      )}

      {hebergeurs(c).map(([hk, ha]) => {
        const H = ha.hebergement || { extras: {} };
        const majHeb = (champs) => maj({ ...c, affaires: { ...c.affaires,
          [hk]: { ...ha, hebergement: { ...H, ...champs } } } });
        const majExtra = (id, champs) => majHeb({ extras: { ...(H.extras || {}),
          [id]: { ...(H.extras || {})[id], ...champs } } });
        return (
          <div className="card" key={hk}>
            <Crest k={hk} c={ha} />
            <Ligne lbl="Commission Airbnb" value={H.comAirbnb ?? 0} suffix="%"
                   onChange={(v) => majHeb({ comAirbnb: num(v) })} />
            <Ligne lbl="Frais sur réservation directe" value={H.comDirect ?? 0} suffix="%"
                   onChange={(v) => majHeb({ comDirect: num(v) })} />
            {Object.entries(H.extras || {}).map(([id, x]) => (
              <div key={id} style={{ marginTop: 16 }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>{x.nom}</div>
                <div className="grid3">
                  <div><label className="f">Prix</label>
                    <input className="f" inputMode="decimal" value={x.prix}
                      onChange={(e) => majExtra(id, { prix: num(e.target.value) })} /></div>
                  <div><label className="f">Matière</label>
                    <input className="f" inputMode="decimal" value={x.matiere}
                      onChange={(e) => majExtra(id, { matiere: num(e.target.value) })} /></div>
                  <div><label className="f">Commission</label>
                    <input className="f" inputMode="decimal" value={x.com}
                      onChange={(e) => majExtra(id, { com: num(e.target.value) })} /></div>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      <div className="card">
        <h2 className="h2">Rémunérations personnelles</h2>
        {(c.foyer.remunerations || []).map((r) => (
          <div key={r.id}>
            <Ligne lbl={r.nom} value={r.montant}
                   onChange={(v) => maj({ ...c, foyer: { ...c.foyer,
                     remunerations: c.foyer.remunerations.map((x) =>
                       x.id === r.id ? { ...x, montant: num(v) } : x) } })} />
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center",
                          gap: 8, margin: "-4px 0 8px" }}>
              <span className="mini">versée le</span>
              <input className="f" style={{ width: 62, textAlign: "right", padding: "5px 9px" }}
                     inputMode="decimal" value={r.jour ?? 30}
                     onChange={(e) => maj({ ...c, foyer: { ...c.foyer,
                       remunerations: c.foyer.remunerations.map((x) =>
                         x.id === r.id ? { ...x, jour: num(e.target.value) } : x) } })} />
            </div>
          </div>
        ))}
        <div className="note">
          Ces deux salaires sont ce que vous touchez réellement. Les dépenses fixes du foyer
          sont un poste à part, réglé directement par les activités.
        </div>
      </div>

      <div className="card">
        <h2 className="h2">Charges fixes personnelles</h2>
        {c.foyer.fixes.map((f) => (
          <div key={f.id}>
            <Ligne lbl={<>{f.lbl}{f.transitoire &&
                    <span className="tag" style={{ marginLeft: 8 }}>temporaire</span>}</>}
                   value={f.montant} onChange={(v) => majFoyer(f.id, v)} />
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center",
                          gap: 8, margin: "-4px 0 8px" }}>
              <span className="mini">échéance le</span>
              <input className="f" style={{ width: 62, textAlign: "right", padding: "5px 9px" }}
                     inputMode="decimal" value={f.jour ?? 1}
                     onChange={(e) => maj({ ...c, foyer: { ...c.foyer,
                       fixes: c.foyer.fixes.map((x) =>
                         x.id === f.id ? { ...x, jour: num(e.target.value) } : x) } })} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 10 }}>
          <label className="f">Fin prévue du double logement</label>
          <input className="f" placeholder="décembre 2026"
                 value={c.foyer.finDoubleLogement || ""}
                 onChange={(e) => maj({ ...c, foyer: { ...c.foyer,
                   finDoubleLogement: e.target.value } })} />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn" onClick={enregistrer}>Enregistrer les réglages</button>
          {ok && <span className="pos">Enregistré.</span>}
        </div>
        <Alerte>{erreur}</Alerte>
      </div>

      <div className="card">
        <h2 className="h2">Sauvegarde</h2>
        <Sauvegarde config={config} />
        <div className="note" style={{ marginTop: 10 }}>
          Tes chiffres vivent maintenant sur un serveur partagé (Supabase) : toi et SAIB voyez
          les mêmes données, mises à jour en direct. Ce téléchargement reste une sauvegarde de
          sécurité à faire de temps en temps.
        </div>
      </div>

      {session && (
        <div className="card">
          <h2 className="h2">Compte</h2>
          <div className="row">
            <span className="lbl">Connecté comme</span>
            <span className="val">{session.user?.email}</span>
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="pill" onClick={onLogout}>Se déconnecter</button>
          </div>
        </div>
      )}

      <JournalReglages />
    </>
  );
}

/* Le témoin des Réglages. Rien n'est bloqué ici : on montre simplement ce qui
   a été changé, par qui et quand. Un loyer qui passe de 14 000 à 12 000 DH
   change le seuil de rentabilité de toutes les affaires — mieux vaut le voir
   écrit que le découvrir dans un résultat qui ne colle plus. */
function JournalReglages() {
  const [lignes, setLignes] = useState(null);
  const [tout, setTout] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const j = await window.storage.get("pilotage:journal-config");
        setLignes(j && j.value ? JSON.parse(j.value) : []);
      } catch (e) { setLignes([]); }
    })();
  }, []);

  if (!lignes || lignes.length === 0) return null;
  const vues = tout ? lignes.slice(0, 120) : lignes.slice(0, 12);
  const quand = (iso) => {
    const d = new Date(iso);
    return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0")
      + " à " + String(d.getHours()).padStart(2, "0") + "h" + String(d.getMinutes()).padStart(2, "0");
  };

  return (
    <div className="card">
      <h2 className="h2">Ce qui a été modifié ici</h2>
      {vues.map((l, i) => (
        <div key={i} className="row" style={{ alignItems: "baseline" }}>
          <span className="lbl">
            <span style={{ display: "block" }}>{l.quoi}</span>
            <span className="mini">{quand(l.quand)} · {l.qui}</span>
          </span>
          <span className="val" style={{ fontSize: 16, textAlign: "right" }}>
            {l.avant === null ? <span className="pos">ajouté · {l.apres}</span>
             : l.apres === null ? <span className="neg">supprimé · {l.avant}</span>
             : <><span className="mini" style={{ textDecoration: "line-through" }}>{l.avant}</span>
                 {"  →  "}<strong>{l.apres}</strong></>}
          </span>
        </div>
      ))}
      {lignes.length > 12 && (
        <button className="pill" style={{ marginTop: 12 }} onClick={() => setTout(!tout)}>
          {tout ? "Ne montrer que les derniers" : "Voir les " + Math.min(120, lignes.length) + " derniers changements"}
        </button>
      )}
      <div className="note">
        Chaque changement de réglage laisse une trace : quoi, quand, par qui. Rien n'est
        bloqué — mais un salaire, un loyer ou la clé de répartition modifiés ici déplacent
        tous les résultats et tous les seuils. Si un chiffre te surprend un jour, commence par
        regarder cette liste.
      </div>
    </div>
  );
}
