const fs = require("fs");
const al = require("../aoclib.js")

// wrong turns deluxe, first tried to make a "cleanly" functional variant for A
// but it got too slow, rewrote it "simpler" (and ironically could've made
// that one functionally clean but didn't feel like fixing it).
//
// assumed the second one would need more performance so microoptimized instead
// but that was buggy, so restarted with something less optimal that worked.
//
// summary, lots of time wasted needlessly, no comments but preserved for
// shame in posterity

function aFunc(data) {
	const blocks = data
		.trim()
		.split('')
		.flatMap((v,i)=>
			[...new Int8Array(parseInt(v))]
			.map((_v,_i)=>({blk:i&1?-1:i>>1})) // -1 used for non-used
		)
		.map((b,i)=>({...b,pos:i}))
	//const free = blocks.filter(b=>b.blk==-1)
	const usedRev = blocks.filter(b=>b.blk!==-1).reverse();
	const defragged = blocks
		.reduce((state,block,idx)=>{
			const isFree = 
				block.blk==-1
				||
				!state.usedRev.find(cb=>
					cb.blk==block.blk && cb.pos==block.pos
				);
			if (isFree) {
				// free block, do we have anything to move there?
				if (state.usedRev.length) {
					// yes, so move from the usedRev list
					let [toUse,...newUsedRev]=state.usedRev;
					if (!state.ol.find(cb=>cb.blk==toUse.blk && cb.pos==toUse.pos))
						return {...state,ol:[...state.ol,toUse],usedRev:newUsedRev};
				}
				// no, let's just copy over an empty one
				return {...state,ol:[...state.ol,{blk:-1,pos:-1}]}
			} else {
				// not free, let's just copy it over
				return {...state,ol:[...state.ol,block]}
			}
		},{ol:[],usedRev}).ol;
	const checksum = defragged.filter(item=>item.blk!=-1).reduce((acc,item,idx)=>acc+idx*item.blk,0)
	return {blocks,defragged,checksum};
}

function a(data) {
	// imperative
	const blocks = data
		.trim()
		.split('')
		.flatMap((v,i)=>
			[...new Int8Array(parseInt(v))]
			.map((_v,_i)=>({blk:i&1?-1:i>>1})) // -1 used for non-used
		)
		.map((b,i)=>({...b,pos:i}))
	const free = blocks.filter(b=>b.blk==-1)
	const used = blocks.filter(b=>b.blk!==-1).reverse();

	let moveIdx = 0;
	const defragged = blocks
		.map((v,i)=>{
			// free since we've moved past all in the used-list
			if (moveIdx>=used.length || used[moveIdx].pos<i)
				return {blk:-1,pos:-1}
			const free = v.blk==-1;
			if (free) {
				//console.log("Moving in:",used[moveIdx]);
				return used[moveIdx++];
			}
			return v;
		});

	const checksum = defragged.filter(item=>item.blk!=-1).reduce((acc,item,idx)=>acc+idx*item.blk,0)
	return checksum; //{blocks,defragged,checksum};
}

function b_buggy(data) {
	// imperative
	const blocks = data
		.trim()
		.split('')
		.flatMap((v,i)=>
			[...new Int8Array(parseInt(v))]
			.map((_v,_i)=>({blk:i&1?-(1+(i>>1)):i>>1})) // -1 used for non-used
		)
		.map((b,i)=>({...b,pos:i}))
	const free = blocks
		.filter(b=>b.blk<0)
		.groupBy(v=>v.blk)
		.reduce((ov,fi)=>{
			ov[fi[1].length].push(fi[1])
			return ov;
		},[...new Int8Array(10)].map(v=>[]))
		.map(v=>v.reverse());
	while(free[free.length-1].length==0)
		free.pop();
	const used = blocks
		.filter(b=>b.blk>=0)
		.groupBy(v=>v.blk)
		.reverse();

	for(let u of used) {
		//console.log(u[0]);
		if (u[0]===2)
		{
			//console.log(free)
		}

		let to = null;
		for(let lt = u[1].length;lt<free.length;lt++) {
			const szFree = free[lt]
			if (szFree.length) {
				if (to==null || to[0].pos>szFree[szFree.length-1].pos) {
					to = szFree[szFree.length-1];
				}
			}
		}
		if (u[0]===2) {
			//console.log(free[1]);
		}
		if (!to || to[0].pos>u[1][0].pos)
			continue;
		let tto;
		if (to!==(tto=free[to.length].pop())) {
			console.log(to)
			console.log("uhh:",free[to.length]);
			throw new Error("internal structure error")
		}
		for (let i=0;i<u[1].length;i++) {
			blocks[ to[i].pos ] = u[1][i];
			blocks[ u[1][i].pos ] = {blk:-1000000000,pos:u[1][i].pos}
		}
		to = to.slice(u[1].length);
		if (to.length) {
			let szFree = free[to.length]
			szFree.push(to);
			for (let i=szFree.length-2;i>=0;i--) {
				console.log(szFree[i][0].pos,szFree[i+1][0].pos)
				if (szFree[i][0].pos<szFree[i+1][0].pos) {
					[szFree[i],szFree[i+1]]=[szFree[i+1],szFree[i]]
				} else {
					break;
				}
			}
			console.log(szFree)
		}
	}

	console.log( blocks.map(b=>b.blk<0?'.':b.blk) )
	const checksum = blocks.reduce((acc,item,idx)=>acc+(item.blk>=0?idx*item.blk:0),0)

	// too low: 6364741912001
	
	//return checksum;
	//return free
}

function b(data) {
	// imperative
	const blocks = data
		.trim()
		.split('')
		.flatMap((v,i)=>
			[...new Int8Array(parseInt(v))]
			.map((_v,_i)=>({blk:i&1?-(1+(i>>1)):i>>1})) // -1 used for non-used
		)
		.map((b,i)=>({...b,pos:i}))
	const free = blocks
		.filter(b=>b.blk<0)
		.groupBy(v=>v.blk)
		.sort((a,b)=>(b[1]-a[1]))
		.map(v=>v[1])
//		.reduce((ov,fi)=>{
//			ov[fi[1].length].push(fi[1])
//			return ov;
//		},[...new Int8Array(10)].map(v=>[]))
//		.map(v=>v.reverse());
//	while(free[free.length-1].length==0)
//		free.pop();
	const used = blocks
		.filter(b=>b.blk>=0)
		.groupBy(v=>v.blk)
		.map(v=>v[1])
		.reverse();

//	console.log(free)

	for(let u of used) {
		let to = null;
//		console.log("u:",u)
//		if (u[0].blk==4) {
//			console.log(free);
//		}
		for (let i=0;i<free.length && free[i][0].pos<u[0].pos;i++) {
			if (free[i].length>=u.length) {
				to = {i,arr:free[i]};
				break;
			}
		}
		if (!to)
			continue;

		//console.log(u,"->",to)


		for (let i=0;i<u.length;i++) {
			blocks[ to.arr[i].pos ] = u[i];
			blocks[ u[i].pos ] = {blk:-1000000000,pos:u[i].pos}
		}
		//const preTo = [...to.arr]
		to.arr.splice(0,u.length);
		//console.log("Spliced:",preTo,to.arr);
		if (!to.arr.length) {
			free.splice(to.i,1)
			//console.log("Post remove free:",free)
		}

	}

	console.log( blocks.map(b=>b.blk<0?'.':b.blk) )
	const checksum = blocks.reduce((acc,item,idx)=>acc+(item.blk>=0?idx*item.blk:0),0)
	
	return checksum;
	//return free
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
//console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
