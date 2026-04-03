const express = require('express');
const router = express.Router();
const { createRecord, getRecords, getRecord, updateRecord, deleteRecord } = require('../controllers/recordController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { z } = require('zod');

router.use(authenticateToken);

const createSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    type: z.enum(['income', 'expense']),
    category: z.string(),
    date: z.string(),
    notes: z.string().optional()
  })
});


router.post('/create', authorizeRole('Admin'), validate(createSchema), createRecord);

const updateSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.enum(['income', 'expense']).optional(),
    category: z.string().optional(),
    date: z.string().optional(),
    notes: z.string().optional()
  })
});

router.put('/:id', authorizeRole('Admin'), validate(updateSchema), updateRecord);
router.delete('/:id', authorizeRole('Admin'), deleteRecord);


router.get('/', authorizeRole('Admin', 'Analyst', 'Viewer'), getRecords);
router.get('/:id', authorizeRole('Admin', 'Analyst', 'Viewer'), getRecord);

module.exports = router;
