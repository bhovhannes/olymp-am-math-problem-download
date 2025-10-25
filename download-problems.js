#!/usr/bin/env node

import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { get } from 'node:https';

const CLASS = process.argv[2] || '6';
const MIN_YEAR = parseInt(process.argv[3]) || 2020;
const MAX_YEAR = parseInt(process.argv[4]) || 2025;

const BASE_DIR = `problems-${CLASS}`;
const SCHOOL_DIR = join(BASE_DIR, 'school');
const REGION_DIR = join(BASE_DIR, 'region');
const BASE_URL = 'https://olymp.am/sites/default/file/problems/Ar-Math-';

async function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const request = get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        request.destroy();
        downloadFile(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        request.destroy();
        reject(new Error(`Failed to download: ${url} (Status: ${response.statusCode})`));
        return;
      }

      const fileStream = createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fileStream.close();
        reject(err);
      });

      response.on('error', (err) => {
        fileStream.close();
        reject(err);
      });
    });

    request.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log(`Downloading problems for class ${CLASS}, years ${MIN_YEAR}-${MAX_YEAR}`);

  await mkdir(SCHOOL_DIR, { recursive: true });
  await mkdir(REGION_DIR, { recursive: true });

  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    const schoolUrl = `${BASE_URL}${CLASS}das-${year}.pdf`;
    const schoolFilename = `Ar-Math-${CLASS}das-${year}.pdf`;
    const schoolFilepath = join(SCHOOL_DIR, schoolFilename);

    try {
      console.log(`Downloading school: ${schoolUrl}`);
      await downloadFile(schoolUrl, schoolFilepath);
      console.log(`✓ Saved: school/${schoolFilename}`);
    } catch (error) {
      console.error(`✗ Failed to download school/${schoolFilename}: ${error.message}`);
    }

    const schoolSolutionUrl = `https://olymp.am/sites/default/file/problems/Solutions-Math-${CLASS}das-${year}-1.pdf`;
    const schoolSolutionFilename = `Solutions-Math-${CLASS}das-${year}-1.pdf`;
    const schoolSolutionFilepath = join(SCHOOL_DIR, schoolSolutionFilename);

    try {
      console.log(`Downloading school solution: ${schoolSolutionUrl}`);
      await downloadFile(schoolSolutionUrl, schoolSolutionFilepath);
      console.log(`✓ Saved: school/${schoolSolutionFilename}`);
    } catch (error) {
      console.error(`✗ Failed to download school/${schoolSolutionFilename}: ${error.message}`);
    }

    const regionUrl = `${BASE_URL}${CLASS}das-${year}-MP.pdf`;
    const regionFilename = `Ar-Math-${CLASS}das-${year}-MP.pdf`;
    const regionFilepath = join(REGION_DIR, regionFilename);

    try {
      console.log(`Downloading region: ${regionUrl}`);
      await downloadFile(regionUrl, regionFilepath);
      console.log(`✓ Saved: region/${regionFilename}`);
    } catch (error) {
      console.error(`✗ Failed to download region/${regionFilename}: ${error.message}`);
    }

    const regionSolutionUrl = `https://olymp.am/sites/default/file/problems/Solutions-Math-${CLASS}das-${year}MP-1.pdf`;
    const regionSolutionFilename = `Solutions-Math-${CLASS}das-${year}MP-1.pdf`;
    const regionSolutionFilepath = join(REGION_DIR, regionSolutionFilename);

    try {
      console.log(`Downloading region solution: ${regionSolutionUrl}`);
      await downloadFile(regionSolutionUrl, regionSolutionFilepath);
      console.log(`✓ Saved: region/${regionSolutionFilename}`);
    } catch (error) {
      console.error(`✗ Failed to download region/${regionSolutionFilename}: ${error.message}`);
    }
  }

  console.log('\nDownload complete!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

