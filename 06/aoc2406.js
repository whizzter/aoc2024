const fs = require("fs");
const al = require("../aoclib.js")

// Lots of small details in the impl, guessed wrong at part2 when
// making part 1 so the abstractions weren't the correct ones
// (although easily enough to hack around)

// P1 consisted of making a guard iterable(guessed p2 was about multiple guards)
//  that would walk until going out of bounds, original code marked with 
// ; for start and : for passed squares, then the final code counted those.

// P2 with the loop finding required some hacking to reset guard/maps since
// it was multiple walks that were intended.
// The guard-walk was rewritten to encode passed tiles with the bit(s) of the
// directions the guard had walked over that square, encoded tiles were
// simply using lower-case a-p characters.

const dirToIndex = (dx,dy) => (-dx+2)*!dy+(dy+1)*!dx;

const charToBits = cv=>{
	let bits = 0;
	let mv = cv.charCodeAt(0)-97;
	if (0<=mv && mv<=15) {
		return mv;
	}
	return 0;
}

//console.log([...".wq13abcdefgh`"].map(charToBits));

const markOnMap = (map,x,y,idx) => {
	let bits = charToBits(map[y][x]);
	let nbits = bits | (1<<idx);
	map[y][x]=String.fromCharCode(97+nbits);
	// did we enter a loop? (same bits were set upon stepping in!)
	return bits==nbits;
}

const guard = (map,x,y) => {
	const h = map.length, w = map[0].length;

	let dx = 0, dy=-1
	markOnMap(map,x,y,dirToIndex(dx,dy));

	let ox = x, oy=y;

	return map => {
		if (map==='reset') {
			x=ox;
			y=oy;
			dx=0;
			dy=-1;
			return;
		}
		if (!(0<=x && x<w && 0<=y && y<h)) {
			// out of bounds
			return {ok:false,loop:false}
		}
		let tx = x+dx, ty=y+dy;
		if (!(0<=tx && tx<w && 0<=ty && ty<h)) {
			// stepped out of bounds!
			x=tx; y=ty;
			return {ok:false,loop:false}
		}
		// in bounds, do we need a turn?
		if (map[ty][tx]=='#') {
			[dx,dy]=[-dy,dx];
			return {ok:true,loop:false}
		} else {
			//if (map[ty][tx]=='.')
			//	map[ty][tx]=':';
			let loop=markOnMap(map,tx,ty,dirToIndex(dx,dy));
			//if (loop)
			//	return {ok:true,loop:true} // don't move when looping!
			x=tx; y=ty;
			return {ok:true,loop}
		}
	}
}

function prepare(data) {
	// convert map from text
	const map = al.textToLines(data)
		.filter(l=>l)
		.map(l=>l.split(''));
	// create guards from mapdata
	const guards = map
		.reduce((c,r,y)=>
			r.reduce(
				(c,v,x)=>v=='^'?[...c,guard(map,x,y)]:c,
				c)
			,
			[])
	const origMap = map.map(r=>[...r]);
	// walk all guards until they're done!
	while(guards.reduce((ok,g)=>ok&&g(map).ok,true))
	{}
	return {map,guards,origMap}
}
function a(data) {
	const {guards,map} = prepare(data);
	// calculate step-count by counting non-stepped on squares.
	const stepCount = map
		.reduce((c,r)=>r.reduce((c,v)=>(v!='#'&&v!='.')?c+1:c,c),0)
	return stepCount; //[map.map(r=>r.join('')).join('\n'),guards,stepCount];
}
function b(data) {
	const {guards,map,origMap} = prepare(data);
	// make map of possible stone positions (not guard and changed)
	const stoneMap = 
		map.map((cr,cy)=>
			cr.map((cv,cx)=>{
				let ov = origMap[cy][cx];
				if (ov==='b' || cv===ov) {
					//console.log("Bad!",cx,cy);
					return null;
				}
				return [cx,cy]
			})
		);
	// make a flat list
	const stonePositions = stoneMap.reduce((c,r)=>r.reduce((c,v)=>v?[...c,v]:c,c),[])
	const checkedPos = stonePositions.filter(stonePos=>{
		// check if this position loops?!
		
		// clone back the map
		const map = origMap.map(r=>[...r]);
		guards[0]('reset'); // reset the guard!
		map[stonePos[1]][stonePos[0]]='#'; // put in a stone in the test-pos
		//console.log("Checking pos:",stonePos);
		while(true) {
			let gr = guards[0](map);
			if (gr.loop)
				return true; // found a loop
			if (!gr.ok)
				return false; // no loop
		}
	})
	return checkedPos.length; //[map.map(r=>r.join('')).join('\n'),guards];
}


console.log(a(fs.readFileSync("aex.txt","utf8")));
console.log(a(fs.readFileSync("input.txt","utf8")));
console.log(b(fs.readFileSync("aex.txt","utf8")));
console.log(b(fs.readFileSync("input.txt","utf8")));
