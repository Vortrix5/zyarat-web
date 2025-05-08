const { v4: uuidv4 } = require('uuid');

// --- Users ---
// Note: In a real app, passwords should be hashed.
let users = [
    { id: 'admin-user-id', email: 'admin@example.com', password: 'password123', role: 'admin', name: 'Admin User', createdAt: new Date().toISOString() },
    { id: 'institution-user-id-1', email: 'museum@example.com', password: 'password123', role: 'institution', name: 'City Museum', createdAt: new Date().toISOString() },
    { id: 'institution-user-id-2', email: 'gallery@example.com', password: 'password123', role: 'institution', name: 'Art Gallery', createdAt: new Date().toISOString() },
];

// --- Institutions ---
let institutions = [
    {
        id: 'institution-user-id-1', // Matches user ID for simplicity
        name: 'Bardo National Museum',
        description: 'A world-renowned museum housing a vast collection of Roman mosaics and Tunisian artifacts.',
        city: 'Tunis',
        location: { address: 'Rue Mongi Bali, Le Bardo, Tunis', latitude: 36.8092, longitude: 10.1339 },
        entryFee: 12, // TND
        isVerified: true,
        status: 'verified', // 'pending', 'verified', 'rejected'
        registrationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        acceptanceDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        creationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        rating: 4.7,
        totalVisitors: 50,
        workingHours: {
            monday: { isOpen: false, openTime: '09:00', closeTime: '17:00' },
            tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
            wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
            thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
            friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
            saturday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
            sunday: { isOpen: true, openTime: '09:00', closeTime: '13:00' },
        },
        images: ['https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'https://images.pexels.com/photos/20967/pexels-photo.jpg'],
    },
    {
        id: 'institution-user-id-2',
        name: 'National Museum of Carthage',
        description: 'Explore Punic and Roman history at this iconic site overlooking the Gulf of Tunis.',
        city: 'Carthage',
        location: { address: 'Byrsa Hill, Carthage, Tunis', latitude: 36.8526, longitude: 10.3236 },
        entryFee: 10, // TND
        isVerified: true,
        status: 'verified',
        registrationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        acceptanceDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        creationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        rating: 4.6,
        totalVisitors: 9500,
        workingHours: {
            monday: { isOpen: true, openTime: '08:30', closeTime: '17:30' },
            tuesday: { isOpen: true, openTime: '08:30', closeTime: '17:30' },
            wednesday: { isOpen: true, openTime: '08:30', closeTime: '17:30' },
            thursday: { isOpen: true, openTime: '08:30', closeTime: '17:30' },
            friday: { isOpen: true, openTime: '08:30', closeTime: '17:30' },
            saturday: { isOpen: true, openTime: '08:30', closeTime: '17:30' },
            sunday: { isOpen: true, openTime: '08:30', closeTime: '17:30' },
        },
        images: ['https://images.pexels.com/photos/161538/unesco-sites-wall-relief-ancient-times-161538.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    },
    {
        id: 'pending-institution-id-1',
        name: 'Cité des Sciences à Tunis',
        description: 'Interactive science and technology exhibits for all ages.',
        city: 'Tunis',
        location: { address: 'Boulevard Mohamed Bouazizi, Tunis', latitude: 36.8388, longitude: 10.2318 },
        entryFee: 8, // TND
        isVerified: false,
        status: 'pending',
        registrationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        creationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        rating: 0,
        totalVisitors: 0,
        workingHours: { /* default working hours */ },
        images: ['https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg'],
    },
];

// --- Announcements ---
let announcements = [
    { id: uuidv4(), institutionId: 'institution-user-id-1', title: 'New Mosaic Exhibit!', content: 'Discover newly restored Roman mosaics from Bulla Regia. Opens August 1st!', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: uuidv4(), institutionId: 'institution-user-id-2', title: 'Lecture on Punic Carthage', content: 'Join Dr. Ali Hassan for a talk on the history of Punic Carthage next Saturday at 3 PM.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// --- Tickets ---
let tickets = [
    { id: uuidv4(), institutionId: 'institution-user-id-1', name: 'Adult Admission', price: 12, description: 'General admission for one adult to Bardo Museum.', isActive: true, createdAt: new Date().toISOString() },
    { id: uuidv4(), institutionId: 'institution-user-id-1', name: 'Student Admission', price: 6, description: 'Admission for students with valid ID to Bardo Museum.', isActive: true, createdAt: new Date().toISOString() },
    { id: uuidv4(), institutionId: 'institution-user-id-2', name: 'Carthage Site Entry', price: 10, description: 'Access to all Carthage archaeological sites.', isActive: true, createdAt: new Date().toISOString() },
];

// --- Complaints ---
let complaints = [
    { id: uuidv4(), userId: 'some-user-id', institutionId: 'institution-user-id-1', title: 'Long Wait Times', description: 'The queue for the main exhibit was over an hour long.', status: 'pending', createdAt: new Date().toISOString() },
];

module.exports = {
    users,
    institutions,
    announcements,
    tickets,
    complaints,
    uuidv4,
};
