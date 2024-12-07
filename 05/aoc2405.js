const fs = require("fs");
const al = require("../aoclib.js")

function parse(data) {

	// first separate input into rules and pages sections by splitting on the empty line
	const [ruleLines,pageLines] = 
		al.arraySplit(
			al.textToLines(data),
			l=>!l.length
		);

	// helper list-append-or-create-on-empty
	const lappend = (l,v) => (!l?[v]:( l.push(v),l ));

	// now parse the rules to a Map<number,number[]>
	const rules = ruleLines
		.map(l=>l.split('|').map(v=>parseInt(v)))
		.reduce((m,r)=>(m.set(r[0],lappend(m.get(r[0]),r[1])),m),new Map())
	
	// the pagesets is just a list of lists
	const pagesets = pageLines
		.map(l=>l.split(',').map(v=>parseInt(v)))
	
	// checker for pt1 was dismembered to implement a fixer/checker
	// it's a stupid algo that checks by seeking rule-mismatches in
	// the previously passed pages, and if a bad check happens the 
	// fixer part will shunt the offending  to the top and try again,
	// with a coherent rule-set this simple algo will eventually converge
	// to finding a rule-abiding pattern.
	// (Pro-tip, this algo can be used for dependency ordering if
	//  performance isn't a top priority)
	const fixer = fix => pages => {
			// keep in memory if we've failed.
			let wasOk = true;
			while(true) {
				let nextPages = null;
				const checked=pages.reduce(
					(state,page,pageIdx)=>{
						const succ=rules.get(page);
						const isOk = undefined===state.prev.find(pp=>succ?.find(inSucc=>inSucc===pp))
						if (fix && !isOk) {
							nextPages = [page,...pages.filter((t,pi)=>pi!=pageIdx)] 
							//console.log("np:",nextPages);
						}
						return {
							prev:[...state.prev,page],
							ok:state.ok&&isOk
						}
					},
					{prev:[],ok:true}
				)
				if (!fix)
					return checked;
				if (checked.ok)
					return {...checked,ok:wasOk}
				pages=nextPages;
				wasOk = false;
			}
		}
		
	const checker = fixer(false)
	return {pagesets,checker,rules,fixer}
}
function a(data) {
	const {pagesets,checker,rules} = parse(data);
	const okInfos= 
		pagesets
		.map(pages=>checker(pages))
		.filter(info=>info.ok);
	return okInfos.reduce((acc,info)=>acc+info.prev[0|(info.prev.length/2)],0)
}
function b(data) {
	const {pagesets,checker,rules,fixer} = parse(data);
	const badInfos= 
		pagesets
		.map(pages=>fixer(true)(pages))
		.filter(info=>!info.ok);
	return badInfos.reduce((acc,info)=>acc+info.prev[0|(info.prev.length/2)],0);
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
