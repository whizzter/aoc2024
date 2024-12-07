const fs = require("fs");
const al = require("../aoclib.js")

const solve = ops=>function solveInner(res,acc,inp) {
	if (inp.length==0){
		if (res===acc)
			return res;
		return false;
	}
	let [head,...rest]=inp;
	//console.log(res,acc,head);
	for (let i=0;i<ops.length;i++) {
		const cr = ops[i](acc,head);
		const sr = solveInner(res,cr,rest);
		if (sr!==false)
			return sr;
	}
	return false;
}


function parse(data) {
	return data
		.split(/\r\n|\n/)
		.filter(r=>r)
		.map(r=>{
			const [res,...src]=r.split(/:?\s+/).map(v=>parseInt(v));
			return {res,src}
		})
}

function a(data) {
	const eqs = parse(data);
	const p1s = solve([(a,b)=>a+b,(a,b)=>a*b]);

	const tested = eqs.map(r=>p1s(r.res,0,r.src))
	const res = tested.filter(v=>v!==false).reduce((c,v)=>c+v,0);

	return res;
}
function b(data) {
	const eqs = parse(data);
	const p2s = solve([(a,b)=>a+b,(a,b)=>a*b,(a,b)=>parseInt(`${a}${b}`)]);

	const tested = eqs.map(r=>p2s(r.res,0,r.src))
	const res = tested.filter(v=>v!==false).reduce((c,v)=>c+v,0);

	return res;
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
