console.log('marie loadeds...')

marie={}

marie.ui=function(div){ 
    marie.div=div||document.getElementById('workSpace')

    if(marie.div){

        //Create buttons for user to pick operation
        var addButton = document.createElement("Button")    //addition button
        addButton.innerHTML = "addition"
        document.body.appendChild(addButton);    

        var subtractButton = document.createElement("Button")   //subtraction button
        subtractButton.innerHTML = "subtraction"
        document.body.appendChild(subtractButton);   

        var multiplyButton = document.createElement("Button")   //multiplication button
        multiplyButton.innerHTML = "multiplication"
        document.body.appendChild(multiplyButton);     

        var divideButton = document.createElement("Button")     //division button
        divideButton.innerHTML = "division"
        document.body.appendChild(divideButton);    

        //Header and text 
        let h = `<h3>hello world</h3>   
       <!-- <p>
        how are you doing?
        today is ${Date()}. 
        </p> -->
        <p> Welcome to the calculator! Choose an operation: </p>
        <p id="some Math"><input id="x">+<input id="y">=<span id="result"></span>
        </p>
        <p id="subtraction"><input id="a">-<input id="b">=<span id="subAnswer"></span>
        </p>`
        marie.div.innerHTML=h
        x.onkeyup=y.onkeyup=function(){
            result.innerText=parseFloat(x.value)+parseFloat(y.value)
        }
        a.onkeyup=b.onkeyup=function(){
            subAnswer.innerText=parseFloat(a.value)-parseFloat(b.value)
        }
      //let test =
        
    }
}

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        marie.ui(document.getElementById('workSpace'))        
    }

    
}