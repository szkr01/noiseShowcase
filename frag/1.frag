#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.0);
    float d = 0.0;
    
    st = st * 10.0; // 10x10 grid
    st = fract(st); // repeat pattern

    d = distance(st, vec2(0.5));
    d = step(0.5, d);
    d = 1.0 - d;
    
    color = vec3(d * abs(sin(u_time)), d * abs(cos(u_time)), d);

    gl_FragColor = vec4(color, 1.0);
}