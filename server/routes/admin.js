const express = require('express');
const { institutions, complaints, users: allUsers, tickets, uuidv4 } = require('../data');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(isAdmin);

// GET /admin/stats
router.get('/stats', (req, res) => {
    const pendingInstitutions = institutions.filter(inst => inst.status === 'pending').length;
    const totalUsers = allUsers.length;
    // Simplified stats
    const stats = {
        totalRevenue: tickets.reduce((sum, ticket) => sum + ticket.price, 0) * 0.7, // Assuming some tickets sold
        ticketsSold: tickets.length * 0.7,
        totalUsers: totalUsers,
        pendingInstitutions: pendingInstitutions,
        userGrowthData: [
            { month: 'Jan', count: 10 }, { month: 'Feb', count: 15 }, { month: 'Mar', count: 25 },
            { month: 'Apr', count: 30 }, { month: 'May', count: 40 }, { month: 'Jun', count: 55 },
        ],
        topInstitutions: institutions
            .filter(inst => inst.isVerified)
            .sort((a, b) => b.totalVisitors - a.totalVisitors)
            .slice(0, 3)
            .map(inst => ({ id: inst.id, name: inst.name, visitors: inst.totalVisitors, revenue: inst.entryFee * inst.totalVisitors * 0.5 })),
    };
    res.json({ success: true, data: stats });
});

// GET /admin/institutions/verified
router.get('/institutions/verified', (req, res) => {
    const verified = institutions.filter(inst => inst.isVerified && inst.status === 'verified');
    res.json({ success: true, data: verified });
});

// GET /admin/institutions/pending
router.get('/institutions/pending', (req, res) => {
    const pending = institutions.filter(inst => inst.status === 'pending');
    res.json({ success: true, data: pending });
});

// POST /admin/institutions/:institutionId/approve
router.post('/institutions/:institutionId/approve', (req, res) => {
    const { institutionId } = req.params;
    const institution = institutions.find(inst => inst.id === institutionId);
    if (institution) {
        institution.isVerified = true;
        institution.status = 'verified';
        institution.acceptanceDate = new Date().toISOString();
        res.json({ success: true, data: institution, message: 'Institution approved' });
    } else {
        res.status(404).json({ success: false, message: 'Institution not found' });
    }
});

// POST /admin/institutions/:institutionId/reject
router.post('/institutions/:institutionId/reject', (req, res) => {
    const { institutionId } = req.params;
    const institution = institutions.find(inst => inst.id === institutionId);
    if (institution) {
        institution.isVerified = false;
        institution.status = 'rejected';
        // Optionally remove or mark as rejected permanently
        res.json({ success: true, data: institution, message: 'Institution rejected' });
    } else {
        res.status(404).json({ success: false, message: 'Institution not found' });
    }
});

// GET /admin/complaints
router.get('/complaints', (req, res) => {
    res.json({ success: true, data: complaints });
});

// POST /admin/complaints/:complaintId/resolve
router.post('/complaints/:complaintId/resolve', (req, res) => {
    const { complaintId } = req.params;
    const { resolution } = req.body;
    const complaint = complaints.find(c => c.id === complaintId);
    if (complaint) {
        complaint.status = 'resolved';
        complaint.resolution = resolution;
        complaint.resolvedAt = new Date().toISOString();
        res.json({ success: true, data: complaint, message: 'Complaint resolved' });
    } else {
        res.status(404).json({ success: false, message: 'Complaint not found' });
    }
});

module.exports = router;
