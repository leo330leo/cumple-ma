const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// =========================
// MÚSICA DE FONDO
// =========================
const bgMusic = document.getElementById("bg-music");

// Intentar reproducir de inmediato
bgMusic.play().catch(() => {
  console.log("Esperando interacción del usuario para reproducir la música...");
  // Cuando el usuario haga clic o toque, se iniciará
  const resumeMusic = () => {
    bgMusic.play();
    document.removeEventListener("click", resumeMusic);
    document.removeEventListener("touchstart", resumeMusic);
  };
  document.addEventListener("click", resumeMusic);
  document.addEventListener("touchstart", resumeMusic);
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const phrases = [
  "Feliz cumple ma",
  "Te amo",
  "Eres la mejor",
  "La más hermosa",
  "Hoy es tu día",
  "mi guia",
  "mi consejera"
];

// =========================
// CARGAR IMÁGENES CORRECTAMENTE
// =========================
const imagePaths = [
  "imagen/img1.png",
  "imagen/img2.png",
  "imagen/img3.png",
  "imagen/img4.png",
  "imagen/img5.png",
  "imagen/img6.png",
  "imagen/img7.png",
  "imagen/img8.png"
];

const loadedImages = [];
imagePaths.forEach((src) => {
  const img = new Image();
  img.src = src; // Aquí asignamos la ruta real
  loadedImages.push(img);
});

// =========================
// CLASE FRASES
// =========================
class Phrase {
  constructor(text) {
    this.text = text;
    this.reset();
  }

  reset() {
    this.x = (Math.random() - 0.5) * canvas.width * 1.2;
    this.y = (Math.random() - 0.5) * canvas.height * 1.2;
    this.z = Math.random() * canvas.width;
    this.speed = 15 + Math.random() * 6;
    this.size = 12;
  }

  update() {
    this.z -= this.speed;
    if (this.z < 1) {
      this.reset();
      this.z = canvas.width;
    }
  }

  draw() {
    const scale = canvas.width / this.z;
    const x2d = this.x * scale + canvas.width / 2;
    const y2d = this.y * scale + canvas.height / 2;
    const fontSize = this.size * scale;

    ctx.fillStyle = "#c91cc9ff";
    ctx.font = `${fontSize}px "Comic Sans MS"`;
    ctx.fillText(this.text, x2d, y2d);
  }
}

// =========================
// CLASE ESTRELLA
// =========================
class Star {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 1.5;
    this.alpha = Math.random();
  }

  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// =========================
// CLASE ESTRELLA FUGAZ
// =========================
class ShootingStar {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height * 0.5;
    this.length = 80 + Math.random() * 100;
    this.speed = 10 + Math.random() * 10;
    this.angle = Math.PI / 4;
    this.alpha = 1;
  }

  update() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
    this.alpha -= 0.01;

    if (this.alpha <= 0 || this.x > canvas.width || this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    ctx.strokeStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x - this.length * Math.cos(this.angle),
      this.y - this.length * Math.sin(this.angle)
    );
    ctx.stroke();
  }
}

// =========================
// CLASE IMAGEN FLOTANTE
// =========================
class FloatingImage {
  constructor(image) {
    this.image = image;
    this.size = 40;
    this.reset();
  }

  reset() {
    this.x = (Math.random() - 0.5) * canvas.width * 1.2;
    this.y = (Math.random() - 0.5) * canvas.height * 1.2;
    this.z = Math.random() * canvas.width;
    this.speed = 15 + Math.random() * 6;
  }

  update() {
    this.z -= this.speed;
    if (this.z < 1) {
      this.reset();
      this.z = canvas.width;
    }
  }

  draw() {
    const scale = canvas.width / this.z;
    const x2d = this.x * scale + canvas.width / 2;
    const y2d = this.y * scale + canvas.height / 2;
    const size = this.size * scale;

    ctx.drawImage(this.image, x2d, y2d, size, size);
  }
}

// =========================
// CREAR OBJETOS
// =========================
const stars = Array.from({ length: 200 }, () => new Star());
const floatingPhrases = Array.from({ length: 60 }, () =>
  new Phrase(phrases[Math.floor(Math.random() * phrases.length)])
);
const shootingStars = Array.from({ length: 5 }, () => new ShootingStar());
const floatingImages = Array.from({ length: 10 }, () =>
  new FloatingImage(loadedImages[Math.floor(Math.random() * loadedImages.length)])
);

// =========================
// ANIMACIÓN
// =========================
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => star.draw());
  shootingStars.forEach((shootingStar) => {
    shootingStar.update();
    shootingStar.draw();
  });
  floatingPhrases.forEach((phrase) => {
    phrase.update();
    phrase.draw();
  });
  floatingImages.forEach((img) => {
    img.update();
    img.draw();
  });

  requestAnimationFrame(animate);
}

animate();

// =========================
// AJUSTE AL REDIMENSIONAR
// =========================
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});