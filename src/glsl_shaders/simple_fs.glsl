precision mediump float;    // floating point computation
uniform vec4 uPixelColor;   // trasform vertex position
uniform vec4 uGlobalAmbientColor;  // this is shared globally
uniform float uGlobalAmbientIntensity;  // this is shared globally

void main(void) {
    gl_FragColor = uPixelColor * uGlobalAmbientIntensity * uGlobalAmbientColor;
}