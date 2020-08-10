async function trending() {
    const apikey = '9pB6HDoUsmugUZYZ3Hi26eSUUS1KDe6M'
    try {
        let urlTrend = (`https://api.giphy.com/v1/gifs/trending?api_key=${apikey}&limit=18`);
        const data = await fetch(urlTrend).then(res => res.json()).then(data => data.data);  
                const trendsContainer = document.getElementById('trendsContainer');

                data.forEach(item => {
                const contenedorInternoT = document.createElement('div');            
                contenedorInternoT.classList.add('contenedorInternoT');
                
                const titleHoverT = document.createElement('div');   
                titleHoverT.classList.add('item2');
                let titleArr = item.title.split(("")[1]).map(word => `# ${word} `);
                titleArr.forEach(title => titleHoverT.innerText+=`${title}`);

                const imageT = document.createElement('img');
                imageT.classList.add('gifTrend');
                imageT.setAttribute('src', item.images.fixed_height.url);
                imageT.setAttribute('style', 'width: 100%');
                imageT.setAttribute('style', 'height: 298px');
                console.log(imageT);
                contenedorInternoT.appendChild(imageT);                
                contenedorInternoT.appendChild(titleHoverT);
                trendsContainer.appendChild(contenedorInternoT);
            })
            
        }
         catch (error) {
            console.log('failed', error);
    }
}
trending();
