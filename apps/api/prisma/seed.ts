import { PrismaClient, KycLevel, PolicyStatus, PaymentLinkStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@flowlink.com' },
    update: {},
    create: {
      email: 'admin@flowlink.com',
      wallet: '0x1111111111111111111111111111111111111111',
      kycLevel: KycLevel.FULL,
    },
  });

  // Create sample policy
  const policy = await prisma.policy.upsert({
    where: { id: 'policy-1' },
    update: {},
    create: {
      id: 'policy-1',
      name: 'APAC-Standard',
      rules: {
        geofencing: ['SG', 'HK', 'MY', 'TH'],
        sanctionsCheck: true,
        perTxLimit: 10000,
        kycLevel: 'LOW',
        allowlistOnly: false,
      },
      status: PolicyStatus.ACTIVE,
      createdByUserId: adminUser.id,
    },
  });

  // Create sample vault
  const vault = await prisma.vault.upsert({
    where: { id: 'vault-1' },
    update: {},
    create: {
      id: 'vault-1',
      ownerUserId: adminUser.id,
      policyId: policy.id,
      chainId: 137, // Polygon
    },
  });

  // Create sample payment link
  const paymentLink = await prisma.paymentLink.upsert({
    where: { id: 'link-1' },
    update: {},
    create: {
      id: 'link-1',
      code: 'DEMO1234',
      creatorUserId: adminUser.id,
      sourceToken: 'USDC',
      destStable: 'SGD-STABLE',
      amountMin: 100,
      amountMax: 5000,
      requiresKyc: true,
      policyId: policy.id,
      status: PaymentLinkStatus.ACTIVE,
      qrSvg: '<svg>QR Code for DEMO1234</svg>',
    },
  });

  // Create sample allowlist entries
  await prisma.allowlist.createMany({
    data: [
      {
        vaultId: vault.id,
        wallet: '0x2222222222222222222222222222222222222222',
        note: 'VIP Customer',
      },
      {
        vaultId: vault.id,
        wallet: '0x3333333333333333333333333333333333333333',
        note: 'Partner Wallet',
      },
    ],
    skipDuplicates: true,
  });

  // Create sample risk profiles
  await prisma.riskProfile.createMany({
    data: [
      {
        wallet: '0x2222222222222222222222222222222222222222',
        score: 85,
        reasons: ['Has POAP attestation', 'On allowlist', 'Low risk profile'],
      },
      {
        wallet: '0x3333333333333333333333333333333333333333',
        score: 75,
        reasons: ['Has low KYC attestation', 'On allowlist'],
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeded successfully!');
  console.log('📋 Created:');
  console.log(`  - Admin user: ${adminUser.email}`);
  console.log(`  - Policy: ${policy.name}`);
  console.log(`  - Vault: ${vault.id}`);
  console.log(`  - Payment Link: ${paymentLink.code}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

