const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Venue, User, Group, Membership } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateVenueVals = [
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

//Edit a Venue specified by its id
router.put('/:venueId', requireAuth, validateVenueVals, async(req, res, next) => {
    const { user } = req
    const userId = user.id
    const venueId = req.params.venueId
    const { address, city, state, lat, lng } = req.body

    const venue = await Venue.findByPk(venueId, {
        include: [Group]
    })
    // Check if the user is co-host
    const membership = await Membership.findOne({
        where: {
            userId: userId,
            groupId: venue.groupId
        }
    })
    // Get organizer Id
    const group = await Group.findByPk(venue.groupId) 

    if (membership.status !== 'co-host' && group.organizerId !== userId) {
        res.json('You must be the founder or co-host')
    }

    if (address) venue.address = address
    if (city) venue.city = city
    if (state) venue.state = state
    if (lat) venue.lat = lat
    if (lng) venue.lng = lng

    await venue.save()

    let updatedVenue = {
        id: venue.id,
        groupId: venue.groupId,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        lat: venue.lat,
        lng: venue.lng,
        createdAt: venue.createdAt,
        updatedAt: new Date()
    }

    res.json(updatedVenue)
})

module.exports = router;
