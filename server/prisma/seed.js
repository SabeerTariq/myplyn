import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { BRAND, brandEmail } from '../src/config/brand.js';

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${BRAND.name} database...`);

  await prisma.platformSetting.upsert({
    where: { key: 'commission_rate' },
    create: { key: 'commission_rate', value: 0.15 },
    update: { value: 0.15 },
  });

  const platforms = [
    { name: 'Instagram', slug: 'instagram', icon: 'instagram' },
    { name: 'TikTok', slug: 'tiktok', icon: 'tiktok' },
    { name: 'YouTube', slug: 'youtube', icon: 'youtube' },
    { name: 'Facebook', slug: 'facebook', icon: 'facebook' },
    { name: 'Twitter/X', slug: 'twitter', icon: 'twitter' },
  ];
  for (const p of platforms) {
    await prisma.platform.upsert({
      where: { slug: p.slug },
      create: p,
      update: p,
    });
  }

  const niches = [
    'Fashion', 'Beauty', 'Tech', 'Food', 'Travel', 'Fitness',
    'Gaming', 'Lifestyle', 'Finance', 'Education',
  ];
  for (const name of niches) {
    await prisma.niche.upsert({
      where: { slug: name.toLowerCase() },
      create: { name, slug: name.toLowerCase() },
      update: { name },
    });
  }

  const passwordHash = await bcrypt.hash('Password123!', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: brandEmail('admin') },
    create: {
      email: brandEmail('admin'),
      passwordHash,
      role: 'ADMIN',
      adminRole: 'SUPER',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      onboardingDone: true,
    },
    update: {},
  });

  await prisma.user.upsert({
    where: { email: brandEmail('moderator') },
    create: {
      email: brandEmail('moderator'),
      passwordHash,
      role: 'ADMIN',
      adminRole: 'MODERATOR',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      onboardingDone: true,
    },
    update: {},
  });

  await prisma.user.upsert({
    where: { email: brandEmail('finance') },
    create: {
      email: brandEmail('finance'),
      passwordHash,
      role: 'ADMIN',
      adminRole: 'FINANCE',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      onboardingDone: true,
    },
    update: {},
  });

  const advertiser1 = await prisma.user.upsert({
    where: { email: 'advertiser@brand.com' },
    create: {
      email: 'advertiser@brand.com',
      passwordHash,
      role: 'ADVERTISER',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      onboardingDone: true,
      advertiserProfile: {
        create: {
          companyName: 'Glow Beauty Co',
          website: 'https://glowbeauty.example.com',
          industry: 'Beauty',
          country: 'United States',
          city: 'New York',
          description: 'Premium skincare and beauty products.',
        },
      },
    },
    update: {},
    include: { advertiserProfile: true },
  });

  const advertiser2 = await prisma.user.upsert({
    where: { email: 'advertiser2@tech.com' },
    create: {
      email: 'advertiser2@tech.com',
      passwordHash,
      role: 'ADVERTISER',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      onboardingDone: true,
      advertiserProfile: {
        create: {
          companyName: 'TechNova',
          industry: 'Technology',
          country: 'United Kingdom',
          city: 'London',
        },
      },
    },
    update: {},
    include: { advertiserProfile: true },
  });

  const creator1 = await prisma.user.upsert({
    where: { email: 'creator@influencer.com' },
    create: {
      email: 'creator@influencer.com',
      passwordHash,
      role: 'CREATOR',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      onboardingDone: true,
      creatorProfile: {
        create: {
          country: 'United States',
          city: 'Los Angeles',
          bio: 'Fashion & lifestyle content creator.',
          connectStatus: 'CONNECTED',
        },
      },
    },
    update: {},
    include: { creatorProfile: true },
  });

  const creator2 = await prisma.user.upsert({
    where: { email: 'creator2@food.com' },
    create: {
      email: 'creator2@food.com',
      passwordHash,
      role: 'CREATOR',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      onboardingDone: true,
      creatorProfile: {
        create: {
          country: 'Canada',
          city: 'Toronto',
          bio: 'Food & recipe content.',
          connectStatus: 'PENDING',
        },
      },
    },
    update: {},
    include: { creatorProfile: true },
  });

  const creator3 = await prisma.user.upsert({
    where: { email: 'creator3@gaming.com' },
    create: {
      email: 'creator3@gaming.com',
      passwordHash,
      role: 'CREATOR',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      onboardingDone: true,
      creatorProfile: {
        create: {
          country: 'Germany',
          city: 'Berlin',
          bio: 'Gaming streams and reviews.',
          connectStatus: 'NOT_STARTED',
        },
      },
    },
    update: {},
    include: { creatorProfile: true },
  });

  const instagram = await prisma.platform.findUnique({ where: { slug: 'instagram' } });
  const tiktok = await prisma.platform.findUnique({ where: { slug: 'tiktok' } });
  const fashionNiche = await prisma.niche.findUnique({ where: { slug: 'fashion' } });
  const foodNiche = await prisma.niche.findUnique({ where: { slug: 'food' } });
  const gamingNiche = await prisma.niche.findUnique({ where: { slug: 'gaming' } });

  const page1 = await prisma.creatorPage.upsert({
    where: { id: '00000000-0000-4000-8000-000000000001' },
    create: {
      id: '00000000-0000-4000-8000-000000000001',
      creatorId: creator1.creatorProfile.id,
      platformId: instagram.id,
      nicheId: fashionNiche.id,
      name: '@stylebyjane',
      url: 'https://instagram.com/stylebyjane',
      followers: 85000,
      avgReach: 42000,
      engagement: 4.2,
      country: 'United States',
      city: 'Los Angeles',
      verificationStatus: 'VERIFIED',
      adminVerifiedAt: new Date(),
    },
    update: {},
  });

  const page2 = await prisma.creatorPage.upsert({
    where: { id: '00000000-0000-4000-8000-000000000002' },
    create: {
      id: '00000000-0000-4000-8000-000000000002',
      creatorId: creator2.creatorProfile.id,
      platformId: tiktok.id,
      nicheId: foodNiche.id,
      name: '@chefmarco',
      url: 'https://tiktok.com/@chefmarco',
      followers: 120000,
      avgReach: 65000,
      engagement: 5.8,
      country: 'Canada',
      city: 'Toronto',
      verificationStatus: 'VERIFIED',
      adminVerifiedAt: new Date(),
    },
    update: {},
  });

  await prisma.creatorPage.upsert({
    where: { id: '00000000-0000-4000-8000-000000000003' },
    create: {
      id: '00000000-0000-4000-8000-000000000003',
      creatorId: creator3.creatorProfile.id,
      platformId: tiktok.id,
      nicheId: gamingNiche.id,
      name: '@gamezone',
      url: 'https://tiktok.com/@gamezone',
      followers: 45000,
      avgReach: 22000,
      verificationStatus: 'PENDING',
    },
    update: {},
  });

  await prisma.wallet.upsert({
    where: { ownerType_ownerId: { ownerType: 'ADVERTISER', ownerId: advertiser1.advertiserProfile.id } },
    create: { ownerType: 'ADVERTISER', ownerId: advertiser1.advertiserProfile.id, balance: 10000, heldBalance: 2500 },
    update: { balance: 10000, heldBalance: 2500 },
  });

  await prisma.wallet.upsert({
    where: { ownerType_ownerId: { ownerType: 'ADVERTISER', ownerId: advertiser2.advertiserProfile.id } },
    create: { ownerType: 'ADVERTISER', ownerId: advertiser2.advertiserProfile.id, balance: 5000, heldBalance: 0 },
    update: {},
  });

  await prisma.wallet.upsert({
    where: { ownerType_ownerId: { ownerType: 'CREATOR', ownerId: creator1.id } },
    create: { ownerType: 'CREATOR', ownerId: creator1.id, balance: 850, heldBalance: 0 },
    update: { balance: 850 },
  });

  await prisma.wallet.upsert({
    where: { ownerType_ownerId: { ownerType: 'CREATOR', ownerId: creator2.id } },
    create: { ownerType: 'CREATOR', ownerId: creator2.id, balance: 0, heldBalance: 0 },
    update: {},
  });

  const campaign1 = await prisma.campaign.upsert({
    where: { id: '00000000-0000-4000-8000-000000000101' },
    create: {
      id: '00000000-0000-4000-8000-000000000101',
      advertiserId: advertiser1.advertiserProfile.id,
      name: 'Summer Skincare Launch',
      description: 'Promote our new vitamin C serum line.',
      requirements: '1 Instagram post + 2 stories with product visible.',
      status: 'LIVE',
      budgetTotal: 5000,
      budgetHeld: 2500,
      budgetSpent: 850,
      perPlacement: 500,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-08-31'),
      wizardStep: 5,
    },
    update: {},
  });

  await prisma.campaign.upsert({
    where: { id: '00000000-0000-4000-8000-000000000102' },
    create: {
      id: '00000000-0000-4000-8000-000000000102',
      advertiserId: advertiser1.advertiserProfile.id,
      name: 'Holiday Gift Guide',
      description: 'Holiday season gift guide campaign.',
      status: 'DRAFT',
      budgetTotal: 3000,
      wizardStep: 2,
    },
    update: {},
  });

  await prisma.campaign.upsert({
    where: { id: '00000000-0000-4000-8000-000000000103' },
    create: {
      id: '00000000-0000-4000-8000-000000000103',
      advertiserId: advertiser2.advertiserProfile.id,
      name: 'Tech Gadget Review',
      description: 'Review our latest wireless earbuds.',
      status: 'LIVE',
      budgetTotal: 2000,
      budgetHeld: 1000,
      perPlacement: 400,
      startDate: new Date('2026-05-15'),
      endDate: new Date('2026-07-15'),
      wizardStep: 5,
    },
    update: {},
  });

  await prisma.campaignNiche.upsert({
    where: { campaignId_nicheId: { campaignId: campaign1.id, nicheId: fashionNiche.id } },
    create: { campaignId: campaign1.id, nicheId: fashionNiche.id },
    update: {},
  });

  await prisma.campaignPlatform.upsert({
    where: { campaignId_platformId: { campaignId: campaign1.id, platformId: instagram.id } },
    create: { campaignId: campaign1.id, platformId: instagram.id },
    update: {},
  });

  const collab1 = await prisma.collaboration.upsert({
    where: { id: '00000000-0000-4000-8000-000000000201' },
    create: {
      id: '00000000-0000-4000-8000-000000000201',
      campaignId: campaign1.id,
      creatorUserId: creator1.id,
      pageId: page1.id,
      source: 'APPLICATION',
      status: 'PROOF_SUBMITTED',
      agreedAmount: 500,
    },
    update: {},
  });

  await prisma.collaborationEvent.createMany({
    data: [
      { collaborationId: collab1.id, toStatus: 'APPLICATION_PENDING', notes: 'Application submitted' },
      { collaborationId: collab1.id, fromStatus: 'APPLICATION_PENDING', toStatus: 'ACCEPTED', notes: 'Approved' },
      { collaborationId: collab1.id, fromStatus: 'ACCEPTED', toStatus: 'CONTENT_PROVIDED', notes: 'Content sent' },
      { collaborationId: collab1.id, fromStatus: 'CONTENT_PROVIDED', toStatus: 'PUBLISHED', notes: 'Published' },
      { collaborationId: collab1.id, fromStatus: 'PUBLISHED', toStatus: 'PROOF_SUBMITTED', notes: 'Proof submitted' },
    ],
    skipDuplicates: true,
  });

  await prisma.collaborationProof.upsert({
    where: { id: '00000000-0000-4000-8000-000000000301' },
    create: {
      id: '00000000-0000-4000-8000-000000000301',
      collaborationId: collab1.id,
      proofUrl: 'https://instagram.com/p/example',
      notes: 'Posted as agreed',
    },
    update: {},
  });

  await prisma.messageThread.upsert({
    where: { collaborationId: collab1.id },
    create: { collaborationId: collab1.id },
    update: {},
  });

  const thread = await prisma.messageThread.findUnique({ where: { collaborationId: collab1.id } });
  if (thread) {
    await prisma.message.createMany({
      data: [
        { threadId: thread.id, senderId: advertiser1.id, body: 'Looking forward to working together!' },
        { threadId: thread.id, senderId: creator1.id, body: 'Thanks! I will post by Friday.' },
      ],
      skipDuplicates: true,
    });
  }

  await prisma.campaignApplication.createMany({
    data: [
      {
        campaignId: campaign1.id,
        creatorUserId: creator2.id,
        pageId: page2.id,
        message: 'I would love to feature your products!',
        proposedPrice: 600,
        status: 'PENDING',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.collaborationInvitation.createMany({
    data: [
      {
        campaignId: campaign1.id,
        creatorUserId: creator2.id,
        pageId: page2.id,
        message: 'We think you would be a great fit!',
        offeredAmount: 550,
        status: 'PENDING',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.notification.createMany({
    data: [
      { userId: advertiser1.id, type: 'application', title: 'New application', body: 'Creator applied to Summer Skincare Launch' },
      { userId: creator1.id, type: 'collaboration', title: 'Proof submitted', body: 'Awaiting verification' },
      { userId: creator2.id, type: 'invitation', title: 'New invitation', body: 'You have a collaboration request' },
    ],
    skipDuplicates: true,
  });

  console.log('Seed complete!');
  console.log('\nDemo accounts (password: Password123!):');
  console.log(`  Admin:      ${brandEmail('admin')}`);
  console.log(`  Moderator:  ${brandEmail('moderator')}`);
  console.log(`  Finance:    ${brandEmail('finance')}`);
  console.log('  Advertiser: advertiser@brand.com');
  console.log('  Creator:    creator@influencer.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
