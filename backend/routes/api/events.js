const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Event, Group, Venue, EventImage, Membership, User, Attendance } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

// Authorization with eventId and {user} = req
// router.use('/:eventId', async (req,res,next) => {
//     const { user } = req
//     const userId = user.id

//     const eventId = req.params.eventId

//     const event = await Event.findByPk(eventId)
//     if(!event) {
//         return res.status(404).json({
//             message: "Event couldn't be found"
//           })
//     }
//     const groupId = event.groupId
//     const group = await Group.findByPk(groupId)
//     const membership = await Membership.findOne({
//         where: {
//             userId: userId,
//             groupId: groupId
//         }
//     })

//     if (membership.status !== 'co-host' && group.organizerId !== userId){
//         return res.status(401).json({
//             message: "Unauthorized"
//         })
//     }
//     next()
// })



// Delete attendance to an event specified by id
router.delete('/:eventId/attendance', requireAuth, async (req, res, next) => {
    const eventId = req.params.eventId
    const { userId } = req.body
    const {user} = req
    const currUserId = user.id

    const event = await Event.findByPk(eventId)

    // Event doesn't exist
    if(!event) return res.status(404).json({
        message: "Event couldn't be found"
    })

    const attendance = await Attendance.findOne({
        where: {
            userId: userId,
            eventId: eventId
        }
    })
    // Attendance doesn't exist
    if (!attendance) return res.status(404).json({
        message: "Attendance does not exist for this User"
    })

    const group = await Group.findByPk(event.groupId)
    
    // Only the User or organizer may delete an Attendance
    if (userId === currUserId || currUserId === group.organizerId) {
        await attendance.destroy()
        return res.status(200).json({message: "Successfully deleted attendance from event"})
    } else {
        return res.status(403).json({
            message: "Only the User or organizer may delete an Attendance"
        })
    }

})
// Change the status of an attendance for an event specified by id
router.put('/:eventId/attendance', requireAuth, async(req, res, next) => {
    const { user } = req
    const curruserId = user.id
    const eventId = req.params.eventId
    const event = await Event.findByPk(eventId)
    const{ userId, status } = req.body

    if (!event) return res.status(404).json({
        message: "Event couldn't be found"
    })
    
    const group = await Group.findByPk(event.groupId)

    const membership = await Membership.findOne({
        where: {
            userId:curruserId,
            groupId: group.id
        }})

    if (!membership) return res.status(403).json({message: "Forbidden"})
    if (group.organizerId !== curruserId && membership.status !== 'co-host') {
        return res.status(403).json({message: "Forbidden"})
    }
    if (status === 'pending') return res.status(400).json({
        message: "Cannot change an attendance status to pending"
    })

    const attendance = await Attendance.findOne({
        where:{
            eventId: eventId,
            userId: userId
        }
    })
    if (!attendance) return res.status(404).json({
        message: "Attendance between the user and the event does not exist"
    })
    attendance.status = status
    attendance.updatedAt = new Date()
    await attendance.save()
    return res.status(200).json({
        id: attendance.id,
        eventId: attendance.eventId,
        userId: attendance.userId,
        status: attendance.status
    })

})
// Request to Attend an Event based on the Event's id
router.post('/:eventId/attendance', requireAuth, async(req, res, next) => {
    const { user } = req
    const userId = user.id
    const eventId = req.params.eventId
    const event = await Event.findByPk(eventId)
    if (!event) return res.status(404).json({
        message: "Event couldn't be found"
    })
    const membership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: event.groupId
        }
    })
    if (!membership || membership.status === 'pending') return res.status(403).json({message: "Forbidden"})

    const attendance = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId:userId
        }
    })

    if (attendance) {
        if(attendance.status === 'attending' || attendance.status === 'co-host' || attendance.status === 'host' ) {
            return res.status(400).json({
                message: "User is already an attendee of the event"
            })
        } else {
            return res.status(400).json({
                message: "Attendance has already been requested"
            })
        }
    }
    const newAttendence = await Attendance.create({
            eventId: eventId,
            userId: userId,
            status: 'pending'
    })

    return res.status(200).json({
        userId: newAttendence.userId,
        status: newAttendence.status
    })
})
// Get all Attendees of an Event specified by its id
router.get('/:eventId/attendees', async (req, res) => {
    const { user } = req
    const userId = user.id
    const eventId = req.params.eventId

    // check if event exists
    const event = await Event.findByPk(eventId, {
        include: [User]
    })
    if (!event) return res.status(404).json({
        message: "Event couldn't be found"
    })

    const group = await Group.findByPk(event.groupId)
    const membership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: group.id
        }
    })
    let attendeesList = event.Users
    let attendees = []
    if (!membership) {
        attendeesList.forEach(attendee => {
            if (attendee.Attendance.status !== 'pending') {
                attendees.push(attendee.toJSON())
            }
        })
    } else {
        if (membership.status === 'co-host' || group.organizerId === userId) {
            attendeesList.forEach(attendee => {
                attendees.push(attendee.toJSON())
            })
        } else {
            attendeesList.forEach(attendee => {
                if (attendee.Attendance.status !== 'pending') {
                    attendees.push(attendee.toJSON())
                }
            })
        }
    }
    attendees.forEach(attendee => {
        delete attendee.username
        delete attendee.Attendance.id
        delete attendee.Attendance.eventId
        delete attendee.Attendance.userId
        delete attendee.Attendance.createdAt
        delete attendee.Attendance.updatedAt
    })
    return res.status(200).json({
        Attendees: attendees
    })
})
// Add an Image to a Event based on the Event's id
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    const { user } = req
    const userId = user.id
    const eventId = req.params.eventId
    const { url, preview } = req.body
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
    const attendance = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: userId
        }
    })
    if (!membership) return res.status(403).json({message: "Forbidden"})
    if (!attendance) return res.status(403).json({message: "Forbidden"})
    if (membership.status !== 'co-host' && group.organizerId !== userId && attendance.status !== 'attending' && attendance.status !== 'host' && attendance.status !== 'co-host'){
        return res.status(403).json({message: "Forbidden"})
    }
    
    const newImage = await EventImage.create({
        eventId: event.id,
        url: url,
        preview: preview
    })
    
    return res.status(200).json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    })
})
// Delete an Event specified by its id
router.delete('/:eventId', requireAuth, async (req, res, next) => {
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

    if (!membership) return res.status(403).json({message: "Forbidden"})
    if (membership.status !== 'co-host' && group.organizerId !== userId){
        return res.status(403).json({message: "Forbidden"})
    }
    // const eventId = req.params.eventId

    // const event = await Event.findByPk(eventId)

    await event.destroy()
    return res.status(200).json({
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
    
    if (!event) return res.status(404).json({
        message: "Venue couldn't be found"
    })
    const group = await Group.findByPk(event.groupId)

    const membership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: group.id
        }
    })
    if(!membership) return res.status(403).json({message: "Forbidden"})
    if (membership.status !== 'co-host' && group.organizerId !== userId){
        return res.status(403).json({message: "Forbidden"})
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
        return res.json({
            message: "Bad Request",
            errors
        })
    } else if (Object.keys(errors).length === 1 && errors.venueId) {
        return res.json({
                message: "Event couldn't be found"
        })
    }

    event.updatedAt = new Date()
    
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
    const event = await Event.findByPk(eventId)

    if (!event) {
        return res.status(404).json({
            message: "Event couldn't be found"
          })
    }
    let eventJson = event.toJSON()
    // num Attending
    const attendances = await Attendance.findAll({
        where:{
            eventId: event.id
        }
    })
    let numAttending = 0
    attendances.forEach(attendance => {
        if (attendance.status === 'attending' || attendance.status === 'host' || attendance.status === 'co-host') numAttending++
    })
    eventJson.numAttending = numAttending

    // Group Info
    const group = await Group.findByPk(event.groupId, {
        attributes: ['id', 'name', 'private', 'city', 'state']
    })
    
    eventJson.price = parseFloat(eventJson.price)
    eventJson.Group = group

    // Venue info
    eventJson.Venue = null

    const venue = await Venue.findByPk(event.venueId, {
        attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
    })
    if (venue) eventJson.Venue = venue

    const EventImages = await EventImage.findAll({
        where: {
            eventId: event.id
        },
        attributes: ['id', 'url', 'preview']
    })

    eventJson.EventImages = EventImages
    delete eventJson.createdAt
    delete eventJson.updatedAt
    
    return res.status(200).json(eventJson)
})
// Get all Events
router.get('/', async (req, res) => {
    const { page, size, name, type, startDate } = req.query
    
    const errors = {}
    const pagination = {};
    let errorTrigger = false

    if (page !== undefined && page < 0) {
        errors.page = "Page must be greater than or equal to 1"
        errorTrigger = true
    }
    if (size !== undefined && size < 0 ) {
        errors.size = "Size must be greater than or equal to 1"
        errorTrigger = true
    }

    if (!size) pagination.limit = 20;
    if (size > 0) {
        pagination.limit = size
    }
    
    if (!page) pagination.offset = 0;

    if (page > 0) {
        pagination.offset = pagination.limit * (page - 1)
    }
    
    const where = {}

    if (name !== undefined) {
        let nameWithNoQuotes
        if (name.includes("'")) {
            nameWithNoQuotes = name.split("'")[1]
        } else if (name.includes('"')) {
            nameWithNoQuotes = name.split('"')[1]
        } else {
            nameWithNoQuotes = name
        }
        if (!isNaN(parseInt(nameWithNoQuotes))) {
            errors.name = "Name must be a string"
            errorTrigger = true
        } else {
            where.name = nameWithNoQuotes
        }
    }

    if (type !== undefined) {
        let passedType = type.toLowerCase()
        if (!passedType.includes("online") && !passedType.includes("in person")) {
            errors.type = "Type must be 'Online' or 'In Person'"
            errorTrigger = true
        } else {
            if (passedType.includes("online")) where.type = 'Online'
            if (passedType.includes("in person")) where.type = 'In person'
        }
    }

    if (startDate !== undefined) {
        let dateWithNoQuotes
            if (startDate.includes("'")) {
                dateWithNoQuotes = startDate.split("'")[1]
            } else if (startDate.includes('"')) {
                dateWithNoQuotes = startDate.split('"')[1]
            } else {
                dateWithNoQuotes = startDate
            }
        
        const [date, time] = dateWithNoQuotes.split(' ')
        
        const reqDate = new Date(date)
        if (reqDate.toString() === 'Invalid Date') {
            errors.startDate = "Start date must be a valid datetime"
            errorTrigger = true
        } 
        else {
            let after = new Date(reqDate.getTime());
            after.setDate(reqDate.getDate() + 1)
            where.startDate = {
                [Op.gte]: reqDate,
                [Op.lt]: after
            }
        }
    }

    if (errorTrigger === true) {
        return res.status(400).json({
            message: "Bad Request",
            errors: errors
        })
    }
    const events = await Event.findAll({
        where,
        include: [EventImage],
        limit: pagination.limit,
        offset: pagination.offset
    })

    const groups = await Group.findAll( {
        attributes: ['id', 'name', 'city', 'state']
    })

    const venues = await Venue.findAll({
        attributes: ['id', 'city', 'state']
    })

    const attendance = await Attendance.findAll()

    let eventList = []

    events.forEach(event => {
        eventList.push(event.toJSON())
    });

    eventList.forEach(event => {
        let numAttending = 0
        attendance.forEach(attendee => {
            if (event.id === attendee.eventId) {
                if (attendee.status === 'attending' || attendee.status === 'host' || attendee.status === 'co-host') {
                    numAttending++
                }

            }
        })
        event.numAttending = numAttending
        event.previewImage = 'default.url'
        
        event.EventImages.forEach(image => {
            // console.log(image)
            if (image.preview === true) {
                event.previewImage = image.url
                return
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
            }
        })
        if (!event.Venue) event.Venue = null
        delete event.price
        delete event.capacity
        delete event.description
        delete event.EventImages
        delete event.createdAt
        delete event.updatedAt
        // console.log(event)
    })

    return res.json({Events: eventList})
})

module.exports = router;
