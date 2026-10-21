import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { fetchGroupById } from '../groups/groupsService';

/**
 * Fetch all expenses across all households using collectionGroup('expenses').
 */
export async function fetchAllExpenses({ pageSize = 20, cursor = null } = {}) {
  try {
    let snapshot;
    try {
      let q = query(
        collectionGroup(db, 'expenses'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (cursor) {
        q = query(
          collectionGroup(db, 'expenses'),
          orderBy('createdAt', 'desc'),
          startAfter(cursor),
          limit(pageSize)
        );
      }
      snapshot = await getDocs(q);
    } catch (indexError) {
      console.warn('collectionGroup orderBy index pending, falling back to direct query:', indexError.message);
      // Fallback: fetch without server-side ordering so it works immediately without manual index
      const simpleQ = query(collectionGroup(db, 'expenses'), limit(50));
      snapshot = await getDocs(simpleQ);
    }

    const expenses = [];

    // Group document lookups cache to avoid redundant reads
    const householdCache = {};

    for (const d of snapshot.docs) {
      const data = d.data();
      const householdId = d.ref.parent.parent ? d.ref.parent.parent.id : null;
      let groupName = 'Unknown Household';

      if (householdId) {
        if (!householdCache[householdId]) {
          const hh = await fetchGroupById(householdId).catch(() => null);
          householdCache[householdId] = hh ? hh.name : householdId;
        }
        groupName = householdCache[householdId];
      }

      expenses.push({
        id: d.id,
        householdId,
        groupName,
        ...data,
        _rawDoc: d,
      });
    }

    expenses.sort((a, b) => {
      const timeA = a.createdAt?.seconds || a.date?.seconds || 0;
      const timeB = b.createdAt?.seconds || b.date?.seconds || 0;
      return timeB - timeA;
    });


    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return {
      expenses,
      lastVisible,
      hasMore: snapshot.docs.length === pageSize,
    };
  } catch (error) {
    console.error('Error fetching expenses with collectionGroup:', error);
    throw error;
  }
}

/**
 * Get total expense count using collectionGroup aggregation.
 */
export async function getExpensesCount() {
  try {
    const coll = collectionGroup(db, 'expenses');
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
  } catch (error) {
    console.warn('Count aggregation failed, falling back:', error.message);
    const snapshot = await getDocs(collectionGroup(db, 'expenses'));
    return snapshot.size;
  }
}

/**
 * Fetch a specific expense document by householdId and expenseId.
 */
export async function fetchExpenseById(householdId, expenseId) {
  try {
    const docRef = doc(db, 'households', householdId, 'expenses', expenseId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      householdId,
      ...docSnap.data(),
    };
  } catch (error) {
    console.error(`Error fetching expense ${expenseId}:`, error);
    throw error;
  }
}
