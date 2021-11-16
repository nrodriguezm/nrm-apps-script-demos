// Planilla activa actual
var timezone = Session.getScriptTimeZone();
var ss = SpreadsheetApp.getActiveSpreadsheet();
  
var hojaDatos = 'Archivos';
var sheet = ss.getSheetByName(hojaDatos);

var rootID = "1AwDzuyFf7gfSJWn1EaNM__FgESj9-Bla";

function onOpen() {

    // La función onOpen se ejecuta automáticamente cada vez que se carga un Libro de cálculo
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var menuEntries = [];
 
    menuEntries.push({
        name : "Leer Archivos Drive",
        functionName : "actualizar"
    });
    menuEntries.push(null);

    ss.addMenu("Actualizar", menuEntries);

}


function actualizar() {

  // Lee una carpeta Drive 
  var archivos = listarArchivos( DriveApp.getFolderById(rootID) );

  console.log(archivos);

  // Escribe los archivos leidos en Drive en la planilla
  escribirArchivos(archivos);

}

function listarArchivos(folder) { // Modified

  var filesData = [];

  var folderName = folder.getName();
  var files = folder.getFiles();

  while (files.hasNext()) {
    //var fileName = files.next().getName();
    Logger.log(folderName);

    filesData.push( leerArchivo(files.next()) );
  }

  var subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    listarArchivos(subfolders.next()); // Modified
  }

  return filesData;
}


function leerArchivo(file) {

  console.log( 'leerArchivo: ' + file.getName() );

  try {

    access     = file.getSharingAccess();
    permission = file.getSharingPermission();
    viewers    = file.getViewers();
    editors    = file.getEditors();

    view = [];
    edit = [];

    date =  Utilities.formatDate(file.getDateCreated(), timezone, "yyyy-MM-dd HH:mm")

    for (var v=0; v<viewers.length; v++) {
      view.push(viewers[v].getName() + " " + viewers[v].getEmail());
    }

    for (var ed=0; ed<editors.length; ed++) {
      edit.push(editors[ed].getName() + " " + editors[ed].getEmail());
    }

    switch(access) {
      case DriveApp.Access.PRIVATE:
        privacy = "Private";
        break;
      case DriveApp.Access.ANYONE:
        privacy = "Anyone";
        break;
      case DriveApp.Access.ANYONE_WITH_LINK:
        privacy = "Anyone with a link";
        break;
      case DriveApp.Access.DOMAIN:
        privacy = "Anyone inside domain";
        break;
      case DriveApp.Access.DOMAIN_WITH_LINK:
        privacy = "Anyone inside domain who has the link";
        break;
      default:
        privacy = "Unknown";
    }

    switch(permission) {
      case DriveApp.Permission.COMMENT:
        permission = "can comment";
        break;
      case DriveApp.Permission.VIEW:
        permission = "can view";
        break;
      case DriveApp.Permission.EDIT:
        permission = "can edit";
        break;
      default:
        permission = "";
    }

    view = view.join(", ");

    edit = edit.join(", ");

    users = (permission === "" ? "" : " " + permission);
    users_editors = (edit === "" ? "" : ", " + edit);
    users_viewers = (view === "" ? "" : ", " + view);

    //rows.push([url, privacy, date]);

  } catch (e) { Logger.log(e.toString()); Logger.log(file.getName()); };

  return [
    file.getId(),
    file.getName(),
    file.getUrl(),
    privacy, 
    users,
    users_editors, 
    users_viewers, 
    date,
    file.getSize(),
    file.getDescription(),
    file.getMimeType(),
  ];
  
}


// Recorrer e insertar en planilla
function escribirArchivos(data) {
    
  // calculate the number of rows and columns needed
  var numRows = data.length;

  if (numRows > 0) {
    var numCols = data[0].length;
                      
    // Escribir en filas nuevas antes de la fila 2 (para mantener formato)
    sheet.insertRowsBefore(2, numRows);
    sheet.getRange(2, 1, numRows, numCols).setValues(data);
  }

}
