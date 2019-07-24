console.log('breast cancer risk prediction tensorflow model loaded...')


riskUI={}

riskUI.ui=function(div){ 
    riskUI.div=div||document.getElementById('workSpace')

    if(riskUI.div){
        //Header and text
        let h = `<h3>TensorFlow.js Breast Cancer Risk Prediction Model</h3>`
        riskUI.div.innerHTML=h

        /*var newDiv = document.createElement('div');
        document.body.appendChild(newDiv);

        var startButton = document.createElement("button");
        startButton.innerHTML = "Train Model & Show Results";

        newDiv.appendChild(startButton);

        // 3. Add event handler
        startButton.addEventListener ("click", function() {
          console.log('clicked');
          riskUI.run()
                  console.log(survey.resultDict)
        });*/

        const outcomes = ['developed_cancer','no_cancer']
        const num_outcomes = outcomes.length

       // const cancer_data = [] 


         /*async function getData() {
          const cancer_data = await fetch('http://localhost:8000/marie/miniData.csv')
         }*/

    
    //make sure that no header labels have periods in them, only underscores
        csv2json=async function(url){
            //miniData.csv file contains the first 250 rows 
            //url=url||'http://localhost:8000/marie/miniData.csv'
            url=url||'http://localhost:8000/marie/validationCohort.csv'
            //url=url||'http://localhost:8000/marie/artificiallySelectedData.csv'
            const rr = (await (await fetch(url)).text()).split('\n').map(r=>r.split(',')) //rows
            const hh = rr[0] // headers

            //remove quotations from headers (temporarily removed them manually)
            for(count = 0; count < hh.length; count++){
                str = hh[count]
                str.replace(/['"]+/g, '')
            }

            return rr.slice(1).map((r,i)=>{
                let y = {}
                r.forEach((v,j)=>{ 
                    if(j!=0){   //skip the row number (for proper alignment of headers)
                        y[hh[j-1]]=v
                    }
                })  //end for each
                return y
            })
        }

        
        /*
        Input variables (many categorical) should be:
        - family history, binary indicator (famhist)
        - age at menarche (menarche_dec)
        - number of child births (parity)
        - age at first birth (birth_dec)
        - age at menopause (agemeno_dec)
        - height (height_dec)
        - body mass index (bmi_dec)
        - use of hormone replacement therapy (rd_menohrt)
        - estrogen/progesterone combined therapy (rd2_everhrt_c)
        - estrogeon only therapy (rd2_everhrt_e)
        - postmenopausal and current HRT user (rd2_currhrt)
        - alcohol in drinks per week (alcoholdweek_dec)
        - ever smoker (ever_smoke)
        - age of study entry (study.entry.age)
        - age of study exit (study.exit.age)
        - disease status (observed.outcome)
        - years after study entry until development of disease (time.of.onset)
        - years subject is followed up on (observed.followup)
        */

        /*
        Output should be distribution of probabilties
        between future cancer development yes/no
        (Make dependent on how many years ahead?)*/

        async function processData(data){
            processedData = []
            minParticipationYears = 5
            let countDeveloped = 0
            let noCancer = []
            let gotCancer = []

            //loop through objects in original data
            for(let i =0; i < data.length; i++){
                newObj = data[i]
                newObj['cancerWithinInterval'] = 0
                if(newObj.observed_followup >= minParticipationYears){
                    //if developed cancer within 5 years
                    if(newObj.time_of_onset <= 5){
                        newObj['cancerWithinInterval'] = 1
                        countDeveloped ++
                        gotCancer.push(newObj)
                    }
                    else{
                        noCancer.push(newObj)       //separate array of those who didn't develop cancer
                    }
                    processedData.push(newObj)      //array of everyone who was in the study >= 5 years
                }
            }
            
            //create balanced cohort (same number of each observed outcome)
            let shuffledNoCancer = shuffle(noCancer)

            //SHOULDN'T BE CHOOSING A NEW COHORT EACH RUN
            let narrowedNoCancer = []
            for(j = 0; j < countDeveloped; j ++){        //assuming more people didn't develop cancer than did 
                narrowedNoCancer.push(shuffledNoCancer[j])
            }
            
            let balancedCohort = gotCancer.concat(narrowedNoCancer)
            //console.log(balancedCohort)
            return balancedCohort

            //return processedData
        }
        //testSplit represents the fraction of data used for testing (e.g. 0.2)
        async function getCancerData(testSplit){
            original_cancer_data = await csv2json()
            processedData = await processData(original_cancer_data)
            //shuffle data
            cancer_data = shuffle(processedData)

            console.log("data: ")
            console.log(cancer_data)

            return tf.tidy(() => {
                //alternative approach, not separating by classes
                const allData = []
                const allTargets = []

               /*
                const dataByClass = [];
                const targetsByClass = [];
                for(let i = 0; i < outcomes.length; ++i){
                    dataByClass.push([]);
                    targetsByClass.push([]);
                }*/

                //sort data by class (whether or not cancer developed)
                for(let i = 0; i < cancer_data.length; i++){
                    example = cancer_data[i]
                    const target = parseInt(example.cancerWithinInterval);    
                    //console.log("observed outcome " + target)
                    //const data = delete example.observed_outcome; 

                    //array of data inputs
                    const data = 
                        [parseInt(example.famhist), 
                        parseInt(example. menarche_dec),
                        parseInt(example.parity),
                        parseInt(example.birth_dec),
                        parseInt(example.agemeno_dec),
                        parseInt(example.height_dec),
                        parseInt(example.bmi_dec),
                        parseInt(example.rd_menohrt),
                        parseInt(example.rd2_everhrt_c),
                        parseInt(example.rd2_everhrt_e),
                        parseInt(example.rd2_currhrt),
                        parseInt(example.alcoholdweek_dec),
                        parseInt(example.ever_smoke),
                        parseInt(example.study_entry_age)]    

                    //alternative approach, not separating by classes
                    allData.push(data)
                    allTargets.push(target)
                    
                    /*
                    dataByClass[target].push(data);
                    console.log("target: " + target)
                    targetsByClass[target].push(target);
                   */
                }
                
                console.log("filtered data: ")
                console.log(allData)
                //console.log("targetsByClass[0] : " + targetsByClass[0]);
                //console.log("targetsByClass[1] : " + targetsByClass[1]);

                //tensors to hold training and testing datasets
                const xTrains = [];
                const yTrains = [];
                const xTests = [];
                const yTests = [];

                /*for(let i =0; i < outcomes.length; ++i){
                    const[xTrain, yTrain, xTest, yTest] = 
                        //convert to tensors to be used for training
                        convertToTensors(dataByClass[i], targetsByClass[i], testSplit);
                    xTrains.push(xTrain);
                    yTrains.push(yTrain);
                    xTests.push(xTest);
                    yTests.push(yTest);
                }*/

                const allInputTrains =[]
                const allOutputTrains = []
                const allInputTests = []
                const allOutputTests = []

                //alternative approach, not separating by classes
                const[allXTrains, allYTrains, allXTests, allYTests] = 
                    convertToTensors(allData, allTargets, testSplit)
                allInputTrains.push(allXTrains)
                allOutputTrains.push(allYTrains)
                allInputTests.push(allXTests)
                allOutputTests.push(allYTests)

                //concatonate testing and training data into 1D tensors
                const concatAxis = 0;

                /*
                console.log("x Training: " + xTrains)
                console.log("y Training: " + yTrains)
                console.log("x Testing: " + xTests)
                console.log("y Testing: " + yTests)


                const concatenated = [
                    tf.concat(xTrains,concatAxis), tf.concat(yTrains, concatAxis),
                    tf.concat(xTests,concatAxis), tf.concat(yTests, concatAxis)]
                console.log("concatenated" + concatenated)*/

                //alternative approach, not separating by classes
                const alternateMerged = [
                    tf.concat(allInputTrains,concatAxis), tf.concat(allOutputTrains, concatAxis),
                    tf.concat(allInputTests,concatAxis), tf.concat(allOutputTests, concatAxis)]
                console.log("all merged" + alternateMerged)

                return alternateMerged
                //return concatenated
            })
        }   //end of getCancerData function

        //define function to convert data to tensors, used in getCancerData()
        function convertToTensors(data, targets, testSplit){
            console.log("converting to tensors")
            const numExamples = data.length;
            if(numExamples != targets.length){
                throw new Error('data and split have different numbers of examples');
            }

            //may need to round depending on what testSplit ratio was given
            const numTestExamples = Math.round(numExamples * testSplit);
            //console.log('numTestExamples: ' + numTestExamples)
            //everything that isn't reserved as a testing example is used for training
            const numTrainExamples = numExamples - numTestExamples;

            const xDims = data[0].length;   //length of each object holding inputs
            //console.log("xDims: " + xDims)
            //create 2D tensor to hold feature data
            const xs = tf.tensor2d(data, [numExamples, xDims]);

            //create a 1D tensor to hold labels, and convert number label from
            //the set {0,1} into one-hot encoding (e.g. 0 --> [1,0])
            //const ys = tf.oneHot(tf.tensor1d(targets).toInt(), num_outcomes);

            const ys = tf.tensor2d(targets,[numExamples,1])

            //console.log("feature data: " + xs)
            //console.log("labels: " + ys)
            //split data into training and test tests, using slice
            //array.slice(a,b) returns from a_th (inclusive) to b_th (exclusive)
            //elements of the array

            console.log("training examples: " + numTrainExamples)
            const xTrain = xs.slice([0,0], [numTrainExamples, xDims]);

            const xTest = xs.slice([numTrainExamples,0], [numTestExamples, xDims]);
            //const yTrain = ys.slice([0,0], [numTrainExamples, num_outcomes]);
            //const yTest = ys.slice([0,0], [numTestExamples, num_outcomes]);
            const yTrain = ys.slice([0,0], [numTrainExamples, 1]);
            const yTest = ys.slice([numTrainExamples,0], [numTestExamples, 1]);
            result = [xTrain, yTrain, xTest, yTest];
            return result
        }   //end of convertToTensors function

    //randomly shuffle order of elements in array
    function shuffle(arr){
        for(i = arr.length-1; i >= 0; i--){
            index = Math.floor(Math.random() * i)   //pick random index
            //swap with last element not yet used
            temp = arr[i];
            arr[i] = arr[index];
            arr[index] = temp;
        }
        return arr
    }

    //use to choose random data items to reserve for use in test set
    //instead: shuffling and then cutting into sections
    /*async function randomSelection(numToChoose,max){
        chosen = []
        while(chosen.length != numToChoose){
            curr = Math.floor(Math.random() * Math.floor(max)) + 1  //return between 1 and last number
            if(!chosen.includes(curr)){
                chosen.push(curr)
            }
        }
        return chosen;
    }*/

    //train model, minimize loss function
    async function trainModel(xTrain, yTrain, xTest, yTest){
            const model = tf.sequential();
            const learningRate = 0.01;      //edit
            const numberOfEpochs = 1;      //edit
            const numberPerBatch = 40; //edit
            //Adam optimizer used for classification problems
            const optimizer = tf.train.adam(learningRate);

            console.log("shape" + xTrain.shape)
            //14 neurons for inputs
           // model.add(tf.layers.dense(
            //    {units: 14, activation: 'sigmoid', inputShape: [xTrain.shape[1]]}));
                //sigmoid produces output between 0 and 1
            
            //hidden layer with 10 neurons
            model.add(tf.layers.dense(
                {units: 8, activation: 'sigmoid', inputShape: [xTrain.shape[1]]}));
                //sigmoid produces output between 0 and 1
            //add more layers in between?

            //final layer with 3 neurons
            model.add(tf.layers.dense(
                {units: 1, activation: 'sigmoid'}));
                //sigmoid used for binary classification

            model.compile({
                optimizer: optimizer,
                loss: 'binaryCrossentropy',
                metrics: ['accuracy']});

            const surface = { name: 'show.fitCallbacks', tab: 'Training' };
            //training the model
            const history = await model.fit(xTrain, yTrain,
                {epochs: numberOfEpochs, batchSize: numberPerBatch, validationData: [xTest, yTest],
                    /*callbacks: {
                        
                        onEpochEnd: async (epoch, logs) => {
                            //watch the loss decrease :)
                            console.log("Epoch: " + epoch + " Logs: " + logs.loss);
                            await tf.nextFrame();
                        },
                    }*/
                    callbacks:
                    tfvis.show.fitCallbacks(surface, ['loss', 'acc'])
                });
                 console.log("weights" + model.getWeights())
                 tfvis.show.modelSummary({name: 'Model Summary'}, model);
                 //console.log(model.summary())
                //tfvis.show.modelSummary(surface, model);
            return model;
        }   //end of trainModel function


        async function run(){
            //alert("here")   //gets here
            const accessData = await getCancerData(0.2)
            //console.log("training arr: " + accessData)
            const [xTrain, yTrain, xTest, yTest] = accessData; 
            //reserve 20% of data for testing
            model = await trainModel(xTrain, yTrain, xTest, yTest);
            //test on specific cases

            userInput = survey.resultDict
            //console.log("user's input: " + userInput)

            var inputArray = []

            var missingValues = false;

            //prepare input array from results dictionairy
            /*
            Object.keys(resultDict).forEach(async function(key) {
                if(resultDict[key] == null){
                    missingValues = true;
                    alert("please answer all of the questions")
                }
                else{
                    inputArray.push(resultDict[key])
                    //ORDER has to be correct
                    //have to transfer to all numerical values
                }
            })*/


            let testCase = [0, 5 , 2, 1 , 4 , 2 , 7 , 1, 0, 0, 0, 7 , 1, 57] 
            var input = tf.tensor2d(testCase, [1,14]);
            //const input = tf.tensor1d(testCase);
            console.log("input: " + input)     
            console.log("wrong format?")
            const prediction = model.predict(input);
            //console.log(typeof prediction)
            console.log(prediction)
            const yourRisk = prediction  
            //console.log(yourRisk[0])    //or at 1?
            //alert("Probabilty of cancer development" + yourRisk);  //show distribution of probabilities
            
            const averageRisk = 912/50000;  //is this an accurate baseline metric?

           /* if(yourRisk > averageRisk){
                alert("Your risk is " + yourRisk - averageRisk + " above average.")
            } else {
                alert("Your risk is " + averageRisk - yourRisk + " below average.")
            }*/

            //how to test accuracy of model if outputting a probability?
            
            //alert("Prediction error rate: " + (wrong / yTrue.length));
            //good if error rate is low
        }
        riskUI.run = run


    }   //end of if(riskUI.div)
}   //end of riskUI.ui=function(div)

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        riskUI.ui(document.getElementById('workSpace'))
        survey.ui(document.getElementById('workSpace'))    
    }
}