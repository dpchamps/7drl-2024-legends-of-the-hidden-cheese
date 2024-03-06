import { Random } from 'random'
const seedrandom = require('seedrandom');
import { createNoise2D } from 'simplex-noise';

const rng = new Random();
let noiseTwoD = createNoise2D();

export default {
	n: (a: number, b: number) => {
		return rng.int(a, b)
	},
	setSeed: (seed: string|undefined) => {
		const seeded = typeof seed === "undefined" ? `${Math.random()}` : seed;
		console.log(`Game Seed: ${seeded}`);
		const seedR = seedrandom(seeded);
		rng.use(seedR);
		noiseTwoD = createNoise2D(seedR);
	},
	getPoisson: (n: number) => {
		return rng.poisson(n)
	},
	noise2D: (x: number, y: number) => {
		return noiseTwoD(x, y);
	}
}