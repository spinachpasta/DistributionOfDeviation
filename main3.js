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

function generateData(n,k){
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
            div+=diff*diff/(num-k);
        }
        divs.push(Math.sqrt(div));
    }
    return divs;
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
function showData(){
    var avgs=[];
    var oneto50=[];
    for(var i=1;i<=50;i++){
        var datas=generateData(i,1);
        avgs.push(Average(datas));
        oneto50.push(i);
    }
    var trace1 = {
        x: oneto50,
        y: avgs,
        mode: 'markers',
        type: 'scatter'
    };
    var layout={
        xaxis: {
        title: {
            text: 'number of samples'
        }
        },
        yaxis: {
        title: {
            text: 'average of standard deviation'
        }
        }
    }
    var data = [trace1];

    var elem=document.createElement("div");
    elem.id="aaa";
    document.body.appendChild(elem);
    Plotly.newPlot(elem.id, data,layout);

    /*
    for(var l=1;l<2;l++){
        var datas=generateData(n,l);

        var trace = {
            x: datas,
            type: 'histogram',
            marker: {
                color: '#faa'
            },
            xbins: {
                size: 0.01
            }
        };
        var layout = {
            xaxis: {range: [0, 2.5]}
        };
        var data = [trace];

        var title=document.createElement("h1");
        title.innerHTML=n+"samples";
        document.body.appendChild(title);

        var subtitle=document.createElement("div");
        subtitle.innerHTML="Standard deviation:"+stdEv(datas)+",Average:"+Average(datas);
        document.body.appendChild(subtitle);


        var elem=document.createElement("div");
        elem.id="aaa"+n+"a"+l;
        document.body.appendChild(elem);
        Plotly.newPlot(elem.id, data,layout);
    }*/
}
function addPageBreak(){
    var elem=document.createElement("div");
    elem.style.pageBreakAfter="always";
    document.body.appendChild(elem);
}
//showData(1);

showData();