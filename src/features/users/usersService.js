import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const USERS_COLLECTION = 'users';
const HOUSEHOLDS_COLLECTION = 'households';

/**
 * Fetch list of users with pagination.
 */
export async function fetchUsers({ pageSize = 15, cursor = null } = {}) {
  try {
    let q = query(
      collection(db, USERS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (cursor) {
      q = query(
        collection(db, USERS_COLLECTION),
        orderBy('createdAt', 'desc'),
        startAfter(cursor),
        limit(pageSize)
      );
    }

    const snapshot = await getDocs(q);
    const users = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      _rawDoc: d,
    }));

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return {
      users,
      lastVisible,
      hasMore: snapshot.docs.length === pageSize,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Get total users count using Firestore server aggregation.
 */
export async function getUsersCount() {
  try {
    const coll = collection(db, USERS_COLLECTION);
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
  } catch (error) {
    console.warn('Count aggregation failed, falling back:', error.message);
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    return snapshot.size;
  }
}

/**
 * Fetch a single user profile document by ID.
 */
export async function fetchUserById(userId) {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
}

/**
 * Fetch households that a user is a member of.
 */
export async function fetchUserHouseholds(userId) {
  try {
    const q = query(
      collection(db, HOUSEHOLDS_COLLECTION),
      where('memberIds', 'array-contains', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error(`Error fetching households for user ${userId}:`, error);
    return [];
  }
}
