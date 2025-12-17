
import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PROJECTS, SKILLS, TIMELINE, ROADMAP, PHILOSOPHY, BLOG_POSTS, PROFILE, SKILLS_CATEGORIES } from '../data/portfolio';

// Generic Hook Factory for Collections
function useCollectionData(collectionName: string, fallbackData: any[]) {
    const [data, setData] = useState<any[]>(fallbackData);
    const [loading, setLoading] = useState(true);
    const [isFallback, setIsFallback] = useState(true);

    useEffect(() => {
        const q = query(collection(db, collectionName), orderBy('order', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: any[] = [];
            snapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            // If DB is empty (first load before sync?), keep fallback, else use DB
            if (items.length > 0) {
                 setData(items);
                 setIsFallback(false);
            } else {
                setIsFallback(true);
            }
            setLoading(false);
        }, (error) => {
            console.error(`Error fetching ${collectionName}:`, error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [collectionName]);

    return { data, loading, isFallback };
}

// Specific Hooks
export const useProjects = () => useCollectionData('projects', PROJECTS);

// Skills might need custom sorting if not done in DB
export const useSkills = () => useCollectionData('skills', SKILLS);
export const useSkillCategories = () => useCollectionData('skill_categories', SKILLS_CATEGORIES);

// Timeline needs sorting by Date usually, but for now we trust the DB order or sort client side
export const useTimeline = () => {
    const { data, loading, isFallback } = useCollectionData('timeline', TIMELINE);
    // Optional: Sort by date descending?
    return { data, loading, isFallback };
};

export const useRoadmap = () => useCollectionData('roadmap', ROADMAP);
export const usePhilosophy = () => useCollectionData('philosophy', PHILOSOPHY);
export const useBlogPosts = () => useCollectionData('writings', BLOG_POSTS);

// Profile is a Single Document
export const useProfile = () => {
    const [profile, setProfile] = useState<any>(PROFILE);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "portfolio", "profile"), (doc) => {
            if (doc.exists()) {
                setProfile(doc.data());
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching profile:", error);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return { profile, loading };
};
