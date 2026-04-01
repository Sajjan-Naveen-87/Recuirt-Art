import { db, functions } from '../firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage();

export const jobsService = {
  // Get all jobs from Firestore
  getJobs: async (params = {}) => {
    try {
      const jobsCol = collection(db, 'jobs');
      let q = query(jobsCol, orderBy('created_at', 'desc'));
      
      if (params.category) {
        q = query(q, where('category', '==', params.category));
      }
      
      if (params.status) {
        q = query(q, where('status', '==', params.status));
      } else {
        // Default to active jobs for public view
        q = query(q, where('status', '==', 'active'));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to JS Date string for compatibility
        created_at: doc.data().created_at?.toDate()?.toISOString()
      }));
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },

  // Get job details from Firestore
  getJob: async (id) => {
    const jobDoc = await getDoc(doc(db, 'jobs', id));
    if (jobDoc.exists()) {
      return { id: jobDoc.id, ...jobDoc.data() };
    }
    throw new Error("Job not found");
  },

  // Apply for job (Using Cloud Function for server-side processing)
  applyForJob: async (formData) => {
    try {
      let resumeUrl = "";
      
      // 1. Handle Resume Upload to Firebase Storage
      const resumeFile = formData.get('resume');
      if (resumeFile && resumeFile instanceof File) {
        const storageRef = ref(storage, `resumes/${Date.now()}_${resumeFile.name}`);
        const uploadResult = await uploadBytes(storageRef, resumeFile);
        resumeUrl = await getDownloadURL(uploadResult.ref);
      }

      // 2. Call the Cloud Function
      const submitApplication = httpsCallable(functions, 'submitApplication');
      const result = await submitApplication({
        jobId: formData.get('job'),
        fullName: formData.get('full_name'),
        email: formData.get('email'),
        mobile: formData.get('mobile'),
        alternativeMobile: formData.get('alternative_mobile'),
        preferredJobDesignation: formData.get('preferred_job_designation'),
        preferredJobLocation: formData.get('preferred_job_location'),
        expectedSalary: formData.get('expected_salary'),
        joinAfter: formData.get('join_after'),
        totalExperience: formData.get('total_experience'),
        coverLetter: formData.get('cover_letter'),
        resumeUrl: resumeUrl,
        responses: [] // Custom requirements logic can be added here
      });

      return result.data;
    } catch (error) {
      console.error("Error applying for job:", error);
      throw error;
    }
  },

  // Get user's applications
  getMyApplications: async (userUid) => {
    const q = query(
      collection(db, 'applications'), 
      where('applicant_uid', '==', userUid),
      orderBy('applied_at', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
