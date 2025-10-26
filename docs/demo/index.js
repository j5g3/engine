var pe=Object.defineProperty;var Q=o=>e=>{var t=o[e];if(t)return t();throw new Error("Module not found in bundle: "+e)};var l=(o,e)=>()=>(o&&(e=o(o=0)),e);var de=(o,e)=>{for(var t in e)pe(o,t,{get:e[t],enumerable:!0})};function Z(o){return o?new Float32Array(o):y.slice(0)}function j(o,e=new Float32Array(16)){let{x:t,y:r,sx:i,sy:s,cx:a,cy:n,rotation:c}=o;e[2]=e[3]=e[6]=e[7]=e[8]=e[9]=e[11]=e[14]=0,e[10]=e[15]=1;let u=Math.cos(c),h=Math.sin(c);return e[0]=i*u,e[1]=i*h,e[4]=s*-h,e[5]=s*u,e[12]=e[0]*-a+e[4]*-n+t,e[13]=e[1]*-a+e[5]*-n+r,e}function ee(o){return{x:0,y:0,w:0,h:0,sx:1,sy:1,cx:0,cy:0,rotation:0,...o}}function W(o,e,t=new Float32Array(16)){let[r,i,s,a,n,c,u,h,p,d,f,x,g,v,b,B]=o,[A,P,U,R,M,T,F,I,L,G,z,C,E,S,V,O]=e;return t[0]=A*r+P*n+U*p+R*g,t[1]=A*i+P*c+U*d+R*v,t[2]=A*s+P*u+U*f+R*b,t[3]=A*a+P*h+U*x+R*B,t[4]=M*r+T*n+F*p+I*g,t[5]=M*i+T*c+F*d+I*v,t[6]=M*s+T*u+F*f+I*b,t[7]=M*a+T*h+F*x+I*B,t[8]=L*r+G*n+z*p+C*g,t[9]=L*i+G*c+z*d+C*v,t[10]=L*s+G*u+z*f+C*b,t[11]=L*a+G*h+z*x+C*B,t[12]=E*r+S*n+V*p+O*g,t[13]=E*i+S*c+V*d+O*v,t[14]=E*s+S*u+V*f+O*b,t[15]=E*a+S*h+V*x+O*B,t}function te(o,e,t,r,i,s){return new Float32Array([2/(e-o),0,0,0,0,2/(r-t),0,0,0,0,2/(i-s),0,(o+e)/(o-e),(t+r)/(t-r),(i+s)/(i-s),1])}function Y(o,e){return o.x>=e.x&&o.y>=e.y&&o.x+o.w<=e.x+e.w&&o.y+o.h<=e.y+e.h}var y,m=l(()=>{"use strict";y=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])});var _,re=l(()=>{"use strict";m();_=class{device;size;textureFormat="rgba8unorm";textureArray;textureMetaBuffer;needsUpdate=!1;layers=[];#e;#t=4;#i=0;#r;constructor(e){this.device=e,this.size=e.limits.maxTextureDimension2D,this.textureArray=this.createGPUTexture(this.#t);for(let t=0;t<this.#t;t++)this.createNewLayer();this.#e=new Float32Array(800),this.textureMetaBuffer=this.device.createBuffer({size:this.#e.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}get layerCount(){return this.layers.length}update(e){if(this.#r){for(let t=0;t<this.layers.length;t++)e.copyTextureToTexture({texture:this.#r,origin:{x:0,y:0,z:t}},{texture:this.textureArray,origin:{x:0,y:0,z:t}},{width:this.size,height:this.size,depthOrArrayLayers:1});this.#r.destroy(),this.#r=void 0}this.device.queue.writeBuffer(this.textureMetaBuffer,0,this.#e.buffer),this.needsUpdate=!1}add(e){let t=this.findNext(e.width,e.height);return e.data instanceof ArrayBuffer?this.device.queue.writeTexture({texture:this.textureArray,origin:{x:t.x,y:t.y,z:t.layer}},e.data,{bytesPerRow:e.width*4},{width:e.width,height:e.height,depthOrArrayLayers:1}):this.device.queue.copyExternalImageToTexture({source:e.data},{texture:this.textureArray,origin:{x:t.x,y:t.y,z:t.layer}},{width:e.width,height:e.height}),this.updateTextureMeta(t),t}reset(){this.layers=[],this.#i=0,this.#e.fill(0),this.#r=void 0,this.textureArray.destroy(),this.textureArray=this.createGPUTexture(this.#t);for(let e=0;e<this.#t;e++)this.createNewLayer();this.needsUpdate=!0}updateTextureMeta(e){let r=e.id*8,i=this.size;this.#e[r]=e.x/i,this.#e[r+1]=e.y/i,this.#e[r+2]=e.w/i,this.#e[r+3]=e.h/i,this.#e[r+4]=e.layer,this.needsUpdate=!0}createGPUTexture(e){return this.device.createTexture({size:[this.size,this.size,e],format:this.textureFormat,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT,dimension:"2d"})}pruneFreeList(e){let t=e.freeRects;for(let r=0;r<t.length;r++){let i=t[r];for(let s=r+1;s<t.length;s++){let a=t[s];if(Y(i,a)){t.splice(r,1),r--;break}Y(a,i)&&(t.splice(s,1),s--)}}}findNext(e,t){let r,i,s=-1,a;for(let c of this.layers)for(let u=0;u<c.freeRects.length;u++){let h=c.freeRects[u];if(h.w>=e&&h.h>=t){let p=h.w-e,d=h.h-t,f=Math.min(p,d),x=Math.max(p,d);(r===void 0||f<r.score1||f===r.score1&&x<r.score2)&&(r={freeRectIndex:u,score1:f,score2:x},i={x:h.x,y:h.y,w:e,h:t},s=u,a=c)}}if(!a||!i||s===-1){let c=this.createNewLayer();this.#r=this.textureArray,this.textureArray=this.createGPUTexture(this.layers.length);let u=c.freeRects[0];i={x:u.x,y:u.y,w:e,h:t},s=0,a=c,this.needsUpdate=!0}this.placeRect(a,i,s);let n={id:this.#i++,layer:a.layerIndex,...i};return a.usedRects.push(n),n}placeRect(e,t,r){let i=e.freeRects[r],s={x:t.x+t.w,y:t.y,w:i.w-t.w,h:t.h},a={x:t.x,y:t.y+t.h,w:i.w,h:i.h-t.h};e.freeRects.splice(r,1),s.w>0&&s.h>0&&e.freeRects.push(s),a.w>0&&a.h>0&&e.freeRects.push(a),this.pruneFreeList(e)}createNewLayer(){let e={freeRects:[{x:0,y:0,w:this.size,h:this.size}],usedRects:[],layerIndex:this.layers.length};return this.layers.push(e),e}}});async function me(o){if(!navigator.gpu)throw new Error("WebGPU not supported");let e=await navigator.gpu.requestAdapter();if(!e)throw new Error("Failed to get GPU adapter");let t=await e.requestDevice(),r=o.getContext("webgpu");if(!r)throw new Error("Could not create WebGPU context");let i=navigator.gpu.getPreferredCanvasFormat();return r.configure({device:t,format:i,alphaMode:"premultiplied"}),{device:t,context:r,format:i}}function we({device:o,format:e,vertexWgsl:t,fragmentWgsl:r}){let i=o.createShaderModule({code:t}),s=o.createShaderModule({code:r});return o.createRenderPipeline({layout:"auto",vertex:{module:i,entryPoint:"main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x4"},{shaderLocation:1,offset:16,format:"float32x2"}],stepMode:"vertex"},{arrayStride:96,attributes:[{shaderLocation:2,offset:0,format:"float32x4"},{shaderLocation:3,offset:16,format:"float32x4"},{shaderLocation:4,offset:32,format:"float32x4"},{shaderLocation:5,offset:48,format:"float32x4"},{shaderLocation:6,offset:64,format:"float32x4"},{shaderLocation:7,offset:80,format:"float32"},{shaderLocation:8,offset:84,format:"float32"},{shaderLocation:9,offset:88,format:"float32"}],stepMode:"instance"}]},fragment:{module:s,entryPoint:"main",targets:[{format:e,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"}})}async function ie(o){return new X(await me(o.canvas))}var xe,ye,w,H,k,X,oe=l(()=>{"use strict";m();re();xe=`
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
};

struct Uniforms {
    viewProj: mat4x4f,
};

struct VertexOutput {
    @builtin(position) position: vec4f,
	@location(0) texcoord: vec2f,
	@location(1) color: vec4f,
	@location(2) @interpolate(flat) textureId: u32,
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
	//output.position = uniforms.viewProj * model * input.position;
	output.texcoord = input.texcoord;
	output.color = input.instanceColor;
	output.textureId = u32(input.textureId);
    return output;
}
`,ye=`
struct FragmentInput {
    @builtin(position) position: vec4f,
    @location(0) texcoord: vec2f,
	@location(1) color: vec4f,
	@location(2) @interpolate(flat) textureId: u32,
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

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
	let tMeta = textureMeta[input.textureId];
	var uv = tMeta.uvOffset + input.texcoord * tMeta.uvSize;
	let color = textureSample(textureArray, mySampler, uv, u32(tMeta.layer));
    return color * input.color;
}
	`;w=class{initial;value;dirty=!0;constructor(e){this.initial=e,this.value=e}set(e){this.value=e,this.dirty=!0}reset(){this.set(this.initial)}},H=class{initial;value;dirty=!0;#e;constructor(e){this.initial=e,this.value=e,this.#e=[e]}push(e){this.#e.push(this.value),this.set(e)}pop(){let e=this.#e.pop();if(!e)throw new Error("Uniform stack empty");this.set(e)}pushMultiply(e){this.push(this.value===y?e:W(this.value,e))}set(e){this.value=e,this.dirty=!0}reset(){this.#e.length=0,this.set(this.initial)}},k=class{program;growth;buffer;count=0;#e=0;#t;constructor(e,t,r=4096){this.program=e,this.growth=r,this.#t=new Float32Array(t),this.buffer=e.device.createBuffer({size:r,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}push(...e){let t=this.program.device,r=0;for(let i of e)this.#t.set(i,r),r+=i.length;return this.#e+this.#t.byteLength>this.buffer.size&&this.grow(),t.queue.writeBuffer(this.buffer,this.#e,this.#t.buffer),this.#e+=this.#t.byteLength,this.count++,this.#t}setInstance(e,t){let r=e*this.#t.byteLength;if(r+t.byteLength>this.buffer.size)throw new Error("Instance index out of range");this.program.device.queue.writeBuffer(this.buffer,r,t.buffer)}reset(){this.#e=0,this.count=0}grow(){let e=this.program.device,t=e.createBuffer({size:this.buffer.size+this.growth,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),r=e.createCommandEncoder();r.copyBufferToBuffer(this.buffer,t),e.queue.submit([r.finish()]),this.buffer.destroy(),this.buffer=t}},X=class{device;color=new w(new Float32Array([1,1,1,1]));model=new H(y);view=new w(y);projection=new w(y);whiteTexture;textureAtlas;instanceBuffer;canvas;textureId=0;context;renderPipeline;#e;#t;#i;#r;#o;constructor({device:e,format:t,context:r}){this.device=e,this.context=r,this.renderPipeline=we({device:e,format:t,vertexWgsl:xe,fragmentWgsl:ye}),this.#o=e.createSampler({magFilter:"nearest",minFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.canvas=r.canvas,this.textureAtlas=new _(e),this.#e=this.createBuffer({size:144,usage:GPUBufferUsage.VERTEX,initial:[0,0,0,1,0,0,1,0,0,1,1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,1,0,1,1,1]}),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.#r=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.#t=e.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.#r}}]}),this.#i=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#o},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]}),this.instanceBuffer=new k(this,24)}updateTextureBindGroup(){this.#i=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#o},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]})}draw(){let{projection:e,view:t,device:r,context:i}=this,s=r.createCommandEncoder();(e.dirty||t.dirty)&&(e.dirty=t.dirty=!1,r.queue.writeBuffer(this.#r,0,W(e.value,t.value))),this.textureAtlas.needsUpdate&&(this.textureAtlas.update(s),this.updateTextureBindGroup());let a=i.getCurrentTexture().createView(),n=s.beginRenderPass({colorAttachments:[{view:a,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});n.setPipeline(this.renderPipeline),n.setVertexBuffer(0,this.#e),n.setVertexBuffer(1,this.instanceBuffer.buffer),n.setBindGroup(0,this.#t),n.setBindGroup(1,this.#i),n.draw(6,this.instanceBuffer.count,0,0),n.end(),r.queue.submit([s.finish()])}pushInstance(e,t){return this.instanceBuffer.push(this.model.value,this.color.value,new Float32Array([this.textureId,e,t]))}destroy(){this.#e.destroy(),this.#r.destroy(),this.instanceBuffer.buffer.destroy()}reset(){this.instanceBuffer.reset(),this.textureAtlas.reset(),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.color.reset(),this.model.reset()}createColorTexture(e){return this.textureAtlas.add({width:1,height:1,data:new Uint8Array(e.map(t=>t*255)).buffer})}createBuffer({size:e,initial:t,usage:r}){let i=this.device.createBuffer({size:e,usage:r,mappedAtCreation:!!t});return t&&(new Float32Array(i.getMappedRange()).set(t),i.unmap()),i}}});function ge(o,e,t,r,i){o[0]=r,o[5]=i,o[12]=e,o[13]=t}var q,se=l(()=>{"use strict";m();q=class{ctx;#e=Z();constructor(e){this.ctx=e,this.resetViewport()}color=(e,t)=>{this.ctx.color.set(e)};fillColor=e=>{this.ctx.color.set(e)};rect=(e,t,r,i)=>{ge(this.#e,e,t,r,i),this.ctx.model.pushMultiply(this.#e),this.ctx.pushInstance(1,1),this.ctx.model.pop()};viewport=(e,t,r,i)=>{this.ctx.projection.set(te(e,r,i,t,-1,1))};resetViewport=()=>{this.viewport(0,0,this.ctx.canvas.width,this.ctx.canvas.height)};reset=()=>{this.resetViewport(),this.ctx.reset()}}});async function ve({src:o,width:e,height:t}){return new Promise(r=>{let i=new Image;i.src=o,i.addEventListener("load",()=>{r({data:i,width:e??i.naturalWidth,height:t??i.naturalHeight})})})}var D,ae=l(()=>{"use strict";m();se();D=class{program;pipeline=[];commit=[];#e=0;#t=!1;#i;#r=new Map;constructor(e){this.program=e,this.#i=new q(e)}async load(e){let t=this.program,r=e;if(r.box){e.box=ee(e.box),r.box.dirty=!1,r.box.parentM=t.model.value;let i=j(r.box);t.model.pushMultiply(i)}if(e.fill&&t.color.set(e.fill),e.texture){let i=t.textureAtlas.add(await ve(e.texture));t.textureId=i.id}if(r._instanceIndex=t.instanceBuffer.count,t.pushInstance(e.box?.w??1,e.box?.h??1).slice(0),e.id&&this.#r.set(e.id,e),t.textureId=0,e.draw?.(this.#i),e.children)for(let i of e.children)await this.load(i);if(e.box&&t.model.pop(),e.fill&&t.color.reset(),e.update){let i=a=>{let n=this.#r.get(a);if(!n)throw new Error(`Invalid id: "${a}"`);return n},s=typeof e.update=="function"?e.update:new Function("node","get",e.update);this.#o(()=>s(e,i))}this.commit.push(()=>{if(r.box?.dirty){let i=j(r.box);t.model.set(r.box.parentM),t.model.pushMultiply(i),t.instanceBuffer.setInstance(r._instanceIndex,t.model.value),r.box.dirty=!1,this.requestRender()}})}reset(){this.stop(),this.program.reset(),this.pipeline.length=0}requestRender(){this.#t||(this.#t=!0,cancelAnimationFrame(this.#e),this.#e=requestAnimationFrame(()=>{this.#t=!1;for(let e of this.pipeline)e();for(let e of this.commit)e();this.program.draw()}))}stop(){cancelAnimationFrame(this.#e)}#o=e=>{this.pipeline.push(e)}}});var ne={};de(ne,{default:()=>be});var be,ue=l(()=>{"use strict";be={root:{draw({rect:o,color:e}){e(new Float32Array([0,0,0,1])),o(0,0,canvas.width,canvas.height),e(new Float32Array([1,1,1,1])),o(10,10,canvas.width-20,canvas.height-20),e(new Float32Array([0,0,0,1])),o(canvas.width/2,0,1,canvas.height),o(0,canvas.height/2,canvas.width,1),e(new Float32Array([1,0,0,1])),o(canvas.width/2-10,canvas.height/2-50,20,100)}}}});var Ae,$=l(()=>{Ae=Q({"./index.js":()=>ce().then(()=>Be),"./rect.js":()=>Promise.resolve().then(()=>(ue(),ne))})});var Be={};async function le(){let o=K.value;he=o.endsWith(".json")?await fetch(o).then(e=>e.json()):(await Ae(`./${o}.js`)).default,J.searchParams.set("demo",o);try{history.pushState(void 0,"",J.search)}catch(e){console.error(e)}N?.reset(),N??=new D(Pe),await N.load(he.root),N.requestRender()}var K,Pe,N,J,he,fe,ce=l(async()=>{oe();ae();$();K=document.getElementById("demo"),Pe=await ie({canvas:document.getElementById("canvas")}),J=new URL(location.href);fe=J.searchParams.get("demo");fe&&(K.value=fe);K.onchange=le;le()});await ce();
