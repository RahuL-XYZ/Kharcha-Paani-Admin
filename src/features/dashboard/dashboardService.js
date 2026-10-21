import {
  collection,
  collectionGroup,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getUsersCount } from '../users/usersService';
import { getGroupsCount } from '../groups/groupsService';
import { getExpensesCount } from '../expenses/expensesService';

/**
 * Fetch all high-level statistics and dashboard metrics.
 */
export async function fetchDashboardSummary() {
  try {
    const [usersCount, groupsCount, expensesCount] = await Promise.all([
      getUsersCount().catch(() => 0),
      getGroupsCount().catch(() => 0),
      getExpensesCount().catch(() => 0),
    ]);

    // Fetch recent expenses to calculate sample volume and build trend data
    let expSnap;
    try {
      const expQuery = query(
        collectionGroup(db, 'expenses'),
        orderBy('createdAt', 'desc'),
        limit(25)
      );
      expSnap = await getDocs(expQuery);
    } catch (indexError) {
      console.warn('Dashboard collectionGroup index fallback:', indexError.message);
      const fallbackQuery = query(collectionGroup(db, 'expenses'), limit(50));
      expSnap = await getDocs(fallbackQuery);
    }


    let totalRecordedVolume = 0;
    const categoryTotals = {};
    const trendMap = {};

    expSnap.docs.forEach((doc) => {
      const data = doc.data();
      const amount = Number(data.amount) || 0;
      totalRecordedVolume += amount;

      // Group by category
      const cat = data.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;

      // Group by date for trend chart (e.g. "DD MMM")
      let dateKey = 'Recent';
      if (data.date?.seconds) {
        const d = new Date(data.date.seconds * 1000);
        dateKey = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      }
      trendMap[dateKey] = (trendMap[dateKey] || 0) + amount;
    });

    const trendData = Object.keys(trendMap)
      .reverse()
      .map((date) => ({
        date,
        amount: trendMap[date],
      }));

    // Fetch recent 5 users
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const usersSnap = await getDocs(usersQuery).catch(() => ({ docs: [] }));
    const recentUsers = usersSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // Fetch recent 5 households
    const groupsQuery = query(
      collection(db, 'households'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const groupsSnap = await getDocs(groupsQuery).catch(() => ({ docs: [] }));
    const recentGroups = groupsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return {
      totalUsers: usersCount,
      totalGroups: groupsCount,
      totalExpenses: expensesCount,
      totalRecordedVolume,
      trendData: trendData.length > 0 ? trendData : [{ date: 'Today', amount: 0 }],
      categoryTotals,
      recentUsers,
      recentGroups,
    };
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
}
