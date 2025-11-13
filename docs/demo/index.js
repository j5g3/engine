var ft=Object.defineProperty;var Y=(a,t)=>()=>(a&&(t=a(a=0)),t);var J=(a,t)=>{for(var e in t)ft(a,e,{get:t[e],enumerable:!0})};function k(a){return a?new Float32Array(a):G.slice(0)}function j(a,t=new Float32Array(16)){let{x:e,y:r,sx:i,sy:s,cx:h,cy:f,rotation:n}=a;t[2]=t[3]=t[6]=t[7]=t[8]=t[9]=t[11]=t[14]=0,t[10]=t[15]=1;let l=Math.cos(n),u=Math.sin(n);return t[0]=i*l,t[1]=i*u,t[4]=s*-u,t[5]=s*l,t[12]=t[0]*-h+t[4]*-f+e,t[13]=t[1]*-h+t[5]*-f+r,t}function tt(a){return{x:0,y:0,w:0,h:0,sx:1,sy:1,cx:0,cy:0,rotation:0,...a}}function H(a,t,e=new Float32Array(16)){let[r,i,s,h,f,n,l,u,o,c,d,p,x,y,m,w]=a,[v,b,B,M,U,g,R,T,A,P,_,I,L,E,D,C]=t;return e[0]=v*r+b*f+B*o+M*x,e[1]=v*i+b*n+B*c+M*y,e[2]=v*s+b*l+B*d+M*m,e[3]=v*h+b*u+B*p+M*w,e[4]=U*r+g*f+R*o+T*x,e[5]=U*i+g*n+R*c+T*y,e[6]=U*s+g*l+R*d+T*m,e[7]=U*h+g*u+R*p+T*w,e[8]=A*r+P*f+_*o+I*x,e[9]=A*i+P*n+_*c+I*y,e[10]=A*s+P*l+_*d+I*m,e[11]=A*h+P*u+_*p+I*w,e[12]=L*r+E*f+D*o+C*x,e[13]=L*i+E*n+D*c+C*y,e[14]=L*s+E*l+D*d+C*m,e[15]=L*h+E*u+D*p+C*w,e}function et(a,t,e,r,i,s){return new Float32Array([2/(t-a),0,0,0,0,2/(r-e),0,0,0,0,2/(i-s),0,(a+t)/(a-t),(e+r)/(e-r),(i+s)/(i-s),1])}function W(a,t){return a.x>=t.x&&a.y>=t.y&&a.x+a.w<=t.x+t.w&&a.y+a.h<=t.y+t.h}function lt(a,t,e,r){return[-(r-t),e-a]}function dt(a){let t=Math.sqrt(a[0]**2+a[1]**2);return a[0]=t?a[0]/t:0,a[1]=t?a[1]/t:0,a}function rt(a,t,e,r){return dt(lt(a,t,e,r))}var G,S=Y(()=>{"use strict";G=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])});var st={};J(st,{default:()=>wt});var F,wt,at=Y(()=>{"use strict";S();F=0,wt={root:{draw({clear:a,strokeCap:t,strokeJoin:e,strokeWidth:r,strokeColor:i,polyline:s,line:h},f){function n(o){r(30),i([0,0,0,1]),s(o),r(2),t("butt"),e("none"),i([0,1,0,1]),s(o),r(5);for(let c=0;c<o.length-3;c+=2){let[d,p]=rt(o[c],o[c+1],o[c+2],o[c+3]);i([0,1,0,1]),h(o[c],o[c+1],d*10+o[c],p*10+o[c+1]),i([.5,.5,1,1]);let[x,y]=[o[c+2]-o[c],o[c+3]-o[c+1]],[m,w]=[o[c+4]-o[c+2],o[c+5]-o[c+3]],v=Math.hypot(x,y),b=Math.hypot(m,w),B=-y/v,M=x/v,U=-w/b,g=m/b,R=(B+U)*10+o[c+2],T=(M+g)*10+o[c+3];h(o[c+2],o[c+3],R,T);let A=o[c+4]-o[c+2],P=o[c+5]-o[c+3],_=Math.hypot(A,P),I=A/_,L=P/_;h(o[c+2],o[c+3],o[c+2]+I*20,o[c+3]+L*20)}}function l(o,c,d,p){r(1),i([1,0,0,1]);let x=Math.PI*2/p;for(let y=0;y<p;y++){let m=y*x,w=o+Math.cos(m)*d,v=c+Math.sin(m)*d;h(o,c,w,v)}r(2),i([0,1,0,1])}a(),t("butt"),e("none"),n([50,500,150,400,250,500,350,400]),t("square"),e("none"),n([50,400,150,300,250,400,350,300]),t("round"),e("none"),n([50,300,150,200,250,300,350,200]),t("round"),e("miter"),n([450,200,450,150,550,180,530,120,650,200,810,100,850,200]);let u=100;t("square"),e("bevel"),n([450,200+u,450,150+u,550,180+u,530,120+u,650,200+u,810,100+u,850,200+u]),u+=100,t("round"),e("round"),n([450,200+u,450,150+u,550,180+u,530,120+u,650,200+u,810,100+u,850,200+u]),t("butt"),e("none"),n([450,500,550,500]),t("square"),n([450,550,550,550]),t("round"),n([450,600,550,600]),t("butt"),e("bevel"),n([900,200,1e3,200,906,234]),e("miter"),n([900,100,1e3,100,906,134]),e("round"),n([900,300,1e3,300,906,314]),n([900,400,1e3,400,906,400]),e("bevel"),n([1250,200,1150,200,1244,234]),e("miter"),n([1250,100,1150,100,1244,134]),e("round"),n([1250,300,1150,300,1244,314]),n([1250,400,1150,400,1244,400]),e("round"),t("round"),n([820,600,920,600,920+Math.cos(F)*100,600+Math.sin(F)*100]),e("miter"),t("butt"),n([600,600,700,600,700+Math.cos(F)*100,600+Math.sin(F)*100]),e("bevel"),n([1040,600,1140,600,1140+Math.cos(F)*100,600+Math.sin(F)*100]),F+=.01,F>Math.PI*2&&(F=0),i([0,0,0,1]),l(100,600,100,12),f()}}}});var nt={};J(nt,{default:()=>vt});var vt,ot=Y(()=>{"use strict";vt={root:{draw({rect:a,color:t}){t(new Float32Array([0,0,0,1])),a(0,0,canvas.width,canvas.height),t(new Float32Array([1,1,1,1])),a(10,10,canvas.width-20,canvas.height-20),t(new Float32Array([0,0,0,1])),a(canvas.width/2,0,1,canvas.height),a(0,canvas.height/2,canvas.width,1),t(new Float32Array([1,0,0,1])),a(canvas.width/2-10,canvas.height/2-50,20,100)}}}});S();S();var V=class{device;size;textureFormat="rgba8unorm";textureArray;textureMetaBuffer;needsUpdate=!1;layers=[];#t;#e=4;#s=0;#r;#i=!1;constructor(t){this.device=t,this.size=t.limits.maxTextureDimension2D,this.textureArray=this.createGPUTexture(this.#e);for(let e=0;e<this.#e;e++)this.createNewLayer();this.#t=new Float32Array(800),this.textureMetaBuffer=this.device.createBuffer({size:this.#t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}get layerCount(){return this.layers.length}update(t){if(this.#r){for(let e=0;e<this.layers.length;e++)t.copyTextureToTexture({texture:this.#r,origin:{x:0,y:0,z:e}},{texture:this.textureArray,origin:{x:0,y:0,z:e}},{width:this.size,height:this.size,depthOrArrayLayers:1});this.#r.destroy(),this.#r=void 0}this.#i&&(this.textureMetaBuffer.destroy(),this.textureMetaBuffer=this.device.createBuffer({size:this.#t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.#i=!1),this.device.queue.writeBuffer(this.textureMetaBuffer,0,this.#t.buffer),this.needsUpdate=!1}add(t){let e=this.findNext(t.width,t.height);return t.data instanceof ArrayBuffer?this.device.queue.writeTexture({texture:this.textureArray,origin:{x:e.x,y:e.y,z:e.layer}},t.data,{bytesPerRow:t.width*4},{width:t.width,height:t.height,depthOrArrayLayers:1}):this.device.queue.copyExternalImageToTexture({source:t.data},{texture:this.textureArray,origin:{x:e.x,y:e.y,z:e.layer}},{width:t.width,height:t.height}),this.updateTextureMeta(e),e}reset(){this.layers=[],this.#s=0,this.#t.fill(0),this.#r=void 0,this.textureArray.destroy(),this.textureArray=this.createGPUTexture(this.#e);for(let t=0;t<this.#e;t++)this.createNewLayer();this.needsUpdate=!0}updateTextureMeta(t){let r=t.id*8;if(this.#t.length<r+8){let s=new Float32Array(this.#t.length*2);s.set(this.#t),this.#t=s,this.#i=!0}let i=this.size;this.#t[r]=t.x/i,this.#t[r+1]=t.y/i,this.#t[r+2]=t.w/i,this.#t[r+3]=t.h/i,this.#t[r+4]=t.layer,this.needsUpdate=!0}createGPUTexture(t){return this.device.createTexture({size:[this.size,this.size,t],format:this.textureFormat,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT,dimension:"2d"})}pruneFreeList(t){let e=t.freeRects;for(let r=0;r<e.length;r++){let i=e[r];for(let s=r+1;s<e.length;s++){let h=e[s];if(W(i,h)){e.splice(r,1),r--;break}W(h,i)&&(e.splice(s,1),s--)}}}findNext(t,e){let r,i,s=-1,h;for(let n of this.layers)for(let l=0;l<n.freeRects.length;l++){let u=n.freeRects[l];if(u.w>=t&&u.h>=e){let o=u.w-t,c=u.h-e,d=Math.min(o,c),p=Math.max(o,c);(r===void 0||d<r.score1||d===r.score1&&p<r.score2)&&(r={freeRectIndex:l,score1:d,score2:p},i={x:u.x,y:u.y,w:t,h:e},s=l,h=n)}}if(!h||!i||s===-1){let n=this.createNewLayer();this.#r=this.textureArray,this.textureArray=this.createGPUTexture(this.layers.length);let l=n.freeRects[0];i={x:l.x,y:l.y,w:t,h:e},s=0,h=n,this.needsUpdate=!0}this.placeRect(h,i,s);let f={id:this.#s++,layer:h.layerIndex,...i};return h.usedRects.push(f),f}placeRect(t,e,r){let i=t.freeRects[r],s={x:e.x+e.w,y:e.y,w:i.w-e.w,h:e.h},h={x:e.x,y:e.y+e.h,w:i.w,h:i.h-e.h};t.freeRects.splice(r,1),s.w>0&&s.h>0&&t.freeRects.push(s),h.w>0&&h.h>0&&t.freeRects.push(h),this.pruneFreeList(t)}createNewLayer(){let t={freeRects:[{x:0,y:0,w:this.size,h:this.size}],usedRects:[],layerIndex:this.layers.length};return this.layers.push(t),t}};var pt=`
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
	`;async function yt(a){if(!navigator.gpu)throw new Error("WebGPU not supported");let t=await navigator.gpu.requestAdapter();if(!t)throw new Error("Failed to get GPU adapter");let e=await t.requestDevice(),r=a.getContext("webgpu");if(!r)throw new Error("Could not create WebGPU context");let i=navigator.gpu.getPreferredCanvasFormat();return r.configure({device:e,format:i,alphaMode:"premultiplied"}),{device:e,context:r,format:i}}function mt({device:a,format:t,vertexWgsl:e,fragmentWgsl:r}){let i=a.createShaderModule({code:e}),s=a.createShaderModule({code:r});return a.createRenderPipeline({layout:"auto",vertex:{module:i,entryPoint:"main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x4"},{shaderLocation:1,offset:16,format:"float32x2"}],stepMode:"vertex"},{arrayStride:96,attributes:[{shaderLocation:2,offset:0,format:"float32x4"},{shaderLocation:3,offset:16,format:"float32x4"},{shaderLocation:4,offset:32,format:"float32x4"},{shaderLocation:5,offset:48,format:"float32x4"},{shaderLocation:6,offset:64,format:"float32x4"},{shaderLocation:7,offset:80,format:"float32"},{shaderLocation:8,offset:84,format:"float32"},{shaderLocation:9,offset:88,format:"float32"},{shaderLocation:10,offset:92,format:"float32"}],stepMode:"instance"}]},fragment:{module:s,entryPoint:"main",targets:[{format:t,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"}})}var z=class{initial;value;dirty=!0;constructor(t){this.initial=t,this.value=t}set(t){this.value=t,this.dirty=!0}reset(){this.set(this.initial)}},X=class{initial;value;dirty=!0;#t;constructor(t){this.initial=t,this.value=t,this.#t=[t]}push(t){this.#t.push(this.value),this.set(t)}pop(){let t=this.#t.pop();if(!t)throw new Error("Uniform stack empty");this.set(t)}pushMultiply(t){this.push(this.value===G?t:H(this.value,t))}set(t){this.value=t,this.dirty=!0}reset(){this.#t.length=0,this.set(this.initial)}};var $=class{program;growth;buffer;count=0;#t=0;#e;constructor(t,e,r=4096){this.program=t,this.growth=r,this.#e=new Float32Array(e),this.buffer=t.device.createBuffer({size:r,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}push(...t){let e=this.program.device,r=0;for(let i of t)this.#e.set(i,r),r+=i.length;return this.#t+this.#e.byteLength>this.buffer.size&&this.grow(),e.queue.writeBuffer(this.buffer,this.#t,this.#e.buffer),this.#t+=this.#e.byteLength,this.count++,this.#e}setInstance(t,e){let r=t*this.#e.byteLength;if(r+e.byteLength>this.buffer.size)throw new Error("Instance index out of range");this.program.device.queue.writeBuffer(this.buffer,r,e.buffer)}clear(){this.#t=0,this.count=0}reset(){this.#t=0,this.count=0}grow(){let t=this.program.device,e=t.createBuffer({size:this.buffer.size+this.growth,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),r=t.createCommandEncoder();r.copyBufferToBuffer(this.buffer,e),t.queue.submit([r.finish()]),this.buffer.destroy(),this.buffer=e}},K=class{device;color=new z(new Float32Array([1,1,1,1]));model=new X(G);view=new z(G);projection=new z(G);whiteTexture;textureAtlas;instanceBuffer;canvas;textureId=0;context;renderPipeline;#t;#e;#s;#r;#i;constructor({device:t,format:e,context:r}){this.device=t,this.context=r,this.renderPipeline=mt({device:t,format:e,vertexWgsl:pt,fragmentWgsl:xt}),this.#i=t.createSampler({magFilter:"nearest",minFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.canvas=r.canvas,this.textureAtlas=new V(t),this.#t=this.createBuffer({size:144,usage:GPUBufferUsage.VERTEX,initial:[0,0,0,1,0,0,1,0,0,1,1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,1,0,1,1,1]}),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.#r=t.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.#e=t.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.#r}}]}),this.#s=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#i},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]}),this.instanceBuffer=new $(this,24)}updateTextureBindGroup(){this.#s=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#i},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]})}draw(){let{projection:t,view:e,device:r,context:i}=this,s=r.createCommandEncoder();(t.dirty||e.dirty)&&(t.dirty=e.dirty=!1,r.queue.writeBuffer(this.#r,0,H(t.value,e.value))),this.textureAtlas.needsUpdate&&(this.textureAtlas.update(s),this.updateTextureBindGroup());let h=i.getCurrentTexture().createView(),f=s.beginRenderPass({colorAttachments:[{view:h,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});f.setPipeline(this.renderPipeline),f.setVertexBuffer(0,this.#t),f.setVertexBuffer(1,this.instanceBuffer.buffer),f.setBindGroup(0,this.#e),f.setBindGroup(1,this.#s),f.draw(6,this.instanceBuffer.count,0,0),f.end(),r.queue.submit([s.finish()])}pushInstance(t,e,r=0){return this.instanceBuffer.push(this.model.value,this.color.value,new Float32Array([this.textureId,t,e,r]))}destroy(){this.#t.destroy(),this.#r.destroy(),this.instanceBuffer.buffer.destroy()}resize(t,e){(this.canvas.width!==t||this.canvas.height!==e)&&(this.canvas.width=t,this.canvas.height=e);let r=navigator.gpu.getPreferredCanvasFormat();this.context.configure({device:this.device,format:r,alphaMode:"premultiplied"})}clear(){this.instanceBuffer.clear()}reset(){this.instanceBuffer.reset(),this.textureAtlas.reset(),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.color.reset(),this.model.reset()}createColorTexture(t){return this.textureAtlas.add({width:1,height:1,data:new Uint8Array(t.map(e=>e*255)).buffer})}createBuffer({size:t,initial:e,usage:r}){let i=this.device.createBuffer({size:t,usage:r,mappedAtCreation:!!e});return e&&(new Float32Array(i.getMappedRange()).set(e),i.unmap()),i}};async function it(a){return new K(await yt(a.canvas))}S();S();var q=class{ctx;#t;#e=1;#s=1;#r=0;#i=0;#o=k();#n="butt";#a="none";constructor(t){this.ctx=t,this.resetViewport()}color=(t,e=t)=>{this.ctx.color.set(t),this.#t=e};fillColor=t=>{this.ctx.color.set(t)};rect=(t,e,r,i)=>{this.pushM(r,0,0,i,t-this.#r,e-this.#i)};strokeColor=t=>{this.#t=Array.isArray(t)?new Float32Array(t):t};strokeWidth=t=>{this.#e=t};strokeCap=t=>{this.#n=t};strokeJoin=t=>{this.#a=t};line=(t,e,r,i)=>{this.polyline([t,e,r,i])};polyline=t=>{if(t.length<4)throw new Error("Need at least two points.");let e=this.#e*this.#s,r=this.#r,i=this.#i;this.#t&&this.ctx.color.set(this.#t),this.#n!=="butt"&&this.drawCap(t[0]-r,t[1]-i,t[2]-r,t[3]-i,e,"start");for(let s=0;s<t.length-2;s+=2){let h=t[s]-r,f=t[s+1]-i,n=t[s+2]-r,l=t[s+3]-i;if(this.lineSegment(h,f,n,l,e),s<t.length-4){if(this.#a==="round")this.drawRoundJoin(n,l,e);else if(this.#a==="bevel"||this.#a==="miter"){let u=t[s+4]-r,o=t[s+5]-i;this.drawBevelJoin(h,f,n,l,u,o,e)}if(this.#a==="miter"){let u=t[s+4]-r,o=t[s+5]-i;this.drawMiterJoin(h,f,n,l,u,o,e)}}}if(this.#n!=="butt"){let s=t.length-2;this.drawCap(t[s-2]-r,t[s-1]-i,t[s]-r,t[s+1]-i,e,"end")}};viewport=(t,e,r,i)=>{this.ctx.projection.set(et(0,r-t,i-e,0,-1,1)),this.#s=(i-e)/this.ctx.canvas.height,this.#r=t,this.#i=e};resetViewport=()=>{this.viewport(0,0,this.ctx.canvas.width,this.ctx.canvas.height)};clear=()=>{this.ctx.clear()};reset=()=>{this.resetViewport(),this.ctx.reset()};lineSegment(t,e,r,i,s){let h=r-t,f=i-e,n=Math.hypot(h,f);if(n===0)return;let l=Math.atan2(f,h),u=Math.cos(l),o=Math.sin(l),c=s*-o,d=s*u;this.pushM(n*u,n*o,c,d,c*-.5+t,d*-.5+e)}drawRoundJoin(t,e,r){this.pushM(r,0,0,r,t-r/2,e-r/2,3)}getBevelPoints(t,e,r,i,s,h,f){let n=f/2,l=r-t,u=i-e,o=Math.sqrt(l*l+u*u);if(o===0)return;let c=l/o,d=u/o,p=s-r,x=h-i,y=Math.sqrt(p*p+x*x);if(y===0)return;let m=p/y,w=x/y,v=l*x-u*p,b=-d,B=c,M=-w,U=m,g=v<=0?1:-1,R=r+b*n*g,T=i+B*n*g,A=r+M*n*g,P=i+U*n*g;return{Ax:R,Ay:T,Bx:A,By:P,Ux_in:c,Uy_in:d,Ux_out:m,Uy_out:w,turn:g}}drawBevelJoin(t,e,r,i,s,h,f){let n=this.getBevelPoints(t,e,r,i,s,h,f);if(!n)return;let{Ax:l,Ay:u,Bx:o,By:c}=n,d=(l+o)/2,p=(u+c)/2,x=o-l,y=c-u,m=Math.sqrt(x*x+y*y);this.lineSegment(r,i,d,p,m)}pushM(t,e,r,i,s,h,f=0){let n=this.#o;n[0]=t,n[1]=e,n[4]=r,n[5]=i,n[12]=s,n[13]=h,this.ctx.model.pushMultiply(n),this.ctx.pushInstance(1,1,f),this.ctx.model.pop()}drawMiterJoin(t,e,r,i,s,h,f,n=f*5){let l=f/2,u=this.getBevelPoints(t,e,r,i,s,h,f);if(!u)return;let{Ax:o,Ay:c,Bx:d,By:p,Ux_in:x,Uy_in:y,Ux_out:m,Uy_out:w,turn:v}=u,b=(-y-w)*v,B=(x+m)*v,M=Math.sqrt(b*b+B*B);if(M===0)return;let U=M/2,g=l/U;if(g>n)return;let R=Math.PI*.9;if(Math.acos(Math.max(-1,Math.min(1,x*m+y*w)))>R)return;let A=r+b/M*g,P=i+B/M*g;this.pushM(A-o,P-c,d-A,p-P,o,c)}drawCap(t,e,r,i,s,h){let f=h==="start",n=f?t:r,l=f?e:i,u=Math.atan2(i-e,r-t),o=Math.cos(u),c=Math.sin(u),d=s/2*(f?-1:1),p=s*-c,x=s*o;this.pushM(d*o,d*c,p,x,p*-.5+n,x*-.5+l,this.#n==="round"?f?1:2:0)}};async function gt({src:a,width:t,height:e}){return new Promise(r=>{let i=new Image;i.src=a,i.addEventListener("load",()=>{r({data:i,width:t??i.naturalWidth,height:e??i.naturalHeight})})})}var O=class{program;pipeline=[];commit=[];#t=0;#e=!1;#s;#r=new Map;constructor(t){this.program=t,this.#s=new q(t)}async load(t){let e=this.program,r=t;if(r.box){t.box=tt(t.box),r.box.dirty=!1,r.box.parentM=e.model.value;let i=j(r.box);e.model.pushMultiply(i)}if(t.fill&&e.color.set(t.fill),t.texture){let i=e.textureAtlas.add(await gt(t.texture));e.textureId=i.id}if(r._instanceIndex=e.instanceBuffer.count,e.pushInstance(t.box?.w??1,t.box?.h??1).slice(0),t.id&&this.#r.set(t.id,t),e.textureId=0,t.draw&&this.#i(()=>t.draw?.(this.#s,()=>this.requestRender())),t.children)for(let i of t.children)await this.load(i);if(t.box&&e.model.pop(),t.fill&&e.color.reset(),t.update){let i=h=>{let f=this.#r.get(h);if(!f)throw new Error(`Invalid id: "${h}"`);return f},s=typeof t.update=="function"?t.update:new Function("node","get",t.update);this.#i(()=>s(t,i))}this.commit.push(()=>{if(r.box?.dirty){let i=j(r.box);e.model.set(r.box.parentM),e.model.pushMultiply(i),e.instanceBuffer.setInstance(r._instanceIndex,e.model.value),r.box.dirty=!1,this.requestRender()}r.dirty&&(r.dirty=!1,this.requestRender())})}reset(){this.stop(),this.program.reset(),this.pipeline.length=0,this.commit.length=0}requestRender(){this.#e||(this.#e=!0,cancelAnimationFrame(this.#t),this.#t=requestAnimationFrame(()=>{this.#e=!1;for(let t of this.pipeline)t();for(let t of this.commit)t();this.program.draw()}))}stop(){cancelAnimationFrame(this.#t),this.#e=!1}#i=t=>{this.pipeline.push(t)}};var Z=document.getElementById("demo"),bt=await it({canvas:document.getElementById("canvas")}),N,Q=new URL(location.href),ct,Mt={lines:()=>Promise.resolve().then(()=>(at(),st)),rect:()=>Promise.resolve().then(()=>(ot(),nt))};async function ht(){let a=Z.value;ct=a.endsWith(".json")?await fetch(a).then(t=>t.json()):(await Mt[a]()).default,Q.searchParams.set("demo",a);try{history.pushState(void 0,"",Q.search)}catch(t){console.error(t)}N?.reset(),N??=new O(bt),await N.load(ct.root),N.requestRender()}var ut=Q.searchParams.get("demo");ut&&(Z.value=ut);Z.onchange=ht;ht();
