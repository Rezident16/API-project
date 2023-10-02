const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, sequelize, Membership, User, GroupImage } = require('../../db/models');

const router = express.Router();

// Get all groups for current user
router.get('/current', requireAuth, async(req,res, next) => {
    const { user } = req;
    const currentUser = await User.findByPk(user.id);
    const groups = await currentUser.getGroups({
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
        group.numMembers = group.Users.length;

        let previewImage = 'Preview not available';
        if (!group.GroupImages) previewImage = 'No images'

        group.GroupImages.forEach(image => {
        if (image.preview === true) previewImage = image.url
        })
        group.previewImage = previewImage
        delete group.Users
        delete group.GroupImages
        delete group.Membership
    })
    return res.json(groupList)
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
        group.numMembers = group.Users.length;

        let previewImage = 'Preview not available';
        if (!group.GroupImages) previewImage = 'Group hasn\'t added any images'

        group.GroupImages.forEach(image => {
        if (image.preview === true) previewImage = image.url
        })
        group.previewImage = previewImage
        delete group.Users
        delete group.GroupImages
    })
    return res.json(groupList)
})

module.exports = router;
