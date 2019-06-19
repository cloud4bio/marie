console.log('marie loadeds...')


marie={}


marie.ui=function(div){ 
    marie.div=div||document.getElementById('workSpace')

    if(marie.div){

        //Header and text
        let h = `<h3>Flower Sorting Project</h3>`
        marie.div.innerHTML=h

        //FLOWER SORTING PROJECT
 
        //portions of code adapted from https://codelabs.developers.google.com/codelabs/tfjs-training-regression/#0
        //tutorial on using TensorFlow.js for creating basic neural network models

        async function getData() {
          const irisOriginalFile = await fetch('https://episphere.github.io/ai/data/iris.json');  
          const irisFile = await irisOriginalFile.json()  
          console.log("Dataset size: " + irisFile.length)
          const irisSorted = irisFile.map(flower => ({
            sepalLen: flower.sepalLength,
            sepalWid: flower.sepalWidth, 
            petalLen: flower.petalLength,
            petalWid: flower.petalWidth,
            correctSpecies: flower.species,}))
          return irisSorted
        }
        
        /*
        async function toTensor(){
            const irisOriginalFile = await fetch('https://episphere.github.io/ai/data/iris.json');  
            const irisFile = await irisOriginalFile.json() 
            const irisTensor= tf.tensor2d(irisFile.map(flower => [
            flower.sepal_length, flower.sepal_width, flower.petal_length, flower.petal_width
            ]),[150,4])     
            //144 data items in iris dataset, with 4 values each
            //console.log((irisTensor.shape))
            irisTensor.data().then(data => console.log(data))
            return irisTensor
        }  
        
        toTensor()*/

        async function run() {
          const irisData = await getData()
          const values = irisData.map(d => ({
          x: d.sepalLen,
          y: d.sepalWid,
          }))

          tfvis.render.scatterplot(
          {name: 'TEST GRAPH: Sepal Width vs Length'},
          {values}, 
          {
           xLabel: 'Sepal Length',
           yLabel: 'Sepal Width',
           height: 300
          }
          )
          // Create the model
        const model = createModel();  
        tfvis.show.modelSummary({name: 'Model Summary'}, model)

        }
        run()  
        
        function createModel() {
            // Create a sequential model
            const model = tf.sequential() 
            // Add a hidden layer
            //4 inputs (sepal and petal length and width)
            //1 unit -> 1 weight fo each input value 
            model.add(tf.layers.dense({inputShape: [4], units: 1})) 
            // Add an output layer
            //3 units -> 3 outputs: one for probabiilty of each species of iris
            model.add(tf.layers.dense({units: 3}));
            return model;
         }
        
        //need to shuffle, normalize, and convert data to tensors
       async function prepData(){

          const irisOriginalFile = await fetch('https://episphere.github.io/ai/data/iris.json');  
          const irisFile = await irisOriginalFile.json()  

            return tf.tidy(
            () => {  
                tf.util.shuffle(data)

                //convert data to tensors
                const inputData =  tf.tensor2d(irisFile.map(flower => [flower.sepal_length, 
                flower.sepal_width, flower.petal_length, flower.petal_width]),[150,4])

                const outputData = tf.tensor2d(irisFile.map(flower => 
                ({correctSpecies: flower.species})), [150,1])

                //normalizing input data from 0 to 1
                //maybe not necessary for this case?
                /*const inputMax = inputData.max()
                const inputMin = inputData.min()
                const normalizedInputs = inputData.sub(inputMin).div(inputMax.sub(inputMin))*/
            })  
       }

       async function modelTraining(model,inputs,labels){
           model.compile({
                optimizer: tf.train.adam(),
                loss: tf.losses.meanSquaredError
           })
           const batchSize = 20;    //will use sample of dataset of size 20 on each run
           const epochs = 60;       //will run through the data set this number of times

           return await model.fit(inputs, labels, {
             batchSize,
             epochs,
             callbacks: tfvis.show.fitCallbacks(
             { name: 'Training Performance' },
             ['loss'], 
             { 
                height: 200, 
                callbacks: ['onEpochEnd']
             }
             )
          })
       }


    } //close [if(marie.div)]
}   //close [marie.ui=function(div)]

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        marie.ui(document.getElementById('workSpace'))    
    }
}