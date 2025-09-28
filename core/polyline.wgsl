
struct Uniforms {
	pointCount: u32;
	strokeWidth: f32;
	joinType: u16;
	capType: u16;
	
	_pad1: u32;
	_pad2: u32;
};

@group(0) @binding(0) var<storage, read>  points: array<vec2<f32>>;
@group(0) @binding(1) var<storage, read_write> vertices: array<vec4<f32>>;
@group(0) @binding(2) var<uniform> uniforms: Uniforms;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
	let segCount = max(0u, uniforms.pointCount > 0u ? uniforms.pointCount - 1u : 0u);
	let i = gid.x;
	if (i >= segCount) { return; }

	// read segment endpoints
	let p0 = points[i];
	let p1 = points[i + 1u];
  
	let baseIndex = i * 6u;
	let dir = normalize(p1 - p0);
	let normal = vec2<f32>(-dir.y, dir.x);
	let offset = normal * uniforms.strokeWidth * 0.5;

	let v0 = p0 + offset;
	let v1 = p0 - offset;
	let v2 = p1 + offset;
	let v3 = p1 - offset;

	vertices[baseIndex + 0u].data0 = vec4<f32>(v0, 0.0, 0.0);
	vertices[baseIndex + 1u].data0 = vec4<f32>(v1, 0.0, 0.0);
	vertices[baseIndex + 2u].data0 = vec4<f32>(v2, 0.0, 0.0);

	vertices[baseIndex + 3u].data0 = vec4<f32>(v2, 0.0, 0.0);
	vertices[baseIndex + 4u].data0 = vec4<f32>(v1, 0.0, 0.0);
	vertices[baseIndex + 5u].data0 = vec4<f32>(v3, 0.0, 0.0);
}