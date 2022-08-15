//Seite verstecken, wenn kein admin eingeloggt ist
if (document.body.getAttribute("class").includes("not-logged-in")) {
    document.body.style.visibility = "hidden";
}

// Form Handler
document.getElementById("submit").onclick = function(){makeQR(extract("title"), extract("url"))};

//PageEditor öffnen, <div> Elemente mit den Weiterleitungen einfügen
function pageEdit() {
    var page = document.getElementById("home").outerHTML;
    var win = window.open("https://www.accente.com/de/node/510/edit",'_blank');
    win.onload = function() {
        win.document.getElementById("switch_edit-body-und-0-value").click();
        win.document.getElementById("edit-body-und-0-value").value = page;
        win.document.getElementById("edit-captcha-response").focus()
        win.alert("Nur das Captcha ausfüllen und speichern! :) \n ACHTUNG: Das Captcha muss beim ersten Mal richtig sein, sonst muss der Tab geschlossen und der Vorgang von neu gestartet werden");
    }
}

//Seite von Server laden
function loadHTML(){
  fetch('https://www.accente.com/sites/default/files/test/qrtool/export.html')
  .then(response=> response.text())
  .then(text=> document.getElementById('content').outerHTML = text);
  }

//HTML download
function download(){
    var a = document.body.appendChild(
        document.createElement("a")
    );
    a.download = "qrcodes.html";
    a.href = "data:text/html;charset=UTF-8," + encodeURIComponent(document.getElementById("content").outerHTML); // Grab the HTML
    a.href += encodeURIComponent(document.getElementById("Redirections").outerHTML);
    a.click(); // Trigger a click on the element
}

//Div Elemente herunterladen
function divdown() {
    var a = document.body.appendChild(
        document.createElement("a")
    );
	a.download = "divs.txt";
    a.href = 'data:attachment/text,' + encodeURI(document.getElementById("Redirections").innerHTML);
    a.click(); // Trigger a click on the element
}

//Input Extraction
function extract(id) {
  var elText = document.getElementById(id);
  if (!elText.value) {
    elText.focus();
    return null;
  } else {return elText.value;}
}

//Link Weiterleitung
function redirect(id, link) {
var urlSplit = document.URL.split("#");
if (urlSplit[1] == id) {
    location.href = link;
}
}

//QR Code löschen
function remRow(buttonId) {
    var text = "Bist du sicher, dass du diesen Code löschen möchtest?\nDas kann nicht rückgängig gemacht werden.";
    if (confirm(text) == true) {
        var table = document.getElementById("codelist");
        var button = document.getElementById(buttonId);
        document.getElementById(button.dataset.id).remove();
        table.deleteRow(button.parentNode.parentNode.rowIndex - 1);
        var spaces = document.getElementById("space").children;
        var len = spaces.length - 1;
        for (i = len; i > (len - 2); i--) {
            spaces[i].remove();
        }
    }
}

function changeURL(buttonId) {
	var table = document.getElementById("codelist");
	var button = document.getElementById(buttonId);
	change(button.dataset.id, document.getElementById("url"+button.dataset.id).value, document.getElementById("td"+button.dataset.id));
}

//Url ändern
function change(id, newTarget, tableCell) {
    //Redirect in <div> ändern
	var myDiv = document.getElementById(id);
	var myScript = myDiv.children[0];
	myScript.innerHTML = "redirect(\""+id+"\", \""+newTarget+"\");";
    //URL Eintrag in Tabelle ändern
    var myAnchor = tableCell.children[0];
	myAnchor.href = newTarget;
}

//QR Download als .png
function dlCanvas(qrId) {
  var canvas = document.getElementById(qrId);
  console.log(canvas);
  var dt = canvas.toDataURL('image/png');
  /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
  dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

  /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
  dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');

  this.href = dt;
};

//QR Code erstellen
function makeQR(title, target) {

 if(title != null && !(title.indexOf(' ') >= 0) && target != null && document.getElementById(title) == null) {
  var myDiv = document.createElement("div");
  var myScript = document.createElement("script");
  myScript.innerHTML = "redirect(\""+title+"\", \""+target+"\");"
  myDiv.appendChild(myScript);
  myDiv.setAttribute("id", title);
  myDiv.onload = function(){ redirect(title, target) };
  document.getElementById("Redirections").appendChild(myDiv);
  var options = {
    text: "https://www.accente.com/marketing/qrtool/#"+title,
    quietZone: 10,
    quietZoneColor: "rgba(255,255,255, 1.0)"
  };
  var tbl = tblEntry(title, target, title);
  var preview = document.getElementById(title + "qr");
  var qrcode = new QRCode(preview, options);
  var qrcanvas = preview.children[0];
  var link = qrcanvas.toDataURL("image/png");
  preview.src = link;
  document.getElementById(title + "downl").href = link;
 } else if(document.getElementById(title) != null) {
   alert("Titel ist bereits vergeben oder ungültig (keine Leerzeichen)");
 } else {
   document.getElementById("title").focus();
   document.getElementById("url").focus();
   }
  document.getElementById("title").value = null;
  document.getElementById("url").value = null;
}

//Eintrag in Tabelle hinzufügen
function tblEntry(name, url, prev) {
  var table = document.getElementById("codelist");
  var row = document.createElement("tr");
  var first = document.createElement("td");
  first.innerHTML = name;
  var secondtd = document.createElement("td");
  secondtd.id = "td"+name;
  var second = document.createElement("a");
  second.href = url;
  second.innerHTML = url;
  second.class = "myLink";
  secondtd.appendChild(second);
  var third = document.createElement("img");
  third.class = "image";
  third.id = name + "qr";
  var thirdtd = document.createElement("td");
  thirdtd.appendChild(third);
  var fourth = document.createElement("a");
  var fourthtd = document.createElement("td");
  fourthtd.appendChild(fourth);
  var fifthtd = document.createElement("td");
  var fifth = document.createElement("form");
  var five = document.createElement("input");
  five.id = "url"+name;
  five.placeholder = "Neue URL";
  five.type = "url";
  var fifbut = document.createElement("button");
  fifth.appendChild(five);
  fifth.appendChild(fifbut);
  fifthtd.appendChild(fifth);
  var six = document.createElement("button");
  var sixtd = document.createElement("td");
  sixtd.appendChild(six);
  row.appendChild(first);
  row.appendChild(secondtd);
  row.appendChild(thirdtd);
  row.appendChild(fourthtd);
  row.appendChild(fifthtd);
  row.appendChild(sixtd);
  table.appendChild(row);
  var qrCode = document.getElementById(name+"qr").src;
  fourth.outerHTML = '<a download="qrcode_'+name+'.png" href="'+document.getElementById(''+name+'qr').src+'+" id="'+name+'downl" style="">Download</a>';
  fifbut.outerHTML = '<button class="myButton" type="button" id="button'+name+'" data-id="'+name+'" onclick="changeURL(\'button'+name+'\')">URL Ändern</button>';
  six.outerHTML = '<button class="myButton" type="button" id="delete'+name+'" data-id="'+name+'" onclick="remRow(\'delete'+name+'\')">Code löschen</button>';
  for (i = 0; i < 2; i++) {
    var myDiv = document.getElementById("space");
    var space = document.createElement("p");
    space.innerHTML = "&nbsp;";
    myDiv.appendChild(space);
  }
}

//Button Funktionalitäten zuweisen
function buttonFunc() {
	var table = document.getElementById("codelist");
	for (i = 0; i < table.rows.length; i++) {
		let row = table.rows[i]
		for (j = 0; j < row.cells.length; j++) {
			let col = row.cells[j]
			if (j == 3) {
				var button = col.children[0];
				button.onclick = dlCanvas;
				console.log("Download:");
				console.log(button.onclick);
			} else if (j == 4) {
				var button = col.children[0].children[1];
				button.onclick = function()
				{change(this.dataset.id, document.getElementById("url"+this.dataset.id).value, document.getElementById("td"+this.dataset.id))};
				console.log("Refactoring:");
				console.log(button.onclick);
			} else if (j == 5) {
				var button = col.children[0];
				button.onclick = function() {
					document.getElementById("codelist").deleteRow(this.parentNode.parentNode.rowIndex);
					document.getElementById(this.dataset.id).remove();
				};
				console.log("Deletion:");
				console.log(button.onclick);
			}
		}
	}
}
//Drag and Drop Upload
/*function dateiauswahl(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var f = evt.dataTransfer.files[0]; // FileList Objekt
    if (f) {
            var r = new FileReader();
            r.onload = function (e) {
                var contents = e.target.result;
                var contents = contents.split('<div id="Redirections">');
                document.getElementById("content").outerHTML = contents[0];
                document.getElementById("Redirections").outerHTML = contents[1];
            }
            r.readAsText(f);
        } else {
            alert("Upload fehlgeschlagen :( ");
    }
    var output = [];
    output.push('<p>', 'Zuletzt geändert: ', f.lastModifiedDate.toLocaleDateString(), '</p>');
    document.getElementById('list').innerHTML = output.join('');
}

function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    }

// Initialisiere Drag&Drop EventListener
var dropZone = document.getElementById('dropzone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', dateiauswahl, false);

//Dropzone ausblenden
function toggle() {
    var visible = document.getElementById("dropzone").style.visibility;
    if (visible == "hidden") {
        document.getElementById("dropzone").style.visibility = null;
        document.getElementById("dropbutt").innerHTML = "Ausblenden";
    } else {
        document.getElementById("dropzone").style.visibility = "hidden";
        document.getElementById("dropbutt").innerHTML = "Einblenden";
    }
}
*/
