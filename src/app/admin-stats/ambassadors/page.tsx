'use client';

import React, { useState, useEffect } from 'react';
import { Ambassador } from '@/data/mockAmbassadors';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ToggleLeft,
    ToggleRight,
    UserPlus,
    X,
    Camera
} from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import {
    collection,
    onSnapshot,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const getPlaceholder = (name?: string) => {
    if (!name) return 'https://ui-avatars.com/api/?name=User&background=A31D45&color=fff&size=512';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=A31D45&color=fff&size=512`;
};

const DEFAULT_PLACEHOLDER = 'https://ui-avatars.com/api/?name=User&background=A31D45&color=fff&size=512';

const EMPTY_FORM: Omit<Ambassador, 'id'> = {
    name: '',
    specialization: 'Marketing',
    year: '1st Year',
    tagline: '',
    photo_url: DEFAULT_PLACEHOLDER,
    instagram_url: '',
    linkedin_url: '',
    email_id: '',
    is_active: true
};

export default function AmbassadorManagement() {
    const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Ambassador, 'id'>>(EMPTY_FORM);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isBatchImporting, setIsBatchImporting] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Real-time listener for ambassadors
    useEffect(() => {
        const q = query(collection(db, 'ambassadors'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Ambassador[];
            setAmbassadors(data);
            setLoading(false);
        }, (error) => {
            console.error("Firestore listener error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleBatchImport = async () => {
        if (!window.confirm('Are you sure you want to import ALL 37 official student profiles? This will add them to the current list.')) {
            return;
        }

        setIsBatchImporting(true);
        try {
            const data = await import('@/data/ambassadorImport.json');
            const officialData = data.default || data;

            console.log(`Starting batch import of ${officialData.length} profiles...`);

            for (const student of officialData) {
                await addDoc(collection(db, 'ambassadors'), {
                    ...student,
                    createdAt: new Date().toISOString()
                });
            }

            alert('Batch import successful! All 37 student profiles are now live.');
        } catch (error: any) {
            console.error('BATCH IMPORT ERROR:', error);
            alert('Batch import failed: ' + error.message);
        } finally {
            setIsBatchImporting(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(db, 'ambassadors', id), {
                is_active: !currentStatus
            });
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to remove this ambassador?')) {
            try {
                await deleteDoc(doc(db, 'ambassadors', id));
            } catch (err) {
                alert("Failed to delete ambassador");
            }
        }
    };

    const handleOpenModal = (amb?: Ambassador) => {
        if (amb) {
            setEditingId(amb.id);
            const { id, ...rest } = amb;
            setFormData(rest);
        } else {
            setEditingId(null);
            setFormData(EMPTY_FORM);
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (field: keyof Omit<Ambassador, 'id'>, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || isUploading) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("File is too large. Max 10MB allowed.");
            return;
        }

        try {
            setIsUploading(true);

            // Use our server-side API route which proxies to Firebase Storage
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setFormData(prev => ({ ...prev, photo_url: data.url }));
        } catch (err: any) {
            console.error('Photo upload error:', err);
            alert('Failed to upload photo: ' + (err.message || 'Unknown error'));
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateDoc(doc(db, 'ambassadors', editingId), formData);
            } else {
                await addDoc(collection(db, 'ambassadors'), formData);
            }
            setIsModalOpen(false);
        } catch (err: any) {
            console.error("Firestore save error:", err);
            alert(`Error saving data to Firestore: ${err.message || "Unknown error"}. Make sure your rules allow it.`);
        }
    };

    const filteredAmbassadors = ambassadors.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-itm-red">Ambassador Management</h1>
                    <p className="text-gray-500 mt-1">Add, edit, or remove student ambassadors from the public list.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleBatchImport}
                        disabled={isBatchImporting}
                        className="bg-itm-red/[0.03] hover:bg-itm-red/[0.08] text-itm-red border border-itm-red/10 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all disabled:opacity-50"
                    >
                        {isBatchImporting ? (
                            <div className="w-4 h-4 border-2 border-itm-red border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Search size={18} />
                        )}
                        Import Official Data
                    </button>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData(EMPTY_FORM);
                            setIsModalOpen(true);
                        }}
                        className="bg-itm-red text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-itm-red/90 transition-all font-bold shadow-lg shadow-itm-red/20"
                    >
                        <UserPlus size={18} />
                        Add New Ambassador
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-2">
                <div className="flex-grow relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or specialization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-itm-gold/20 transition-all"
                    />
                </div>
                <div className="flex items-center gap-4 px-4 bg-gray-50 rounded-xl py-4 md:py-0">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total: {ambassadors.length}</span>
                    <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Active: {ambassadors.filter(a => a.is_active).length}</span>
                </div>
            </div>

            {/* Loading State */}
            {loading && ambassadors.length === 0 ? (
                <div className="py-20 text-center text-gray-400 font-medium">Loading Firestore data...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredAmbassadors.map((amb) => (
                        <div key={amb.id} className={`bg-white rounded-2xl border transition-all ${amb.is_active ? 'border-gray-100 shadow-sm' : 'border-gray-200 opacity-60 grayscale'}`}>
                            <div className="p-6 flex items-start gap-4">
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-50 shadow-sm shrink-0 bg-gray-50">
                                    <img
                                        src={amb.photo_url || DEFAULT_PLACEHOLDER}
                                        alt={amb.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER;
                                        }}
                                    />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-bold text-gray-900 truncate">{amb.name}</h3>
                                    <p className="text-itm-gold text-xs font-bold uppercase tracking-wider">{amb.specialization}</p>
                                    <p className="text-gray-500 text-xs mt-1">{amb.year} • {amb.email_id || 'No email'}</p>
                                </div>
                                <button
                                    onClick={() => toggleStatus(amb.id, amb.is_active)}
                                    className={`transition-colors ${amb.is_active ? 'text-green-500' : 'text-gray-400'}`}
                                >
                                    {amb.is_active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                </button>
                            </div>

                            <div className="px-6 pb-6 pt-2">
                                <p className="text-gray-600 text-sm line-clamp-2 italic mb-4">"{amb.tagline}"</p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(amb)}
                                        className="flex-grow bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Edit2 size={14} />
                                        <span>Edit Details</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(amb.id)}
                                        className="bg-red-50 hover:bg-red-100 text-red-500 p-2.5 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => handleOpenModal()}
                        className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-gray-400 hover:text-itm-gold hover:border-itm-gold transition-all group min-h-[150px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-gray-50 group-hover:bg-itm-gold/10 flex items-center justify-center transition-all">
                            <Plus size={32} />
                        </div>
                        <span className="font-bold">Add New ambassador</span>
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-itm-red/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-gray-900">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="bg-itm-red p-6 flex items-center justify-between text-white border-none">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Ambassador' : 'Add New Ambassador'}</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="flex flex-col items-center gap-4 mb-4">
                                <input
                                    type="file"
                                    accept="*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handlePhotoUpload}
                                />
                                <div
                                    className={`relative group ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    onClick={() => !isUploading && fileInputRef.current?.click()}
                                >
                                    <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-gray-100 shadow-md relative">
                                        <img
                                            key={formData.photo_url}
                                            src={formData.photo_url || getPlaceholder(formData.name)}
                                            alt="Preview"
                                            className={`w-full h-full object-cover transition-all ${isUploading ? 'opacity-30' : ''}`}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                const fallback = getPlaceholder(formData.name);
                                                if (target.src !== fallback) {
                                                    target.src = fallback;
                                                }
                                            }}
                                        />
                                        {isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 border-4 border-itm-gold border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="text-white" size={24} />
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-itm-gold mt-2 text-center uppercase tracking-wider group-hover:underline">
                                        {formData.photo_url === DEFAULT_PLACEHOLDER ? 'Upload Photo' : 'Change Photo'}
                                    </p>
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1 block">LinkedIn / Instagram Photo Link</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={formData.photo_url}
                                                onChange={(e) => handleInputChange('photo_url', e.target.value)}
                                                placeholder="Paste direct LinkedIn image URL..."
                                                className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-itm-gold/20 focus:border-itm-gold outline-none transition-all text-sm font-medium"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-itm-red text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-itm-red/90 transition-all flex items-center justify-center min-w-[120px]"
                                            >
                                                {isUploading ? '...' : 'Upload File'}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-medium">Tip: Right-click a LinkedIn profile photo and select "Copy Image Address" to paste here.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1 text-left">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Enter student name"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-itm-gold/20 focus:border-itm-gold outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1 text-left">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Email ID</label>
                                    <input
                                        type="email"
                                        value={formData.email_id}
                                        onChange={(e) => handleInputChange('email_id', e.target.value)}
                                        placeholder="student@isu.ac.in"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-itm-gold/20 focus:border-itm-gold outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1 text-left">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Specialization</label>
                                    <select
                                        value={formData.specialization}
                                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-itm-gold/20 focus:border-itm-gold outline-none transition-all appearance-none"
                                    >
                                        <option>Marketing</option>
                                        <option>Finance</option>
                                        <option>Operations</option>
                                        <option>Human Resources</option>
                                        <option>Business Analytics</option>
                                    </select>
                                </div>
                                <div className="space-y-1 text-left">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Year</label>
                                    <select
                                        value={formData.year}
                                        onChange={(e) => handleInputChange('year', e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-itm-gold/20 focus:border-itm-gold outline-none transition-all appearance-none"
                                    >
                                        <option>1st Year</option>
                                        <option>2nd Year</option>
                                    </select>
                                </div>
                                <div className="space-y-1 text-left md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Instagram URL</label>
                                    <input
                                        type="url"
                                        value={formData.instagram_url}
                                        onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                                        placeholder="https://instagram.com/profile"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-itm-gold/20 focus:border-itm-gold outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1 text-left md:col-span-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        value={formData.linkedin_url}
                                        onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                                        placeholder="https://linkedin.com/in/profile"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-itm-gold/20 focus:border-itm-gold outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1 text-left">
                                <label className="text-sm font-bold text-gray-700 ml-1">Short Bio / Tagline</label>
                                <textarea
                                    required
                                    value={formData.tagline}
                                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                                    placeholder="A short punchy intro..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-itm-gold/20 focus:border-itm-gold outline-none transition-all h-24 resize-none"
                                />
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-grow bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-grow bg-itm-red hover:bg-red-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-itm-red/30 transition-all"
                                >
                                    {editingId ? 'Save Changes' : 'Create Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
