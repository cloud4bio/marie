console.log('marie loadeds...')

marie={}


marie.ui=function(div){ 
    marie.div=div||document.getElementById('workSpace')

    if(marie.div){
        
        //FLOWER SORTING PROJECT
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