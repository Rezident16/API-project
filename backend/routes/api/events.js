const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Event, Group, Venue, EventImage, Membership } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.use('/:eventId', async (req,res,next) => {
    const { user } = req
    const userId = user.id

    const eventId = req.params.eventId

    const event = await Event.findByPk(eventId)
    if(!event) {
        return res.status(404).json({
            message: "Event couldn't be found"
          })
    }
    const groupId = event.groupId
    const group = await Group.findByPk(groupId)
    const membership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: groupId
        }
    })

    if (membership.status !== 'co-host' && group.organizerId !== userId){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    next()
})
// Add an Image to a Event based on the Event's id
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    // const { user } = req
    // const userId = user.id
    const eventId = req.params.eventId
    const { url, preview } = req.body
    const event = await Event.findByPk(eventId)

    // if(!event) {
    //     return res.json({
    //         message: "Event couldn't be found"
    //       })
    // }
    // const groupId = event.groupId
    // const group = await Group.findByPk(groupId)
    // const membership = await Membership.findOne({
    //     where: {
    //         userId: userId,
    //         groupId: groupId
    //     }
    // })

    // if (membership.status !== 'co-host' && group.organizerId !== userId){
    //     res.status(404).json({
    //         message: "Unauthorized"
    //     })
    // }
    
    const newImage = await EventImage.create({
        eventId: event.id,
        url: url,
        preview: preview
    })
    
    res.json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    })
})

// Delete an Event specified by its id
router.delete('/:eventId', requireAuth, async (req, res, next) => {
    // const { user } = req
    // const userId = user.id

    // const eventId = req.params.eventId

    // const event = await Event.findByPk(eventId)
    // if(!event) {
    //     return res.status(404).json({
    //         message: "Event couldn't be found"
    //       })
    // }
    // const groupId = event.groupId
    // const group = await Group.findByPk(groupId)
    // const membership = await Membership.findOne({
    //     where: {
    //         userId: userId,
    //         groupId: groupId
    //     }
    // })

    // if (membership.status !== 'co-host' && group.organizerId !== userId){
    //     return res.status(401).json({
    //         message: "Unauthorized"
    //     })
    // }
    const eventId = req.params.eventId

    const event = await Event.findByPk(eventId)

    await event.destroy()
    return res.json({
        message: "Successfully deleted"
    })
})
// Edit an Event specified by its id
router.put('/:eventId', requireAuth, async(req, res, next) => {
    const { user } = req
    const userId = user.id
    const eventId = req.params.eventId
    const { venueId, name, type, capacity, price, description, startDate, endDate} = req.body
    const errors = {}
    const event = await Event.findByPk(eventId)
    
    const group = await Group.findByPk(event.groupId)

    const membership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: group.id
        }
    })

    if (membership.status !== 'co-host' && group.organizerId !== userId){
        res.status(401).json({
            message: "Unauthorized"
        })
    }

    // Validate venueId
    const venue = await Venue.findByPk(venueId)
    if (!venueId) {
        event.venueId = null
    } else {
        if (!venue) {
            errors.venueId = "Venue does not exist"
        } else {
            event.venueId = venueId
        }
    }
    // Validate name
    if (!name || name.length < 5) {
        errors.name = "Name must be at least 5 characters"
    } else {
        event.name = name
    }
    // Validate type
    if (type !== 'Online' && type !== 'In person') {
        errors.type = "Type must be Online or In person"
    } else {
        event.type = type
    }
    // Validate Capacity
    if (typeof capacity !== 'number') {
        errors.capacity = "Capacity must be an integer"
    } else {
        event.capacity = capacity
    }
    // Validate Price
    if (!price || price < 0) {
        errors.price = "Price is invalid" 
    } else {
        event.price = price
    }
    // Validate description
    if (!description) {
        errors.description = "Description is required"
    } else {
        event.description = description
    }
    // Validate start date
    const currentDate = new Date()
    if (!startDate || startDate <= currentDate) {
        errors.startDate = "Start date must be in the future"
    } else {
        event.startDate = startDate
    }
    // Validate end Date
    if (!endDate || endDate < startDate) {
        errors.endDate = "End date is less than start date"
    } else {
        event.endDate = endDate
    }
    

    if(Object.keys(errors).length > 1) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        })
    } else if (Object.keys(errors).length === 1 && Object.values(errors.venueId)) {
        return res.status(404).json({
                message: "Event couldn't be found"
        })
    } 
    
        await event.save()

        return res.status(200).json({
            id: event.id,
            groupId: event.groupId,
            venueId: event.venueId,
            name: event.name,
            type: event.type,
            capacity: event.capacity,
            price: event.price,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate
        })

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
