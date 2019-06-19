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
          const irisFile = await irisOriginalFile.json();  
          const irisSorted = irisFile.map(flower => ({
            sepalLen: flower.sepalLength,
            sepalWid: flower.sepalWidth, 
            petalLen: flower.petalLength,
            petalWid: flower.petalWidth,
            correctSpecies: flower.species,}))
          return irisSorted
        }
          
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
        

    } //close if(marie.div)
}   //close marie.ui=function(div)

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        marie.ui(document.getElementById('workSpace'))    
    }
}