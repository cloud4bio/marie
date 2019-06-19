console.log('marie loadeds...')


marie={}


marie.ui=function(div){ 
    marie.div=div||document.getElementById('workSpace')

    if(marie.div){

        //FLOWER SORTING PROJECT

        async function getData() {
          const irisOriginalFile = await fetch('https://episphere.github.io/ai/data/iris.json');  
          const irisFile = await irisOriginalFile.json();  
          const irisCleaned = irisFile.map(flower => ({
            sepLen: flower.sepalLength,
            sepWid: flower.sepalWidth, 
            petLen: flower.petalLength,
            petWid: flower.petalWidth,
            correctSpecies: flower.species,}))
          return irisCleaned
        }
          
          irisCleaned = getData()
       

        //var irisData = JSON.parse(irisCleaned);
        //alert(irisData[0].sepalLength);

        //Header and text
        let h = `<h3>Flower Sorting Project</h3>`
       

        marie.div.innerHTML=h
        
    }
}

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        marie.ui(document.getElementById('workSpace'))    
    }

    
}