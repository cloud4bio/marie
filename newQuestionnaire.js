console.log('new questionnaire loadeds...')

survey = {}

survey.ui = function(div) {
    survey.div = div || document.getElementById('workSpace')

    if (survey.div) {

        //Header and text
        let h = `<h3>Risk Prediction Questionnaire</h3>`
        let more = `<p>Learn more at <a href = "https://github.com/episphere/ai/wiki/cancer-risk-modeling" target = "_blank"> the GitHub Wiki</a>.</p>`
        h += more
        survey.div.innerHTML = h;

(async function(){
        async function readByIDs(url){
            //q = readJSON()
            url = url||'http://localhost:8000/marie/questions.json'     //update to cloud4bio page
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
        startID = 314
        currItem = await getQuest(startID)
        finished = false
        //WHILE LOOP HERE

        while(!finished){
            console.log('not finished')

            //access attributes of question
            var currQuestion = currItem.Question
            var type = currItem.Type
            var currID = currItem.ID
            var guidance = currItem.help
            var nextID = currItem.onDone

            var newDiv = document.createElement('div');
            document.body.appendChild(newDiv);

            var quest = document.createTextNode(currQuestion);
            document.body.appendChild(quest);

            console.log(type)
            createQuest(type, currID);
            if(nextID == 'last'){
                finished = true
            }
            else{
                currItem = await getQuest(nextID)
            }   
        }
        

        function createQuest(type, questID){     //want to input ID too?
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

       function newRadio(questID){
                options = currItem.Options
                
                for(let i=0; i<options.length; i++){
                    let newAnswer = document.createTextNode(options[i])
                    document.body.appendChild(newAnswer);

                    let newBubble = document.createElement("input")
                    newBubble.setAttribute("type", "radio")
                    document.body.appendChild(newBubble)

                    newBubble.onclick = function(){
                        //moveOn(nextID);
                        console.log('clicked')
                        }
                    //store result somehow (not sure since multiple choice options are unlimited)
                }
       }

      function newNumeric(questID){
         let inputBox = document.createElement("input")
         inputBox.setAttribute("type", "number")
         inputBox.setAttribute("id", "userInput")
         document.body.appendChild(inputBox)
         inputBox.onkeyup=function(){
            let numReply = document.getElementById('userInput').value
            resultDict[questID] = numReply; console.log(resultDict)
            //moveOn(nextID)
         }
      }

      function newCheck(questID){
          let checkBox = document.createElement("input")
          checkBox.setAttribute("type", "checkbox")
          checkBox.setAttribute("id", "checkInput")
          document.body.appendChild(checkBox)
          checkBox.onclick=function(){
              let boolean = document.getElementById('checkInput').checked
              resultDict[questID] = boolean; console.log(resultDict)
              //moveOn(nextID)
          }
      }

      function moveOn(next){
//
      }

})()

}
}

//On page startup
window.onload = function() {
    if (document.getElementById('workSpace')) {
        survey.ui(document.getElementById('workSpace'))
    }
}