const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const auth = require('../middleware/auth');

// Get all courses for a user
router.get('/', auth, async (req, res) => {
    try {
        const [courses] = await db.query(
            'SELECT * FROM courses WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.userId]
        );
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific course
router.get('/:id', auth, async (req, res) => {
    try {
        const [courses] = await db.query(
            'SELECT * FROM courses WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.userId]
        );

        if (courses.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(courses[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new courses
router.post('/add-course', auth, [
    body('courses').isArray().withMessage('Courses must be an array'),
    body('courses.*.course_code').trim().notEmpty().escape(),
    body('courses.*.course_name').trim().notEmpty().escape(),
    body('courses.*.credits').isInt({ min: 1 }),
    body('courses.*.semester').trim().notEmpty().escape(),
    body('courses.*.description').optional().trim().escape()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        console.log('Request body:', req.body);
        const { courses } = req.body;
        
        if (!courses || !Array.isArray(courses)) {
            console.log('Invalid courses data:', courses);
            return res.status(400).json({ message: 'Invalid courses data' });
        }

        const createdCourses = [];

        for (const course of courses) {
            console.log('Processing course:', course);
            const { course_code, course_name, credits, semester, description } = course;
            
            try {
                const [result] = await db.query(
                    'INSERT INTO courses (user_id, course_code, course_name, credits, semester, description) VALUES (?, ?, ?, ?, ?, ?)',
                    [req.user.userId, course_code, course_name, credits, semester, description]
                );

                console.log('Insert result:', result);

                const [newCourse] = await db.query(
                    'SELECT * FROM courses WHERE id = ?',
                    [result.insertId]
                );

                console.log('Selected new course:', newCourse);
                createdCourses.push(newCourse[0]);
            } catch (dbError) {
                console.error('Database error:', dbError);
                throw dbError;
            }
        }

        res.status(201).json({
            message: `Successfully created ${createdCourses.length} courses`,
            courses: createdCourses
        });
    } catch (error) {
        console.error('Full error object:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            stack: error.stack 
        });
    }
});

// Update a course
router.put('/update-course/:id', auth, [
    body('course_code').optional().trim().notEmpty().escape(),
    body('course_name').optional().trim().notEmpty().escape(),
    body('credits').optional().isInt({ min: 1 }),
    body('semester').optional().trim().notEmpty().escape(),
    body('description').optional().trim().escape()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { course_code, course_name, credits, semester, description } = req.body;
        const updates = [];
        const values = [];

        if (course_code) {
            updates.push('course_code = ?');
            values.push(course_code);
        }
        if (course_name) {
            updates.push('course_name = ?');
            values.push(course_name);
        }
        if (credits) {
            updates.push('credits = ?');
            values.push(credits);
        }
        if (semester) {
            updates.push('semester = ?');
            values.push(semester);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No updates provided' });
        }

        values.push(req.params.id, req.user.userId);
        const [result] = await db.query(
            `UPDATE courses SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const [updatedCourse] = await db.query(
            'SELECT * FROM courses WHERE id = ?',
            [req.params.id]
        );

        res.json(updatedCourse[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a course
router.delete('/:id', auth, async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM courses WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 