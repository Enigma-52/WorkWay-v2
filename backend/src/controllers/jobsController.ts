import { Request, Response } from 'express';
import pkg from '../config/firebaseConfig';
const {
    db,
    doc,
    setDoc,
    getDocs,
    collection
} = pkg;
export const getLatestJobsController = async (req: Request, res: Response) => {
    try {
      const docRef = collection(db, 'LatestJobs');
      const docSnap = await getDocs(docRef);
      for (const doc of docSnap.docs) {
        if (doc.exists()) {
          const data = doc.data();
          res.json(data.top5Jobs);
        }
      }
    } catch (error) {
      console.error("Error fetching top 5 jobs:", error);
      res.status(500).json({ error: "An error occurred while fetching the latest jobs" });
    }
};

export const totalJobs = async (req: Request, res: Response) => {
  try {
    const docRef = collection(db, 'LatestJobs');
    const docSnap = await getDocs(docRef);
    
    for (const doc of docSnap.docs) {
      if (doc.id === 'totalJobs') {
        const data = doc.data();
        const totalJobs = data.data;
        res.json({ totalJobs });
        return;
      }
    }
  } catch (error) {
    console.error("Error fetching total jobs:", error);
    res.status(500).json({ error: "An error occurred while fetching total jobs" });
  }
};