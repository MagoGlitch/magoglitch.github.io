const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/MARCOS/.gemini/antigravity/sharp_tool/node_modules/sharp');

async function runOptimization() {
  console.log('--- INICIANDO OTIMIZAÇÃO INTELIGENTE DE IMAGENS ---');
  
  // 1. Backup projects-data.js
  if (!fs.existsSync('projects-data.original.js')) {
    fs.copyFileSync('projects-data.js', 'projects-data.original.js');
    console.log('✓ Backup criado: projects-data.original.js');
  }

  // 2. Read projects-data.js
  const rawData = fs.readFileSync('projects-data.js', 'utf8');
  const jsonText = rawData.replace('window.PORTFOLIO_PROJECTS = ', '').replace(/;\s*$/, '');
  const projects = JSON.parse(jsonText);

  // 3. Collect all unique images
  const imageMap = new Map(); // originalPath -> optimizedPath

  projects.forEach(p => {
    if (p.cover) imageMap.set(p.cover, null);
    if (p.presentationImage) imageMap.set(p.presentationImage, null);
    if (Array.isArray(p.slides)) {
      p.slides.forEach(s => imageMap.set(s, null));
    }
  });

  console.log(`Total de imagens únicas para processar: ${imageMap.size}`);

  let totalBeforeBytes = 0;
  let totalAfterBytes = 0;
  let processedCount = 0;
  let skippedCount = 0;

  for (const [origPath] of imageMap.entries()) {
    if (!fs.existsSync(origPath)) {
      console.warn(`Arquivo não encontrado: ${origPath}`);
      skippedCount++;
      continue;
    }

    const beforeStat = fs.statSync(origPath);
    totalBeforeBytes += beforeStat.size;

    const ext = path.extname(origPath).toLowerCase();
    const dir = path.dirname(origPath);
    const baseName = path.basename(origPath, ext);

    const isIdVisual = origPath.includes('Identidade Visual');

    try {
      const metadata = await sharp(origPath, { limitInputPixels: false }).metadata();

      let targetExt = '.webp';
      let pipeline = sharp(origPath, { limitInputPixels: false });

      if (isIdVisual) {
        // High-res visual identity board
        if (metadata.width > 1600) {
          pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true });
        }
        // WebP has a hard 16383px height limit
        if (metadata.height > 16383 || metadata.width > 16383) {
          targetExt = '.optimized.jpg';
          pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true, progressive: true });
        } else {
          pipeline = pipeline.webp({ quality: 85, effort: 4 });
        }
      } else {
        // Feed post or carousel slide (target retina 1440px max width)
        if (metadata.width > 1440) {
          pipeline = pipeline.resize({ width: 1440, withoutEnlargement: true });
        }
        pipeline = pipeline.webp({ quality: 85, effort: 4 });
      }

      const outPath = path.join(dir, `${baseName}${targetExt}`);
      await pipeline.toFile(outPath);

      const afterStat = fs.statSync(outPath);
      totalAfterBytes += afterStat.size;
      imageMap.set(origPath, outPath.replace(/\\/g, '/'));

      processedCount++;
      if (processedCount % 10 === 0 || processedCount === imageMap.size) {
        console.log(`Progresso: ${processedCount}/${imageMap.size} imagens otimizadas...`);
      }
    } catch (err) {
      console.error(`Erro ao otimizar ${origPath}:`, err.message);
      totalAfterBytes += beforeStat.size;
      imageMap.set(origPath, origPath); // keep original on error
    }
  }

  // 4. Update projects data with optimized paths
  projects.forEach(p => {
    if (p.cover && imageMap.get(p.cover)) {
      p.cover = imageMap.get(p.cover);
    }
    if (p.presentationImage && imageMap.get(p.presentationImage)) {
      p.presentationImage = imageMap.get(p.presentationImage);
    }
    if (Array.isArray(p.slides)) {
      p.slides = p.slides.map(s => imageMap.get(s) || s);
    }
  });

  const updatedContent = `window.PORTFOLIO_PROJECTS = ${JSON.stringify(projects, null, 2)};\n`;
  fs.writeFileSync('projects-data.js', updatedContent, 'utf8');

  const beforeMB = (totalBeforeBytes / (1024 * 1024)).toFixed(2);
  const afterMB = (totalAfterBytes / (1024 * 1024)).toFixed(2);
  const savedMB = ((totalBeforeBytes - totalAfterBytes) / (1024 * 1024)).toFixed(2);
  const percent = ((1 - totalAfterBytes / totalBeforeBytes) * 100).toFixed(1);

  console.log('\n==========================================');
  console.log(`✓ Otimização concluída com sucesso!`);
  console.log(`  Arquivos processados: ${processedCount}`);
  console.log(`  Peso original:        ${beforeMB} MB`);
  console.log(`  Peso otimizado:       ${afterMB} MB`);
  console.log(`  Economia de dados:    ${savedMB} MB (-${percent}%)`);
  console.log('==========================================');
}

runOptimization().catch(console.error);
