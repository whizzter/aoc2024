const fs = require("fs");
const al = require("../aoclib.js")

// finding xmas, p2 threw a little curve-ball but p2 was mostly adaptable
// from the p1 solution.

// testing directions (p1)
const dirs = [
	[ 1,0],[ 1, 1],[ 0, 1],[-1,1],
	[-1,0],[-1,-1],[ 0,-1],[ 1,-1]
]

// chars-in-matrix counter, feed it directions and it'll iterate through
// the supplied directions checking for the given text (sw)
const test = (mat,x,y,sw,dirs) => {
	const h = mat.length, w=mat[0].length;
	let hits = 0;
	dirl: for (let i=0;i<dirs.length;i++) {
		for (let j=0;j<sw.length;j++) {
			let tx = x+dirs[i][0]*j;
			let ty = y+dirs[i][1]*j;
			if (!(0<=tx && tx<w && 0<=ty && ty<h))
				continue dirl;
			if (mat[ty][tx]!==sw[j])
				continue dirl;
		}
		hits++;
	}
	return hits;
}

function a(data) {
	// the usual dril, convert the input to a text matrix
	const mat = al
		.textToLines(data)
		.filter(r=>r)
		.map(l=>l.split(''))
	const h = mat.length, w=mat[0].length;
	
	// go through the matrix and accumulate all successful hits from the text
	let hits = 0;
	for (let i=0;i<w;i++) {
		for (let j=0;j<h;j++) {
			hits+=test(mat,i,j,"XMAS",dirs);
		}
	}
	return hits;
}
function b(data) {
	const mat = al
		.textToLines(data)
		.filter(r=>r)
		.map(l=>l.split(''))
	const h = mat.length, w=mat[0].length;

	// this loop is slightly different but was able to re-use the p1 test
	// function that has out-of-bounds tests and such.
	let hits = 0;
	for (let i=0;i<w;i++) {
		for (let j=0;j<h;j++) {
			// we check the 2 horizontals (with different texts) to detect
			// the MAS/SAM variations
			const d1 = [[1,1]];
			const d2 = [[1,-1]];
			
			// abusing type-coercions (1/0 as true/false)
			const h1 = test(mat,i-1,j-1,"MAS",d1) || test(mat,i-1,j-1,"SAM",d1);
			const h2 = test(mat,i-1,j+1,"MAS",d2) || test(mat,i-1,j+1,"SAM",d2);
			
			hits+= h1&&h2;
			//hits+=test(mat,i,j,"XMAS",dirs);
		}
	}
	return hits;
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
