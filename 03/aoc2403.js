const fs = require("fs");
const al = require("../aoclib.js")

function a(data) {
	const re = /mul\((?<ml>[0-9]+),(?<mr>[0-9]+)\)/g;
	let m;
	let sum = 0;
	while(m=re.exec(data)) {
		const v = m.groups.ml*m.groups.mr;
		sum+=v;
		//console.log(m,v,sum);
	}
	return sum;
}
function b(data) {
	const re = /mul\((?<ml>[0-9]+),(?<mr>[0-9]+)\)|(?<doIns>do\(\))|(?<dontIns>don't\(\))/g;
	let m;
	let sum = 0;
	let mulEnable = true;
	while(m=re.exec(data)) {
		if (m.groups.doIns) {
			mulEnable=true;
			continue;
		}
		if (m.groups.dontIns) {
			mulEnable=false;
			continue;
		}
		if (mulEnable) {
			const v = m.groups.ml*m.groups.mr;
			sum+=v;
		}
		//console.log(m,v,sum);
	}
	return sum;
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("bex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
