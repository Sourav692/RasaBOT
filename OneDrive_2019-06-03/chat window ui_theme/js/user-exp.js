var allFaqs = [],
dn= "",
count = 0,
isFaqAdded = false,
faqsAr = [];

$(document).ready(function(){
    readJson();
    $('#btn-input').on('keyup keypress change', function(e) {
        autoSuggestions();
    });
    $(document).on('click', '.faqs li', function(){
        var chat = $('.chat');
        $('li.active').removeClass('active');
        $(this).addClass('active');
        $('#btn-input').val($('#faqsul li.active a').text());
    });
    
    dn = $.indexedDB("chatbotdb", {
        "schema" :{
            "1" : function(versionTransaction){
                versionTransaction.createObjectStore("faqs1");
            },
            "2" : function(versionTransaction){
                versionTransaction.createObjectStore("faqs");
            }
        }

    })
  .transaction(["faqs"]);
    $(document).on('click','.fa-smile', function() {
        $('.emojis-space').css('display','block');
    });
});

/* First time load */
function showFAQs(lang){
    var faqsUL = $('.sidenav #faqsul');
    var listItems= [];
    faqsUL.empty();
    $.each(allFaqs, function(key, val) {
        if(lang === "en")
            faqsUL.append('<li><a href="#">'+val.en+'</a></li>');
        else if(lang === "es")
            faqsUL.append('<li><a href="#">'+val.es+'</a></li>');
        else if(lang === "de")
            faqsUL.append('<li><a href="#">'+val.de+'</a></li>');
        else if(lang === "fr")
            faqsUL.append('<li><a href="#">'+val.fr+'</a></li>');
        else
            faqsUL.append('<li><a href="#">'+val.en+'</a></li>');
    });
}

function add(message, lang){
    count = count + 1;
    $.indexedDB("chatbotdb").objectStore("faqs").add({
        "id": count,
        "message": message,
        "language":lang
    },count).then(function(){
        console.log("Data added");
        isFaqAdded = true;
        return isFaqAdded;
    }, function(error, event){
        console.log(error);
        console.log("Error adding data");
        return isFaqAdded;
    });
    
}

function readAll(lang){
    faqsAr.length = 0;
    var found = false;
    $.indexedDB("chatbotdb").objectStore("faqs").each(function(item){
        if(item.value.language === lang){
            faqsAr.push(item.value.message);
        }
        return;
    }).done(function(result,event){
        // $.each(faqsAr, function(i, el){
        //     for(var i =0;i<allFaqs.length;i++){
        //         if(allFaqs[0].faq === el){
        //             found = true;
        //             break;
        //         } 
        //     }
        //     if(!found){
        //         var newFaq = {"faq":el};
        //         allFaqs.push(newFaq);
        //     }
        // });
        // showFAQs();

        // autoSuggestions();
        console.log("suggestions uploaded");
    }).fail(function(error, event){
        console.log("suggestions could not be loaded");
        console.log("error" + error);
    });
}

function lastRecordKeyAndAdd(message){
    var key = 0;
    $.indexedDB("chatbotdb").objectStore("faqs").each(function(item){
        key = item.value.id;
    }).done(function(result,event){
        count = key;
        console.log("records counted");
        return add(message, languageSel);
    }).fail(function(error, event){
        console.log("Could not count records in db");
        return add(message, languageSel);
    });
}

function readJson(){
    $.getJSON('./data/faqsData.json', function(data) {
      allFaqs = data.faqs;
      console.log(allFaqs);
      showFAQs($('.selectpicker').find(":selected").val());
    });
  }

function autoSuggestions(){
$("#btn-input").autocomplete({
    source: faqsAr
    });
}

function openEmojisSection(){
    var emojis = '';
}