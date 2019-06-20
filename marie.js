console.log('marie loadeds...')


marie={}


marie.ui=function(div){ 
    marie.div=div||document.getElementById('workSpace')

    if(marie.div){

        //Header and text
        let h = `<h3>Flower Sorting Project</h3>`
        marie.div.innerHTML=h

        //FLOWER SORTING PROJECT

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
          console.log(irisSorted)
          return irisSorted
        }

getData()

	marie.irisAxes=async function(){ // https://codelabs.developers.google.com/codelabs/tfjs-training-regression
   	 	let irises = await getData()
   	 	let x_values = irises.map(d=>{return{
        	x:d.sepalLen,
    	}})
    	let y_values = irises.map(d=>{return{
        	y:d.sepalWid,
    	}})
		TESTER = document.getElementById('tester');
		Plotly.plot( TESTER, [{
			x: [x_values],
			y: [y_values] }], {
			margin: { t: 0 } } );
	}

marie.irisAxes()
//not sure why document.createElement('tester') isn't working programmatically
//havingto create division statically through index.html
/*TESTER = document.getElementById('tester');
	Plotly.plot( TESTER, [{
	x: [1, 2, 3, 4, 5],
	y: [1, 2, 4, 8, 16] }], {
	margin: { t: 0 } } );*/

//trying to implement Plotly
/*
    marie.getScript=async function(url){
        url=url||'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js'
        return new Promise(function(resolve, reject) {
            let s = document.createElement('script')
            s.src=url
            s.onload=resolve
            s.onerror=reject
            document.head.appendChild(s)
        })
    }

     marie.plot=async function(div,traces,layout){
        if(typeof(Plotly)=='undefined'){
            await marie.getScript('https://cdn.plot.ly/plotly-latest.min.js')
        }
        div=div||document.createElement('div')
        traces=traces||[{
	   x: [1, 2, 3, 4, 5],
	   y: [1, 2, 4, 8, 16]}]
        layout=layout||{margin: { t: 0 } };
	   Plotly.plot(div,traces,layout)
	   return div
    }
    
    marie.plot();console.log("worked")
    */

    } //close [if(marie.div)]
}   //close [marie.ui=function(div)]

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        marie.ui(document.getElementById('workSpace'))    
    }
}