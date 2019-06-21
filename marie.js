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

//getData()

	marie.irisAxes=async function(){ // https://codelabs.developers.google.com/codelabs/tfjs-training-regression
   	 	let irises = await getData()

   	 	var trace = {
   	 		x : [],
   	 		y : [],
   	 		mode : 'markers',
   	 		type : 'scatter',
  			marker: { size: 4 }
   	 	}

		var layout = {
  			margin: {t:0},
  			title:{text:'Sepal Width vs Length'},

  			xaxis: {
    		title: {
      			text: 'Sepal Length',
      			font: {
        			family: 'Calibri',
        			size: 14,
        			color: 'Black'
      			}
    		},
  		},
  			yaxis: {
    			title: {
      			text: 'Sepal Width',
      			font: {
        			family: 'Calibri',
        			size: 14,
        			color: 'Black'
      			}
    		}
  		}
	};

		TESTER = document.getElementById('tester');

		var x_axis = ['sepalLength','sepalWidth','petalLength','petalWidth']
		var y_axis = ['sepalLength','sepalWidth','petalLength','petalWidth']

		//FOR A SINGLE GRAPH
		/*let x_values = irises.map(d=>{return{
        	x:d.sepalLen,
    	}})
    	
    	let y_values = irises.map(d=>{return{
        	y:d.sepalWid,
    	}})

		irises.forEach((d,i) => {
   	 		trace.x[i] = d.sepalLen
   	 		trace.y[i] = d.sepalWid
   	 	})

		Plotly.plot( TESTER, [trace], layout )*/
	
		//FOR 16 MINI GRAPHS
		var i, j
		for (i = 0; i < x_axis.length; i++) {
			for (j = 0; j < y_axis.length; j++) {
				irises.forEach((d,z) => {
					console.log(x_axis[i])
					var x_feature = d.x_axis[i] //TYPE ERROR ("cannot read property '0' of undefined")
					var y_feature = d.y_axis[j]
   	 				trace.x[z] = x_feature	
   	 				trace.y[z] = y_feature
   	 			})
   	 			Plotly.plot( TESTER, [trace], layout );
			}
		}
   	 	
		
		
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