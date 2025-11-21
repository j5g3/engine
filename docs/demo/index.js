var xt=Object.defineProperty;var q=(a,t)=>()=>(a&&(t=a(a=0)),t);var W=(a,t)=>{for(var e in t)xt(a,e,{get:t[e],enumerable:!0})};function et(a){return a?new Float32Array(a):G.slice(0)}function H(a,t=new Float32Array(16)){let{x:e,y:r,sx:s,sy:n,cx:u,cy:h,rotation:i}=a;t[2]=t[3]=t[6]=t[7]=t[8]=t[9]=t[11]=t[14]=0,t[10]=t[15]=1;let l=Math.cos(i),f=Math.sin(i);return t[0]=s*l,t[1]=s*f,t[4]=n*-f,t[5]=n*l,t[12]=t[0]*-u+t[4]*-h+e,t[13]=t[1]*-u+t[5]*-h+r,t}function rt(a){return{x:0,y:0,w:0,h:0,sx:1,sy:1,cx:0,cy:0,rotation:0,...a}}function $(a,t,e=new Float32Array(16)){let[r,s,n,u,h,i,l,f,o,c,m,d,x,p,y,g]=a,[w,v,M,B,b,I,A,R,P,T,F,L,S,C,O,V]=t;return e[0]=w*r+v*h+M*o+B*x,e[1]=w*s+v*i+M*c+B*p,e[2]=w*n+v*l+M*m+B*y,e[3]=w*u+v*f+M*d+B*g,e[4]=b*r+I*h+A*o+R*x,e[5]=b*s+I*i+A*c+R*p,e[6]=b*n+I*l+A*m+R*y,e[7]=b*u+I*f+A*d+R*g,e[8]=P*r+T*h+F*o+L*x,e[9]=P*s+T*i+F*c+L*p,e[10]=P*n+T*l+F*m+L*y,e[11]=P*u+T*f+F*d+L*g,e[12]=S*r+C*h+O*o+V*x,e[13]=S*s+C*i+O*c+V*p,e[14]=S*n+C*l+O*m+V*y,e[15]=S*u+C*f+O*d+V*g,e}function st(a,t,e,r,s,n){return new Float32Array([2/(t-a),0,0,0,0,2/(r-e),0,0,0,0,2/(s-n),0,(a+t)/(a-t),(e+r)/(e-r),(s+n)/(s-n),1])}function K(a,t){return a.x>=t.x&&a.y>=t.y&&a.x+a.w<=t.x+t.w&&a.y+a.h<=t.y+t.h}function mt(a,t,e,r){return[-(r-t),e-a]}function yt(a){let t=Math.sqrt(a[0]**2+a[1]**2);return a[0]=t?a[0]/t:0,a[1]=t?a[1]/t:0,a}function it(a,t,e,r){return yt(mt(a,t,e,r))}var G,z=q(()=>{"use strict";G=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])});var at={};W(at,{default:()=>Bt});var U,Bt,ot=q(()=>{"use strict";z();U=0,Bt={root:{draw({clear:a,strokeCap:t,strokeJoin:e,strokeWidth:r,strokeColor:s,polyline:n,line:u},h){function i(o){r(30),s([0,0,0,1]),n(o),r(2),t("butt"),e("none"),s([0,1,0,1]),n(o),r(5);for(let c=0;c<o.length-3;c+=2){let[m,d]=it(o[c],o[c+1],o[c+2],o[c+3]);s([0,1,0,1]),u(o[c],o[c+1],m*10+o[c],d*10+o[c+1]),s([.5,.5,1,1]);let[x,p]=[o[c+2]-o[c],o[c+3]-o[c+1]],[y,g]=[o[c+4]-o[c+2],o[c+5]-o[c+3]],w=Math.hypot(x,p),v=Math.hypot(y,g),M=-p/w,B=x/w,b=-g/v,I=y/v,A=(M+b)*10+o[c+2],R=(B+I)*10+o[c+3];u(o[c+2],o[c+3],A,R);let P=o[c+4]-o[c+2],T=o[c+5]-o[c+3],F=Math.hypot(P,T),L=P/F,S=T/F;u(o[c+2],o[c+3],o[c+2]+L*20,o[c+3]+S*20)}}function l(o,c,m,d){r(1);let x=Math.PI*2/d;for(let p=0;p<d;p++){let y=p*x,g=o+Math.cos(y)*m,w=c+Math.sin(y)*m;u(o,c,g,w)}r(2),s([0,1,0,1])}a(),t("butt"),e("none"),i([50,500,150,400,250,500,350,400]),t("square"),e("none"),i([50,400,150,300,250,400,350,300]),t("round"),e("none"),i([50,300,150,200,250,300,350,200]),t("round"),e("miter"),i([450,200,450,150,550,180,530,120,650,200,810,100,850,200]);let f=100;t("square"),e("bevel"),i([450,200+f,450,150+f,550,180+f,530,120+f,650,200+f,810,100+f,850,200+f]),f+=100,t("round"),e("round"),i([450,200+f,450,150+f,550,180+f,530,120+f,650,200+f,810,100+f,850,200+f]),t("butt"),e("none"),i([450,500,550,500]),t("square"),i([450,550,550,550]),t("round"),i([450,600,550,600]),t("butt"),e("bevel"),i([900,200,1e3,200,906,234]),e("miter"),i([900,100,1e3,100,906,134]),e("round"),i([900,300,1e3,300,906,314]),i([900,400,1e3,400,906,400]),e("bevel"),i([1250,200,1150,200,1244,234]),e("miter"),i([1250,100,1150,100,1244,134]),e("round"),i([1250,300,1150,300,1244,314]),i([1250,400,1150,400,1244,400]),e("round"),t("round"),i([820,600,920,600,920+Math.cos(U)*100,600+Math.sin(U)*100]),e("miter"),t("butt"),i([600,600,700,600,700+Math.cos(U)*100,600+Math.sin(U)*100]),e("bevel"),i([1040,600,1140,600,1140+Math.cos(U)*100,600+Math.sin(U)*100]),U+=.01,U>Math.PI*2&&(U=0),s([0,0,0,1]),l(140,600,100,20),h()}}}});var ct={};W(ct,{default:()=>At});var At,ut=q(()=>{"use strict";At={root:{draw({rect:a,color:t}){t(new Float32Array([0,0,0,1])),a(0,0,canvas.width,canvas.height),t(new Float32Array([1,1,1,1])),a(10,10,canvas.width-20,canvas.height-20),t(new Float32Array([0,0,0,1])),a(canvas.width/2,0,1,canvas.height),a(0,canvas.height/2,canvas.width,1),t(new Float32Array([1,0,0,1])),a(canvas.width/2-10,canvas.height/2-50,20,100)}}}});var ht={};W(ht,{default:()=>Pt});var E,Pt,ft=q(()=>{"use strict";E=0,Pt={root:{draw({clear:a,color:t,strokeWidth:e,strokeColor:r,line:s,arc:n,circle:u,ellipse:h},i){function l(d,x,p=6){e(1.5),r([.2,.6,1,1]),s(d-p,x,d+p,x),s(d,x-p,d,x+p)}a();let f=-Math.PI*.25,o=f+Math.PI*1.25+Math.sin(E)*.5;t([0,0,0,1]),n(180,360,f,o,80),n(380,360,f+Math.sin(E)*.5,o,80,10),n(580,360,f,o,80,10*E);let c=160;[30,45,60,90,120,180,270,360].forEach((d,x)=>{let p=d*Math.PI/180,y=140+x*140;t([0,0,0,1]),n(y,c,0,p,60),l(y,c)}),t([0,0,0,1]),h(180,540,140,70),l(180,540),t([0,0,0,1]),u(800,600,50),l(800,600),E+=.01,E>Math.PI*2&&(E-=Math.PI*2),i()}}}});z();z();var D=class{device;size;textureFormat="rgba8unorm";textureArray;textureMetaBuffer;needsUpdate=!1;layers=[];#t;#e=4;#i=0;#r;#s=!1;constructor(t){this.device=t,this.size=t.limits.maxTextureDimension2D,this.textureArray=this.createGPUTexture(this.#e);for(let e=0;e<this.#e;e++)this.createNewLayer();this.#t=new Float32Array(800),this.textureMetaBuffer=this.device.createBuffer({size:this.#t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}get layerCount(){return this.layers.length}update(t){if(this.#r){for(let e=0;e<this.layers.length;e++)t.copyTextureToTexture({texture:this.#r,origin:{x:0,y:0,z:e}},{texture:this.textureArray,origin:{x:0,y:0,z:e}},{width:this.size,height:this.size,depthOrArrayLayers:1});this.#r.destroy(),this.#r=void 0}this.#s&&(this.textureMetaBuffer.destroy(),this.textureMetaBuffer=this.device.createBuffer({size:this.#t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.#s=!1),this.device.queue.writeBuffer(this.textureMetaBuffer,0,this.#t.buffer),this.needsUpdate=!1}add(t){let e=this.findNext(t.width,t.height);return t.data instanceof ArrayBuffer?this.device.queue.writeTexture({texture:this.textureArray,origin:{x:e.x,y:e.y,z:e.layer}},t.data,{bytesPerRow:t.width*4},{width:t.width,height:t.height,depthOrArrayLayers:1}):this.device.queue.copyExternalImageToTexture({source:t.data},{texture:this.textureArray,origin:{x:e.x,y:e.y,z:e.layer}},{width:t.width,height:t.height}),this.updateTextureMeta(e),e}reset(){this.layers=[],this.#i=0,this.#t.fill(0),this.#r=void 0,this.textureArray.destroy(),this.textureArray=this.createGPUTexture(this.#e);for(let t=0;t<this.#e;t++)this.createNewLayer();this.needsUpdate=!0}updateTextureMeta(t){let r=t.id*8;if(this.#t.length<r+8){let n=new Float32Array(this.#t.length*2);n.set(this.#t),this.#t=n,this.#s=!0}let s=this.size;this.#t[r]=t.x/s,this.#t[r+1]=t.y/s,this.#t[r+2]=t.w/s,this.#t[r+3]=t.h/s,this.#t[r+4]=t.layer,this.needsUpdate=!0}createGPUTexture(t){return this.device.createTexture({size:[this.size,this.size,t],format:this.textureFormat,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT,dimension:"2d"})}pruneFreeList(t){let e=t.freeRects;for(let r=0;r<e.length;r++){let s=e[r];for(let n=r+1;n<e.length;n++){let u=e[n];if(K(s,u)){e.splice(r,1),r--;break}K(u,s)&&(e.splice(n,1),n--)}}}findNext(t,e){let r,s,n=-1,u;for(let i of this.layers)for(let l=0;l<i.freeRects.length;l++){let f=i.freeRects[l];if(f.w>=t&&f.h>=e){let o=f.w-t,c=f.h-e,m=Math.min(o,c),d=Math.max(o,c);(r===void 0||m<r.score1||m===r.score1&&d<r.score2)&&(r={freeRectIndex:l,score1:m,score2:d},s={x:f.x,y:f.y,w:t,h:e},n=l,u=i)}}if(!u||!s||n===-1){let i=this.createNewLayer();this.#r=this.textureArray,this.textureArray=this.createGPUTexture(this.layers.length);let l=i.freeRects[0];s={x:l.x,y:l.y,w:t,h:e},n=0,u=i,this.needsUpdate=!0}this.placeRect(u,s,n);let h={id:this.#i++,layer:u.layerIndex,...s};return u.usedRects.push(h),h}placeRect(t,e,r){let s=t.freeRects[r],n={x:e.x+e.w,y:e.y,w:s.w-e.w,h:e.h},u={x:e.x,y:e.y+e.h,w:s.w,h:s.h-e.h};t.freeRects.splice(r,1),n.w>0&&n.h>0&&t.freeRects.push(n),u.w>0&&u.h>0&&t.freeRects.push(u),this.pruneFreeList(t)}createNewLayer(){let t={freeRects:[{x:0,y:0,w:this.size,h:this.size}],usedRects:[],layerIndex:this.layers.length};return this.layers.push(t),t}};var gt=`
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
`,wt=`
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

fn halfDiscSDF(uv: vec2f, dir: f32) -> f32 {
    let center = vec2f(0.0, 0.5);
    let radius_x = 1.0;
    let radius_y = 0.5;
    let p = vec2((uv.x - center.x) / radius_x, (uv.y - center.y) / radius_y);
    return length(p) - 1.0; 
}

fn circleSDF(uv: vec2f) -> f32 {
    let center = vec2f(0.5, 0.5);
    let radius = 0.5;
    return length(uv - center) - radius;
}

fn shapeMask(
    uv: vec2f,    
    innerRadius: f32,
    endAngle: f32,
) -> f32 {
    let center = vec2f(0.5, 0.5);
    let p = uv - center;

    // radial distance
    let d = length(p);

    // ring or full disc
    let innerMask = step(innerRadius, d);
    let outerMask = step(d, 0.5);
    var mask = innerMask * outerMask;

    // angle mask only if needed
    if (endAngle < 6.28318530718) {
        let pNorm = p / d;
        let endVec = vec2f(cos(endAngle), sin(endAngle));
        let crossStart = pNorm.y;
        let crossEnd = pNorm.x * endVec.y - pNorm.y * endVec.x;
        
        // For angles <= PI: point must be between start and end (both cross products positive)
        // For angles > PI: point must NOT be in the gap (at least one cross product positive)
        let isLessThanPi = step(endAngle, 3.14159265359);
        let maskSmall = step(0.0, crossStart) * step(0.0, crossEnd);
        let maskLarge = max(step(0.0, crossStart), step(0.0, crossEnd));
        
        mask *= mix(maskLarge, maskSmall, isLessThanPi);
    }

    return mask;
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
	let tMeta = textureMeta[input.textureId];
	var uv = tMeta.uvOffset + input.texcoord * tMeta.uvSize;
	var color = textureSample(textureArray, mySampler, uv, u32(tMeta.layer)) * input.color;
	
    var mask: f32 = 1.0;
	if (input.endAngle >= 0.0) {
		mask = shapeMask(input.texcoord, input.innerRadius, input.endAngle);
	}

    color *= mask;

    return color;
}
	`;async function vt(a){if(!navigator.gpu)throw new Error("WebGPU not supported");let t=await navigator.gpu.requestAdapter();if(!t)throw new Error("Failed to get GPU adapter");let e=await t.requestDevice(),r=a.getContext("webgpu");if(!r)throw new Error("Could not create WebGPU context");let s=navigator.gpu.getPreferredCanvasFormat();return r.configure({device:e,format:s,alphaMode:"premultiplied"}),{device:e,context:r,format:s}}function bt({device:a,format:t,vertexWgsl:e,fragmentWgsl:r}){let s=a.createShaderModule({code:e}),n=a.createShaderModule({code:r});return a.createRenderPipeline({layout:"auto",vertex:{module:s,entryPoint:"main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x4"},{shaderLocation:1,offset:16,format:"float32x2"}],stepMode:"vertex"},{arrayStride:100,attributes:[{shaderLocation:2,offset:0,format:"float32x4"},{shaderLocation:3,offset:16,format:"float32x4"},{shaderLocation:4,offset:32,format:"float32x4"},{shaderLocation:5,offset:48,format:"float32x4"},{shaderLocation:6,offset:64,format:"float32x4"},{shaderLocation:7,offset:80,format:"float32"},{shaderLocation:8,offset:84,format:"float32"},{shaderLocation:9,offset:88,format:"float32"},{shaderLocation:10,offset:92,format:"float32"},{shaderLocation:11,offset:96,format:"float32"}],stepMode:"instance"}]},fragment:{module:n,entryPoint:"main",targets:[{format:t,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"}})}var _=class{initial;value;dirty=!0;constructor(t){this.initial=t,this.value=t}set(t){this.value=t,this.dirty=!0}reset(){this.set(this.initial)}},Q=class{initial;value;dirty=!0;#t;constructor(t){this.initial=t,this.value=t,this.#t=[t]}push(t){this.#t.push(this.value),this.set(t)}pop(){let t=this.#t.pop();if(!t)throw new Error("Uniform stack empty");this.set(t)}pushMultiply(t){this.push(this.value===G?t:$(this.value,t))}set(t){this.value=t,this.dirty=!0}reset(){this.#t.length=0,this.set(this.initial)}};var Z=class{program;growth;buffer;count=0;#t=0;#e;constructor(t,e,r=4096){this.program=t,this.growth=r,this.#e=new Float32Array(e),this.buffer=t.device.createBuffer({size:r,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}push(...t){let e=this.program.device,r=0;for(let s of t)this.#e.set(s,r),r+=s.length;return this.#t+this.#e.byteLength>this.buffer.size&&this.grow(),e.queue.writeBuffer(this.buffer,this.#t,this.#e.buffer),this.#t+=this.#e.byteLength,this.count++,this.#e}setInstance(t,e){let r=t*this.#e.byteLength;if(r+e.byteLength>this.buffer.size)throw new Error("Instance index out of range");this.program.device.queue.writeBuffer(this.buffer,r,e.buffer)}clear(){this.#t=0,this.count=0}reset(){this.#t=0,this.count=0}grow(){let t=this.program.device,e=t.createBuffer({size:this.buffer.size+this.growth,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),r=t.createCommandEncoder();r.copyBufferToBuffer(this.buffer,e),t.queue.submit([r.finish()]),this.buffer.destroy(),this.buffer=e}},J=class{device;color=new _(new Float32Array([1,1,1,1]));model=new Q(G);view=new _(G);projection=new _(G);whiteTexture;textureAtlas;instanceBuffer;canvas;textureId=0;context;renderPipeline;#t;#e;#i;#r;#s;constructor({device:t,format:e,context:r}){this.device=t,this.context=r,this.renderPipeline=bt({device:t,format:e,vertexWgsl:gt,fragmentWgsl:wt}),this.#s=t.createSampler({magFilter:"nearest",minFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.canvas=r.canvas,this.textureAtlas=new D(t),this.#t=this.createBuffer({size:144,usage:GPUBufferUsage.VERTEX,initial:[0,0,0,1,0,0,1,0,0,1,1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,1,0,1,1,1]}),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.#r=t.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.#e=t.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.#r}}]}),this.#i=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#s},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]}),this.instanceBuffer=new Z(this,25)}updateTextureBindGroup(){this.#i=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#s},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]})}draw(){let{projection:t,view:e,device:r,context:s}=this,n=r.createCommandEncoder();(t.dirty||e.dirty)&&(t.dirty=e.dirty=!1,r.queue.writeBuffer(this.#r,0,$(t.value,e.value))),this.textureAtlas.needsUpdate&&(this.textureAtlas.update(n),this.updateTextureBindGroup());let u=s.getCurrentTexture().createView(),h=n.beginRenderPass({colorAttachments:[{view:u,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});h.setPipeline(this.renderPipeline),h.setVertexBuffer(0,this.#t),h.setVertexBuffer(1,this.instanceBuffer.buffer),h.setBindGroup(0,this.#e),h.setBindGroup(1,this.#i),h.draw(6,this.instanceBuffer.count,0,0),h.end(),r.queue.submit([n.finish()])}pushInstance(t,e,r=-1,s=0){return this.instanceBuffer.push(this.model.value,this.color.value,new Float32Array([this.textureId,t,e,r,s]))}destroy(){this.#t.destroy(),this.#r.destroy(),this.instanceBuffer.buffer.destroy()}resize(t,e){(this.canvas.width!==t||this.canvas.height!==e)&&(this.canvas.width=t,this.canvas.height=e);let r=navigator.gpu.getPreferredCanvasFormat();this.context.configure({device:this.device,format:r,alphaMode:"premultiplied"})}clear(){this.instanceBuffer.clear()}reset(){this.instanceBuffer.reset(),this.textureAtlas.reset(),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.color.reset(),this.model.reset()}createColorTexture(t){return this.textureAtlas.add({width:1,height:1,data:new Uint8Array(t.map(e=>e*255)).buffer})}createBuffer({size:t,initial:e,usage:r}){let s=this.device.createBuffer({size:t,usage:r,mappedAtCreation:!!e});return e&&(new Float32Array(s.getMappedRange()).set(e),s.unmap()),s}};async function nt(a){return new J(await vt(a.canvas))}z();z();var N=Math.PI*2,Y=class{ctx;#t;#e=1;#i=1;#r=0;#s=0;#o=1;#c=1;#u=et();#a="butt";#n="none";#h={Ax:0,Ay:0,Bx:0,By:0,uxIn:0,uyIn:0,uxOut:0,uyOut:0,turn:1};constructor(t){this.ctx=t,this.resetViewport()}color=(t,e)=>{this.ctx.color.set(Array.isArray(t)?new Float32Array(t):t),e&&this.strokeColor(e)};fillColor=t=>{this.color(t)};strokeColor=t=>{this.#t=Array.isArray(t)?new Float32Array(t):t};rect=(t,e,r,s)=>{this.pushM(r,0,0,s,t-this.#r,e-this.#s)};circle=(t,e,r)=>{this.pushM(r*2,0,0,r*2,t-r-this.#r,e-r-this.#s,N)};ellipse=(t,e,r,s)=>{this.pushM(r*2,0,0,s*2,t-r-this.#r,e-s-this.#s,N)};arc=(t,e,r,s,n,u=0)=>{if(r>s){let y=s;s=r,r=y}let h=Math.cos(r),i=Math.sin(r),l=n*2,f=l*h,o=l*i,c=-l*i,m=l*h,d=t-this.#r-.5*(f+c),x=e-this.#s-.5*(o+m),p=s-r;this.pushM(f,o,c,m,d,x,p,u/l)};strokeWidth=t=>{this.#e=t};strokeCap=t=>{this.#a=t};strokeJoin=t=>{this.#n=t};line=(t,e,r,s)=>{this.polyline([t,e,r,s])};polyline=t=>{if(t.length<4)throw new Error("Need at least two points.");let e=this.#e*this.#i,r=this.#r,s=this.#s,n=this.#o,u=this.#c;this.#t&&this.ctx.color.set(this.#t),this.#a!=="butt"&&this.drawCap((t[0]-r)/n,(t[1]-s)/u,(t[2]-r)/n,(t[3]-s)/u,e,"start");for(let h=0;h<t.length-2;h+=2){let i=(t[h]-r)/n,l=(t[h+1]-s)/u,f=(t[h+2]-r)/n,o=(t[h+3]-s)/u;if(this.lineSegment(i,l,f,o,e),h<t.length-4){let c=(t[h+4]-r)/n,m=(t[h+5]-s)/u;this.#n==="round"?this.drawRoundJoin(f,o,e):(this.#n==="bevel"||this.#n==="miter")&&this.drawBevelJoin(i,l,f,o,c,m,e),this.#n==="miter"&&this.drawMiterJoin(i,l,f,o,c,m,e)}}if(this.#a!=="butt"){let h=t.length-2;this.drawCap((t[h-2]-r)/n,(t[h-1]-s)/u,(t[h]-r)/n,(t[h+1]-s)/u,e,"end")}};viewport=(t,e,r,s)=>{let n=r-t,u=s-e;this.#o=n/this.ctx.canvas.width,this.#c=u/this.ctx.canvas.height,this.#r=t,this.#s=e,this.ctx.projection.set(st(0,this.ctx.canvas.width,this.ctx.canvas.height,0,-1,1))};resetViewport=()=>{this.viewport(0,0,this.ctx.canvas.width,this.ctx.canvas.height)};clear=()=>{this.ctx.clear()};reset=()=>{this.resetViewport(),this.ctx.reset()};lineSegment(t,e,r,s,n){let u=r-t,h=s-e,i=Math.sqrt(u*u+h*h),l=u/i,f=h/i;i<1&&(i=1);let o=n*-f,c=n*l;this.pushM(i*l,i*f,o,c,o*-.5+t,c*-.5+e)}drawRoundJoin(t,e,r){this.pushM(r,0,0,r,t-r/2,e-r/2,N)}getBevelPoints(t,e,r,s,n,u,h){let i=this.#h,l=r-t,f=s-e,o=Math.sqrt(l*l+f*f);if(o===0)return;let c=i.uxIn=l/o,m=i.uyIn=f/o,d=n-r,x=u-s,p=Math.sqrt(d*d+x*x);if(p===0)return;let y=i.uxOut=d/p,g=i.uyOut=x/p,w=l*x-f*d;i.turn=w<=0?1:-1;let v=h/2*i.turn;return i.Ax=r+-m*v,i.Ay=s+c*v,i.Bx=r+-g*v,i.By=s+y*v,i}drawBevelJoin(t,e,r,s,n,u,h){let i=this.getBevelPoints(t,e,r,s,n,u,h);if(!i)return;let{Ax:l,Ay:f,Bx:o,By:c}=i,m=(l+o)/2,d=(f+c)/2,x=o-l,p=c-f,y=Math.sqrt(x*x+p*p);this.lineSegment(r,s,m,d,y)}pushM(t,e,r,s,n,u,h=-1,i=0){let l=this.#u;l[0]=t,l[1]=e,l[4]=r,l[5]=s,l[12]=n,l[13]=u,this.ctx.model.pushMultiply(l),this.ctx.pushInstance(1,1,h,i),this.ctx.model.pop()}drawMiterJoin(t,e,r,s,n,u,h,i=h*5){let l=h/2,f=this.getBevelPoints(t,e,r,s,n,u,h);if(!f)return;let{Ax:o,Ay:c,Bx:m,By:d,uxIn:x,uyIn:p,uxOut:y,uyOut:g,turn:w}=f;if(x*y+p*g<-.9510565162951536)return;let M=(-p-g)*w,B=(x+y)*w,b=Math.sqrt(M*M+B*B);if(b===0)return;let I=b/2,A=l/I;if(A>i)return;let R=r+M/b*A,P=s+B/b*A;this.pushM(R-o,P-c,m-R,d-P,o,c)}drawCap(t,e,r,s,n,u){let h=u==="start",i=n/2,l=(h?t:r)-i,f=(h?e:s)-i;this.pushM(n,0,0,n,l-this.#r,f-this.#s,N)}};async function Mt({src:a,width:t,height:e}){return new Promise(r=>{let s=new Image;s.src=a,s.addEventListener("load",()=>{r({data:s,width:t??s.naturalWidth,height:e??s.naturalHeight})})})}var j=class{program;pipeline=[];commit=[];#t=0;#e=!1;#i;#r=new Map;constructor(t){this.program=t,this.#i=new Y(t)}async load(t){let e=this.program,r=t;if(r.box){t.box=rt(t.box),r.box.dirty=!1,r.box.parentM=e.model.value;let s=H(r.box);e.model.pushMultiply(s)}if(t.fill&&e.color.set(t.fill),t.texture){let s=e.textureAtlas.add(await Mt(t.texture));e.textureId=s.id}if(r._instanceIndex=e.instanceBuffer.count,e.pushInstance(t.box?.w??1,t.box?.h??1).slice(0),t.id&&this.#r.set(t.id,t),e.textureId=0,t.draw&&this.#s(()=>t.draw?.(this.#i,()=>this.requestRender())),t.children)for(let s of t.children)await this.load(s);if(t.box&&e.model.pop(),t.fill&&e.color.reset(),t.update){let s=u=>{let h=this.#r.get(u);if(!h)throw new Error(`Invalid id: "${u}"`);return h},n=typeof t.update=="function"?t.update:new Function("node","get",t.update);this.#s(()=>n(t,s))}this.commit.push(()=>{if(r.box?.dirty){let s=H(r.box);e.model.set(r.box.parentM),e.model.pushMultiply(s),e.instanceBuffer.setInstance(r._instanceIndex,e.model.value),r.box.dirty=!1,this.requestRender()}r.dirty&&(r.dirty=!1,this.requestRender())})}reset(){this.stop(),this.program.reset(),this.pipeline.length=0,this.commit.length=0}requestRender(){this.#e||(this.#e=!0,cancelAnimationFrame(this.#t),this.#t=requestAnimationFrame(()=>{this.#e=!1;for(let t of this.pipeline)t();for(let t of this.commit)t();this.program.draw()}))}stop(){cancelAnimationFrame(this.#t),this.#e=!1}#s=t=>{this.pipeline.push(t)}};var tt=document.getElementById("demo"),Rt=await nt({canvas:document.getElementById("canvas")}),X,k=new URL(location.href),lt,Ut={lines:()=>Promise.resolve().then(()=>(ot(),at)),rect:()=>Promise.resolve().then(()=>(ut(),ct)),circles:()=>Promise.resolve().then(()=>(ft(),ht))};async function pt(){let a=tt.value;lt=a.endsWith(".json")?await fetch(a).then(t=>t.json()):(await Ut[a]()).default,k.searchParams.set("demo",a);try{history.pushState(void 0,"",k.search)}catch(t){console.error(t)}X?.reset(),X??=new j(Rt),await X.load(lt.root),X.requestRender()}var dt=k.searchParams.get("demo");dt&&(tt.value=dt);tt.onchange=pt;pt();
