//Constants
const botName ="BI Bot";
var obj = window.location.hostname;
const user = obj;

const audio = new Audio('/audio/filling-your-inbox.mp3');
var messages = [], //array that hold the record of each string in chat
  lastUserMessage = "", //keeps track of the most recent input string from the user
  botMessage = "", //var keeps track of what the chatbot is going to say
  talking = true, //when false the speach function doesn't work
  welcomeMsg = '',
  now,
  beforeClickMessage="",
  numOfCharts = 0,
  //url = "https://18231f4f.ngrok.io",
  url = "http://localhost:70",
  languageSel='',
  urlLink = '';

  var isLoaderForCharts = false,
  queryToBotByUser = "",
  greetings= ['hi','hello','hola','Bonjour','how are you','welcome','thank you', 'awesome','much appreciated','help',];

$(document).ready(function() {
    languageSel = $('.selectpicker').find(":selected").val();
    changeLang(languageSel);
    var count=0;
    dateUtility();
    setInterval(dateUtility, 1000);
    $('.welcome').delay(2000).fadeIn(500);
    //$('#incoming_msg').play();
    
    $("#btn-chat").on('click', function(e){
      var userMessage = $("#btn-input").val();
      audio.play();
      sendMessage(userMessage)
    });
    $("#btn-input").on('keypress', function(e){
      var key = e.which;
      if(key == 13)  // the enter key code
      { 
        var userMessage = $(this).val();
        sendMessage(userMessage);
        return false;
      }
    });
    $(document).on('change','.selectpicker', function(){
      languageSel = $(this).find(":selected").val();
      changeLang(languageSel);
      console.log('selected Language'+languageSel);
      var userMessage = $("#btn-input").val();
      if(userMessage!= undefined && userMessage!=''){
        sendMessage(userMessage);
      }
    });
    $body = $("body");
    $(document).on({
        ajaxStart: function() { if(isLoaderForCharts){$body.addClass("loading"); }   },
        ajaxStop: function() { if(isLoaderForCharts){$body.removeClass("loading");} }    
    });
    //captureThumbsClick();
    
});

function changeLang(lang){

  $.i18n.properties({ 
    name: 'Messages', 
    path: 'bundle/', 
    mode: 'both', 
    language: lang, 
    async:true,
    callback: function() { 
      $("#msg_bot").text( $.i18n.prop('msg_bot')); 
      $("#msg_tagline").text($.i18n.prop('msg_tagline')); 
      $("#msg_lang").text($.i18n.prop('msg_lang', lang)); 
      $("#developedBy").text($.i18n.prop('msg_developedby')); 
      $("#ownedBy").text($.i18n.prop('msg_ownedby')); 
      $("#btn-chat").text($.i18n.prop('msg_send'));
      $("#faqsHeading").text($.i18n.prop('msg_faqs'));
      $("#btn-input").attr("placeholder",$.i18n.prop('msg_chatbox_placeholder'));
      showFAQs(lang);
      readAll(lang);
    }
  });
}
/* Utility functions starts*/
  function dateUtility(){
    now = moment().format('DD/MM/YYYY h:mm:ss A');
  }

  function showChat(){
    // if(messages.length <2){
      // $('#logo').css('width','10%');
      // $('#logo').css('margin-left','31.5%');
      // $('#logo').css('position','fixed');
      // $('#logo').css('top','40px');
    $('.chat').append(messages[messages.length-1]);
    var elem = $('.panel-body');
    elem.scrollTop(elem.prop("scrollHeight"));
  }
  

  function displayTitle(title){
    $('#showChartTitle').html('<p id ="chartTitle">'+title+'</p>');
    $('#chartTitle').css({"padding-top":"16px", "text-align":"center","font-size":"23px", "color":"white"});
  }

  function BIBotMessage(classForChart) {
    var glyph_image = "";
    var glyphImageSpan = "";
    if(classForChart === 'chart_iFrame'){
      botMessage="Please visit the link by clicking on the icon";
      glyph_image = "glyphicon-link";
      // glyphImageSpan = '<span class="glyphicon '+glyph_image+'" style="padding-left : 10px; font-size:16px; color:#fd952bfc;font-weight: bolder;"></span>'
      //   +'<span class="glyphicon glyphicon-menu-right" style="padding-left : 0px;font-size:16px; color:#fd952bfc";font-weight: bolder;></span>';
    } else if(classForChart === 'empty'){
      botMessage="Currently we do not have the data for your query";
    } else{
      botMessage="Please see the trend by clicking on the icon";
      glyph_image = "glyphicon-stats";
      glyphImageSpan = '<span class="glyphicon '+glyph_image+'" style="padding-left : 5px;"></span>'
    }
      // var thumbsupdown = '<p class="thumbs-emojis"><i class="fas fa-thumbs-up select-thumbsup" id="thumbsup'+numOfCharts+'" data-rating="like"></i>'
      // +'<i class="fas fa-thumbs-down select-thumbsdown" id="thumbsdown'+numOfCharts+'" data-rating="dislike"></i></p>';
      var displayRes = '<li class="left clearfix"><span class="chat-img pull-left">'
          +'<img src="./images/boticon2.png" alt="BI Avatar" class="imgsize img-circle"></span>'
          +'<div class="chat-body clearfix"><div class="header" id="procHeader" style="margin-left:-8px;">'
          +'<strong class="primary-font colr">'+botName+'</strong>'
          +'<small class="text-muted"><span class="glyphicon glyphicon-time"></span>'+now+'</small>'
          +'</div><p>'+botMessage
          + '<a class="'+classForChart+'" id="chart'+numOfCharts+'">'
          +'<span class="glyphicon '+glyph_image+'" style="padding-left : 5px; color: lime; font-size:18px"></span></a>'
          //+'</p>'+thumbsupdown+'</div>'
          +'</li>';
      messages.push(displayRes);
      showChat();
  }
  /* Utility functions ends*/
  
  // function captureThumbsClick(){
  //   $(document).on('click','.thumbs-emojis>i.fa-thumbs-up, .thumbs-emojis>i.fa-thumbs-down ',
  //   function(e){
  //     var id = $(this).attr('id');
  //     $('#'+id).addClass('clicked');
  //     if($('#'+id).data("rating") === 'like'){
  //       // $('.thumbs-emojis>i.fa-thumbs-down').css('color','white');
  //       // $('.thumbs-emojis>i.fa-thumbs-down').removeClass('clicked');
        
  //       $('.thumbs-emojis>i.fa-thumbs-up#'+id).siblings('i.fas').css('color','white');
  //       $('.thumbs-emojis>i.fa-thumbs-up#'+id).siblings('i.fas').removeClass('clicked');

  //       $('.thumbs-emojis>i.fa-thumbs-up#'+id).css('color','green');
  //       $('.thumbs-emojis>i.fa-thumbs-up#'+id).css('font-size','22px');
  //     } else {
  //       $('.thumbs-emojis>i.fa-thumbs-down#'+id).siblings('i.fas').css('color','white');
  //       $('.thumbs-emojis>i.fa-thumbs-down#'+id).siblings('i.fas').removeClass('clicked');
  //       // $('.thumbs-emojis>i.fa-thumbs-up#'+id).css('color','white');
  //       // $('.thumbs-emojis>i.fa-thumbs-up#'+id).removeClass('clicked');
  //       // $(this).css('color','red');
  //       // $(this).css('font-size','22px');
  //       $('.thumbs-emojis>i.fa-thumbs-down#'+id).css('color','red');
  //       $('.thumbs-emojis>i.fa-thumbs-down#'+id).css('font-size','22px');
        
  //     }
      
  //     if($(this).parent().prev().find('a').attr("id") != undefined){
  //       var id = $(this).parent().prev().find('a').attr("id");
  //     } 
  //     var querystring = '';
  //     if(id == undefined || id == ''){
  //       querystring = beforeClickMessage+"&rating="+$(this).data("rating");
  //     } else{
  //       if($(this).parent().prev().text() != undefined || $(this).parent().prev().text() != ''){
  //         querystring = $('#'+id).data("query")+"&answer="+$(this).parent().prev().text()+"&rating="+$(this).data("rating");
  //       } 
  //       if($(this).parent().prev().is('table')){
  //         querystring = $('#'+id).data("query")+"&answer=table&rating="+$(this).data("rating");
  //       }
  //     }
  //     alert(' querystring :: '+querystring);
  //     $.ajax({ // create an AJAX call...
  //       data: querystring,
  //       url: url,
  //       success: function(response) {
  //         console.log('saved the response ::'+response.message);
  //       }
  //     }).complete(function(data){
  //       $('.thumbs-emojis>i.fa-thumbs-down').removeClass('clicked');
  //       $('.thumbs-emojis>i.fa-thumbs-up').removeClass('clicked');
  //     });
  //     newEntry();
  //   });
    
  // }

  function sendMessage(message) { 
    var count=0;
    
    console.log(messages);
    var api_key ='';
    //if(languageSel!='undefined' && languageSel!=''){
      api_key="&api_key=lgxLQoXU94&language="+languageSel;
    // }else{
    //   api_key="&api_key=rZDlLwfpW1&language=";
    // }
    var msgSerialized="form="+message;
    var msg=msgSerialized+api_key;
    console.log(msg);
    newEntry();
    count=count+1;
    queryToBotByUser = message;
    $.ajax({ // create an AJAX call...
      data: msg,
      type: 'GET',
      url: url,
      success: function(response) { 
        if(response.chart===true){
          queryToBotByUser = message;
          beforeClickMessage = msg;
          numOfCharts = numOfCharts + 1;
        }
        botResponse(response);
      },
      error: function(err){
        console.log('Error in calling api');
      }

    });

    doNotAllowGreetings();
    if(queryToBotByUser!= undefined && queryToBotByUser!=''){
      addToSuggestionsData();
    }
    return false;
  }

  function doNotAllowGreetings(){
    for(var wordIndex = 0; wordIndex < greetings.length; wordIndex++){
      if(queryToBotByUser.search(greetings[wordIndex]) != -1){
        queryToBotByUser='';
        break;
      }
    }
  }
  function addToSuggestionsData(){
    var yes;
    //var queryToChatbot = $('#btn-input').val(); --take from chatbot.js when the response from ajax comes
    if($.inArray(queryToBotByUser, faqsAr)<0){
      yes = lastRecordKeyAndAdd(queryToBotByUser);
      faqsAr.push(queryToBotByUser);
      if(yes){
        queryToBotByUser = "";
      }
    }
    
    // for(var i =0;i<allFaqs.length;i++){
    //   if(allFaqs[0].faq === queryToBotByUser){
    //     queryToBotByUser = '';
    //     break;
    //   }
    // }
    
    // if(queryToBotByUser !== ''){
    //   var newFaq = { "faq" : queryToBotByUser};
    //   allFaqs.push(newFaq);
    //   yes = lastRecordKeyAndAdd(queryToBotByUser);
    //   if(yes){
    //     queryToBotByUser = "";
    //   }
    // }
}
  function botResponse(response){
    //var dataFromInputBox = $('#btn-input').raw;
    console.log(response); 
    console.log(response.chart);
    var chartType=response.Chart_Type;
    var chartF=response.speech.length !== undefined && response.speech.length > 0 ? response.speech : "DATAISEMPTY"
    var chartTitle=response.chart_display;
    var kpi=response.kpi;
    console.log(chartF);
    $("#datainfo").empty();
    $("#datainfo").append('<i>Data refreshed as of 9/16/2018</i>');
    //alert(responseText);
    //newEntry(responseText); 
    if(response.chart===true){
      console.log("chart required");
      if(chartF === "DATAISEMPTY"){
        chartType = '';
        BIBotMessage("empty");
      }
      else if(chartType ==="iFrame"){
        BIBotMessage("chart_iFrame");
        $("#chart"+numOfCharts).data("frameSrc",chartF);
        $("#chart"+numOfCharts).data("frameWidth",1000);
        $("#chart"+numOfCharts).data("frameHeight",1000);
        $("#chart"+numOfCharts).data("target","#myModal");
        $("#chart"+numOfCharts).data("toggle","modal");
        $("#chart"+numOfCharts).data("type","iFrame");
        $("#chart"+numOfCharts).trigger('click');
      }
      else if(chartType ==="bar_line"){
        if(chartTitle!=null){
            BIBotMessage("chart_bar");
            $("#chart"+numOfCharts).data("bardata",chartF);
            $("#chart"+numOfCharts).data("bartitle",chartTitle);
            $("#chart"+numOfCharts).data("type","bar");
            $("#chart"+numOfCharts).trigger('click');
        }   
      }
      else if(chartType==="donut"){
        if(chartTitle!=null){
          BIBotMessage("chart_donut");
          $("#chart"+numOfCharts).data("donutdata",chartF);
          $("#chart"+numOfCharts).data("donuttitle",chartTitle);
          $("#chart"+numOfCharts).data("type","donut"); 
          $("#chart"+numOfCharts).trigger('click');
      }
    }
    else if(chartType==="heatmap"){
      if(chartTitle!=null){
        BIBotMessage("chart_heatmap");
        $("#chart"+numOfCharts).data("heatmapdata",chartF);
        $("#chart"+numOfCharts).data("heatmaptitle",chartTitle);
        $("#chart"+numOfCharts).data("type","heatmap");
        $("#chart"+numOfCharts).trigger('click');   
      }
    }
    else if(chartType==="table"){
      if(chartTitle!=null){
        BIBotMessage("chart_table");
        $("#chart"+numOfCharts).data("tabledata",chartF);
        $("#chart"+numOfCharts).data("tabletitle",chartTitle);
        $("#chart"+numOfCharts).data("type","table");
        $("#chart"+numOfCharts).trigger('click'); 
      }
    }
    else if(chartType==="groupedBarTrendChart") {
        if(chartTitle!=null){
          BIBotMessage("chart_groupedbar");
          $("#chart"+numOfCharts).data("groupedbardata",chartF);
          $("#chart"+numOfCharts).data("groupedbartitle",chartTitle);
          $("#chart"+numOfCharts).data("type","groupedbar");
          $("#chart"+numOfCharts).trigger('click'); 

      }
    }
    else if(chartType==="stackedbar") {
        if(chartTitle!=null){
          BIBotMessage("chart_stbar");
          $("#chart"+numOfCharts).data("stbardata",chartF);
          $("#chart"+numOfCharts).data("stbartitle",chartTitle);
          $("#chart"+numOfCharts).data("type","stackedbar");
          $("#chart"+numOfCharts).trigger('click'); 

        }
    }
    else{
      if(chartTitle!=null){
          BIBotMessage("chart_kpi");
          //$(".chart_kpi").data("query", beforeClickMessage);
          // $(".chart_kpi").data("kpidata",chartF);
          // $(".chart_kpi").data("kpititle",chartTitle);
          // $(".chart_kpi").data("kpival",kpi);
          // $(".chart_kpi").data("type","kpi");
          // $('.chart_kpi').trigger('click'); 
          $("#chart"+numOfCharts).data("kpidata",chartF);
          $("#chart"+numOfCharts).data("kpititle",chartTitle);
          $("#chart"+numOfCharts).data("kpival",kpi);
          $("#chart"+numOfCharts).data("type","kpi");
          $("#chart"+numOfCharts).trigger('click'); 
      }
    }
  }
    else if(response.chart===false){
      botMessage=response.speech;
      console.log(botMessage);
      var messageItem = '';
      // var thumbsupdown = '<p class="thumbs-emojis"><i class="fas fa-thumbs-up select-thumbsup" id="thumbsup'+numOfCharts+'" data-rating="like"></i>'
      // +'<i class="fas fa-thumbs-down select-thumbsdown" id="thumbsdown'+numOfCharts+'" data-rating="dislike"></i></p>';
      if(botMessage.includes('table')){
        messageItem = '<li class="left clearfix"><span class="chat-img pull-left">'
        +'<img src="./images/boticon2.png" alt="BI Avatar" class="imgsize img-circle"></span>'
        +'<div class="chat-body clearfix"><div class="header" style="margin-left:-8px;">'
        +'<strong class="primary-font colr">'+botName+'</strong>'
        +'<small class="text-muted"><span class="glyphicon glyphicon-time"></span>'+now+'</small>'
        +'</div><div class="input-group">'+botMessage+'</div>'
        //+thumbsupdown
        +'</div></li>';
      } else {
        messageItem = '<li class="left clearfix"><span class="chat-img pull-left">'
        +'<img src="./images/boticon2.png" alt="BI Avatar" class="imgsize img-circle"></span>'
        +'<div class="chat-body clearfix"><div class="header" style="margin-left:-8px;">'
        +'<strong class="primary-font colr">'+botName+'</strong>'
        +'<small class="text-muted"><span class="glyphicon glyphicon-time"></span>'+now+'</small>'
        +'</div><p>'+botMessage+'</p>'
        //+thumbsupdown
        +'</div></li>';
      }
      
  // var completeMessage = messageItem + thumbsupdown;
      messages.push(messageItem);
      showChat();
      if(botMessage.includes('table'))
        alignNumericData();
    }
  }
 
  function newEntry() {
      var messageItem = '';
      if ($("#btn-input").val() != "") {
        lastUserMessage = $("#btn-input").val();
        $("#btn-input").val("");
        messageItem = '<li class= \"right clearfix\" id=\"li'+(messages.length+1)+'\"><span class=\"chat-img pull-right\">' 
        +'<img src=\"./images/me.png" alt="User Avatar" class="img-circle" /></span>'
        +'<div class="chat-body clearfix"><div class="header">'
        +'<strong class="pull-right primary-font colr">'+user+'</strong>'
        +'<small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>'+now+'</small>'
        +'</div>'
        +'<p class="pull-right">'+lastUserMessage+'</p></div></li>';
      // if($('.thumbs-emojis>i.fa-thumbs-up').hasClass('clicked')){
      //   var thumbsUp = '<i class="fas fa-thumbs-up user-resp-thumbsup" data-rating="like"></i>';
      //   messageItem = '<li class= \"right clearfix\" id=\"li'+(messages.length+1)+'\"><span class=\"chat-img pull-right\">' 
      //   +'<img src=\"./images/me.png" alt="User Avatar" class="img-circle" /></span>'
      //   +'<div class="chat-body clearfix"><div class="header">'
      //   +'<strong class="pull-right primary-font colr">'+user+'</strong>'
      //   +'<small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>'+now+'</small>'        +'</div>'
      //   +'<p class="pull-right">'+thumbsUp+'</p></div></li>';
      // }
      // if($('.thumbs-emojis>i.fa-thumbs-down').hasClass('clicked')){
      //   var thumbsDown = '<i class="fas fa-thumbs-down user-resp-thumbsdown" data-rating="dislike"></i>';
      //   messageItem = '<li class= \"right clearfix\" id=\"li'+(messages.length+1)+'\"><span class=\"chat-img pull-right\">' 
      //   +'<img src=\"./images/me.png" alt="User Avatar" class="img-circle" /></span>'
      //   +'<div class="chat-body clearfix"><div class="header">'
      //   +'<strong class="pull-right primary-font colr">'+user+'</strong>'
      //   +'<small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>'+now+'</small>'
      //   +'</div>'
      //   +'<p class="pull-right">'+thumbsDown+'</p></div></li>';
      // }
        messages.push(messageItem);
        showChat();
      }
  }
  
  function alignNumericData(){
    $('table.dataframe tr>td').each(function(){
        if( /^[/\d/,*$?.?]+$/.test($(this).text())){
          var idx = $(this).index();
          $('tr').each(function(){ $(this).children('td:eq('+idx+')').addClass('number');})
        } 
    });
  }
function showModalOnClickIconManually(querystring){
  $.ajax({ // create an AJAX call...
    data: querystring,
    type: $(this).attr('GET'),
    url: url,
    success: function(response) { 
        var chartType=response.Chart_Type;
        var chartF=response.speech;
        var chartTitle=response.chart_display;
        var kpi=response.kpi;
        
        console.log(chartF);
        if(chartType ==="iFrame"){
          displayIFrame(chartF, 1000,$(this).data("frameHeight"));
        }
        else if(chartType ==="bar_line"){
            if(chartTitle!=null){
                displayTitle(chartTitle);
                drawBarChart(chartF);
            }   
          }
          else if(chartType==="donut"){
            if(chartTitle!=null){
              displayTitle(chartTitle);
              drawDonutChart(chartF);              
          }
        }
        else if(chartType==="heatmap"){
          if(chartTitle!=null){
            displayTitle(chartTitle);
            drawHeatMap(chartF);       
          }
        }
        else if(chartType==="table"){
          if(chartTitle!=null){
            displayTitle(chartTitle);
            drawTable(chartF);
          }
        }
        else if(chartType==="groupedBarTrendChart") {
            if(chartTitle!=null){
              displayTitle(chartTitle);
              drawGBarTrendChart(chartF);       
          }
        }
        else if(chartType==="stackedbar") {
            if(chartTitle!=null){
              displayTitle(chartTitle);
              drawStackedBarChart(chartF);       
            }
        }
        else{
          if(chartTitle!=null){
            displayTitle(chartTitle);
            drawChart(chartF, kpi);       
          }
        }
        $('#myModal').css('display','block');
        $('#myModal').css('padding', '50px');
        $('.input-group').css('z-index','0');
   
  }}); 
}

function displayIFrame(data, width, height){
  var frame = '<div class="embed-responsive embed-responsive-16by9">'
  +'<iframe class="embed-responsive-item" frameborder="0" src="'+data+'" width="100%"'
  +' height="76%"></iframe></div>';
  var chatHolder = $('#chatOutputPlaceHolder');
  chatHolder.empty();
  chatHolder.append(frame);
}

$(document).on('click', 'a[id^="chart"]', function(event){

  // put if else here as well
  var id = $(this).attr("id");
  if($('#'+id).data("query")!==undefined && $('#'+id).data("query")!==''){
    isLoaderForCharts = true;
    showModalOnClickIconManually($(this).data("query"));
  } else{
      //table data
      if($(this).data("type")=="table"){
        displayTitle($(this).data("tabletitle"));
        drawTable($(this).data("tabledata"));
        $("#chart"+numOfCharts).data("query", beforeClickMessage);
      }
      else if($(this).data("type")==="iFrame"){
        displayIFrame($(this).data("frameSrc"));
        $("#chart"+numOfCharts).data("query", beforeClickMessage);
      } 
      //donut Chart  
      else if($(this).data("type")=="donut"){
        displayTitle($(this).data("donuttitle"));
        drawDonutChart($(this).data("donutdata"));
        $("#chart"+numOfCharts).data("query", beforeClickMessage);
      }
      //bar chart
      else if($(this).data("type")=="bar"){
        displayTitle($(this).data("bartitle"));
        drawBarChart($(this).data("bardata"));
        $("#chart"+numOfCharts).data("query", beforeClickMessage);
      }
      //stacked bar chart
      else if($(this).data("type")=="stackedbar"){
        displayTitle($(this).data("stbartitle"));
        drawStackedBarChart($(this).data("stbardata"));
        $("#chart"+numOfCharts).data("query", beforeClickMessage);
      }
      //grouped bar
      else if($(this).data("type")=="groupedbar"){
        displayTitle($(this).data("groupedbartitle"));
        drawGBarTrendChart(chartF);
        $("#chart"+numOfCharts).data("query", beforeClickMessage);
      }
      //heatmap
      else if($(this).data("type")=="heatmap"){
        displayTitle($(this).data("heatmaptitle"));
        drawHeatMap(chartF);
        $("#chart"+numOfCharts).data("query", beforeClickMessage);
      }
      //kpi chart
      else {
        displayTitle($(this).data("kpititle"));
        drawChart($(this).data("kpidata"),$(this).data("kpival"));
        $("#chart"+numOfCharts).data("query", beforeClickMessage);
      }
      $('#myModal').css('display','block');
      $('#myModal').css('padding', '50px');
      $('.input-group').css('z-index','0');
    }
});

$(document).on('click','.close',function() { 
  var modal = $('#myModal');
  modal.css('display','none');
  $('.input-group').css('z-index','1');
});

//Draw table
function drawTable(data){
  $("#chartArea").empty();
  d3.select('#chartArea center').style('float','none');
  $("#chartArea").append("<div id='page-wrap'></div>");
  // botMessage="Please see the table on the right :";
  // messages.push("<b>" + botName + ":</b><br> " + botMessage);
  // showChat();
  
  d3.select('#chartArea').style('padding','0px 5px 0px 5px');
  d3.select('#chartArea').style('overflow-y','auto');
  var sortAscending = true;
  var table = d3.select('#page-wrap').append('table');
  var titles = d3.keys(data[0]);
  console.log(titles);
  var headers = table.append('thead').append('tr')
                         .selectAll('th')
                         .data(titles).enter()
                         .append('th')
                         .text(function (d) {
                              return d;
                          })
                         .on('click', function (d) {
                             headers.attr('class', 'header');
                             
                             if (sortAscending) {
                               rows.sort(function(a, b) { return b[d] < a[d]; });
                               sortAscending = false;
                               this.className = 'aes';
                             } else {
                               rows.sort(function(a, b) { return b[d] > a[d]; });
                               sortAscending = true;
                               this.className = 'des';
                             }
                             
                         });    

  var rows = table.append('tbody').selectAll('tr')
                     .data(data).enter()
                     .append('tr');

      rows.selectAll('td')
          .data(function (d) {
              return titles.map(function (k) {
                  return { 'value': d[k], 'name': k};
              });
          }).enter()
          .append('td')
          .attr('data-th', function (d) {
              return d.name;
          })
          .text(function (d) {
              return d.value;
          }).attr('class', function(d) {
            return /^[0-9,.]*$/.test(d.value) ? 'integer' : null;
          });                      
}


function drawDonutChart(data){
  $("#chartArea center").empty();
 d3.select('#chartArea center').style('height','100%');
 d3.select('#chartArea center').style('float','left');
 $("#datainfo").empty();
 $("#datainfo").append('<i>Data refreshed as of 7/12/2018</i>');
 $("#chartArea center").append("<div id='donut-charts'></div>");  
var donutData = genData(data);
console.log(donutData);
var donuts = new DonutCharts();
donuts.create(donutData);
console.log("donutchart");

function DonutCharts(){

      var charts = d3.select('#donut-charts');

      var chart_m,
          chart_r,
          color = d3.scale.category20();

      var getCatNames = function(dataset) {
          var catNames = new Array();

          for (var i = 0; i < dataset[0].data.length; i++) {
              catNames.push(dataset[0].data[i].cat);
          }

          return catNames;
      }

      var wordwrap = function(text) {
        if(text !== '' && text !== undefined && text!=null){

            var lines = [];
            var pos = text.trim().lastIndexOf(' ');
            var veryfirstPart = text.substring(0, pos);            
            if(veryfirstPart.length > 16){
              var pos = veryfirstPart.lastIndexOf( ' ', veryfirstPart.trim().lastIndexOf( ' ' ) + 1 );
              var firstPart = veryfirstPart.substring( 0, pos );
              var secondPart = veryfirstPart.substring( pos + 1 );
              lines[0] = firstPart;
              //lines[1]= secondPart;
              var thirdPart = text.substring(pos);
              lines[1] = thirdPart;
            } else{
              var secondPart = text.substring(pos);
              lines[0] = veryfirstPart;
              lines[1] = secondPart; 
            }
            return lines;
        }
      }
      var format = d3.format(",.2f"); 
      var categories = getCatNames(donutData);
      var position = function(d, i){
        var c = 4;
        var r = Math.ceil(categories.length / c);
        var h = 35;  // height of each entry
        var w = 160; // width of each entry (so you can position the next column)
        var tx = 20; // tx/ty are essentially margin values
        var ty = 15;
        var x = Math.floor(i / r) * w + tx;
        var y = i % r * h + ty;
        return "translate(" + x + "," + y + ")";
      }

      var createLegend = function(catNames) {
          var length = 0;
          var cols = 4;
          var recsPerCol = (catNames.length)/cols;
          var legends=''; 
                          
          if(catNames.length <= cols){
              legends = charts.select('.legend') 
                .selectAll('g')
                .data(catNames)
                .enter()
                .append('g')
                .attr('transform', function(d, i) {
                            return 'translate(10,' + (i * 30 + 10) + ')';
                });
            }else{
              legends = charts.select('.legend')
              .selectAll('g')
              .data(catNames)
              .enter()
              .append('g')
              .attr('transform', position);  
            }  
          legends.append('circle')
              .attr('class', 'legend-icon')
              .attr('r', 6)
              .style('fill', function(d, i) {
                  return color(i);
              });
  
          legends.append('text')
              .attr('dx', '1em')
              .attr('dy', '.3em')
              .attr('fill','white')
              .each(function (d, i) {
                if(d.length > 16){
                  var lines = wordwrap(d);
                  for (var i = 0; i < lines.length; i++) {
                    d3.select(this).append("tspan")
                        .attr("dy",function(d){
                            if(i == 0){
                              return 2;
                            } else{
                              return 13;
                            } 
                        })
                        .attr("x",function(d) { 
                          if(i == 0){
                            return d.children1 || d._children1 ? -1 : 1
                          } else{
                            return d.children1 || d._children1 ? -10 : 10
                          }
                        }).text(lines[i]);
                    }
                  }
                  else{
                    d3.select(this)
                      .text(function(d) {
                            return d;
                        });
                  }
                })
              
              
              // .text(function(d) {
              //     return d;
              // })
            //.call(wrap,14);
      }

      var createCenter = function(pie) {

          var eventObj = {
              'mouseover': function(d, i) {
                  d3.select(this)
                      .transition()
                      .attr("r", chart_r * 0.65);
              },

              'mouseout': function(d, i) {
                  d3.select(this)
                      .transition()
                      .duration(500)
                      .ease('bounce')
                      .attr("r", chart_r * 0.6);
                  resetAllCenterText();
              },
              'click': function(d, i) {
                  var paths = charts.selectAll('.clicked');
                  pathAnim(paths, 0);
                  paths.classed('clicked', false);
                  //resetAllCenterText();
              }
          }

          var donuts = d3.selectAll('.donut');

          // The circle displaying total data.
          donuts.append("svg:circle")
              .attr("r", chart_r * 0.6)
              .style("fill", "#E7E7E7")
              .on(eventObj);
  
          donuts.append('text')
                  .attr('class', 'center-txt type')
                  .attr('y', chart_r * -0.16)
                  .attr('text-anchor', 'middle')
                  .style('font-weight', 'bold')
                  .attr('font-size', '1.3em')
                  .text(function(d, i) {
                      console.log(d);
                      return d.type;
                  });

          donuts.append('text')
                  .attr('class', 'center-txt valtext')
                  .attr('text-anchor', 'middle')
                  .attr('font-size', '1.3em');

          donuts.append('text')
                  .attr('class', 'center-txt value')
                  .attr('y', chart_r * 0.16)
                  .attr('text-anchor', 'middle')
                  .attr('font-size', '1.3em');
          
          donuts.append('text')
                  .attr('class', 'center-txt percentage')
                  .attr('y', chart_r * 0.32)
                  .attr('text-anchor', 'middle')
                  .style('fill', 'darkblue')
                  .style('font-weight', 'bold')
                  .attr('font-size', '2.5em')
                  .attr('y', 83);              
      }

      var setCenterText = function(thisDonut) {

          var sum = d3.sum(thisDonut.selectAll('.clicked').data(), function(d) {
              return "$"+ format(d.value).toLocaleString();
              //return d.data.val;
          });

          thisDonut.select('.value')
              .text(function(d) {
                  return (sum)? parseFloat( sum.toFixed(1) ).toLocaleString() + d.unit
                              : parseFloat( (d.total).toFixed(2) ).toLocaleString() +' '+ d.unit;

                  
              });
  //  thisDonut.select('.percentage')
  //             .text(function(d) {
  //                 return (sum)? (sum/d.total*100).toFixed(2) + '%'
  //                             : '';
  //             });

          thisDonut.select('.percentage')
              .text(function(d) {
                  //console.log(d);
                  return (sum)? (sum/d.total*100).toFixed(2) + '%'
                              : '';
              });    
      }

      var resetAllCenterText = function() {
          
        charts.selectAll('.center-txt.valtext')
              .text(' ');
        charts.selectAll('.value')
              .text(function(d) {
                return  "$"+ format(d.total).toLocaleString() +' '+ d.unit;
                //return d.total.toFixed(1) + d.unit;
            })
            .style('font-weight', 'bold')
              .attr('font-size', '1.3em')
              .attr('y', chart_r * 0.15);
          charts.selectAll('.percentage')
              .text(' ');
      }

      var pathAnim = function(path, dir) {
          switch(dir) {
              case 0:
                  path.transition()
                      .duration(500)
                      .ease('bounce')
                      .attr('d', d3.svg.arc()
                          .innerRadius(chart_r * 0.7)
                          .outerRadius(chart_r)
                      );
                  break;

              case 1:
                  path.transition()
                      .attr('d', d3.svg.arc()
                          .innerRadius(chart_r * 0.7)
                          .outerRadius(chart_r * 1.08)
                      );
                  break;
          }
      }

      var updateDonut = function() {
        console.log("update donut call");

          var eventObj = {

              'mouseover': function(d, i, j) {
                  
                format(d);
                pathAnim(d3.select(this), 1);

                  var thisDonut = charts.select('.type' + j);
                  thisDonut.select('.valtext').text(function(donut_d) {
                      //console.log(donut_d);
                      
                      return d.data.cat;
                  });
                  thisDonut.select('.value').text(function(donut_d) {
                      //console.log(donut_d);
                      format(d.value);
                      return  "$"+ format(d.value).toLocaleString() + ' ' +donut_d.unit;
                  });
                      //return  parseFloat( d.data.val.toFixed(2) ).toLocaleString() + ' ' +donut_d.unit;
                      //});
                  thisDonut.select('.percentage').text(function(donut_d) {
                      return (d.data.val/donut_d.total*100).toFixed(2) + '%';
                  });
              },
              
              'mouseout': function(d, i, j) {
                  var thisPath = d3.select(this);
                  if (!thisPath.classed('clicked')) {
                      pathAnim(thisPath, 0);
                  }
                  var thisDonut = charts.select('.type' + j);
                  //setCenterText(thisDonut);
                  resetAllCenterText();
                },

              'click': function(d, i, j) {
                  var thisDonut = charts.select('.type' + j);
                  console.log("cliecked");

                  if (0 === thisDonut.selectAll('.clicked')[0].length) {
                      thisDonut.select('circle').on('click')();
                  }

                  var thisPath = d3.select(this);
                  var clicked = thisPath.classed('clicked');
                  pathAnim(thisPath, ~~(!clicked));
                  thisPath.classed('clicked', !clicked);

                  setCenterText(thisDonut);
              }
          };
          d3.select('#chartArea').style('overflow','hidden');
          //d3.select('#donut-charts').style('padding-left','140px');

          var pie = d3.layout.pie()
                          .sort(null)
                          .value(function(d) {
                              return d.val;
                          });

          var arc = d3.svg.arc()
                          .innerRadius(chart_r * 0.7)
                          .outerRadius(function() {
                              return (d3.select(this).classed('clicked'))? chart_r * 1.08
                                                                         : chart_r;
                          });

          // Start joining data with paths
          var paths = charts.selectAll('.donut')
                          .selectAll('path')
                          .data(function(d, i) {
                              return pie(d.data);
                          });

          paths
              .transition()
              .duration(1000)
              .attr('d', arc);

          paths.enter()
              .append('svg:path')
                  .attr('d', arc)
                  .style('fill', function(d, i) {
                      return color(i);
                  })
                  .style('stroke', '#FFFFFF')
                  .on(eventObj)

          paths.exit().remove();

          resetAllCenterText();
      }

      this.create = function(dataset) {
          var $charts = $('#donut-charts');
          chart_m = $charts.innerWidth() / dataset.length / 2 * 0.14;
          chart_r = $charts.innerWidth() / dataset.length / 2 * 0.85;
          console.log("create call 1");
          $('#donut-charts').css({"padding-left":"95px","padding-top":"0px"});

          

          var donut = charts.selectAll('.donut')
                          .data(dataset)
                      .enter().append('svg:svg')
                          .attr('width', (chart_r + chart_m) * 2)
                          .attr('height', (chart_r + chart_m) * 2)
                      .append('svg:g')
                          .attr('class', function(d, i) {
                              return 'donut type' + i;
                          })
                          .attr('transform', 'translate(' + (chart_r+chart_m) + ',' + (chart_r+chart_m) + ')');
          charts.append('svg')
              .attr('class', 'legend')
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('transform', 'translate(-40, 30)');
          $('.legend').css({"width":"720px"});
          $('.legend').css({"margin":"-429px 0 1000px 558px"});
          //$('#chartArea').css({"padding-top":"14px"});
          
          createCenter();
          updateDonut();
          createLegend(getCatNames(dataset));
      }
  
      this.update = function(dataset) {
          // Assume no new categ of data enter
          var donut = charts.selectAll(".donut")
                      .data(dataset);
                      console.log("update call");

          updateDonut();
      }

  }



}  

function genData(data_v) {
  console.log(data_v);
  
  //var cat = ['Google Drive', 'Dropbox', 'iCloud', 'OneDrive', 'Box'];

  var dataset = new Array();
  var data_key=[];
  for ( var key in data_v[0] ) {
    data_key.push(key);
  } 
  console.log(data_key);
   var key1=data_key[0];  //{x,y,z} <- dtKeyMap
   var key2=data_key[2];
   var type =data_key[1];
   var unit;
   if(key2==="Transfers Out"){
   unit = "";   
   }
   else unit= "Mn";
   
   var keys=Object.keys(data_v);
  console.log(data_v[0][data_key[2]]);
 
  var total = 0;
  var data=new Array();

      for (var j = 0; j < data_v.length; j++) {
         var value = +data_v[j][data_key[1]];
         //var value = + data_v[j][dtKeyMap.get(2)];
          total += value;
          data.push({
              "cat": data_v[j][data_key[0]],
              "val": value
          });
      }

      dataset.push({
          "type": type,
          "unit": unit,
          "data": data,
          "total": total
      });
  
  console.log(dataset);
  return dataset;

}

function drawBarChart(data){
  $("#chartArea center").empty();
  d3.select('#chartArea center').style('float','none');
  $("#chartArea center").append('<svg></svg>');
  // botMessage="Please see the trend on the right :";
  // messages.push("<b>" + botName + ":</b><br> " + botMessage);
  d3.selectAll("svg > *").remove();
  //showChat();
  var svgWidth = 500, svgHeight = 330;

  var svg = d3.select("svg")
              .attr("width",svgWidth)
              .attr("height",svgHeight),
      margin = {top: 20, right: 10, bottom: 70, left:100},
      width =  svgWidth - margin.left - margin.right,
      height = svgHeight - margin.top - margin.bottom;
  d3.select('svg').style('margin-top','20px');
  d3.select('#chartArea').style('padding-left','20px');    

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2);

  var y = d3.scale.linear()
    .rangeRound([height, 0]); 
  
  var y2 = d3.scale.linear()
            .range([height, 0]);
  //var x = d3.scaleBand().rangeRound([0, width]).padding(2),
  //    y = d3.scaleLinear().rangeRound([height, 0]);

  
  var g = svg.append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var color = d3.scale.ordinal()
                      .range(["#ff3d3d", "#ffcc00", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

  var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .tickFormat(d3.format(".2s"));
                    
  var y2Axis = d3.svg.axis()
                 .scale(y2)
                 .orient("right")

                 ;
                   

  var active_link = "0"; //to control legend selections and hover
  var legendClicked; //to control legend selections
  var legendClassArray = []; //store legend classes to select bars in plotSingle()
  var y_orig; //to store original y-posn  
  var dataset = new Array();
  var data_key=[];
  
  for ( var key in data[0] ) {
          data_key.push(key);
        } 
  console.log(data_key);
  
  color.domain(d3.keys(data[0]).filter(function(key) { return (key !== data_key[0] && key!==data_key[1] && key!==data_key[4]); }));  
  
  data.forEach(function(d) {
          //var myDate = d.Time_Period; //add to stock code
          var myDate = d[data_key[0]];
          var y0 = 0;
          //d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
          d.callName = color.domain().map(function(name) { return {myDate:myDate, name: name, y0: y0, y1: y0 += +d[name]}; });
          d.totalCalls = d.callName[d.callName.length - 1].y1;

        });  
  console.log(data);
  
 var valueline = d3.svg.line()
            .x(function(d){
            return x(d[data_key[0]]);
              })
            .y(function(d){
                return y2(d[data_key[1]]);
                });

     console.log(valueline);       
  //data.sort(function(a, b) { return b.totalCalls - a.totalCalls; });    

  x.domain(data.map(function(d) { return d[data_key[0]]; }));
  y.domain([0, d3.max(data, function(d) { return d.totalCalls; })]); 
  y2.domain([0, (d3.max(data, function(d) { return d[data_key[1]]; }))+10]);   

  //append the svg path


  
  svg.append("g")
      .attr("class", "x axis")
      .attr("class","axisWhite")
      .attr("transform", "translate(45," + height + ")")
      .call(xAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

  svg.append("g")
      .attr("class", "y axis")
      .attr("class","axisWhite")
      .attr("transform", "translate(45,"+ 0 + ")")
      .call(yAxis)             
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("fill","white")
      .attr("x",0 - 6)
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Calls ");
     

  svg.append("g")
      .attr("class", "y axis")
      .attr("class","axisWhite")
      .attr("transform", "translate(" + (width +45)+ ",0)")
      .call(y2Axis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("fill","white")
      .attr("y", 30)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Def Rate (%)");   

    
  
  
  var state = svg.selectAll(".Time_Period")
                 .data(data)
                 .enter().append("g")
                 .attr("class", "g")
                 .attr("transform", function(d) { return "translate(" + "45" + ",0)"; });  
                 console.log(state);                         

      state.selectAll("rect")
           .data(function(d) {
              return d.callName; 
            })
           .enter().append("rect")
           .attr("width", x.rangeBand())
           .attr("y", function(d) { return y(d.y1); })
           .attr("x",function(d) { //add to stock code
               return x(d.myDate)
             })
           .attr("height", function(d) { return y(d.y0) - y(d.y1); })
           .attr("class", function(d) {
             classLabel = d.name.replace(/\s/g, ''); //remove spaces
              return "class" + classLabel;
           })
           .style("fill", function(d) { return color(d.name); });


  state.selectAll("rect")
       .on("mouseover", function(d){

          var delta = d.y1 - d.y0;
          var xPos = parseFloat(d3.select(this).attr("x"));
          var yPos = parseFloat(d3.select(this).attr("y"));
          var height = parseFloat(d3.select(this).attr("height"))
          d3.select(this).attr("stroke","blue").attr("stroke-width",0.8);

          svg.append("text")
          .attr("x",xPos)
          .attr("y",yPos +height/3)
          .attr("class","tooltip")
          .style("z-index","1030")
          .attr("fill","white")
          .text(d.name +": "+ delta); 
          
       })
       .on("mouseout",function(){
          svg.select(".tooltip").remove();
          d3.select(this).attr("stroke","pink").attr("stroke-width",0.2);
                                
        })
       console.log(x.rangeBand());
       var lineMargin=45 + (x.rangeBand()/2);
     var path = svg.append("path")
            .attr("d", valueline(data))
            .attr("transform","translate("+lineMargin+",0)");
      
        svg.append("g").selectAll("circle")
            .data(data)

          .enter().append("circle")
            .attr("class", "circle")
            .attr("transform","translate("+lineMargin+",0)")
            .attr("cx", function(d) { return x(d[data_key[0]]); })
            .attr("cy", function(d) { return y2(d[data_key[1]]); })
            .attr("r", 4 )
          
          .on("mouseover", function(d){

                var delta = Math.round(d[data_key[1]]*100)/100;
                var xPos = parseFloat(d3.select(this).attr("cx"));
                var yPos = parseFloat(d3.select(this).attr("cy"));
                //console.log(d3.select(this).attr("cx"));
                //console.log(yPos);
                //var height = parseFloat(d3.select(this).attr("height"))

                d3.select(this).attr("stroke","blue").attr("stroke-width",0.8);

                svg.append("text")
                .attr("x",xPos+80)
                .attr("y",yPos-10)
                .attr("class","tooltip")
                .attr("fill","white")
                .text("Deflection Rate" +": "+ delta); 
                
             })
             .on("mouseout",function(){
                svg.select(".tooltip").remove();
                d3.select(this).attr("stroke","pink").attr("stroke-width",0.2);
                                      
              });               

     var legend = svg.selectAll(".legend")
                      .data(color.domain().slice().reverse())
                      .enter().append("g")
                      //.attr("class", "legend")
                      .attr("class", function (d) {
                        legendClassArray.push(d.replace(/\s/g, '')); //remove spaces
                        return "legend";
                      })
                      .attr("transform", function(d, i) { return "translate("+  (i*100-160) + ",316)"; });

  //reverse order to match order in which bars are stacked    
         legendClassArray = legendClassArray.reverse();  

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color)
      .attr("id", function (d, i) {
        return "id" + d.replace(/\s/g, '');
      })
      .on("mouseover",function(){        

        if (active_link === "0") d3.select(this).style("cursor", "pointer");
        else {
          if (active_link.split("class").pop() === this.id.split("id").pop()) {
            d3.select(this).style("cursor", "pointer");
          } else d3.select(this).style("cursor", "auto");
        }
      })
      .on("click",function(d){        

        if (active_link === "0") { //nothing selected, turn on this selection
          d3.select(this)           
            .style("stroke", "black")
            .style("stroke-width", 2);

            active_link = this.id.split("id").pop();
            plotSingle(this);

            //gray out the others
            for (i = 0; i < legendClassArray.length; i++) {
              if (legendClassArray[i] != active_link) {
                d3.select("#id" + legendClassArray[i])
                  .style("opacity", 0.5);
              }
            }
           
        } else { //deactivate
          if (active_link === this.id.split("id").pop()) {//active square selected; turn it OFF
            d3.select(this)           
              .style("stroke", "none");

            active_link = "0"; //reset

            //restore remaining boxes to normal opacity
            for (i = 0; i < legendClassArray.length; i++) {              
                d3.select("#id" + legendClassArray[i])
                  .style("opacity", 1);
            }

            //restore plot to original
            restorePlot(d);

          }

        } //end active_link check
                          
                                
      });

  legend.append("text")
      .attr("fill","white")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });


    function restorePlot(d) {

              state.selectAll("rect").forEach(function (d, i) {      
                //restore shifted bars to original posn
                d3.select(d[idx])
                  .transition()
                  .duration(1000)        
                  .attr("y", y_orig[i]);
              })

              //restore opacity of erased bars
              for (i = 0; i < legendClassArray.length; i++) {
                if (legendClassArray[i] != class_keep) {
                  d3.selectAll(".class" + legendClassArray[i])
                    .transition()
                    .duration(1000)
                    .delay(750)
                    .style("opacity", 1);
                }
              }

            }
            
        function plotSingle(d) {
        
    class_keep = d.id.split("id").pop();
    idx = legendClassArray.indexOf(class_keep);    
   
    //erase all but selected bars by setting opacity to 0
    for (i = 0; i < legendClassArray.length; i++) {
      if (legendClassArray[i] != class_keep) {
        d3.selectAll(".class" + legendClassArray[i])
          .transition()
          .duration(1000)          
          .style("opacity", 0);
      }
    }

    //lower the bars to start on x-axis
    y_orig = [];
    state.selectAll("rect").forEach(function (d, i) {        
    
      //get height and y posn of base bar and selected bar
      h_keep = d3.select(d[idx]).attr("height");
      y_keep = d3.select(d[idx]).attr("y");
      //store y_base in array to restore plot
      y_orig.push(y_keep);

      h_base = d3.select(d[0]).attr("height");
      y_base = d3.select(d[0]).attr("y");    

      h_shift = h_keep - h_base;
      y_new = y_base - h_shift;

      //reposition selected bars
      d3.select(d[idx])
        .transition()
        .ease("bounce")
        .duration(1000)
        .delay(750)
        .attr("y", y_new);
   
    })    
   
  } 
   
  }

  //KPI Chart
  function drawChart(data,kpi) {
  
    // var id="id='ab'";
    // //var id="ab"
    // botMessage="Please see the trend on the right :";
    $("#chartArea center").empty();  
    d3.select('#chartArea center').style('float','none');
    $("#chartArea center").append('<svg></svg>');
    // messages.push("<b>" + botName + ":</b><br> " + botMessage);
    // d3.selectAll("svg > *").remove();
    // showChat();


    var svgWidth = 450, svgHeight = 400;
    d3.select('svg').style('margin-top','40px');
    d3.select('svg').style('margin-left','-33px');

    // Add tooltip

    var tooltip = d3.select('#chartArea center')                               // NEW
    .append('div')                                                // NEW
    .attr('class', 'tooltip'); 

    tooltip.append('div')                                           // NEW
    .attr('class', 'label');                                      // NEW

    tooltip.append('div')                                           // NEW
    .attr('class', 'count');                                      // NEW


    var svg = d3.select("svg")
          .attr("width",svgWidth)
          .attr("height",svgHeight),
          margin = {top: 20, right: 20, bottom: 90, left: 50},
          width = svgWidth - margin.left - margin.right,
          height = svgHeight - margin.top - margin.bottom;
    //var x = d3.scaleBand().rangeRound([0, width]).paddingInner(2),
    var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], 1);
    //var y = d3.scaleLinear().rangeRound([height, 0]);
    var y = d3.scale.linear()
          .rangeRound([height, 0]);
    var g = svg.append("g")
          .attr("transform", "translate(" + (margin.left+40) + "," + margin.top + ")");


    var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

    var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");   

    var threshold=0;
    var count=0;
    // if(kpi==='Exposure rate'){
    //   console.log("exposure");
    //   data.forEach(function(d) {
    //         //d.Time_Period = parseTime(d.Time_Period);
    //         d.Time_Period=d.Time_Period;
    //         d.val = +d.Expose_Rate;
    //         threshold=threshold+d.Expose_Rate;
    //         count=count+1;
    //       });
    //   }
    // else if(kpi==='Deflection rate'){
    //   console.log("Deflection");

    //   data.forEach(function(d) {
    //         //d.Time_Period = parseTime(d.Time_Period);
    //         // d.Time_Period=d.Time_Period;
    //         // d.val = +d.Deflection_rate;
    //         // threshold=threshold+d.Deflection_rate;
    //         count=count+1;
    //       });
    // }
    var keyArr= new Map();
    data.forEach(function(d,i){
      var ind=1;
      if(i<1){
        var arr = $.map(Object.keys(d),function(value) {
          console.log(ind+'::'+value);
          keyArr.set(ind,value);
          ind++; 
        });
      }
    });
    data.forEach(function(d,i){
      //d[keyArr.get(1)] = parseTime(d[keyArr.get(1)]);
      d[keyArr.get(1)]=d[keyArr.get(1)];
      d.val = +d[keyArr.get(2)];
      console.log(keyArr.get(1)+' : '+d[keyArr.get(1)]+', val : '+d.val);
      count=count+1;
    });
    console.log(data);

    var avg=threshold/count;
    console.log(avg);

    var line = d3.svg.line()
    .x(function(d) { return x(d.Time_Period); })
    .y(function(d) { return y(d.val); })

    x.domain(data.map(function(d) { return d.Time_Period; }));

    y.domain([d3.min(data, function(d) { return d.val; }), d3.max(data, function(d) { return d.val; })]);
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("class","axisWhite")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");


    svg.append("text")             
        .attr("transform",
        "translate(" + (width/2 + 20) + " ," + 
                      (height+ margin.top + 90) + ")")
        .style("text-anchor", "middle")
        .text("Time Period")
        .attr("fill","white");

    // text label for the y axis
    svg.append("text")
        .attr("fill","white")
        .attr("transform", "rotate(-90)")
        .attr("y", 90)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(kpi + "(in %)"); 

    $(".axis--x path").css("display","block")
    g.append("g")
      .attr("class", "axis axis--y")
      .attr("class","axisWhite")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end");

    g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

    var refValue=data[0].val;
    //var i=0;
    //console.log(data[0].val);
    g.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("class", "circle")
      .attr("cx", function(d) { return x(d.Time_Period); })
      .attr("cy", function(d) { return y(d.val); })
      .attr("r", 4)
      .style("fill",function (d) {
              if(d.val>avg) return "green";
              else if(d.val<avg) return "red"
                else return "green";
        })
        .on('mouseover', function(d) {                            // NEW
                                                          // NEW
            //var percent = Math.round(1000 * d.data.count / total) / 10; // NEW
            tooltip.select('.label').html("Month-Year: "+ d.Time_Period);                // NEW
            tooltip.select('.count').html(kpi+": "+(Math.round(d.val*100)/100) +" %");                // NEW
            //tooltip.select('.percent').html(percent + '%');             // NEW
            tooltip.style('display', 'block')
            tooltip.style('color','white')
            // tooltip.style('border','2px solid white')
          })
            //The tooltip disappears
            .on('mouseout', function() {                              // NEW
            tooltip.style('display', 'none');                           // NEW
            });
    }
  
  
  
//Stacked Bar Chart  
  function drawStackedBarChart(data){
    $("#chartArea center").empty();  
    d3.select('#chartArea center').style('float','none');
    $("#chartArea center").append('<svg></svg>');
    // botMessage="Please see the trend on the right :";
    // messages.push("<b>" + botName + ":</b><br> " + botMessage);
    // d3.selectAll("svg > *").remove();
    // showChat();
    var svgWidth = 800, svgHeight = 400;
  
    var svg = d3.select("svg")
                .attr("width",svgWidth)
                .attr("height",svgHeight),
        margin = {top: 20, right: 10, bottom: 140, left: 100},
        width =  svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;
    d3.select('svg').style('margin-top','57px');
    d3.select('svg').style('padding-left','72px');
    d3.select('#chartArea').style('padding-left','10px'); 
    d3.select('#chartArea').style('padding-top','2px');    
  
    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .2);
  
    var y = d3.scale.linear()
      .rangeRound([height, 0]); 
    
    var y2 = d3.scale.linear()
              .range([height, 0]);
    //var x = d3.scaleBand().rangeRound([0, width]).padding(2),
    //    y = d3.scaleLinear().rangeRound([height, 0]);
  
    
    var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," +(margin.top + 100)+ ")");
  
  
    var color = d3.scale.ordinal()
                        .range(["#ff3d3d", "#ffcc00", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    var tickF = d3.format("0.2s");
    var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");
  
    var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left")
                      .tickFormat(function(d){
                        return tickF(d).replace(/G/,"B");
                      });
                      
    
  
    var active_link = "0"; //to control legend selections and hover
    var legendClicked; //to control legend selections
    var legendClassArray = []; //store legend classes to select bars in plotSingle()
    var y_orig; //to store original y-posn  
    var dataset = new Array();
    var data_key=[];
    var format = d3.format(",.0f");
        
    for ( var key in data[0] ) {
            data_key.push(key);
          } 
    //console.log(data_key);
    
    color.domain(d3.keys(data[0]).filter(function(key) { return (key !== data_key[0]); }));  
    
    data.forEach(function(d) {
            //var myDim = d.Time_Period; //add to stock code
            var myDim = d[data_key[0]];
            var y0 = 0;
            //d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
            d.callValue = color.domain().map(function(name) { return {myDim:myDim, name: name, y0: y0, y1: y0 += +d[name]}; });
            d.totalValue = d.callValue[d.callValue.length - 1].y1;
  
          });  
    console.log(data);
    
          
    //data.sort(function(a, b) { return b.totalValue - a.totalValue; });    
  
    x.domain(data.map(function(d) { return d[data_key[0]]; }));
    y.domain([0, d3.max(data, function(d) { return d.totalValue; })]); 
    
  
    //append the svg path
  
  
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("class", "axisWhite")
        .attr("transform", "translate(45," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        //.attr("transform", "rotate(135 5 2 )")
        .attr("transform", function(d) {
          return "rotate(-45 45 80)" 
          })
        .style("text-anchor", "start");
  
    svg.append("g")
        .attr("class", "y axis")
        .attr("class", "axisWhite")
        .attr("transform", "translate(45,"+ 0 + ")")
        .call(yAxis)             
        .append("text")
        .attr("transform", "translate(40,51)rotate(-90)")
        .attr("x",-96)
        .attr("y", -36)
        .attr("dy", ".71em")
        .style("text-anchor", "right")
        .text("Contracts");
       
  
  
      
    
    
    var state = svg.selectAll(".Time_Period")
                   .data(data)
                   .enter().append("g")
                   .attr("class", "g")
                   .attr("transform", function(d) { return "translate(" + "40" + ",0)"; });  
  
                   //console.log(state);                             
  
        state.selectAll("rect")
             .data(function(d) {
                                  return d.callValue; 
                                })
             .enter().append("rect")
             .attr("width", x.rangeBand())
             .attr("y", function(d) { return y(d.y1); })
             .attr("x",function(d) { //add to stock code
                 return x(d.myDim)
               })
             .attr("height", function(d) { return y(d.y0) - y(d.y1); })
             .attr("class", function(d) {
  
               classLabel1 = d.name.replace(/\s/g, ''); //remove spaces
               classLabel = classLabel1.replace(/[^\w\s]/gi, ''); //remove dots
               //console.log(classLabel1);
               //console.log(classLabel);
                return "class" + classLabel;
             })
             .style("fill", function(d) { return color(d.name); });
  
  
    state.selectAll("rect")
         .on("mouseover", function(d){
  
            var delta = d.y1 - d.y0;
            var xPos = parseFloat(d3.select(this).attr("x"));
            var yPos = parseFloat(d3.select(this).attr("y"));
            var height = parseFloat(d3.select(this).attr("height"))
            var width = parseFloat(d3.select(this).attr("width"))
  
            d3.select(this).attr("stroke","blue").attr("stroke-width",0.8);
  
            svg.append("text")
            .attr("x",0)
            .attr("y",320)
            .attr("class","tooltip")
            .attr("fill","white")
            .text(d.name +": "+ "$"+format(delta)); 
            
         })
         .on("mouseout",function(){
            svg.select(".tooltip").remove();
            d3.select(this).attr("stroke","pink").attr("stroke-width",0.2);
                                  
          })
              
  
                  
  
       var legend = svg.selectAll(".legend")
                        .data(color.domain().slice().reverse())
                        .enter().append("g")
                        //.attr("class", "legend")
                        .attr("class", function (d) {
                          label=d.replace(/\s/g, '');
                          legendClassArray.push(label.replace(/[^\w\s]/gi, '')); //remove spaces
                          return "legend";
                        })
                        .attr("transform", function(d, i) { 
                          return "translate("+  (i*100-350) + ",350)"; });
  
    //reverse order to match order in which bars are stacked    
           legendClassArray = legendClassArray.reverse();  
  
      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color)
        .attr("id", function (d, i) {
          label1=d.replace(/\s/g, '');
  
          return "id" + label1.replace(/[^\w\s]/gi, '');
        })
        .on("mouseover",function(){        
  
          if (active_link === "0") d3.select(this).style("cursor", "pointer");
          else {
            if (active_link.split("class").pop() === this.id.split("id").pop()) {
              d3.select(this).style("cursor", "pointer");
            } else d3.select(this).style("cursor", "auto");
          }
        })
        .on("click",function(d){        
  
          if (active_link === "0") { //nothing selected, turn on this selection
            d3.select(this)           
              .style("stroke", "black")
              .style("stroke-width", 2);
  
              active_link = this.id.split("id").pop();
              plotSingle(this);
  
              //gray out the others
              for (i = 0; i < legendClassArray.length; i++) {
                if (legendClassArray[i] != active_link) {
                  d3.select("#id" + legendClassArray[i])
                    .style("opacity", 0.5);
                }
              }
             
          } else { //deactivate
            if (active_link === this.id.split("id").pop()) {//active square selected; turn it OFF
              d3.select(this)           
                .style("stroke", "none");
  
              active_link = "0"; //reset
  
              //restore remaining boxes to normal opacity
              for (i = 0; i < legendClassArray.length; i++) {              
                  d3.select("#id" + legendClassArray[i])
                    .style("opacity", 1);
              }
  
              //restore plot to original
              restorePlot(d);
  
            }
  
          } //end active_link check
                            
                                  
        });
  
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; })
        .attr("class","legend-text");
  
      function restorePlot(d) {
  
                state.selectAll("rect").forEach(function (d, i) {      
                  //restore shifted bars to original posn
                  d3.select(d[idx])
                    .transition()
                    .duration(1000)        
                    .attr("y", y_orig[i]);
                })
  
                //restore opacity of erased bars
                for (i = 0; i < legendClassArray.length; i++) {
                  if (legendClassArray[i] != class_keep) {
                    d3.selectAll(".class" + legendClassArray[i])
                      .transition()
                      .duration(1000)
                      .delay(750)
                      .style("opacity", 1);
                  }
                }
  
              }
              
          function plotSingle(d) {
          
      class_keep = d.id.split("id").pop();
     // console.log(class_keep);
      idx = legendClassArray.indexOf(class_keep); 
     // console.log(idx);   
     
      //erase all but selected bars by setting opacity to 0
      for (i = 0; i < legendClassArray.length; i++) {
        if (legendClassArray[i] != class_keep) {
          d3.selectAll(".class" + legendClassArray[i])
            .transition()
            .duration(1000)          
            .style("opacity", 0);
        }
      }
  
      //lower the bars to start on x-axis
      y_orig = [];
      state.selectAll("rect").forEach(function (d, i) {        
      
        //get height and y posn of base bar and selected bar
        h_keep = d3.select(d[idx]).attr("height");
        y_keep = d3.select(d[idx]).attr("y");
        //store y_base in array to restore plot
        y_orig.push(y_keep);
  
        h_base = d3.select(d[0]).attr("height");
        y_base = d3.select(d[0]).attr("y");    
  
        h_shift = h_keep - h_base;
        y_new = y_base - h_shift;
  
        //reposition selected bars
        d3.select(d[idx])
          .transition()
          .ease("bounce")
          .duration(1000)
          .delay(750)
          .attr("y", y_new);
     
      })    
    }   
  }

  function drawGBarTrendChart(data){
    $("#chartArea center").empty();  
    d3.select('#chartArea center').style('float','none');
    $("#chartArea center").append('<svg></svg>');
    botMessage="Please see the trend on the right :";
    messages.push("<b>" + botName + ":</b><br> " + botMessage);
    d3.selectAll("svg > *").remove();
    showChat();
    d3.select('svg').style('margin-top','0px');
    d3.select('#chartArea').style('padding-left','10px'); 
    d3.select('#chartArea').style('padding-top','10px');
   
    var margin = {top: 20, right: 60, bottom: 120, left: 40},
      width = 500 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
  
    
  
      
  
    var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);
    var x1 = d3.scale.ordinal();
  
    var y = d3.scale.linear()
      .rangeRound([height, 0]); 
    
    var y2 = d3.scale.linear()
              .range([height, 0]);
    //var x = d3.scaleBand().rangeRound([0, width]).padding(2),
    //    y = d3.scaleLinear().rangeRound([height, 0]);
  
    
    
  
  
    var color = d3.scale.ordinal()
                        .range(["#ff3d3d", "#ffcc00", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  
    var xAxis = d3.svg.axis()
                      .scale(x0)
                      .orient("bottom");
  
    var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left")
                      .tickFormat(d3.format(".2s"));
                      
    var y2Axis = d3.svg.axis()
                   .scale(y2)
                   .orient("right");
  
       tooltip=d3.select("body").append("div").style("width","80px").style("height","40px").style("background","#C3B3E5")
      .style("opacity","1").style("position","absolute").style("visibility","hidden").style("box-shadow","0px 0px 6px #7861A5").style("padding","10px");
      toolval=tooltip.append("div");
  
  
   var svg = d3.select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var data_key=[];
    for ( var key in data[0] ) {
            data_key.push(key);
          } 
    console.log(data_key);
    //var data = new Array();
  
    var groupDim=d3.keys(data[0]).filter(function(key) { return (key !== data_key[0] && key!==data_key[1]); });
    console.log(groupDim);
    //console.log(data_I);
  
    data.forEach(function(d) {
            
            d.groupVal = groupDim.map(function(name) { return {name: name, value: +d[name]}; });        
  
          });  
    console.log(data);
  
    x0.domain(data.map(function(d) { return d[data_key[0]]; }));
    x1.domain(groupDim).rangeRoundBands([0,x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.groupVal,function(d){return d.value;}) })]); 
    y2.domain([0, (d3.max(data, function(d) { return d[data_key[1]]; }))+10]); 
  
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("POS Rs. Crs"); 
  
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+width+",0)")
      .call(y2Axis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");
  
    var valueline = d3.svg.line()
              .x(function(d){
              return x0(d[data_key[0]]);
                })
              .y(function(d){
                  return y2(d[data_key[1]]);
                  });
   
    var lineMargin=(x0.rangeBand()/2);
  
    var dimX = svg.selectAll(".dimX")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d[data_key[0]]) + ",0)"; });
  
    dimX.selectAll("rect")
      .data(function(d) { return d.groupVal; })
    .enter().append("rect")
       .attr("width", x1.rangeBand())
       .attr("x", function(d) { return x1(d.name); })
       .attr("y", function(d) { return y(d.value); })
       .attr("height", function(d) { return height - y(d.value); })
       .style("fill", function(d) { return color(d.name); })
       .on("mouseover",function(d){
              
              d3.select(this).style("stroke","orange").style("stroke-width","3px")
              d3.select(".trianglepointer").transition().delay(100).attr("transform","translate(100,0)");
              
              d3.select(".LegText").select("text").text((d.value))
              
              
          })
          .on("mouseout",function(){
              //d3.select(this).attr('fill', function(d) { return colorScale(window.bandClassifier(d.perChange,100));});
              d3.select(this).style("stroke","none");
              tooltip.style("visibility","hidden");
          })
          .on("mousemove",function(d){
              console.log(d);
              tooltip.style("visibility","visible")
              .style("top",(d3.event.pageY-30)+"px").style("left",(d3.event.pageX+20)+"px");
              
              //console.log(d3.mouse(this)[0])
              tooltip.select("div").html("<strong>"+d.name+"</strong><br/> "+(+d.value))
              
          }) ;
  
  
    svg.append("path")
              .datum(data)
              .attr("class","line")
              .attr("d", valueline)
              .attr("transform","translate("+lineMargin+",0)");
  
    svg.append("g").selectAll("circle")
              .data(data)
            .enter().append("circle")
              .attr("class", "circle")
              .attr("transform","translate("+lineMargin+",0)")
              .attr("cx", function(d) { return x0(d[data_key[0]]); })
              .attr("cy", function(d) { return y2(d[data_key[1]]); })
              .attr("r", 4 )
              .on("mouseover",function(d){
              
              d3.select(this).style("stroke","orange").style("stroke-width","3px")
              d3.select(".trianglepointer").transition().delay(100).attr("transform","translate(100,0)");
              
              d3.select(".LegText").select("text").text((d[data_key[1]]))
              
              
          })
          .on("mouseout",function(){
              //d3.select(this).attr('fill', function(d) { return colorScale(window.bandClassifier(d.perChange,100));});
              d3.select(this).style("stroke","none");
              tooltip.style("visibility","hidden");
          })
          .on("mousemove",function(d){
              //console.log(d);
              tooltip.style("visibility","visible")
              .style("top",(d3.event.pageY-30)+"px").style("left",(d3.event.pageX+20)+"px");
              
              //console.log(d3.mouse(this)[0])
              tooltip.select("div").html("<strong>"+data_key[1]+"</strong><br>"+(+d[data_key[1]]))
              
          });   
    
    
  
    var legend = svg.selectAll(".legend")
      .data(groupDim.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(-"+(300-i*90)+",330)"; });
  
    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
    
    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });  
  }


