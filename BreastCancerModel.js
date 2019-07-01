console.log('breast cancer risk prediction tensorflow model loaded...')

riskUI={}

riskUI.ui=function(div){ 
    riskUI.div=div||document.getElementById('workSpace')

    if(riskUI.div){
        
        //Header and text
        let h = `<h3>TensorFlow.js Breast Cancer Risk Prediction Model</h3>`
        let description = '<p>Please wait for the model to load.</p>'
        riskUI.div.innerHTML=h+description


    }
}

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        riskUI.ui(document.getElementById('workSpace'))    
    }
}