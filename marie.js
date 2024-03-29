console.log('marie loadeds...')


marie={}


marie.ui=function(div){ 
    marie.div=div||document.getElementById('workSpace')

    if(marie.div){

        //Header and text
        let h = `<h3>Flower Sorting Project</h3>`
        marie.div.innerHTML=h
        //FLOWER SORTING PROJECT

		const setosas = []
        const versicolors = []
        const virginicas = []

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
          irisSorted.forEach(function(curr){
          	//console.log(curr.correctSpecies)
			if(curr.correctSpecies == 'setosa'){
				setosas.push(curr)
			}
			else if(curr.correctSpecies == 'virginica'){
				virginicas.push(curr)
			}
			else if(curr.correctSpecies == 'versicolor'){
				versicolors.push(curr)
			}
          	//if(correctSpecies == 'seposa'){
          //}
          })
          
          //console.log(irisSorted)
          return irisSorted
        }

//getData()

	marie.irisAxes=async function(species){ // https://codelabs.developers.google.com/codelabs/tfjs-training-regression
   	 	let irises = await getData()
		var trace = {}
		if(species == 'setosa'){
			trace = {
   	 			x : [],
   	 			y : [],
   	 			//correctSpecies : [],
   	 			mode : 'markers',
   	 			type : 'scatter',
   	 			name: 'setosa',
  				marker: { color: 'rgb(200, 50, 100)', size: 4 }
   	 		}
		}
		else if(species == 'versicolor'){
			trace = {
				x : [],
				y : [],
				//correctSpecies : [],
				mode : 'markers',
				type : 'scatter',
				name: 'versicolor',
				marker: { color: 'rgb(20, 220, 30)', size: 4 }
			}
		}
		else if(species == 'virginica'){
			trace = {
				x : [],
				y : [],
				//correctSpecies : [],
				mode : 'markers',
				type : 'scatter',
				name: 'virginica',
				marker: { color: 'rgb(100, 50, 200)', size: 4 }
			}
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

		//var test_x = ['sepalLength','sepalWidth','petalLength','petalWidth']
		var x_axis = Object.keys(irises[0])[0]
		//console.log(x_axis)
		//var test_y = ['sepalLength','sepalWidth','petalLength','petalWidth']
		var y_axis = Object.keys(irises[0])[1]
		//console.log(y_axis)
		
		/*let x_values = irises.map(d=>{return{
        	x:d.x_axis,
    	}})
    	
    	let y_values = irises.map(d=>{return{
        	y:d.y_axis,
    	}});*/

		//FOR A SINGLE GRAPH

		if(species == 'setosa'){
			setosas.forEach((d,i) => {
			//console.log(d.temp)
   	 		trace.x[i] = d.sepalLen
   	 		trace.y[i] = d.sepalWid
   	 		//trace_seposa.correctSpecies[i] = d.correctSpecies
   	 		})	
		}
		else if(species == 'virginica'){
			virginicas.forEach((d,i) => {
			//console.log(d.temp)
   	 		trace.x[i] = d.sepalLen
   	 		trace.y[i] = d.sepalWid
   	 		//trace_seposa.correctSpecies[i] = d.correctSpecies
   	 		})	
		}
		else if(species == 'versicolor'){
			versicolors.forEach((d,i) => {
			//console.log(d.temp)
   	 		trace.x[i] = d.sepalLen
   	 		trace.y[i] = d.sepalWid
   	 		//trace_seposa.correctSpecies[i] = d.correctSpecies
   	 		})	
		}

		if(typeof(Plotly) == 'undefined'){
			await marie.getScript('https://cdn.plot.ly/plotly-latest.min.js')
		}

		marie.irisAxes.chart = Plotly.plot( TESTER, [trace], layout )
}

/*marie.irisAxes('setosa'); 
marie.irisAxes('virginica')
marie.irisAxes("versicolor")*/

//Jonas's table code

marie.codeLabIris=async function(){
    console.log('iris lab assembling ...')
    marie.codeLabIris.data=await (await fetch('https://episphere.github.io/ai/data/iris.json')).json()
    let n = Object.entries(marie.codeLabIris.data[0]).length-1
    marie.codeLabIris.table=document.createElement('table')
    document.body.appendChild(marie.codeLabIris.table)
    // wrangle the data
    let sp={};marie.codeLabIris.data.forEach(d=>{
        if(!sp[d.species]){sp[d.species]=0}
        sp[d.species]+=1
    })
    // for each species generate a trace
    Object.keys(sp).forEach(s=>{
        //debugger
     })

     let species = Object.keys(sp)
	species.forEach(function(s){
		marie.irisAxes(s);
	})
     
	 //console.log(species)
    //debugger


    for(var i = 0; i<n ; i++){
        let tr = document.createElement('tr')
        marie.codeLabIris.table.appendChild(tr)
        for(var j=0 ; j<n ; j++){
            let td = document.createElement('td')

            let text = document.createTextNode("test")
			let testPlot = document.createElement('Plotly')	//how to insert plot into cell?
			//testPlot = marie.irisAxes('setosa'); 
            let div = document.createElement('div')
            div.i=i
            div.j=i
            div.id=`${i}_${j}`
            div.innerHTML=`div(${i},${j})`
            td.appendChild(div)
            td.appendChild(text)
            td.appendChild(testPlot)
            tr.appendChild(td)
        }
    }

    return marie.codeLabIris.table
    //debugger
}
marie.codeLabIris() 
		//FOR 16 MINI GRAPHS
		/*var i, j
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
		}*/
   	 	
		
//not sure why document.createElement('tester') isn't working programmatically
//havingto create division statically through index.html
/*TESTER = document.getElementById('tester');
	Plotly.plot( TESTER, [{
	x: [1, 2, 3, 4, 5],
	y: [1, 2, 4, 8, 16] }], {
	margin: { t: 0 } } );*/

//trying to implement Plotly

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

    marie.plotIris=async function(){

    }
    
    //marie.plot();console.log("worked")

    //USE (in console) to plot:
    //document.body.appendChild(await marie.plot())

    } //close [if(marie.div)]
}   //close [marie.ui=function(div)]

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        marie.ui(document.getElementById('workSpace'))    
    }
}