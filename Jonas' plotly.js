(async function(){

const ai={}

ai.getScript=async function(url){
    url=url||'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js'
    return new Promise(function(resolve, reject) {
        let s = document.createElement('script')
        s.src=url
        s.onload=resolve
        s.onerror=reject
        document.head.appendChild(s)
    })
}

ai.plot=async function(div,traces,layout){
    if(typeof(Plotly)=='undefined'){
        await ai.getScript('https://cdn.plot.ly/plotly-latest.min.js')
    }
    div=div||document.createElement('div')
    traces=traces||[{
	x: [1, 2, 3, 4, 5],
	y: [1, 2, 4, 8, 16]}]
    layout=layout||{margin: { t: 0 } };

	Plotly.plot(div,traces,layout)
	return div
}


ai.plot(); console.log("test")

if(typeof(window)=='object'){ // regular web browser application
    window.onload=async function(){
        await ai.getScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js')
        ai.tf=tf
        await ai.getScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis@1.0.2/dist/tfjs-vis.umd.min.js')
        ai.tfvis=tfvis
        window.ai=ai
        // check if intro is in order
        console.log('window loaded')
        //ai.codeLab()
        //define(ai)
    }
}
if(typeof(define)!=='undefined'){ // loaded as a required object
    define(ai)
}

})()

