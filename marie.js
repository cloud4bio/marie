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
        <p id="some Math"><input id="x">+<input id="y">=<spanid="result"></span>
        </p>`
        marie.div.innerHTML=h
        x.onkeyup=function(){console.log('stop pressing me at '+Date())}

    }
}

window.onload=function(){
    if(document.getElementById('workSpace')){
        marie.ui(document.getElementById('workSpace'))        
    }

    
}