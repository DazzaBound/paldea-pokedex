let start = 1;
let total = 400;
let filterArray = [];

let skipLocked = "no";
let skipForms = "yes";



window.onload = async function() {
	await getPkmn();
	console.log(pkmn);
	skipLocked = localStorage.getItem("settingShiny");
	skipForms = localStorage.getItem("settingForm");
	pokeList();
	loadData();
	updateData();
}

function pokeList(){
	document.getElementById("pokeList").innerHTML ="";
	pkmn.forEach(function(i){
		if(skipLocked === "no" || i.shinyLocked !== true){
			addCard(i);
			if(skipForms === "no" && i.alternateForm !== undefined){
				i.alternateForm.forEach(function(i){
					addCard(i);
				});
			}
		}
	});
}

function addCard(i){
	let pkmnName = i.name;
	let pkmnID = i.id;
	let pkmnType = i.type;

	let card = document.createElement("li");
	card.id = pkmnID;
	card.innerHTML = "<img class='image' src='icons/"+pkmnID+".png'><div class='info'><div class='name'>"+pkmnName+"</div><div class= 'types' id= 'types"+pkmnID+"'></div>";
	card.onclick = function(){document.getElementById(pkmnID).classList.toggle("grayOn"); updateData()};
	card.classList.add("grayOn","container");
	document.getElementById("pokeList").append(card);
	pkmnType.forEach(function(typeClass) {
		card.classList.add(typeClass);
		document.getElementById("types"+pkmnID).innerHTML += "<div class='text"+typeClass+" typeBox'>"+typeClass.charAt(0).toUpperCase()+typeClass.slice(1)+"</div>"
	});
}

function updateData(){
	unchecked = (document.querySelectorAll("#pokeList .grayOn").length-document.querySelectorAll("#pokeList > li").length)*-1;
	document.getElementById("counter").innerHTML = unchecked +"/"+document.querySelectorAll("#pokeList > li").length;
	saveData();
}

function loadData(){
	document.querySelectorAll("#pokeList > li").forEach(function(i) {
		if (localStorage.getItem("saveID"+i.id) == "false") {
			document.getElementById(i.id).classList.remove("grayOn");
		}
		if (localStorage.getItem("settingShiny") == "yes") {
			document.getElementById("shinyLockToggle").classList.add("grayOn");
			document.getElementById("shinyLockToggle").innerText = "Shiny Locked: Hidden";
		}
		if (localStorage.getItem("settingForm") == "no") {
			document.getElementById("formToggle").classList.remove("grayOn");
			document.getElementById("formToggle").innerText = "Pokémon Forms: All";
		}
	});
}

function saveData(){
	document.querySelectorAll("#pokeList > li").forEach(function(i) {
		if (document.getElementById(i.id).classList.contains("grayOn")) {
			localStorage.setItem("saveID"+i.id, "true");
		} else {
			localStorage.setItem("saveID"+i.id, "false");
		}
	});
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
	document.querySelectorAll("#pokeList > li").forEach(function(i){
		if((filterArray.includes(pkmn[i.id-1].type[0]) && filterArray.includes(pkmn[i.id-1].type[1])) || (filterArray.includes(pkmn[i.id-1].type[0]) && pkmn[i.id-1].type.length === 1)){
			document.getElementById(i.id).style.display = "none";
		} else {
			document.getElementById(i.id).style.display = "flex";
		}
	});
}

function allFilter(t) {
	if (t === "off") {
		filterArray = ["bug", "dark", "dragon", "electric", "fairy", "fire", "fighting", "flying", "ghost", "grass", "ground", "ice", "normal", "poison", "psychic", "rock", "steel", "water"];
		filterArray.forEach(function(f) {
			document.getElementById("filter"+f).classList.add("grayOn");
		});
		document.querySelectorAll("#pokeList > li").forEach(function(i) {
			document.getElementById(i.id).style.display = "none";
		});
	}
	if (t === "on") {
		filterArray.forEach(function(f) {
			document.getElementById("filter"+f).classList.remove("grayOn");
		});
		filterArray = [];
		document.querySelectorAll("#pokeList > li").forEach(function(i) {
			document.getElementById(i.id).style.display = "flex";
		});
	}
}

function settingToggle(s){
	if (s === "shiny") {
		let button = document.getElementById("shinyLockToggle");
		if(skipLocked == "no"){
			button.classList.add("grayOn");
			button.innerText = "Shiny Locked: Hidden"
			skipLocked = "yes";
		} else {
			button.classList.remove("grayOn");
			button.innerText = "Shiny Locked: Shown"
			skipLocked = "no";
		}
		localStorage.setItem("settingShiny", skipLocked);
	}

	if (s === "form") {
		let button = document.getElementById("formToggle");
		if(skipForms == "no"){
			button.classList.add("grayOn");
			button.innerText = "Pokémon Forms: Unique Only";
			skipForms = "yes";
		} else {
			button.classList.remove("grayOn")
			button.innerText = "Pokémon Forms: All"
			skipForms = "no";
		}
		localStorage.setItem("settingForm", skipForms);
	}
	allFilter("on");
	pokeList();
	loadData();
	updateData();
}
