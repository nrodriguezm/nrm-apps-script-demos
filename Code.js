var adminEmail = 'admin@mail.com';
var strEmailTitulo = 'Error planilla Demo1 nrm.uy - Leer API';
var apiURL = 'https://jsonplaceholder.typicode.com/';

// Hoja de la planilla donde apareceran los datos de la API
var hojaDatos = 'Datos';


// Preparamos menu para que el usuario pueda actualizar desde la planilla sin entrar al editor de codigo
function onOpen() {
    // La función onOpen se ejecuta automáticamente cada vez que se carga un Libro de cálculo
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var menuEntries = [];
 
    menuEntries.push({
        name : "Actualizar Datos",
        functionName : "getDatosAPI"
    });
    menuEntries.push(null);

    ss.addMenu("Actualizar", menuEntries);
}


// Procesado de datos, llamamos a la API con los parametros 
function getDatosAPI() {
  
  // Mensaje de esto para el usuario
  SpreadsheetApp.getActiveSpreadsheet().toast('Iniciando script...', 'Status', -1);
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();   
  var sheet = ss.getSheetByName(hojaDatos);
  
  var path = 'todos/';
  var query = '';
  var json = getApiData(apiURL+path,query);
  
  // Aqui guardamos los datos en forma temporal antes de escribir en la hoja destino
  var jsonData = [];
  // Posicion de filas
  var iRow = 1;
  
  if (json[0] === "Error:") {    
    MailApp.sendEmail(adminEmail, strEmailTitulo+'', "No se pudo leer la API. "+apiURL+path);  
  } else {
    
    // Limpiamos el rango de datos previos
    var range = sheet.getRange("A2:Z");
    range.clear();  
    
    // Columna de referencia, podemos generar columnas con formulas referenciadas a la respuesta
    var strColUserId = "A";
    
    // cada linea de la respuesta de la API
    for (var i in json) {     
      jsonData.push([
          json[i]["userId"],
          json[i]["id"],
          json[i]["title"],
          json[i]["completed"],
          '=IF('+strColUserId+iRow+'=1,"Admin","")',
        
      ]);
        
      console.log(jsonData[i])
      iRow++;      
    } 
    
    // Calculamos el numero de filas y columnas a modificar en la planilla
    var numRows = jsonData.length;
    var numCols =  jsonData[0].length;
    
    // Actualizamos la hoja destino con la respuesta
    sheet.getRange(2,1,numRows,numCols).setValues(jsonData);
    
    sleep(1);
    
    // Mensaje de esto para el usuario
    SpreadsheetApp.getActiveSpreadsheet().toast('Finalizamos!', 'Status', -1);
       
  } // else, exito en la llamada a la API 
  
} // /getDatosAPI


// Llamada a API externa
function getApiData(url,query) {
    
  try {
    var response = UrlFetchApp.fetch(url); 
    var responseData = response.getContentText();
    var json = JSON.parse(responseData);
    return json;
  }
  catch (e) {
    Logger.log(e);
    return ["Error:", e];
  }
} // /getApiData
