var xt=Object.defineProperty;var O=(o,t)=>()=>(o&&(t=o(o=0)),t);var W=(o,t)=>{for(var e in t)xt(o,e,{get:t[e],enumerable:!0})};function et(o){return o?new Float32Array(o):z.slice(0)}function H(o,t=new Float32Array(16)){let{x:e,y:r,sx:i,sy:s,cx:f,cy:h,rotation:n}=o;t[2]=t[3]=t[6]=t[7]=t[8]=t[9]=t[11]=t[14]=0,t[10]=t[15]=1;let l=Math.cos(n),u=Math.sin(n);return t[0]=i*l,t[1]=i*u,t[4]=s*-u,t[5]=s*l,t[12]=t[0]*-f+t[4]*-h+e,t[13]=t[1]*-f+t[5]*-h+r,t}function rt(o){return{x:0,y:0,w:0,h:0,sx:1,sy:1,cx:0,cy:0,rotation:0,...o}}function $(o,t,e=new Float32Array(16)){let[r,i,s,f,h,n,l,u,a,c,y,d,p,x,m,g]=o,[w,v,M,B,b,F,A,R,P,S,I,T,L,C,V,q]=t;return e[0]=w*r+v*h+M*a+B*p,e[1]=w*i+v*n+M*c+B*x,e[2]=w*s+v*l+M*y+B*m,e[3]=w*f+v*u+M*d+B*g,e[4]=b*r+F*h+A*a+R*p,e[5]=b*i+F*n+A*c+R*x,e[6]=b*s+F*l+A*y+R*m,e[7]=b*f+F*u+A*d+R*g,e[8]=P*r+S*h+I*a+T*p,e[9]=P*i+S*n+I*c+T*x,e[10]=P*s+S*l+I*y+T*m,e[11]=P*f+S*u+I*d+T*g,e[12]=L*r+C*h+V*a+q*p,e[13]=L*i+C*n+V*c+q*x,e[14]=L*s+C*l+V*y+q*m,e[15]=L*f+C*u+V*d+q*g,e}function it(o,t,e,r,i,s){return new Float32Array([2/(t-o),0,0,0,0,2/(r-e),0,0,0,0,2/(i-s),0,(o+t)/(o-t),(e+r)/(e-r),(i+s)/(i-s),1])}function K(o,t){return o.x>=t.x&&o.y>=t.y&&o.x+o.w<=t.x+t.w&&o.y+o.h<=t.y+t.h}function yt(o,t,e,r){return[-(r-t),e-o]}function mt(o){let t=Math.sqrt(o[0]**2+o[1]**2);return o[0]=t?o[0]/t:0,o[1]=t?o[1]/t:0,o}function st(o,t,e,r){return mt(yt(o,t,e,r))}var z,G=O(()=>{"use strict";z=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])});var at={};W(at,{default:()=>Bt});var U,Bt,ot=O(()=>{"use strict";G();U=0,Bt={root:{draw({clear:o,strokeCap:t,strokeJoin:e,strokeWidth:r,strokeColor:i,polyline:s,line:f},h){function n(a){r(30),i([0,0,0,1]),s(a),r(2),t("butt"),e("none"),i([0,1,0,1]),s(a),r(5);for(let c=0;c<a.length-3;c+=2){let[y,d]=st(a[c],a[c+1],a[c+2],a[c+3]);i([0,1,0,1]),f(a[c],a[c+1],y*10+a[c],d*10+a[c+1]),i([.5,.5,1,1]);let[p,x]=[a[c+2]-a[c],a[c+3]-a[c+1]],[m,g]=[a[c+4]-a[c+2],a[c+5]-a[c+3]],w=Math.hypot(p,x),v=Math.hypot(m,g),M=-x/w,B=p/w,b=-g/v,F=m/v,A=(M+b)*10+a[c+2],R=(B+F)*10+a[c+3];f(a[c+2],a[c+3],A,R);let P=a[c+4]-a[c+2],S=a[c+5]-a[c+3],I=Math.hypot(P,S),T=P/I,L=S/I;f(a[c+2],a[c+3],a[c+2]+T*20,a[c+3]+L*20)}}function l(a,c,y,d){r(1);let p=Math.PI*2/d;for(let x=0;x<d;x++){let m=x*p,g=a+Math.cos(m)*y,w=c+Math.sin(m)*y;f(a,c,g,w)}r(2),i([0,1,0,1])}o(),t("butt"),e("none"),n([50,500,150,400,250,500,350,400]),t("square"),e("none"),n([50,400,150,300,250,400,350,300]),t("round"),e("none"),n([50,300,150,200,250,300,350,200]),t("round"),e("miter"),n([450,200,450,150,550,180,530,120,650,200,810,100,850,200]);let u=100;t("square"),e("bevel"),n([450,200+u,450,150+u,550,180+u,530,120+u,650,200+u,810,100+u,850,200+u]),u+=100,t("round"),e("round"),n([450,200+u,450,150+u,550,180+u,530,120+u,650,200+u,810,100+u,850,200+u]),t("butt"),e("none"),n([450,500,550,500]),t("square"),n([450,550,550,550]),t("round"),n([450,600,550,600]),t("butt"),e("bevel"),n([900,200,1e3,200,906,234]),e("miter"),n([900,100,1e3,100,906,134]),e("round"),n([900,300,1e3,300,906,314]),n([900,400,1e3,400,906,400]),e("bevel"),n([1250,200,1150,200,1244,234]),e("miter"),n([1250,100,1150,100,1244,134]),e("round"),n([1250,300,1150,300,1244,314]),n([1250,400,1150,400,1244,400]),e("round"),t("round"),n([820,600,920,600,920+Math.cos(U)*100,600+Math.sin(U)*100]),e("miter"),t("butt"),n([600,600,700,600,700+Math.cos(U)*100,600+Math.sin(U)*100]),e("bevel"),n([1040,600,1140,600,1140+Math.cos(U)*100,600+Math.sin(U)*100]),U+=.01,U>Math.PI*2&&(U=0),i([0,0,0,1]),l(140,600,100,20),h()}}}});var ct={};W(ct,{default:()=>At});var At,ut=O(()=>{"use strict";At={root:{draw({rect:o,color:t}){t(new Float32Array([0,0,0,1])),o(0,0,canvas.width,canvas.height),t(new Float32Array([1,1,1,1])),o(10,10,canvas.width-20,canvas.height-20),t(new Float32Array([0,0,0,1])),o(canvas.width/2,0,1,canvas.height),o(0,canvas.height/2,canvas.width,1),t(new Float32Array([1,0,0,1])),o(canvas.width/2-10,canvas.height/2-50,20,100)}}}});var ht={};W(ht,{default:()=>Pt});var E,Pt,ft=O(()=>{"use strict";E=0,Pt={root:{draw({clear:o,color:t,strokeWidth:e,strokeColor:r,line:i,arc:s,circle:f,ellipse:h},n){function l(d,p,x=6){e(1.5),r([.2,.6,1,1]),i(d-x,p,d+x,p),i(d,p-x,d,p+x)}o();let u=-Math.PI*.25,a=u+Math.PI*1.25+Math.sin(E)*.5;t([0,0,0,1]),s(180,360,u,a,80),s(380,360,u+Math.sin(E)*.5,a,80,10),s(580,360,u,a,80,10*E);let c=160;[30,45,60,90,120,180,270,360].forEach((d,p)=>{let x=d*Math.PI/180,m=140+p*140;t([0,0,0,1]),s(m,c,0,x,60),l(m,c)}),t([0,0,0,1]),h(180,540,140,70),l(180,540),t([0,0,0,1]),f(800,600,50),l(800,600),E+=.01,E>Math.PI*2&&(E-=Math.PI*2),n()}}}});G();G();var _=class{device;size;textureFormat="rgba8unorm";textureArray;textureMetaBuffer;needsUpdate=!1;layers=[];#t;#e=4;#s=0;#r;#i=!1;constructor(t){this.device=t,this.size=t.limits.maxTextureDimension2D,this.textureArray=this.createGPUTexture(this.#e);for(let e=0;e<this.#e;e++)this.createNewLayer();this.#t=new Float32Array(800),this.textureMetaBuffer=this.device.createBuffer({size:this.#t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}get layerCount(){return this.layers.length}update(t){if(this.#r){for(let e=0;e<this.layers.length;e++)t.copyTextureToTexture({texture:this.#r,origin:{x:0,y:0,z:e}},{texture:this.textureArray,origin:{x:0,y:0,z:e}},{width:this.size,height:this.size,depthOrArrayLayers:1});this.#r.destroy(),this.#r=void 0}this.#i&&(this.textureMetaBuffer.destroy(),this.textureMetaBuffer=this.device.createBuffer({size:this.#t.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.#i=!1),this.device.queue.writeBuffer(this.textureMetaBuffer,0,this.#t.buffer),this.needsUpdate=!1}add(t){let e=this.findNext(t.width,t.height);return t.data instanceof ArrayBuffer?this.device.queue.writeTexture({texture:this.textureArray,origin:{x:e.x,y:e.y,z:e.layer}},t.data,{bytesPerRow:t.width*4},{width:t.width,height:t.height,depthOrArrayLayers:1}):this.device.queue.copyExternalImageToTexture({source:t.data},{texture:this.textureArray,origin:{x:e.x,y:e.y,z:e.layer}},{width:t.width,height:t.height}),this.updateTextureMeta(e),e}reset(){this.layers=[],this.#s=0,this.#t.fill(0),this.#r=void 0,this.textureArray.destroy(),this.textureArray=this.createGPUTexture(this.#e);for(let t=0;t<this.#e;t++)this.createNewLayer();this.needsUpdate=!0}updateTextureMeta(t){let r=t.id*8;if(this.#t.length<r+8){let s=new Float32Array(this.#t.length*2);s.set(this.#t),this.#t=s,this.#i=!0}let i=this.size;this.#t[r]=t.x/i,this.#t[r+1]=t.y/i,this.#t[r+2]=t.w/i,this.#t[r+3]=t.h/i,this.#t[r+4]=t.layer,this.needsUpdate=!0}createGPUTexture(t){return this.device.createTexture({size:[this.size,this.size,t],format:this.textureFormat,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT,dimension:"2d"})}pruneFreeList(t){let e=t.freeRects;for(let r=0;r<e.length;r++){let i=e[r];for(let s=r+1;s<e.length;s++){let f=e[s];if(K(i,f)){e.splice(r,1),r--;break}K(f,i)&&(e.splice(s,1),s--)}}}findNext(t,e){let r,i,s=-1,f;for(let n of this.layers)for(let l=0;l<n.freeRects.length;l++){let u=n.freeRects[l];if(u.w>=t&&u.h>=e){let a=u.w-t,c=u.h-e,y=Math.min(a,c),d=Math.max(a,c);(r===void 0||y<r.score1||y===r.score1&&d<r.score2)&&(r={freeRectIndex:l,score1:y,score2:d},i={x:u.x,y:u.y,w:t,h:e},s=l,f=n)}}if(!f||!i||s===-1){let n=this.createNewLayer();this.#r=this.textureArray,this.textureArray=this.createGPUTexture(this.layers.length);let l=n.freeRects[0];i={x:l.x,y:l.y,w:t,h:e},s=0,f=n,this.needsUpdate=!0}this.placeRect(f,i,s);let h={id:this.#s++,layer:f.layerIndex,...i};return f.usedRects.push(h),h}placeRect(t,e,r){let i=t.freeRects[r],s={x:e.x+e.w,y:e.y,w:i.w-e.w,h:e.h},f={x:e.x,y:e.y+e.h,w:i.w,h:i.h-e.h};t.freeRects.splice(r,1),s.w>0&&s.h>0&&t.freeRects.push(s),f.w>0&&f.h>0&&t.freeRects.push(f),this.pruneFreeList(t)}createNewLayer(){let t={freeRects:[{x:0,y:0,w:this.size,h:this.size}],usedRects:[],layerIndex:this.layers.length};return this.layers.push(t),t}};var gt=`
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

fn shapeSDF(
    uv: vec2f,    
    innerRadius: f32,
    endAngle: f32,
) -> f32 {
    let center = vec2f(0.5, 0.5);
    let p = uv - center;
    let d = length(p);
    
    // Ring SDF: positive outside, negative inside
    let ringSDF = max(innerRadius - d, d - 0.5);
    
    // Angle SDF (only if not a full circle)
    var angleSDF = -1.0;
    if (endAngle < 6.28318530718) {
        let pNorm = p / max(d, 0.0001); // avoid division by zero
        let endVec = vec2f(cos(endAngle), sin(endAngle));
        
        let crossStart = pNorm.y;
        let crossEnd = pNorm.x * endVec.y - pNorm.y * endVec.x;
        
        if (endAngle <= 3.14159265359) {
            // Small wedge: outside if either cross product is negative
            angleSDF = max(-crossStart, -crossEnd);
        } else {
            // Large wedge: outside only if both are negative
            angleSDF = min(-crossStart, -crossEnd);
        }
    }
    
    return max(ringSDF, angleSDF);
}

fn quadSDF(uv: vec2f) -> f32 {
    let center = vec2f(0.5, 0.5);
    let halfSize = vec2f(0.5, 0.5);
    let p = abs(uv - center) - halfSize;
    return length(max(p, vec2f(0.0))) + min(max(p.x, p.y), 0.0);
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
	let tMeta = textureMeta[input.textureId];
	var uv = tMeta.uvOffset + input.texcoord * tMeta.uvSize;
	var color = textureSample(textureArray, mySampler, uv, u32(tMeta.layer)) * input.color;
	
    var sdf: f32;
    if (input.endAngle >= 0.0) {
        sdf = shapeSDF(input.texcoord, input.innerRadius, input.endAngle);
    } else {
        sdf = quadSDF(input.texcoord);
    }

    let pixelSize = (fwidth(input.texcoord.x) + fwidth(input.texcoord.y)) * 0.5;
    let alpha = 1.0 - smoothstep(0, pixelSize, sdf);

    color *= alpha;

    return color;
}
	`;async function vt(o){if(!navigator.gpu)throw new Error("WebGPU not supported");let t=await navigator.gpu.requestAdapter();if(!t)throw new Error("Failed to get GPU adapter");let e=await t.requestDevice(),r=o.getContext("webgpu");if(!r)throw new Error("Could not create WebGPU context");let i=navigator.gpu.getPreferredCanvasFormat();return r.configure({device:e,format:i,alphaMode:"premultiplied"}),{device:e,context:r,format:i}}function bt({device:o,format:t,vertexWgsl:e,fragmentWgsl:r}){let i=o.createShaderModule({code:e}),s=o.createShaderModule({code:r});return o.createRenderPipeline({layout:"auto",vertex:{module:i,entryPoint:"main",buffers:[{arrayStride:24,attributes:[{shaderLocation:0,offset:0,format:"float32x4"},{shaderLocation:1,offset:16,format:"float32x2"}],stepMode:"vertex"},{arrayStride:100,attributes:[{shaderLocation:2,offset:0,format:"float32x4"},{shaderLocation:3,offset:16,format:"float32x4"},{shaderLocation:4,offset:32,format:"float32x4"},{shaderLocation:5,offset:48,format:"float32x4"},{shaderLocation:6,offset:64,format:"float32x4"},{shaderLocation:7,offset:80,format:"float32"},{shaderLocation:8,offset:84,format:"float32"},{shaderLocation:9,offset:88,format:"float32"},{shaderLocation:10,offset:92,format:"float32"},{shaderLocation:11,offset:96,format:"float32"}],stepMode:"instance"}]},fragment:{module:s,entryPoint:"main",targets:[{format:t,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"}})}var D=class{initial;value;dirty=!0;constructor(t){this.initial=t,this.value=t}set(t){this.value=t,this.dirty=!0}reset(){this.set(this.initial)}},Q=class{initial;value;dirty=!0;#t;constructor(t){this.initial=t,this.value=t,this.#t=[t]}push(t){this.#t.push(this.value),this.set(t)}pop(){let t=this.#t.pop();if(!t)throw new Error("Uniform stack empty");this.set(t)}pushMultiply(t){this.push(this.value===z?t:$(this.value,t))}set(t){this.value=t,this.dirty=!0}reset(){this.#t.length=0,this.set(this.initial)}};var Z=class{program;growth;buffer;count=0;#t=0;#e;constructor(t,e,r=4096){this.program=t,this.growth=r,this.#e=new Float32Array(e),this.buffer=t.device.createBuffer({size:r,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}push(...t){let e=this.program.device,r=0;for(let i of t)this.#e.set(i,r),r+=i.length;return this.#t+this.#e.byteLength>this.buffer.size&&this.grow(),e.queue.writeBuffer(this.buffer,this.#t,this.#e.buffer),this.#t+=this.#e.byteLength,this.count++,this.#e}setInstance(t,e){let r=t*this.#e.byteLength;if(r+e.byteLength>this.buffer.size)throw new Error("Instance index out of range");this.program.device.queue.writeBuffer(this.buffer,r,e.buffer)}clear(){this.#t=0,this.count=0}reset(){this.#t=0,this.count=0}grow(){let t=this.program.device,e=t.createBuffer({size:this.buffer.size+this.growth,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),r=t.createCommandEncoder();r.copyBufferToBuffer(this.buffer,e),t.queue.submit([r.finish()]),this.buffer.destroy(),this.buffer=e}},J=class{device;color=new D(new Float32Array([1,1,1,1]));model=new Q(z);view=new D(z);projection=new D(z);whiteTexture;textureAtlas;instanceBuffer;canvas;textureId=0;context;renderPipeline;#t;#e;#s;#r;#i;constructor({device:t,format:e,context:r}){this.device=t,this.context=r,this.renderPipeline=bt({device:t,format:e,vertexWgsl:gt,fragmentWgsl:wt}),this.#i=t.createSampler({magFilter:"nearest",minFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),this.canvas=r.canvas,this.textureAtlas=new _(t),this.#t=this.createBuffer({size:144,usage:GPUBufferUsage.VERTEX,initial:[0,0,0,1,0,0,1,0,0,1,1,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,1,0,1,1,1]}),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.#r=t.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.#e=t.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.#r}}]}),this.#s=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#i},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]}),this.instanceBuffer=new Z(this,25)}updateTextureBindGroup(){this.#s=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(1),entries:[{binding:0,resource:this.#i},{binding:1,resource:this.textureAtlas.textureArray.createView({dimension:"2d-array",baseArrayLayer:0,arrayLayerCount:this.textureAtlas.layerCount})},{binding:2,resource:{buffer:this.textureAtlas.textureMetaBuffer}}]})}draw(){let{projection:t,view:e,device:r,context:i}=this,s=r.createCommandEncoder();(t.dirty||e.dirty)&&(t.dirty=e.dirty=!1,r.queue.writeBuffer(this.#r,0,$(t.value,e.value))),this.textureAtlas.needsUpdate&&(this.textureAtlas.update(s),this.updateTextureBindGroup());let f=i.getCurrentTexture().createView(),h=s.beginRenderPass({colorAttachments:[{view:f,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});h.setPipeline(this.renderPipeline),h.setVertexBuffer(0,this.#t),h.setVertexBuffer(1,this.instanceBuffer.buffer),h.setBindGroup(0,this.#e),h.setBindGroup(1,this.#s),h.draw(6,this.instanceBuffer.count,0,0),h.end(),r.queue.submit([s.finish()])}pushInstance(t,e,r=-1,i=0){return this.instanceBuffer.push(this.model.value,this.color.value,new Float32Array([this.textureId,t,e,r,i]))}destroy(){this.#t.destroy(),this.#r.destroy(),this.instanceBuffer.buffer.destroy()}resize(t,e){(this.canvas.width!==t||this.canvas.height!==e)&&(this.canvas.width=t,this.canvas.height=e);let r=navigator.gpu.getPreferredCanvasFormat();this.context.configure({device:this.device,format:r,alphaMode:"premultiplied"})}clear(){this.instanceBuffer.clear()}reset(){this.instanceBuffer.reset(),this.textureAtlas.reset(),this.whiteTexture=this.createColorTexture(new Float32Array([1,1,1,1])),this.color.reset(),this.model.reset()}createColorTexture(t){return this.textureAtlas.add({width:1,height:1,data:new Uint8Array(t.map(e=>e*255)).buffer})}createBuffer({size:t,initial:e,usage:r}){let i=this.device.createBuffer({size:t,usage:r,mappedAtCreation:!!e});return e&&(new Float32Array(i.getMappedRange()).set(e),i.unmap()),i}};async function nt(o){return new J(await vt(o.canvas))}G();G();var N=Math.PI*2,Y=class{ctx;#t;#e=1;#s=1;#r=0;#i=0;#o=1;#c=1;#u=et();#a="butt";#n="none";#h={Ax:0,Ay:0,Bx:0,By:0,uxIn:0,uyIn:0,uxOut:0,uyOut:0,turn:1};constructor(t){this.ctx=t,this.resetViewport()}color=(t,e)=>{this.ctx.color.set(Array.isArray(t)?new Float32Array(t):t),e&&this.strokeColor(e)};fillColor=t=>{this.color(t)};strokeColor=t=>{this.#t=Array.isArray(t)?new Float32Array(t):t};rect=(t,e,r,i)=>{this.pushM(r,0,0,i,t-this.#r,e-this.#i)};circle=(t,e,r)=>{this.pushM(r*2,0,0,r*2,t-r-this.#r,e-r-this.#i,N)};ellipse=(t,e,r,i)=>{this.pushM(r*2,0,0,i*2,t-r-this.#r,e-i-this.#i,N)};arc=(t,e,r,i,s,f=0)=>{if(r>i){let p=i;i=r,r=p}let h=Math.cos(r),n=Math.sin(r),l=s*2,u=l*h,a=l*n,c=t-this.#r-.5*(u-a),y=e-this.#i-.5*(a+u),d=i-r;this.pushM(u,a,-a,u,c,y,d,f/l)};strokeWidth=t=>{this.#e=t};strokeCap=t=>{this.#a=t};strokeJoin=t=>{this.#n=t};line=(t,e,r,i)=>{this.polyline([t,e,r,i])};polyline=t=>{if(t.length<4)throw new Error("Need at least two points.");let e=this.#e*this.#s,r=this.#r,i=this.#i,s=this.#o,f=this.#c;if(this.#t&&this.ctx.color.set(this.#t),this.#a!=="butt"){this.drawCap((t[0]-r)/s,(t[1]-i)/f,(t[2]-r)/s,(t[3]-i)/f,e,"start");let h=t.length-2;this.drawCap((t[h-2]-r)/s,(t[h-1]-i)/f,(t[h]-r)/s,(t[h+1]-i)/f,e,"end")}for(let h=0;h<t.length-2;h+=2){let n=(t[h]-r)/s,l=(t[h+1]-i)/f,u=(t[h+2]-r)/s,a=(t[h+3]-i)/f;if(this.lineSegment(n,l,u,a,e),h<t.length-4){let c=(t[h+4]-r)/s,y=(t[h+5]-i)/f;this.#n==="round"?this.drawRoundJoin(u,a,e):(this.#n==="bevel"||this.#n==="miter")&&this.drawBevelJoin(n,l,u,a,c,y,e),this.#n==="miter"&&this.drawMiterJoin(n,l,u,a,c,y,e)}}};viewport=(t,e,r,i)=>{let s=r-t,f=i-e;this.#o=s/this.ctx.canvas.width,this.#c=f/this.ctx.canvas.height,this.#r=t,this.#i=e,this.ctx.projection.set(it(0,this.ctx.canvas.width,this.ctx.canvas.height,0,-1,1))};resetViewport=()=>{this.viewport(0,0,this.ctx.canvas.width,this.ctx.canvas.height)};clear=()=>{this.ctx.clear()};reset=()=>{this.resetViewport(),this.ctx.reset()};lineSegment(t,e,r,i,s){let f=r-t,h=i-e,n=Math.sqrt(f*f+h*h),l=f/n,u=h/n;n<1&&(n=1);let a=s*-u,c=s*l;this.pushM(n*l,n*u,a,c,a*-.5+t,c*-.5+e)}drawRoundJoin(t,e,r){this.pushM(r,0,0,r,t-r/2,e-r/2,N)}getBevelPoints(t,e,r,i,s,f,h){let n=this.#h,l=r-t,u=i-e,a=Math.sqrt(l*l+u*u);if(a===0)return;let c=n.uxIn=l/a,y=n.uyIn=u/a,d=s-r,p=f-i,x=Math.sqrt(d*d+p*p);if(x===0)return;let m=n.uxOut=d/x,g=n.uyOut=p/x,w=l*p-u*d;n.turn=w<=0?1:-1;let v=h/2*n.turn;return n.Ax=r+-y*v,n.Ay=i+c*v,n.Bx=r+-g*v,n.By=i+m*v,n}drawBevelJoin(t,e,r,i,s,f,h){let n=this.getBevelPoints(t,e,r,i,s,f,h);if(!n)return;let{Ax:l,Ay:u,Bx:a,By:c}=n,y=(l+a)/2,d=(u+c)/2,p=a-l,x=c-u,m=Math.sqrt(p*p+x*x);this.lineSegment(r,i,y,d,m)}pushM(t,e,r,i,s,f,h=-1,n=0){let l=this.#u;l[0]=t,l[1]=e,l[4]=r,l[5]=i,l[12]=s,l[13]=f,this.ctx.model.pushMultiply(l),this.ctx.pushInstance(1,1,h,n),this.ctx.model.pop()}drawMiterJoin(t,e,r,i,s,f,h,n=h*5){let l=h/2,u=this.getBevelPoints(t,e,r,i,s,f,h);if(!u)return;let{Ax:a,Ay:c,Bx:y,By:d,uxIn:p,uyIn:x,uxOut:m,uyOut:g,turn:w}=u;if(p*m+x*g<-.9510565162951536)return;let M=(-x-g)*w,B=(p+m)*w,b=Math.sqrt(M*M+B*B);if(b===0)return;let F=b/2,A=l/F;if(A>n)return;let R=r+M/b*A,P=i+B/b*A;this.pushM(R-a,P-c,y-R,d-P,a,c)}drawCap(t,e,r,i,s,f){let h=f==="start",n=s/2,l=h?t:r,u=h?e:i;if(this.#a==="round"){this.pushM(s,0,0,s,l-n-this.#r,u-n-this.#i,N);return}let a=r-t,c=i-e,y=Math.hypot(a,c)||1;a/=y,c/=y;let d=n*a,p=n*c,x=-s*c,m=s*a,g=l-(h?d:0)-.5*x,w=u-(h?p:0)-.5*m;this.pushM(d,p,x,m,g,w)}};async function Mt({src:o,width:t,height:e}){return new Promise(r=>{let i=new Image;i.src=o,i.addEventListener("load",()=>{r({data:i,width:t??i.naturalWidth,height:e??i.naturalHeight})})})}var j=class{program;pipeline=[];commit=[];#t=0;#e=!1;#s;#r=new Map;constructor(t){this.program=t,this.#s=new Y(t)}async load(t){let e=this.program,r=t;if(r.box){t.box=rt(t.box),r.box.dirty=!1,r.box.parentM=e.model.value;let i=H(r.box);e.model.pushMultiply(i)}if(t.fill&&e.color.set(t.fill),t.texture){let i=e.textureAtlas.add(await Mt(t.texture));e.textureId=i.id}if(r._instanceIndex=e.instanceBuffer.count,e.pushInstance(t.box?.w??1,t.box?.h??1).slice(0),t.id&&this.#r.set(t.id,t),e.textureId=0,t.draw&&this.#i(()=>t.draw?.(this.#s,()=>this.requestRender())),t.children)for(let i of t.children)await this.load(i);if(t.box&&e.model.pop(),t.fill&&e.color.reset(),t.update){let i=f=>{let h=this.#r.get(f);if(!h)throw new Error(`Invalid id: "${f}"`);return h},s=typeof t.update=="function"?t.update:new Function("node","get",t.update);this.#i(()=>s(t,i))}this.commit.push(()=>{if(r.box?.dirty){let i=H(r.box);e.model.set(r.box.parentM),e.model.pushMultiply(i),e.instanceBuffer.setInstance(r._instanceIndex,e.model.value),r.box.dirty=!1,this.requestRender()}r.dirty&&(r.dirty=!1,this.requestRender())})}reset(){this.stop(),this.program.reset(),this.pipeline.length=0,this.commit.length=0}requestRender(){this.#e||(this.#e=!0,cancelAnimationFrame(this.#t),this.#t=requestAnimationFrame(()=>{this.#e=!1;for(let t of this.pipeline)t();for(let t of this.commit)t();this.program.draw()}))}stop(){cancelAnimationFrame(this.#t),this.#e=!1}#i=t=>{this.pipeline.push(t)}};var tt=document.getElementById("demo"),Rt=await nt({canvas:document.getElementById("canvas")}),X,k=new URL(location.href),lt,Ut={lines:()=>Promise.resolve().then(()=>(ot(),at)),rect:()=>Promise.resolve().then(()=>(ut(),ct)),circles:()=>Promise.resolve().then(()=>(ft(),ht))};async function pt(){let o=tt.value;lt=o.endsWith(".json")?await fetch(o).then(t=>t.json()):(await Ut[o]()).default,k.searchParams.set("demo",o);try{history.replaceState(void 0,"",k.search)}catch(t){console.error(t)}X?.reset(),X??=new j(Rt),await X.load(lt.root),X.requestRender()}var dt=k.searchParams.get("demo");dt&&(tt.value=dt);tt.onchange=pt;pt();
