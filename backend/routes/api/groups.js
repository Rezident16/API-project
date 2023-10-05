const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, sequelize, Membership, User, GroupImage, Venue, Event, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateGroupCreate = [
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 60 })
      .withMessage('Name must be 60 characters or less'),
    check('about')
      .exists({ checkFalsy: true })
      .isLength({ min: 50 })
      .withMessage('About must be 50 characters or more'),
    check('type')
      .exists({ checkFalsy: true })
      .isIn(['In Person', 'Online'])
      .withMessage('Type must be \'Online\' or \'In person\''),
    check('private')
      .exists({ checkFalsy: true })
      .isBoolean()
      .withMessage('Private must be a boolean'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    handleValidationErrors
  ];

const validateVenueCreate = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude is not valid'),
    check('lng')
      .exists({ checkFalsy: true })
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude is not valid'),
    handleValidationErrors
  ];


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
    
      if (memberId === currUserId || currUserId === group.organizerId) {
        await membership.destroy()
        return res.status(200).json({
            message: "Successfully deleted membership from group"
        })
      } else {
        return res.status(403).json({message: "Forbidden"})
      }

})
// Change the status of a membership for a group specified by id
router.put('/:groupdId/membership', requireAuth, async (req, res, next) => {
    const { user } = req
    const userId = user.id
    const groupId = req.params.groupdId

    const { memberId, status } = req.body

    if (status === 'pending') return res.status(400).json({
        message: "Validations Error",
        errors: {
          status : "Cannot change a membership status to pending"
        }
      })

   const group = await Group.findByPk(groupId)
   if (!group) return res.status(404).json({
    message: "Group couldn't be found"
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
    const currUserMembership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: groupId
        }
    })

    if(!membershipNewUser) return res.status(404).json({
        message: "Membership between the user and the group does not exist"
    })

    // Authorisation
    if (status === "member" && currUserMembership.status !== 'co-host') {
        return res.status(403).json({message: "Forbidden"})
    }

    if (status === 'co-host' && group.organizerId !== userId) {
        return res.status(403).json({message: "Forbidden"})
    }

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
router.post('/:groupId/membership', async (req, res, next) => {
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
    const organizerId = group.organizerId
    const users = []
    if (userId !== organizerId) {
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
        return res.status(403).json({
            message: "You have not joined the group"
        })
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
        return res.status(200).json(newEvent)
    }


    // res.json({
    //     id: createNewEvent.id,
    //     groupId: createNewEvent.groupId,
    //     venueId: createNewEvent.venueId,
    //     name: createNewEvent.name,
    //     type: createNewEvent.type,
    //     price: createNewEvent.price,
    //     description: createNewEvent.description,
    //     startDate: createNewEvent.startDate,
    //     endDate: createNewEvent.endDate
    // })

    
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
    let eventList = []

    events.forEach(event => {
        eventList.push(event.toJSON())
    })

    eventList.forEach(event => {
        event.previewImage = 'No images available for preview'
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

        delete event.description
        delete event.createdAt
        delete event.updatedAt
        delete event.EventImages
    })

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
router.post('/:groupId/venues', requireAuth, validateVenueCreate, async(req, res, next) => {
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
    if (group.organizerId != user.id && userMembership.status !== 'co-host') {
        return res.status(403).json({message: "Forbidden"})
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

        let previewImage = 'Preview not available';
        if (!group.GroupImages) previewImage = 'Group hasn\'t added any images'

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
router.put('/:groupId', requireAuth, validateGroupCreate, async(req, res, next) => {
    const { user } = req;
    const groupId = req.params.groupId;
    const { name, about, type, private, city, state } = req.body

    const group = await Group.findByPk(groupId)
    if (!group) {
        res.status(404).json({
            message: "Group couldn't be found",
          })
    }

    if (user.id !== group.organizerId) return res.status(403).json({message: "Forbidden"})

    if (name) group.name = name;
    if (about) group.about = about;
    if (type) group.type = type;
    if (private) group.private = private;
    if (city) group.city = city;
    if (state) group.state = state
    
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
    
    const group = await Group.findByPk(groupId, {
        include: [{
            model: GroupImage,
            attributes: ['id', 'url', 'preview']
        }, 
        {
            model: User,
        },
        {
            model: Venue,
            attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'],
        }]
    })
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
          })
    }

    let groupJson = group.toJSON()
    // Num Members
    const organizer = await User.findByPk(groupJson.organizerId, {
        attributes: ['id', 'firstName', 'lastName']
    })
    const Memberships = await Membership.findAll({
        where: {
            groupId: group.id,
            status: ['member', 'co-host']
        }
    })
    groupJson.numMembers = Memberships.length
    groupJson.Organizer = organizer

    groupJson.Users.forEach(user => {
        delete user.Membership
    })
    groupJson.Venues.forEach(venue => {
        delete venue.Event
    })

    // res.json(groupJson)
    return res.status(200).json({
        id: groupJson.id,
        organizerId: groupJson.organizerId,
        name: groupJson.name,
        about: groupJson.about,
        type: groupJson.type,
        private: groupJson.private,
        city: groupJson.city,
        state: groupJson.state,
        createdAt: groupJson.createdAt,
        updatedAt: groupJson.updatedAt,
        numMembers: groupJson.numMembers,
        GroupImages: groupJson.GroupImages,
        Organizer: groupJson.Organizer,
        Venues: groupJson.Venues
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
        let previewImage = 'Preview not available';
        if (!group.GroupImages) previewImage = 'Group hasn\'t added any images'

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
router.post('/', validateGroupCreate, requireAuth, async (req,res, next) => {
    const { name, about, type, private, city, state } = req.body
    const { user } = req;
    const currentUser = await User.findByPk(user.id);

    const group = await Group.create({ 
        organizerId: user.id,
        name, 
        about, 
        type, 
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
    return res.json({newGroup})
})

module.exports = router;
