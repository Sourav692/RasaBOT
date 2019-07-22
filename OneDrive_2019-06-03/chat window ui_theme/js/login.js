$(document).ready(function() {
    $('#loginForm').submit(function(){
        loginToBot();
    });
});

function loginToBot(){
    var username = $('#username').val();
    var password = $('#userpassword').val();
    console.log(username + password);
    var unArray = ["Test","admin", "poornima.aprameya", "saumya.rauniyar", "samiksha.kapoor",
    				"mike.kerr", "nagaraj.mp", "anjana.shriram", "linto.tomy", "ripudaman.rajput", 
    				"somi.ali", "poonam.x.mishra", "lavanya.madhu"];

    var pwArray = ["Test@123","admin", "BotClient@9991", "BotClient@9992", "BotClient@9993",
    				 "BotClient@9994", "BotClient@9995","BotClient@9996","BotClient@9997",
    				 		"BotClient@9998","BotClient@9999","BotClient@9910","BotClient@9911" ];

    var valid=-1;
    for (var i=0; i <unArray.length; i++) {
      if ((username == unArray[i]) && (password == pwArray[i])) {
          valid = i;
          break;
      }
    }
    console.log(valid);
    if (valid != -1) {	
      //alert("Login Successful");
      $("#main-page").dis
    }
    return false;  
  }