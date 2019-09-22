// performs additive blending
// this is the fragment (or pixel) shader

precision mediump float; 
    // sets the precision for floating point computation

// the object that fetches data from texture.
// must be set outside the shader.
uniform sampler2D uSampler;

// color of pixel
uniform vec4 uPixelColor;  

// the "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;

void main(void)  {
    // texel color look up based on interpolated UV value in vTexCoord
    vec4 c = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    // 
    
    vec3 r = vec3(c) * c.a * vec3(uPixelColor);
    vec4 result = vec4(r, uPixelColor.a);

    gl_FragColor = result;
}