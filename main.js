let body = document.getElementsByClassName("Body")[0];
var markup;
var pages = [];
var questions = [];
var answers = [];
var currentPage = 0;

var nextButtons;
var backButtons;
var set = false;
var finished = false;
var finalResult = "";

class Page {

    constructor() {
        this.title = "";
        this.div = "";
        this.innerDiv = "";
        this.containsAnswers = false;
        this.questions = []
        this.hasRequiredYes = false;
        this.satisfiedRequirements = false;
    }
}

/*
window.onbeforeunload = function() {

    if(finished == false) {
        return "Your survey data will be lost if you leave the page, are you sure?";
    }
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
            /*console.log("hurrah");*/

            let newLeft = $(div).position().left;
            oldDiv.className = oldDiv.className.replace(" SmallAnswerActive", "");

            div.className += " SmallAnswerActive";
            $(div2).animate({
                width: (div.getBoundingClientRect().width + 2) + "px",
                left: newLeft
            }, 150, function() {});

            // CHECK IF ALL ANSWERS ARE YES

            if(pages[currentPage].hasRequiredYes) {

                let divs = pages[currentPage].innerDiv.getElementsByClassName("SmallAnswerActive");
                var validToPass = true;
                
                for(var i = 0; i < divs.length; i++) {

                    if(divs[i].innerHTML.includes("Yes")) {}
                    else {
                        validToPass = false;
                    }
                }

                if(validToPass) {

                    let div4 = pages[currentPage].innerDiv.getElementsByClassName("Buttons")[pages[currentPage].innerDiv.getElementsByClassName("Buttons").length-1];
                    div4.className = div4.className.replace(" Disabled", "");
                    //console.log("ALL VALID");
                }
                else {
                    let div4 = pages[currentPage].innerDiv.getElementsByClassName("Buttons")[pages[currentPage].innerDiv.getElementsByClassName("Buttons").length-1];
                    if(div4.className.includes("Disabled") == false) {
                        div4.className += " Disabled";
                    }
                }
            }
        }

    });

    $(document).on("click",".Buttons", function (event) {

        let div = event.target;

        if(div.innerText.includes("Continue")) {
            /*console.log("next");*/
            currentPage++;
            for(var i = 0; i < pages.length; i++) {
                $(pages[i].div).animate({
                    left: "-=100%"
                }, 300, function() {});
            }
        }
        else if(div.innerText.includes("Back")) {
            
            /*console.log("back");*/
            currentPage--;
            for(var i = 0; i < pages.length; i++) {
                $(pages[i].div).animate({
                    left: "+=100%"
                }, 300, function() {});
            }
        }
        updateProgressBar();
    });

    $(document).on("click",".MultipleChoiceAnswer", function (event) {

        let div = event.target;
        let parent = div.parentElement;
        let allDiv = parent.getElementsByClassName("MultipleChoiceAnswer");

        if(!div.className.includes("MultipleChoiceActive")) {

            for(var i = 0; i < allDiv.length; i++) {
                allDiv[i].className = allDiv[0].className.replace(" MultipleChoiceActive", "");
            }

            div.className += " MultipleChoiceActive";
        }
    });
});

function updateProgressBar() {

    let pageNum = currentPage;
    let newProgress = pageNum/(pages.length - 1) * 100 + "%";
    
    let div = document.getElementsByClassName("ProgressBarFill")[0];
    $(div).animate({width: newProgress});

    let div2 = document.getElementsByClassName("ProgressText")[0];
    div2.innerHTML = "Page " + (pageNum + 1) + "/" + (pages.length) + " - " + pages[currentPage].title;

    let div3 = document.getElementsByClassName("CenteredID")[0];
    div3.innerText = document.getElementsByClassName("TextArea")[0].value;
    //console.log("ID: " + div3.innerText);

    if(pageNum == (pages.length - 1)) {

        generateAnswerLog();
        finished = true;
    }
}

function generateAnswerLog() {

    for(var i = 0; i < pages.length - 1; i++) {

        let all = pages[i].innerDiv.getElementsByTagName("*");

        for(var j = 0; j < all.length; j++) {

            var div = all[j];

            if(div.className.includes("Active") && !div.className.includes("Ignore")) {
                answers.push(div.innerHTML);
            }
        }
    }

    let div3 = document.getElementsByClassName("CenteredID")[0];
    div3.innerText = document.getElementsByClassName("TextArea")[0].value;
    //console.log("ID: " + div3.innerText);

    var d = new Date();
    finalResult += "Student ID: " + div3.innerText + "&&";
    finalResult += "Date: " + d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear() + "&&";
    finalResult += "Time: " + d.getHours() + ":" + d.getMinutes() + "&&";

    for(var i = 0; i < questions.length; i++) {
        finalResult += "Question: " + questions[i] + "&&";
        finalResult += "Answer: " + answers[i] + "&&";
    }
    finalResult += "DATA END&&&"

    storeData();
}

async function setWebpage() {
    
    let markupLines = markup.split("\n");
    
    // set to -1
    var numPages = -1;
    var numButtons = -1;

    for(var i = 0; i < markupLines.length; i++) {
        
        var line = markupLines[i];

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

                if(pages[numPages].hasRequiredYes) {
                    
                    //div2.disabled = true;
                    div2.className += " Disabled";
                }

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
            div.className += "Text Ignore";
            div.innerText = text;

            pages[numPages].innerDiv.appendChild(div);

        }
        else if(line.startsWith("|Question|")) {

            let text = line.replace("|Question|", "");

            let div = document.createElement("div");
            div.className += "Text Ignore";
            div.innerText = text;

            pages[numPages].innerDiv.appendChild(div);
            pages[numPages].questions.push(line);
            questions.push(text);

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
        else if(line.startsWith("|RequiredYes|")) {

            let text = line.replace("|RequiredYes|", "");
            let answers = text.split(",");

            let div = document.createElement("div");
            div.className += " SmallChoice";

            var activeDiv;

            for(var j = 0; j < answers.length; j++) {
                
                let div2 = document.createElement("div");
                div2.className += " SmallAnswer Ignore";

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

            pages[numPages].hasRequiredYes = true;
        }
        else if(line.startsWith("|TextBox|")) {

            let title = line.replace("|TextBox|", "");
        }
        else if(line.startsWith("|Subtext|")) {

            var text = line.replace("|Subtext|");
            var text2 = markupLines[i+1].replace("|SubtextInfo|");
            // console.log(text);
            i++;

            let div = document.createElement("div");
            div.className += " Text SmallBlueText Ignore";
            div.innerText = text.replace("undefined", "");
            pages[numPages].innerDiv.appendChild(div);
        }
        else if(line.startsWith("|Answer|")) {

            let answers = [];
            var isAnswer = true;

            let div = document.createElement("div");
            div.className += " MultipleChoice";

            var increased = false;

            while(isAnswer) {

                if(line.startsWith("|Answer|")) {

                    var text = line.replace("|Answer|", "");
                    answers.push(text);
                    let div2 = document.createElement("div");
                    div2.className += " MultipleChoiceAnswer";
                    div2.innerHTML = text;
                    div.appendChild(div2);

                    if(!increased) {
                        div2.className += " MultipleChoiceActive";
                    }

                    i++;
                    increased = true;
                }
                else {
                    isAnswer = false;
                }
                line = markupLines[i];
            }
            
            

            pages[numPages].innerDiv.appendChild(div);
        }

        // SPECIAL CASES

        else if(line.startsWith("|StudentID|")) {

            let div = document.createElement("input");
            console.log("ARRIVED");
            div.type = "text";
            div.placeholder = "Student ID"
            div.className += "TextArea"; // set the CSS class
            pages[numPages].innerDiv.appendChild(div);
        }
        else if(line.startsWith("|&StudentID|")) {

            let div = document.createElement("div");
            div.className += " CenteredID";
            pages[numPages].innerDiv.appendChild(div);
        }
    }
    set = true;
}

async function storeData() {

    let div3 = document.getElementsByClassName("CenteredID")[0];
    div3.innerText = document.getElementsByClassName("TextArea")[0].value;
    var id = div3.innerText;

    var email = id + "@domain.com"
    var password = "123456";

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
        // Signed in 
            var user = userCredential.user;
            console.log("user created with email " + email);
            signInUser(email, password);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            signInUser(email, password);
        });
}

async function signInUser(email, password) {

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
        // Signed in 
            var user = userCredential.user;
            console.log("successfully signed in to " + email);
            saveDataToAll(email);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            exists = true;
        });
}

async function saveDataToAll(email) {

    var db = firebase.firestore();

    db.collection("users").doc("AllData").set({
        userInput1: finalResult
    })
    .then(() => {
        console.log("Document successfully written to " + email);
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}










