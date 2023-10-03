const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Event, Group, Venue, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


// Add an Image to a Event based on the Event's id
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    const { user } = req
    const userId = user.id
    const eventId = req.params.eventId
})
// Get details of an Event specified by its id
router.get('/:eventId', async (req, res) => {
    const eventId = req.params.eventId
    const event = await Event.findByPk(eventId, {
        include: [
            {
                model: EventImage,
                attributes: ['id', 'url', 'preview']
            }
        ]
    })

    if (!event) {
        res.json({
            "message": "Event couldn't be found"
          })
    }
    let eventJson = event.toJSON()

    const group = await Group.findByPk(event.groupId, {
        attributes: ['id', 'name', 'private', 'city', 'state']
    })
    eventJson.Group = group

    eventJson.Venue = null
    const venue = await Venue.findByPk(event.venueId, {
        attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
    })
    if (venue) eventJson.Venue = venue

    delete eventJson.createdAt
    delete eventJson.updatedAt
    
    res.json(eventJson)
})
// Get all Events
router.get('/', async (req, res) => {
    const events = await Event.findAll({
        include: [EventImage]
    })

    const groups = await Group.findAll( {
        attributes: ['id', 'name', 'city', 'state']
    })

    const venues = await Venue.findAll({
        attributes: ['id', 'city', 'state']
    })

    let eventList = []

    events.forEach(event => {
        eventList.push(event.toJSON())
    });

    eventList.forEach(event => {
        
        
        event.EventImages.forEach(image => {
            // console.log(image)
            if (image.preview === true) {
                event.previewImage = image.url
                return
            } else {
                event.previewImage = 'No images available for preview'
            }
        })
        
        groups.forEach(group => {
            if (group.id === event.groupId) {
                event.Group = group
            }
        })
        venues.forEach(venue => {
            if (venue.id === event.venueId) {
                event.Venue = venue
                return
            } else {
                event.Venue = null
            }
        })
        delete event.price
        delete event.capacity
        delete event.description
        delete event.EventImages
        delete event.createdAt
        delete event.updatedAt
        // console.log(event)
    })
    res.json(eventList)
})

module.exports = router;
