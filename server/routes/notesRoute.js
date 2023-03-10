/**
 *  Using express.Router() to organize routes
 */

const express = require('express')
const router = express.Router()
// Mongoose model: Notes
const Note = require('../NotesModel')

// GET all notes
router.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find()
        console.log('Notes fetched from db!')
        res.json(notes)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

// GET a note by id
router.get('/notes/:id', async (req, res) => {
    const id = req.params.id
    // console.log(id)
    try {
        const note = await Note.findById(id)
        if (note === null) {
            res.status(404).send("Note not found!")
        } else {
            console.log('Note fetched from db!')
            res.json(note)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

// POST a new note
router.post('/notes', async (req, res) => {
    try {
        const { title, body, priority, color } = req.body
        const newNoteObj  = new Note({
            title: title,
            body: body,
            priority: priority,
            color: color
        }) 
        const newNote = await newNoteObj.save()
        console.log('New note saved to db!')
        res.json(newNote)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

// PUT (update) a note by id
router.put('/notes/:id', async (req, res) => {
    const id = req.params.id
    const { title, body, priority, color } = req.body

    try {
        const note = await Note.findById(id)
        if (note === null) {
            res.status(404).send("Note not found!")
        } else {
            const updatedNote = await Note.updateOne(
                { _id: id },
                { $set: {
                    "title": title, 
                    "body": body, 
                    "priority": priority, 
                    "color": color,
                    "timeLastModified": Date.now()
                    }
                }, 
                {upsert: true}
            )
            console.log('Note updated in db!')
            res.json(updatedNote)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

// DELETE a note by id
router.delete('/notes/:id', async (req, res) => {
    const id = req.params.id
    try {
        const note = await Note.findById(id)
        if (note === null) {
            res.status(404).send("Note not found!")
        } else {
            const deletedNote = await Note.deleteOne({ _id: id })
            console.log('Note deleted from db!')
            res.json(deletedNote)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

module.exports = router