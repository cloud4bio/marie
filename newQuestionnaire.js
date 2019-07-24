console.log('new questionnaire loadeds...')

survey = {}

survey.ui = function(div) {
    survey.div = div || document.getElementById('workSpace')

    if (survey.div) {

        //Header and text
        /*
        let h = `<h3>Risk Prediction Questionnaire</h3>`
        let more = `<p>Learn more at <a href = "https://github.com/episphere/ai/wiki/cancer-risk-modeling" target = "_blank"> the GitHub Wiki</a>.</p>`
        h += more
        survey.div.innerHTML = h;*/

(async function(){
        async function readByIDs(url){
            //q = readJSON()
            url = url||'questions.json'     //update to cloud4bio page
            q = await (await fetch(url)).json()
            qq={}
            q.forEach(qi=>{qq[qi['ID']]=qi})
            return qq       
        }

        var questionsObj = await readByIDs() 

        async function getQuest(givenID){
            thisQuest = questionsObj[givenID]
            return thisQuest
        }
        
        var resultDict = {}
        
        //obtain starting question
        startID = 1
        currItem = await getQuest(startID)
        finished = false
        var keys = []

        while(!finished){
            //console.log('not finished')

            //access attributes of question
            var currQuestion = currItem.Question
            var type = currItem.Type
            var currID = currItem.ID
            var guidance = currItem.help
            var nextID = currItem.onDone

            keys.push(currID)

            var newDiv = document.createElement('div');
            document.body.appendChild(newDiv);

            var quest = document.createTextNode(currQuestion);
            document.body.appendChild(quest);

            console.log(type)

            createQuest(type, currID);

            if(nextID == false){
                finished = true
            }
            else{
                currItem = await getQuest(nextID)
            }   
        }
        

        function createQuest(type, questID){     
            switch(type){
                case "radio":
                    newRadio(questID);
                    break
                case "numeric":
                    newNumeric(questID);
                    break
                case "check":
                    newCheck(questID);
                    break
            }
        }

        //create multiple choice question element
       function newRadio(questID){
                action = false
                console.log(currItem.Question)
                options = currItem.Options
                console.log(options)
                
                resultDict[questID] = null
                
                for(let i=0; i<options.length; i++){
                    let newAnswer = document.createTextNode(options[i])     //just attach as attribute of button?
                    document.body.appendChild(newAnswer);

                    let newBubble = document.createElement("input")
                    newBubble.setAttribute("type", "radio")
                    newBubble.className = currItem.ID;

                    //newBubble.setAttribute("value", options[i])

                    /*trying to create ID for a dynamically created multiple choice element
                    newBubble.setAttribute("id",questID+i.toString())
                    console.log("created ID", newBubble.id)*/

                    document.body.appendChild(newBubble)

                    newBubble.onclick = async function(){
                            associatedQuest = await getQuest(newBubble.className)
                            options = associatedQuest.Options
                            console.log('clicked')
                            console.log(options[i])
                            resultDict[questID] = options[i]
                            console.log(resultDict)
                            action = true
                            return action
                        }
                }
       }

     //create numeric question element
      function newNumeric(questID){
         let inputBox = document.createElement("input")
         inputBox.setAttribute("type", "number")
         inputBox.setAttribute("id", "userInput")
         document.body.appendChild(inputBox)
         resultDict[questID] = null
         inputBox.onkeyup=function(){
            let numReply = document.getElementById('userInput').value
            resultDict[questID] = numReply; console.log(resultDict)
            action = true
            return action
         }
      }

      //create boolean (checkbox) question element
      function newCheck(questID){
          let checkBox = document.createElement("input")
          checkBox.setAttribute("type", "checkbox")
          checkBox.setAttribute("id", "checkInput")
          document.body.appendChild(checkBox)
          resultDict[questID] = false;
          checkBox.onclick=function(){
              let boolean = document.getElementById('checkInput').checked
              resultDict[questID] = boolean; console.log(resultDict)
              action = true
              return action
          }
      }

        //show responses on screen
        var newDiv = document.createElement('div');
        document.body.appendChild(newDiv);
        var resultButton = document.createElement('button')
        resultButton.setAttribute("id","done")
        resultButton.innerHTML = "Results"
        document.body.appendChild(resultButton)
        document.getElementById("done").onclick = function() {
               
                let responsesDiv = document.createElement('div');
                document.body.appendChild(responsesDiv);
                let yourResponses = document.createTextNode("Your Responses:")
                document.body.appendChild(yourResponses);
                Object.keys(resultDict).forEach(async function(key) {
                    //currQuest = await getQuest(key).Question; console.log("TEST" + await (getQuest(key)).Question)
                    let answering = await getQuest(key)
                    let currAnswering = answering.Question
                    let response = "Question ID: " + currAnswering + " "+ resultDict[key]
                    let newDiv = document.createElement('div');
                    document.body.appendChild(newDiv);
                    toShow = document.createTextNode(response)
                    document.body.appendChild(toShow);
                });
                alert("Please wait for the model to train.")
                riskUI.run()   
        }   //end on "results" click function
        window.survey = survey
})()

}
}

//On page startup
window.onload = function() {
    if (document.getElementById('workSpace')) {
        survey.ui(document.getElementById('workSpace'))
    }
}