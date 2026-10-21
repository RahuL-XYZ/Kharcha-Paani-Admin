/**
 * One-time administrative script to grant `admin: true` custom claim to a designated user.
 * 
 * Usage:
 * 1. Download your service account private key from:
 *    Firebase Console -> Project Settings -> Service accounts -> Generate new private key
 * 2. Save it as `service-account.json` in this project root (it is git-ignored).
 * 3. Run:
 *    node scripts/set-admin-claim.js <admin-email>
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const serviceAccountPath = resolve(process.cwd(), 'service-account.json');

if (!existsSync(serviceAccountPath)) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: service-account.json not found in project root.');
  console.log('\nPlease download your service account key from:');
  console.log('Firebase Console > Project Settings > Service accounts > Generate new private key');
  console.log('Save it as "service-account.json" in this directory.\n');
  process.exit(1);
}

const targetIdentifier = process.argv[2];

if (!targetIdentifier) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Missing target email or UID.');
  console.log('Usage: node scripts/set-admin-claim.js <admin-email-or-uid>');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();

async function setAdminClaim() {
  try {
    let user;
    if (targetIdentifier.includes('@')) {
      user = await auth.getUserByEmail(targetIdentifier);
    } else {
      user = await auth.getUser(targetIdentifier);
    }

    console.log(`Found user: ${user.email} (UID: ${user.uid})`);
    
    // Set custom claim { admin: true }
    await auth.setCustomUserClaims(user.uid, {
      ...user.customClaims,
      admin: true,
    });

    console.log('\x1b[32m%s\x1b[0m', `✓ Successfully assigned admin claim { admin: true } to ${user.email}`);
    console.log('The user should now sign out and sign in again on the admin panel to refresh their token.');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Failed to assign admin claim:', error.message);
  }
}

setAdminClaim();
