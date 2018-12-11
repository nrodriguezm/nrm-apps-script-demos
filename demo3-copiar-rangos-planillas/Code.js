var adminEmail = 'admin@mail.com';
var strEmailTitulo = 'Error planilla Demo3 nrm.uy - Copiar rangos entre planillas';

// Link a planilla desde la cual vamos a copiar hacia la planilla actual
var linkPlanillaOrigenDatos = 'http://...';
// Columnas a copiar desde la hoja de origen, para poder cambiar el orden, indice inicia en 1
var arrColsOrigen = [3, 1, 20, 6];

// Preparamos menu para que el usuario pueda actualizar desde la planilla sin entrar al editor de codigo
function onOpen() {
    // La función onOpen se ejecuta automáticamente cada vez que se carga un Libro de cálculo
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var menuEntries = [];
 
    menuEntries.push({
        name : "Actualizar Datos",
        functionName : "actualizar"
    });
    menuEntries.push(null);

    ss.addMenu("Actualizar", menuEntries);
}

function actualizar() { 
  // Hoja origen, Hoja destino, Link a planilla de origen
  copiarRangos("HojaOrigen", "HojaDestino", linkPlanillaOrigenDatos);
}

// Copia de datos desde origen con formula a planilla destino unificada, antes eran dos empresas separadas
function copiarRangos(hojaBDOrigen, hojaBDDestino, linkOrigen) {  
  
  // Limpieza en hoja destino
  var destSS = SpreadsheetApp.getActiveSpreadsheet();
  var destsheet = destSS.getSheetByName(hojaBDDestino); // la planilla actual, hoja destino de los datos
  var range = destsheet.getRange("A2:Z");
  range.clear();
  
  // Buscamos hoja preprocesada
  var sourceSS = SpreadsheetApp.openByUrl(linkOrigen);
  var sheets = sourceSS.getSheets(); // todas las hojas de fuente, vamos a buscar la que ya esta preprocesada
  
  for (i in sheets){ 
    var sheetName = sheets[i].getSheetName().substring(0,15);
    Logger.log("En hoja: "+sheetName);    
    
    // Si es la hoja preprocesada
    if (sheetName == hojaBDOrigen) { 
      SpreadsheetApp.getActiveSpreadsheet().toast('Copiando datos '+hojaBDDestino+'...', 'Estado');
      
      var sourcesheet = sourceSS.getSheetByName(sheetName);
      
      Logger.log("Entramos en la hoja: "+sheetName);
      
      var iniRow = 2;
      var colPos = 2;
      
      // Cada columna a importar
      for (var iCol in arrColsOrigen) {
        // Leemos
        var sourcerange = sourcesheet.getRange(2,arrColsOrigen[iCol],sourcesheet.getLastRow()-1,1);
        var sourcevalues = sourcerange.getValues(); 
        // Escribimos
        var destrange = destsheet.getRange(iniRow,colPos,sourcevalues.length,1);
        destrange.setValues(sourcevalues); 
        
        colPos++;
      }
            
      // Formula mes, podemos incluir formulas personalizadas en la hoja de destino que apliquen sobre los valores copiados
      var destrange = destsheet.getRange(iniRow,1,sourcevalues.length,1);
      destrange.setValue("=MONTH(B2+1)"); 
      
      SpreadsheetApp.getActiveSpreadsheet().toast('Copiado finalizado de '+hojaBDDestino+' finalizado. Se actualizarán formulas.', 'Estado', 2);
      
    } // sheetName
    
  } // i in sheets

}