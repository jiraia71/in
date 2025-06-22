document.addEventListener("DOMContentLoaded", () => {
  let contadorAtualizacoes = 0;
  const historico = [];

  const intervaloAtualizacao = 10 * 1000; // 10 segundos

  // Referência para gráfico Chart.js
  const ctx = document.getElementById("graficoNivel").getContext("2d");

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Nível do Rio (m)",
        data: [],
        borderColor: "#007bff",
        backgroundColor: "rgba(0,123,255,0.1)",
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          min: 3,
          max: 6,
          title: {
            display: true,
            text: "Metros"
          }
        },
        x: {
          title: {
            display: true,
            text: "Horário"
          }
        }
      }
    }
  });

  function gerarNivelAleatorio() {
    return (Math.random() * 2.6 + 3.2).toFixed(2);
  }

  function classificarRisco(nivel) {
    if (nivel >= 5.0) return "Alto";
    if (nivel >= 4.0) return "Moderado";
    return "Baixo";
  }
document.getElementById("btnCamera").addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById("video").srcObject = stream;
  } catch (err) {
    alert("Erro ao acessar a câmera: " + err.message);
  }
});

  function atualizarEstiloPagina(risco) {
    const body = document.body;
    if (risco === "Alto") body.style.backgroundColor = "#ffcccc";
    else if (risco === "Moderado") body.style.backgroundColor = "#fff5cc";
    else body.style.backgroundColor = "#e0f7fa";
  }
async function iniciarCamera() {
  try {
    const video = document.getElementById("video");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
  } catch (err) {
    console.error("Erro ao acessar câmera:", err);
    alert("Não foi possível acessar a câmera. Permita o uso no navegador.");
  }
}

// Chama no carregamento da página
document.addEventListener("DOMContentLoaded", () => {
  iniciarCamera();
});

  function atualizarPainel() {
    const nivel = parseFloat(gerarNivelAleatorio());
    const risco = classificarRisco(nivel);
    const agora = new Date().toLocaleTimeString("pt-BR");

    // Atualiza texto
    document.getElementById("nivel").textContent = `${nivel} m`;
    document.getElementById("risco").textContent = risco;
    document.getElementById("atualizacao").textContent = agora;

    // Atualiza alertas
    const lista = document.getElementById("lista-alertas");
    lista.innerHTML = "";

    const alerta = document.createElement("li");

    if (risco === "Alto") {
      alerta.innerHTML = "🚨 Alerta crítico! Áreas próximas ao rio devem ser evacuadas.";
      alerta.style.background = "#ffcccc";
    } else if (risco === "Moderado") {
      alerta.innerHTML = "⚠️ Atenção: risco moderado de cheia, acompanhe novas medições.";
      alerta.style.background = "#fff5cc";
    } else {
      alerta.innerHTML = "✅ Situação normal, sem risco imediato de inundações.";
      alerta.style.background = "#ccffcc";
    }

    alerta.style.padding = "0.5rem";
    alerta.style.borderLeft = "5px solid #555";
    lista.appendChild(alerta);

    atualizarEstiloPagina(risco);

    // Armazena e plota no gráfico
    historico.push({ nivel, risco, hora: agora });
    chart.data.labels.push(agora);
    chart.data.datasets[0].data.push(nivel);
    chart.update();

    contadorAtualizacoes++;
    console.log(`Atualização ${contadorAtualizacoes}:`, nivel, risco, agora);
  }

  atualizarPainel(); // Primeira chamada
  setInterval(atualizarPainel, intervaloAtualizacao);
});
