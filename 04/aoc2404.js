const fs = require("fs");
const al = require("../aoclib.js")

const dirs = [
	[ 1,0],[ 1, 1],[ 0, 1],[-1,1],
	[-1,0],[-1,-1],[ 0,-1],[ 1,-1]
]
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
	const mat = al
		.textToLines(data)
		.filter(r=>r)
		.map(l=>l.split(''))
	const h = mat.length, w=mat[0].length;
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
	let hits = 0;
	for (let i=0;i<w;i++) {
		for (let j=0;j<h;j++) {
			const d1 = [[1,1]];
			const d2 = [[1,-1]];
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
