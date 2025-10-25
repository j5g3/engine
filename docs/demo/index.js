var xe=Object.defineProperty;var K=o=>e=>{var t=o[e];if(t)return t();throw new Error("Module not found in bundle: "+e)};var d=(o,e)=>()=>(o&&(e=o(o=0)),e);var de=(o,e)=>{for(var t in e)xe(o,t,{get:e[t],enumerable:!0})};function Q(o){return o?new Float32Array(o):y.slice(0)}function Z(o,e=new Float32Array(16)){let{x:t,y:r,sx:i,sy:s,cx:a,cy:n,w:h,h:u,rotation:c}=o;e[2]=e[3]=e[6]=e[7]=e[8]=e[9]=e[11]=e[14]=0,e[10]=e[15]=1;let p=Math.cos(c),x=Math.sin(c),f=h*.5,l=u*.5;return e[0]=i*p,e[1]=i*x,e[4]=s*-x,e[5]=s*p,e[0]*=f,e[1]*=f,e[4]*=l,e[5]*=l,e[12]=e[0]+e[4]+e[0]*-a/f+e[4]*-n/l+t,e[13]=e[1]+e[5]+e[1]*-a/f+e[5]*-n/l+r,e}function ee(o){return{x:0,y:0,w:0,h:0,sx:1,sy:1,cx:0,cy:0,rotation:0,...o}}function N(o,e,t=new Float32Array(16)){let[r,i,s,a,n,h,u,c,p,x,f,l,g,v,b,B]=o,[A,U,P,R,T,M,F,z,G,C,S,I,L,E,O,_]=e;return t[0]=A*r+U*n+P*p+R*g,t[1]=A*i+U*h+P*x+R*v,t[2]=A*s+U*u+P*f+R*b,t[3]=A*a+U*c+P*l+R*B,t[4]=T*r+M*n+F*p+z*g,t[5]=T*i+M*h+F*x+z*v,t[6]=T*s+M*u+F*f+z*b,t[7]=T*a+M*c+F*l+z*B,t[8]=G*r+C*n+S*p+I*g,t[9]=G*i+C*h+S*x+I*v,t[10]=G*s+C*u+S*f+I*b,t[11]=G*a+C*c+S*l+I*B,t[12]=L*r+E*n+O*p+_*g,t[13]=L*i+E*h+O*x+_*v,t[14]=L*s+E*u+O*f+_*b,t[15]=L*a+E*c+O*l+_*B,t}function te(o,e,t,r,i,s){return new Float32Array([2/(e-o),0,0,0,0,2/(r-t),0,0,0,0,2/(i-s),0,(o+e)/(o-e),(t+r)/(t-r),(i+s)/(i-s),1])}function j(o,e){return o.x>=e.x&&o.y>=e.y&&o.x+o.w<=e.x+e.w&&o.y+o.h<=e.y+e.h}var y,m=d(()=>{"use strict";y=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])});var V,re=d(()=>{"use strict";m();V=class{device;size;textureFormat="rgba8unorm";textureArray;textureMetaBuffer;needsUpdate=!1;layers=[];#e;#t=4;#i=0;#r;constructor(e){this.device=e,this.size=e.limits.maxTextureDimension2D,console.log("Size: ",this.size),this.textureArray=this.createGPUTexture(this.#t);for(let t=0;t<this.#t;t++)this.createNewLayer();this.#e=new Float32Array(800),this.textureMetaBuffer=this.device.createBuffer({size:this.#e.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}get layerCount(){return this.layers.length}update(e){if(this.#r){for(let t=0;t<this.layers.length;t++)e.copyTextureToTexture({texture:this.#r,origin:{x:0,y:0,z:t}},{texture:this.textureArray,origin:{x:0,y:0,z:t}},{width:this.size,height:this.size,depthOrArrayLayers:1});this.#r.destroy(),this.#r=void 0}this.device.queue.writeBuffer(this.textureMetaBuffer,0,this.#e.buffer),this.needsUpdate=!1}add(e){let t=this.findNext(e.width,e.height);return console.log(t),e.data instanceof ArrayBuffer?this.device.queue.writeTexture({texture:this.textureArray,origin:{x:t.x,y:t.y,z:t.layer}},e.data,{bytesPerRow:e.width*4},{width:e.width,height:e.height,depthOrArrayLayers:1}):this.device.queue.copyExternalImageToTexture({source:e.data},{texture:this.textureArray,origin:{x:t.x,y:t.y,z:t.layer}},{width:e.width,height:e.height}),this.updateTextureMeta(t),t}reset(){this.layers=[],this.#i=0,this.#e.fill(0),this.#r=void 0,this.textureArray.destroy(),this.textureArray=this.createGPUTexture(this.#t);for(let e=0;e<this.#t;e++)this.createNewLayer();this.needsUpdate=!0}updateTextureMeta(e){let r=e.id*8,i=this.size;this.#e[r]=e.x/i,this.#e[r+1]=e.y/i,this.#e[r+2]=e.w/i,this.#e[r+3]=e.h/i,this.#e[r+4]=e.layer,console.log(this.#e.slice(r,r+8)),this.needsUpdate=!0}createGPUTexture(e){return this.device.createTexture({size:[this.size,this.size,e],format:this.textureFormat,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT,dimension:"2d"})}pruneFreeList(e){let t=e.freeRects;for(let r=0;r<t.length;r++){let i=t[r];for(let s=r+1;s<t.length;s++){let a=t[s];if(j(i,a)){t.splice(r,1),r--;break}j(a,i)&&(t.splice(s,1),s--)}}}findNext(e,t){let r,i,s=-1,a;for(let h of this.layers)for(let u=0;u<h.freeRects.length;u++){let c=h.freeRects[u];if(c.w>=e&&c.h>=t){let p=c.w-e,x=c.h-t,f=Math.min(p,x),l=Math.max(p,x);(r===void 0||f<r.score1||f===r.score1&&l<r.score2)&&(r={freeRectIndex:u,score1:f,score2:l},i={x:c.x,y:c.y,w:e,h:t},s=u,a=h)}}if(!a||!i||s===-1){let h=this.createNewLayer();this.#r=this.textureArray,this.textureArray=this.createGPUTexture(this.layers.length);let u=h.freeRects[0];i={x:u.x,y:u.y,w:e,h:t},s=0,a=h,this.needsUpdate=!0}this.placeRect(a,i,s);let n={id:this.#i++,layer:a.layerIndex,...i};return a.usedRects.push(n),n}placeRect(e,t,r){let i=e.freeRects[r],s={x:t.x+t.w,y:t.y,w:i.w-t.w,h:t.h},a={x:t.x,y:t.y+t.h,w:i.w,h:i.h-t.h};e.freeRects.splice(r,1),s.w>0&&s.h>0&&e.freeRects.push(s),a.w>0&&a.h>0&&e.freeRects.push(a),this.pruneFreeList(e)}createNewLayer(){let e={freeRects:[{x:0,y:0,w:this.size,h:this.size}],usedRects:[],layerIndex:this.layers.length};return this.layers.push(e),e}}});async function we(o){if(!navigator.gpu)throw new Error("WebGPU not supported");let e=await navigator.gpu.requestAdapter();if(!e)throw new Error("Failed to get GPU adapter");let t=await e.requestDevice(),r=o.getContext("webgpu");if(!r)throw new Error("Could not create WebGPU context");let i=navigator.gpu.getPreferredCanvasFormat();return r.configure({device:t,format:i,alphaMode:"premultiplied"}),{device:t,context:r,format:i}}function ge({device:o,format:e,vertexWgsl:t,fragmentWgsl:r}){let i=o.createShaderModule({code:t}),s=o.createShaderModule({code:r});return o.createRenderPipeline({layout:"auto",vertex:{module:i,entryPoint:"main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x4"},{shaderLocation:1,offset:16,format:"float32x2"}],stepMode:"vertex"},{arrayStride:96,attributes:[{shaderLocation:2,offset:0,format:"float32x4"},{shaderLocation:3,offset:16,format:"float32x4"},{shaderLocation:4,offset:32,format:"float32x4"},{shaderLocation:5,offset:48,format:"float32x4"},{shaderLocation:6,offset:64,format:"float32x4"},{shaderLocation:7,offset:80,format:"float32"}],stepMode:"instance"}]},fragment:{module:s,entryPoint:"main",targets:[{format:e,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"}})}async function ie(o){return new k(await we(o.canvas))}var ye,me,w,W,Y,k,oe=d(()=>{"use strict";m();re();ye=`
struct VertexInput {
    @location(0) position: vec4f,
	@location(1) texcoord: vec2f,
	@location(2) modelRow0: vec4f,
	@location(3) modelRow1: vec4f,
	@location(4) modelRow2: vec4f,
	@location(5) modelRow3: vec4f,
	@location(6) instanceColor: vec4f,
	@location(7) textureId: f32,
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
	
	output.position = uniforms.viewProj * model * input.position;
	output.texcoord = input.texcoord;
	output.color = input.instanceColor;
	output.textureId = u32(input.textureId);
    return output;
}
`,me=`
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
	//return vec4f(0,tMeta.uvOffset*50, 1.0);
	//return vec4f(tMeta.uvSize * 100.0, 0.0, 1.0);
	
	/*if (input.textureId==3u) {
	    //let uvOffset = vec2f(0.0, 0.0001220703125);
		//let uvSize = vec2f(0.00244140625, 0.029296875);
		let uvOffset = vec2f(0.009765625,0.0001220703125);
		let uvSize = vec2f(0.00244140625,0.029296875);
		uv = uvOffset + input.texcoord * uvSize;
	}*/
	let color = textureSample(textureArray, mySampler, uv, u32(tMeta.layer));
	//return vec4f(input.texcoord, 0.0, 1.0);
    return color * input.color;
}
	`;w=class{initial;value;dirty=!0;constructor(e){this.initial=e,this.value=e}set(e){this.value=e,this.dirty=!0}reset(){this.set(this.initial)}},W=class{initial;value;dirty=!0;#e;constructor(e){this.initial=e,this.value=e,this.#e=[e]}push(e){this.#e.push(this.value),this.set(e)}pop(){let e=this.#e.pop();if(!e)throw new Error("Uniform stack empty");this.set(e)}pushMultiply(e){this.push(this.value===y?e:N(this.value,e))}set(e){this.value=e,this.dirty=!0}reset(){this.#e.length=0,this.set(this.initial)}},Y=class{program;growth;buffer;count=0;#e=0;#t;constructor(e,t,r=4096){this.program=e,this.growth=r,this.#t=new Float32Array(t),this.buffer=e.device.createBuffer({size:r,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}push(...e){let t=this.program.device,r=0;for(let i of e)this.#t.set(i,r),r+=i.length;if(this.#e+this.#t.byteLength>this.buffer.size){let i=t.createBuffer({size:this.buffer.size+this.growth,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),s=t.createCommandEncoder();s.copyBufferToBuffer(this.buffer,i),t.queue.submit([s.finish()]),this.buffer.destroy(),this.buffer=i}t.queue.writeBuffer(this.buffer,this.#e,this.#t.buffer),this.#e+=this.#t.byteLength,this.count++}reset(){this.#e=0,this.count=0}},k=class{device;color=new w(new Float32Array([1,1,1,1]));model=new W(y);view=new w(y);projection=new w(y);whiteTexture;textureAtlas;canvas;textureId=0;context;renderPipeline;#e;#t;#i;#r;#o;#s;constructor({device:e,format:t,context:r}){this.device=e,this.context=r,this.renderPipeline=ge({device:e,format:t,vertexWgsl:ye,fragmentWgsl:me}),this.#s=e.createSampler({magFilter:"nearest",minFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.canvas=r.canvas,this.textureAtlas=new V(e),this.#e=this.createBuffer({size:144,usage:GPUBufferUsage.VERTEX,initial:[-1,-1,0,1,0,0,1,-1,0,1,1,0,-1,1,0,1,0,1,-1,1,0,1,0,1,1,-1,0,1,1,0,1,1,0,1,1,1]}),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.#o=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.#t=e.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.#o}}]}),this.#i=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#s},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]}),this.#r=new Y(this,24)}updateTextureBindGroup(){console.log("updateTextureBindGroup")}draw(){let{projection:e,view:t,device:r,context:i}=this,s=r.createCommandEncoder();console.log("draw()"),(e.dirty||t.dirty)&&(e.dirty=t.dirty=!1,r.queue.writeBuffer(this.#o,0,N(e.value,t.value))),this.textureAtlas.needsUpdate&&(this.textureAtlas.update(s),this.updateTextureBindGroup());let a=i.getCurrentTexture().createView(),n=s.beginRenderPass({colorAttachments:[{view:a,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});n.setPipeline(this.renderPipeline),n.setVertexBuffer(0,this.#e),n.setVertexBuffer(1,this.#r.buffer),n.setBindGroup(0,this.#t),n.setBindGroup(1,this.#i),n.draw(6,this.#r.count,0,0),n.end(),r.queue.submit([s.finish()])}pushInstance(){this.#r.push(this.model.value,this.color.value,new Float32Array([this.textureId]))}destroy(){this.#e.destroy(),this.#o.destroy(),this.#r.buffer.destroy()}reset(){this.#r.reset(),this.textureAtlas.reset(),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.color.reset(),this.model.reset()}createColorTexture(e){return this.textureAtlas.add({width:1,height:1,data:new Uint8Array(e.map(t=>t*255)).buffer})}createBuffer({size:e,initial:t,usage:r}){let i=this.device.createBuffer({size:e,usage:r,mappedAtCreation:!!t});return t&&(new Float32Array(i.getMappedRange()).set(t),i.unmap()),i}}});function ve(o,e,t,r,i){o[0]=r/2,o[5]=i/2,o[12]=e+r/2,o[13]=t+i/2}var q,se=d(()=>{"use strict";m();q=class{ctx;#e=Q();constructor(e){this.ctx=e,this.resetViewport()}color=(e,t)=>{this.ctx.color.set(e)};fillColor=e=>{this.ctx.color.set(e)};rect=(e,t,r,i)=>{ve(this.#e,e,t,r,i),this.ctx.model.pushMultiply(this.#e),this.ctx.pushInstance(),this.ctx.model.pop()};viewport=(e,t,r,i)=>{this.ctx.projection.set(te(e,r,i,t,-1,1))};resetViewport=()=>{this.viewport(0,0,this.ctx.canvas.width,this.ctx.canvas.height)};reset=()=>{this.resetViewport(),this.ctx.reset()}}});async function be({src:o,width:e,height:t}){let i=await(await fetch(o)).blob(),s=await createImageBitmap(i,{resizeWidth:e,resizeHeight:t});return{data:s,width:s.width,height:s.height}}var D,ae=d(()=>{"use strict";m();se();D=class{program;pipeline=[];#e=0;#t=!0;#i;constructor(e){this.program=e,this.#i=new q(e)}async load(e){let t=!1,r=this.program;if(e.box){let i=Z(ee(e.box));r.model.pushMultiply(i),t=!0}if(e.fill&&(r.color.set(e.fill),t=!0),e.texture){let i=r.textureAtlas.add(await be(e.texture));r.textureId=i.id,t=!0}if(t&&(r.pushInstance(),r.textureId=0),e.draw?.(this.#i),e.children)for(let i of e.children)await this.load(i);if(e.box&&r.model.pop(),e.fill&&r.color.reset(),e.update){let i=(a,n)=>{this.requestRender()},s=typeof e.update=="function"?e.update:new Function("node","global",e.update);this.#r(()=>s(e,i))}}reset(){this.stop(),this.program.reset(),this.pipeline.length=0}resize(e,t){}requestRender(){this.#t||(this.#t=!0,cancelAnimationFrame(this.#e),this.#e=requestAnimationFrame(()=>{this.#t=!1;for(let e of this.pipeline)e()}))}stop(){cancelAnimationFrame(this.#e)}#r=e=>{this.pipeline.push(e)}}});var ne={};de(ne,{default:()=>Be});var Be,ue=d(()=>{"use strict";Be={root:{draw({rect:o,color:e}){e(new Float32Array([0,0,0,1])),o(0,0,canvas.width,canvas.height),e(new Float32Array([1,1,1,1])),o(10,10,canvas.width-20,canvas.height-20),e(new Float32Array([0,0,0,1])),o(canvas.width/2,0,1,canvas.height),o(0,canvas.height/2,canvas.width,1),e(new Float32Array([1,0,0,1])),o(canvas.width/2-10,canvas.height/2-50,20,100)}}}});var Ue,H=d(()=>{Ue=K({"./index.js":()=>ce().then(()=>Ae),"./rect.js":()=>Promise.resolve().then(()=>(ue(),ne))})});var Ae={};async function pe(){let o=J.value;fe=o.endsWith(".json")?await fetch(o).then(e=>e.json()):(await Ue(`./${o}.js`)).default,$.searchParams.set("demo",o);try{history.pushState(void 0,"",$.search)}catch(e){console.error(e)}X?.reset(),X??=new D(he),await X.load(fe.root),he.draw()}var J,he,X,$,fe,le,ce=d(async()=>{oe();ae();H();J=document.getElementById("demo"),he=await ie({canvas:document.getElementById("canvas")}),$=new URL(location.href);le=$.searchParams.get("demo");le&&(J.value=le);J.onchange=pe;pe()});await ce();
