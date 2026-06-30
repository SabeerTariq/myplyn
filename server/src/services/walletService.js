import prisma from '../lib/prisma.js';

export async function getCommissionRate() {
  const setting = await prisma.platformSetting.findUnique({
    where: { key: 'commission_rate' },
  });
  return setting ? Number(setting.value) : 0.15;
}

export function calcFeeBreakdown(gross, feePct) {
  const grossNum = Number(gross);
  const feeAmount = Math.round(grossNum * feePct * 100) / 100;
  const net = Math.round((grossNum - feeAmount) * 100) / 100;
  return { gross: grossNum, feePct, feeAmount, net };
}

export async function getOrCreateWallet(ownerType, ownerId) {
  let wallet = await prisma.wallet.findUnique({
    where: { ownerType_ownerId: { ownerType, ownerId } },
  });
  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { ownerType, ownerId, balance: 0, heldBalance: 0 },
    });
  }
  return wallet;
}

export async function recordTransaction({
  walletOwnerType,
  walletOwnerId,
  type,
  gross,
  feePct,
  description,
  collaborationId,
  stripePaymentIntentId,
  metadata,
}) {
  const { feeAmount, net } = calcFeeBreakdown(gross, feePct);
  return prisma.transaction.create({
    data: {
      walletOwnerType,
      walletOwnerId,
      type,
      status: 'COMPLETED',
      gross,
      feePct,
      feeAmount,
      net,
      description,
      collaborationId,
      stripePaymentIntentId,
      metadata,
    },
  });
}

export async function fundWallet(ownerType, ownerId, amount, description, stripePaymentIntentId) {
  const wallet = await getOrCreateWallet(ownerType, ownerId);
  await prisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: { increment: amount } },
  });
  return recordTransaction({
    walletOwnerType: ownerType,
    walletOwnerId: ownerId,
    type: 'FUND',
    gross: amount,
    feePct: 0,
    description,
    stripePaymentIntentId,
  });
}

export async function holdFunds(ownerType, ownerId, amount, collaborationId) {
  const wallet = await getOrCreateWallet(ownerType, ownerId);
  if (Number(wallet.balance) < amount) {
    throw Object.assign(new Error('Insufficient wallet balance'), { status: 400 });
  }
  await prisma.wallet.update({
    where: { id: wallet.id },
    data: {
      balance: { decrement: amount },
      heldBalance: { increment: amount },
    },
  });
  return recordTransaction({
    walletOwnerType: ownerType,
    walletOwnerId: ownerId,
    type: 'HOLD',
    gross: amount,
    feePct: 0,
    description: 'Funds held for collaboration',
    collaborationId,
  });
}

export async function releasePayment(collaborationId, grossAmount) {
  const collaboration = await prisma.collaboration.findUnique({
    where: { id: collaborationId },
    include: { campaign: true },
  });
  if (!collaboration) throw Object.assign(new Error('Collaboration not found'), { status: 404 });

  const feePct = await getCommissionRate();
  const { feeAmount, net } = calcFeeBreakdown(grossAmount, feePct);
  const advertiserId = collaboration.campaign.advertiserId;

  const advWallet = await getOrCreateWallet('ADVERTISER', advertiserId);
  if (Number(advWallet.heldBalance) < grossAmount) {
    throw Object.assign(new Error('Insufficient held funds'), { status: 400 });
  }

  await prisma.wallet.update({
    where: { id: advWallet.id },
    data: {
      heldBalance: { decrement: grossAmount },
    },
  });

  await recordTransaction({
    walletOwnerType: 'ADVERTISER',
    walletOwnerId: advertiserId,
    type: 'RELEASE',
    gross: grossAmount,
    feePct: 0,
    description: 'Payment released to creator',
    collaborationId,
  });

  await recordTransaction({
    walletOwnerType: 'PLATFORM',
    walletOwnerId: 'platform',
    type: 'COMMISSION',
    gross: grossAmount,
    feePct,
    description: 'Platform commission',
    collaborationId,
  });

  const creWallet = await getOrCreateWallet('CREATOR', collaboration.creatorUserId);
  await prisma.wallet.update({
    where: { id: creWallet.id },
    data: { balance: { increment: net } },
  });

  await recordTransaction({
    walletOwnerType: 'CREATOR',
    walletOwnerId: collaboration.creatorUserId,
    type: 'RELEASE',
    gross: grossAmount,
    feePct,
    description: 'Earnings from collaboration',
    collaborationId,
  });

  await prisma.campaign.update({
    where: { id: collaboration.campaignId },
    data: { budgetSpent: { increment: grossAmount } },
  });

  return { gross: grossAmount, feeAmount, net, feePct };
}
