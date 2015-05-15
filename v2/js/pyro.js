var hasFlash = ((typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] == "object") || (window.ActiveXObject && (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) != false));
var firebase_url = "";
var pythonDefault = "print 'Welcome to PyroPad!'";
var socket = io('https://hidden-inlet-2774.herokuapp.com/');
var codeMirror = CodeMirror(document.getElementById('firepad-container'), {lineNumbers: true, theme: 'midnight', mode: 'python'});
var codeMirrorOutput = CodeMirror(document.getElementById('firepad-container-output'), {lineNumbers: true, theme: 'midnight', mode: 'text/plain'});
var firepadRef = getRef();
var outputRef = new Firebase(firebase_url);
var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {defaultText: pythonDefault});
var outputpad = Firepad.fromCodeMirror(outputRef, codeMirrorOutput, {defaultText: "OUTPUT"});
var compiler = 'python';
var filename = 'solution.py';
var setMode = 'python';

socket.on('output', function(output) {      
  $("#comp").html("&#9658;");
  outputpad.setText("");
  var content = output.stderr + output.stdout;
  outputpad.setText(content);
});

if(hasFlash) {
    ZeroClipboard.config({swfPath:"https://cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.2.0/ZeroClipboard.swf"});
    //var client = new ZeroClipboard($("#shareLink"));
    //client.clip(document.getElementById("shareLink"));    
    //client.on("ready", function(event) {
    //client.setText(window.location.href);
  //});
}

function getRef() {
  var ref = new Firebase('https://boiling-fire-6186.firebaseio.com/');
  var hash = window.location.hash.replace(/#/g, ''); 
  if (hash) {
    ref = ref.child(hash);
  } 
  else {
    ref = ref.push();
    window.location = window.location + '#' + ref.key();
  }
  if(typeof console !== 'undefined') {
    firebase_url = ref.toString() + "--output";
  }
  console.log('Firebase data: ', ref.toString());
  return ref;
}

function sendCode() {
  $("#comp").html("&bull;&bull;&bull;");
  var code = firepad.getText();
  code = encodeURI(code);
  socket.emit('compile', {filename:filename, compiler:compiler, code:code});
}

function shareLink() {
  $("#shareLink").text("Copied").css("color", "#7FFF00");
  window.setTimeout(function() {
    $("#shareLink").text("Copy Link").css("color", "white");
  }, 800);
  if(!hasFlash) {
    window.prompt("Copy Link", window.location.href);
  }
}

    
  /*
    var mode = {'c':'clike', 'c++':'clike', 'java':'text/x-java', 'python':'python'};
    var compi = {'java': 'javac', 'c++':'gcc', 'c':'gcc', 'python':'python'};
    var ext = {'python':'py', 'haskell':'hs', 'java':'java', 'c':'c', 'c++':'cpp'};
    
  
    $("#lang").change(function(e) {
      var lang = $(this).val().toLowerCase();
      console.log("lang is now " + lang);
      if(lang in mode) {
        setMode = mode[lang];
      }
      if(lang in compi) {
        compiler = compi[lang];
      }
      if(lang in ext) {
        filename = 'solution.' + ext[lang];
      }
      codeMirror.setOption("mode", setMode);
      console.log(lang + " " + compiler + " " + filename);
    });*/
    