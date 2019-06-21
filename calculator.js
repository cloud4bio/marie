console.log('calculator loadeds...')

marie={}


marie.ui=function(div){ 
    marie.div=div||document.getElementById('workSpace')

    if(marie.div){

//CALCULATOR CODE

        
        var historyData = []
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


        <Button id = "addition" style = "background-color:LightBlue; font-weight:bold"> addition </Button>
        <Button id = "subtraction" style = "background-color:LightGreen; font-weight:bold"> subtraction </Button>
        <Button id = "multiplication" style = "background-color:LightPink; font-weight:bold"> multiplication </Button>
        <Button id = "division" style = "background-color:Violet; font-weight:bold"> division </Button> 
        
        <h4>Calculator History</h4>
        <ul id = "historyList">
          <li>test</li>
        </ul>`
        

        marie.div.innerHTML=h

        function listen(){
        document.getElementById("addition").onclick = function(){changeOp("addition")}
        document.getElementById("subtraction").onclick = function(){changeOp("subtraction")}
        document.getElementById("multiplication").onclick = function(){changeOp("multiplication")}
        document.getElementById("division").onclick = function(){changeOp("division")}
        }
        
        listen()
        
        function changeOp(operation){
            listen()
            switch(operation){
                case "addition":
                    console.log("adding")
                    clear()
                    add()
                    break
                case "subtraction":
                    console.log("subtracting")
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
            //addToHistory(x,"+",y,result)
            listen()
        }

        function subtract(){
             let inputs = `<p id="subtractText"><input id="x"> - <input id="y"> = <span id="result"></span>
        </p>`
            marie.div.innerHTML += inputs
            x.onkeyup=y.onkeyup=function(){
                result.innerText=parseFloat(x.value)-parseFloat(y.value)
            }
            //addToHistory(x,"-",y,result)
            listen()
        }

        function multiply(){
             let inputs = `<p id="multiplyText"><input id="x"> * <input id="y"> = <span id="result"></span>
        </p>`
            marie.div.innerHTML += inputs
            x.onkeyup=y.onkeyup=function(){
                result.innerText=parseFloat(x.value)*parseFloat(y.value)
            }
           // addToHistory(x,"*",y,result)
            listen()
        }

        function divide(){
             let inputs = `<p id="divideText"><input id="x"> / <input id="y"> = <span id="result"></span>
        </p>`
            marie.div.innerHTML += inputs
            x.onkeyup=y.onkeyup=function(){
                result.innerText=parseFloat(x.value)/parseFloat(y.value)
            }
            //addToHistory(x,"/",y,result)
            listen()
        }
        

    //CALCULATOR HISTORY (need to fix functionality)
        /*function addToHistory(a,op,b,answer){
            historyData.push([toString(a),toString(op),toString(b),toString(answer)])
            console.log(historyData)
            updateList()
        }

        function updateList(){
            var ul = document.getElementById("historyList");
            for(i=0; i<historyData.length; i++){
                var li = document.createElement("li")
                var value = "" + historyData[i][0] + historyData[i][1] + historyData[i][2] + " = " + historyData[i][3]
                li.appendChild(document.createTextNode(value))
                ul.appendChild(li)
            }
        }*/

    }
}

//On page startup
window.onload=function(){
    if(document.getElementById('workSpace')){
        marie.ui(document.getElementById('workSpace'))    
    }

    
}