import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const serviceAccount = JSON.parse(
  readFileSync(resolve(process.cwd(), 'service-account.json'), 'utf8')
);

initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();
const db = getFirestore();

async function inspect() {
  console.log('\n--- 1. Firebase Authentication Users ---');
  try {
    const listUsersResult = await auth.listUsers(10);
    if (listUsersResult.users.length === 0) {
      console.log('No users found in Firebase Authentication.');
    } else {
      console.log(`Found ${listUsersResult.users.length} user(s):`);
      listUsersResult.users.forEach((u) => {
        console.log(`- UID: ${u.uid} | Email: ${u.email} | Claims: ${JSON.stringify(u.customClaims || {})}`);
      });
    }
  } catch (err) {
    console.error('Error fetching users:', err.message);
  }

  console.log('\n--- 2. Firestore Collections & Schema ---');
  try {
    const collections = await db.listCollections();
    console.log(`Top-level collections found: ${collections.map(c => c.id).join(', ') || 'None'}`);

    for (const col of collections) {
      console.log(`\nCollection: [${col.id}]`);
      const snapshot = await col.limit(2).get();
      if (snapshot.empty) {
        console.log('  (Collection is empty)');
      } else {
        snapshot.forEach((doc) => {
          console.log(`  Document ID: ${doc.id}`);
          console.log('  Fields:', JSON.stringify(doc.data(), null, 2));
        });
      }
    }
  } catch (err) {
    console.error('Error fetching collections:', err.message);
  }
}

inspect();
