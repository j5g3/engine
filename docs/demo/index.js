var oe=Object.defineProperty;var W=r=>e=>{var t=r[e];if(t)return t();throw new Error("Module not found in bundle: "+e)};var u=(r,e)=>()=>(r&&(e=r(r=0)),e);var ie=(r,e)=>{for(var t in e)oe(r,t,{get:e[t],enumerable:!0})};function Y(r){return r?new Float32Array(r):f.slice(0)}function X(r,e,t=new Float32Array(16)){let[o,i,n,s,a,h,l,p,d,x,m,w,g,y,v,b]=r,[B,P,U,F,G,T,C,R,V,A,E,S,M,O,L,_]=e;return t[0]=B*o+P*a+U*d+F*g,t[1]=B*i+P*h+U*x+F*y,t[2]=B*n+P*l+U*m+F*v,t[3]=B*s+P*p+U*w+F*b,t[4]=G*o+T*a+C*d+R*g,t[5]=G*i+T*h+C*x+R*y,t[6]=G*n+T*l+C*m+R*v,t[7]=G*s+T*p+C*w+R*b,t[8]=V*o+A*a+E*d+S*g,t[9]=V*i+A*h+E*x+S*y,t[10]=V*n+A*l+E*m+S*v,t[11]=V*s+A*p+E*w+S*b,t[12]=M*o+O*a+L*d+_*g,t[13]=M*i+O*h+L*x+_*y,t[14]=M*n+O*l+L*m+_*v,t[15]=M*s+O*p+L*w+_*b,t}function N(r,e,t,o,i,n){return new Float32Array([2/(e-r),0,0,0,0,2/(o-t),0,0,0,0,2/(i-n),0,(r+e)/(r-e),(t+o)/(t-o),(i+n)/(i-n),1])}var f,q=u(()=>{"use strict";f=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])});async function se(r){if(!navigator.gpu)throw new Error("WebGPU not supported");let e=await navigator.gpu.requestAdapter();if(!e)throw new Error("Failed to get GPU adapter");let t=await e.requestDevice(),o=r.getContext("webgpu");if(!o)throw new Error("Could not create WebGPU context");let i=navigator.gpu.getPreferredCanvasFormat();return o.configure({device:t,format:i,alphaMode:"premultiplied"}),{device:t,context:o,format:i}}function ue({device:r,format:e,vertexWgsl:t,fragmentWgsl:o}){let i=r.createShaderModule({code:t}),n=r.createShaderModule({code:o});return r.createRenderPipeline({layout:"auto",vertex:{module:i,entryPoint:"main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x4"},{shaderLocation:1,offset:16,format:"float32x2"}],stepMode:"vertex"},{arrayStride:80,attributes:[{shaderLocation:2,offset:0,format:"float32x4"},{shaderLocation:3,offset:16,format:"float32x4"},{shaderLocation:4,offset:32,format:"float32x4"},{shaderLocation:5,offset:48,format:"float32x4"},{shaderLocation:6,offset:64,format:"float32x4"}],stepMode:"instance"}]},fragment:{module:n,entryPoint:"main",targets:[{format:e,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"}})}async function $(r){return new j(await se(r.canvas))}var ne,ae,c,z,j,k=u(()=>{"use strict";q();ne=`
struct VertexInput {
    @location(0) position: vec4f,
	@location(1) texcoord: vec2f,
	@location(2) modelRow0: vec4f,
	@location(3) modelRow1: vec4f,
	@location(4) modelRow2: vec4f,
	@location(5) modelRow3: vec4f,
	@location(6) instanceColor: vec4f,
};

struct Uniforms {
    viewProj: mat4x4f,
};

struct VertexOutput {
    @builtin(position) position: vec4f,
	@location(0) texcoord: vec2f,
	@location(1) color: vec4f,
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
	
	output.position = uniforms.viewProj * model * input.position;
	output.texcoord = input.texcoord;
	output.color = input.instanceColor;	
    return output;
}
`,ae=`
struct FragmentInput {
    @builtin(position) position: vec4f,
    @location(0) texcoord: vec2f,
	@location(1) color: vec4f,
};

@group(1) @binding(0) var mySampler: sampler;
@group(1) @binding(1) var myTexture: texture_2d<f32>;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
    let texture_color: vec4f = textureSample(myTexture, mySampler, input.texcoord);
    return texture_color * input.color;
}
	`;c=class{initial;value;dirty=!0;constructor(e){this.initial=e,this.value=e}set(e){this.value=e,this.dirty=!0}reset(){this.set(this.initial)}},z=class{program;growth;buffer;count=0;#e=0;#t;constructor(e,t,o=4096){this.program=e,this.growth=o,this.#t=new Float32Array(t),this.buffer=e.device.createBuffer({size:o,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}push(...e){let t=this.program.device,o=0;for(let i of e)this.#t.set(i,o),o+=i.length;if(this.#e+this.#t.byteLength>this.buffer.size){let i=t.createBuffer({size:this.buffer.size+this.growth,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),n=t.createCommandEncoder();n.copyBufferToBuffer(this.buffer,i),t.queue.submit([n.finish()]),this.buffer.destroy(),this.buffer=i}t.queue.writeBuffer(this.buffer,this.#e,this.#t.buffer),this.#e+=this.#t.byteLength,this.count++}reset(){this.#e=0,this.count=0}},j=class{device;color=new c(new Float32Array([1,1,1,1]));model=new c(f);view=new c(f);projection=new c(f);whiteTexture;canvas;context;renderPipeline;#e;#t;#i;#r;#o;constructor({device:e,format:t,context:o}){this.device=e,this.context=o,this.renderPipeline=ue({device:e,format:t,vertexWgsl:ne,fragmentWgsl:ae});let i=e.createSampler({magFilter:"nearest",minFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"});this.canvas=o.canvas,this.#e=this.createBuffer({size:144,usage:GPUBufferUsage.VERTEX,initial:[-1,-1,0,1,0,0,1,-1,0,1,1,0,-1,1,0,1,0,1,-1,1,0,1,0,1,1,-1,0,1,1,0,1,1,0,1,1,1]}),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.#o=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.#t=e.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.#o}}]}),this.#i=e.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:i},{binding:1,resource:this.whiteTexture.createView()}]}),this.#r=new z(this,20)}draw(){let{projection:e,view:t,device:o,context:i}=this,n=o.createCommandEncoder();if((e.dirty||t.dirty)&&(e.dirty=t.dirty=!1,o.queue.writeBuffer(this.#o,0,X(e.value,t.value))),this.#r.count===0)return;let s=i.getCurrentTexture().createView(),a=n.beginRenderPass({colorAttachments:[{view:s,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});a.setPipeline(this.renderPipeline),a.setVertexBuffer(0,this.#e),a.setVertexBuffer(1,this.#r.buffer),a.setBindGroup(0,this.#t),a.setBindGroup(1,this.#i),a.draw(6,this.#r.count,0,0),a.end(),o.queue.submit([n.finish()])}pushInstance(){this.#r.push(this.model.value,this.color.value)}destroy(){this.#e.destroy(),this.whiteTexture.destroy(),this.#o.destroy(),this.#r.buffer.destroy()}reset(){this.#r.reset(),this.color.reset(),this.model.reset()}createColorTexture(e){let t=this.device.createTexture({size:[1,1,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});return this.device.queue.writeTexture({texture:t},new Uint8Array(e.map(o=>o*255)),{bytesPerRow:4,rowsPerImage:1},{width:1,height:1,depthOrArrayLayers:1}),t}createBuffer({size:e,initial:t,usage:o}){let i=this.device.createBuffer({size:e,usage:o,mappedAtCreation:!!t});return t&&(new Float32Array(i.getMappedRange()).set(t),i.unmap()),i}}});function ce(r,e,t,o,i){r[0]=o/2,r[5]=i/2,r[12]=e+o/2,r[13]=t+i/2}var I,H=u(()=>{"use strict";q();I=class{ctx;#e=Y();constructor(e){this.ctx=e,this.resetViewport()}color=(e,t)=>{this.ctx.color.set(e)};fillColor=e=>{this.ctx.color.set(e)};rect=(e,t,o,i)=>{ce(this.#e,e,t,o,i),this.ctx.model.set(this.#e),this.ctx.pushInstance()};viewport=(e,t,o,i)=>{this.ctx.projection.set(N(e,o,i,t,-1,1))};resetViewport=()=>{this.viewport(0,0,this.ctx.canvas.width,this.ctx.canvas.height)};reset=()=>{this.resetViewport(),this.ctx.reset()}}});var J={};ie(J,{default:()=>fe});var fe,K=u(()=>{"use strict";fe={draw({rect:r,color:e}){e(new Float32Array([0,0,0,1])),r(0,0,canvas.width,canvas.height),e(new Float32Array([1,1,1,1])),r(10,10,canvas.width-20,canvas.height-20),e(new Float32Array([0,0,0,1])),r(canvas.width/2,0,1,canvas.height),r(0,canvas.height/2,canvas.width,1),e(new Float32Array([1,0,0,1])),r(canvas.width/2-10,canvas.height/2-50,20,100)}}});var le,D=u(()=>{le=W({"./index.js":()=>Q().then(()=>he),"./rect.js":()=>Promise.resolve().then(()=>(K(),J))})});var he={};async function re(){let r=ee.value;Z=r.endsWith(".json")?await fetch(r).then(e=>e.json()):(await le(`./${r}.js`)).default;try{history.pushState(void 0,"",`?${r}`)}catch{}Z.draw(pe),te.draw()}var ee,te,pe,Z,Q=u(async()=>{k();H();D();ee=document.getElementById("demo"),te=await $({canvas:document.getElementById("canvas")}),pe=new I(te);ee.onchange=re;re()});await Q();
