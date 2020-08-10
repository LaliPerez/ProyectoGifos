//Gif search by user
let bloque = document.getElementById('panelB') 
let searchInput = document.getElementById('searchInput')
let resultsContainer = document.getElementById('resultsContainer');

bloque.addEventListener('submit', function(e) {
e.preventDefault()
let q = searchInput.value;
search(q)
})

async function search(q) {    
    const apikey = '9pB6HDoUsmugUZYZ3Hi26eSUUS1KDe6M'
      try {
            const pathS = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${q}&limit=18`    
            const data = await fetch(pathS).then(res => res.json()).then(data => data.data);  
            const titulos = document.getElementById("inputResults")
                data.forEach(item => {
               
                const contenedorInternoS = document.createElement('div');            
                contenedorInternoS.classList.add('contenedorInternoS');
              
                const titleHoverS = document.createElement('div');   
                titleHoverS.classList.add('item');
                titleHoverS.classList.add('placeholderSearch')
                titleHoverS.setAttribute('style','text-overflow: ellipsis')
                titleHoverS.setAttribute('style','overflow: hidden')
                let titleArr = item.title.split(("")[1]).map(word => `# ${word} `);
                titleArr.forEach(title => titleHoverS.innerText+=`${title}`);
            

                const image2 = document.createElement('img');
                image2.classList.add('gifSea');
                image2.setAttribute('src', item.images.downsized.url);
                image2.setAttribute('style', 'width: 100%');
                image2.setAttribute('style', 'height: 298px');
                console.log(image2);

                contenedorInternoS.appendChild(image2);                
                contenedorInternoS.appendChild(titleHoverS);
                resultsContainer.appendChild(contenedorInternoS);
                
                titulos.appendChild(titleHoverS)[1];
               
            })

        }   catch (error) {
            console.log('failed', error);
    }
}
search(q);


function displayHidden() {
  var y = document.querySelectorAll("showResults");  
  if (y.style.display === "none") {
      y.style.display = "block";
  } else {
      y.style.display= "none";
  }
}

document.getElementById("searchDropdownContent").addEventListener("click", displayHidden());
function displayHidden(){
    document.getElementById("showSearchResults").style.display = "block";
}