const start = 1;
const total = 400;
let filterArray = [];

window.onload = async function() {
		await getPkmn();
		console.log(pkmn);
	for ( let i = start; i <= total; i++){

		let pkmnName = pkmn[i-1].name;
		let pkmnID = pkmn[i-1].id;
		let pkmnType = pkmn[i-1].type;

		let card = document.createElement("li");
		card.id = i;
		card.innerHTML = "<img class='image' src='icons/"+i+".png'><div class='info'><div class='name'>"+pkmnName+"</div><div class= 'types' id= 'types"+i+"'></div>";
		card.onclick = function(){document.getElementById(i).classList.toggle("grayOn"); updateData()};
		card.classList.add("grayOn","container");
		document.getElementById("pokeList").append(card);
		pkmnType.forEach(function(typeClass) {
			card.classList.add(typeClass);
			document.getElementById("types"+i).innerHTML += "<div class='text"+typeClass+" typeBox'>"+typeClass.charAt(0).toUpperCase()+typeClass.slice(1)+"</div>"
		});
		
		console.log(pkmnType);
	}
	loadData();
	updateData();
}

function updateData(){
	unchecked = (document.querySelectorAll("#pokeList .grayOn").length-total)*-1;
	document.getElementById("counter").innerHTML = unchecked +"/"+total;
	saveData();
}

function loadData(){
	for (let i = start; i <= total; i++){
		if (localStorage.getItem("saveID"+i) == "false") {
			document.getElementById(i).classList.remove("grayOn");
		}
	}
}

function saveData(){
	for (let i = start; i <= total; i++) {
		if (document.getElementById(i).classList.contains("grayOn")) {
			localStorage.setItem("saveID"+i, "true");
		} else {
			localStorage.setItem("saveID"+i, "false");
		}
	}
}

async function getPkmn(){
	let res = await fetch("https://dazzabound.github.io/paldea-pokedex/pkmn.json");
	pkmn = await res.json();
}

function filter(f){
	if(!filterArray.includes(f)){
		filterArray.push(f);
		document.getElementById("filter"+f).classList.add("grayOn");
	} else {
		filterArray.splice(filterArray.indexOf(f), 1);
		document.getElementById("filter"+f).classList.remove("grayOn");
	}
	for (let i = start; i <= total; i++){
		if((filterArray.includes(pkmn[i-1].type[0]) && filterArray.includes(pkmn[i-1].type[1])) || (filterArray.includes(pkmn[i-1].type[0]) && pkmn[i-1].type.length === 1)){
			document.getElementById(i).style.display = "none";
		} else {
			document.getElementById(i).style.display = "flex";
		}
	}
}

function allFilter(t) {
	if (t === "off") {
		filterArray = ["bug", "dark", "dragon", "electric", "fairy", "fire", "fighting", "flying", "ghost", "grass", "ground", "ice", "normal", "poison", "psychic", "rock", "steel", "water"];
		filterArray.forEach(function(f) {
			document.getElementById("filter"+f).classList.add("grayOn");
		});
		for (let i = start; i <= total; i++) {
			document.getElementById(i).style.display = "none";
		}
	}
	if (t === "on") {
		filterArray.forEach(function(f) {
			document.getElementById("filter"+f).classList.remove("grayOn");
		});
		filterArray = [];
		for (let i = start; i <= total; i++) {
			document.getElementById(i).style.display = "flex";
		}
	}
}
