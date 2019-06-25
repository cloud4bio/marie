console.log('questionnaire loadeds...')


survey={}


survey.ui=function(div){ 
    survey.div=div||document.getElementById('workSpace')

    if(survey.div){

        //Header and text
        let h = `<h3>Risk Prediction Questionnaire</h3>`
        let more = `<p>Learn more at <a href = "https://github.com/episphere/ai/wiki/cancer-risk-modeling" targe = "_blank"> the GitHub Wiki</a>.</p>`
        survey.div.innerHTML=h+more
        
        var resultButton = document.createElement('button')
        resultButton.innerHTML = "Results"
        document.body.appendChild(resultButton)

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

        async function readByIDs(){
            //q = readJSON()
            q = await (await fetch('https://cloud4bio.github.io/marie/questions.json')).json()
            qq={}
            q.forEach(qi=>{qq[qi['@id']]=qi})
            console.log(qq)
            return qq
        }
        qq = readByIDs()

        // Retrieving data:
        readText = localStorage.getItem("questionsJSON");   //this would probably be a link
        console.log(readText)
        retrievedObj = JSON.parse(readText);

        function gotoQuest(givenID){
            let newQuest = retrievedObj.filter(quest => quest.ID == givenID)
            console.log(newQuest)
        }
        //without loop, just first question
        currQuestion = retrievedObj[0].Question
        console.log(currQuestion)

        var newDiv = document.createElement('div');
        document.body.appendChild(newDiv);

        var quest = document.createTextNode(currQuestion);
        document.body.appendChild(quest);
        
        //if multiple choice
        var type = retrievedObj[0].Type
          if(type == 'radio'){
             //console.log('m')
             options = retrievedObj[0].Options
            
             var firstAnswerChoice = document.createTextNode(options[0])
             document.body.appendChild(firstAnswerChoice);

             var firstBubble = document.createElement("input")
             firstBubble.setAttribute("type", "radio")
             firstBubble.setAttribute("id", "firstY")
             document.body.appendChild(firstBubble) 
             console.log(document.getElementById("firstY"))

             var secondAnswerChoice = document.createTextNode(options[1])
             document.body.appendChild(secondAnswerChoice);

             var secondBubble = document.createElement("input")
             secondBubble.setAttribute("type", "radio")     
             secondBubble.setAttribute("id", "firstN")      
             document.body.appendChild(secondBubble) 
                             
          }

            var guidance = retrievedObj[0].help
            var helpText = document.createTextNode(guidance)
            document.body.appendChild(helpText)

            gotoQuest(retrievedObj[0].onDone)
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


    }   //close [if(survey.div)]

} //close[survey.ui=function(div)]

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        survey.ui(document.getElementById('workSpace'))    
    }
}