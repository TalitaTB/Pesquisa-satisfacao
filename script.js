const form = document.getElementById('pesquisaForm');
const ctxMedia = document.getElementById('graficoMedia').getContext('2d');
const ctxQuantidade = document.getElementById('graficoQuantidade').getContext('2d');
const ctxPercentual = document.getElementById('graficoPercentual').getContext('2d');

let dados = JSON.parse(localStorage.getItem('respostasPesquisa')) || [];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const resposta = {
    servico: form.servico.value,
    atendimento: parseInt(form.atendimento.value),
    prazo: parseInt(form.prazo.value),
    qualidade: parseInt(form.qualidade.value),
    nota: parseInt(form.nota.value)
  };
  dados.push(resposta);
  localStorage.setItem('respostasPesquisa', JSON.stringify(dados));
  form.reset();
  atualizarGraficos();
});

function calcularMedia(dados, campo) {
  const valores = dados.map(r => r[campo]).filter(v => !isNaN(v));
  if (valores.length === 0) return 0;
  const soma = valores.reduce((a, b) => a + b, 0);
  return (soma / valores.length).toFixed(2);
}

function contarNotas(dados) {
  const contagem = [0, 0, 0, 0, 0];
  dados.forEach(r => {
    const nota = r.nota;
    if (nota >= 1 && nota <= 5) contagem[nota - 1]++;
  });
  return contagem;
}

function calcularPercentuais(contagem) {
  const total = contagem.reduce((a, b) => a + b, 0);
  if (total === 0) return [0, 0, 0, 0, 0];
  return contagem.map(qtd => ((qtd / total) * 100).toFixed(1));
}

let graficoMedia, graficoQuantidade, graficoPercentual;

function atualizarGraficos() {
  const mediaNota = calcularMedia(dados, 'nota');
  const contagemNotas = contarNotas(dados);
  const percentuais = calcularPercentuais(contagemNotas);

  if (graficoMedia) graficoMedia.destroy();
  graficoMedia = new Chart(ctxMedia, {
    type: 'bar',
    data: {
      labels: ['Nota Média Geral'],
      datasets: [{
        label: 'Nota Média',
        data: [mediaNota],
        backgroundColor: 'rgba(75, 192, 192, 0.7)'
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 5 }
      }
    }
  });

  if (graficoQuantidade) graficoQuantidade.destroy();
  graficoQuantidade = new Chart(ctxQuantidade, {
    type: 'bar',
    data: {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [{
        label: 'Quantidade de Notas',
        data: contagemNotas,
        backgroundColor: 'rgba(255, 159, 64, 0.7)'
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  if (graficoPercentual) graficoPercentual.destroy();
  graficoPercentual = new Chart(ctxPercentual, {
    type: 'doughnut',
    data: {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [{
        label: '% por Nota',
        data: percentuais,
        backgroundColor: ['#FF6384', '#FF9F40', '#FFCD56', '#4BC0C0', '#36A2EB']
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed}%`;
            }
          }
        }
      }
    }
  });
}

atualizarGraficos();
