let pageHolder = document.getElementsByClassName("PageHolder")[0];
var markup;
var pages = [];

start();

class Page {

    constructor() {
        
        this.title = "";
        this.div = "";
        this.innerDiv = "";
        this.children = "";

    }
}

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
    markup = await getText("https://raw.githubusercontent.com/rvishwajith/APStatsQuestionnare/main/Data/SurveyMarkup.txt");
    
    setWebpage();
    
}

function setWebpage() {
    
    let markupLines = markup.split("\n");
    var currentPage = -1;
    

    for(var i = 0; i < markupLines.length; i++) {
        
        let line = markupLines[i];

        if(line.startsWith("|Page|")) {

            currentPage++;
            // console.log("New page count: " + currentPage);
            pages.push(new Page());

            let pageTitle = line.replace("|Page|", "");
            let pageDiv = document.createElement("div");
            pageDiv.className = "Page";
            pageDiv.innerText = pageTitle;
            pages[currentPage].div = pageDiv;

            let pageInnerDiv = document.createElement("div");
            pageInnerDiv.className = "PageContent";
            pageDiv.appendChild(pageInnerDiv);
            pages[currentPage].innerDiv = pageInnerDiv;

            pageHolder.appendChild(pageDiv);
        }
        else if(line.startsWith("|Question|")) {

            let text = line.replace("|Question|", "");
            let div = document.createElement("div");
            div.className = "Question";
            div.innerText = text;
            pages[currentPage].innerDiv.appendChild(div);
        }
    }
}