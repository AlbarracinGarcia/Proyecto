#ifdef GL_ES
precision mediump float;
#endif


uniform sampler2D tex0;
varying vec2 vTexCoord;

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  uv.x = 1.0 - uv.x;//kjhgk,b
  vec4 tex = texture2D(tex0, uv); 
  float gray = (tex[0] + tex[1] + tex[2]) / 3.0;
  vec3 color = vec3(gray, gray, gray);

  // render the output
  gl_FragColor = vec4(color, 1.0);
}