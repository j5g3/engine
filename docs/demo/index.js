var ft=Object.defineProperty;var Y=(s,t)=>()=>(s&&(t=s(s=0)),t);var k=(s,t)=>{for(var e in t)ft(s,e,{get:t[e],enumerable:!0})};function j(s){return s?new Float32Array(s):L.slice(0)}function W(s,t=new Float32Array(16)){let{x:e,y:r,sx:i,sy:o,cx:h,cy:f,rotation:a}=s;t[2]=t[3]=t[6]=t[7]=t[8]=t[9]=t[11]=t[14]=0,t[10]=t[15]=1;let u=Math.cos(a),n=Math.sin(a);return t[0]=i*u,t[1]=i*n,t[4]=o*-n,t[5]=o*u,t[12]=t[0]*-h+t[4]*-f+e,t[13]=t[1]*-h+t[5]*-f+r,t}function tt(s){return{x:0,y:0,w:0,h:0,sx:1,sy:1,cx:0,cy:0,rotation:0,...s}}function H(s,t,e=new Float32Array(16)){let[r,i,o,h,f,a,u,n,c,l,d,p,x,y,g,w]=s,[b,M,B,v,U,m,T,R,A,P,_,I,z,C,E,D]=t;return e[0]=b*r+M*f+B*c+v*x,e[1]=b*i+M*a+B*l+v*y,e[2]=b*o+M*u+B*d+v*g,e[3]=b*h+M*n+B*p+v*w,e[4]=U*r+m*f+T*c+R*x,e[5]=U*i+m*a+T*l+R*y,e[6]=U*o+m*u+T*d+R*g,e[7]=U*h+m*n+T*p+R*w,e[8]=A*r+P*f+_*c+I*x,e[9]=A*i+P*a+_*l+I*y,e[10]=A*o+P*u+_*d+I*g,e[11]=A*h+P*n+_*p+I*w,e[12]=z*r+C*f+E*c+D*x,e[13]=z*i+C*a+E*l+D*y,e[14]=z*o+C*u+E*d+D*g,e[15]=z*h+C*n+E*p+D*w,e}function et(s,t,e,r,i,o){return new Float32Array([2/(t-s),0,0,0,0,2/(r-e),0,0,0,0,2/(i-o),0,(s+t)/(s-t),(e+r)/(e-r),(i+o)/(i-o),1])}function X(s,t){return s.x>=t.x&&s.y>=t.y&&s.x+s.w<=t.x+t.w&&s.y+s.h<=t.y+t.h}function lt(s,t,e,r){return[-(r-t),e-s]}function dt(s){let t=Math.sqrt(s[0]**2+s[1]**2);return s[0]=t?s[0]/t:0,s[1]=t?s[1]/t:0,s}function rt(s,t,e,r){return dt(lt(s,t,e,r))}var L,G=Y(()=>{"use strict";L=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])});var st={};k(st,{default:()=>vt});var F,vt,at=Y(()=>{"use strict";G();F=0,vt={root:{draw({clear:s,strokeCap:t,strokeJoin:e,strokeWidth:r,strokeColor:i,polyline:o,line:h},f){function a(n){r(30),i([0,0,0,1]),o(n),r(2),t("butt"),e("none"),i([0,1,0,1]),o(n),r(5);for(let c=0;c<n.length-3;c+=2){let[l,d]=rt(n[c],n[c+1],n[c+2],n[c+3]);i([0,1,0,1]),h(n[c],n[c+1],l*10+n[c],d*10+n[c+1]),i([.5,.5,1,1]);let[p,x]=[n[c+2]-n[c],n[c+3]-n[c+1]],[y,g]=[n[c+4]-n[c+2],n[c+5]-n[c+3]],w=Math.hypot(p,x),b=Math.hypot(y,g),M=-x/w,B=p/w,v=-g/b,U=y/b,m=(M+v)*10+n[c+2],T=(B+U)*10+n[c+3];h(n[c+2],n[c+3],m,T);let R=n[c+4]-n[c+2],A=n[c+5]-n[c+3],P=Math.hypot(R,A),_=R/P,I=A/P;h(n[c+2],n[c+3],n[c+2]+_*20,n[c+3]+I*20)}}s(),t("butt"),e("none"),a([50,500,150,400,250,500,350,400]),t("square"),e("none"),a([50,400,150,300,250,400,350,300]),t("round"),e("none"),a([50,300,150,200,250,300,350,200]),t("round"),e("miter"),a([450,200,450,150,550,180,530,120,650,200,810,100,850,200]);let u=100;t("square"),e("bevel"),a([450,200+u,450,150+u,550,180+u,530,120+u,650,200+u,810,100+u,850,200+u]),u+=100,t("round"),e("round"),a([450,200+u,450,150+u,550,180+u,530,120+u,650,200+u,810,100+u,850,200+u]),t("butt"),e("none"),a([450,500,550,500]),t("square"),a([450,550,550,550]),t("round"),a([450,600,550,600]),t("butt"),e("bevel"),a([900,200,1e3,200,906,234]),e("miter"),a([900,100,1e3,100,906,134]),e("round"),a([900,300,1e3,300,906,314]),a([900,400,1e3,400,906,400]),e("bevel"),a([1250,200,1150,200,1244,234]),e("miter"),a([1250,100,1150,100,1244,134]),e("round"),a([1250,300,1150,300,1244,314]),a([1250,400,1150,400,1244,400]),e("round"),t("round"),a([820,600,920,600,920+Math.cos(F)*100,600+Math.sin(F)*100]),e("miter"),t("butt"),a([600,600,700,600,700+Math.cos(F)*100,600+Math.sin(F)*100]),e("bevel"),a([1040,600,1140,600,1140+Math.cos(F)*100,600+Math.sin(F)*100]),F+=.01,F>Math.PI*2&&(F=0),f()}}}});var nt={};k(nt,{default:()=>bt});var bt,ot=Y(()=>{"use strict";bt={root:{draw({rect:s,color:t}){t(new Float32Array([0,0,0,1])),s(0,0,canvas.width,canvas.height),t(new Float32Array([1,1,1,1])),s(10,10,canvas.width-20,canvas.height-20),t(new Float32Array([0,0,0,1])),s(canvas.width/2,0,1,canvas.height),s(0,canvas.height/2,canvas.width,1),t(new Float32Array([1,0,0,1])),s(canvas.width/2-10,canvas.height/2-50,20,100)}}}});G();G();var V=class{device;size;textureFormat="rgba8unorm";textureArray;textureMetaBuffer;needsUpdate=!1;layers=[];#t;#e=4;#i=0;#r;#s=!1;constructor(t){this.device=t,this.size=t.limits.maxTextureDimension2D,this.textureArray=this.createGPUTexture(this.#e);for(let e=0;e<this.#e;e++)this.createNewLayer();this.#t=new Float32Array(800),this.textureMetaBuffer=this.device.createBuffer({size:this.#t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}get layerCount(){return this.layers.length}update(t){if(this.#r){for(let e=0;e<this.layers.length;e++)t.copyTextureToTexture({texture:this.#r,origin:{x:0,y:0,z:e}},{texture:this.textureArray,origin:{x:0,y:0,z:e}},{width:this.size,height:this.size,depthOrArrayLayers:1});this.#r.destroy(),this.#r=void 0}this.#s&&(this.textureMetaBuffer.destroy(),this.textureMetaBuffer=this.device.createBuffer({size:this.#t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.#s=!1),this.device.queue.writeBuffer(this.textureMetaBuffer,0,this.#t.buffer),this.needsUpdate=!1}add(t){let e=this.findNext(t.width,t.height);return t.data instanceof ArrayBuffer?this.device.queue.writeTexture({texture:this.textureArray,origin:{x:e.x,y:e.y,z:e.layer}},t.data,{bytesPerRow:t.width*4},{width:t.width,height:t.height,depthOrArrayLayers:1}):this.device.queue.copyExternalImageToTexture({source:t.data},{texture:this.textureArray,origin:{x:e.x,y:e.y,z:e.layer}},{width:t.width,height:t.height}),this.updateTextureMeta(e),e}reset(){this.layers=[],this.#i=0,this.#t.fill(0),this.#r=void 0,this.textureArray.destroy(),this.textureArray=this.createGPUTexture(this.#e);for(let t=0;t<this.#e;t++)this.createNewLayer();this.needsUpdate=!0}updateTextureMeta(t){let r=t.id*8;if(this.#t.length<r+8){let o=new Float32Array(this.#t.length*2);o.set(this.#t),this.#t=o,this.#s=!0}let i=this.size;this.#t[r]=t.x/i,this.#t[r+1]=t.y/i,this.#t[r+2]=t.w/i,this.#t[r+3]=t.h/i,this.#t[r+4]=t.layer,this.needsUpdate=!0}createGPUTexture(t){return this.device.createTexture({size:[this.size,this.size,t],format:this.textureFormat,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT,dimension:"2d"})}pruneFreeList(t){let e=t.freeRects;for(let r=0;r<e.length;r++){let i=e[r];for(let o=r+1;o<e.length;o++){let h=e[o];if(X(i,h)){e.splice(r,1),r--;break}X(h,i)&&(e.splice(o,1),o--)}}}findNext(t,e){let r,i,o=-1,h;for(let a of this.layers)for(let u=0;u<a.freeRects.length;u++){let n=a.freeRects[u];if(n.w>=t&&n.h>=e){let c=n.w-t,l=n.h-e,d=Math.min(c,l),p=Math.max(c,l);(r===void 0||d<r.score1||d===r.score1&&p<r.score2)&&(r={freeRectIndex:u,score1:d,score2:p},i={x:n.x,y:n.y,w:t,h:e},o=u,h=a)}}if(!h||!i||o===-1){let a=this.createNewLayer();this.#r=this.textureArray,this.textureArray=this.createGPUTexture(this.layers.length);let u=a.freeRects[0];i={x:u.x,y:u.y,w:t,h:e},o=0,h=a,this.needsUpdate=!0}this.placeRect(h,i,o);let f={id:this.#i++,layer:h.layerIndex,...i};return h.usedRects.push(f),f}placeRect(t,e,r){let i=t.freeRects[r],o={x:e.x+e.w,y:e.y,w:i.w-e.w,h:e.h},h={x:e.x,y:e.y+e.h,w:i.w,h:i.h-e.h};t.freeRects.splice(r,1),o.w>0&&o.h>0&&t.freeRects.push(o),h.w>0&&h.h>0&&t.freeRects.push(h),this.pruneFreeList(t)}createNewLayer(){let t={freeRects:[{x:0,y:0,w:this.size,h:this.size}],usedRects:[],layerIndex:this.layers.length};return this.layers.push(t),t}};var pt=`
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
        mask = step(0.0, -d); // 1 inside, 0 outside
    } else if (input.capType == 2u) {
        let d = halfDiscSDF(input.texcoord, 1.0);
        mask = step(0.0, -d); // 1 inside, 0 outside
    } else if (input.capType == 3u) {
        let d = circleSDF(input.texcoord);
        mask = step(0.0, -d); // 1 inside, 0 outside
	}
    // capType == 0 \u2192 mask stays 1.0

    color.a *= mask;

    return color;
}
	`;async function yt(s){if(!navigator.gpu)throw new Error("WebGPU not supported");let t=await navigator.gpu.requestAdapter();if(!t)throw new Error("Failed to get GPU adapter");let e=await t.requestDevice(),r=s.getContext("webgpu");if(!r)throw new Error("Could not create WebGPU context");let i=navigator.gpu.getPreferredCanvasFormat();return r.configure({device:e,format:i,alphaMode:"premultiplied"}),{device:e,context:r,format:i}}function mt({device:s,format:t,vertexWgsl:e,fragmentWgsl:r}){let i=s.createShaderModule({code:e}),o=s.createShaderModule({code:r});return s.createRenderPipeline({layout:"auto",vertex:{module:i,entryPoint:"main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x4"},{shaderLocation:1,offset:16,format:"float32x2"}],stepMode:"vertex"},{arrayStride:96,attributes:[{shaderLocation:2,offset:0,format:"float32x4"},{shaderLocation:3,offset:16,format:"float32x4"},{shaderLocation:4,offset:32,format:"float32x4"},{shaderLocation:5,offset:48,format:"float32x4"},{shaderLocation:6,offset:64,format:"float32x4"},{shaderLocation:7,offset:80,format:"float32"},{shaderLocation:8,offset:84,format:"float32"},{shaderLocation:9,offset:88,format:"float32"},{shaderLocation:10,offset:92,format:"float32"}],stepMode:"instance"}]},fragment:{module:o,entryPoint:"main",targets:[{format:t,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"}})}var S=class{initial;value;dirty=!0;constructor(t){this.initial=t,this.value=t}set(t){this.value=t,this.dirty=!0}reset(){this.set(this.initial)}},$=class{initial;value;dirty=!0;#t;constructor(t){this.initial=t,this.value=t,this.#t=[t]}push(t){this.#t.push(this.value),this.set(t)}pop(){let t=this.#t.pop();if(!t)throw new Error("Uniform stack empty");this.set(t)}pushMultiply(t){this.push(this.value===L?t:H(this.value,t))}set(t){this.value=t,this.dirty=!0}reset(){this.#t.length=0,this.set(this.initial)}};var K=class{program;growth;buffer;count=0;#t=0;#e;constructor(t,e,r=4096){this.program=t,this.growth=r,this.#e=new Float32Array(e),this.buffer=t.device.createBuffer({size:r,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}push(...t){let e=this.program.device,r=0;for(let i of t)this.#e.set(i,r),r+=i.length;return this.#t+this.#e.byteLength>this.buffer.size&&this.grow(),e.queue.writeBuffer(this.buffer,this.#t,this.#e.buffer),this.#t+=this.#e.byteLength,this.count++,this.#e}setInstance(t,e){let r=t*this.#e.byteLength;if(r+e.byteLength>this.buffer.size)throw new Error("Instance index out of range");this.program.device.queue.writeBuffer(this.buffer,r,e.buffer)}clear(){this.#t=0,this.count=0}reset(){this.#t=0,this.count=0}grow(){let t=this.program.device,e=t.createBuffer({size:this.buffer.size+this.growth,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),r=t.createCommandEncoder();r.copyBufferToBuffer(this.buffer,e),t.queue.submit([r.finish()]),this.buffer.destroy(),this.buffer=e}},Q=class{device;color=new S(new Float32Array([1,1,1,1]));model=new $(L);view=new S(L);projection=new S(L);whiteTexture;textureAtlas;instanceBuffer;canvas;textureId=0;context;renderPipeline;#t;#e;#i;#r;#s;constructor({device:t,format:e,context:r}){this.device=t,this.context=r,this.renderPipeline=mt({device:t,format:e,vertexWgsl:pt,fragmentWgsl:xt}),this.#s=t.createSampler({magFilter:"nearest",minFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.canvas=r.canvas,this.textureAtlas=new V(t),this.#t=this.createBuffer({size:144,usage:GPUBufferUsage.VERTEX,initial:[0,0,0,1,0,0,1,0,0,1,1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,1,0,1,1,1]}),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.#r=t.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.#e=t.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.#r}}]}),this.#i=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#s},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]}),this.instanceBuffer=new K(this,24)}updateTextureBindGroup(){this.#i=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#s},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]})}draw(){let{projection:t,view:e,device:r,context:i}=this,o=r.createCommandEncoder();(t.dirty||e.dirty)&&(t.dirty=e.dirty=!1,r.queue.writeBuffer(this.#r,0,H(t.value,e.value))),this.textureAtlas.needsUpdate&&(this.textureAtlas.update(o),this.updateTextureBindGroup());let h=i.getCurrentTexture().createView(),f=o.beginRenderPass({colorAttachments:[{view:h,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});f.setPipeline(this.renderPipeline),f.setVertexBuffer(0,this.#t),f.setVertexBuffer(1,this.instanceBuffer.buffer),f.setBindGroup(0,this.#e),f.setBindGroup(1,this.#i),f.draw(6,this.instanceBuffer.count,0,0),f.end(),r.queue.submit([o.finish()])}pushInstance(t,e,r=0){return this.instanceBuffer.push(this.model.value,this.color.value,new Float32Array([this.textureId,t,e,r]))}destroy(){this.#t.destroy(),this.#r.destroy(),this.instanceBuffer.buffer.destroy()}resize(t,e){(this.canvas.width!==t||this.canvas.height!==e)&&(this.canvas.width=t,this.canvas.height=e);let r=navigator.gpu.getPreferredCanvasFormat();this.context.configure({device:this.device,format:r,alphaMode:"premultiplied"})}clear(){this.instanceBuffer.clear()}reset(){this.instanceBuffer.reset(),this.textureAtlas.reset(),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.color.reset(),this.model.reset()}createColorTexture(t){return this.textureAtlas.add({width:1,height:1,data:new Uint8Array(t.map(e=>e*255)).buffer})}createBuffer({size:t,initial:e,usage:r}){let i=this.device.createBuffer({size:t,usage:r,mappedAtCreation:!!e});return e&&(new Float32Array(i.getMappedRange()).set(e),i.unmap()),i}};async function it(s){return new Q(await yt(s.canvas))}G();G();function gt(s,t,e,r,i){s[0]=r,s[5]=i,s[12]=t,s[13]=e}var q=class{ctx;#t=j();#e;#i=1;#r=1;#s=j();#n="butt";#a="none";constructor(t){this.ctx=t,this.resetViewport()}color=(t,e=t)=>{this.ctx.color.set(t),this.#e=e};fillColor=t=>{this.ctx.color.set(t)};rect=(t,e,r,i)=>{gt(this.#t,t,e,r,i),this.ctx.model.pushMultiply(this.#t),this.ctx.pushInstance(1,1),this.ctx.model.pop()};strokeColor=t=>{this.#e=Array.isArray(t)?new Float32Array(t):t};strokeWidth=t=>{this.#i=t};strokeCap=t=>{this.#n=t};strokeJoin=t=>{this.#a=t};line=(t,e,r,i)=>{this.polyline([t,e,r,i])};polyline=t=>{if(t.length<4)throw new Error("Need at least two points.");let e=this.#i*this.#r;this.#e&&this.ctx.color.set(this.#e),this.#n!=="butt"&&this.drawCap(t[0],t[1],t[2],t[3],e,"start");for(let r=0;r<t.length-2;r+=2){let i=t[r],o=t[r+1],h=t[r+2],f=t[r+3];if(this.lineSegment(i,o,h,f,e),r<t.length-4){if(this.#a==="round")this.drawRoundJoin(h,f,e);else if(this.#a==="bevel"||this.#a==="miter"){let a=t[r+4],u=t[r+5];this.drawBevelJoin(i,o,h,f,a,u,e)}if(this.#a==="miter"){let a=t[r+4],u=t[r+5];this.drawMiterJoin(i,o,h,f,a,u,e)}}}if(this.#n!=="butt"){let r=t.length-2;this.drawCap(t[r-2],t[r-1],t[r],t[r+1],e,"end")}};viewport=(t,e,r,i)=>{this.ctx.projection.set(et(t,r,i,e,-1,1)),this.#r=(i-e)/this.ctx.canvas.height};resetViewport=()=>{this.viewport(0,0,this.ctx.canvas.width,this.ctx.canvas.height)};clear=()=>{this.ctx.clear()};reset=()=>{this.resetViewport(),this.ctx.reset()};lineSegment(t,e,r,i,o){let h=r-t,f=i-e,a=Math.hypot(h,f);if(a===0)return;let u=Math.atan2(f,h),n=Math.cos(u),c=Math.sin(u),l=o*-c,d=o*n;this.pushM(a*n,a*c,l,d,l*-.5+t,d*-.5+e)}drawRoundJoin(t,e,r){this.pushM(r,0,0,r,t-r/2,e-r/2,3)}getBevelPoints(t,e,r,i,o,h,f){let a=f/2,u=r-t,n=i-e,c=Math.sqrt(u*u+n*n);if(c===0)return;let l=u/c,d=n/c,p=o-r,x=h-i,y=Math.sqrt(p*p+x*x);if(y===0)return;let g=p/y,w=x/y,b=u*x-n*p,M=-d,B=l,v=-w,U=g,m=b<=0?1:-1,T=r+M*a*m,R=i+B*a*m,A=r+v*a*m,P=i+U*a*m;return{Ax:T,Ay:R,Bx:A,By:P,Ux_in:l,Uy_in:d,Ux_out:g,Uy_out:w,turn:m}}drawBevelJoin(t,e,r,i,o,h,f){let a=this.getBevelPoints(t,e,r,i,o,h,f);if(!a)return;let{Ax:u,Ay:n,Bx:c,By:l}=a,d=(u+c)/2,p=(n+l)/2,x=c-u,y=l-n,g=Math.sqrt(x*x+y*y);this.lineSegment(r,i,d,p,g)}pushM(t,e,r,i,o,h,f=0){let a=this.#s;a[0]=t,a[1]=e,a[4]=r,a[5]=i,a[12]=o,a[13]=h,this.ctx.model.pushMultiply(a),this.ctx.pushInstance(1,1,f),this.ctx.model.pop()}drawMiterJoin(t,e,r,i,o,h,f,a=f*5){let u=f/2,n=this.getBevelPoints(t,e,r,i,o,h,f);if(!n)return;let{Ax:c,Ay:l,Bx:d,By:p,Ux_in:x,Uy_in:y,Ux_out:g,Uy_out:w,turn:b}=n,M=(-y-w)*b,B=(x+g)*b,v=Math.sqrt(M*M+B*B);if(v===0)return;let U=v/2,m=u/U;if(m>a)return;let T=Math.PI*.9;if(Math.acos(Math.max(-1,Math.min(1,x*g+y*w)))>T)return;let A=r+M/v*m,P=i+B/v*m;this.pushM(A-c,P-l,d-A,p-P,c,l)}drawCap(t,e,r,i,o,h){let f=h==="start",a=f?t:r,u=f?e:i,n=Math.atan2(i-e,r-t),c=Math.cos(n),l=Math.sin(n),d=o/2*(f?-1:1),p=o*-l,x=o*c;this.pushM(d*c,d*l,p,x,p*-.5+a,x*-.5+u,this.#n==="round"?f?1:2:0)}};async function wt({src:s,width:t,height:e}){return new Promise(r=>{let i=new Image;i.src=s,i.addEventListener("load",()=>{r({data:i,width:t??i.naturalWidth,height:e??i.naturalHeight})})})}var O=class{program;pipeline=[];commit=[];#t=0;#e=!1;#i;#r=new Map;constructor(t){this.program=t,this.#i=new q(t)}async load(t){let e=this.program,r=t;if(r.box){t.box=tt(t.box),r.box.dirty=!1,r.box.parentM=e.model.value;let i=W(r.box);e.model.pushMultiply(i)}if(t.fill&&e.color.set(t.fill),t.texture){let i=e.textureAtlas.add(await wt(t.texture));e.textureId=i.id}if(r._instanceIndex=e.instanceBuffer.count,e.pushInstance(t.box?.w??1,t.box?.h??1).slice(0),t.id&&this.#r.set(t.id,t),e.textureId=0,t.draw&&this.#s(()=>t.draw?.(this.#i,()=>this.requestRender())),t.children)for(let i of t.children)await this.load(i);if(t.box&&e.model.pop(),t.fill&&e.color.reset(),t.update){let i=h=>{let f=this.#r.get(h);if(!f)throw new Error(`Invalid id: "${h}"`);return f},o=typeof t.update=="function"?t.update:new Function("node","get",t.update);this.#s(()=>o(t,i))}this.commit.push(()=>{if(r.box?.dirty){let i=W(r.box);e.model.set(r.box.parentM),e.model.pushMultiply(i),e.instanceBuffer.setInstance(r._instanceIndex,e.model.value),r.box.dirty=!1,this.requestRender()}r.dirty&&(r.dirty=!1,this.requestRender())})}reset(){this.stop(),this.program.reset(),this.pipeline.length=0,this.commit.length=0}requestRender(){this.#e||(this.#e=!0,cancelAnimationFrame(this.#t),this.#t=requestAnimationFrame(()=>{this.#e=!1;for(let t of this.pipeline)t();for(let t of this.commit)t();this.program.draw()}))}stop(){cancelAnimationFrame(this.#t),this.#e=!1}#s=t=>{this.pipeline.push(t)}};var J=document.getElementById("demo"),Mt=await it({canvas:document.getElementById("canvas")}),N,Z=new URL(location.href),ct,Bt={lines:()=>Promise.resolve().then(()=>(at(),st)),rect:()=>Promise.resolve().then(()=>(ot(),nt))};async function ht(){let s=J.value;ct=s.endsWith(".json")?await fetch(s).then(t=>t.json()):(await Bt[s]()).default,Z.searchParams.set("demo",s);try{history.pushState(void 0,"",Z.search)}catch(t){console.error(t)}N?.reset(),N??=new O(Mt),await N.load(ct.root),N.requestRender()}var ut=Z.searchParams.get("demo");ut&&(J.value=ut);J.onchange=ht;ht();
