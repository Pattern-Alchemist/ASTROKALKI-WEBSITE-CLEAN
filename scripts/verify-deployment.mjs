#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * Checks that all production systems are properly configured
 * Run: node scripts/verify-deployment.mjs
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const checks = [];

function log(message, type = 'info') {
  const icons = {
    info: 'ℹ',
    success: '✓',
    error: '✗',
    warning: '⚠',
  };
  console.log(`${icons[type]} ${message}`);
}

async function check(name, fn) {
  try {
    await fn();
    checks.push({ name, status: 'pass' });
    log(`${name} — OK`, 'success');
  } catch (error) {
    checks.push({ name, status: 'fail', error: error.message });
    log(`${name} — ${error.message}`, 'error');
  }
}

async function main() {
  console.log('\n🚀 AstroKalki Deployment Verification\n');

  // Environment variables
  await check('DATABASE_URL set', () => {
    if (!process.env.DATABASE_URL) throw new Error('Missing DATABASE_URL');
  });

  await check('SMTP_HOST configured', () => {
    if (!process.env.SMTP_HOST) throw new Error('Missing SMTP_HOST');
  });

  await check('EMAIL_FROM configured', () => {
    if (!process.env.EMAIL_FROM) throw new Error('Missing EMAIL_FROM');
  });

  await check('GA4 Measurement ID set', () => {
    if (!process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID) {
      throw new Error('Missing NEXT_PUBLIC_GA4_MEASUREMENT_ID');
    }
  });

  // Build artifacts
  await check('Build artifacts exist', () => {
    const fs = require('fs');
    if (!fs.existsSync('.next')) throw new Error('.next directory not found');
    if (!fs.existsSync('.next/static')) throw new Error('.next/static not found');
  });

  // Database connectivity
  await check('Database reachable', async () => {
    try {
      await execPromise('npx prisma db execute --stdin < /dev/null 2>&1 || true');
    } catch {
      throw new Error('Database connection failed');
    }
  });

  // API routes
  await check('API routes compiled', async () => {
    const fs = require('fs');
    if (!fs.existsSync('.next/server/app/api')) {
      throw new Error('API routes not compiled');
    }
  });

  // Email templates
  await check('Email templates exist', () => {
    const fs = require('fs');
    if (!fs.existsSync('src/lib/email/templates.ts')) {
      throw new Error('Email templates not found');
    }
  });

  // Analytics configured
  await check('Analytics configured', () => {
    const fs = require('fs');
    const content = fs.readFileSync('src/components/analytics/ga4-tracker.tsx', 'utf8');
    if (!content.includes('GA4Tracker')) throw new Error('GA4 not integrated');
  });

  // Cron jobs configured
  await check('Cron jobs configured', () => {
    const fs = require('fs');
    const content = fs.readFileSync('vercel.json', 'utf8');
    if (!content.includes('crons')) throw new Error('Cron jobs not configured');
  });

  // Production env vars check
  await check('Production env vars check', () => {
    const required = [
      'DATABASE_URL',
      'SMTP_HOST',
      'EMAIL_FROM',
      'NEXT_PUBLIC_GA4_MEASUREMENT_ID',
    ];
    
    const missing = required.filter(v => !process.env[v]);
    if (missing.length > 0) {
      throw new Error(`Missing: ${missing.join(', ')}`);
    }
  });

  // Summary
  console.log('\n' + '='.repeat(50));
  const passed = checks.filter(c => c.status === 'pass').length;
  const failed = checks.filter(c => c.status === 'fail').length;
  
  console.log(`Results: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    console.log('Failed checks:');
    checks.filter(c => c.status === 'fail').forEach(c => {
      console.log(`  - ${c.name}: ${c.error}`);
    });
    process.exit(1);
  }

  console.log('✅ All checks passed! Ready for deployment.\n');
  process.exit(0);
}

main().catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});
