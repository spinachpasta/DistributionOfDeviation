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
var samples=5000;
var center=0;

document.getElementById("average").innerHTML=center;
function setAverage(){
    center=Number(this.value);
    document.getElementById("average").innerHTML=center;
}
document.getElementById("range").onchange=setAverage;

function generateData(n){
    var divs=[];
    var stdevs=[];
    var sqaredaverages=[];
    var sqrtsqaredaverages=[];
    for(let i=0;i<samples;i++){
        var a=[];
        var avg=0;
        var sqavg=0;
        var div=0;
        var num=n;
        for(let m=0;m<num;m++){
            var v=randn_bm();
            a.push(randn_bm()+center);
        }
        for(let m=0;m<num;m++){
            avg+=a[m]/num;
            sqavg+=(a[m]-center)*(a[m]-center)/num;
            //sqavg+=a[m]*a[m]/num;
        }
        for(let m=0;m<num;m++){
            var diff=a[m]-avg;
            div+=diff*diff/(num-1);
        }
        divs.push(div);
        stdevs.push(Math.sqrt(div));

        sqaredaverages.push(sqavg);
        sqrtsqaredaverages.push(Math.sqrt(sqavg));
    }
    return {divs:divs,stdevs:stdevs,sqaredaverages:sqaredaverages,sqrtsqaredaverages:sqrtsqaredaverages};
}

function showData(){
    var divs=[];
    var stdevs=[];
    var sqaredaverages=[];
    var sqrtsqaredaverages=[];
    var oneto50=[];
    for(var i=2;i<51;i++){
        oneto50.push(i);
        var res=generateData(i);
        divs.push(Average(res.divs));
        stdevs.push(Average(res.stdevs));
        sqaredaverages.push(Average(res.sqaredaverages));
        sqrtsqaredaverages.push(Average(res.sqrtsqaredaverages));
    }

    var traceSpread = {
        y: divs,
        x:oneto50,
        type: 'scatter',
        name:"spread of EACH SAMPLES ∑{(average)-(value)}^2"
    };
    var traceStdeves = {
        y: stdevs,
        x:oneto50,
        type: 'scatter',
        name: "standard deviation of EACH SAMPLES √ ∑{(average)-(value)}^2"
    };
    var traceSquared = {
        y: sqaredaverages,
        x:oneto50,
        type: 'scatter',
        name: "squared values ∑{(value)-(µ)}^2"
    };
    var traceRoot = {
        y: sqrtsqaredaverages,
        x:oneto50,
        type: 'scatter',
        name: "square root of √ ∑{(value)-(µ)}^2"
    };
    var layout={

    };
    data=[traceSpread,traceStdeves,traceSquared,traceRoot];
    var div=document.createElement("div");

    var layout = {
        xaxis: {range: [0, 50]},
        yaxis: {range: [0, 1.1]}
    };
    Plotly.newPlot("plotZone", data,layout);
}

function stdEv(arr){
    var avg=0;
    for(let i=0;i<arr.length;i++){
        avg+=arr[i]/arr.length;
    }
    var spread=0;
    for(let i=0;i<arr.length;i++){
        let diff=arr[i]-avg;
        spread+=diff*diff/(arr.length-1);
    }
    return Math.sqrt(spread);
}
function Average(arr){
    var avg=0;
    for(let i=0;i<arr.length;i++){
        avg+=arr[i]/arr.length;
    }
    return avg;
}


