const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();



router.route('/').post(tourController.createTour);
router.route('/').get(tourController.getALLTours);

router.route('/:id').get(tourController.getTour);

router.route('/:id').patch(tourController.updateTour);

router.route('/:id').delete(tourController.deleteTour);
module.exports = router;
