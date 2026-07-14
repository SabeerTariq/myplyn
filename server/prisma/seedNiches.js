import prisma from '../src/lib/prisma.js';
import { NICHE_CATALOG } from '../src/data/niches.js';

async function seedNiches() {
  for (const niche of NICHE_CATALOG) {
    await prisma.niche.upsert({
      where: { slug: niche.slug },
      create: { name: niche.name, slug: niche.slug, active: true },
      update: { name: niche.name, active: true },
    });
  }
  console.log(`Synced ${NICHE_CATALOG.length} niches`);
}

seedNiches()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
