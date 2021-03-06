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
        this.children = "";
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
}

$(document).ready(function() {

    start();

    // LEFT
    $(document).on("click",".NavBack", function (event) {


        if(currentPage > 0 && set) {

            let newLeft = (currentPage - 1) * (-100) + "%";
            console.log(newLeft);

            $(".Page").animate({left: newLeft});
            currentPage--;

            updateProgressBar();
        }

        
    });

    // RIGHT
    $(document).on("click",".NavForward", function (event) {
        
        if(currentPage < pages.length && set) {

            console.log($('StudentIDInput').val());

            let newRight = (currentPage + 1) * -100 + "%";
            console.log(newRight);

            $(".Page").animate({left: newRight});
            currentPage++;

            updateProgressBar();
        }
    });

});

function updateProgressBar() {

    let newProgress = currentPage/pages.length * 100 + "%";
    $(".Progress").animate({width: newProgress});
}

async function setWebpage() {
    
    let markupLines = markup.split("\n");
    var currentPage = -1;
    

    for(var i = 0; i < markupLines.length; i++) {
        
        let line = markupLines[i];

        if(line.startsWith("|Page|")) {

            if(currentPage >= 0) {

                let br = document.createElement("br");

                let div = document.createElement("div");
                div.className = "Navigation";
                
                let div2 = document.createElement("div");
                div2.innerText = "Back";
                div2.className += "NavBack";

                let div3 = document.createElement("div");
                div3.innerText = "Continue";
                div3.className += "NavForward";

                div.appendChild(div2);
                div.appendChild(div3);

                pages[currentPage].innerDiv.appendChild(br);
                pages[currentPage].innerDiv.appendChild(div);
            }

            currentPage++;
            pages.push(new Page());

            let title = line.replace("|Page|", "");
            let pageDiv = document.createElement("div");
            pageDiv.className += "Page";
            pages[currentPage].div = pageDiv;

            let pageInnerDiv = document.createElement("div");
            pageInnerDiv.className += "PageContent";
            pageDiv.appendChild(pageInnerDiv);
            pages[currentPage].innerDiv = pageInnerDiv;

            pageHolder.appendChild(pageDiv);

            let pageTitle = document.createElement("div");
            pageTitle.className += "PageTitle";
            pageTitle.innerText = title;
            pageInnerDiv.appendChild(pageTitle);
        }
        else if(line.startsWith("|Question|")) {

            let text = line.replace("|Question|", "");
            let div = document.createElement("div");
            div.className += "Question";
            div.innerText = text;
            pages[currentPage].innerDiv.appendChild(div);
        }
        else if(line.startsWith("|ReqYesNo|") || line.startsWith("|YesNo|")) {

            console.log("YesNo added on page " + currentPage); 

            let div = document.createElement("div");
            div.className += "YesNo";

            let div2 = document.createElement("div");
            div2.className += "YesNoButton";
            div2.innerText = "Yes";

            let div3 = document.createElement("div");
            div3.className += "YesNoButton YesNoActive";
            div3.innerText = "No";

            let div4 = document.createElement("div");
            div4.className += "YesNoButtonActive";

            div.appendChild(div2);
            div.appendChild(div3);
            div.appendChild(div4);

            pages[currentPage].innerDiv.appendChild(div);
        }
        else if(line.startsWith("|TextBox|")) {

            let text = line.replace("|TextBox|", "");
            let div = document.createElement("input");
            div.type = "text";
            div.className = "TextInput";
            div.id = "StudentIDInput";
            div.placeholder = text;

            pages[currentPage].innerDiv.appendChild(div);
        }
        else if(line.startsWith("|StudentID|")) {

            var text = "";
            text = document.getElementById("StudentIDInput").text;
            console.log(text);

            let div = document.createElement("div");
            div.id = "StudentIDAnswer";
            div.className = "Centered Spaced";
            div.innerText = document.getElementById("StudentIDInput").value + "1234567";

            pages[currentPage].innerDiv.appendChild(div);
        }
    }

    set = true;
}
























