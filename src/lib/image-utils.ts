export const getPlaceholderUrl = (name?: string) => {
    if (!name) return 'https://ui-avatars.com/api/?name=User&background=A31D45&color=ffffff&size=512';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=A31D45&color=ffffff&size=512`;
};

export const getProxyImageUrl = (url: string) => {
    if (!url || url.startsWith('/') || url.includes('ui-avatars.com') || url.includes('firebasestorage')) return url;
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
};

export const DEFAULT_PLACEHOLDER_GUY = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&h=200&auto=format&fit=crop";
