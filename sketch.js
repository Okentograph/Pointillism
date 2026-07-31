'use strict';

let img;

function preload() {
  img = loadImage('data/pic.png'); // 最初に表示する画像
}

function setup() {
  createCanvas(600, 800);
  prepareImage(img);

  // 色相0〜360 / 彩度・明度・透明度 0〜100
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  // ファイル選択したら画像を読み込む
  select('#imageInput').changed(onImageSelected);
}

// 画像を整え、キャンバスサイズを合わせる
function prepareImage(source) {
  // 最大辺を128pxにする（縦横比はキープ）
  if (source.width >= source.height) {
    source.resize(128, 0);
  } else {
    source.resize(0, 128);
  }
  img = source;

  // キャンバスを画像の縦横比に合わせる（最大800px）
  let aspect = img.width / img.height;
  if (aspect >= 1) {
    resizeCanvas(800, 800 / aspect);
  } else {
    resizeCanvas(800 * aspect, 800);
  }
}

// ユーザーが選んだ画像を読み込む
function onImageSelected() {
  let file = select('#imageInput').elt.files[0];
  if (!file || !file.type.startsWith('image/')) return;

  let reader = new FileReader();
  reader.onload = function (e) {
    loadImage(e.target.result, prepareImage);
  };
  reader.readAsDataURL(file);
}

// RGBのピクセル色から H（色相）S（彩度）B（明度）を取り出す
function rgbToHsb(r, g, b) {
  colorMode(RGB, 255);
  let c = color(r, g, b);
  let h = hue(c);
  let s = saturation(c);
  let bri = brightness(c);
  colorMode(HSB, 360, 100, 100, 100);
  return { h: h, s: s, b: bri };
}

// マウスY位置 → 明度の効果量（1〜100）
// 上のほうですぐ中間色へ近づき、下のほうで黒へ向かう
function brightnessFromMouse() {
  let t = constrain(mouseY / height, 0, 1); // 0=上, 1=下

  if (t <= 0.2) return map(t, 0, 0.2, 1, 40);   // 白 → 中間
  if (t <= 0.8) return map(t, 0.2, 0.8, 40, 60); // 中間あたり
  return map(t, 0.8, 1, 60, 100);                 // 中間 → 黒
}

// 効果量に応じて、白 / 元の明度 / 黒 のあいだで明度を決める
function mixBrightness(originalB, amount) {
  if (amount <= 40) return map(amount, 1, 40, 100, originalB); // 白 → 元
  if (amount <= 60) return originalB;                           // 元のまま
  return map(amount, 60, 100, originalB, 0);                    // 元 → 黒
}

function draw() {
  if (!img) return;

  background(0, 0, 100); // 白い背景
  img.loadPixels();

  let tileW = width / img.width;
  let tileH = height / img.height;
  let cell = max(tileW, tileH);

  // マウスX: 彩度（左=0 白黒, 右=1 元の色）
  let satFactor = map(mouseX, 0, width, 0, 1, true);
  let amount = brightnessFromMouse();

  // ピクセルを1つずつ見て、点を描く
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let i = 4 * (y * img.width + x);
      let c = rgbToHsb(img.pixels[i], img.pixels[i + 1], img.pixels[i + 2]);

      let finalS = c.s * satFactor;
      let finalB = constrain(mixBrightness(c.b, amount), 0, 100);

      // 明るいほど小さく、暗いほど大きく（ただし最小サイズは残す）
      let dotSize = map(finalB, 100, 0, cell * 0.25, cell * 1.5);

      // 少しずらして手描き感を出す
      let px = tileW * x + tileW / 2 + random(-1, 1);
      let py = tileH * y + tileH / 2 + random(-1, 1);

      fill(c.h, finalS, finalB);
      ellipse(px, py, dotSize, dotSize);
    }
  }
}

function keyReleased() {
  if (key === 's' || key === 'S') {
    saveCanvas('pointillism_art', 'png');
  }
}
