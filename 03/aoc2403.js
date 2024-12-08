const fs = require("fs");
const al = require("../aoclib.js")

function a(data) {
	// Dirty regexp to find left/right regexp parameters. This relies
	// on named group matching in regexps so we get a more "maintainable"
	// regexps since named matches won't change name/order due to adding
	// parts to a regexp. If mul is matched then the groups ml/mr
	// (mul-left and mul-right) will have values. 
	const re = /mul\((?<ml>[0-9]+),(?<mr>[0-9]+)\)/g;
	let sum = 0;
	let m;
	while(m=re.exec(data)) {
		// Using the regep match resuly and dirtily rely on the fact that the
		// multiply operator will automatically convert strings to numbers
		const v = m.groups.ml*m.groups.mr;
		sum+=v;
		//console.log(m,v,sum);
	}
	return sum;
}
function b(data) {
	// Part2 adds a toggle function, we just chuck that into our already dirty 
	// reg-exp with 2 new groups, doIns and dontIns that will be checked when
	// processing the data.

	const re = /mul\((?<ml>[0-9]+),(?<mr>[0-9]+)\)|(?<doIns>do\(\))|(?<dontIns>don't\(\))/g;
	let m;
	let sum = 0;
	let mulEnable = true;
	while(m=re.exec(data)) {
		// The regexp matching does half the job for us, We just check what 
		// we've matched and toggle or compute depending on that
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
