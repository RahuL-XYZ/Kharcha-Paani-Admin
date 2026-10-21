import {
  collection,
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

const HOUSEHOLDS_COLLECTION = 'households';

/**
 * Fetch paginated households/groups.
 */
export async function fetchGroups({ pageSize = 15, cursor = null } = {}) {
  try {
    let q = query(
      collection(db, HOUSEHOLDS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (cursor) {
      q = query(
        collection(db, HOUSEHOLDS_COLLECTION),
        orderBy('createdAt', 'desc'),
        startAfter(cursor),
        limit(pageSize)
      );
    }

    const snapshot = await getDocs(q);
    const groups = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      _rawDoc: d,
    }));

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return {
      groups,
      lastVisible,
      hasMore: snapshot.docs.length === pageSize,
    };
  } catch (error) {
    console.error('Error fetching groups/households:', error);
    throw error;
  }
}

/**
 * Get total count of groups/households using server aggregation.
 */
export async function getGroupsCount() {
  try {
    const coll = collection(db, HOUSEHOLDS_COLLECTION);
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
  } catch (error) {
    console.warn('Count aggregation failed, falling back:', error.message);
    const snapshot = await getDocs(collection(db, HOUSEHOLDS_COLLECTION));
    return snapshot.size;
  }
}

/**
 * Fetch group details by ID.
 */
export async function fetchGroupById(groupId) {
  try {
    const docRef = doc(db, HOUSEHOLDS_COLLECTION, groupId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  } catch (error) {
    console.error(`Error fetching group ${groupId}:`, error);
    throw error;
  }
}

/**
 * Fetch members subcollection for a given household.
 */
export async function fetchGroupMembers(groupId) {
  try {
    const membersRef = collection(db, HOUSEHOLDS_COLLECTION, groupId, 'members');
    const snapshot = await getDocs(membersRef);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error(`Error fetching members for group ${groupId}:`, error);
    return [];
  }
}

/**
 * Fetch expenses subcollection for a given household.
 */
export async function fetchGroupExpenses(groupId) {
  try {
    const expensesRef = collection(db, HOUSEHOLDS_COLLECTION, groupId, 'expenses');
    const q = query(expensesRef, orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error(`Error fetching expenses for group ${groupId}:`, error);
    return [];
  }
}

/**
 * Fetch settlements subcollection for a given household.
 */
export async function fetchGroupSettlements(groupId) {
  try {
    const settlementsRef = collection(db, HOUSEHOLDS_COLLECTION, groupId, 'settlements');
    const q = query(settlementsRef, orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error(`Error fetching settlements for group ${groupId}:`, error);
    return [];
  }
}
