import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const serviceAccount = JSON.parse(
  readFileSync(resolve(process.cwd(), 'service-account.json'), 'utf8')
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function inspectSubcollections() {
  const householdsSnap = await db.collection('households').get();
  console.log(`Checking subcollections for ${householdsSnap.size} households...`);
  
  for (const doc of householdsSnap.docs) {
    const subcollections = await doc.ref.listCollections();
    console.log(`Household [${doc.id} - "${doc.data().name}"]: subcollections -> ${subcollections.map(s => s.id).join(', ') || 'None'}`);
    for (const sub of subcollections) {
      const subSnap = await sub.limit(2).get();
      subSnap.forEach(d => {
        console.log(`  SubDoc [${sub.id}/${d.id}]:`, JSON.stringify(d.data(), null, 2));
      });
    }
  }

  // Also check collectionGroup('expenses')
  const expensesGroup = await db.collectionGroup('expenses').limit(2).get();
  console.log(`\nCollection group 'expenses' total found: ${expensesGroup.size}`);
  expensesGroup.forEach(d => {
    console.log(`Expense Doc [Path: ${d.ref.path}]:`, JSON.stringify(d.data(), null, 2));
  });
}

inspectSubcollections();
