var dictionary = { // props in alphabetical order ok? promise?
// prop   : {fr, en, es}
  contra  : {fr:"Mot de passe", en:"Password", es:"Contraseña", eu:"Pasahitza"},
  json  : {fr:"Importation en JSON", en:"Import in JSON", es:"Importar en JSON", eu:"Inportatu JSON-n"},
  jflap  : {fr:"Importation en JFLAP", en:"Import in JFLAP", es:"Importar en JFLAP", eu:"Inportatu JFLAP-n"},
  login  : {fr:"Connexion", en:"Login", es:"Iniciar sesión", eu:"Saioa hasi"},
  nombre : {fr:"Nom:", en:"Name:", es:"Nombre:", eu:"Izena:"},
  tipo  : {fr:"Type:", en:"Type:", es:"Tipo:", eu:"Mota:"},
  pila :  {fr:"Batterie:", en:"Stack:", es:"Pila:", eu:"Pila:"},
  usuario : {fr:"Nom de l'utilisateur", en:"Username", es:"Nombre de usuario", eu:"Erabiltzaile izena"},
};

let idioma;

function getLang() {
  return idioma;
}


function translate( lan ) {
  idioma = lan;
  console.log('Cambiamos al idioma '+ lan);
  $("[data-translate]").text(function(){

    var data = this.dataset.translate.split("|");
    var prop = data[0];  // the dictionary property name
    var style = data[1]; // "uppercase", "lowercase", "capitalize"

    if(!prop in dictionary) return console.error("No "+ prop +" in dictionary");

    var trans =  dictionary[prop][lan]; // The translated word

// Do we need to apply styles?
    if(style==="capitalize"){
      trans = trans.charAt(0).toUpperCase() + trans.slice(1);
    } else if(style==="uppercase"){
      trans = trans.toUpperCase();
    } else if( style==="lowercase"){
      trans = trans.toLowerCase();
    }

    return trans;
  });
}

// Swap languages when menu changes
$("[data-lang]").click(function() {
  translate( this.dataset.lang );
});

// Set initial language to spanish
translate('es');
console.log(getLang());