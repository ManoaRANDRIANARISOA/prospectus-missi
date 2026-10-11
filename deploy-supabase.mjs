import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const bucketName = process.env.SUPABASE_BUCKET || 'prospectus';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erreur : SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.json': return 'application/json';
    default: return 'application/octet-stream';
  }
}

async function ensureBucket() {
  console.log(`📦 Vérification du bucket public '${bucketName}'...`);
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('Erreur lors du listing des buckets :', listError.message);
  }
  const exists = buckets && buckets.some(b => b.name === bucketName);
  if (!exists) {
    console.log(`Création du bucket public '${bucketName}'...`);
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10485760 // 10MB
    });
    if (createError) {
      console.warn('Note création bucket :', createError.message);
    } else {
      console.log('✅ Bucket créé avec succès !');
    }
  } else {
    console.log('✅ Bucket existant.');
  }
}

function getAllFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relPath = path.join(base, file).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.firebase' && !file.startsWith('.')) {
        results = results.concat(getAllFiles(fullPath, relPath));
      }
    } else {
      if (!file.startsWith('.') && file !== 'package.json' && file !== 'package-lock.json' && file !== 'deploy-supabase.mjs') {
        results.push({ fullPath, relPath });
      }
    }
  }
  return results;
}

async function uploadFiles() {
  await ensureBucket();
  const files = getAllFiles(__dirname);
  console.log(`🚀 Téléversement de ${files.length} fichiers vers Supabase Storage...`);

  let count = 0;
  for (const file of files) {
    const fileContent = fs.readFileSync(file.fullPath);
    const contentType = getMimeType(file.fullPath);

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(file.relPath, fileContent, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error(`❌ Échec pour ${file.relPath} : ${error.message}`);
    } else {
      count++;
      console.log(`✓ (${count}/${files.length}) ${file.relPath}`);
    }
  }

  console.log('\n🎉 Déploiement Supabase Storage terminé !');
  console.log(`🌐 URL Portail Public : ${supabaseUrl}/storage/v1/object/public/${bucketName}/index.html`);
}

uploadFiles().catch(err => {
  console.error('Erreur générale :', err);
});
