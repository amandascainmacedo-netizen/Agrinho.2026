
let plantas = [];
let gotas = [];
let insetos = [];
let pontos = 0;
let saudeSolo = 100;
let tempo = 60;
let estado = "jogando";

function setup() {
  createCanvas(800, 600);

  // Criar plantas
  for (let i = 0; i < 6; i++) {
    plantas.push({
      x: 120 + i * 100,
      y: 450,
      tamanho: 30,
      cresceu: 0
    });
  }
}

function draw() {
  background(135, 206, 235);

  // Céu e Sol
  fill(255, 204, 0);
  ellipse(700, 80, 80);

  // Campo
  fill(80, 180, 80);
  rect(0, 500, width, 100);

  if (estado === "jogando") {
    tempo -= deltaTime / 1000;

    // Geração aleatória de gotas de água
    if (frameCount % 60 === 0) {
      gotas.push({ x: random(width), y: -10, r: 20, velocidade: random(2, 5) });
    }

    // Geração aleatória de insetos
    if (frameCount % 180 === 0) {
      insetos.push({ x: random(width), y: random(500), r: 20 });
    }

    // Atualizar e desenhar gotas
    fill(0, 100, 255);
    for (let i = gotas.length - 1; i >= 0; i--) {
      let g = gotas[i];
      ellipse(g.x, g.y, g.r);
      g.y += g.velocidade;

      // Checa colisão com plantas
      for (let p of plantas) {
        let d = dist(g.x, g.y, p.x, p.y);
        if (d < g.r / 2 + p.tamanho / 2) {
          p.cresceu += 5;
          pontos += 10;
          saudeSolo = min(saudeSolo + 1, 100);
          gotas.splice(i, 1);
          break;
        }
      }

      if (g.y > height) {
        gotas.splice(i, 1);
      }
    }

    // Atualizar e desenhar insetos
    fill(139, 69, 19);
    for (let i = insetos.length - 1; i >= 0; i--) {
      let ins = insetos[i];
      ellipse(ins.x, ins.y, ins.r);

      let d = dist(mouseX, mouseY, ins.x, ins.y);
      if (d < 25) {
        pontos += 5;
        insetos.splice(i, 1);
      }
    }

    // Desenhar plantas
    for (let p of plantas) {
      fill(34, 139, 34);
      rect(p.x - 10, p.y - p.tamanho - p.cresceu, 20, p.tamanho + p.cresceu);
      ellipse(p.x, p.y - p.tamanho - p.cresceu, 30, 30); // Folhagem
    }

    // Cursor como regador
    fill(255, 0, 0);
    rect(mouseX - 15, mouseY - 10, 30, 20);

    // Interface
    fill(0);
    textSize(20);
    text("Pontos: " + pontos, 20, 30);
    text("Saúde do Solo: " + floor(saudeSolo) + "%", 20, 60);
    text("Tempo: " + ceil(tempo), 20, 90);

    // Perda de saúde do solo ao longo do tempo
    if (frameCount % 120 === 0) {
      saudeSolo -= 2;
    }

    if (tempo <= 0 || saudeSolo <= 0) {
      estado = "fim";
    }
  }

  if (estado === "fim") {
    background(50, 150, 50);
    fill(255);
    textAlign(CENTER);
    textSize(40);
    text("Fim de Jogo!", width / 2, 200);
    textSize(30);
    text("Pontuação: " + pontos, width / 2, 260);

    if (pontos >= 300) {
      fill(0, 255, 0);
      text("🌱 Parabéns! Sua fazenda é sustentável!", width / 2, 320);
    } else {
      fill(255, 200, 0);
      text("🌾 Continue investindo em sustentabilidade!", width / 2, 320);
    }

    textSize(20);
    fill(255);
    text("Pressione R para reiniciar", width / 2, 380);
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    // Reiniciar jogo
    pontos = 0;
    saudeSolo = 100;
    tempo = 60;
    estado = "jogando";
    plantas.forEach(p => p.cresceu = 0);
    gotas = [];
    insetos = [];
  }
}
