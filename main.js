// Standard Normal variate using Box-Muller transform.
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}
var arr5=[];
var div5=[];
var arr10=[];
var div10=[];
var samples=10000;

function generateData(n){
    var divs=[];
    for(let i=0;i<samples;i++){
        var a=[];
        var avg=0;
        var div=0;
        var num=n;
        for(let m=0;m<num;m++){
            var v=randn_bm();
            a.push(randn_bm());
        }
        for(let m=0;m<num;m++){
            avg+=a[m]/num;
        }
        for(let m=0;m<num;m++){
            var diff=a[m]-avg;
            div+=diff*diff/num;
        }
        divs.push(div);
    }
    return divs;
}

function showData(n){
    var datas=generateData(n);

    var trace = {
        x: datas,
        type: 'histogram',
    };
    var data = [trace];
    
    var title=document.createElement("h1");
    title.innerHTML=n;
    document.body.appendChild(title);
    
    var elem=document.createElement("div");
    elem.id="aaa"+n;
    document.body.appendChild(elem);
    Plotly.newPlot("aaa"+n, data);
}

showData(5);
showData(10);
showData(100);
showData(1000);
showData(5000);