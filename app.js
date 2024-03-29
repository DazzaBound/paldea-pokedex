let start = 1;
let total = 400;
let filterArray = [];

let skipLocked = "no";
let skipForms = "true";
let skipPaldea = "no";
let skipTeal = "no";
let skipIndigo = "no";

let urlParams = new URLSearchParams(window.location.search);

let code = urlParams.get("l");
console.log(code)

window.onload = async function() {
	await getPkmn();
	console.log(pkmn);
	skipLocked = localStorage.getItem("settingShiny");
	skipForms = localStorage.getItem("settingForm");
	skipPaldea = localStorage.getItem("settingPaldea");
	skipTeal = localStorage.getItem("settingTeal");
	skipIndigo = localStorage.getItem("settingIndigo");
	pokeList();
	loadData();
	updateData();
	document.getElementById("menuContainer").style.display = "block";
	if(code !== null) {
		buildShare();
	}
}

function pokeList(){
	document.getElementById("pokeList").innerHTML ="";
	pkmn.forEach(function(i){

		if (skipPaldea === "yes" && i.dlc === undefined){
			return;
		}

		if (skipLocked === "yes" && i.shinyLocked === true){
			return;
		}

		if (skipTeal === "yes" && i.dlc === "teal"){
			return;
		}

		if (skipIndigo === "yes" && i.dlc === "indigo"){
			return;
		}

		addCard(i);
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
	if(i.exclusive !== null) {
		let circle = document.createElement("div");
		circle.classList.add("exc")
		if(i.exclusive === "s"){
			circle.classList.add("s");
			circle.innerText = "S";
		};
		if(i.exclusive === "v"){
			circle.classList.add("v");
			circle.innerText = "V";
		};
		document.getElementById(i.id).appendChild(circle);
	}
}

function updateData(){
	unchecked = (document.querySelectorAll("#pokeList .grayOn").length-document.querySelectorAll("#pokeList > li").length)*-1;
	document.getElementById("counter").innerHTML = unchecked +"/"+document.querySelectorAll("#pokeList > li").length;
	saveData();
	shareBuilder();
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
		if (localStorage.getItem("settingPaldea") == "yes") {
			document.getElementById("paldeaToggle").classList.add("grayOn");
			document.getElementById("paldeaToggle").innerText = "Paldea: Hidden";
		}
		if (localStorage.getItem("settingTeal") == "yes") {
			document.getElementById("tealToggle").classList.add("grayOn");
			document.getElementById("tealToggle").innerText = "Teal Mask: Hidden";
		}
		if (localStorage.getItem("settingIndigo") == "yes") {
			document.getElementById("indigoToggle").classList.add("grayOn");
			document.getElementById("indigoToggle").innerText = "Teal Mask: Hidden";
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
	let res = await fetch("https://dazzabound.github.io/paldea-pokedex/pkmn2.json");
	pkmn = await res.json();
}


// -------- MENUS / FILTERS --------- //

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

	if (s === "paldea") {
		let button = document.getElementById("paldeaToggle");
		if(skipPaldea == "yes"){
			button.classList.remove("grayOn");
			button.innerText = "Paldea: Shown";
			skipPaldea = "no";
		} else {
			button.classList.add("grayOn");
			button.innerText = "Paldea: Hidden";
			skipPaldea = "yes"
		}
		localStorage.setItem("settingPaldea", skipPaldea);
	}

	if (s === "teal") {
		let button = document.getElementById("tealToggle");
		if(skipTeal == "yes"){
			button.classList.remove("grayOn");
			button.innerText = "Teal Mask: Shown";
			skipTeal = "no";
		} else {
			button.classList.add("grayOn");
			button.innerText = "Teal Mask: Hidden";
			skipTeal = "yes"
		}
		localStorage.setItem("settingTeal", skipTeal);
	}

	if (s === "indigo") {
		let button = document.getElementById("indigoToggle");
		if(skipIndigo == "yes"){
			button.classList.remove("grayOn");
			button.innerText = "Indigo Disk: Shown";
			skipIndigo = "no";
		} else {
			button.classList.add("grayOn");
			button.innerText = "Indigo Disk: Hidden";
			skipIndigo = "yes"
		}
		localStorage.setItem("settingIndigo", skipIndigo);
	}

	allFilter("on");
	document.getElementById("checkToggle").classList.remove("grayOn");
	document.getElementById("uncheckToggle").classList.remove("grayOn");
	pokeList();
	loadData();
	updateData();
}

function checkToggle(c) {
	if (c === "checked") {
		let button = document.getElementById("checkToggle");
		if (button.classList.contains("grayOn")) {
			document.querySelectorAll("#pokeList > li:not(.grayOn)").forEach(function(i) {
				button.classList.remove("grayOn");
				button.innerText = "Checked Pokémon: Shown";
			});
		} else {
			document.querySelectorAll("#pokeList > li:not(.grayOn)").forEach(function(i) {
				button.classList.add("grayOn");
				button.innerText = "Checked Pokémon: Hidden";
			});
		}
	}

	if (c === "unchecked") {
		let button = document.getElementById("uncheckToggle");

		if (button.classList.contains("grayOn")) {
			document.querySelectorAll("#pokeList > li.grayOn").forEach(function(i) {
				button.classList.remove("grayOn");
				button.innerText = "Unchecked Pokémon: Shown";
			});
		} else {
			document.querySelectorAll("#pokeList > li.grayOn").forEach(function(i) {
				button.classList.add("grayOn");
				button.innerText = "Unchecked Pokémon: Hidden";
			});
		}
	}
	filterList();
}

function filter(f){
	if(!filterArray.includes(f)){
		filterArray.push(f);
		document.getElementById("filter"+f).classList.add("grayOn");
	} else {
		filterArray.splice(filterArray.indexOf(f), 1);
		document.getElementById("filter"+f).classList.remove("grayOn");
	}
	filterList();
}

function allFilter(t) {
	if (t === "off") {
		filterArray = ["bug", "dark", "dragon", "electric", "fairy", "fire", "fighting", "flying", "ghost", "grass", "ground", "ice", "normal", "poison", "psychic", "rock", "steel", "water"];
		filterArray.forEach(function(f) {
			document.getElementById("filter"+f).classList.add("grayOn");
		});
		document.getElementById("checkToggle").classList.remove("grayOn");
		document.getElementById("uncheckToggle").classList.remove("grayOn");
	}
	if (t === "on") {
		filterArray.forEach(function(f) {
			document.getElementById("filter"+f).classList.remove("grayOn");
		});
		filterArray = [];
		document.getElementById("checkToggle").classList.remove("grayOn");
		document.getElementById("uncheckToggle").classList.remove("grayOn");
	}
	filterList();
}


function filterList() {
	let checked = "";
	let unchecked = "";
	document.querySelectorAll("#pokeList > li").forEach(function(i) {

		if (document.getElementById("checkToggle").classList.contains("grayOn")) {
			checked = "hide";
		} else {
			checked = "show";
		}
		if (document.getElementById("uncheckToggle").classList.contains("grayOn")) {
			unchecked = "hide";
		} else {
			unchecked = "show";
		}
		let type = document.querySelectorAll("#types"+i.id+" > div")
		let type1 = type[0].innerText.toLowerCase();
		let type2 = "";
		if (type.length === 2){
			type2 = type[1].innerText.toLowerCase();
		}
	if(	(filterArray.includes(type1) && filterArray.includes(type2)) ||
		(filterArray.includes(type1) && type.length === 1) ||
		(checked === "hide" && !i.classList.contains("grayOn")) ||
		(unchecked === "hide" && i.classList.contains("grayOn"))){
			document.getElementById(i.id).style.display = "none";
		} else {
			document.getElementById(i.id).style.display = "flex";
		}
	});
}

function openMenu() {
	document.getElementById("menuContainer").classList.add("open");
	document.body.classList.add("fixed");
}

function closeMenu() {
	document.getElementById("menuContainer").classList.remove("open");
	document.body.classList.remove("fixed");
}

function copyShare() {
	var copyText = document.getElementById("shareCode");
	copyText.select();
	copyText.setSelectionRange(0,99999);
	navigator.clipboard.writeText(copyText.value);
	document.getElementById("cbConfirm").classList.add("confirmDisplay");
	setTimeout(function(){
		document.getElementById("cbConfirm").classList.remove("confirmDisplay");
	}, 1000);
}

function shareBuilder() {
	var shareLink = "";
	pkmn.forEach(function(i){
		if (localStorage.getItem("saveID"+i.id) == "true") {
			shareLink += "0";
		} else {
			shareLink += "1";
		}
		if(i.alternateForm !== undefined){
			i.alternateForm.forEach(function(i){
				if (localStorage.getItem("saveID"+i.id) != "false") {
					shareLink += "0";
				} else {
					shareLink += "1";
				}
			});
		}
	});
	compressedShare = LZString.compressToEncodedURIComponent(shareLink)
	let shareShiny = "";
	let shareForm = "";

	if (localStorage.getItem("settingShiny") !== "yes") {
		shareShiny = "&locked"
	}
	if (localStorage.getItem("settingForm") !== "yes") {
		shareForm = "&forms"
	}
	document.getElementById("shareCode").value = "https://dazzabound.github.io/paldea-pokedex/?l="+compressedShare+shareForm+shareShiny;
}

function openDialogue(t) {
	document.getElementById("dialogueCont").classList.add("open");
	document.body.classList.add("fixed");
	if(t=== "import") {
		if(code !== null) {
			document.getElementById("dialogue").innerHTML = "<div>Import Pokédex?</div><p>This will OVERWRITE your saved data with the data included in the share link. Are you sure you wish to continue?</p>";
			let dialogueControls = document.createElement("div");
			dialogueControls.id = "dialogueControls";
			dialogueControls.innerHTML = "<div class='btn cancel' onclick='closeDialogue()'>Cancel</div><div class='btn import' onclick='importData()'>Import</div>";
			document.getElementById("dialogueCont").append(dialogue);
			document.getElementById("dialogue").append(dialogueControls);
		} else {
			document.getElementById("dialogue").innerHTML = "<div>Import Pokédex?</div><p>Please load the site using a share link to use the import feature.</p>";
			let dialogueControls = document.createElement("div");
			dialogueControls.id = "dialogueControls";
			dialogueControls.innerHTML = "<div class='btn cancel' onclick='closeDialogue()'>Close</div>";
			document.getElementById("dialogueCont").append(dialogue);
			document.getElementById("dialogue").append(dialogueControls);
		}
	}
	if(t === "clear") {
		document.getElementById("dialogue").innerHTML = "<div>Clear Pokédex?</div><p>This will DELETE all of your saved data permanently. Are you sure you wish to continue?</p>";
		let dialogueControls = document.createElement("div");
		dialogueControls.id = "dialogueControls";
		dialogueControls.innerHTML = "<div class='btn cancel' onclick='closeDialogue()'>Cancel</div><div class='btn delete' onclick='clearData()'>Delete</div>";
		document.getElementById("dialogueCont").append(dialogue);
		document.getElementById("dialogue").append(dialogueControls);
	}
}

function closeDialogue() {
	document.getElementById("dialogueCont").classList.remove("open");
	document.body.classList.remove("fixed");
	document.getElementById("dialogue").innerHTML = "";
}

function importData() {
	importCode= LZString.decompressFromEncodedURIComponent(code);
	var indx = 0;
	pkmn.forEach(function(i){
		if(importCode.substr(indx,1)== "1") {
			localStorage.setItem("saveID"+i.id, "false");
		} else {
			localStorage.setItem("saveID"+i.id, "true");
		}
		indx += 1;
		if(i.alternateForm !== undefined){
			i.alternateForm.forEach(function(i){
				if(importCode.substr(indx,1)==1) {
					localStorage.setItem("saveID"+i.id, "false");
				} else {
					localStorage.setItem("saveID"+i.id, "true");
				}
			indx += 1;
			});
			
		}
	});
	pokeList();
	loadData();
	updateData();
	closeDialogue();
	closeMenu();
}

function clearData() {
	pkmn.forEach(function(i){
		localStorage.setItem("saveID"+i.id, "true");
		if(i.alternateForm !== undefined){
			i.alternateForm.forEach(function(i){
				localStorage.setItem("saveID"+i.id, "true");
			});
		}
	});
	pokeList();
	updateData();
	closeDialogue();
	closeMenu();
}

// -------- SEARCH BAR --------- //

var search = document.getElementById("pokeSearch");
search.addEventListener("keypress", function(event) {
	if (event.key === "Enter") {
		startSearch();
	}
});

function clearSearch() {
	document.getElementById("pokeSearch").value = "";
	searchContent();
}

function searchContent() {
	if (document.getElementById("pokeSearch").value !== "") {
		document.getElementById("searchBar").classList.add("value");
	} else {
		document.getElementById("searchBar").classList.remove("value");
		allFilter("on");
	}
}

function startSearch() {
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

// -------- SHARE VIEW --------- //

function buildShare() {
	closeMenu()
	document.getElementById("shareContainer").classList.add("open");
	document.body.classList.add("fixed");
	document.getElementById("shareDisplay").innerHTML = "<div id='shareTitle'></div>";
	tagNo = 0;
	
	pkmn.forEach(function(i){
		if(i.shinyLocked !== true) {
			addTag(i);
		} else {
			if(urlParams.has("locked")){
				addTag(i);
			} else {tagNo += 1}
		}

		if(i.alternateForm !== undefined){
			i.alternateForm.forEach(function(i){
				if(urlParams.has("forms")){
					addTag(i);
				} else (tagNo += 1)
			});
		}
	});
	
	let subtitleShiny = "Hidden";
	let subtitleForms = "Hidden";
	if(urlParams.has("locked")){subtitleShiny = "Shown"};
	if(urlParams.has("forms")){subtitleForms = "Shown"};
	document.getElementById("shareTitle").innerText = "Share List Completion: "+document.querySelectorAll("#shareDisplay .check").length+"/"+document.querySelectorAll("#shareDisplay .shareTag").length;
	document.getElementById("shareTitle").innerHTML += "<div id='shareSubtitle'>| Shiny Locked: "+subtitleShiny+" | Alternate Forms: "+subtitleForms+" |</div>"
}

function addTag(i) {
	let tag = document.createElement("div");
	tag.classList.add("shareTag");
	tag.innerHTML = "<img src='icons/"+i.id+".png'>"+"<span>"+i.name+"</span>";

	shareCode = LZString.decompressFromEncodedURIComponent(code);

	if(shareCode.substr(tagNo,1)==1) {
		tag.classList.add("check")
	}

	document.getElementById("shareDisplay").appendChild(tag);
	tagNo += 1
}

function closeShare() {
	document.getElementById("shareContainer").classList.remove("open");
	document.body.classList.remove("fixed");
	document.getElementById("shareDisplay").innerHTML = "";
}
