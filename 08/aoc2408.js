const fs = require("fs");
const al = require("../aoclib.js")

function calc(data,mapToStepCount) {
	// convert file to matrix
	const map = al.textToLines(data)
		.filter(r=>r)
		.map(r=>r.split(''))
	// get bounds
	const w=map[0].length,h=map.length
	// part b needs a step-sequence
	const steps = [...new Int8Array(mapToStepCount(w,h))].map((v,i)=>i);

	// find distinct types (sans empty .)
	const types = 
		[...map
			.flatMap(v=>v)
			.reduce(
				(m,v)=>(m.add(v),m),
				new Set)
		]
		.filter(v=>v!='.')
		.sort()

	// now make a list of lists with same-frequency nodes
	const groups = 
		types.map(t=>
			map
			.flatMap(
				(r,y)=>
					r.map((v,x)=>({x,y,v}))
					.filter(e=>e.v===t)
			)
		)

	// antinode by pair generator, recursive function that
	// builds all possible pairs and then extends out the antinodes
	// (1 for part A and a sequence from steps in part B)
	const anGen = function anGen(l,recv){
		const [e1,...r] = l;
		if (r.length) {
			return [
				// run the first entry with the rest for the initial pairs
				...r.flatMap(e2=>{
					// calculate delas
					const dx = e2.x-e1.x,dy=e2.y-e1.y;
					return steps
						.flatMap(step=>
							// and let create for the internals
							[recv(e1.x-dx*step,e1.y-dy*step),
							 recv(e2.x+dx*step,e2.y+dy*step)]
						);
				}),
				// and recurse for the rests internal pairs
				...anGen(r,recv)
			]
		} else {
			return [];
		}
	}
	
	// generate permutations for each group
	const an = groups
		.flatMap(
			tyLi =>anGen(tyLi,(x,y)=>({x,y})) //`${x},${y}`)
		)
		// only keep the ones in bounds
		.filter(e=>0<=e.x && e.x<w && 0<=e.y && e.y<h)
		// convert to a string ...
		.map(e=>`${e.x} ${e.y}`)
		// ... so we can put them in a set based on the unique key
		.reduce((s,v)=>(s.add(v),s),new Set())

	// with the unique pairs in a set we can just get the size
	return [...an].length;
}
function a(data) {
	return calc(data,()=>1);
}
function b(data) {
	return calc(data,(w,h)=>Math.max(w,h));
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
