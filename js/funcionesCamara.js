let recorder;
let timer;
let blob;
let url;
let signal;
let controller;

function saveGifInLocalStorage(data) {
  const gifURL = data.data.images.downsized.url;
  if (localStorage.getItem("GifsURL")) {
    const currentGifsURL = JSON.parse(localStorage.getItem("GifsURL"));
    currentGifsURL.push(gifURL);
    localStorage.setItem("GifsURL", JSON.stringify(currentGifsURL));
  } else {
    localStorage.setItem("GifsURL", JSON.stringify([gifURL]));
  }
}

function previewGif(data) {
  const gifPreviewUrl = data.data.images.downsized.url;

  const gifPreview = document.createElement("IMG");
  gifPreview.setAttribute("src", gifPreviewUrl);
  gifPreview.setAttribute("width", "100%");
  gifPreview.setAttribute("height", "190px");
  gifPreview.setAttribute("class", "gifImg");
  gifPreview.setAttribute("id", "gifImg");

  document.getElementById("guifoSubidoVistaPrevia").appendChild(gifPreview);

  const downloadUrl = document.getElementById("gifImg").src;

  document.getElementById("descargarGuifo").setAttribute("href", downloadUrl);
}

function putGifInMisGuifos() {
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
}

function onStartedDownload(id) {
  console.log(`Started downloading: ${id}`);
}

function onFailed(error) {
  console.log(`Download failed: ${error}`);
}

const comenzarButton = document.getElementById("comenzarButton");
comenzarButton.addEventListener("click", function () {
  const crearGuifosWindow = document.getElementById("crearGuifosWindow");
  crearGuifosWindow.style.display = "none";
});
comenzarButton.addEventListener("click", function () {
  document.getElementById("wrapperMisGifosSection").style.display = "none";
});
comenzarButton.addEventListener("click", function () {
  const precapturaContainer = document.getElementById("precapturaContainer");
  precapturaContainer.style.display = "flex";
});

comenzarButton.addEventListener("click", function () {
  const constraints = {
    audio: false,
    video: true,
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
      const video = document.getElementById("precaptura");
      video.srcObject = mediaStream;
      video.onloadedmetadata = function (e) {
        video.play();
      };
      capturarButton.addEventListener("click", function () {
        recorder = RecordRTC(mediaStream, {
          type: "gif",
          frameRate: 1,
          quality: 10,
          hidden: 240,
        });
        recorder.startRecording();
      });
      capturarButton.addEventListener("click", function () {
        capturarButton.style.display = "none";
        document.getElementById("listoButton").style.display = "inline";
        document.getElementById("cameraImg").style.display = "none";
        document.getElementById("recordingImg").style.display = "inline";
        document.getElementById("cronometro").style.visibility = "visible";
        document.getElementById("precapturaTitle").innerHTML =
          "Capturando Tu Guifo";

        var segundos = 0;
        var centesimas = 0;

        var segundosSpan = document.getElementById("segundos");
        var centesimasSpan = document.getElementById("centesimas");

        timer = setInterval(function () {
          if (centesimas === 99) {
            centesimas = 0;
            segundos = segundos + 1;
            if (segundos < 10) {
              segundosSpan.innerHTML = "0" + segundos;
            } else {
              segundosSpan.innerHTML = segundos;
            }
          }
          centesimas = centesimas + 1;
          if (centesimas < 10) {
            centesimasSpan.innerHTML = "0" + centesimas;
          } else {
            centesimasSpan.innerHTML = centesimas;
          }
        }, 1);
      });
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });
});


listoButton.addEventListener("click", async function () {
  recorder.stopRecording(function () {
    blob = recorder.blob;
    url = URL.createObjectURL(blob);
    document.getElementById("gifRecorded").src = url;
  });
});
listoButton.addEventListener("click", function () {
  document.getElementById("precapturaTitle").innerHTML = "Vista Previa";
  document.getElementById("precaptura").style.display = "none";
  document.getElementById("gifRecorded").style.display = "block";
  document.getElementById("listoButton").style.display = "none";
  document.getElementById("subirGuifoButton").style.display = "inline";
  document.getElementById("repetirCapturaButton").style.display = "inline";
  document.getElementById("recordingImg").style.display = "none";
  document.getElementById("closePrecaptura").style.display = "none";
  clearInterval(timer);
});

document
  .getElementById("subirGuifoButton")
  .addEventListener("click", function () {
    document.getElementById("gifRecorded").style.display = "none";
    document.getElementById("closePrecaptura").style.display = "inline";
    document.getElementById("cronometro").style.display = "none";
    document.getElementById("precapturaTitle").innerHTML = "Subiendo Guifo";
    document.getElementById("subirGuifoButton").style.display = "none";
    document.getElementById("repetirCapturaButton").style.display = "none";
    document.getElementById("cancelarSubidaButton").style.display = "block";
    document.getElementById("subiendoGifoContainer").style.display = "flex";

    let form = new FormData();
    form.append("file", blob, "myGif.gif");

    const apiKey = "9pB6HDoUsmugUZYZ3Hi26eSUUS1KDe6M";
    const endpoint = `https://upload.giphy.com/v1/gifs?api_key=${apiKey}`;

    fetch(endpoint, {
      signal,
      method: "POST",
      body: form,
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const myGif = data.data.id;
        if (localStorage.getItem("MyGifs")) {
          const myCurrentGifs = JSON.parse(localStorage.getItem("MyGifs"));
          myCurrentGifs.push(myGif);
          localStorage.setItem("MyGifs", JSON.stringify(myCurrentGifs));
        } else {
          localStorage.setItem("MyGifs", JSON.stringify([myGif]));
        }

        const id = JSON.parse(localStorage.getItem("MyGifs"));
        const length = id.length;
        const uploadGif = id[length - 1];

        const key = "9pB6HDoUsmugUZYZ3Hi26eSUUS1KDe6M";
        const idEndpoint = `https://api.giphy.com/v1/gifs/${uploadGif}?api_key=${key}`;

        fetch(idEndpoint)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            document.getElementById("guifoSubidoContainer").style.display =
              "flex";
            document.getElementById("precapturaContainer").style.display =
              "none";
            document.getElementById("wrapperMisGifosSection").style.display =
              "block";
            document.getElementById("crearGifosGifsContainer").innerHTML = "";

            saveGifInLocalStorage(data);
            previewGif(data);
            putGifInMisGuifos();
          })
          .catch(function (error) {
            return error;
          });
      })
      .catch(function (error) {
        return error;
      });
  });

  document
  .getElementById("cancelarSubidaButton")
  .addEventListener("click", function () {
    controller = new AbortController();
    signal = controller.signal;
    controller.abort();
    console.log("Download aborted");
    window.location.href = "creaGuifos.html";
  });

document
  .getElementById("repetirCapturaButton")
  .addEventListener("click", function () {
    document.getElementById("gifRecorded").style.display = "none";
    document.getElementById("precaptura").style.display = "block";
    document.getElementById("subirGuifoButton").style.display = "none";
    document.getElementById("repetirCapturaButton").style.display = "none";
    document.getElementById("capturarButton").style.display = "inline";
    document.getElementById("cameraImg").style.display = "inline";
    document.getElementById("centesimas").innerHTML = "00";
    document.getElementById("segundos").innerHTML = "00";
    document.getElementById("cronometro").style.visibility = "hidden";
    document.getElementById("precapturaTitle").innerHTML =
      "Un Chequeo Antes de Empezar";
    document.getElementById("closePrecaptura").style.display = "inline";
  });

document
  .getElementById("copiarEnlaceGuifo")
  .addEventListener("click", function () {
    const copyText = document.createElement("input");
    copyText.value = document.getElementById("gifImg").src;
    document.body.appendChild(copyText);
    copyText.select();
    document.execCommand("copy");
  });

document.getElementById("closeGuifoSubido").addEventListener("click", function (){
  document.getElementById("guifoSubidoContainer").style.display="none";
})

document.getElementById("guifoSubidoListoButton").addEventListener("click", function (){
  document.getElementById("guifoSubidoContainer").style.display="none";
})


