console.log('devriemann sum integration model loaded...')

statUI={}

statUI.ui=function(div){ 
    statUI.div=div||document.getElementById('workSpace')

    if(statUI.div){
        
        //Header and text
        let h = `<h3>Integrating Risk Probabilities Using Riemann Sums</h3>`
        let description = '<p>Calculations processing.</p>'
        statUI.div.innerHTML=h+description
    
    var sum;
    var step;
    
    function expression(x){
        //mathematical function here, can be based on multiple variables
        let y = x^2; //example function
        return y;
    }

    function initialize(stepSize){
        sum = 0;
        step = stepSize;
    }
    
    //start and end could correspond to ages

    initialize(0.5)
    integrate(0,10)
    function integrate(start, end){
        for(let x = start; x < end; x += step){
            let value = expression(x)
            let area = value * step
            sum += area
            let str = "x = " + x + ", f(x) = " + value + ", sum = " + sum
            let newDiv = document.createElement('div')
            document.body.appendChild(newDiv)
            let newLine = document.createTextNode(str);
            document.body.appendChild(newLine);

            //document.write("x = " + x + ", f(x) = " + value + ", sum = " + sum)
        }   //end loop
        return sum
    }   //end integrate() function

    }   //close if(statUI.div)
}   //close statUI.ui=function(div)

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        statUI.ui(document.getElementById('workSpace'))    
    }
}