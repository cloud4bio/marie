console.log('tensorflow iris model loaded...')

tensorUI={}

tensorUI.ui=function(div){ 
    tensorUI.div=div||document.getElementById('workSpace')

    if(tensorUI.div){
        
        //Header and text
        let h = `<h3>TensorFlow.js Iris Classification</h3>`
        let description = '<p>Please wait for the model to load.</p>'
        tensorUI.div.innerHTML=h+description

        //FOLLOWING CODE FROM TUTORIAL:
        //https://www.youtube.com/watch?v=sLtXkU4QjxI&list=PLQY2H8rRoyvwLbzbnKJ59NkZvQAW9wLbx&index=20&t=0s
        
        //Obtain data about irises
        const iris_classes = ['setosa','versicolor','virginica']
        const iris_num_classes = iris_classes.length

        //should be reading from file
        const iris_data = [
          [5.1, 3.5, 1.4, 0.2, 0], [4.9, 3.0, 1.4, 0.2, 0], [4.7, 3.2, 1.3, 0.2, 0],
          [4.6, 3.1, 1.5, 0.2, 0], [5.0, 3.6, 1.4, 0.2, 0], [5.4, 3.9, 1.7, 0.4, 0],
          [4.6, 3.4, 1.4, 0.3, 0], [5.0, 3.4, 1.5, 0.2, 0], [4.4, 2.9, 1.4, 0.2, 0],
          [4.9, 3.1, 1.5, 0.1, 0], [5.4, 3.7, 1.5, 0.2, 0], [4.8, 3.4, 1.6, 0.2, 0],
          [4.8, 3.0, 1.4, 0.1, 0], [4.3, 3.0, 1.1, 0.1, 0], [5.8, 4.0, 1.2, 0.2, 0],
          [5.7, 4.4, 1.5, 0.4, 0], [5.4, 3.9, 1.3, 0.4, 0], [5.1, 3.5, 1.4, 0.3, 0],
          [5.7, 3.8, 1.7, 0.3, 0], [5.1, 3.8, 1.5, 0.3, 0], [5.4, 3.4, 1.7, 0.2, 0],
          [5.1, 3.7, 1.5, 0.4, 0], [4.6, 3.6, 1.0, 0.2, 0], [5.1, 3.3, 1.7, 0.5, 0],
          [4.8, 3.4, 1.9, 0.2, 0], [5.0, 3.0, 1.6, 0.2, 0], [5.0, 3.4, 1.6, 0.4, 0],
          [5.2, 3.5, 1.5, 0.2, 0], [5.2, 3.4, 1.4, 0.2, 0], [4.7, 3.2, 1.6, 0.2, 0],
          [4.8, 3.1, 1.6, 0.2, 0], [5.4, 3.4, 1.5, 0.4, 0], [5.2, 4.1, 1.5, 0.1, 0],
          [5.5, 4.2, 1.4, 0.2, 0], [4.9, 3.1, 1.5, 0.1, 0], [5.0, 3.2, 1.2, 0.2, 0],
          [5.5, 3.5, 1.3, 0.2, 0], [4.9, 3.1, 1.5, 0.1, 0], [4.4, 3.0, 1.3, 0.2, 0],
          [5.1, 3.4, 1.5, 0.2, 0], [5.0, 3.5, 1.3, 0.3, 0], [4.5, 2.3, 1.3, 0.3, 0],
          [4.4, 3.2, 1.3, 0.2, 0], [5.0, 3.5, 1.6, 0.6, 0], [5.1, 3.8, 1.9, 0.4, 0],
          [4.8, 3.0, 1.4, 0.3, 0], [5.1, 3.8, 1.6, 0.2, 0], [4.6, 3.2, 1.4, 0.2, 0],
          [5.3, 3.7, 1.5, 0.2, 0], [5.0, 3.3, 1.4, 0.2, 0], [7.0, 3.2, 4.7, 1.4, 1],
          [6.4, 3.2, 4.5, 1.5, 1], [6.9, 3.1, 4.9, 1.5, 1], [5.5, 2.3, 4.0, 1.3, 1],
          [6.5, 2.8, 4.6, 1.5, 1], [5.7, 2.8, 4.5, 1.3, 1], [6.3, 3.3, 4.7, 1.6, 1],
          [4.9, 2.4, 3.3, 1.0, 1], [6.6, 2.9, 4.6, 1.3, 1], [5.2, 2.7, 3.9, 1.4, 1],
          [5.0, 2.0, 3.5, 1.0, 1], [5.9, 3.0, 4.2, 1.5, 1], [6.0, 2.2, 4.0, 1.0, 1],
          [6.1, 2.9, 4.7, 1.4, 1], [5.6, 2.9, 3.6, 1.3, 1], [6.7, 3.1, 4.4, 1.4, 1],
          [5.6, 3.0, 4.5, 1.5, 1], [5.8, 2.7, 4.1, 1.0, 1], [6.2, 2.2, 4.5, 1.5, 1],
          [5.6, 2.5, 3.9, 1.1, 1], [5.9, 3.2, 4.8, 1.8, 1], [6.1, 2.8, 4.0, 1.3, 1],
          [6.3, 2.5, 4.9, 1.5, 1], [6.1, 2.8, 4.7, 1.2, 1], [6.4, 2.9, 4.3, 1.3, 1],
          [6.6, 3.0, 4.4, 1.4, 1], [6.8, 2.8, 4.8, 1.4, 1], [6.7, 3.0, 5.0, 1.7, 1],
          [6.0, 2.9, 4.5, 1.5, 1], [5.7, 2.6, 3.5, 1.0, 1], [5.5, 2.4, 3.8, 1.1, 1],
          [5.5, 2.4, 3.7, 1.0, 1], [5.8, 2.7, 3.9, 1.2, 1], [6.0, 2.7, 5.1, 1.6, 1],
          [5.4, 3.0, 4.5, 1.5, 1], [6.0, 3.4, 4.5, 1.6, 1], [6.7, 3.1, 4.7, 1.5, 1],
          [6.3, 2.3, 4.4, 1.3, 1], [5.6, 3.0, 4.1, 1.3, 1], [5.5, 2.5, 4.0, 1.3, 1],
          [5.5, 2.6, 4.4, 1.2, 1], [6.1, 3.0, 4.6, 1.4, 1], [5.8, 2.6, 4.0, 1.2, 1],
          [5.0, 2.3, 3.3, 1.0, 1], [5.6, 2.7, 4.2, 1.3, 1], [5.7, 3.0, 4.2, 1.2, 1],
          [5.7, 2.9, 4.2, 1.3, 1], [6.2, 2.9, 4.3, 1.3, 1], [5.1, 2.5, 3.0, 1.1, 1],
          [5.7, 2.8, 4.1, 1.3, 1], [6.3, 3.3, 6.0, 2.5, 2], [5.8, 2.7, 5.1, 1.9, 2],
          [7.1, 3.0, 5.9, 2.1, 2], [6.3, 2.9, 5.6, 1.8, 2], [6.5, 3.0, 5.8, 2.2, 2],
          [7.6, 3.0, 6.6, 2.1, 2], [4.9, 2.5, 4.5, 1.7, 2], [7.3, 2.9, 6.3, 1.8, 2],
          [6.7, 2.5, 5.8, 1.8, 2], [7.2, 3.6, 6.1, 2.5, 2], [6.5, 3.2, 5.1, 2.0, 2],
          [6.4, 2.7, 5.3, 1.9, 2], [6.8, 3.0, 5.5, 2.1, 2], [5.7, 2.5, 5.0, 2.0, 2],
          [5.8, 2.8, 5.1, 2.4, 2], [6.4, 3.2, 5.3, 2.3, 2], [6.5, 3.0, 5.5, 1.8, 2],
          [7.7, 3.8, 6.7, 2.2, 2], [7.7, 2.6, 6.9, 2.3, 2], [6.0, 2.2, 5.0, 1.5, 2],
          [6.9, 3.2, 5.7, 2.3, 2], [5.6, 2.8, 4.9, 2.0, 2], [7.7, 2.8, 6.7, 2.0, 2],
          [6.3, 2.7, 4.9, 1.8, 2], [6.7, 3.3, 5.7, 2.1, 2], [7.2, 3.2, 6.0, 1.8, 2],
          [6.2, 2.8, 4.8, 1.8, 2], [6.1, 3.0, 4.9, 1.8, 2], [6.4, 2.8, 5.6, 2.1, 2],
          [7.2, 3.0, 5.8, 1.6, 2], [7.4, 2.8, 6.1, 1.9, 2], [7.9, 3.8, 6.4, 2.0, 2],
          [6.4, 2.8, 5.6, 2.2, 2], [6.3, 2.8, 5.1, 1.5, 2], [6.1, 2.6, 5.6, 1.4, 2],
          [7.7, 3.0, 6.1, 2.3, 2], [6.3, 3.4, 5.6, 2.4, 2], [6.4, 3.1, 5.5, 1.8, 2],
          [6.0, 3.0, 4.8, 1.8, 2], [6.9, 3.1, 5.4, 2.1, 2], [6.7, 3.1, 5.6, 2.4, 2],
          [6.9, 3.1, 5.1, 2.3, 2], [5.8, 2.7, 5.1, 1.9, 2], [6.8, 3.2, 5.9, 2.3, 2],
          [6.7, 3.3, 5.7, 2.5, 2], [6.7, 3.0, 5.2, 2.3, 2], [6.3, 2.5, 5.0, 1.9, 2],
          [6.5, 3.0, 5.2, 2.0, 2], [6.2, 3.4, 5.4, 2.3, 2], [5.9, 3.0, 5.1, 1.8, 2],
        ];

        //testSplit represents the fraction of data used for testing (e.g. 0.2)
        function getIrisData(testSplit){
            return tf.tidy(() => {
                const dataByClass = [];
                const targetsByClass = [];
                for(let i = 0; i < iris_classes.length; ++i){
                    dataByClass.push([]);
                    targetsByClass.push([]);
                }

                //sort data by class (type of flower)
                for(const example of iris_data){
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
                for(let i =0; i < iris_classes.length; ++i){
                    const[xTrain, yTrain, xTest, yTest] = 
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

                console.log("x Training: " + xTrains)
                console.log("y Training: " + yTrains)
                console.log("x Testing: " + xTests)
                console.log("y Testing: " + yTests)
                
                return [
                    tf.concat(xTrains,concatAxis), tf.concat(yTrains, concatAxis),
                    tf.concat(xTests,concatAxis), tf.concat(yTests, concatAxis)]
            })
        }

        function convertToTensors(data, targets, testSplit){
             console.log("converting to tensors")
            const numExamples = data.length;
            if(numExamples != targets.length){
                throw new Error('data and split have different numbers of examples');
            }

            //may need to round depending on what testSplit ratio was given
            const numTestExamples = Math.round(numExamples * testSplit);
            const numTrainExamples = numExamples - numTestExamples;

            const xDims = data[0].length;

            //create 2D tensor to hold feature data
            const xs = tf.tensor2d(data, [numExamples, xDims]);

            //create a 1D tensor to hold labels, and convert number label from
            //the set {0.1.2} into one-hot encoding (e.g. 0 --> [1,0,0])
            const ys = tf.oneHot(tf.tensor1d(targets).toInt(), iris_num_classes);

            //split data into training and test tests, using slice
            const xTrain = xs.slice([0,0], [numTrainExamples, xDims]);
            const xTest = xs.slice([numTrainExamples,0], [numTestExamples, xDims]);
            const yTrain = ys.slice([0,0], [numTrainExamples, iris_num_classes]);
            const yTest = ys.slice([0,0], [numTestExamples, iris_num_classes]);
            return [xTrain, yTrain, xTest, yTest];
        }

        async function trainModel(xTrain, yTrain, xTest, yTest){
            const model = tf.sequential();
            const learningRate = 0.01;
            const numberOfEpochs = 40;
            const optimizer = tf.train.adam(learningRate);

            //one layer with 10 neurons
            model.add(tf.layers.dense(
                {units: 10, activation: 'sigmoid', inputShape: [xTrain.shape[1]]}));
                //sigmoid produces output between 0 and 1
            
            //second layer with 3 neurons
            model.add(tf.layers.dense(
                {units: 3, activation: 'softmax'}));    //3 units because classifying 3 types of flower
                //softmax normalizes values so outputs all add up to 1

            model.compile({
                optimizer: optimizer,
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']});

            const surface = { name: 'show.fitCallbacks', tab: 'Training' };
            //training the model
            const history = await model.fit(xTrain, yTrain,
                {
                    epochs: numberOfEpochs, validationData: [xTest, yTest],
                    callbacks: 
                    //plot the loss and accuracy over batches
                    //1 epoch = 1 forward+backwards pass through ALL training examples
                    //i.e. if 1000 training examples and batch size = 250, 
                    //will take 4 iterations to finish 1 epoch
                    tfvis.show.fitCallbacks(surface, ['loss', 'acc'])
                    /*{
                        onEpochEnd: async (epoch, logs) => {
                            //watch the loss decrease :)
                            console.log("Epoch: " + epoch + " Logs: " + logs.loss);
                            await tf.nextFrame();
                           
                        }
                    }*/
                });
            return model;
        }


        async function doIris(){
            const [xTrain, yTrain, xTest, yTest] = getIrisData(0.2); //reserve 20% of data for testing
            model = await trainModel(xTrain, yTrain, xTest, yTest);

            //test on specific cases
            const input = tf.tensor2d([5.8, 2.7, 5.1, 1.9], [1,4]);
            console.log("input: " + input)
            const prediction = model.predict(input);
            alert("Probabilties for each flower: " + prediction);  //show distribution of probabilities

            const predictionWithArgMax = model.predict(input).argMax(-1).dataSync();
            alert("Most likely flower: " + predictionWithArgMax);    //show which label is more likely

            const xData = xTest.dataSync();
            const yTrue = yTest.argMax(-1).dataSync();

            const predictions = await model.predict(xTest);
            const yPred = predictions.argMax(-1).dataSync();

            var correct = 0;
            var wrong = 0;

            for(var i=0; i<yTrue.length; i++){
                if(yTrue[i] == yPred[i]){
                    correct++;
                } else{
                    wrong++;
                }
            }
            alert("Prediction error rate: " + (wrong / yTrue.length));
            //good if error rate is low
        }

        doIris()

        //tfvis.visor().surface({name: 'Test', tab: 'Input Data'});
/*
        async function getIris(){
             const irisOriginalFile = await fetch('https://episphere.github.io/ai/data/iris.json');  
             const iris_data = await irisOriginalFile.json()
             //console.log(iris_data)
             return iris_data 
        }
        
        getIris().then(function(result) {
            iris_data = result
            //console.log(iris_data)
        })*/

    }
}

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        tensorUI.ui(document.getElementById('workSpace'))    
    }
}