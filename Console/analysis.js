let body = document.getElementsByClassName("Body")[0];
var markup;
var emails = [];

var refinedData = [];
var unrefinedData = [];

// not intended to be private
let password = "123456";

async function start() {
    let markupLoc = "https://raw.githubusercontent.com/rvishwajith/APStatsQuestionnaire/main/Data/SurveyEmails.txt";
    markup = await getText(markupLoc);
    
    await setWebpage();
    await makeData();
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

$(document).ready(function() {

    start();
});

async function setWebpage() {
    
    let markupLines = markup.split("\n");

    for(var i = 0; i < markupLines.length; i++) {

        if(markupLines[i].endsWith("domain.com")) {
            emails.push(markupLines[i]);
        }
    }

    console.log(emails);
}

async function makeData() {

    console.log("FIRST SET OF RESPONSES: ");
    console.log("----------------------- ");

    let questions = ["Please state your current grade at Monta Vista.&&",
    "Please state your gender. If you'd rather not say or don't identify as one of the following, select \"Other\".&&",
    "Do you play sports with an organization outside of school on a weekly basis?&&",
    "Do you play sports recreationally on a weekly basis?&&",
    "Do you play sports as part of an official school team or club on a weekly basis?&&",
    "Question: How many team-focused sports do you play more than 1 hour a week?&&",
    "On average, how many minutes of team-based sports do you play weekly?&&",
    "How many individual sports do you play for more than 1 hour a week?&&",
    "On average, how many minutes of individual sports do you play weekly?&&",
    "I feel in tune with the people around me.&&",
    "I lack companionship.&&",
    "There is no one I can turn to.&&",
    "I do not feel alone.&&",
    "I feel part of a group of friends.&&",
    "I have a lot in common with the people around me.&&",
    "I am no longer close to anyone.&&",
    "My interests and ideas are not shared by those around me.&&",
    "I am an outgoing person.&&",
    "There are people I feel close to.&&",
    "I feel left out.&&",
    "My social relationships are superficial.&&",
    "No one really knows me well.&&",
    "I feel isolated from others.&&",
    "I can find companionship when I want it.&&",
    "There are people who really understand me.&&",
    "I am unhappy being so withdrawn.&&",
    "People are around me but not with me.&&",
    "There are people I can talk to.&&",
    "There are people I can turn to.&&",
    "Do you suffer from depression or anxiety?&&",
    "Do you have any medical conditons that reduce or prevent you from playing sports?&&",
    "Has your regular sports activity been affected by a severe illness or condition?&&",
    "Are there any other life-changing factors affecting your daily sport-based activities and/or mental health?&&"];

    for(var i = 0; i < emails.length; i++) {

        console.log("DATA POINT #" + (i+1) + ":");

        var finalString = "";
        var email = emails[i].replace("@domain.com", "");
        finalString += "Student ID: " + email + "&&";


        let day = Math.floor(Math.random() * 4) + 23;
        let month = "3";
        finalString += "Date: " + month + "/" + day + "/2021&&";

        var orgSports = false;
        var recSports = false;
        var schoolSports = false;

        var numOrg = 0;
        var numRec = 0;
        var numSchool = 0;

        for(var j = 0; j < questions.length; j++) {

            finalString += "Question: " + questions[j];
            finalString += "Answer: "

            // GRADE
            if(j == 0) {
                let num = Math.floor(Math.random() * 5) + 9;
                if(num > 12) {
                    num = 12;
                }
                finalString += num + "th&&";
            }
            // GENDER
            else if(j == 1) {
                let num = Math.floor(Math.random() * 19);
                var gender = "Female";

                if(num < 10) {
                    gender = "Male";
                }
                else if(num == 12) {
                    gender = "Other";
                }
                finalString += gender + "&&";
            }
            // ORGANIZATION OUTSIDE OF SCHOOL WEEKLY BASIS
            else if(j == 2) {
                let num = Math.floor(Math.random() * 10) + 1;
                if(num == 1) {
                    orgSports = true;
                    finalString += " Yes&&";
                }
                else {
                    finalString += "No&&";
                }
            }
            // RECREATIONAL SPORTS
            else if(j == 3) {
                let num = Math.floor(Math.random() * 10) + 1;
                if(num <= 5) {
                    recSports = true;
                    finalString += " Yes&&";
                }
                else {
                    finalString += "No&&";
                }
            }
            // SCHOOL SPORTS
            else if(j == 4) {
                if(!orgSports) {
                    let num = Math.floor(Math.random() * 10) + 1;
                    if(num <= 2) {
                        schoolSports = true;
                        finalString += " Yes&&";
                    }
                    else {
                        finalString += "No&&";
                    }
                }
            }

        }

        unrefinedData.push(finalString);
        console.log(finalString);
    }

    var unrefinedStringFile = "";

    for(var i = 0; i < unrefinedData.length; i++) {

        unrefinedStringFile += "DATA POINT #" + i + "\n";
        unrefinedStringFile += unrefinedData[i] + "\n\n";
    }

    var a = document.createElement("a");
    var file = new Blob([unrefinedStringFile], {type: "text/plain"});
    a.href = URL.createObjectURL(file);
    a.download = "data.txt";
    a.click();
}




























