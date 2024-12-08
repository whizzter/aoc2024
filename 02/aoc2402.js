const fs = require("fs");
const al = require("../aoclib.js")

// p1 and p2 are mostly the same code since they are
// so similar, thus  p2 got hacked-into p1 where noted.

function test(data,withSkip) {
	// parse numbers to a matrix
	const pdata = al.textToLines(data)
		.filter(l=>l.length)
		.map(l=>l.split(/\s/).map(v=>parseInt(v)));

	// our safe-pair-test function creator
	const mkSafe = (sign)=>(pair)=>{
		const diff = sign*(pair[1]-pair[0])
		return 1<=diff && diff<=3;
	};

	// create 2 functions (increasing, decreasing)
	const iSafe = mkSafe(1), dSafe = mkSafe(-1);

	// a safe-row test function that checks all pairs to be correct
	// with either of the functions (incr/decr)
	const safeRow = r=>
		(r.filter(iSafe).length==r.length) ||
		(r.filter(dSafe).length==r.length);

	// the bulk meat that looked prettier before part 2
	// that maps out each row as safe or unsafe.
	const safeCountRows = pdata
		.map(inRow=>{
			// before part2 the for-loop and filter to tmp didn't exist
			// basically the loop just tries the permutations with one removed
			// notice that it starts at -1 since it tries with non-removed to
			// be backwards compatible with the p1 solution (decided by withSkip) 
			for(let i=-1;i<(withSkip?inRow.length:0);i++) {
				const tmp = inRow.filter((v,idx)=>i!=idx);
				// remap the row numbers to a pairs of numbers with this and next number in it.
				const r = tmp
					.slice(0,tmp.length-1)
					.zip(tmp.slice(1))
				//console.log("Testing:",r);
				if (safeRow(r))
					return true; // successfully found one
			}
			return false;
		})
	return safeCountRows.filter(v=>v).length;
}
function a(data) {
	return test(data,false);
}
function b(data) {
	return test(data,true);
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
