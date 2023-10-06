const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, sequelize, Membership, User, GroupImage, Venue, Event, EventImage, Attendance } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

// Delete membership to a group specified by id
router.delete('/:groupId/membership', requireAuth, async (req, res, next) => {
    const { user } = req
    const currUserId = user.id
    const { memberId } = req.body
    const groupId = req.params.groupId
    const group = await Group.findByPk(groupId)
    // Group exist validation
    if (!group) return res.status(404).json({
        message: "Group couldn't be found"
    })
    const userToDelete = await User.findByPk(memberId)
    // User exist validation
    if (!userToDelete) return res.status(400).json({
        message: "Validation Error",
        errors: {
          memberId: "User couldn't be found"
        }
      })
    const membership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: groupId
        }
    })
    // Membership exist validation / delete
    if (!membership)
        return res.status(404).json({
        message: "Membership does not exist for this User"
      })
    
      if (memberId !== currUserId && currUserId !== group.organizerId) {
          return res.status(403).json({message: "Forbidden"})
        } else {
            await membership.destroy()
            return res.status(200).json({
                message: "Successfully deleted membership from group"
            })
        }

})
// Change the status of a membership for a group specified by id
router.put('/:groupId/membership', requireAuth, async (req, res, next) => {
    const { user } = req
    const userId = user.id
    const groupId = req.params.groupId

    const { memberId, status } = req.body
    const group = await Group.findByPk(groupId)

    if (!group) return res.status(404).json({
     message: "Group couldn't be found"
    })

    const currUserMembership = await Membership.findOne({
     where: {
         userId: userId,
         groupId: groupId
     }
    })
    if (!currUserMembership) return res.status(403).json({message: "Forbidden"})
    // Authorisation
    if (status === "member" && currUserMembership.status !== 'co-host') {
        return res.status(403).json({message: "Forbidden"})
    }
    
    if (status === 'co-host' && group.organizerId !== userId) {
        return res.status(403).json({message: "Forbidden"})
    }

    if (status === 'pending') return res.status(400).json({
        message: "Validations Error",
        errors: {
          status : "Cannot change a membership status to pending"
        }
      })


   const groupUser = await User.findByPk(memberId)
   if (!groupUser) return res.status(400).json({
    message: "Validation Error",
    errors: {
        memberId: "User couldn't be found"
  }
   })

    const membershipNewUser = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: groupId
        }
    })


    if(!membershipNewUser) return res.status(404).json({
        message: "Membership between the user and the group does not exist"
    })


    membershipNewUser.status = status
    membershipNewUser.updatedAt = new Date()
    await membershipNewUser.save()


    return res.status(200).json({
        id: membershipNewUser.id,
        groupId: membershipNewUser.groupId,
        memberId: membershipNewUser.userId,
        status: membershipNewUser.status,
    })
})
// Request a Membership for a Group based on the Group's id
router.post('/:groupId/membership', requireAuth, async (req, res, next) => {
    const { user } = req
    const userId = user.id
    const groupId = req.params.groupId

    const group = await Group.findByPk(groupId)
    if (!group)  return res.status(404).json({
        message: "Group couldn't be found"
    })

    const membership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: groupId
        }
    })

    if (!membership) {
        newMember = await Membership.create({
            userId: userId,
            groupId: groupId,
            status: "pending"
        })
        return res.status(200).json({
            memberId: userId,
            status: newMember.status
        })
    } else if (membership) {
        if (membership.status === 'pending') {
            return res.status(400).json({
                message: "Membership has already been requested"
            })
        } else {
            return res.status(400).json({
                message: "User is already a member of the group"
            })
        }
    }
})
// Get all Members of a Group specified by its id
router.get('/:groupId/members', async(req, res) => {
    const { user } = req
    const userId = user.id
    const groupId = req.params.groupId

    const group = await Group.findByPk(groupId,{
        include: User
    })
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
        })
    }
    const membership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: groupId
        }
    })
    const organizerId = group.organizerId
    const users = []
    if (!membership) {
        group.Users.forEach(user => {
            if (user.Membership.status !== 'pending') {
                users.push(user.toJSON())
            }
        })
    } else if (userId !== organizerId && membership.status !== 'co-host') {
        group.Users.forEach(user => {
            if (user.Membership.status !== 'pending') {
                users.push(user.toJSON())
            }
        })
    } else {
        group.Users.forEach(user => {
            users.push(user.toJSON())
        })
    }

    users.forEach(user => {
        delete user.username
        delete user.Membership.id
        delete user.Membership.userId
        delete user.Membership.groupId
        delete user.Membership.createdAt
        delete user.Membership.updatedAt
    })

    return res.status(200).json({
        Members: users
    })
})
// Create an Event for a Group specified by its id
router.post('/:groupId/events', requireAuth, async (req, res, next) => {
    const { user } = req
    const userId = user.id
    const groupId = req.params.groupId
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

    const errors = {}


    const group = await Group.findByPk(groupId, {
        include: [Venue]
    })
    const membership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: groupId
        }
    })

    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found"
          })
    }

    if (!membership || membership.status === 'pending') {
        return res.status(403).json({message: "Forbidden"})
    }

    if (membership.status !== 'co-host' && group.organizerId !== userId){
        return res.status(403).json({message: "Forbidden"})
    }
    let newEvent = {}

    // Validate venueId
    const venue = await Venue.findByPk(venueId)
    if (!venueId) {
        newEvent.venueId = null
    } else {
        if (!venue) {
            errors.venueId = "Venue does not exist"
        } else {
            newEvent.venueId = venueId
        }
    }
    
    // Assign groupId to the event
    newEvent.groupId = groupId
    // Validate name
    if (!name || name.length < 5) {
        errors.name = "Name must be at least 5 characters"
    } else {
        newEvent.name = name
    }
    // Validate type
    if (type !== 'Online' && type !== 'In person') {
        errors.type = "Type must be Online or In person"
    } else {
        newEvent.type = type
    }
    // Validate Capacity
    if (typeof capacity !== 'number') {
        errors.capacity = "Capacity must be an integer"
    } else {
        newEvent.capacity = capacity
    }
    // Validate Price
    if (!price || price < 0) {
        errors.price = "Price is invalid" 
    } else {
        newEvent.price = price
    }
    // Validate description
    if (!description) {
        errors.description = "Description is required"
    } else {
        newEvent.description = description
    }
    // Validate start date
    const currentDate = new Date()
    if (!startDate || startDate <= currentDate) {
        errors.startDate = "Start date must be in the future"
    } else {
        newEvent.startDate = startDate
    }
    // Validate end Date
    if (!endDate || endDate < startDate) {
        errors.endDate = "End date is less than start date"
    } else {
        newEvent.endDate = endDate
    }
    

    if(Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        })
    } else {
        const createNewEvent = await Event.create(newEvent)
        const newAttendence = await Attendance.create({
            eventId: createNewEvent.id,
            userId: userId,
            status: 'host'
        })
        return res.status(200).json({
            id: createNewEvent.id,
            groupId: createNewEvent.groupId,
            venueId: createNewEvent.venueId,
            name: createNewEvent.name,
            type: createNewEvent.type,
            capacity: createNewEvent.capacity,
            price: createNewEvent.price,
            description: createNewEvent.description,
            startDate: createNewEvent.startDate,
            endDate: createNewEvent.endDate
        })
    } 
})
// Get all Events of a Group specified by its id
router.get('/:groupId/events', async (req, res) => {
    const groupId = req.params.groupId

    
    const group = await Group.findByPk(groupId, {
        attributes: ['id', 'name', 'city', 'state']
    })

    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
          })
    }

    const events = await Event.findAll({
        where: {
            groupId: group.id
        },
        include: [EventImage]
    })
    const venues = await Venue.findAll({
        where: {
            groupId: group.id,
        },
        attributes: ['id', 'city', 'state']
    })

    const attendances = await Attendance.findAll()
    let eventList = []

    events.forEach(event => {
        eventList.push(event.toJSON())
    })

    eventList.forEach(event => {
        let numAttending = 0
        attendances.forEach(attendance => {
            if (attendance.eventId === event.id && attendance.status === 'attending') {
                numAttending++
            }
        })
    
        event.numAttending = numAttending
        event.previewImage = 'default url'
        event.Group = group
        event.Venue = null
        venues.forEach(venue => {
            if (venue.id === event.venueId) {
                event.Venue = venue
            }
        })
    
        event.EventImages.forEach(image => {
            if (image.preview === true) {
                event.previewImage = image.url
            }
        })

        delete event.capacity
        delete event.description
        delete event.createdAt
        delete event.updatedAt
        delete event.EventImages
    })
    // return res.json(attendances)
    return res.status(200).json({Events: eventList})
})
// Get All Venues for a Group specified by its id
router.get('/:groupId/venues', requireAuth, async(req, res, next) => {
    const { user } = req;
    const userId = user.id
    const groupId = req.params.groupId
    const group = await Group.findByPk(groupId
    //     , {
    //     include: [User, Venue]
    // }
    )

    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
          })
    }

    const userMembership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: groupId
        }
    })
    if (!userMembership) return res.status(403).json({message: "Forbidden"})
    if (group.organizerId != user.id && userMembership.status !== 'co-host') {
        return res.status(403).json({message: "Forbidden"})
    }

    const venuesList = await Venue.findAll({
        where: {
            groupId: groupId
        }
    })
    
    const venues = []
    venuesList.forEach(venue => {
        venues.push(venue.toJSON())
    })

    venues.forEach(venue => {
        delete venue.createdAt
        delete venue.updatedAt
    })
    return res.status(200).json({Venues: venues})
})
// Create a new Venue for a Group specified by its id
router.post('/:groupId/venues', requireAuth, async(req, res, next) => {
    const { user } = req;
    const groupId = req.params.groupId
    const { address, city, state, lat, lng } = req.body
    const group = await Group.findByPk(groupId, {
        include: [User, Venue]
    })

    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
          })
    }

    const userMembership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId
        }
    })
    if(!userMembership) return res.status(403).json({message: "Forbidden"})
    if (group.organizerId != user.id && userMembership.status !== 'co-host') {
        return res.status(403).json({message: "Forbidden"})
    }
    const errors = {}
    let errorTrigger = false
    if (!address) {
        errors.address = "Street address is required"
        errorTrigger = true
    }
    if (!city) {
        errors.city = "City is required"
        errorTrigger = true
    }
    if (!state) {
        errors.state = "State address is required"
        errorTrigger = true
    }
    if (!lat || lat < -90 || lat > 90) {
        errors.lat = "Latitude is not valid"
        errorTrigger = true
    }
    if (!lng || lng < -180 || lng > 180) {
        errors.lng = "Longitude is not valid"
        errorTrigger = true
    }

    if (errorTrigger === true) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        })
    }

    const venue = await Venue.create({
        groupId: group.id,
        address,
        city,
        state,
        lat,
        lng
    })

    return res.status(200).json({
        id: venue.id,
        groupId: venue.groupId,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        lat: venue.lat,
        lng: venue.lng
    })

})
// Add an Image to a Group based on the Group's id
router.post('/:groupId/images', requireAuth, async(req,res,next) => {
    const groupId = req.params.groupId
    const { url, preview } = req.body
    const { user } = req;

    const group = await Group.findByPk(groupId)
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
          })
    }

    if (user.id !== group.organizerId) return res.status(403).json({message: "Forbidden"})
    const newImage = await GroupImage.create({
        groupId: group.id,
        url: url,
        preview: preview
    })
    
    return res.status(200).json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    })
})
// Get all Groups joined or organized by the Current User
router.get('/current', requireAuth, async(req,res, next) => {
    const { user } = req;
    const currentUser = await User.findByPk(user.id);
    const memberships = await Membership.findAll({
            status: {
                [Op.in]: ['member', 'co-host']
            } 
    })
    const groups = await currentUser.getGroups({
        include: [
            {
                model: User,
            },
            {
                model: GroupImage,
                attributes: ['preview', 'url']
            }
        
        ],
    })

    let groupList = []

    groups.forEach(group => {
        groupList.push(group.toJSON())
    });

    groupList.forEach(group => {

        let numMembers = 0
        memberships.forEach(membership => {
            if (membership.groupId === group.id && membership.status !== 'pending') numMembers++
        })
        group.numMembers = numMembers;

        let previewImage = 'default url';

        group.GroupImages.forEach(image => {
            if (image.preview === true) {
                previewImage = image.url
            }
            return
        })
        group.previewImage = previewImage
        delete group.Users
        delete group.GroupImages
        delete group.Membership
    })
    return res.status(200).json({Groups: groupList})
})
// Edit a Group
router.put('/:groupId', requireAuth, async(req, res, next) => {
    const { user } = req;
    const groupId = req.params.groupId;
    const { name, about, type, private, city, state } = req.body
    const group = await Group.findByPk(groupId)
    if (!group) {
        res.status(404).json({
            message: "Group couldn't be found",
        })
    }
    
    const errors = {}
    let errorTrigger = false
    if (user.id !== group.organizerId) return res.status(403).json({message: "Forbidden"})
    // Validate name
    if (!name || name.length > 60) {
        errors.name = "Name must be 60 characters or less"
        errorTrigger = true
    } else {
        group.name = name
    }

    // Validate about
    if (!about || about.length < 50) {
        errors.about = "About must be 50 characters or more"
        errorTrigger = true
    } else {
        group.about = about;
    }
    
    // Validate type
    if (type.toLowerCase() != 'online' && type.toLowerCase() != 'in person') {
        errors.type = "Type must be 'Online' or 'In person'"
        errorTrigger = true
    } else {
        group.type = type[0].toUpperCase() + type.slice(1).toLowerCase();
    }
    
    if (private !== true && private !== false) {
        errors.private = "Private must be a boolean"
        errorTrigger = true
    } else {
        group.private = private;
    }

    if (!city) {
        errors.city = "City is required"
        errorTrigger = true
    } else {
        group.city = city
    }

    if (!state) {
        errors.state = "State is required"
        errorTrigger = true
    } else {
        group.state = state
    }
    
    if (errorTrigger === true) {
        return res.status(400).json({
            message: "Bad Request",
            errors: errors
        })
    }
    group.updatedAt = new Date()

    await group.save()

    res.json({
        id: group.id,
        organizerId: group.organizerId,
        name: group.name,
        about: group.about,
        type: group.type,
        private: group.private,
        city: group.city,
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
    })
})
// Get details of a Group from an id
router.get('/:groupId', async (req, res, next) => {
    const groupId = req.params.groupId
    
    const group = await Group.findByPk(groupId)
    if(!group) return res.status(404).json({
        message: "Group couldn't be found"
    })
    const memberships= await Membership.findAll({
        where: {
            groupId: groupId
        }
    })
    let numMembers = 0;
    memberships.forEach(membership => {
        if (membership.status !== 'pending') numMembers++
    })

    const venues = await Venue.findAll({
        where: {
            groupId: groupId
        },
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
    })

    const images = await GroupImage.findAll({
        where: {
            groupId:groupId
        },
        attributes: ['id', 'url', 'preview']
    }) 
    const organizer = await User.findByPk(group.organizerId, {
        attributes: ['id', 'firstName', 'lastName']
    })
    


    res.json({
        id: group.id,
        organizerId: group.organizerId,
        name: group.name,
        about: group.about,
        type: group.type,
        private: group.private,
        city: group.city,
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        numMembers: numMembers,
        GroupImages: images,
        Organizer: organizer,
        Venues: venues
    })
})
// Delete a Group
router.delete('/:groupId', requireAuth, async(req,res,next) => {
    const { user } = req;
    const groupId = req.params.groupId;
    const { name, about, type, private, city, state } = req.body

    const group = await Group.findByPk(groupId)
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
          })
    }

    if (user.id !== group.organizerId) return res.status(403).json({message: "Forbidden"})

    await group.destroy()

    return res.status(200).json({
        message: "Successfully deleted"
      })
})
// Get all groups
router.get('/',  async (req, res) => {
    const groups = await Group.findAll({
        include: [
            {
                model: User //need a count of users
            },
            {
                model: GroupImage,
                attributes: ['preview', 'url']
            }
        ],
    })

    let groupList = []

    groups.forEach(group => {
        groupList.push(group.toJSON())
    });

    groupList.forEach(group => {
        group.numMembers = 0
        const users = group.Users
        users.forEach(user => {
            if (user.Membership.status !== 'pending') group.numMembers ++
        })
        let previewImage = 'default url';

        group.GroupImages.forEach(image => {
            if (image.preview === true) {
                previewImage = image.url
            }
            return
        })
        group.previewImage = previewImage
        delete group.Users
        delete group.GroupImages
    })
    return res.status(200).json({Groups: groupList})
})
// Create a group
router.post('/', requireAuth, async (req,res, next) => {
    const { name, about, type, private, city, state } = req.body
    const { user } = req;

    const errors = {}
    let errorTrigger = false
    // Validate name
    if (!name || name.length > 60) {
        errors.name = "Name must be 60 characters or less"
        errorTrigger = true
    } 

    // Validate about
    if (!about || about.length < 50) {
        errors.about = "About must be 50 characters or more"
        errorTrigger = true
    }
    
    // Validate type
    if (type){
        if (type.toLowerCase() != 'online' && type.toLowerCase() != 'in person') {
            errors.type = "Type must be 'Online' or 'In person'"
            errorTrigger = true
        } 
    } else {
        errors.type = "Type must be 'Online' or 'In person'"
        errorTrigger = true
    }
    
    if (private !== true && private !== false) {
        errors.private = "Private must be a boolean"
        errorTrigger = true
    }

    if (!city) {
        errors.city = "City is required"
        errorTrigger = true
    }

    if (!state) {
        errors.state = "State is required"
        errorTrigger = true
    }
    
    if (errorTrigger === true) {
        return res.status(400).json({
            message: "Bad Request",
            errors: errors
        })
    }

    const group = await Group.create({ 
        organizerId: user.id,
        name, 
        about, 
        type: type[0].toUpperCase() + type.slice(1).toLowerCase(), 
        private, 
        city, 
        state,
        createdAt: new Date(),
        updatedAt: new Date()
     });

    const newMembership = await Membership.create({
        userId: user.id,
        groupId: group.id,
        status: 'co-host'
    })

    newGroup = {
        id: group.id,
        organizerId: user.id,
        name: group.name,
        about: group.about, 
        type: group.type, 
        private: group.private, 
        city: group.city, 
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
    }
    return res.json(newGroup)
})

module.exports = router;
