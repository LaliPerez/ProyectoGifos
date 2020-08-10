
//autocomplete
function displayDropable() {
  let x = document.getElementById("dropdownSearchContent");  
  if (x.style.display === "none") {
      x.style.display = "block";
  } 
}

document.getElementById("searchInput").addEventListener('input', displayDropable);
document.getElementById("searchInput").addEventListener('input', autocomplete);
function autocomplete(){
    let auto = document.getElementsByClassName('auto'); 
    let keyword = document.getElementById('searchInput').value;
    let keywordClean = keyword.replace('','+')
    const apikey = '9pB6HDoUsmugUZYZ3Hi26eSUUS1KDe6M'
    const urlauto = `https://api.giphy.com/v1/gifs/search/tags?api_key=${apikey}&q=${keywordClean}&limit=6`  
    let autocompleteRes = fetch(urlauto);
    autocompleteRes
    .then(response => response.json())
    .then(datos => {
        for (let i=0; i< datos.data.length; i++){
            auto[i].innerHTML = datos.data[i].name;                     
        }
    })
}


document.getElementsByClassName('auto')[0].addEventListener('click',autoSearch);
document.getElementsByClassName('auto')[1].addEventListener('click',autoSearch);
document.getElementsByClassName('auto')[2].addEventListener('click',autoSearch);
document.getElementsByClassName('auto')[3].addEventListener('click',autoSearch);
document.getElementsByClassName('auto')[4].addEventListener('click',autoSearch);
document.getElementsByClassName('auto')[5].addEventListener('click',autoSearch);

function autoSearch(){
    document.getElementById('searchInput').value = this.innerHTML;
    search();       
    toggleDropdownSearchContent();
    displayHidden();
}

document.getElementsByClassName("auto").addEventListener("onmouseover", toggleDropdownSearchContent());
function toggleDropdownSearchContent(){
    document.getElementById("dropdownSearchContent").style.display = "none";
}
