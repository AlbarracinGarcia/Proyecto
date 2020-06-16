#ifdef GL_ES
precision mediump float;
#endif
  
#define SHARPEN_FACTOR 16.0

uniform vec2 u_resolution;
uniform sampler2D tex0;
varying vec2 vTexCoord;

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  uv.x = 1.0 - uv.x;
  vec4 up = texture2D(tex0, (uv + vec2 (0, 1))/u_resolution.xy);
  vec4 left = texture2D(tex0, (uv + vec2 (-1, 0))/u_resolution.xy);
  vec4 center = texture2D(tex0, uv/u_resolution.xy);
  vec4 right = texture2D(tex0, (uv + vec2 (1, 0))/u_resolution.xy);
  vec4 down = texture2D(tex0, (uv + vec2 (0, -1))/u_resolution.xy);
  
   gl_FragColor = (65.0)*center -SHARPEN_FACTOR*(up + left + right + down);
}
