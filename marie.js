console.log('marie loadeds...')


marie={}


marie.ui=function(div){ 
    marie.div=div||document.getElementById('workSpace')

    if(marie.div){

        //FLOWER SORTING PROJECT

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
          {name: 'Sepal Width vs Length'},
          {values}, 
          {
           xLabel: 'Sepal Length',
           yLabel: 'Sepal Width',
           height: 300
          }
          )
        }
        run()  
       

        //var irisData = JSON.parse(irisCleaned);
        //alert(irisData[0].sepalLength);

        //Header and text
        let h = `<h3>Flower Sorting Project</h3>`
        //document.addEventListener('DOMContentLoaded', function(){console.log("ran")})

        marie.div.innerHTML=h
        
    }
}

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        marie.ui(document.getElementById('workSpace'))    
    }
}