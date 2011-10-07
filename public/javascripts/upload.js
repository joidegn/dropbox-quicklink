window.URL = window.URL || window.webkitURL;  

function addFiles(files) {
  var dropbox;            
  dropbox = document.getElementById('dropbox'); 
  var list = document.createElement("ul");  
  for (var i=0;i<files.length;i++) {
    var li = document.createElement("li");
    var button = document.createElement("input");
    list.appendChild(li);
    var img = document.createElement("img");
    img.src = window.URL.createObjectURL(files[i]);
    img.height = 60;
    img.onload = function(e) {
      window.URL.revokeObjectURL(this.src);
    };
    img.classList.add("upload_obj");
    li.appendChild(img);
    var info = document.createElement("span");
    info.innerHTML = files[i].name + ": " + Math.round(files[i].size/1024) + " kb";
    li.appendChild(info);
    
  }
  var button = document.createElement("input");
  button.type = "submit";
  button.onclick = function() {
    sendFiles(files);
    return false;
  };
  dropbox.appendChild(list);
  dropbox.appendChild(button);
}

sendFiles = function(files) {
  var imgs = document.querySelectorAll(".upload_obj");
  console.log('sending:');
  console.log(files);
  for (var i=0;i<imgs.length;i++) {
    new fileUpload(files[i]);
  }
  
  
};

function fileUpload(file) {
  console.log('Uploading...');
  console.log(file);
  var reader = new FileReader();
  //this.ctrl = createThrobber(img);
  var xhr = new XMLHttpRequest();
  this.xhr = xhr;

  var self = this;
  this.xhr.upload.addEventListener("progress", function(e) {
    if (e.lengthComputable) {
      var percentage = Math.round(e.loaded*100/e.total);
      //self.ctrl.update(percentage);
    }
  }, false);
  
  xhr.upload.addEventListener("load", function(e) {
    console.log('done');
    //self.ctrl.update(100);
    //var canvas = self.ctrl.ctx.canvas;
    //canvas.parentNode.removeChild(canvas);
  }, false);
  xhr.open('POST', '/upload');
  xhr.setRequestHeader('x-file-name', file.name);
  xhr.setRequestHeader('x-file-size', file.size);
  xhr.setRequestHeader('x-file-type', file.type);
  xhr.send(file);
  //xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
  //reader.onload = function(evt) {
    //xhr.sendAsBinary(evt.target.result);
  //};
  //reader.readAsBinaryString(file);
}

window.onload = function() {
  var dropbox;            
  dropbox = document.getElementById('dropbox'); 
  dropbox.addEventListener("dragenter", dragenter, false);  
  dropbox.addEventListener("dragover", dragover, false);  
  dropbox.addEventListener("drop", drop, false);  
}
function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) { 
  e.stopPropagation();
  e.preventDefault();
  console.log(e);
  var dt = e.dataTransfer;
  var files = dt.files;
  addFiles(files);
}
