console.log('questionnaire loadeds...')


survey={}


survey.ui=function(div){ 
    survey.div=div||document.getElementById('workSpace')

    if(survey.div){

        //Header and text
        let h = `<h3>Risk Prediction Questionnaire</h3>`
        survey.div.innerHTML=h


        /*Reading from JSON test
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
        survey.div.innerHTML=h*/

        /*Sample JSON File Format
        [
            {
               “@id”:<some id, we can create it automatically as a uuid>,
                “question”:<some question>,
                “type”:<multiple choice, numeric, free text, etc>,
                “options”:[list of options for multiple choice],
                “onDone”:function listening to the event of an answer, this is open ended, from skip logic to engaging model prediction,
                “help”: “some help to understand the question:
            }
            ... [other questions]
        ]*/

        questionsObj = 
        [
            {QuestionID: 314, Question: 'Family History?', Type: 'M', Options: ['Yes', 'No'], onDone: 'none', help: 'Clarifying Information'},
            {QuestionID: 315, Question: 'Children?', Type: 'M', Options: ['Yes', 'No'], onDone: 'none', help: 'Clarifying Information'}
        ]
        questionsJSON = JSON.stringify(questionsObj);
        localStorage.setItem("questionsJSON", questionsJSON);   //tentatively saving JSON to local storage
        console.log(questionsJSON)

        // Retrieving data:
        readText = localStorage.getItem("questionsJSON");   //this would probably be a link
        retrievedObj = JSON.parse(readText);
        var i
        for(i = 0; i < retrievedObj.length; i++){
            currQuestion = retrievedObj[i].Question
            console.log(currQuestion)
            var quest = document.createTextNode(currQuestion);
            document.body.appendChild(quest);

            //if multiple choice
            var type = retrievedObj[i].Type
            if(type == 'M'){
                //console.log('m')
                options = retrievedObj[i].Options
                var j
                for(j = 0; j < options.length; j++){
                    //console.log(options[j])
                    var answerChoice = document.createTextNode(options[j])
                    document.body.appendChild(answerChoice);
                }
            }
            `<!--<input type="radio" name="choice" value="Scripting"> Scripting-->`
        }
    
        //var questionDiv = document.createElement('div');
        //document.body.appendChild(questionDiv);


    }   //close [if(survey.div)]

} //close[survey.ui=function(div)]

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        survey.ui(document.getElementById('workSpace'))    
    }
}