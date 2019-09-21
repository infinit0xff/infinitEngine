// set the precision for float operations, such as sampler operations.
// without this set, those operations may not function.
precision mediump float;

// the object that fetches data from texture.
// must be set outside the shader.
uniform sampler2D uSampler;
uniform vec4 uPixelColor;

// the "varying" keyword is for signifing that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;

#define kSufficientlyOpaque       0.1

void main(void)
{
    vec4 texFragColor = texture2D(uSampler, vTexCoord);
    if (texFragColor.a < kSufficientlyOpaque)
        discard;
    else
       gl_FragColor = vec4(1, 1, 1, 1);
    
}