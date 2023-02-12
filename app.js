const pokeList = document.getElementById("pokeList");
const total = 400;

for ( let i = 1; i <= total; i++){
	displayList(i);
}
saveState = localStorage.getItem("save");
	
	for (let i = 0; i < saveState.length; i++) {
		if (saveState.charAt(i) == "1") {
			document.getElementById(i+1).classList.remove("grayOn");
		}
	}
updateData();


function displayList(i){
	let card = document.createElement("div");
	card.id = i;
	card.innerHTML = "<img src=\"icons/"+i+".png\"></img>";		// version 1
	card.onclick = function(){document.getElementById(i).classList.toggle("grayOn"); updateData()};
	card.classList.add("grayOn");
	card.classList.add("pokeImg");
	document.getElementById("pokeList").append(card);
}

function updateData(){
	unchecked = (document.querySelectorAll("#pokeList .grayOn").length-total)*-1;
	document.getElementById("counter").innerHTML = unchecked +"/"+total;
	
	saveState = "";
	
	for ( let i = 1; i <= total; i++){
		if (document.getElementById(i).classList.contains("grayOn") == true){
			saveState += "0";	
		} else {
			saveState += "1";
		}
	}
	localStorage.setItem("save", saveState);
}