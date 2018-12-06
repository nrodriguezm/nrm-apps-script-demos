function leerMails() {
  
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    var hojaDatos = 'Emails';
    var sheet = ss.getSheetByName(hojaDatos);
    
    // IDs ya existentes  
    var arrIdsCells = [];
    
    // Fetch the range
    var dataRange = sheet.getRange(2,1,sheet.getMaxRows()-1,sheet.getMaxColumns());
    
    // Fetch values for each row in the Range.
    var dataCurrent = dataRange.getValues();
    
    for (var i = 0; i < dataCurrent.length; ++i) {
        
      var row = dataCurrent[i];
      
      // celdas actuales
      var valId = row[0];

      // si encontramos
      arrIdsCells.push(valId);
    }
    
    //Logger.log("Cells Ids: " + arrIdsCells);
    
    // CONSULTAR MAILS
    
    var searchTerm = "Google Cloud";
    var threads = GmailApp.search(searchTerm,0,20);
    //Logger.log("Search term: "+searchTerm);
    
    var mailsData = [];
    var arrIdsMails = [];
    
    // Conversaciones
    for (var i = 0; i < threads.length; i++) {
      Logger.log("Each Thread: "+threads[i].getFirstMessageSubject());
      
      var thread = threads[i];
      var messages = GmailApp.getMessagesForThread(thread);
      // Mensajes dentro de conversaciones
      for (var j = 0 ; j < messages.length; j++) {
        //Logger.log("Each Message: "+threads[i].getFirstMessageSubject());
        
        var messageId = messages[j].getId();
        var messageDate = messages[j].getDate();
        var messageTitle = messages[j].getSubject();
        
        // Se puede obtener el mensaje completo
        var messageBody = messages[j].getBody();       
        
        //Logger.log("ID: " + messageId)
        //Logger.log("Body: " + messageBody);
     
        // Podemos buscar partes del contenido del mail
        if (messageBody) {
          var textPosIni = messageBody.indexOf('invoice');
          var textPosEnd = messageBody.indexOf('');
          if (textPosIni > -1) {
            messagePart = messageBody.substring(textPosIni,textPosIni+20);
          }
        }       
              
        // Si no es de los ya existentes
        if (arrIdsCells.indexOf(messageId) == -1 && messageDate != undefined && messageDate != "") {
        
          Logger.log("Insertamos registro: "+messageId);
          
          // Registry from Mail data
          mailsData.push([
            messageId,
            messageDate,
            messageTitle,           
          ]);
            
          // Save all ids for searching
          arrIdsMails.push(messageId);
          
        } else {
          Logger.log("Existe: "+messageId);
        }
      }
    }
   
    //Logger.log("All Ids: " + arrIdsMails);
    
          
    
    // INSERTAR 
          
          
    // Recorrer e insertar
    
    
    var startRow = 2;  // First row of data to process
    var numRows = 2;   // Number of rows to process
    
    // calculate the number of rows and columns needed
    var numRows = mailsData.length;
    if (numRows > 0) {
      var numCols = mailsData[0].length;
                        
      // output the numbers to the sheet
      sheet.insertRowsAfter(1, numRows);
      sheet.getRange(2,1,numRows,numCols).setValues(mailsData);
    }
    
    
  }
  