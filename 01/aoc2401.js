const fs = require("fs");
const al = require("../aoclib.js")

function a(data) {
	const fmat = al.textToLines(data)
		.filter(v=>v)
		.map(v=>v.split(/\s+/).map(v=>parseInt(v)))
		;
	const lrmat = al.transpose(fmat)
	const slrmat = lrmat.map(vec=>[...vec].sort())
	const dl = slrmat[0].zip(slrmat[1])
	const diffSum = dl.reduce((p,e)=>p+Math.abs(e[0]-e[1]),0)
	return diffSum;
}
function b(data) {
	const fmat = al.textToLines(data)
		.filter(v=>v)
		.map(v=>v.split(/\s+/).map(v=>parseInt(v)))
		;
	const lrmat = al.transpose(fmat)
	const sims = lrmat[0].reduce((p,v)=>p+v*lrmat[1].filter(rv=>rv===v).length,0);
	return sims;
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("bex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
