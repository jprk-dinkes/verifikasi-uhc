import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    query,
    where,
    orderBy
} from 'firebase/firestore';

const COLLECTION_NAME = 'pendaftaran';

export const createPendaftaran = async (data) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...data,
            createdAt: new Date().toISOString()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error creating pendaftaran:", error);
        throw error;
    }
};

export const fetchPendaftaran = async (filters = {}) => {
    try {
        let q = collection(db, COLLECTION_NAME);

        // Basic filtering can be added here
        // For advanced filtering we might need composite indexes
        // For now, let's fetch all and filter client side or implement basic queries

        if (filters.faskesId) {
            q = query(q, where("id_faskes_pengusul", "==", filters.faskesId));
        }

        // Ideally sort by date desc
        // q = query(q, orderBy("createdAt", "desc")); 

        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });

        // Sort manually if index missing
        return data.sort((a, b) => new Date(b.tgl_input_petugas) - new Date(a.tgl_input_petugas));
    } catch (error) {
        console.error("Error fetching pendaftaran:", error);
        throw error;
    }
};

export const updatePendaftaranStatus = async (id, updates) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, updates);
        return { success: true };
    } catch (error) {
        console.error("Error updating pendaftaran:", error);
        throw error;
    }
};
