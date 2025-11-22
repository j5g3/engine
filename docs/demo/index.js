var wt=Object.defineProperty;var C=(n,t)=>()=>(n&&(t=n(n=0)),t);var Y=(n,t)=>{for(var e in t)wt(n,e,{get:t[e],enumerable:!0})};function it(n){return n?new Float32Array(n):O.slice(0)}function Q(n,t=new Float32Array(16)){let{x:e,y:r,sx:s,sy:i,cx:u,cy:a,rotation:o}=n;t[2]=t[3]=t[6]=t[7]=t[8]=t[9]=t[11]=t[14]=0,t[10]=t[15]=1;let l=Math.cos(o),h=Math.sin(o);return t[0]=s*l,t[1]=s*h,t[4]=i*-h,t[5]=i*l,t[12]=t[0]*-u+t[4]*-a+e,t[13]=t[1]*-u+t[5]*-a+r,t}function nt(n){return{x:0,y:0,w:0,h:0,sx:1,sy:1,cx:0,cy:0,rotation:0,...n}}function Z(n,t,e=new Float32Array(16)){let[r,s,i,u,a,o,l,h,c,f,y,d,x,p,m,g]=n,[v,w,M,R,b,P,B,I,T,S,A,U,E,G,V,q]=t;return e[0]=v*r+w*a+M*c+R*x,e[1]=v*s+w*o+M*f+R*p,e[2]=v*i+w*l+M*y+R*m,e[3]=v*u+w*h+M*d+R*g,e[4]=b*r+P*a+B*c+I*x,e[5]=b*s+P*o+B*f+I*p,e[6]=b*i+P*l+B*y+I*m,e[7]=b*u+P*h+B*d+I*g,e[8]=T*r+S*a+A*c+U*x,e[9]=T*s+S*o+A*f+U*p,e[10]=T*i+S*l+A*y+U*m,e[11]=T*u+S*h+A*d+U*g,e[12]=E*r+G*a+V*c+q*x,e[13]=E*s+G*o+V*f+q*p,e[14]=E*i+G*l+V*y+q*m,e[15]=E*u+G*h+V*d+q*g,e}function ot(n,t,e,r,s,i){return new Float32Array([2/(t-n),0,0,0,0,2/(r-e),0,0,0,0,2/(s-i),0,(n+t)/(n-t),(e+r)/(e-r),(s+i)/(s-i),1])}function J(n,t){return n.x>=t.x&&n.y>=t.y&&n.x+n.w<=t.x+t.w&&n.y+n.h<=t.y+t.h}function Mt(n,t,e,r){return[-(r-t),e-n]}function bt(n){let t=Math.sqrt(n[0]**2+n[1]**2);return n[0]=t?n[0]/t:0,n[1]=t?n[1]/t:0,n}function at(n,t,e,r){return bt(Mt(n,t,e,r))}var O,L=C(()=>{"use strict";O=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])});var ut={};Y(ut,{default:()=>Pt});var F,Pt,ht=C(()=>{"use strict";L();F=0,Pt={root:{draw({clear:n,strokeCap:t,strokeJoin:e,strokeWidth:r,strokeColor:s,polyline:i,line:u},a){function o(c){r(30),s([0,0,0,1]),i(c),r(2),t("butt"),e("none"),s([0,1,0,1]),i(c),r(5);for(let f=0;f<c.length-3;f+=2){let[y,d]=at(c[f],c[f+1],c[f+2],c[f+3]);s([0,1,0,1]),u(c[f],c[f+1],y*10+c[f],d*10+c[f+1]),s([.5,.5,1,1]);let[x,p]=[c[f+2]-c[f],c[f+3]-c[f+1]],[m,g]=[c[f+4]-c[f+2],c[f+5]-c[f+3]],v=Math.hypot(x,p),w=Math.hypot(m,g),M=-p/v,R=x/v,b=-g/w,P=m/w,B=(M+b)*10+c[f+2],I=(R+P)*10+c[f+3];u(c[f+2],c[f+3],B,I);let T=c[f+4]-c[f+2],S=c[f+5]-c[f+3],A=Math.hypot(T,S),U=T/A,E=S/A;u(c[f+2],c[f+3],c[f+2]+U*20,c[f+3]+E*20)}}function l(c,f,y,d){r(1);let x=Math.PI*2/d;for(let p=0;p<d;p++){let m=p*x,g=c+Math.cos(m)*y,v=f+Math.sin(m)*y;u(c,f,g,v)}r(2),s([0,1,0,1])}n(),t("butt"),e("none"),o([50,500,150,400,250,500,350,400]),t("square"),e("none"),o([50,400,150,300,250,400,350,300]),t("round"),e("none"),o([50,300,150,200,250,300,350,200]),t("round"),e("miter"),o([450,200,450,150,550,180,530,120,650,200,810,100,850,200]);let h=100;t("square"),e("bevel"),o([450,200+h,450,150+h,550,180+h,530,120+h,650,200+h,810,100+h,850,200+h]),h+=100,t("round"),e("round"),o([450,200+h,450,150+h,550,180+h,530,120+h,650,200+h,810,100+h,850,200+h]),t("butt"),e("none"),o([450,500,550,500]),t("square"),o([450,550,550,550]),t("round"),o([450,600,550,600]),t("butt"),e("bevel"),o([900,200,1e3,200,906,234]),e("miter"),o([900,100,1e3,100,906,134]),e("round"),o([900,300,1e3,300,906,314]),o([900,400,1e3,400,906,400]),e("bevel"),o([1250,200,1150,200,1244,234]),e("miter"),o([1250,100,1150,100,1244,134]),e("round"),o([1250,300,1150,300,1244,314]),o([1250,400,1150,400,1244,400]),e("round"),t("round"),o([820,600,920,600,920+Math.cos(F)*100,600+Math.sin(F)*100]),e("miter"),t("butt"),o([600,600,650,600,650+Math.cos(F)*100,600+Math.sin(F)*100]),e("bevel"),o([1040,600,1140,600,1140+Math.cos(F)*100,600+Math.sin(F)*100]),F+=.01,F>Math.PI*2&&(F=0),s([0,0,0,1]),l(140,600,100,20),a()}}}});var ft={};Y(ft,{default:()=>Ut});var Ut,lt=C(()=>{"use strict";Ut={root:{draw({rect:n,color:t}){t(new Float32Array([0,0,0,1])),n(0,0,canvas.width,canvas.height),t(new Float32Array([1,1,1,1])),n(10,10,canvas.width-20,canvas.height-20),t(new Float32Array([0,0,0,1])),n(canvas.width/2,0,1,canvas.height),n(0,canvas.height/2,canvas.width,1),t(new Float32Array([1,0,0,1])),n(canvas.width/2-10,canvas.height/2-50,20,100)}}}});var dt={};Y(dt,{default:()=>St});var D,St,xt=C(()=>{"use strict";D=0,St={root:{draw({clear:n,color:t,strokeWidth:e,strokeColor:r,line:s,arc:i,circle:u,ellipse:a},o){function l(d,x,p=6){e(1.5),r([.2,.6,1,1]),s(d-p,x,d+p,x),s(d,x-p,d,x+p)}n();let h=-Math.PI*.25,c=h+Math.PI*1.25+Math.sin(D)*.5;t([0,0,0,1]),i(180,360,h,c,80),i(380,360,h+Math.sin(D)*.5,c,80,10),i(580,360,h,c,80,10*D);let f=160;[30,45,60,90,120,180,270,360].forEach((d,x)=>{let p=d*Math.PI/180,m=140+x*140;t([0,0,0,1]),i(m,f,0,p,60),l(m,f)}),t([0,0,0,1]),a(180,540,140,70),l(180,540),t([0,0,0,1]),u(800,600,50),l(800,600),D+=.01,D>Math.PI*2&&(D-=Math.PI*2),o()}}}});var pt={};Y(pt,{default:()=>Gt});function z(n,t){return Math.random()*(t-n)+n}function Et(n,t,e,r=1){let s=e<.5?e*(1+t):e+t-e*t,i=2*e-s,u=a=>(a<0&&(a+=1),a>1&&(a-=1),a<1/6?i+(s-i)*6*a:a<1/2?s:a<2/3?i+(s-i)*(2/3-a)*6:i);return[u(n+1/3),u(n),u(n-1/3),r]}function Ft(){_=[];for(let n=0;n<500;n++){let t=z(8,20),e=z(t,1280-t),r=z(t,720-t-200),s=z(-200,200),i=z(-50,50),u=Et(Math.random(),.65,.55,1),a=t*t;_.push({x:e,y:r,vx:s,vy:i,r:t,color:u,m:a})}}function _t(n){for(let t of _){if(t.vy+=800*n,t.x+=t.vx*n,t.y+=t.vy*n,t.x-t.r<0?(t.x=t.r,t.vx=-t.vx*.7):t.x+t.r>1280&&(t.x=1280-t.r,t.vx=-t.vx*.7),t.y-t.r<0)t.y=t.r,t.vy=-t.vy*.7;else if(t.y+t.r>720){t.y=720-t.r;let e=Math.abs(t.vy)<25?0:.7;if(t.vy=-t.vy*e,Math.abs(t.vy)===0)if(Math.abs(t.vx)<8)t.vx=0;else{let r=Math.max(0,1-14*n);t.vx*=r}else t.vx*=.98}Math.abs(t.vx)<.01&&(t.vx=0),Math.abs(t.vy)<.01&&(t.vy=0)}for(let t=0;t<_.length;t++)for(let e=t+1;e<_.length;e++){let r=_[t],s=_[e],i=s.x-r.x,u=s.y-r.y,a=Math.hypot(i,u),o=r.r+s.r;if(a===0||a>=o)continue;let l=i/a,h=u/a,c=o-a,f=r.m+s.m,y=Math.max(0,c-.01)*.85,d=y*(s.m/f),x=y*(r.m/f);r.x-=l*d,r.y-=h*d,s.x+=l*x,s.y+=h*x;let p=s.vx-r.vx,m=s.vy-r.vy,g=p*l+m*h;if(g>0)continue;let v=Math.abs(g)<25?0:.7,w=1/r.m+1/s.m,M=-(1+v)*g/w,R=M*l,b=M*h;r.vx-=R/r.m,r.vy-=b/r.m,s.vx+=R/s.m,s.vy+=b/s.m;let P=p-g*l,B=m-g*h,I=Math.hypot(P,B);if(I>1e-6){let T=P/I,S=B/I,A=-I/w,U=.35*Math.abs(M);A>U&&(A=U),A<-U&&(A=-U);let E=A*T,G=A*S;r.vx-=E/r.m,r.vy-=G/r.m,s.vx+=E/s.m,s.vy+=G/s.m}}}var _,$,Gt,yt=C(()=>{"use strict";_=[],$=0;Gt={root:{draw({clear:n,color:t,circle:e},r){_.length===0&&Ft();let s=Date.now();$===0&&($=s);let i=(s-$)/1e3;$=s,i>.05&&(i=.05);let u=1/120,a=i;for(;a>0;){let o=Math.min(a,u);_t(o),a-=o}n();for(let o of _)t(o.color),e(o.x,o.y,o.r);r()}}}});L();L();var j=class{device;size;textureFormat="rgba8unorm";textureArray;textureMetaBuffer;needsUpdate=!1;layers=[];#t;#e=4;#i=0;#r;#s=!1;constructor(t){this.device=t,this.size=t.limits.maxTextureDimension2D,this.textureArray=this.createGPUTexture(this.#e);for(let e=0;e<this.#e;e++)this.createNewLayer();this.#t=new Float32Array(800),this.textureMetaBuffer=this.device.createBuffer({size:this.#t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}get layerCount(){return this.layers.length}update(t){if(this.#r){for(let e=0;e<this.layers.length;e++)t.copyTextureToTexture({texture:this.#r,origin:{x:0,y:0,z:e}},{texture:this.textureArray,origin:{x:0,y:0,z:e}},{width:this.size,height:this.size,depthOrArrayLayers:1});this.#r.destroy(),this.#r=void 0}this.#s&&(this.textureMetaBuffer.destroy(),this.textureMetaBuffer=this.device.createBuffer({size:this.#t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.#s=!1),this.device.queue.writeBuffer(this.textureMetaBuffer,0,this.#t.buffer),this.needsUpdate=!1}add(t){let e=this.findNext(t.width,t.height);return t.data instanceof ArrayBuffer?this.device.queue.writeTexture({texture:this.textureArray,origin:{x:e.x,y:e.y,z:e.layer}},t.data,{bytesPerRow:t.width*4},{width:t.width,height:t.height,depthOrArrayLayers:1}):this.device.queue.copyExternalImageToTexture({source:t.data},{texture:this.textureArray,origin:{x:e.x,y:e.y,z:e.layer}},{width:t.width,height:t.height}),this.updateTextureMeta(e),e}reset(){this.layers=[],this.#i=0,this.#t.fill(0),this.#r=void 0,this.textureArray.destroy(),this.textureArray=this.createGPUTexture(this.#e);for(let t=0;t<this.#e;t++)this.createNewLayer();this.needsUpdate=!0}updateTextureMeta(t){let r=t.id*8;if(this.#t.length<r+8){let i=new Float32Array(this.#t.length*2);i.set(this.#t),this.#t=i,this.#s=!0}let s=this.size;this.#t[r]=t.x/s,this.#t[r+1]=t.y/s,this.#t[r+2]=t.w/s,this.#t[r+3]=t.h/s,this.#t[r+4]=t.layer,this.needsUpdate=!0}createGPUTexture(t){return this.device.createTexture({size:[this.size,this.size,t],format:this.textureFormat,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT,dimension:"2d"})}pruneFreeList(t){let e=t.freeRects;for(let r=0;r<e.length;r++){let s=e[r];for(let i=r+1;i<e.length;i++){let u=e[i];if(J(s,u)){e.splice(r,1),r--;break}J(u,s)&&(e.splice(i,1),i--)}}}findNext(t,e){let r,s,i=-1,u;for(let o of this.layers)for(let l=0;l<o.freeRects.length;l++){let h=o.freeRects[l];if(h.w>=t&&h.h>=e){let c=h.w-t,f=h.h-e,y=Math.min(c,f),d=Math.max(c,f);(r===void 0||y<r.score1||y===r.score1&&d<r.score2)&&(r={freeRectIndex:l,score1:y,score2:d},s={x:h.x,y:h.y,w:t,h:e},i=l,u=o)}}if(!u||!s||i===-1){let o=this.createNewLayer();this.#r=this.textureArray,this.textureArray=this.createGPUTexture(this.layers.length);let l=o.freeRects[0];s={x:l.x,y:l.y,w:t,h:e},i=0,u=o,this.needsUpdate=!0}this.placeRect(u,s,i);let a={id:this.#i++,layer:u.layerIndex,...s};return u.usedRects.push(a),a}placeRect(t,e,r){let s=t.freeRects[r],i={x:e.x+e.w,y:e.y,w:s.w-e.w,h:e.h},u={x:e.x,y:e.y+e.h,w:s.w,h:s.h-e.h};t.freeRects.splice(r,1),i.w>0&&i.h>0&&t.freeRects.push(i),u.w>0&&u.h>0&&t.freeRects.push(u),this.pruneFreeList(t)}createNewLayer(){let t={freeRects:[{x:0,y:0,w:this.size,h:this.size}],usedRects:[],layerIndex:this.layers.length};return this.layers.push(t),t}};var It=`
struct VertexInput {
    @location(0) position: vec4f,
	@location(1) texcoord: vec2f,
	@location(2) modelRow0: vec4f,
	@location(3) modelRow1: vec4f,
	@location(4) modelRow2: vec4f,
	@location(5) modelRow3: vec4f,
	@location(6) instanceColor: vec4f,
	@location(7) textureId: f32,
	@location(8) width: f32,
	@location(9) height: f32,
	
	// Use this to draw circles, wedges, and arcs using SDF.
	// Set the value to a negative number to skip this effect.
	@location(10) endAngle: f32,
	@location(11) innerRadius: f32,
};

struct Uniforms {
    viewProj: mat4x4f,
};

struct VertexOutput {
    @builtin(position) position: vec4f,
	@location(0) texcoord: vec2f,
	@location(1) color: vec4f,
	@location(2) @interpolate(flat) textureId: u32,
	@location(3) @interpolate(flat) endAngle: f32,
	@location(4) @interpolate(flat) innerRadius: f32,
};

@group(0) @binding(0)
var<uniform> uniforms : Uniforms;

@vertex
fn main(
    input: VertexInput,
) -> VertexOutput {
    var output: VertexOutput;
	let model = mat4x4f(
		input.modelRow0,
		input.modelRow1,
		input.modelRow2,
		input.modelRow3,
	);
	
	let scale = vec3f(input.width, input.height, 1.0);
	let scaledPosition = vec4f(input.position.xyz * scale, input.position.w);

	output.position = uniforms.viewProj * model * scaledPosition;
	output.texcoord = input.texcoord;
	output.color = input.instanceColor;
	output.textureId = u32(input.textureId);
	output.endAngle = input.endAngle;
	output.innerRadius = input.innerRadius;
    return output;
}
`,At=`
struct FragmentInput {
    @builtin(position) position: vec4f,
    @location(0) texcoord: vec2f,
	@location(1) color: vec4f,
	@location(2) @interpolate(flat) textureId: u32,
	@location(3) @interpolate(flat) endAngle: f32,
	@location(4) @interpolate(flat) innerRadius: f32,
};

struct TextureMeta {
	uvOffset: vec2f,
	uvSize: vec2f,
	layer: f32,
    _pad0: f32,       // offset 20, size 4
    _pad1: f32,       // offset 24, size 4
    _pad2: f32,       // offset 28, size 4	
};

@group(1) @binding(0) var mySampler: sampler;
@group(1) @binding(1) var textureArray: texture_2d_array<f32>;
@group(1) @binding(2) var<storage, read> textureMeta: array<TextureMeta>;

fn shapeSDF(uv: vec2f, innerRadius: f32, endAngle: f32) -> f32 {
    let center = vec2f(0.5, 0.5);
    let p = uv - center;
    let d = length(p);
    let outerR = 0.5;

    let ringSDF = max(d - outerR, innerRadius - d);
    if (endAngle >= 6.28318530718 - 1e-5) {
        return ringSDF;
    }

    let ang = clamp(endAngle, 0.0, 6.28318530718);
    let vEnd = vec2f(cos(ang), sin(ang));

    // Normals that point "into" the sector
    let nStart = vec2f(0.0, -1.0);
    let nEnd = vec2f(-vEnd.y, vEnd.x);

    let distStart = dot(p, nStart);
    let distEnd   = dot(p, nEnd);

    // For small sectors (<= PI) interior is intersection -> max
    // For large sectors (> PI) interior is union -> min
    let sectorSDF = select(min(distStart, distEnd), max(distStart, distEnd), ang <= 3.14159265359);

    return max(ringSDF, sectorSDF);
}

fn quadSDF(uv: vec2f) -> f32 {
	let p = abs(uv - 0.5) - 0.5;
    return length(max(p, vec2f(0.0))) + min(max(p.x, p.y), 0.0);
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
    let tMeta = textureMeta[input.textureId];
    var uv = tMeta.uvOffset + input.texcoord * tMeta.uvSize;
    var color = textureSample(textureArray, mySampler, uv, u32(tMeta.layer)) * input.color;
	
    let sdf = select(
        quadSDF(input.texcoord),
        shapeSDF(input.texcoord, input.innerRadius, input.endAngle),
        input.endAngle >= 0.0
    );

    let w = max(fwidth(sdf), 1e-5);
    let alpha = smoothstep(w, 0.0, sdf);
	
    color *= alpha;

    return color;
}
	`;async function Rt(n){if(!navigator.gpu)throw new Error("WebGPU not supported");let t=await navigator.gpu.requestAdapter();if(!t)throw new Error("Failed to get GPU adapter");let e=await t.requestDevice(),r=n.getContext("webgpu");if(!r)throw new Error("Could not create WebGPU context");let s=navigator.gpu.getPreferredCanvasFormat();return r.configure({device:e,format:s,alphaMode:"premultiplied"}),{device:e,context:r,format:s}}function Bt({device:n,format:t,vertexWgsl:e,fragmentWgsl:r}){let s=n.createShaderModule({code:e}),i=n.createShaderModule({code:r});return n.createRenderPipeline({layout:"auto",vertex:{module:s,entryPoint:"main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x4"},{shaderLocation:1,offset:16,format:"float32x2"}],stepMode:"vertex"},{arrayStride:100,attributes:[{shaderLocation:2,offset:0,format:"float32x4"},{shaderLocation:3,offset:16,format:"float32x4"},{shaderLocation:4,offset:32,format:"float32x4"},{shaderLocation:5,offset:48,format:"float32x4"},{shaderLocation:6,offset:64,format:"float32x4"},{shaderLocation:7,offset:80,format:"float32"},{shaderLocation:8,offset:84,format:"float32"},{shaderLocation:9,offset:88,format:"float32"},{shaderLocation:10,offset:92,format:"float32"},{shaderLocation:11,offset:96,format:"float32"}],stepMode:"instance"}]},fragment:{module:i,entryPoint:"main",targets:[{format:t,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"}})}var N=class{initial;value;dirty=!0;constructor(t){this.initial=t,this.value=t}set(t){this.value=t,this.dirty=!0}reset(){this.set(this.initial)}},k=class{initial;value;dirty=!0;#t;constructor(t){this.initial=t,this.value=t,this.#t=[t]}push(t){this.#t.push(this.value),this.set(t)}pop(){let t=this.#t.pop();if(!t)throw new Error("Uniform stack empty");this.set(t)}pushMultiply(t){this.push(this.value===O?t:Z(this.value,t))}set(t){this.value=t,this.dirty=!0}reset(){this.#t.length=0,this.set(this.initial)}};var tt=class{program;growth;buffer;count=0;#t=0;#e;constructor(t,e,r=4096){this.program=t,this.growth=r,this.#e=new Float32Array(e),this.buffer=t.device.createBuffer({size:r,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}push(...t){let e=this.program.device,r=0;for(let s of t)this.#e.set(s,r),r+=s.length;return this.#t+this.#e.byteLength>this.buffer.size&&this.grow(),e.queue.writeBuffer(this.buffer,this.#t,this.#e.buffer),this.#t+=this.#e.byteLength,this.count++,this.#e}setInstance(t,e){let r=t*this.#e.byteLength;if(r+e.byteLength>this.buffer.size)throw new Error("Instance index out of range");this.program.device.queue.writeBuffer(this.buffer,r,e.buffer)}clear(){this.#t=0,this.count=0}reset(){this.#t=0,this.count=0}grow(){let t=this.program.device,e=t.createBuffer({size:this.buffer.size+this.growth,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),r=t.createCommandEncoder();r.copyBufferToBuffer(this.buffer,e),t.queue.submit([r.finish()]),this.buffer.destroy(),this.buffer=e}},et=class{device;color=new N(new Float32Array([1,1,1,1]));model=new k(O);view=new N(O);projection=new N(O);whiteTexture;textureAtlas;instanceBuffer;canvas;textureId=0;context;renderPipeline;#t;#e;#i;#r;#s;constructor({device:t,format:e,context:r}){this.device=t,this.context=r,this.renderPipeline=Bt({device:t,format:e,vertexWgsl:It,fragmentWgsl:At}),this.#s=t.createSampler({magFilter:"nearest",minFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.canvas=r.canvas,this.textureAtlas=new j(t),this.#t=this.createBuffer({size:144,usage:GPUBufferUsage.VERTEX,initial:[0,0,0,1,0,0,1,0,0,1,1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,1,0,1,1,1]}),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.#r=t.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.#e=t.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.#r}}]}),this.#i=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#s},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]}),this.instanceBuffer=new tt(this,25)}updateTextureBindGroup(){this.#i=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#s},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]})}draw(){let{projection:t,view:e,device:r,context:s}=this,i=r.createCommandEncoder();(t.dirty||e.dirty)&&(t.dirty=e.dirty=!1,r.queue.writeBuffer(this.#r,0,Z(t.value,e.value))),this.textureAtlas.needsUpdate&&(this.textureAtlas.update(i),this.updateTextureBindGroup());let u=s.getCurrentTexture().createView(),a=i.beginRenderPass({colorAttachments:[{view:u,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});a.setPipeline(this.renderPipeline),a.setVertexBuffer(0,this.#t),a.setVertexBuffer(1,this.instanceBuffer.buffer),a.setBindGroup(0,this.#e),a.setBindGroup(1,this.#i),a.draw(6,this.instanceBuffer.count,0,0),a.end(),r.queue.submit([i.finish()])}pushInstance(t,e,r=-1,s=0){return this.instanceBuffer.push(this.model.value,this.color.value,new Float32Array([this.textureId,t,e,r,s]))}destroy(){this.#t.destroy(),this.#r.destroy(),this.instanceBuffer.buffer.destroy()}resize(t,e){(this.canvas.width!==t||this.canvas.height!==e)&&(this.canvas.width=t,this.canvas.height=e);let r=navigator.gpu.getPreferredCanvasFormat();this.context.configure({device:this.device,format:r,alphaMode:"premultiplied"})}clear(){this.instanceBuffer.clear()}reset(){this.instanceBuffer.reset(),this.textureAtlas.reset(),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.color.reset(),this.model.reset()}createColorTexture(t){return this.textureAtlas.add({width:1,height:1,data:new Uint8Array(t.map(e=>e*255)).buffer})}createBuffer({size:t,initial:e,usage:r}){let s=this.device.createBuffer({size:t,usage:r,mappedAtCreation:!!e});return e&&(new Float32Array(s.getMappedRange()).set(e),s.unmap()),s}};async function ct(n){return new et(await Rt(n.canvas))}L();L();var H=Math.PI*2,X=class{ctx;#t;#e=1;#i=1;#r=0;#s=0;#a=1;#c=1;#u=it();#o="butt";#n="none";#h={Ax:0,Ay:0,Bx:0,By:0,uxIn:0,uyIn:0,uxOut:0,uyOut:0,turn:1};constructor(t){this.ctx=t,this.resetViewport()}color=(t,e)=>{this.ctx.color.set(Array.isArray(t)?new Float32Array(t):t),e&&this.strokeColor(e)};fillColor=t=>{this.color(t)};strokeColor=t=>{this.#t=Array.isArray(t)?new Float32Array(t):t};rect=(t,e,r,s)=>{this.pushM(r,0,0,s,t-this.#r,e-this.#s)};circle=(t,e,r)=>{this.pushM(r*2,0,0,r*2,t-r-this.#r,e-r-this.#s,H)};ellipse=(t,e,r,s)=>{this.pushM(r*2,0,0,s*2,t-r-this.#r,e-s-this.#s,H)};arc=(t,e,r,s,i,u=0)=>{if(r>s){let x=s;s=r,r=x}let a=Math.cos(r),o=Math.sin(r),l=i*2,h=l*a,c=l*o,f=t-this.#r-.5*(h-c),y=e-this.#s-.5*(c+h),d=s-r;this.pushM(h,c,-c,h,f,y,d,u/l)};strokeWidth=t=>{this.#e=t};strokeCap=t=>{this.#o=t};strokeJoin=t=>{this.#n=t};line=(t,e,r,s)=>{this.polyline([t,e,r,s])};polyline=t=>{if(t.length<4)throw new Error("Need at least two points.");let e=this.#e*this.#i,r=this.#r,s=this.#s,i=this.#a,u=this.#c;if(this.#t&&this.ctx.color.set(this.#t),this.#o!=="butt"){this.drawCap((t[0]-r)/i,(t[1]-s)/u,(t[2]-r)/i,(t[3]-s)/u,e,"start");let a=t.length-2;this.drawCap((t[a-2]-r)/i,(t[a-1]-s)/u,(t[a]-r)/i,(t[a+1]-s)/u,e,"end")}for(let a=0;a<t.length-2;a+=2){let o=(t[a]-r)/i,l=(t[a+1]-s)/u,h=(t[a+2]-r)/i,c=(t[a+3]-s)/u;if(this.lineSegment(o,l,h,c,e),a<t.length-4){let f=(t[a+4]-r)/i,y=(t[a+5]-s)/u;this.#n==="round"?this.drawRoundJoin(h,c,e):(this.#n==="bevel"||this.#n==="miter")&&this.drawBevelJoin(o,l,h,c,f,y,e),this.#n==="miter"&&this.drawMiterJoin(o,l,h,c,f,y,e)}}};viewport=(t,e,r,s)=>{let i=r-t,u=s-e;this.#a=i/this.ctx.canvas.width,this.#c=u/this.ctx.canvas.height,this.#r=t,this.#s=e,this.ctx.projection.set(ot(0,this.ctx.canvas.width,this.ctx.canvas.height,0,-1,1))};resetViewport=()=>{this.viewport(0,0,this.ctx.canvas.width,this.ctx.canvas.height)};clear=()=>{this.ctx.clear()};reset=()=>{this.resetViewport(),this.ctx.reset()};lineSegment(t,e,r,s,i){let u=r-t,a=s-e,o=Math.sqrt(u*u+a*a),l=u/o,h=a/o;o<1&&(o=1);let c=i*-h,f=i*l;this.pushM(o*l,o*h,c,f,c*-.5+t,f*-.5+e)}drawRoundJoin(t,e,r){this.pushM(r,0,0,r,t-r/2,e-r/2,H)}getBevelPoints(t,e,r,s,i,u,a){let o=this.#h,l=r-t,h=s-e,c=Math.sqrt(l*l+h*h);if(c===0)return;let f=o.uxIn=l/c,y=o.uyIn=h/c,d=i-r,x=u-s,p=Math.sqrt(d*d+x*x);if(p===0)return;let m=o.uxOut=d/p,g=o.uyOut=x/p,v=l*x-h*d;o.turn=v<=0?1:-1;let w=a/2*o.turn;return o.Ax=r+-y*w,o.Ay=s+f*w,o.Bx=r+-g*w,o.By=s+m*w,o}drawBevelJoin(t,e,r,s,i,u,a){let o=this.getBevelPoints(t,e,r,s,i,u,a);if(!o)return;let{Ax:l,Ay:h,Bx:c,By:f}=o,y=(l+c)/2,d=(h+f)/2,x=c-l,p=f-h,m=Math.sqrt(x*x+p*p);this.lineSegment(r,s,y,d,m)}pushM(t,e,r,s,i,u,a=-1,o=0){let l=this.#u;l[0]=t,l[1]=e,l[4]=r,l[5]=s,l[12]=i,l[13]=u,this.ctx.model.pushMultiply(l),this.ctx.pushInstance(1,1,a,o),this.ctx.model.pop()}drawMiterJoin(t,e,r,s,i,u,a,o=a*5){let l=a/2,h=this.getBevelPoints(t,e,r,s,i,u,a);if(!h)return;let{Ax:c,Ay:f,Bx:y,By:d,uxIn:x,uyIn:p,uxOut:m,uyOut:g,turn:v}=h;if(x*m+p*g<-.9510565162951536)return;let M=(-p-g)*v,R=(x+m)*v,b=Math.sqrt(M*M+R*R);if(b===0)return;let P=b/2,B=l/P;if(B>o)return;let I=r+M/b*B,T=s+R/b*B;this.pushM(I-c,T-f,y-I,d-T,c,f)}drawCap(t,e,r,s,i,u){let a=u==="start",o=i/2,l=a?t:r,h=a?e:s;if(this.#o==="round"){this.pushM(i,0,0,i,l-o-this.#r,h-o-this.#s,H);return}let c=r-t,f=s-e,y=Math.hypot(c,f)||1;c/=y,f/=y;let d=o*c,x=o*f,p=-i*f,m=i*c,g=l-(a?d:0)-.5*p,v=h-(a?x:0)-.5*m;this.pushM(d,x,p,m,g,v)}};async function Tt({src:n,width:t,height:e}){return new Promise(r=>{let s=new Image;s.src=n,s.addEventListener("load",()=>{r({data:s,width:t??s.naturalWidth,height:e??s.naturalHeight})})})}var W=class{program;pipeline=[];commit=[];#t=0;#e=!1;#i;#r=new Map;constructor(t){this.program=t,this.#i=new X(t)}async load(t){let e=this.program,r=t;if(r.box){t.box=nt(t.box),r.box.dirty=!1,r.box.parentM=e.model.value;let s=Q(r.box);e.model.pushMultiply(s)}if(t.fill&&e.color.set(t.fill),t.texture){let s=e.textureAtlas.add(await Tt(t.texture));e.textureId=s.id}if(r._instanceIndex=e.instanceBuffer.count,e.pushInstance(t.box?.w??1,t.box?.h??1).slice(0),t.id&&this.#r.set(t.id,t),e.textureId=0,t.draw&&this.#s(()=>t.draw?.(this.#i,()=>this.requestRender())),t.children)for(let s of t.children)await this.load(s);if(t.box&&e.model.pop(),t.fill&&e.color.reset(),t.update){let s=u=>{let a=this.#r.get(u);if(!a)throw new Error(`Invalid id: "${u}"`);return a},i=typeof t.update=="function"?t.update:new Function("node","get",t.update);this.#s(()=>i(t,s))}this.commit.push(()=>{if(r.box?.dirty){let s=Q(r.box);e.model.set(r.box.parentM),e.model.pushMultiply(s),e.instanceBuffer.setInstance(r._instanceIndex,e.model.value),r.box.dirty=!1,this.requestRender()}r.dirty&&(r.dirty=!1,this.requestRender())})}reset(){this.stop(),this.program.reset(),this.pipeline.length=0,this.commit.length=0}requestRender(){this.#e||(this.#e=!0,cancelAnimationFrame(this.#t),this.#t=requestAnimationFrame(()=>{this.#e=!1;for(let t of this.pipeline)t();for(let t of this.commit)t();this.program.draw()}))}stop(){cancelAnimationFrame(this.#t),this.#e=!1}#s=t=>{this.pipeline.push(t)}};var st=document.getElementById("demo"),Ot=await ct({canvas:document.getElementById("canvas")}),K,rt=new URL(location.href),mt,Lt={lines:()=>Promise.resolve().then(()=>(ht(),ut)),rect:()=>Promise.resolve().then(()=>(lt(),ft)),circles:()=>Promise.resolve().then(()=>(xt(),dt)),balls:()=>Promise.resolve().then(()=>(yt(),pt))};async function vt(){let n=st.value;mt=n.endsWith(".json")?await fetch(n).then(t=>t.json()):(await Lt[n]()).default,rt.searchParams.set("demo",n);try{history.replaceState(void 0,"",rt.search)}catch(t){console.error(t)}K?.reset(),K??=new W(Ot),await K.load(mt.root),K.requestRender()}var gt=rt.searchParams.get("demo");gt&&(st.value=gt);st.onchange=vt;vt();
