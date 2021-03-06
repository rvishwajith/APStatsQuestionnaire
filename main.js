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

            let newRight = (currentPage + 1) * -100 + "%";
            console.log(newRight);
            $(".Page").animate({left: newRight});
            currentPage++;

            var studentID = document.getElementById("StudentIDInput").value;        
            var studentIDAnswer = document.getElementById("StudentIDAnswer");
            studentIDAnswer.innerText = studentID;

            updateProgressBar();
        }
    });

    $(document).on("click",".YesNoButton", function (event) {
        
        let parent = $(event.target).parent();
        let answer = $(event.target).get(0).innerText;
        
        let div = parent.get(0).getElementsByClassName("YesNoButtonActive")[0];
        let div2 = parent.get(0).getElementsByClassName("YesNoActive")[0];
        let form = parent.get(0).getElementsByClassName("YesNoButton");
        let yesNo = div2.innerText;
        

        if(answer != yesNo) {
            
            if(answer == "Yes") {
                // shift to the left
                $(div).animate({left: "2px"}, 200);
                form[0].className += " YesNoActive";
                form[1].className = form[1].className.replace(" YesNoActive", "");
            }
            else if(answer == "No") {
                // shift to the right
                $(div).animate({left: "54px"}, 200);
                form[1].className += " YesNoActive";
                form[0].className = form[1].className.replace(" YesNoActive", "");
            }
        }
    });

    $(document).on("click",".A1234", function (event) {

        let parent = $(event.target).parent();
        let answer = $(event.target).get(0).innerText;

        let div = parent.get(0).getElementsByClassName("A1234ButtonActive")[0];
        let div2 = parent.get(0).getElementsByClassName("A1234Active")[0];
        let form = parent.get(0).getElementsByClassName("A1234Button");
        console.log(form);

        let ans = div2.innerText;

        if(answer != ans) {

            var num;

            for(var i = 0; i < form.length; i++) {
                if(answer == form[i].innerText) {
                    num = i;
                }
            }

            for(var i = 0; i < form.length; i++) {
                form[i].className = form[1].className.replace(" A1234Active", "");
            }
            
            form[num].className += " A1234Active";
            let amnt = 2 + 42 * num + "px";
            $(div).animate({left: amnt}, 200);
        }

    });

    $(document).on("click",".MultipleChoice", function (event) {

        let parent = $(event.target).parent();
        let answer = $(event.target).get(0).innerText;

        let div2 = parent.get(0).getElementsByClassName("ChoiceActive")[0];
        let form = parent.get(0).getElementsByClassName("Choice");
        let ans = div2.innerText

        for(var i = 0; i < form.length; i++) {
            if(answer == form[i].innerText) {
                num = i;
            }
        }

        for(var i = 0; i < form.length; i++) {
            form[i].className = form[1].className.replace(" ChoiceActive", "");
        }
        form[num].className += " ChoiceActive";
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

                if(currentPage != 0) {
                    div.appendChild(div2);
                }
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
        else if(line.startsWith("|Answer|")) {

            first = false;
            let text = line.replace("|Answer|", "");

            if(pages[currentPage].containsAnswers == false) {
                let div = document.createElement("div");
                div.className = "MultipleChoice";
                pages[currentPage].innerDiv.appendChild(div);
                first = true;
                pages[currentPage].containsAnswers = true;
            }

            let holder = pages[currentPage].innerDiv.getElementsByClassName("MultipleChoice")[0];
            let div = document.createElement("div");
            div.className = "Choice";
            div.innerText = text;

            if(first == true) {
                div.className += " ChoiceActive";
            }

            holder.appendChild(div);
        }
        else if(line.startsWith("|1234|")) {

            let div = document.createElement("div");
            div.className = "A1234";

            let div1 = document.createElement("div");
            div1.className = "A1234Button A1234Active";
            div1.innerText = "1";

            let div2 = document.createElement("div");
            div2.className = "A1234Button";
            div2.innerText = "2";

            let div3 = document.createElement("div");
            div3.className = "A1234Button";
            div3.innerText = "3";

            let div4 = document.createElement("div");
            div4.className = "A1234Button";
            div4.innerText = "4";

            let div5 = document.createElement("div");
            div5.className = "A1234ButtonActive";

            div.appendChild(div1);
            div.appendChild(div2);
            div.appendChild(div3);
            div.appendChild(div4);
            div.appendChild(div5);

            pages[currentPage].innerDiv.appendChild(div);
        }
    }

    set = true;
}
























