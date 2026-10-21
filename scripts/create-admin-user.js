import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
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

async function createAdmin() {
  const email = 'rahul77478@gmail.com';
  const password = 'RahulKP@123';
  const displayName = 'Rahul (Admin)';

  try {
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log(`User ${email} already exists (UID: ${user.uid}). Updating password and claims...`);
      await auth.updateUser(user.uid, {
        password,
        displayName,
      });
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        console.log(`Creating new user ${email}...`);
        user = await auth.createUser({
          email,
          password,
          displayName,
          emailVerified: true,
        });
        console.log(`Created user with UID: ${user.uid}`);
      } else {
        throw err;
      }
    }

    // Set custom claim { admin: true }
    await auth.setCustomUserClaims(user.uid, {
      admin: true,
    });
    console.log(`✓ Set custom claim { admin: true } for UID: ${user.uid}`);

    // Create / update Firestore profile in users collection
    await db.collection('users').doc(user.uid).set(
      {
        email,
        name: displayName,
        photoUrl: null,
        createdAt: Timestamp.now(),
        isAdmin: true,
      },
      { merge: true }
    );
    console.log(`✓ Updated Firestore document users/${user.uid}`);

    console.log('\n\x1b[32m%s\x1b[0m', '=== Administrator Account Setup Successful ===');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Admin Claim: { admin: true }`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin();
