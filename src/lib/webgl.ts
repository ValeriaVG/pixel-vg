export function compileProgram(
	gl: WebGLRenderingContext,
	{ vShader, fShader }: { vShader: string; fShader: string },
	name: string = ''
) {
	// Compile vertex shader
	const vs = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vs, vShader);
	gl.compileShader(vs);

	// Compile fragment shader
	const fs = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fs, fShader);
	gl.compileShader(fs);

	// Create and launch the WebGL program
	const program = gl.createProgram();
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);

	// Log errors (optional)
	[gl.getShaderInfoLog(vs), gl.getShaderInfoLog(fs), gl.getProgramInfoLog(program)].forEach(
		(log, idx) => {
			if (log) {
				console.error(name + '::' + ['VERTEX SHADER', 'FRAGMENT SHADER', 'GL PROGRAM'][idx], log);
			}
		}
	);

	return program;
}
