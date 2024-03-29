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
            //url=url||'obviousData.csv'
            url=url||'validationCohort.csv'
            //url=url||'artificiallySelectedData.csv'
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

        async function overSample(data, reserveNum, factor){
            console.log(data.length)
            var reserved = []
            var toMultiply = []
            var numTraining = reserveNum
            reserved = data.slice(0,numTraining)
            toMultiply = data.slice(numTraining)
            for(i = 0; i < factor - 1; i++){
                toMultiply = toMultiply.concat(toMultiply)
            }
            
            let both = []
            both.push(reserved)
            both.push(toMultiply)
            return both
        }

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
                   // if(newObj.time_of_onset <= 5){
                    if(newObj.time_of_onset <= minParticipationYears){              //TEST: cancer development directly equal to family history
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
            
            console.log('got cancer:' + gotCancer.length)
            //create balanced cohort (same number of each observed outcome)
            let shuffledNoCancer = shuffle(noCancer)
            let shuffledGotCancer = shuffle(gotCancer)

            let testingFraction = 0.2
            let testingReserve = testingFraction * gotCancer.length
            let factor = 1
            let split =  await overSample(shuffledGotCancer, testingReserve, factor)
            let reservedCancer = split[0]
            let multiplied = split[1]

            let reservedNoCancer = shuffledNoCancer.slice(0, testingReserve)
            let remainingCancer = shuffledNoCancer.slice(testingReserve)
            //console.log('reserved')
            //console.log(multiplied)
            
            //SHOULDN'T BE CHOOSING A NEW COHORT EACH RUN
            let narrowedNoCancer = []
            narrowedNoCancer = remainingCancer.slice(0,multiplied.length)
            
            let balancedTraining = multiplied.concat(narrowedNoCancer)
            let balancedTesting = reservedCancer.concat(reservedNoCancer)

            console.log(balancedTraining.length)
            console.log(balancedTesting.length)
            let balancedCohort = [balancedTraining, balancedTesting]
            console.log(balancedCohort)
            return balancedCohort

            //return processedData
        }
        //testSplit represents the fraction of data used for testing (e.g. 0.2)
        async function getCancerData(){
            original_cancer_data = await csv2json()
            processedData = await processData(original_cancer_data)
            //shuffle data
            //cancer_data = shuffle(processedData)
            const training_data = shuffle(processedData[0])
            const testing_data = shuffle(processedData[1])

            console.log("data: ")
            console.log(training_data)
            console.log(testing_data)
            
            return tf.tidy(() => {
                //alternative approach, not separating by classes
                const trainData = []
                const trainTargets = []
                const testData = []
                const testTargets = []

               /*
                const dataByClass = [];
                const targetsByClass = [];
                for(let i = 0; i < outcomes.length; ++i){
                    dataByClass.push([]);
                    targetsByClass.push([]);
                }*/

                //sort data by class (whether or not cancer developed)
                let total_length = training_data.length + testing_data.length
                var example;
                var cat;
                for(let i = 0; i < total_length; i++){ 
                    if(i < training_data.length){
                        example = training_data[i]
                        cat = 'training'
                    } else {
                        example = testing_data[i - training_data.length]
                        cat = 'testing'
                    }

                   // console.log(example)
                   // example = cancer_data[i]
                    //const target = [parseInt(example.cancerWithinInterval)];
                    const target = [parseInt(example.cancerWithinInterval)];
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
                    //allData.push(data)
                    //allTargets.push(target)

                    if(cat == 'training'){
                        trainData.push(data)
                        trainTargets.push(target)
                    } else if(cat == 'testing'){
                        testData.push(data)
                        testTargets.push(target)
                    }
                    
                    /*
                    dataByClass[target].push(data);
                    console.log("target: " + target)
                    targetsByClass[target].push(target);
                   */
                }
                
                console.log("filtered training data: ")
                console.log(trainData)
                console.log("filtered testing data: ")
                console.log(testData)
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
                
                const allData = trainData.concat(testData)
                const allTargets = trainTargets.concat(testTargets)
                const numTest = testData.length
                const numTrain = trainData.length

                //alternative approach, not separating by classes
                const[allXTrains, allYTrains, allXTests, allYTests] = 
                    convertToTensors(allData, allTargets, numTest, numTrain)
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
        function convertToTensors(data, targets, numTest, numTrain){
            console.log("converting to tensors")
            const numExamples = data.length;
            if(numExamples != targets.length){
                throw new Error('data and split have different numbers of examples');
            }

            //may need to round depending on what testSplit ratio was given
            //const numTestExamples = Math.round(numExamples * testSplit);
            //console.log('numTestExamples: ' + numTestExamples)
            //everything that isn't reserved as a testing example is used for training
            //const numTrainExamples = numExamples - numTestExamples;

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

            //console.log("training examples: " + numTrain)
            const xTrain = xs.slice([0,0], [numTrain, xDims]);

            const xTest = xs.slice([numTrain,0], [numTest, xDims]);
            //const yTrain = ys.slice([0,0], [numTrainExamples, num_outcomes]);
            //const yTest = ys.slice([0,0], [numTestExamples, num_outcomes]);
            const yTrain = ys.slice([0,0], [numTrain, 1]);
            const yTest = ys.slice([numTrain,0], [numTest, 1]);
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
            const learningRate = 0.1;      //edit
            const numberOfEpochs = 50;      //edit
            const numberPerBatch = 30; //edit
            //Adam optimizer used for classification problems
            const optimizer = tf.train.adam(learningRate);

            console.log("shape" + xTrain.shape)
            //14 neurons for inputs
           // model.add(tf.layers.dense(
            //    {units: 14, activation: 'sigmoid', inputShape: [xTrain.shape[1]]}));
                //sigmoid produces output between 0 and 1
            
            //hidden layer with 10 neurons
            model.add(tf.layers.dense(
                {units: 10, /*activation: 'sigmoid',*/ inputShape: [xTrain.shape[1]], useBias: true}));
                //sigmoid produces output between 0 and 1
            //add more layers in between?

            model.add(tf.layers.dense(
                {units: 12, activation: 'sigmoid', useBias: true}));

            //final layer with 3 neurons
            model.add(tf.layers.dense(
                {units: 1, activation: 'sigmoid', useBias: true}));
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
            const accessData = await getCancerData()
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
            const surface = { name: 'Confusion Matrix', tab: 'Charts' };
            const classNames = ['No Cancer', 'Developed Cancer']
            /*const testxs = xTest.reshape([xTest.length, 1]);
            const labels = yTest.argMax([-1]);
            const preds = model.predict(testxs).argMax([-1]);
            const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
            
            tfvis.show.perClassAccuracy(surface, classAccuracy, classNames);
            labels.dispose();
        */
            let testData = {values: [0, 5 , 2, 1 , 4 , 2 , 7 , 1, 0, 0, 0, 7 , 1, 57], labels:[0]}
            tfvis.render.confusionMatrix(surface, testData);

           /* var testOne = xTrain.slice([1],[1])
            var translated = await testOne.array()
            console.log('translated' + translated)*/

            var predictionArr = []
            /*for(let i = 0; i < xTest.shape[0]; i ++){
                    console.log(i)
                let currOriginal = xTest.slice([i],[1])
                let thisCase = await currOriginal.array()
                console.log(thisCase)
                let currInput = tf.tensor2d(thisCase, [1,14]);
                let currPrediction = model.predict(currInput);
                let currOutput = await currPrediction.array();
                console.log(currOutput)
                predictionArr.push(currOutput[0])
            }*/
           // console.log(predictionArr)

            let currInput = xTest.slice([1],[1])
            console.log(await currInput.array())
                let currPrediction = await model.predict(currInput);
                let currOutput = await currPrediction.array();
                console.log(currOutput)
                predictionArr.push(currOutput[0])

             let SeccurrInput = xTest.slice([2],[1])
             console.log(await SeccurrInput.array())
                let SeccurrPrediction = model.predict(SeccurrInput);
                let SeccurrOutput = await SeccurrPrediction.array();
                console.log(SeccurrOutput)
                predictionArr.push(SeccurrOutput[0])

            console.log(predictionArr)
            
            //MAKE PREDICTIONS
            /*
            let testCase = [0, 8 , 0, 1 , 10 , 3 , 7 , 1, 0, 0, 0, 1 , 0, 52] 
            var input = tf.tensor2d(testCase, [1,14]);
            //const input = tf.tensor1d(testCase);
            console.log("input: " + input)     
            const prediction = model.predict(input);
            const ar1 = await prediction.array();
            //console.log(typeof prediction)
            console.log(ar1)
            const yourRisk = prediction  */
            //console.log(yourRisk[0])    //or at 1?
            //alert("Probabilty of cancer development" + yourRisk);  //show distribution of probabilities
            
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
