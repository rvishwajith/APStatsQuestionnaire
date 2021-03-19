let body = document.getElementsByClassName("Body")[0];
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
        this.questions = []
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

    $(document).on("click",".SmallAnswer", function (event) {

        var div = event.target;
        var div2 = div.parentElement.getElementsByClassName("SmallAnswerBackground")[0];
        var oldDiv = div.parentElement.getElementsByClassName("SmallAnswerActive")[0]

        if(div.className.includes("SmallAnswerActive")) {
            console.log("ignore");
        }
        else {
            console.log("hurrah");

            let newLeft = $(div).position().left;
            oldDiv.className = oldDiv.className.replace(" SmallAnswerActive", "");

            $(div2).animate({
                width: (div.getBoundingClientRect().width + 2) + "px",
                left: newLeft
            }, 200, function() {
                div.className += " SmallAnswerActive";
            });
        }

    });

    $(document).on("click",".Buttons", function (event) {

        let div = event.target;

        if(div.innerText.includes("Continue")) {
            
            console.log("next");
            currentPage++;

            for(var i = 0; i < pages.length; i++) {

                $(pages[i].div).animate({
                    left: "-=100%"
                }, 300, function() {});
            }
        }
        else if(div.innerText.includes("Back")) {
            
            console.log("back");
            currentPage--;

            for(var i = 0; i < pages.length; i++) {

                $(pages[i].div).animate({
                    left: "+=100%"
                }, 300, function() {});
            }
        }

        updateProgressBar();
    });
});

function updateProgressBar() {

    
    let newProgress = currentPage/(pages.length - 1) * 100 + "%";
    $(".ProgressBarFill").animate({width: newProgress});

    let pageNum = currentPage + 1;
    let div = document.getElementsByClassName("ProgressText");
    div.innerText = "Page " + pageNum + "/" + (pages.length);
}

async function setWebpage() {
    
    let markupLines = markup.split("\n");
    
    // set to -1
    var numPages = -1;
    var numButtons = -1;

    for(var i = 0; i < markupLines.length; i++) {
        
        let line = markupLines[i];

        // GENERIC

        if(line.startsWith("|Page|")) {

            // ADD NEXT BUTTON
            if(numPages >= 0) {

                let innerDiv = pages[numPages].innerDiv;

                let div = document.createElement("div");
                div.className += " ButtonHolder";

                // ADD BACK BUTTON AND NEXT BUTTON
                if(numPages > 0) {
                    let div3 = document.createElement("div");
                    div3.className += "Buttons";
                    div3.innerText = "<- Back"
                    div.appendChild(div3);
                }

                let div2 = document.createElement("div");
                div2.className += "Buttons";
                div2.innerText = "Continue ->"

                div.appendChild(div2);
                innerDiv.appendChild(div);

            }

            let title = line.replace("|Page|", "");
            numPages++;

            let pageObj = new Page();
            pages.push(pageObj)
            pageObj.title = title;

            var page = document.createElement("div");
            page.className += " Page";
            pageObj.div = page;
            body.appendChild(page);

            var amount = 100 * (numPages);
            page.style.left = amount + "%";

            var innerPage = document.createElement("div");
            innerPage.className += " InnerPage";
            pageObj.innerDiv = innerPage;
            page.appendChild(innerPage);

        }
        else if(line.startsWith("|Text|")) {

            let text = line.replace("|Text|", "");

            let div = document.createElement("div");
            div.className += "Text";
            div.innerText = text;

            pages[numPages].innerDiv.appendChild(div);

        }
        else if(line.startsWith("|Question|")) {

            let text = line.replace("|Question|", "");

            let div = document.createElement("div");
            div.className += "Text";
            div.innerText = text;

            pages[numPages].innerDiv.appendChild(div);
            pages[numPages].questions.push(line);

        }
        else if(line.startsWith("|Required|")) {
            
            let text = line.replace("|Required|", "");
            let answers = text.split(",");

            let div = document.createElement("div");
            div.className += " SmallChoice";

            var activeDiv;

            for(var j = 0; j < answers.length; j++) {
                
                let div2 = document.createElement("div");
                div2.className += " SmallAnswer";

                if(j == 0) {
                    div2.className += " SmallAnswerActive";
                    activeDiv = div2;
                }

                div2.innerText = answers[j];
                div.appendChild(div2);
            }
            pages[numPages].innerDiv.appendChild(div);

            let div3 = document.createElement("div");
            div3.className += " SmallAnswerBackground";
            div3.style.width = activeDiv.getBoundingClientRect().width + "px";
            div.prepend(div3);
        }
        else if(line.startsWith("|TextBox|")) {

            let title = line.replace("|TextBox|", "");

        }
        else if(line.startsWith("|Subtext|")) {

            var text = line.replace("|Subtext|");
            var text2 = markupLines[i+1].replace("|SubtextInfo|");
            console.log(text);
            i++;
        }

        // SPECIAL CASES

        else if(line.startsWith("StudentID")) {

        }


    }
    set = true;
}
























