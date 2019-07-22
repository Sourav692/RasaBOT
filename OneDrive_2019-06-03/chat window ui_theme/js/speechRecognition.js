$(document).ready(function(){
try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
  
const icon = $('i.fa.fa-microphone');

icon.on('click', () => {
    dictate();
  });

const dictate = () => {
    recognition.start();
    recognition.onresult = (event) => {
        var current = event.resultIndex;
         // Get a transcript of what was said.
         var transcript = event.results[current][0].transcript;
        
         $("#btn-input").val(transcript);
         $('#btn-chat').click();
        
      }

      recognition.onstart = function() { 
        $("#btn-input").val('Voice recognition activated. Try speaking into the microphone.');
      }
      
      recognition.onspeechend = function() {
        $("#btn-input").val('You were quiet for a while so voice recognition turned itself off.');
      }
      
      recognition.onerror = function(event) {
        if(event.error == 'no-speech') {
            $("#btn-input").val('No speech was detected. Try again.');  
        };
    }
  }
});