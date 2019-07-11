console.log('breast cancer risk prediction tensorflow model loaded...')

riskUI={}

riskUI.ui=function(div){ 
    riskUI.div=div||document.getElementById('workSpace')

    if(riskUI.div){
        
        //Header and text
        let h = `<h3>TensorFlow.js Breast Cancer Risk Prediction Model</h3>`
        let description = '<p>Please wait for the model to load.</p>'
        riskUI.div.innerHTML=h+description

        const outcomes = ['developed_cancer','no_cancer']
        const num_outcomes = outcomes.length
        
        //miniData.csv file contains the first 250 rows 

       // const cancer_data = [] 


         /*async function getData() {
          const cancer_data = await fetch('http://localhost:8000/marie/miniData.csv')
         }*/

        csv2json=async function(url){
            url=url||'http://localhost:8000/marie/miniData.csv'
            const rr = (await (await fetch(url)).text()).split('\n').map(r=>r.split(',')) //rows
            const hh = rr[0] // headers
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
        - age of study exit (study.entry.exit)
        - disease status (observed.outcome)
        - years after study entry until development of disease (time.of.onset)
        - years subject is followed up on (observed.followup)
        */

        /*
        Output should be distribution of probabilties
        between future cancer development yes/no
        (Make dependent on how many years ahead?)*/

        //testSplit represents the fraction of data used for testing (e.g. 0.2)
        function getCancerData(testSplit){
            return tf.tidy(() => {
                const dataByClass = [];
                const targetsByClass = [];
                for(let i = 0; i < outcomes.length; ++i){
                    dataByClass.push([]);
                    targetsByClass.push([]);
                }

                //sort data by class (whether or not cancer developed)
                for(const example of cancer_data){
                    const target = example[example.length-1];
                    const data = example.slice(0,example.length-1);
                    dataByClass[target].push(data);
                    targetsByClass[target].push(target);
                }
                console.log(dataByClass);
                console.log(targetsByClass);

                //tensors to hold training and testing datasets
                const xTrains = [];
                const yTrains = [];
                const xTests = [];
                const yTests = [];
                for(let i =0; i < outcomes.length; ++i){
                    const[xTrain, yTrain, xTest, yTest] = 
                        //convert to tensors to be used for training
                        convertToTensors(dataByClass[i], targetsByClass[i], testSplit);
                    xTrains.push(xTrain);
                    yTrains.push(yTrain);
                    xTests.push(xTest);
                    yTests.push(yTest);
                }

                //concatonate testing and training data into 1D tensors
                const concatAxis = 0;
                const test1 = xTrains;
                const test2 = tf.concat(xTrains, concatAxis)
                console.log(test1)
                console.log(test2)
                return [
                    tf.concat(xTrains,concatAxis), tf.concat(yTrains, concatAxis),
                    tf.concat(xTests,concatAxis), tf.concat(yTests, concatAxis)]
            })
        }   //end of getCancerData function

        //define function to convert data to tensors, used in getCancerData()
        function convertToTensors(data, targets, testSplit){
            const numExamples = data.length;
            if(numExamples != targets.length){
                throw new Error('data and split have different numbers of examples');
            }

            //may need to round depending on what testSplit ratio was given
            const numTestExamples = Math.round(numExamples * testSplit);
            //everything that isn't reserved as a testing example is used for training
            const numTrainExamples = numExamples - numTestExamples;

            const xDims = data[0].length;

            //create 2D tensor to hold feature data
            const xs = tf.tensor2d(data, [numExamples, xDims]);

            //create a 1D tensor to hold labels, and convert number label from
            //the set {0,1} into one-hot encoding (e.g. 0 --> [1,0])
            const ys = tf.oneHot(tf.tensor1d(targets).toInt(), num_outcomes);

            //split data into training and test tests, using slice
            //array.slice(a,b) returns from a_th (inclusive) to b_th (exclusive)
            //elements of the array
            //SHOULD THIS INVOLVE A RANDOM ALGORITHM?
            const xTrain = xs.slice([0,0], [numTrainExamples, xDims]);
            const xTest = xs.slice([numTrainExamples,0], [numTestExamples, xDims]);
            const yTrain = ys.slice([0,0], [numTrainExamples, num_outcomes]);
            const yTest = ys.slice([0,0], [numTestExamples, num_outcomes]);
            return [xTrain, yTrain, xTest, yTest];
        }   //end of convertToTensors function

    //train model, minimize loss function
    async function trainModel(xTrain, yTrain, xTest, yTest){
            const model = tf.sequential();
            const learningRate = 0.01;      //edit
            const numberOfEpochs = 40;      //edit
            //Adam optimizer used for classification problems
            const optimizer = tf.train.adam(learningRate);

            //one layer with 10 neurons
            model.add(tf.layers.dense(
                {units: 10, activation: 'sigmoid', inputShape: [xTrain.shape[1]]}));
                //sigmoid produces output between 0 and 1
            
            //add more layers in between?


            //final layer with 3 neurons
            model.add(tf.layers.dense(
                {units: 2, activation: 'softmax'}));    //2 units because classifying into 2 outcomes
                //softmax normalizes values so outputs all add up to 1

            model.compile({
                optimizer: optimizer,
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']});

            //training the model
            const history = await model.fit(xTrain, yTrain,
                {epochs: numberOfEpochs, validationData: [xTest, yTest],
                    callbacks: {
                        onEpochEnd: async (epoch, logs) => {
                            //watch the loss decrease :)
                            console.log("Epoch: " + epoch + " Logs: " + logs.loss);
                            await tf.nextFrame();
                        },
                    }
                });
            return model;
        }   //end of trainModel function


        async function run(){
            const [xTrain, yTrain, xTest, yTest] = getCancerData(0.2); //reserve 20% of data for testing
            model = await trainModel(xTrain, yTrain, xTest, yTest);

            //test on specific cases
            const input = tf.tensor2d(/*A TEST CASE*/);
            const prediction = model.predict(input);
            const yourRisk = prediction[0]  //or at 1?
            alert("Probabilty of cancer development" + yourRisk);  //show distribution of probabilities
            
            const averageRisk = SOME_CONSTANT;
            //use baseline risk instead of average risk? 
            //then not possible to be below baseline risk

            if(yourRisk > averageRisk){
                alert("Your risk is " + yourRisk - averageRisk + " above average.")
            } else {
                alert("Your risk is " + averageRisk - yourRisk + " below average.")
            }

            //how to test accuracy of model if outputting a probability?
            
            alert("Prediction error rate: " + (wrong / yTrue.length));
            //good if error rate is low
        }

        run()

    }   //end of if(riskUI.div)
}   //end of riskUI.ui=function(div)

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        riskUI.ui(document.getElementById('workSpace'))    
    }
}