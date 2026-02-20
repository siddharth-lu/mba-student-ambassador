export interface Ambassador {
  id: string;
  name: string;
  photo_url: string;
  specialization: string;
  year: string;
  tagline: string;
  instagram_url: string;
  linkedin_url: string;
  email_id: string;
  is_active: boolean;
}

export const mockAmbassadors: Ambassador[] = [
  {
    id: '1',
    name: 'Aaryan Sharma',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
    specialization: 'Marketing',
    year: '2nd Year',
    tagline: 'Passionate about digital trends and brand building.',
    instagram_url: 'https://instagram.com/aaryan_itm',
    linkedin_url: 'https://linkedin.com/in/aaryan-sharma',
    email_id: '',
    is_active: true,
  },
  {
    id: '2',
    name: 'Sneha Kapoor',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop',
    specialization: 'Finance',
    year: '2nd Year',
    tagline: 'Future fintech enthusiast. Let\'s talk numbers!',
    instagram_url: 'https://instagram.com/sneha_itm',
    linkedin_url: 'https://linkedin.com/in/sneha-kapoor',
    email_id: '',
    is_active: true,
  },
  {
    id: '3',
    name: 'Rohan Mehta',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop',
    specialization: 'Operations',
    year: '1st Year',
    tagline: 'Optimizing everything, from supply chains to campus life.',
    instagram_url: 'https://instagram.com/rohan_itm',
    linkedin_url: 'https://linkedin.com/in/rohan-mehta',
    email_id: '',
    is_active: true,
  },
  {
    id: '4',
    name: 'Priya Joshi',
    photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop',
    specialization: 'Human Resources',
    year: '2nd Year',
    tagline: 'People-first mindset. Happy to help with campus culture!',
    instagram_url: 'https://instagram.com/priya_itm',
    linkedin_url: 'https://linkedin.com/in/priya-joshi',
    email_id: '',
    is_active: true,
  }
];
