import { Random } from 'random'
const seedrandom = require('seedrandom');

const rng = new Random();

export default {
	n: (a: number, b: number) => {
		return rng.int(a, b)
	},
	setSeed: (seed: string|undefined) => {
		const seeded = typeof seed === "undefined" ? `${Math.random()}` : seed;
		rng.use(seedrandom(seeded))
	}
}