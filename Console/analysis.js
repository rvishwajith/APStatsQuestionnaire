let body = document.getElementsByClassName("Body")[0];

async function start() {
    let markupLoc = "https://raw.githubusercontent.com/rvishwajith/APStatsQuestionnare/main/Data/SurveyEmails.txt";
    markup = await getText(markupLoc);
    
    await setWebpage();
    updateProgressBar();
}