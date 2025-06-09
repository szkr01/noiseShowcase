precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

const vec3 cPos = vec3(0,0,10);
vec2 mouse;

mat3 orthBas(vec3 z) {
  z = normalize(z);
  vec3 up = abs(z.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(0.0, 0.0, 1.0);
  vec3 x = normalize(cross(up, z));
  return mat3(x, cross(z, x), z);
}

vec3 cyclic(vec3 p, float pers, float lacu) {
  vec4 sum = vec4(0);
  mat3 rot = orthBas(vec3(2, -3, 1));

  for (int i = 0; i < 20; i++) {
    p *= rot;
    p += sin(p.zxy);
    sum += vec4(cross(cos(p), sin(p.yzx)), 1);
    sum /= pers;
    p *= lacu;
  }

  return sum.xyz / sum.w;
}

vec3 texture1(vec3 p){
    vec3 col2 = cyclic(p, 0.9, 2.);
    vec3 col3 = vec3(col2.x) + vec3(col2.y, col2.z, col2.x);

    col3 = atan(col3*2.0)*1.;
    return col3;
}

vec3 rotate(vec3 p, float angle, vec3 axis){
    vec3 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    mat3 m = mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
    return m * p;
}

vec3 trace(vec3 pos,vec3 ray,float time){
    ray = rotate(ray, u_mouse.x*0.001, vec3(0,-1,0));
    ray = rotate(ray, u_mouse.y*0.001, vec3(1,0,0));
    pos = rotate(pos, time*0.1, vec3(0,0.3,1));

    vec3 color=texture1(ray*2.+vec3(u_time*0.2,u_time*-0.1,0));

    return color;
}

void main() {
	vec2 pos = (2.0*gl_FragCoord.xy-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
	mouse = (2.0*u_mouse.xy-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
  vec3 ray = normalize((vec3(pos,0)-cPos)*vec3(2,2,1));
  gl_FragColor = vec4(trace(cPos,ray,u_time),1);
}