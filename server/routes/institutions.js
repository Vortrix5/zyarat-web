const express = require('express');
const { institutions, announcements, tickets, uuidv4 } = require('../data');
const { authenticateToken, isInstitutionOwnerOrAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// --- Institution specific routes ---
// Most routes here will need to check if the logged-in user is the institution owner or an admin.

// GET /institutions/:institutionId/stats
router.get('/:institutionId/stats', authenticateToken, isInstitutionOwnerOrAdmin, (req, res) => {
    const { institutionId } = req.params;
    const institution = institutions.find(inst => inst.id === institutionId);
    if (!institution) return res.status(404).json({ success: false, message: 'Institution not found' });

    const institutionTickets = tickets.filter(t => t.institutionId === institutionId);
    const stats = {
        visitors: institution.totalVisitors,
        revenue: "1,236", // Simplified
        ticketsSold: institutionTickets.length * 30,
        visitorTrend: [
            { month: 'Jan', count: institution.totalVisitors * 0.1 }, { month: 'Feb', count: institution.totalVisitors * 0.12 },
            { month: 'Mar', count: institution.totalVisitors * 0.15 }, { month: 'Apr', count: institution.totalVisitors * 0.13 },
            { month: 'May', count: institution.totalVisitors * 0.18 }, { month: 'Jun', count: institution.totalVisitors * 0.22 },
        ],
        revenueTrend: [
            { month: 'Jan', amount: institution.entryFee * institution.totalVisitors * 0.05 }, { month: 'Feb', amount: institution.entryFee * institution.totalVisitors * 0.06 },
            { month: 'Mar', amount: institution.entryFee * institution.totalVisitors * 0.08 }, { month: 'Apr', amount: institution.entryFee * institution.totalVisitors * 0.07 },
            { month: 'May', amount: institution.entryFee * institution.totalVisitors * 0.1 }, { month: 'Jun', amount: institution.entryFee * institution.totalVisitors * 0.11 },
        ],
    };
    res.json({ success: true, data: stats });
});

// GET /institutions/:institutionId
router.get('/:institutionId', authenticateToken, isInstitutionOwnerOrAdmin, (req, res) => {
    const { institutionId } = req.params;
    const institution = institutions.find(inst => inst.id === institutionId);
    if (institution) {
        res.json({ success: true, data: institution });
    } else {
        res.status(404).json({ success: false, message: 'Institution not found' });
    }
});

// PUT /institutions/:institutionId
router.put('/:institutionId', authenticateToken, isInstitutionOwnerOrAdmin, (req, res) => {
    const { institutionId } = req.params;
    const data = req.body;
    const index = institutions.findIndex(inst => inst.id === institutionId);
    if (index !== -1) {
        institutions[index] = { ...institutions[index], ...data, id: institutionId }; // Ensure ID is not changed
        res.json({ success: true, data: institutions[index], message: 'Institution updated' });
    } else {
        res.status(404).json({ success: false, message: 'Institution not found' });
    }
});

// --- Announcements for an institution ---
// GET /institutions/:institutionId/announcements
router.get('/:institutionId/announcements', authenticateToken, isInstitutionOwnerOrAdmin, (req, res) => {
    const { institutionId } = req.params;
    const institutionAnnouncements = announcements.filter(ann => ann.institutionId === institutionId);
    res.json({ success: true, data: institutionAnnouncements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

// POST /institutions/:institutionId/announcements
router.post('/:institutionId/announcements', authenticateToken, isInstitutionOwnerOrAdmin, (req, res) => {
    const { institutionId } = req.params;
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ success: false, message: 'Title and content are required' });
    }
    const newAnnouncement = {
        id: uuidv4(),
        institutionId,
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    announcements.push(newAnnouncement);
    res.status(201).json({ success: true, data: newAnnouncement, message: 'Announcement created' });
});

// PUT /institutions/:institutionId/announcements/:announcementId
router.put('/:institutionId/announcements/:announcementId', authenticateToken, isInstitutionOwnerOrAdmin, (req, res) => {
    const { announcementId } = req.params;
    const { title, content } = req.body;
    const index = announcements.findIndex(ann => ann.id === announcementId);
    if (index !== -1) {
        if (announcements[index].institutionId !== req.params.institutionId) {
            return res.status(403).json({ success: false, message: 'Forbidden: Announcement does not belong to this institution.' });
        }
        announcements[index] = { ...announcements[index], title, content, updatedAt: new Date().toISOString() };
        res.json({ success: true, data: announcements[index], message: 'Announcement updated' });
    } else {
        res.status(404).json({ success: false, message: 'Announcement not found' });
    }
});

// DELETE /institutions/:institutionId/announcements/:announcementId
router.delete('/:institutionId/announcements/:announcementId', authenticateToken, isInstitutionOwnerOrAdmin, (req, res) => {
    const { announcementId } = req.params;
    const index = announcements.findIndex(ann => ann.id === announcementId);
    if (index !== -1) {
        if (announcements[index].institutionId !== req.params.institutionId) {
            return res.status(403).json({ success: false, message: 'Forbidden: Announcement does not belong to this institution.' });
        }
        announcements.splice(index, 1);
        res.json({ success: true, data: { success: true }, message: 'Announcement deleted' });
    } else {
        res.status(404).json({ success: false, message: 'Announcement not found' });
    }
});

// --- Tickets for an institution ---
// GET /institutions/:institutionId/tickets
router.get('/:institutionId/tickets', authenticateToken, isInstitutionOwnerOrAdmin, (req, res) => {
    const { institutionId } = req.params;
    const institutionTickets = tickets.filter(ticket => ticket.institutionId === institutionId);
    res.json({ success: true, data: institutionTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

// POST /institutions/:institutionId/tickets
router.post('/:institutionId/tickets', authenticateToken, isInstitutionOwnerOrAdmin, (req, res) => {
    const { institutionId } = req.params;
    const { name, price, description, isActive = true } = req.body;
    if (!name || price === undefined || !description) {
        return res.status(400).json({ success: false, message: 'Name, price, and description are required' });
    }
    const newTicket = {
        id: uuidv4(),
        institutionId,
        name,
        price: parseFloat(price),
        description,
        isActive,
        createdAt: new Date().toISOString(),
    };
    tickets.push(newTicket);
    res.status(201).json({ success: true, data: newTicket, message: 'Ticket created' });
});

// PUT /institutions/:institutionId/tickets/:ticketId
router.put('/:institutionId/tickets/:ticketId', authenticateToken, isInstitutionOwnerOrAdmin, (req, res) => {
    const { ticketId } = req.params;
    const data = req.body;
    const index = tickets.findIndex(ticket => ticket.id === ticketId);
    if (index !== -1) {
        if (tickets[index].institutionId !== req.params.institutionId) {
            return res.status(403).json({ success: false, message: 'Forbidden: Ticket does not belong to this institution.' });
        }
        tickets[index] = { ...tickets[index], ...data, price: parseFloat(data.price) };
        res.json({ success: true, data: tickets[index], message: 'Ticket updated' });
    } else {
        res.status(404).json({ success: false, message: 'Ticket not found' });
    }
});

// DELETE /institutions/:institutionId/tickets/:ticketId
router.delete('/:institutionId/tickets/:ticketId', authenticateToken, isInstitutionOwnerOrAdmin, (req, res) => {
    const { ticketId } = req.params;
    const index = tickets.findIndex(ticket => ticket.id === ticketId);
    if (index !== -1) {
        if (tickets[index].institutionId !== req.params.institutionId) {
            return res.status(403).json({ success: false, message: 'Forbidden: Ticket does not belong to this institution.' });
        }
        tickets.splice(index, 1);
        res.json({ success: true, data: { success: true }, message: 'Ticket deleted' });
    } else {
        res.status(404).json({ success: false, message: 'Ticket not found' });
    }
});

module.exports = router;
