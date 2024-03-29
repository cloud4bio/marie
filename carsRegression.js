console.log('Hello TensorFlow');

carsUI={}

carsUI.ui=function(div){ 
    carsUI.div=div||document.getElementById('workSpace')

    if(carsUI.div){
var x = document.createElement("H2");
var title = document.createTextNode("TensorFlow.js Examples");

//this model will take one number (horsepower) and predict one number (MPG)
x.appendChild(title);
var y = document.createElement("H3");
var subtitle = document.createTextNode("Cars Model for Predictions with 2D Data")
var z = document.createElement("H3");
var nextsub = document.createTextNode("Iris Model for Classification")
y.appendChild(subtitle)
z.appendChild(nextsub)
document.body.appendChild(x);
document.body.appendChild(y);
document.body.appendChild(z);


/**
 * Get the car data reduced to just the variables we are interested
 * and cleaned of missing data.
 */
async function getData() {
  const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');  
  const carsData = await carsDataReq.json();  
  const cleaned = carsData.map(car => ({
    mpg: car.Miles_per_Gallon,
    horsepower: car.Horsepower,
  }))
  .filter(car => (car.mpg != null && car.horsepower != null));
  
  return cleaned;
}

async function run() {
  // Load and plot the original input data that we are going to train on.
  const data = await getData();
  const values = data.map(d => ({
    x: d.horsepower,
    y: d.mpg,
  }));

  tfvis.render.scatterplot(
    {name: 'Horsepower v MPG'},
    {values}, 
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300
    }
  );

  // Create the model
  const model = createModel();  
  tfvis.show.modelSummary({name: 'Model Summary'}, model);

  // Convert the data to a form we can use for training.
  const tensorData = convertToTensor(data);
  const {inputs, labels} = tensorData;

  // Train the model  
  await trainModel(model, inputs, labels);
  console.log('Done Training');

  // Make some predictions using the model and compare them to the
  // original data
  testModel(model, data, tensorData);
}

function createModel() {
  // Create a sequential model
  const model = tf.sequential(); 
  
  // Add a hidden layer
  model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
  
  //two layers with 25 each works well
  
  model.add(tf.layers.dense({units: 10, activation: 'sigmoid', useBias: true}));

  //model.add(tf.layers.dense({units: 25, activation: 'sigmoid', useBias: true}));

  // Add an output layer
  model.add(tf.layers.dense({units: 1, useBias: true}));

  return model;
}

/**
 * Convert the input data to tensors that we can use for machine 
 * learning. We will also do the important best practices of _shuffling_
 * the data and _normalizing_ the data
 * MPG on the y-axis.
 */
function convertToTensor(data) {
  // Wrapping these calculations in a tidy will dispose any 
  // intermediate tensors.
  
  return tf.tidy(() => {
    // Step 1. Shuffle the data    
    tf.util.shuffle(data);

    // Step 2. Convert data to Tensor
    const inputs = data.map(d => d.horsepower)
    const labels = data.map(d => d.mpg);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();  
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
    //sub subtracts the second tensor from the first
    //div divides every value by the given value (a scalar in this case)
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    }
  });  
}

async function trainModel(model, inputs, labels) {

  //0.01 looks best
  const learningRate = 0.2  //try adjusting this parameter

  // Prepare the model for training.  
  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });
  
  const batchSize = 32;
  const epochs = 50;
  
  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss'], 
      { height: 200, callbacks: ['onEpochEnd'] }
    )
  });
}

function testModel(model, inputData, normalizationData) {
  const {inputMax, inputMin, labelMin, labelMax} = normalizationData;  
  
  // Generate predictions for a uniform range of numbers between 0 and 1;
  // We un-normalize the data by doing the inverse of the min-max scaling 
  // that we did earlier.
  const [xs, preds] = tf.tidy(() => {
    
    const xs = tf.linspace(0, 1, 100);        //generate values within an interval
    //[numExamples, numFeaturesPerExample]
    const preds = model.predict(xs.reshape([100, 1]));      
    
    const unNormXs = xs
      .mul(inputMax.sub(inputMin))
      .add(inputMin);
    
    const unNormPreds = preds
      .mul(labelMax.sub(labelMin))
      .add(labelMin);
    
    // Un-normalize the data
    return [unNormXs.dataSync(), unNormPreds.dataSync()];
  });
  
 
  const predictedPoints = Array.from(xs).map((val, i) => {
    return {x: val, y: preds[i]}
  });
  
  const originalPoints = inputData.map(d => ({
    x: d.horsepower, y: d.mpg,
  }));
  
  
  tfvis.render.scatterplot(
    {name: 'Model Predictions vs Original Data'}, 
    {values: [originalPoints, predictedPoints], series: ['original', 'predicted']}, 
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300
    }
  );
}

  var newDiv = document.createElement('div');
        document.body.appendChild(newDiv);
        var carsButton = document.createElement('button')
        carsButton.setAttribute("id","cars")
        carsButton.innerHTML = "Cars Model"
        document.body.appendChild(carsButton)
        document.getElementById("cars").onclick = function() {
                run()
        }
  
  var nextDiv = document.createElement('div');
        document.body.appendChild(nextDiv);
        var irisButton = document.createElement('button')
        irisButton.setAttribute("id","iris")
        irisButton.innerHTML = "Iris Model"
        document.body.appendChild(irisButton)
        document.getElementById("iris").onclick = function() {
                tensorUI.doIris()
        }
  
    }
}
//On page startup
window.onload = function() {
    if (document.getElementById('workSpace')) {
        carsUI.ui(document.getElementById('workSpace'))
        tensorUI.ui(document.getElementById('workSpace'))
    }
}
