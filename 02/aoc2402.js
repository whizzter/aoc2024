const fs = require("fs");
const al = require("../aoclib.js")

function test(data,withSkip) {
	const pdata = al.textToLines(data)
		.filter(l=>l.length)
		.map(l=>l.split(/\s/).map(v=>parseInt(v)));
	const mkSafe = (sign)=>(pair)=>{
		const diff = sign*(pair[1]-pair[0])
		return 1<=diff && diff<=3;
	};
	const iSafe = mkSafe(1), dSafe = mkSafe(-1);
	const safeRow = r=>
		(r.filter(iSafe).length==r.length) ||
		(r.filter(dSafe).length==r.length);
	const safeCountRows = pdata
		.map(inRow=>{
			for(let i=-1;i<(withSkip?inRow.length:0);i++) {
				const tmp = inRow.filter((v,idx)=>i!=idx);
				const r = tmp
					.slice(0,tmp.length-1)
					.zip(tmp.slice(1))
				//console.log("Testing:",r);
				if (safeRow(r))
					return true;
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
