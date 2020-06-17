#ifdef GL_ES
precision mediump float;
#endif
  
uniform sampler2D tex0;
varying vec2 vTexCoord;

vec4 matrixImg[9];

void main() {
  
  vec2 uv = vTexCoord;
   uv.y = 1.0 - uv.y;
   uv.x = 1.0 - uv.x;
    
    vec2 blurredUV = vec2(uv.x+0.010,uv.y+0.010);
    
    vec4 baseColor = vec4(texture2D(tex0,uv).rgb,1.0);
    
	vec4 edges = 1.0 - (baseColor / vec4(texture2D(tex0,blurredUV).rgb, 1.0)); 
  
   gl_FragColor = vec4(length(edges));
}
