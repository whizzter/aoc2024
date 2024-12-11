const fs = require("fs");
const al = require("../aoclib.js")

// kept A mostly simple, some silly micro-opt that went unused visible still.
//
// with A slow and growing exponentially it was obvious that B wouldn't run
// normally, one easy observation however was that many numbers were recurring
// so instead of keeping track of all stones we could just keep track of the
// count for each stone-kind (and change sums to bigints).
//
// Most logic in the sapp functions, those are mostly just translations of the
// rules from the day instructions.

function a(data) {
	let stones = data.split(/\s/).filter(v=>v.trim()).map(v=>parseInt(v))

	const dc = v => { let dc=1; while(v>10) { v=Math.floor(v/10); dc++; } return dc; }
	const sapp = 
		(stones) =>
			stones.flatMap(s=> {
				if (s===0)
					return [1]
				let ts = s.toString();
				let odc = ts.length;
				//let odc = dc(s);
				//if (odc!==(s.toString().length))
				//	throw new Error(`${odc} not same as ${s.toString().length} for ${s}`);
				if (0==(1&odc)) {
					//let ts = s.toString();
					return [parseInt(ts.slice(0,odc/2)),parseInt(ts.slice(odc/2))];
				}
				return [s*2024]
			})

	//console.log(stones)
	let lim = Math.pow(2,50);
	for (let i=0;i<25;i++) {
		stones = sapp(stones)
		for(let j=0;j<stones.length;j++) {
			if (stones[j]>lim) {
				throw new Error("Huh:"+stones[j]);
			}
		}
		//console.log(stones)
	}

	return stones.length;
}

function b(data) {
	let stoneKinds = data
		.split(/\s/)
		.filter(v=>v.trim())
		.map(v=>BigInt(v))
		.reduce((m,c)=>(m.set(c,1n),m),new Map);

	let addToMap = (map,s,count) =>
		map.has(s)
		?map.set(s,count+map.get(s))
		:map.set(s,count);

	const zeroBigInt = BigInt(0);

	const sapp = 
		(stoneKinds) =>
			[...stoneKinds].reduce((map,[s,count])=> {
//				console.log(map,s,count)

				if (s===zeroBigInt) {
					addToMap(map,1n,count);
					return map;
				}
				let ts = s.toString();
//				console.log("Test:"+ts)
				let odc = ts.length;
				if (0==(1&odc)) {
					const s1 = BigInt(ts.slice(0,odc/2));
					const s2 = BigInt(ts.slice(odc/2));
					addToMap(map,s1,count);
					addToMap(map,s2,count);
					return map;
				}
				addToMap(map,s*2024n,count);
				return map;
			},new Map)

	let lim = Math.pow(2,50);
	for (let i=0;i<75;i++) {
		stoneKinds = sapp(stoneKinds)
//		for(let j=0;j<stones.length;j++) {
//			if (stones[j]>lim) {
//				throw new Error("Huh:"+stones[j]);
//			}
//		}
//		console.log(stoneKinds)
	}

//	console.log(stoneKinds)
	return [...stoneKinds].reduce((sum,[s,v])=>sum+v,0n);
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
