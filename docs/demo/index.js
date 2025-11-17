var ft=Object.defineProperty;var N=(a,t)=>()=>(a&&(t=a(a=0)),t);var J=(a,t)=>{for(var e in t)ft(a,e,{get:t[e],enumerable:!0})};function k(a){return a?new Float32Array(a):S.slice(0)}function j(a,t=new Float32Array(16)){let{x:e,y:r,sx:i,sy:n,cx:h,cy:u,rotation:s}=a;t[2]=t[3]=t[6]=t[7]=t[8]=t[9]=t[11]=t[14]=0,t[10]=t[15]=1;let l=Math.cos(s),f=Math.sin(s);return t[0]=i*l,t[1]=i*f,t[4]=n*-f,t[5]=n*l,t[12]=t[0]*-h+t[4]*-u+e,t[13]=t[1]*-h+t[5]*-u+r,t}function tt(a){return{x:0,y:0,w:0,h:0,sx:1,sy:1,cx:0,cy:0,rotation:0,...a}}function H(a,t,e=new Float32Array(16)){let[r,i,n,h,u,s,l,f,o,c,d,p,x,y,m,g]=a,[w,v,B,M,b,T,A,U,P,F,I,L,G,E,D,C]=t;return e[0]=w*r+v*u+B*o+M*x,e[1]=w*i+v*s+B*c+M*y,e[2]=w*n+v*l+B*d+M*m,e[3]=w*h+v*f+B*p+M*g,e[4]=b*r+T*u+A*o+U*x,e[5]=b*i+T*s+A*c+U*y,e[6]=b*n+T*l+A*d+U*m,e[7]=b*h+T*f+A*p+U*g,e[8]=P*r+F*u+I*o+L*x,e[9]=P*i+F*s+I*c+L*y,e[10]=P*n+F*l+I*d+L*m,e[11]=P*h+F*f+I*p+L*g,e[12]=G*r+E*u+D*o+C*x,e[13]=G*i+E*s+D*c+C*y,e[14]=G*n+E*l+D*d+C*m,e[15]=G*h+E*f+D*p+C*g,e}function et(a,t,e,r,i,n){return new Float32Array([2/(t-a),0,0,0,0,2/(r-e),0,0,0,0,2/(i-n),0,(a+t)/(a-t),(e+r)/(e-r),(i+n)/(i-n),1])}function W(a,t){return a.x>=t.x&&a.y>=t.y&&a.x+a.w<=t.x+t.w&&a.y+a.h<=t.y+t.h}function lt(a,t,e,r){return[-(r-t),e-a]}function dt(a){let t=Math.sqrt(a[0]**2+a[1]**2);return a[0]=t?a[0]/t:0,a[1]=t?a[1]/t:0,a}function rt(a,t,e,r){return dt(lt(a,t,e,r))}var S,z=N(()=>{"use strict";S=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])});var st={};J(st,{default:()=>wt});var R,wt,at=N(()=>{"use strict";z();R=0,wt={root:{draw({clear:a,strokeCap:t,strokeJoin:e,strokeWidth:r,strokeColor:i,polyline:n,line:h},u){function s(o){r(30),i([0,0,0,1]),n(o),r(2),t("butt"),e("none"),i([0,1,0,1]),n(o),r(5);for(let c=0;c<o.length-3;c+=2){let[d,p]=rt(o[c],o[c+1],o[c+2],o[c+3]);i([0,1,0,1]),h(o[c],o[c+1],d*10+o[c],p*10+o[c+1]),i([.5,.5,1,1]);let[x,y]=[o[c+2]-o[c],o[c+3]-o[c+1]],[m,g]=[o[c+4]-o[c+2],o[c+5]-o[c+3]],w=Math.hypot(x,y),v=Math.hypot(m,g),B=-y/w,M=x/w,b=-g/v,T=m/v,A=(B+b)*10+o[c+2],U=(M+T)*10+o[c+3];h(o[c+2],o[c+3],A,U);let P=o[c+4]-o[c+2],F=o[c+5]-o[c+3],I=Math.hypot(P,F),L=P/I,G=F/I;h(o[c+2],o[c+3],o[c+2]+L*20,o[c+3]+G*20)}}function l(o,c,d,p){r(1);let x=Math.PI*2/p;for(let y=0;y<p;y++){let m=y*x,g=o+Math.cos(m)*d,w=c+Math.sin(m)*d;h(o,c,g,w)}r(2),i([0,1,0,1])}a(),t("butt"),e("none"),s([50,500,150,400,250,500,350,400]),t("square"),e("none"),s([50,400,150,300,250,400,350,300]),t("round"),e("none"),s([50,300,150,200,250,300,350,200]),t("round"),e("miter"),s([450,200,450,150,550,180,530,120,650,200,810,100,850,200]);let f=100;t("square"),e("bevel"),s([450,200+f,450,150+f,550,180+f,530,120+f,650,200+f,810,100+f,850,200+f]),f+=100,t("round"),e("round"),s([450,200+f,450,150+f,550,180+f,530,120+f,650,200+f,810,100+f,850,200+f]),t("butt"),e("none"),s([450,500,550,500]),t("square"),s([450,550,550,550]),t("round"),s([450,600,550,600]),t("butt"),e("bevel"),s([900,200,1e3,200,906,234]),e("miter"),s([900,100,1e3,100,906,134]),e("round"),s([900,300,1e3,300,906,314]),s([900,400,1e3,400,906,400]),e("bevel"),s([1250,200,1150,200,1244,234]),e("miter"),s([1250,100,1150,100,1244,134]),e("round"),s([1250,300,1150,300,1244,314]),s([1250,400,1150,400,1244,400]),e("round"),t("round"),s([820,600,920,600,920+Math.cos(R)*100,600+Math.sin(R)*100]),e("miter"),t("butt"),s([600,600,700,600,700+Math.cos(R)*100,600+Math.sin(R)*100]),e("bevel"),s([1040,600,1140,600,1140+Math.cos(R)*100,600+Math.sin(R)*100]),R+=.01,R>Math.PI*2&&(R=0),i([0,0,0,1]),l(140,600,100,20),u()}}}});var nt={};J(nt,{default:()=>vt});var vt,ot=N(()=>{"use strict";vt={root:{draw({rect:a,color:t}){t(new Float32Array([0,0,0,1])),a(0,0,canvas.width,canvas.height),t(new Float32Array([1,1,1,1])),a(10,10,canvas.width-20,canvas.height-20),t(new Float32Array([0,0,0,1])),a(canvas.width/2,0,1,canvas.height),a(0,canvas.height/2,canvas.width,1),t(new Float32Array([1,0,0,1])),a(canvas.width/2-10,canvas.height/2-50,20,100)}}}});z();z();var O=class{device;size;textureFormat="rgba8unorm";textureArray;textureMetaBuffer;needsUpdate=!1;layers=[];#t;#e=4;#s=0;#r;#i=!1;constructor(t){this.device=t,this.size=t.limits.maxTextureDimension2D,this.textureArray=this.createGPUTexture(this.#e);for(let e=0;e<this.#e;e++)this.createNewLayer();this.#t=new Float32Array(800),this.textureMetaBuffer=this.device.createBuffer({size:this.#t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}get layerCount(){return this.layers.length}update(t){if(this.#r){for(let e=0;e<this.layers.length;e++)t.copyTextureToTexture({texture:this.#r,origin:{x:0,y:0,z:e}},{texture:this.textureArray,origin:{x:0,y:0,z:e}},{width:this.size,height:this.size,depthOrArrayLayers:1});this.#r.destroy(),this.#r=void 0}this.#i&&(this.textureMetaBuffer.destroy(),this.textureMetaBuffer=this.device.createBuffer({size:this.#t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.#i=!1),this.device.queue.writeBuffer(this.textureMetaBuffer,0,this.#t.buffer),this.needsUpdate=!1}add(t){let e=this.findNext(t.width,t.height);return t.data instanceof ArrayBuffer?this.device.queue.writeTexture({texture:this.textureArray,origin:{x:e.x,y:e.y,z:e.layer}},t.data,{bytesPerRow:t.width*4},{width:t.width,height:t.height,depthOrArrayLayers:1}):this.device.queue.copyExternalImageToTexture({source:t.data},{texture:this.textureArray,origin:{x:e.x,y:e.y,z:e.layer}},{width:t.width,height:t.height}),this.updateTextureMeta(e),e}reset(){this.layers=[],this.#s=0,this.#t.fill(0),this.#r=void 0,this.textureArray.destroy(),this.textureArray=this.createGPUTexture(this.#e);for(let t=0;t<this.#e;t++)this.createNewLayer();this.needsUpdate=!0}updateTextureMeta(t){let r=t.id*8;if(this.#t.length<r+8){let n=new Float32Array(this.#t.length*2);n.set(this.#t),this.#t=n,this.#i=!0}let i=this.size;this.#t[r]=t.x/i,this.#t[r+1]=t.y/i,this.#t[r+2]=t.w/i,this.#t[r+3]=t.h/i,this.#t[r+4]=t.layer,this.needsUpdate=!0}createGPUTexture(t){return this.device.createTexture({size:[this.size,this.size,t],format:this.textureFormat,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT,dimension:"2d"})}pruneFreeList(t){let e=t.freeRects;for(let r=0;r<e.length;r++){let i=e[r];for(let n=r+1;n<e.length;n++){let h=e[n];if(W(i,h)){e.splice(r,1),r--;break}W(h,i)&&(e.splice(n,1),n--)}}}findNext(t,e){let r,i,n=-1,h;for(let s of this.layers)for(let l=0;l<s.freeRects.length;l++){let f=s.freeRects[l];if(f.w>=t&&f.h>=e){let o=f.w-t,c=f.h-e,d=Math.min(o,c),p=Math.max(o,c);(r===void 0||d<r.score1||d===r.score1&&p<r.score2)&&(r={freeRectIndex:l,score1:d,score2:p},i={x:f.x,y:f.y,w:t,h:e},n=l,h=s)}}if(!h||!i||n===-1){let s=this.createNewLayer();this.#r=this.textureArray,this.textureArray=this.createGPUTexture(this.layers.length);let l=s.freeRects[0];i={x:l.x,y:l.y,w:t,h:e},n=0,h=s,this.needsUpdate=!0}this.placeRect(h,i,n);let u={id:this.#s++,layer:h.layerIndex,...i};return h.usedRects.push(u),u}placeRect(t,e,r){let i=t.freeRects[r],n={x:e.x+e.w,y:e.y,w:i.w-e.w,h:e.h},h={x:e.x,y:e.y+e.h,w:i.w,h:i.h-e.h};t.freeRects.splice(r,1),n.w>0&&n.h>0&&t.freeRects.push(n),h.w>0&&h.h>0&&t.freeRects.push(h),this.pruneFreeList(t)}createNewLayer(){let t={freeRects:[{x:0,y:0,w:this.size,h:this.size}],usedRects:[],layerIndex:this.layers.length};return this.layers.push(t),t}};var pt=`
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
	@location(10) sdf: f32, // 0=rect, 1=start cap, 2=end cap
};

struct Uniforms {
    viewProj: mat4x4f,
};

struct VertexOutput {
    @builtin(position) position: vec4f,
	@location(0) texcoord: vec2f,
	@location(1) color: vec4f,
	@location(2) @interpolate(flat) textureId: u32,
	@location(3) @interpolate(flat) capType: u32, // 0=rect, 1=start cap, 2=end cap
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
	output.capType = u32(input.sdf);
    return output;
}
`,xt=`
struct FragmentInput {
    @builtin(position) position: vec4f,
    @location(0) texcoord: vec2f,
	@location(1) color: vec4f,
	@location(2) @interpolate(flat) textureId: u32,
	@location(3) @interpolate(flat) capType: u32, // 0=rect, 1=start cap, 2=end cap
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

fn roundShapeSDF(uv: vec2f, dir: f32) -> f32 {
    // When dir = 0 \u2192 full circle at (0.5, 0.5)
    // When dir = -1 \u2192 half-disc facing left
    // When dir =  1 \u2192 half-disc facing right

    // Interpolate between the two centers depending on |dir|
    let isHalf = abs(dir);
    let center = mix(vec2f(0.5, 0.5), vec2f(0.5 - 0.5 * dir, 0.5), isHalf);

    // Scale radii: full circle = 0.5 radius, half-disc uses full width
    let radius_x = mix(0.5, 1.0, isHalf);
    let radius_y = 0.5;

    // Elliptical distance
    let p = vec2f((uv.x - center.x) / radius_x, (uv.y - center.y) / radius_y);
    var d = length(p) - 1.0;

    // For half-disc, mask out the opposite side smoothly
    // planeDist = (uv.x - center.x) * dir \u2192 >0 is outside half
    let planeDist = (uv.x - center.x) * dir;
    d = mix(d, max(d, planeDist), isHalf);

    return d;
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
	let tMeta = textureMeta[input.textureId];
	var uv = tMeta.uvOffset + input.texcoord * tMeta.uvSize;
	var color = textureSample(textureArray, mySampler, uv, u32(tMeta.layer)) * input.color;
	
    var mask: f32 = 1.0;
    if (input.capType == 1u) {
        let d = halfDiscSDF(input.texcoord, -1.0);
        mask = step(0.0, -d);
    } else if (input.capType == 2u) {
        let d = halfDiscSDF(input.texcoord, 1.0);
        mask = step(0.0, -d);
    } else if (input.capType == 3u) {
        let d = circleSDF(input.texcoord);
        mask = step(0.0, -d);
	}

    color.a *= mask;

    return color;
}
	`;async function yt(a){if(!navigator.gpu)throw new Error("WebGPU not supported");let t=await navigator.gpu.requestAdapter();if(!t)throw new Error("Failed to get GPU adapter");let e=await t.requestDevice(),r=a.getContext("webgpu");if(!r)throw new Error("Could not create WebGPU context");let i=navigator.gpu.getPreferredCanvasFormat();return r.configure({device:e,format:i,alphaMode:"premultiplied"}),{device:e,context:r,format:i}}function mt({device:a,format:t,vertexWgsl:e,fragmentWgsl:r}){let i=a.createShaderModule({code:e}),n=a.createShaderModule({code:r});return a.createRenderPipeline({layout:"auto",vertex:{module:i,entryPoint:"main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x4"},{shaderLocation:1,offset:16,format:"float32x2"}],stepMode:"vertex"},{arrayStride:96,attributes:[{shaderLocation:2,offset:0,format:"float32x4"},{shaderLocation:3,offset:16,format:"float32x4"},{shaderLocation:4,offset:32,format:"float32x4"},{shaderLocation:5,offset:48,format:"float32x4"},{shaderLocation:6,offset:64,format:"float32x4"},{shaderLocation:7,offset:80,format:"float32"},{shaderLocation:8,offset:84,format:"float32"},{shaderLocation:9,offset:88,format:"float32"},{shaderLocation:10,offset:92,format:"float32"}],stepMode:"instance"}]},fragment:{module:n,entryPoint:"main",targets:[{format:t,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"}})}var _=class{initial;value;dirty=!0;constructor(t){this.initial=t,this.value=t}set(t){this.value=t,this.dirty=!0}reset(){this.set(this.initial)}},X=class{initial;value;dirty=!0;#t;constructor(t){this.initial=t,this.value=t,this.#t=[t]}push(t){this.#t.push(this.value),this.set(t)}pop(){let t=this.#t.pop();if(!t)throw new Error("Uniform stack empty");this.set(t)}pushMultiply(t){this.push(this.value===S?t:H(this.value,t))}set(t){this.value=t,this.dirty=!0}reset(){this.#t.length=0,this.set(this.initial)}};var $=class{program;growth;buffer;count=0;#t=0;#e;constructor(t,e,r=4096){this.program=t,this.growth=r,this.#e=new Float32Array(e),this.buffer=t.device.createBuffer({size:r,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}push(...t){let e=this.program.device,r=0;for(let i of t)this.#e.set(i,r),r+=i.length;return this.#t+this.#e.byteLength>this.buffer.size&&this.grow(),e.queue.writeBuffer(this.buffer,this.#t,this.#e.buffer),this.#t+=this.#e.byteLength,this.count++,this.#e}setInstance(t,e){let r=t*this.#e.byteLength;if(r+e.byteLength>this.buffer.size)throw new Error("Instance index out of range");this.program.device.queue.writeBuffer(this.buffer,r,e.buffer)}clear(){this.#t=0,this.count=0}reset(){this.#t=0,this.count=0}grow(){let t=this.program.device,e=t.createBuffer({size:this.buffer.size+this.growth,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),r=t.createCommandEncoder();r.copyBufferToBuffer(this.buffer,e),t.queue.submit([r.finish()]),this.buffer.destroy(),this.buffer=e}},K=class{device;color=new _(new Float32Array([1,1,1,1]));model=new X(S);view=new _(S);projection=new _(S);whiteTexture;textureAtlas;instanceBuffer;canvas;textureId=0;context;renderPipeline;#t;#e;#s;#r;#i;constructor({device:t,format:e,context:r}){this.device=t,this.context=r,this.renderPipeline=mt({device:t,format:e,vertexWgsl:pt,fragmentWgsl:xt}),this.#i=t.createSampler({magFilter:"nearest",minFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.canvas=r.canvas,this.textureAtlas=new O(t),this.#t=this.createBuffer({size:144,usage:GPUBufferUsage.VERTEX,initial:[0,0,0,1,0,0,1,0,0,1,1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,1,0,1,1,1]}),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.#r=t.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.#e=t.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.#r}}]}),this.#s=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#i},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]}),this.instanceBuffer=new $(this,24)}updateTextureBindGroup(){this.#s=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#i},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]})}draw(){let{projection:t,view:e,device:r,context:i}=this,n=r.createCommandEncoder();(t.dirty||e.dirty)&&(t.dirty=e.dirty=!1,r.queue.writeBuffer(this.#r,0,H(t.value,e.value))),this.textureAtlas.needsUpdate&&(this.textureAtlas.update(n),this.updateTextureBindGroup());let h=i.getCurrentTexture().createView(),u=n.beginRenderPass({colorAttachments:[{view:h,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});u.setPipeline(this.renderPipeline),u.setVertexBuffer(0,this.#t),u.setVertexBuffer(1,this.instanceBuffer.buffer),u.setBindGroup(0,this.#e),u.setBindGroup(1,this.#s),u.draw(6,this.instanceBuffer.count,0,0),u.end(),r.queue.submit([n.finish()])}pushInstance(t,e,r=0){return this.instanceBuffer.push(this.model.value,this.color.value,new Float32Array([this.textureId,t,e,r]))}destroy(){this.#t.destroy(),this.#r.destroy(),this.instanceBuffer.buffer.destroy()}resize(t,e){(this.canvas.width!==t||this.canvas.height!==e)&&(this.canvas.width=t,this.canvas.height=e);let r=navigator.gpu.getPreferredCanvasFormat();this.context.configure({device:this.device,format:r,alphaMode:"premultiplied"})}clear(){this.instanceBuffer.clear()}reset(){this.instanceBuffer.reset(),this.textureAtlas.reset(),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.color.reset(),this.model.reset()}createColorTexture(t){return this.textureAtlas.add({width:1,height:1,data:new Uint8Array(t.map(e=>e*255)).buffer})}createBuffer({size:t,initial:e,usage:r}){let i=this.device.createBuffer({size:t,usage:r,mappedAtCreation:!!e});return e&&(new Float32Array(i.getMappedRange()).set(e),i.unmap()),i}};async function it(a){return new K(await yt(a.canvas))}z();z();var q=class{ctx;#t;#e=1;#s=1;#r=0;#i=0;#o=1;#c=1;#u=k();#n="butt";#a="none";#h={Ax:0,Ay:0,Bx:0,By:0,uxIn:0,uyIn:0,uxOut:0,uyOut:0,turn:1};constructor(t){this.ctx=t,this.resetViewport()}color=(t,e=t)=>{this.ctx.color.set(t),this.#t=e};fillColor=t=>{this.ctx.color.set(t)};rect=(t,e,r,i)=>{this.pushM(r,0,0,i,t-this.#r,e-this.#i)};strokeColor=t=>{this.#t=Array.isArray(t)?new Float32Array(t):t};strokeWidth=t=>{this.#e=t};strokeCap=t=>{this.#n=t};strokeJoin=t=>{this.#a=t};line=(t,e,r,i)=>{this.polyline([t,e,r,i])};polyline=t=>{if(t.length<4)throw new Error("Need at least two points.");let e=this.#e*this.#s,r=this.#r,i=this.#i,n=this.#o,h=this.#c;this.#t&&this.ctx.color.set(this.#t),this.#n!=="butt"&&this.drawCap((t[0]-r)/n,(t[1]-i)/h,(t[2]-r)/n,(t[3]-i)/h,e,"start");for(let u=0;u<t.length-2;u+=2){let s=(t[u]-r)/n,l=(t[u+1]-i)/h,f=(t[u+2]-r)/n,o=(t[u+3]-i)/h;if(this.lineSegment(s,l,f,o,e),u<t.length-4){let c=(t[u+4]-r)/n,d=(t[u+5]-i)/h;this.#a==="round"?this.drawRoundJoin(f,o,e):(this.#a==="bevel"||this.#a==="miter")&&this.drawBevelJoin(s,l,f,o,c,d,e),this.#a==="miter"&&this.drawMiterJoin(s,l,f,o,c,d,e)}}if(this.#n!=="butt"){let u=t.length-2;this.drawCap((t[u-2]-r)/n,(t[u-1]-i)/h,(t[u]-r)/n,(t[u+1]-i)/h,e,"end")}};viewport=(t,e,r,i)=>{let n=r-t,h=i-e;this.#o=n/this.ctx.canvas.width,this.#c=h/this.ctx.canvas.height,this.#r=t,this.#i=e,this.ctx.projection.set(et(0,this.ctx.canvas.width,this.ctx.canvas.height,0,-1,1))};resetViewport=()=>{this.viewport(0,0,this.ctx.canvas.width,this.ctx.canvas.height)};clear=()=>{this.ctx.clear()};reset=()=>{this.resetViewport(),this.ctx.reset()};lineSegment(t,e,r,i,n){let h=r-t,u=i-e,s=Math.sqrt(h*h+u*u),l=h/s,f=u/s;s<1&&(s=1);let o=n*-f,c=n*l;this.pushM(s*l,s*f,o,c,o*-.5+t,c*-.5+e)}drawRoundJoin(t,e,r){this.pushM(r,0,0,r,t-r/2,e-r/2,3)}getBevelPoints(t,e,r,i,n,h,u){let s=this.#h,l=r-t,f=i-e,o=Math.sqrt(l*l+f*f);if(o===0)return;let c=s.uxIn=l/o,d=s.uyIn=f/o,p=n-r,x=h-i,y=Math.sqrt(p*p+x*x);if(y===0)return;let m=s.uxOut=p/y,g=s.uyOut=x/y,w=l*x-f*p;s.turn=w<=0?1:-1;let v=u/2*s.turn;return s.Ax=r+-d*v,s.Ay=i+c*v,s.Bx=r+-g*v,s.By=i+m*v,s}drawBevelJoin(t,e,r,i,n,h,u){let s=this.getBevelPoints(t,e,r,i,n,h,u);if(!s)return;let{Ax:l,Ay:f,Bx:o,By:c}=s,d=(l+o)/2,p=(f+c)/2,x=o-l,y=c-f,m=Math.sqrt(x*x+y*y);this.lineSegment(r,i,d,p,m)}pushM(t,e,r,i,n,h,u=0){let s=this.#u;s[0]=t,s[1]=e,s[4]=r,s[5]=i,s[12]=n,s[13]=h,this.ctx.model.pushMultiply(s),this.ctx.pushInstance(1,1,u),this.ctx.model.pop()}drawMiterJoin(t,e,r,i,n,h,u,s=u*5){let l=u/2,f=this.getBevelPoints(t,e,r,i,n,h,u);if(!f)return;let{Ax:o,Ay:c,Bx:d,By:p,uxIn:x,uyIn:y,uxOut:m,uyOut:g,turn:w}=f;if(x*m+y*g<-.9510565162951536)return;let B=(-y-g)*w,M=(x+m)*w,b=Math.sqrt(B*B+M*M);if(b===0)return;let T=b/2,A=l/T;if(A>s)return;let U=r+B/b*A,P=i+M/b*A;this.pushM(U-o,P-c,d-U,p-P,o,c)}drawCap(t,e,r,i,n,h){let u=h==="start",s=u?t:r,l=u?e:i,f=Math.atan2(i-e,r-t),o=Math.cos(f),c=Math.sin(f),d=n/2*(u?-1:1),p=n*-c,x=n*o;this.pushM(d*o,d*c,p,x,p*-.5+s,x*-.5+l,this.#n==="round"?u?1:2:0)}};async function gt({src:a,width:t,height:e}){return new Promise(r=>{let i=new Image;i.src=a,i.addEventListener("load",()=>{r({data:i,width:t??i.naturalWidth,height:e??i.naturalHeight})})})}var V=class{program;pipeline=[];commit=[];#t=0;#e=!1;#s;#r=new Map;constructor(t){this.program=t,this.#s=new q(t)}async load(t){let e=this.program,r=t;if(r.box){t.box=tt(t.box),r.box.dirty=!1,r.box.parentM=e.model.value;let i=j(r.box);e.model.pushMultiply(i)}if(t.fill&&e.color.set(t.fill),t.texture){let i=e.textureAtlas.add(await gt(t.texture));e.textureId=i.id}if(r._instanceIndex=e.instanceBuffer.count,e.pushInstance(t.box?.w??1,t.box?.h??1).slice(0),t.id&&this.#r.set(t.id,t),e.textureId=0,t.draw&&this.#i(()=>t.draw?.(this.#s,()=>this.requestRender())),t.children)for(let i of t.children)await this.load(i);if(t.box&&e.model.pop(),t.fill&&e.color.reset(),t.update){let i=h=>{let u=this.#r.get(h);if(!u)throw new Error(`Invalid id: "${h}"`);return u},n=typeof t.update=="function"?t.update:new Function("node","get",t.update);this.#i(()=>n(t,i))}this.commit.push(()=>{if(r.box?.dirty){let i=j(r.box);e.model.set(r.box.parentM),e.model.pushMultiply(i),e.instanceBuffer.setInstance(r._instanceIndex,e.model.value),r.box.dirty=!1,this.requestRender()}r.dirty&&(r.dirty=!1,this.requestRender())})}reset(){this.stop(),this.program.reset(),this.pipeline.length=0,this.commit.length=0}requestRender(){this.#e||(this.#e=!0,cancelAnimationFrame(this.#t),this.#t=requestAnimationFrame(()=>{this.#e=!1;for(let t of this.pipeline)t();for(let t of this.commit)t();this.program.draw()}))}stop(){cancelAnimationFrame(this.#t),this.#e=!1}#i=t=>{this.pipeline.push(t)}};var Z=document.getElementById("demo"),bt=await it({canvas:document.getElementById("canvas")}),Y,Q=new URL(location.href),ct,Bt={lines:()=>Promise.resolve().then(()=>(at(),st)),rect:()=>Promise.resolve().then(()=>(ot(),nt))};async function ht(){let a=Z.value;ct=a.endsWith(".json")?await fetch(a).then(t=>t.json()):(await Bt[a]()).default,Q.searchParams.set("demo",a);try{history.pushState(void 0,"",Q.search)}catch(t){console.error(t)}Y?.reset(),Y??=new V(bt),await Y.load(ct.root),Y.requestRender()}var ut=Q.searchParams.get("demo");ut&&(Z.value=ut);Z.onchange=ht;ht();
