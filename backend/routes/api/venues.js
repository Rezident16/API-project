const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Venue, User, Group, Membership } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//Edit a Venue specified by its id
router.put('/:venueId', requireAuth, async(req, res, next) => {
    const { user } = req
    const userId = user.id
    const venueId = req.params.venueId
    const { address, city, state, lat, lng } = req.body

    const venue = await Venue.findByPk(venueId, {
        include: [Group]
    })
    if (!venue) {
        res.status(404).json({
            message: "Venue couldn't be found"
          })
    }
    // Check if the user is co-host
    const membership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: venue.groupId
        }
    })
    // Get organizer Id
    const group = await Group.findByPk(venue.groupId) 
    if(!membership) return res.status(403).json({message: "Forbidden"})
    if (membership.status !== 'co-host' && group.organizerId !== userId) {
        return res.status(403).json({message: "Forbidden"})
    }

    const errors = {}
    let errorTrigger = false
    if (!address) {
        errors.address = "Street address is required"
        errorTrigger = true
    } else {
        venue.address = address
    }

    if (!city) {
        errors.city = "City is required"
        errorTrigger = true
    } else {
        venue.city = city
    }

    if (!state) {
        errors.state = "State address is required"
        errorTrigger = true
    } else {
        venue.state = state
    }

    if (!lat || lat < -90 || lat > 90) {
        errors.lat = "Latitude is not valid"
        errorTrigger = true
    } else {
        venue.lat = lat
    }

    if (!lng || lng < -180 || lng > 180) {
        errors.lng = "Longitude is not valid"
        errorTrigger = true
    } else {
        venue.lng = lng
    }

    if (errorTrigger === true) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        })
    }
    
    venue.updatedAt = new Date()

    await venue.save()

    let updatedVenue = {
        address: venue.address,
        city: venue.city,
        state: venue.state,
        lat: venue.lat,
        lng: venue.lng,
    }

    return res.status(200).json(updatedVenue)
})

module.exports = router;
