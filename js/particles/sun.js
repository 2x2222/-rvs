import {Color, Vector} from '../helpers.js';
import { default as push_plane_style } from '../block_style/plane.js';
import {BLOCK} from "../blocks.js";

const push_plane = push_plane_style.getRegInfo().func;
const {mat4} = glMatrix;

export default class Particles_Sun {

    // Constructor
    constructor(gl, pos) {
        this.life       = 1;
        let lm          = new Color(0, 0, 0, 0);
        this.pos        = {...pos};
        this.vertices   = [];
        this.particles  = [];
        //
        const sz        = 1;
        // tex coord (позиция в текстуре)
        let c_half = BLOCK.calcTexture([25, 31]);
        // позиция частицы (в границах блока)
        let x = 0;
        let y = 0;
        let z = 0;
        push_plane(this.vertices, x, y, z, c_half, lm, true, false, sz, sz, null);
        let p = {x: x, y: y, z: z, vertices_count: 12/*, scale: 100, dist: 600*/};
        this.particles.push(p);
        this.vertices = new Float32Array(this.vertices);
        this.buffer = new GeometryTerrain(GeometryTerrain.convertFrom12(this.vertices));
    }

    // Draw
    draw(render, delta, modelMatrix, uModelMat) {
        this.yaw    = -Math.PI / 2;
        let gl      = render.gl;
        //
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        //
        mat4.identity(modelMatrix);
        let scale       = 100;
        let dist        = 600;
        const SUN_SPEED = 1500;
        let t           = performance.now() / SUN_SPEED;
        // this.pos        = Game.player.pos.add(new Vector(dist, dist, scale / 2));
        this.pos        = Game.player.pos.add(new Vector(Math.cos(t) * dist, Math.sin(t) * dist, scale / 2));
        let a_pos       = this.pos;
        mat4.translate(modelMatrix, modelMatrix, [a_pos.x, a_pos.y, a_pos.z]);
        mat4.rotateZ(modelMatrix, modelMatrix, this.yaw);
        mat4.rotateX(modelMatrix, modelMatrix, Math.sin(t) * (Math.PI / 4));
        // mat4.lookAt(modelMatrix, Game.player.pos, new Vector(0, 1, 0));
        mat4.scale(modelMatrix, modelMatrix, [scale, 1, scale]);
        gl.uniformMatrix4fv(uModelMat, false, modelMatrix);
        // draw
        render.drawBuffer(this.buffer, [0, 0, 0]);
    }

    destroy(render) {
        this.buffer.destroy();
    }

    isAlive() {
        return this.life > 0;
    }

}
