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
  vec4 up = texture2D(tex0, (uv + vec2(0, 1)));
  vec4 upRight = texture2D(tex0, (uv + vec2(1, 1)));
  vec4 upLeft = texture2D(tex0, (uv + vec2(-1, 1)));
  vec4 left = texture2D(tex0, (uv + vec2(-1, 0)));
  vec4 center = texture2D(tex0, uv);
  vec4 right = texture2D(tex0, (uv + vec2(1, 0)));
  vec4 down = texture2D(tex0, (uv + vec2(0, -1)));
  vec4 downRight = texture2D(tex0, (uv + vec2(1, -1)));
  vec4 downLeft = texture2D(tex0, (uv + vec2(-1, -1)));
  
  matrixImg[0] = upLeft;
  matrixImg[1] = up;
  matrixImg[2] = upRight;
  matrixImg[3] = left;
  matrixImg[4] = center;
  matrixImg[5] = right;
  matrixImg[6] = downLeft;
  matrixImg[7] = down;
  matrixImg[8] = downRight;

  float matrix [9];
  for (int i = 0; i < 9; i++) {
    vec4 pixel = matrixImg[i];
    matrix[i] = (pixel[0] + pixel[1] + pixel[2]) / 3.0;
  }
  
  float sharpenFilter[9];
  sharpenFilter[0] = 0.0;
  sharpenFilter[1] = -1.0;
  sharpenFilter[2] = 0.0;
  sharpenFilter[3] = -1.0;
  sharpenFilter[4] = 5.0;
  sharpenFilter[5] = -1.0;
  sharpenFilter[6] = 0.0;
  sharpenFilter[7] = -1.0;
  sharpenFilter[8] = 0.0;
  
  float sum = 0.0;
  
  for (int j = 0; j < 9; j++) {
    sum = sum + sharpenFilter[j] * matrix[j];
  }
  
   gl_FragColor = vec4(sum, sum, sum, 1.0);
}
