if (localStorage.getItem("GifsURL")) {
  const gifsURL = JSON.parse(localStorage.getItem("GifsURL"));
  gifsURL.map(function (e) {
    const currentGif = e;
    const gifImg = document.createElement("IMG");

    gifImg.setAttribute("src", currentGif);
    gifImg.setAttribute("width", "100%");
    gifImg.setAttribute("height", "250px");
    gifImg.setAttribute("class", "gifImg");
    gifImg.setAttribute("id", "gifImg");

    document.getElementById("crearGifosGifsContainer").appendChild(gifImg);
  });
}

// Anima la barra de subida
function animateProgressBar() {
  document.querySelector('.progress-bar').style.display = 'inline-block';
  let progressBar = document.getElementById('progress-bar');
  let liCounter = 0;
  setInterval(function() {
    progressBar.querySelectorAll('li')[liCounter].style.display = 'inline-block';
    if (liCounter >= 15) {
      progressBar.querySelectorAll('li').forEach(element => {
        element.style.display = 'none';
      })
      liCounter = 0;
    }else{
      liCounter++;
    }
  }, 400);
};


document.querySelector('.subirGuifoButton').addEventListener('click', animateProgressBar())
