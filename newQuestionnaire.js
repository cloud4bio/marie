/*NEW WAY
        async function readByIDs(){
            //q = readJSON()
            q = await (await fetch('https://cloud4bio.github.io/marie/questions.json')).json()
            qq={}
            q.forEach(qi=>{qq[qi['@id']]=qi})
            //console.log(qq)
            console.log(qq[314])
            return qq       
        }

        var questionsObj = readByIDs()      //convert from Promise to value?
        console.log(questionsObj)

        async function getQuest(givenID){
            thisQuest = questionsObj[givenID]
            return thisQuest
            //console.log(thisQuest)
        }
        
        currQuestion = getQuest(314)
        console.log(currQuestion)
   */