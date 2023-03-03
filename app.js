let start = 1;
let total = 400;
let filterArray = [];

let skipLocked = "no";
let skipForms = "true";

window.onload = async function() {
	await getPkmn();
	console.log(pkmn);
	skipLocked = localStorage.getItem("settingShiny");
	skipForms = localStorage.getItem("settingForm");
	pokeList();
	loadData();
	updateData();
	document.getElementById("menuContainer").style.display = "block";
}

function pokeList(){
	document.getElementById("pokeList").innerHTML ="";
	pkmn.forEach(function(i){
		if(skipLocked !== "yes" || i.shinyLocked !== true){
			addCard(i);
		}
		if(skipForms === "no" && i.alternateForm !== undefined){
			i.alternateForm.forEach(function(i){
				addCard(i);
			});
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
		let t = document.querySelectorAll("#types"+i.id+" > div")
		let t1 = t[0].innerText.toLowerCase();
		let t2 = "";
		if (t.length === 2){
			t2 = t[1].innerText.toLowerCase();
		}
	if((filterArray.includes(t1) && filterArray.includes(t2)) || (filterArray.includes(t1) && t.length === 1)){
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
		if(skipLocked == "yes"){
			button.classList.remove("grayOn");
			button.innerText = "Shiny Locked: Shown"
			skipLocked = "no";
		} else {
			button.classList.add("grayOn");
			button.innerText = "Shiny Locked: Hidden"
			skipLocked = "yes";
		}
		localStorage.setItem("settingShiny", skipLocked);
	}

	if (s === "form") {
		let button = document.getElementById("formToggle");
		if(skipForms == "no"){
			button.classList.add("grayOn");
			button.innerText = "Forms: Unique Only";
			skipForms = "yes";
		} else {
			button.classList.remove("grayOn")
			button.innerText = "Forms: All"
			skipForms = "no";
		}
		localStorage.setItem("settingForm", skipForms);
	}
	allFilter("on");
	pokeList();
	loadData();
	updateData();
}

var search = document.getElementById("pokeSearch");
search.addEventListener("keypress", function(event) {
	if (event.key === "Enter") {

		allFilter("on");
		document.querySelectorAll("#pokeList > li").forEach(function(i) {
			t = i.querySelector(".name").innerText;
			if (t.toUpperCase().indexOf(search.value.toUpperCase()) > -1) {
				i.style.display = "flex";
			} else {
				i.style.display = "none";
			}
		});
	}
});

function openMenu() {
	document.getElementById("menuContainer").classList.add("open");
	document.body.classList.add("fixed");
}

function closeMenu() {
	document.getElementById("menuContainer").classList.remove("open");
	document.body.classList.remove("fixed");
}


// -------- THEME SELECTOR --------- //

let theme = localStorage.getItem("theme");

function enableDarkMode() {
	document.body.classList.add("darkMode");
	document.getElementById("header").classList.add("darkMode");
	document.getElementById("pokeList").classList.add("darkMode");
	document.getElementById("footer").classList.add("darkMode");
	document.getElementById("credit").classList.add("darkMode");
	document.getElementById("themeToggle").classList.add("darkMode");
	document.getElementById("toggleIcon").classList.add("darkMode");
	document.getElementById("menuContents").classList.add("darkMode");
	localStorage.setItem("theme", "dark");
}

function disableDarkMode() {
	document.body.classList.remove("darkMode");
	document.getElementById("header").classList.remove("darkMode");
	document.getElementById("pokeList").classList.remove("darkMode");
	document.getElementById("footer").classList.remove("darkMode");
	document.getElementById("credit").classList.remove("darkMode");
	document.getElementById("themeToggle").classList.remove("darkMode");
	document.getElementById("toggleIcon").classList.remove("darkMode");
	document.getElementById("menuContents").classList.remove("darkMode");
	localStorage.setItem("theme", "light");
}

if (theme === "dark") {
	enableDarkMode();
}

document.getElementById("themeToggle").addEventListener("click", function(){

	theme = localStorage.getItem("theme");

	if (theme !== "dark") {
		enableDarkMode();
	} else {
		disableDarkMode();
	}

});
