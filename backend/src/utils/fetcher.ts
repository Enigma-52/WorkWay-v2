import greenhouse from "./fetchGreenhouse";
import lever from "./fetchLever";
import getTop5LatestJobs from "./fetchLatestJobs";
import pkg from '../config/firebaseConfig';
const {
    db,
    doc,
    setDoc,
    getDocs,
    collection
} = pkg;

async function fetch(){
    await greenhouse();
    await lever();
    await getTop5LatestJobs();

    //set total jobs
    const docRef = collection(db, 'jobs');
    const docSnap = await getDocs(docRef);
    let totalJobs =0;
    for (const doc of docSnap.docs) {
      
        const data = doc.data();
        console.log(data.data.length);
        if(data.data.length){
          totalJobs += data.data.length;
        }
    }
    const docRef2 = doc(db, 'LatestJobs','totalJobs');
    const details = {
        data: totalJobs
      };
    await setDoc(docRef2, details);
    console.log(details);
}

export default fetch;