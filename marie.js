console.log('marie loadeds...')

marie={}

marie.ui=function(div){ 
    marie.div=div||document.getElementById('workSpace')

    if(marie.div){

        //Header and text 
        //Create buttons for user to pick operation
        let h = `<h3>Hello World :)</h3>   
       <!-- <p>
        how are you doing?
        today is ${Date()}. 
        </p> -->
        <p> Welcome to the calculator! Choose an operation: </p>
        <p><span><img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Casio_calculator_JS-20WK_in_201901_002.jpg/255px-Casio_calculator_JS-20WK_in_201901_002.jpg" width = "10%" height = "20%">
        <caption> Image from <a href = "https://en.wikipedia.org/wiki/Calculator" target="_blank"> Wikipedia </a></caption></span></p>
        <br><br>
           
        <Button id = "addition"> + </Button>
        <Button id = "subtraction"> - </Button>
        <Button id = "multiplication"> * </Button>
        <Button id = "division"> / </Button>

        <!-- <p id="addition"><input id="x">+<input id="y">=<span id="result"></span>
        </p>
        <p id="subtraction"><input id="a">-<input id="b">=<span id="subAnswer"></span>
        </p> --> `
        marie.div.innerHTML=h
        //marie.div.innerHTML += '<p>test</p>'

       /* document.getElementById("addition").onclick = function(){add()} 
        document.getElementById("subtraction").onclick = function(){subtract()}
        document.getElementById("division").onclick = function(){divide()}
        document.getElementById("multiplication").onclick = function(){multiply()}*/

        document.getElementById("addition").onclick = function(){changeOp("addition")}
        document.getElementById("subtraction").onclick = function(){changeOp("subtraction")}
        document.getElementById("multiplication").onclick = function(){changeOp("multiplication")}
        document.getElementById("division").onclick = function(){changeOp("division")}

      /* document.getElementById("addition").addEventListener("onclick", add())
        document.getElementById("subtraction").addEventListener("onclick", subtract())*/
        
        function changeOp(operation){
            switch(operation){
                case "addition":
                    clear()
                    add()
                    break
                case "subtraction":
                    clear()
                    subtract()
                    break
                case "multiplication":
                    clear()
                    multiply()
                    break
                 case "division":
                    clear()
                    divide()
                    break
            }
        }

        function clear(){
            marie.div.innerHTML = h
        }

        function add(){
             let inputs = `<p id="addText"><input id="x"> + <input id="y"> = <span id="result"></span>
        </p>`
            marie.div.innerHTML += inputs
            x.onkeyup=y.onkeyup=function(){
                result.innerText=parseFloat(x.value)+parseFloat(y.value)
            }
        }

        function subtract(){
             let inputs = `<p id="subtractText"><input id="x"> - <input id="y"> = <span id="result"></span>
        </p>`
            marie.div.innerHTML += inputs
            x.onkeyup=y.onkeyup=function(){
                result.innerText=parseFloat(x.value)-parseFloat(y.value)
            }
        }

        function multiply(){
             let inputs = `<p id="multiplyText"><input id="x"> * <input id="y"> = <span id="result"></span>
        </p>`
            marie.div.innerHTML += inputs
            x.onkeyup=y.onkeyup=function(){
                result.innerText=parseFloat(x.value)*parseFloat(y.value)
            }
        }

        function divide(){
             let inputs = `<p id="divideText"><input id="x"> / <input id="y"> = <span id="result"></span>
        </p>`
            marie.div.innerHTML += inputs
            x.onkeyup=y.onkeyup=function(){
                result.innerText=parseFloat(x.value)/parseFloat(y.value)
            }
        }

        //Create buttons for user to pick operation
        /*var addButton = document.createElement("Button")    //addition button
        addButton.innerHTML = "addition"
        document.body.appendChild(addButton)    
        //addButton.onClick = function(){console.log("test")}
        //addButton.onClick = add()
        
        var subtractButton = document.createElement("Button")   //subtraction button
        subtractButton.innerHTML = "subtraction"
        document.body.appendChild(subtractButton)  

        var multiplyButton = document.createElement("Button")   //multiplication button
        multiplyButton.innerHTML = "multiplication"
        document.body.appendChild(multiplyButton)   

        var divideButton = document.createElement("Button")     //division button
        divideButton.innerHTML = "division"
        document.body.appendChild(divideButton)   
        x.onkeyup=y.onkeyup=function(){
            result.innerText=parseFloat(x.value)+parseFloat(y.value)
        }
        */
        
    }
}

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        marie.ui(document.getElementById('workSpace'))        
    }

    
}