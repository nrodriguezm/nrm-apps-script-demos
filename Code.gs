// Planilla activa actual
var timezone = Session.getScriptTimeZone();
var ss = SpreadsheetApp.getActiveSpreadsheet();
  
var hojaDatos = 'Llamados';
var sheet = ss.getSheetByName(hojaDatos);

function onOpen() {

    // La función onOpen se ejecuta automáticamente cada vez que se carga un Libro de cálculo
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var menuEntries = [];
 
    menuEntries.push({
        name : "Leer RSS",
        functionName : "actualizar"
    });
    menuEntries.push(null);

    ss.addMenu("Actualizar", menuEntries);

}


function actualizar() {

  // Leer RSS
  var datosRss = parseAndUpdateRss('https://www.comprasestatales.gub.uy/consultas/rss');

  //console.log(datosRss);

  // Escribe los archivos leidos en Drive en la planilla
  escribirArchivos(datosRss);

}

// Recorrer e insertar en planilla
function escribirArchivos(data) {
    
  var Dvals = flatten(ss.getRange("D1:D").getValues());
  console.log(Dvals);

  var resultado = data.filter(function (row) {
    console.log('Looking for: ' + row[3] + ', indexOf: ' + Dvals.indexOf(row[3]));
    return Dvals.indexOf(row[3]) === -1;
  }); 

  // calculate the number of rows and columns needed
  var numRows = resultado.length;

  if (numRows > 0) {
    var numCols = resultado[0].length;
                      
    // Escribir en filas nuevas antes de la fila 2 (para mantener formato)
    sheet.insertRowsBefore(2, numRows);
    sheet.getRange(2, 1, numRows, numCols).setValues(resultado);
  }

  ss.toast("Se escribieron " + resultado.length + " nuevas publicaciones.", "Actualizacion");

}

// Aplana un nivel de array anidado, util para getValues y tener los valores en un arreglo
function flatten(arrayOfArrays){
  return [].concat.apply([], arrayOfArrays);
}

