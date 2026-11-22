// Camera, recording and Giphy upload flow.
(() => {
  const GIPHY_API_KEY = "9pB6HDoUsmugUZYZ3Hi26eSUUS1KDe6M";
  const requiredIds = ["comenzarButton", "capturarButton", "listoButton", "subirGuifoButton"];
  if (requiredIds.some((id) => !document.getElementById(id))) return;

  let recorder = null;
  let stream = null;
  let recordedBlob = null;
  let timerId = null;
  let elapsedSeconds = 0;
  let uploadController = null;

  const elements = Object.fromEntries(requiredIds.map((id) => [id, document.getElementById(id)]));

  function stopStream() {
    stream?.getTracks().forEach((track) => track.stop());
  }

  function resetTimer() {
    clearInterval(timerId);
    elapsedSeconds = 0;
    document.getElementById("segundos").textContent = "00";
    document.getElementById("centesimas").textContent = "00";
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Tu navegador no permite acceso a la cámara.");
      return;
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      const video = document.getElementById("precaptura");
      video.srcObject = stream;
      await video.play();
      document.getElementById("crearGuifosWindow").style.display = "none";
      document.getElementById("precapturaContainer").style.display = "flex";
    } catch (error) {
      alert("No pudimos acceder a tu cámara. Revisá los permisos e intentá nuevamente.");
      console.error("Error de cámara:", error);
    }
  }

  function startRecording() {
    if (!stream || typeof RecordRTC === "undefined") return;
    recorder = new RecordRTC(stream, { type: "gif", frameRate: 1, quality: 10, width: 360, height: 240 });
    recorder.startRecording();

    document.getElementById("capturarButton").style.display = "none";
    document.getElementById("listoButton").style.display = "inline";
    document.getElementById("precapturaTitle").textContent = "Capturando Tu Guifo";

    resetTimer();
    let hundredths = 0;
    timerId = setInterval(() => {
      hundredths += 1;
      if (hundredths === 100) {
        hundredths = 0;
        elapsedSeconds += 1;
      }
      document.getElementById("segundos").textContent = String(elapsedSeconds).padStart(2, "0");
      document.getElementById("centesimas").textContent = String(hundredths).padStart(2, "0");
    }, 10);
  }

  function stopRecording() {
    if (!recorder) return;
    recorder.stopRecording(() => {
      recordedBlob = recorder.blob;
      const preview = document.getElementById("gifRecorded");
      preview.src = URL.createObjectURL(recordedBlob);

      clearInterval(timerId);
      document.getElementById("precaptura").style.display = "none";
      preview.style.display = "block";
      document.getElementById("listoButton").style.display = "none";
      document.getElementById("subirGuifoButton").style.display = "inline";
      document.getElementById("repetirCapturaButton").style.display = "inline";
      document.getElementById("precapturaTitle").textContent = "Vista Previa";
    });
  }

  async function uploadGif() {
    if (!recordedBlob) return;
    const form = new FormData();
    form.append("file", recordedBlob, "mi-guifo.gif");

    document.getElementById("subiendoGifoContainer").style.display = "flex";
    document.getElementById("subirGuifoButton").style.display = "none";
    document.getElementById("repetirCapturaButton").style.display = "none";
    document.getElementById("precapturaTitle").textContent = "Subiendo Guifo";

    uploadController = new AbortController();
    try {
      const uploadResponse = await fetch(`https://upload.giphy.com/v1/gifs?api_key=${GIPHY_API_KEY}`, {
        method: "POST", body: form, signal: uploadController.signal
      });
      if (!uploadResponse.ok) throw new Error(`Giphy respondió con ${uploadResponse.status}`);
      const upload = await uploadResponse.json();

      const gifId = upload.data?.id;
      if (!gifId) throw new Error("Giphy no devolvió el identificador del GIF");

      const gifResponse = await fetch(`https://api.giphy.com/v1/gifs/${gifId}?api_key=${GIPHY_API_KEY}`);
      if (!gifResponse.ok) throw new Error(`Giphy respondió con ${gifResponse.status}`);
      const payload = await gifResponse.json();
      const gifUrl = payload.data?.images?.downsized?.url || payload.data?.images?.original?.url;
      if (!gifUrl) throw new Error("Giphy no devolvió la URL del GIF");

      const saved = JSON.parse(localStorage.getItem("GifsURL") || "[]");
      localStorage.setItem("GifsURL", JSON.stringify([...saved, gifUrl]));

      const previewContainer = document.getElementById("guifoSubidoVistaPrevia");
      previewContainer.innerHTML = "";
      const preview = document.createElement("img");
      preview.id = "gifImg";
      preview.src = gifUrl;
      preview.alt = "Guifo creado";
      previewContainer.appendChild(preview);

      const download = document.getElementById("descargarGuifo");
      download.href = gifUrl;
      document.getElementById("guifoSubidoContainer").style.display = "flex";
      document.getElementById("precapturaContainer").style.display = "none";
      stopStream();
    } catch (error) {
      if (error.name !== "AbortError") {
        alert("No se pudo subir el guifo. Intentá nuevamente.");
        console.error("Error al subir GIF:", error);
      }
    } finally {
      document.getElementById("subiendoGifoContainer").style.display = "none";
    }
  }

  function repeatCapture() {
    clearInterval(timerId);
    document.getElementById("gifRecorded").style.display = "none";
    document.getElementById("precaptura").style.display = "block";
    document.getElementById("subirGuifoButton").style.display = "none";
    document.getElementById("repetirCapturaButton").style.display = "none";
    document.getElementById("capturarButton").style.display = "inline";
    document.getElementById("precapturaTitle").textContent = "Un Chequeo Antes de Empezar";
    resetTimer();
  }

  elements.comenzarButton.addEventListener("click", startCamera);
  elements.capturarButton.addEventListener("click", startRecording);
  elements.listoButton?.addEventListener("click", stopRecording);
  elements.subirGuifoButton.addEventListener("click", uploadGif);
  document.getElementById("repetirCapturaButton")?.addEventListener("click", repeatCapture);
  document.getElementById("cancelarSubidaButton")?.addEventListener("click", () => {
    uploadController?.abort();
    stopStream();
  });

  document.getElementById("copiarEnlaceGuifo")?.addEventListener("click", async () => {
    const value = document.getElementById("gifImg")?.src;
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      alert("Enlace copiado");
    } catch (_) {
      const input = document.createElement("textarea");
      input.value = value;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
  });

  window.addEventListener("beforeunload", stopStream);
})();
