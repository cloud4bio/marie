console.log('marie loadeds...')

marie={}

marie.ui=function(div){
    marie.div=div||document.getElementById('workSpace')
    if(marie.div){
        let h = `<h3>hello world</h3>
        <p>
        how are you doing?
        today is ${Date()}.
        </p>
        <p id="some Math"><input id="x">+<input id="y">=<span id="result"></span>
        </p>`
        marie.div.innerHTML=h
        x.onkeyup=y.onkeyup=function(){
            result.innerText=parseFloat(x.value)+parseFloat(y.value)
        }

    }
}

window.onload=function(){
    if(document.getElementById('workSpace')){
        marie.ui(document.getElementById('workSpace'))        
    }

    
}