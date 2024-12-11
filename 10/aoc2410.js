const fs = require("fs");
const al = require("../aoclib.js")

// compared to the previous day this went very smoothly, obvious a-star like
// test implemented in part 1 (to find possible solutions), slightly more
// complexity for part2 but only needed to replace the visited-set with a
// visited map to count the number of possible paths (and remove early
// termination).

const dirs = [[1,0],[-1,0],[0,1],[0,-1]]

const findPaths = (map,start,end)=>{
	// simple a-star like search (with termination removed to solve part2)

	const w=map[0].length,h=map.length;

	const visited = new Map;       // map of visited cells
	const todos = [{...start,c:1}] // todo queue for visiting (and counting)

	visited.set(`${start.x} ${start.y}`,todos[0]); // store the first to-cell

	// work until all paths are exhausted
	while(todos.length) {
		const todo = todos.shift();
		//console.log(todo)
		const ch = map[todo.y][todo.x] // current height

		// try all relevant directions
		for (let i=0;i<4;i++) {
			const x = todo.x+dirs[i][0]
			const y = todo.y+dirs[i][1]
			if (!(0<=x && x<w && 0<=y && y<h))
				continue; // out of bounds terminates

			const th = map[y][x] // dir-test-height
			if (ch+1 !== th)
				continue; // ignore increases that aren't 1

			const key = `${x} ${y}`
			//console.log(key,visited)

			// check if we've encountered the cell previously, 
			// if so update it's count
			const prev = visited.get(key);
			if (prev) {
				// this is safe since our code will visit all lower positions first
				prev.c += todo.c
			} else {
				// new cell, add it (with the todo to the queue)
				let cell = {x,y,c:todo.c}
				visited.set(key,cell);
				todos.push(cell)
			}
		}
	}
	// once finished, try to get the end-cell, if it's valid return the count
	return visited.get(`${end.x} ${end.y}`)?.c;
}

function calc(data) {
	const map = al.textToLines(data)
		.filter(l=>l)
		.map(l=>l.split('')
		.map(v=>v=='.'?100:parseInt(v)))

	// find the starts and ends
	const starts = map
		.flatMap((r,y)=>
			r.map((v,x)=>v!==0?null:{x,y}).filter(v=>v)
		)

	const ends = map
		.flatMap((r,y)=>
			r.map((v,x)=>v!==9?null:{x,y}).filter(v=>v)
		)

	// now calc the 2 scores (reachability and possible paths) per start
	const scores = starts
		.map(start=>
			ends.map(end=>{
				const pathCount = findPaths(map,start,end);
				//console.log(pathCount)
				if (pathCount)
					return pathCount
				else
					return null;
			})
			.filter(v=>v)
		)
		.map(score=>({sc:score.length,pc:score.reduce((v,c)=>v+c,0)}))

//	console.log(scores)

	// finally return the information in a bundle (and let each part extract that)
	return {
		map,
		starts,
		ends,
		scores,
		sc:scores.reduce((v,pi)=>v+pi.sc,0),
		pc:scores.reduce((v,pi)=>v+pi.pc,0)
	};
}
function a(data) {
	return calc(data).sc
}
function b(data) {
	return calc(data).pc
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
