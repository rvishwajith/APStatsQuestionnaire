let pageHolder = document.getElementsByClassName("PageHolder")[0];
var markup;
var pages = [];
var currentPage = 0;

var nextButtons;
var backButtons;
var set = false;

class Page {

    constructor() {
        this.title = "";
        this.div = "";
        this.innerDiv = "";
        this.containsAnswers = false;
    }
}

/*

window.onbeforeunload = function() {
  return "Data will be lost if you leave the page, are you sure?";
};

*/

function getText(url) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.send(null);

        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {

                var type = request.getResponseHeader('Content-Type');

                if (type.indexOf("text") !== 1) {
                    finalVal = request.responseText;
                    resolve(finalVal);
                }
            }
        }
    })
}

async function start() {
    let markupLoc = "https://raw.githubusercontent.com/rvishwajith/APStatsQuestionnare/main/Data/SurveyMarkup.txt";
    markup = await getText(markupLoc);
    
    await setWebpage();
    updateProgressBar();
}

$(document).ready(function() {

    start();

    $(document).on("click",".NavBack", function (event) {
        
    });
});

function updateProgressBar() {

    let newProgress = currentPage/(pages.length - 1) * 100 + "%";
    $(".Progress").animate({width: newProgress});

    let pageNum = currentPage + 1;
    let div = document.getElementsByClassName("PageCounter")[0];
    div.innerText = "Page " + pageNum + "/" + (pages.length);
}

async function setWebpage() {
    
    let markupLines = markup.split("\n");
    var currentPage = -1;
    var numButtons = -1;

    for(var i = 0; i < markupLines.length; i++) {
        
        let line = markupLines[i];

        // GENERIC

        if(line.startsWith("|Page|")) {

            let title = line.replace("|Page|", "");

        }
        else if(line.startsWith("|Question|")) {

            let title = line.replace("|Question|", "");
            

        }
        else if(line.startsWith("|TextBox|")) {

            let title = line.replace("|TextBox|", "");

        }

        // SPECIAL CASES

        else if(line.startsWith("StudentID")) {

        }


    }

    set = true;
}
























