console.log('questionnaire loadeds...')


survey={}


survey.ui=function(div){ 
    survey.div=div||document.getElementById('workSpace')

    if(survey.div){

        //Header and text
        let h = `<h3>Risk Prediction Questionnaire</h3>`
        survey.div.innerHTML=h

        myObj = {Age: 40, FamilyHistory: 'Y', PreviousDiagnosis: 'N', Children: 'Y', Mammogram: 'N'};
        myJSON = JSON.stringify(myObj);
        localStorage.setItem("testJSON", myJSON);   //tentatively saving JSON to local storage
        console.log(myJSON)

        // Retrieving data:
        text = localStorage.getItem("testJSON");
        obj = JSON.parse(text);
        console.log(obj.Age)

        var ageStr = 'Age: ' + obj.Age
        var FamilyHistoryStr = 'Family History?: ' + obj.FamilyHistory
        var PreviousDiagnosisStr = 'Previous Diagnosis?: ' + obj.PreviousDiagnosis
        var ChildrenStr = 'Children?: ' + obj.Children
        var MammogramStr = 'Completed Mammogram?: ' + obj.Mammogram

        var finalStr = ageStr + `<p></p>` + FamilyHistoryStr + `<p></p>` + PreviousDiagnosisStr 
        + `<p></p>` + ChildrenStr + `<p></p>` + MammogramStr

        console.log(finalStr)
        h += finalStr
        survey.div.innerHTML=h
    }

}

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        survey.ui(document.getElementById('workSpace'))    
    }
}