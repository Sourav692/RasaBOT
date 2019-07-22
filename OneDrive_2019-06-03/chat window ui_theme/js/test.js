var numOfDivs = 0;

$(document).ready(function(){
     for(i = 0; i<2; i++){
        createDivs('chart_stbar','ruchi');
        numOfDivs = numOfDivs + 1;
    }
    createDivs('chart_table', 'deepa');
    numOfDivs = numOfDivs + 1;
    //$('a[class^="chart_"]').trigger('click');
});

function createDivs(classForChart, name){
    var innerDiv = '</div><p> Testing data attributes'
        + '<a style="cursor : pointer;" class="'+classForChart+'" id="chart'+numOfDivs+'"><span class="glyphicon glyphicon-stats" style="padding-left : 5px;"></span></a>'
        +'</p></div>'
    $('body').append(innerDiv);
     $('.'+classForChart).data('name',name);
     $('#chart'+numOfDivs).data('query','form'+numOfDivs);
}

$(document).on('click','a[class^="chart_"]', function(){
    if($('#'+$(this).attr("id")).data('query')!=undefined){
        console.log(" inside if with data in id"+$('#'+$(this).attr("id")).data('query'));
    }

    if($(this).data('name')!=undefined){
        console.log('inside if with data in class'+$(this).data('name'));
    }
});