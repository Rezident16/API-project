const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, sequelize, Membership, User, GroupImage, Venue, Event, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//Delete an Image for a Group
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { user } = req
    const userId = user.id
    const imageId = req.params.imageId

    const image = await EventImage.findByPk(imageId)
    if (!image) return res.status(404).json({
        message: "Event Image couldn't be found"
    })
    const event = await Event.findByPk(image.eventId)
    const group = await Group.findByPk(event.groupId)

    const membership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: group.id
        }
    })
    if (!membership) return res.status(403).json({message: "Forbidden"})
    if (membership.status !== 'co-host' && group.organizerId !== userId) {
        return res.status(403).json({message: "Forbidden"})
    } else {
        await image.destroy()
    
        return res.status(200).json({
            message: "Successfully deleted"
        })
    }

})

module.exports = router
