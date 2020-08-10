/* SUGGESTED GIFOS WITH FIXED LIST*/ 
let funny = ['lol', 'simpsons', 'dog', 'smile', 'modernfamily', 'netflix','cute','koala', 'animals','zootopia','joke', 'show', 'fun'];
let show = funny[Math.floor(Math.random(4) * funny.length)];
const suggested = document.getElementById('suggestedInput')

const s = show;
const apikey = '9pB6HDoUsmugUZYZ3Hi26eSUUS1KDe6M'

async function getTrendingGifs(s) {
    try {
        let url = (`https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${s}&limit=4`);
        const data = await fetch(url).then(res => res.json()).then(data => data.data);        
                const contenedorSug = document.getElementById('showSugerencias');
                console.log(data)
                data.forEach(item => {
                const contenedorInternoSug = document.createElement('div');            
                contenedorInternoSug.classList.add('contenedorInternoSug');

                const headerSug = document.createElement('div');   
                const closebtn = document.createElement('img');  
                headerSug.classList.add('item3');
                closebtn.src = './assets/button3.svg';
                closebtn.classList.add('closebtn');
                
                let titleArrSug = item.title.split(("")[1]).map(word => `# ${word} `)
                titleArrSug.forEach(title => headerSug.innerText+=`${title}`);
                
                const imageSug = document.createElement('img');
                imageSug.classList.add('gifSug');
                imageSug.setAttribute('src', item.images.original.url);
                imageSug.setAttribute('style', 'width: 100%')
                console.log(imageSug);
            
                const buttonSee = document.createElement("div")
                buttonSee.classList.add('btnSeeMore');
                buttonSee.innerHTML=" &nbsp Ver más... &nbsp ";
                buttonSee.setAttribute('type','button');
                
                contenedorInternoSug.appendChild(headerSug);
                contenedorInternoSug.appendChild(closebtn);
                contenedorInternoSug.appendChild(imageSug);
                contenedorInternoSug.appendChild(buttonSee);
                contenedorSug.appendChild(contenedorInternoSug);
            })              
            
        }
         catch (error) {
            console.log('failed', error);
    }
}
getTrendingGifs(s);

//see More 
let btn = document.getElementById('showSugerencias');
btn.addEventListener('click', function() {
    window.open('https://giphy.com/','_blank');
});



