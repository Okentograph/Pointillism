'use strict';

/**
 * コンピュータ基礎II 課題1
 * 「コンピュータ・プログラムを使う面白さを意識する」
 *
 * 必須4点:
 * 1. 点・線・面のいずれかを描画する
 * 2. 色を数値で指定する
 * 3. 繰り返し と 条件分岐 の両方を利用する
 * 4. ランダム（乱数）を利用する
 */

let img;

function preload() {
  img = loadImage('data/pic.png');
}

function setup() {
  createCanvas(600, 800);
  prepareImage(img);

  // 【要件2】色を数値で指定（HSB: 色相0-360, 彩度・明度・透明度0-100）
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  select('#imageInput').changed(onImageSelected);
}

function prepareImage(source) {
  // 【条件分岐】縦長 / 横長でリサイズの仕方を変える（最大辺128px）
  if (source.width >= source.height) {
    source.resize(128, 0);
  } else {
    source.resize(0, 128);
  }
  img = source;

  // 【条件分岐】キャンバスを画像の縦横比に合わせる
  let aspect = img.width / img.height;
  if (aspect >= 1) {
    resizeCanvas(800, 800 / aspect);
  } else {
    resizeCanvas(800 * aspect, 800);
  }
}

function onImageSelected() {
  let file = select('#imageInput').elt.files[0];
  // 【条件分岐】画像ファイル以外は無視
  if (!file || !file.type.startsWith('image/')) {
    return;
  }

  let reader = new FileReader();
  reader.onload = function (e) {
    loadImage(e.target.result, prepareImage);
  };
  reader.readAsDataURL(file);
}

// RGB → HSB（数値の色として扱うため）
function rgbToHsb(r, g, b) {
  colorMode(RGB, 255);
  let c = color(r, g, b);
  let h = hue(c);
  let s = saturation(c);
  let bri = brightness(c);
  colorMode(HSB, 360, 100, 100, 100);
  return { h: h, s: s, b: bri };
}

// マウスY → 明度の効果量（白→中間→黒）
function brightnessFromMouse() {
  let t = constrain(mouseY / height, 0, 1);

  // 【条件分岐】マウス位置の区間ごとにマップを変える
  if (t <= 0.2) {
    return map(t, 0, 0.2, 1, 40); // 白 → 中間
  } else if (t <= 0.8) {
    return map(t, 0.2, 0.8, 40, 60); // 中間
  } else {
    return map(t, 0.8, 1, 60, 100); // 中間 → 黒
  }
}

function mixBrightness(originalB, amount) {
  // 【条件分岐】効果量に応じて白 / 元色 / 黒 を切り替える
  if (amount <= 40) {
    return map(amount, 1, 40, 100, originalB);
  } else if (amount <= 60) {
    return originalB;
  } else {
    return map(amount, 60, 100, originalB, 0);
  }
}

function draw() {
  if (!img) {
    return;
  }

  background(0, 0, 100);
  img.loadPixels();

  let tileW = width / img.width;
  let tileH = height / img.height;
  let cell = max(tileW, tileH);

  // マウスX: 彩度（左=白黒, 右=元の色）
  let satFactor = map(mouseX, 0, width, 0, 1, true);
  let amount = brightnessFromMouse();

  // 【要件3: 繰り返し】すべてのピクセルを走査して描画
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let i = 4 * (y * img.width + x);
      let c = rgbToHsb(img.pixels[i], img.pixels[i + 1], img.pixels[i + 2]);

      let finalS = c.s * satFactor;
      let finalB = constrain(mixBrightness(c.b, amount), 0, 100);

      // 明度で点の大きさを変える（明るい=小, 暗い=大。最小サイズは残す）
      let minSize = cell * 0.25;
      let maxSize = cell * 1.5;
      let dotSize = map(finalB, 100, 0, minSize, maxSize);

      // 【要件4: ランダム】位置を少しずらして点描らしい揺らぎを出す
      let px = tileW * x + tileW / 2 + random(-1, 1);
      let py = tileH * y + tileH / 2 + random(-1, 1);

      // 【要件2】色を数値（H, S, B）で指定
      fill(c.h, finalS, finalB);

      // 【要件3: 条件分岐】＋【要件1: 点 / 面】
      // 明るい部分は「点」（円）、暗い部分は「面」（四角）で描き分ける
      if (finalB >= 45) {
        ellipse(px, py, dotSize, dotSize); // 点
      } else {
        rectMode(CENTER);
        rect(px, py, dotSize, dotSize); // 面
      }
    }
  }
}

function keyReleased() {
  // 【条件分岐】Sキーのときだけ保存
  if (key === 's' || key === 'S') {
    saveCanvas('pointillism_art', 'png');
  }
}
