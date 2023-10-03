const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, sequelize, Membership, User, GroupImage, Venue } = require('../../db/models');
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

// Get all venues for a group specified by id
router.get('/:groupId/venues', requireAuth, async(req, res, next) => {
    const { user } = req;
    const groupId = req.params.groupId
    const group = await Group.findByPk(groupId, {
        include: [User, Venue]
    })

    if (!group) {
        res.status(404).json({
            "message": "Group couldn't be found",
          })
    }

    const userMembership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId
        }
    })
    if (group.organizerId != user.id && userMembership.status !== 'co-host') {
        return res.json('You must be the founder or co-host')
    }

    let venueList = []
    group.Venues.forEach(venue => {
        venueList.push(venue.toJSON())
    })
    venueList.forEach(venue => {
        delete venue.createdAt
        delete venue.updatedAt
        delete venue.Event
    })
    res.json(venueList)
})

// Create new venue for a group
router.post('/:groupId/venues', requireAuth, validateVenueCreate, async(req, res, next) => {
    const { user } = req;
    const groupId = req.params.groupId
    const { address, city, state, lat, lng } = req.body
    const group = await Group.findByPk(groupId, {
        include: [User, Venue]
    })

    if (!group) {
        res.status(404).json({
            "message": "Group couldn't be found",
          })
    }

    const userMembership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId
        }
    })
    if (group.organizerId != user.id && userMembership.status !== 'co-host') {
        return res.json('You must be the founder or co-host')
    }

    const venue = await Venue.create({
        groupId: group.id,
        address,
        city,
        state,
        lat,
        lng
    })

    res.json(venue)

})


// Add an Image to a Group based on the Group's id
router.post('/:groupId/images', requireAuth, async(req,res,next) => {
    const groupId = req.params.groupId
    const { url, preview } = req.body
    const { user } = req;

    const group = await Group.findByPk(groupId)
    if (!group) {
        res.status(404).json({
            "message": "Group couldn't be found",
          })
    }

    if (user.id !== group.organizerId) throw new Error('You must be the organizer for the group')
    const newImage = await GroupImage.create({
        url: url,
        preview: preview
    })
    res.json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    })
})

// Get all groups for current user
router.get('/current', requireAuth, async(req,res, next) => {
    const { user } = req;
    const currentUser = await User.findByPk(user.id);
    const Memberships = await Membership.findAll({
        where: {
            userId: user.id,
            status: {
                [Op.in]: ['member', 'co-host']
            }
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
        group.numMembers = Memberships.length;

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
    return res.json(groupList)
})

// Update Group by its id
router.put('/:groupId', requireAuth, validateGroupCreate, async(req, res, next) => {
    const { user } = req;
    const groupId = req.params.groupId;
    const { name, about, type, private, city, state } = req.body

    const group = await Group.findByPk(groupId)
    if (!group) {
        res.status(404).json({
            "message": "Group couldn't be found",
          })
    }

    if (user.id !== group.organizerId) throw new Error('You must be the organizer for the group')

    if (name) group.name = name;
    if (about) group.about = about;
    if (type) group.type = type;
    if (private) group.private = private;
    if (city) group.city = city;
    if (state) group.state = state

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
        updatedAt: new Date()
    })
})
// Get details of a group by id
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
        res.status(404).json({
            "message": "Group couldn't be found",
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
    res.json({
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

// Delete Group
router.delete('/:groupId', requireAuth, async(req,res,next) => {
    const { user } = req;
    const groupId = req.params.groupId;
    const { name, about, type, private, city, state } = req.body

    const group = await Group.findByPk(groupId)
    if (!group) {
        res.status(404).json({
            "message": "Group couldn't be found",
          })
    }

    if (user.id !== group.organizerId) throw new Error('You must be the organizer for the group')

    await group.destroy()

    res.json({
        "message": "Successfully deleted"
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
    return res.json(groupList)
})

// Create group
router.post('/', validateGroupCreate, requireAuth, async (req,res) => {
    const { name, about, type, private, city, state } = req.body
    const { user } = req;
    const currentUser = await User.findByPk(user.id);
    // const userId = currentUser.id
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
    res.json({group: newGroup})
})

module.exports = router;
