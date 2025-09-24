
struct Params {
  pointCount: u32;
  // 12 bytes padding to 16
  _pad0: u32;
  _pad1: u32;
  _pad2: u32;
};

struct Vertex {
  data0: vec4<f32>;
  data1: vec4<f32>;
};

@group(0) @binding(0) var<storage, read>  points: array<vec2<f32>>;
@group(0) @binding(1) var<storage, read_write> vertices: array<Vertex>;
@group(0) @binding(2) var<storage, read_write> drawArgs: array<u32>;
@group(0) @binding(3) var<uniform> params: Params;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
  let segCount = max(0u, params.pointCount > 0u ? params.pointCount - 1u : 0u);
  let i = gid.x;
  if (i >= segCount) { return; }

  // read segment endpoints
  let p0 = points[i];
  let p1 = points[i + 1u];

  // prev (px,py)
  var px : vec2<f32>;
  if (i == 0u) {
    // for start, repeat p0 (caller/CPU may use neighbor for cap handling)
    px = p0;
  } else {
    px = points[i - 1u];
  }

  // next (nx,ny)
  var nx : vec2<f32>;
  if (i + 2u >= params.pointCount) {
    nx = p1;
  } else {
    nx = points[i + 2u];
  }

  // corners: (t, side) pairs: (0,1), (1,1), (1,-1), (0,1), (1,-1), (0,-1)
  let tVals = array<f32,6>(0.0, 1.0, 1.0, 0.0, 1.0, 0.0);
  let sideVals = array<f32,6>(1.0, 1.0, -1.0, 1.0, -1.0, -1.0);

  let baseIndex = i * 6u;
  for (var k: u32 = 0u; k < 6u; k = k + 1u) {
    let vi = baseIndex + k;
    vertices[vi].data0 = vec4<f32>(p0.x, p0.y, p1.x, p1.y);

    var t = tVals[k];
    // encode caps: start segment t==0 -> t+2, end segment t==1 -> t-2
    var tx = t;
    if (i == 0u && t == 0.0) {
      tx = t + 2.0;
    } else if (i == segCount - 1u && t == 1.0) {
      tx = t - 2.0;
    } 

    vertices[vi].data1 = vec4<f32>(
      tx,
      sideVals[k],
      // neighbour: for t==0 use prev, for t==1 use next,
      // but special-cased above
      (t == 0.0) ? px.x : nx.x,
      (t == 0.0) ? px.y : nx.y
    );
  }

  // thread 0 writes the indirect args
  if (i == 0u) {
    let vertexCount = segCount * 6u;
    drawArgs[0] = vertexCount; // vertexCount
    drawArgs[1] = 1u;          // instanceCount
    drawArgs[2] = 0u;          // firstVertex
    drawArgs[3] = 0u;          // firstInstance
  }
}