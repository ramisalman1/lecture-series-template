#!/usr/bin/env node
/**
 * Fix metadata blocks — add YouTube links back.
 */
const fs = require('fs');
const path = require('path');

const YOUTUBE_URLS = {
  '01': 'https://www.youtube.com/watch?v=gla27IuF5zM',
  '02': 'https://www.youtube.com/watch?v=SYJ5sattsmw',
  '03': 'https://www.youtube.com/watch?v=PdRHPQKZFEI',
  '04': 'https://www.youtube.com/watch?v=ze-c_90538g',
  '05': 'https://www.youtube.com/watch?v=mJOl5_iIGMM',
  '06': 'https://www.youtube.com/watch?v=RkWsQqfypd4',
  '07': 'https://www.youtube.com/watch?v=Vn_DetJBcW8',
  '08': 'https://www.youtube.com/watch?v=TgQPPepF2No',
  '09': 'https://www.youtube.com/watch?v=F0fHbpkn0iI',
  '10': 'https://www.youtube.com/watch?v=E6Gn0fAheyg',
  '11': 'https://www.youtube.com/watch?v=u8B0Wvkoo18',
  '12': 'https://www.youtube.com/watch?v=ZalpC-wAu1w',
  '13': 'https://www.youtube.com/watch?v=gmONSrQSRo0',
  '14': 'https://www.youtube.com/watch?v=2n0gsghTD0c',
  '15': 'https://www.youtube.com/watch?v=ERDrj0muecM',
  '16': 'https://www.youtube.com/watch?v=0txx1I6G8DA',
  '17': 'https://www.youtube.com/watch?v=TVWYJYAFyoA',
  '18': 'https://www.youtube.com/watch?v=7-9qBagz8jg',
  '19': 'https://www.youtube.com/watch?v=Z54Zqt-xd9Q',
  '20': 'https://www.youtube.com/watch?v=Hd-2pPZXIAc',
  '21': 'https://www.youtube.com/watch?v=CHAXkZMLJWA',
  '22': 'https://www.youtube.com/watch?v=N8ZqSuosSfQ',
  '23': 'https://www.youtube.com/watch?v=PQdLAVouqMY',
  '24': 'https://www.youtube.com/watch?v=Ih6eFj82hH8',
  '25': 'https://www.youtube.com/watch?v=xJrH29MOXok',
  '26': 'https://www.youtube.com/watch?v=W9YL7P5jUSk',
  '27': 'https://www.youtube.com/watch?v=WqUKR5MlFfU',
  '28': 'https://www.youtube.com/watch?v=dSccWqNd--s',
  '29': 'https://www.youtube.com/watch?v=6qdZ95TvrAM',
  '30': 'https://www.youtube.com/watch?v=Q9RNezp6x7Q',
  '31': 'https://www.youtube.com/watch?v=5Tjku71RUMo',
  '32': 'https://www.youtube.com/watch?v=yCG71YwkJZc',
  '33': 'https://www.youtube.com/watch?v=JNOUMJeIHt4',
  '34': 'https://www.youtube.com/watch?v=z9Lx3TGhPjQ',
  '35': 'https://www.youtube.com/watch?v=xNeuXcF_r04',
  '36': 'https://www.youtube.com/watch?v=K9ujMDviNUc',
  '37': 'https://www.youtube.com/watch?v=vhpvA7BoLC8',
  '38': 'https://www.youtube.com/watch?v=BBY8typy7F4',
  '39': 'https://www.youtube.com/watch?v=HT1Y4l3ScCY',
  '40': 'https://www.youtube.com/watch?v=NcgXdJz2e5g',
  '41': 'https://www.youtube.com/watch?v=gwy5eO4HuW0',
  '42': 'https://www.youtube.com/watch?v=4-HFuXAS7y8',
};

const contentDir = path.join(__dirname, 'content', 'lectures');

for (let i = 1; i <= 42; i++) {
  const num = String(i).padStart(2, '0');
  const filePath = path.join(contentDir, `lecture-${num}.md`);
  const url = YOUTUBE_URLS[num];

  if (!fs.existsSync(filePath) || !url) continue;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Add YouTube link to metadata block (after المحاضر line)
  content = content.replace(
    '> **المحاضر:** د. عبد الرحمن ذاكر الهاشمي',
    `> **المحاضر:** د. عبد الرحمن ذاكر الهاشمي\n> **المصدر:** [YouTube](${url})`
  );

  // Remove the H1 from content (it will be shown by the page template)
  content = content.replace(/^# .+\n/, '');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  ✅ lecture-${num}`);
}

console.log('\nDone!');
