function parseAndUpdateRss(feed) {
  
    var datos = [];
  
    var txt = UrlFetchApp.fetch(feed).getContentText();
    var document = XmlService.parse(txt);  
  
    var root = document.getRootElement().getChildren();
    var entries = root[0].getChildren('item');
  
    for (var i = 0; i < entries.length; i++) {
  
      //console.log( entries[i].getName() + ': ' + entries[i].getChild('title').getText() );
  
      var date = new Date( entries[i].getChild('pubDate').getText() );
  
  
      datos.push([
        date.toISOString().slice(0,10),
        entries[i].getChild('title').getText(),
        entries[i].getChild('description').getText()
          .replace(/<[^>]+>/g, "\n")
          .replace(/&nbsp;/gi," ")
          .replace(/&sol;/gi,"/"),
          //.replace(/([&<>\"'])/g, match => htmlEntities[match]),
        entries[i].getChild('link').getText(),
      ]);
    
    }
    
    ss.toast("Lectura de " + entries.length + " entradas completada.", "RSS");
  
    return datos;
  }
  