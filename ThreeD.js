let scene=new THREE.Scene();
let camera=new THREE.OrthographicCamera();
const cubes=[];
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
var width=window.innerWidth;
var height=window.innerHeight;
var size=100;//rho
var range=50;//N

function random_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

const lego=[];

const peaks=[];

class Overlay {
    constructor(position,text) {
        this.position=position;
        this.element=document.createElement("div");
        this.element.style.position="absolute";
        this.element.style.textAlign="cener";
        this.element.style.display="block";
        this.element.style.zIndex=100;
        this.element.innerHTML=text;
        this.element.width=text.length+"em";
    }
    update(){
        var widthHalf = width / 2, heightHalf = height / 2;

        var vector = new THREE.Vector3();
        vector=this.position.clone();
        vector.applyMatrix4(model.matrix);
        //console.log(vector);
        vector=vector.project(camera);

        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = - ( vector.y * heightHalf ) + heightHalf;
        this.element.style.left=vector.x+"px";
        this.element.style.top=vector.y+"px";
    }
}

for(let n=3;n<range;n++){
    const histogram=[];
    for(let s=0;s<size;s++){
        histogram.push(0);
    }
    let max=0;
    for(let i=0;i<10000;i++){
        let spread=0;
        let avg=0;
        for(let k=0;k<n;k++){
            let v=random_bm();
            avg+=v;
            spread+=v*v;
        }
        spread-=avg*avg;
        spread/=n;
        let stdev=Math.sqrt(spread);
        let index=Math.floor(stdev/2.5*size);
        if(0<=index&&index<histogram.length)
            histogram[index]++;
    }
    let maxid=0;
    for(let s=0;s<size;s++){
        if(max<histogram[s]){
            max=histogram[s];
            maxid=s;
        }
    }
    //maxid=Math.floor(1/2.5*size);
    peaks.push(maxid);
    lego.push(histogram);
}

var model=new THREE.Object3D();
const origin=new Overlay(new THREE.Vector3(-lego.length/2,0,-size/2),"");
const NLabels=[];
const RhoLabels=[];
const Rhoaxis=new Overlay(new THREE.Vector3(-lego.length/2,0,size/2+5),"ρ");
const Naxis=new Overlay(new THREE.Vector3(lego.length/2+5,0,-size/2),"N");
const point=new THREE.PointLight({color:0xf0f0f0});
window.onload=function(){
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffee);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.zIndex = "0";
    document.body.appendChild(renderer.domElement);
    const geometry=new THREE.BoxGeometry(1,1,1);
    const material=new THREE.MeshLambertMaterial({color:0xd0d0d0});
    const red=new THREE.MeshLambertMaterial({color:0xff1111});
    let merged=new THREE.Geometry();

    for(let i=0;i<lego.length;i++){
        for(let j=0;j<size;j++){
            let h=lego[i][j]*0.1;
            var mesh=new THREE.Mesh(geometry,material);
            mesh.position.set(i-lego.length/2,h/2,j-size/2);
            mesh.scale.set(1,h,1);
            mesh.updateMatrix();
            if(j==peaks[i]){
                mesh.material=red;
                model.add(mesh);
            }else{
                merged.merge(mesh.geometry,mesh.matrix);
            }
            //scene.add(mesh);
        }
    }
    var divisions = 10;

    const mmodel=new THREE.Mesh(merged,material);
    model.add(mmodel);
    scene.add(model);
    scene.add(point);
    const ambient=new THREE.AmbientLight(0xa0a0a0);
    //scene.add(ambient);
    const light=new THREE.DirectionalLight(0xf0f0f0);
    scene.add(light);
    camera.aspect=width/height;
    camera.fov=60;
    camera.updateProjectionMatrix();
    camera.position.z = 50;
    camera.position.x = 50;
    camera.position.y = 30;
    camera.lookAt(new THREE.Vector3(0,0,0));
    
    document.body.appendChild(origin.element);
    /*
    document.body.appendChild(Naxis.element);
    document.body.appendChild(Rhoaxis.element);*/
    for(let i=1;i<=10;i++){
        const label=new Overlay(
            new THREE.Vector3(-lego.length/2,0,i*10-size/2),i*0.25+"");
        document.body.appendChild(label.element);
        RhoLabels.push(label);
    }
    for(let i=1;i<=10;i++){
        const label=new Overlay(
            new THREE.Vector3(-lego.length/2+i*5-3,0,-size/2),(i*5)+"");
        document.body.appendChild(label.element);
        NLabels.push(label);
    }

    document.body.style.margin="0";

    //renderer.render(scene,camera);
    lastt=new Date().getTime();
    timer();
};
var t=0;
var lastt=0;



function timer(){
    let time=new Date().getTime();
    let dt=time-lastt;
    lastt=time;

    //model.rotation.y=x*0.01;

    var quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0),y*0.01);

    var quaternion2 = new THREE.Quaternion();
    quaternion2.setFromAxisAngle(new THREE.Vector3(0,1,0),x*0.01);

    //quaternion2.multiply(quaternion);

    var euler=new THREE.Euler();
    euler.setFromQuaternion(quaternion2);
    model.rotation.y=euler.y;       
    model.rotation.x=euler.x;       
    model.rotation.z=euler.z;  
    var vector = new THREE.Vector3( 0, 0, -100 );
    vector.applyQuaternion( quaternion );
    camera.position.set(vector.x,vector.y,vector.z);
    camera.lookAt(0,0,0);
    point.position.set(vector.x,vector.y,vector.z);
    camera.left=-zoom;
    camera.right=zoom;
    camera.top=zoom;
    camera.bottom=-zoom;
    camera.updateProjectionMatrix();
    
    renderer.render(scene,camera);
    origin.update();
    Rhoaxis.update();
    Naxis.update();
    for(var i=0;i<RhoLabels.length;i++){
        RhoLabels[i].element.style.fontSize=(-(zoom-40)/110*20+30)+"px";
        RhoLabels[i].update();
    }
    for(var i=0;i<NLabels.length;i++){
        NLabels[i].update();
        NLabels[i].element.style.fontSize=(-(zoom-40)/110*20+30)+"px";
    }
    requestAnimationFrame(timer);
}

let x=Math.PI/2/0.01;
let lastx=0;
let y=0;
let lasty=0;
let pressed=false;
window.onmousedown=function(e){
    lastx=e.clientX;
    lasty=e.clientY;
    pressed=true;
}
window.onmouseup=function(e){
    pressed=false;
}
window.onmousemove=function(e){
    if(!pressed){
        return 1;
    }
    let cx=e.clientX;
    let cy=e.clientY;
    x+=cx-lastx;
    y+=cy-lasty;
    lastx=cx;
    lasty=cy;
};
var zoom=100;
window.onmousewheel=function(e){
    zoom+=e.deltaY;
    if(zoom<40){
        zoom=40;
    }
    if(zoom>150){
        zoom=150;
    }
}



