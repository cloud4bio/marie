console.log('questionnaire loadeds...')

survey = {}

survey.ui = function(div) {
    survey.div = div || document.getElementById('workSpace')

    if (survey.div) {

        //Header and text
        let h = `<h3>Risk Prediction Questionnaire</h3>`
        let more = `<p>Learn more at <a href = "https://github.com/episphere/ai/wiki/cancer-risk-modeling" target = "_blank"> the GitHub Wiki</a>.</p>`
        h += more
        survey.div.innerHTML = h

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

//ACTUAL QUESTIONS (likely): https://rdrr.io/bioc/iCARE/man/bc_data.html

        questionsObj = [{
            "ID": 314,
            "Question": "Family History?",
            "Type": "radio",
            "Options": ["Yes", "No"],
            "onDone": "315",
            "help": "Clarifying Information"
        }, {
            "ID": 315,
            "Question": "Children?",
            "Type": "radio",
            "Options": ["Yes", "No"],
            "onDone": "316",
            "help": "Clarifying Information"
        }, {
            "ID": 316,
            "Question": "Smoker?",
            "Type": "check",
            "onDone": "317",
            "help": "Clarifying Information"
        }, {
            "ID": 317,
            "Question": "Weight?",
            "Type": "numeric",
            "onDone": "none",
            "help": "Clarifying Information"
        }
        ]
        questionsJSON = JSON.stringify(questionsObj);
        localStorage.setItem("questionsJSON", questionsJSON);
        //tentatively saving JSON to local storage
        console.log(questionsJSON)

        var form = document.createElement("form");
        document.body.appendChild(form);

        // Retrieving data:
        readText = localStorage.getItem("questionsJSON");
        //this would probably be a link
        //console.log(readText)
        retrievedObj = JSON.parse(readText);

        function gotoQuest(givenID) {
            let newQuest = retrievedObj.filter(quest=>quest.ID == givenID)
            return newQuest
            //console.log(newQuest)
        }

        questionOrder = [314, 315, 316, 317]            //can we just provide question order?

        //initialize dictionary to hold results of each question
        var resultDict = {}
        var count
        for (count = 0; count < questionOrder.length; count++) {
            id = questionOrder[count]
            resultDict[id] = null;
        }

        currID = 314 // start ID (first question)
        var i
        for (i = 0; i < questionOrder.length; i++) {
             currItem = gotoQuest(currID)[0]
            //access questions with current ID
            //var currID = questionOrder[i]
            //console.log(currID)
            //currID = questionOrder[0]
            //var currItem = gotoQuest(currID)[0]
            console.log(currItem)
            //obtain the question itself
            currQuestion = currItem.Question
            console.log(currQuestion)

            var newDiv = document.createElement('div');
            document.body.appendChild(newDiv);

            var quest = document.createTextNode(currQuestion);
            document.body.appendChild(quest);

            //if multiple choice
            var type = currItem.Type
            console.log(type)
            //console.log(currID)
            //multiple choice question, one response allowed
            //need to allow for more than two options
            if (type == 'radio') {
                //console.log('m')
                options = currItem.Options

                let firstAnswerChoice = document.createTextNode(options[0])
                document.body.appendChild(firstAnswerChoice);

                let firstBubble = document.createElement("input")
                firstBubble.setAttribute("type", "radio")
                firstBubble.setAttribute("id", "Y")
                //PROBLEM: same ID for multiple questions' bubbles
                document.body.appendChild(firstBubble)
                //console.log(document.getElementById("Y"))

                let secondAnswerChoice = document.createTextNode(options[1])
                document.body.appendChild(secondAnswerChoice);

                let secondBubble = document.createElement("input")
                secondBubble.setAttribute("type", "radio")
                secondBubble.setAttribute("id", "N")
                document.body.appendChild(secondBubble)

                document.getElementById("Y").onclick = function() {
                    //console.log(currID);
                    resultDict[currID] = options[0];
                    console.log(resultDict)
                }

                document.getElementById("N").onclick = function() {
                    resultDict[currID] = options[1];
                    console.log(resultDict)
                }

                //PROBLEM: response not begin associated with correct ID
                // always storing in HIGHEST ID (e.g. 317), overwriting what is there
            } 
            
            else if (type == 'numeric') {
                //if input is of a numeric type
                let inputBox = document.createElement("input")
                inputBox.setAttribute("type", "number")
                inputBox.setAttribute("id", "userInput")
                document.body.appendChild(inputBox)
                inputBox.onkeyup=function(){
                        let numReply = document.getElementById('userInput').value
                        resultDict[currID] = numReply; console.log(resultDict)
                }
            }

            else if (type == 'check') {
                //if input is of a numeric type
                let checkBox = document.createElement("input")
                checkBox.setAttribute("type", "checkbox")
                checkBox.setAttribute("id", "checkInput")
                document.body.appendChild(checkBox)
                checkBox.onclick=function(){
                        let boolean = document.getElementById('checkInput').checked
                        resultDict[currID] = boolean; console.log(resultDict)
                }
            }

            var guidance = currItem.help
            var helpText = document.createTextNode(guidance)
            document.body.appendChild(helpText)
            currID = currItem.onDone
        }

        var newDiv = document.createElement('div');
        document.body.appendChild(newDiv);
        var resultButton = document.createElement('button')
        resultButton.setAttribute("id","done")
        resultButton.innerHTML = "Results"
        document.body.appendChild(resultButton)
        document.getElementById("done").onclick = function() {
                console.log(resultDict + "got it")
                h += resultDict//.toString()
                survey.div.innerHTML = h
        }

        /* document.getElementById("firstY").onclick  
            = function()
            {console.log("clicked yes"); 
            var clickMessage = document.createTextNode("Clicked yes")
               document.body.appendChild(clickMessage);
            } 
            document.getElementById("firstN").onclick  
            = function()
            {console.log("clicked no"); 
            var clickMessage = document.createTextNode("Clicked no")
               document.body.appendChild(clickMessage);
            } */

        //loop through all questions in JSON
        /*
        var i
        for(i = 0; i < retrievedObj.length; i++){
            currQuestion = retrievedObj[i].Question
            console.log(currQuestion)
            var newDiv = document.createElement('div');
            document.body.appendChild(newDiv);
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
                    var choice = document.createElement("input")
                    choice.setAttribute("type","radio")
                    document.body.appendChild(choice)                 
                }
            }
            var guidance = retrievedObj[i].help
            var helpText = document.createTextNode(guidance)
            document.body.appendChild(helpText)
        }   */

        //var questionDiv = document.createElement('div');
        //document.body.appendChild(questionDiv);

    }
    //close [if(survey.div)]

}
//close[survey.ui=function(div)]

//On page startup
window.onload = function() {
    if (document.getElementById('workSpace')) {
        survey.ui(document.getElementById('workSpace'))
    }
}
