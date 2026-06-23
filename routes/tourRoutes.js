const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getALLTours);

router.route('/').post(tourController.createTour);
router.route('/').get(authController.protect,tourController.getALLTours);
router.route('/tour-stats').get(tourController.getToursStats);

router.route('/:id').get(tourController.getTour);

router.route('/:id').patch(tourController.updateTour);

router.route('/:id').delete(authController.protect,authController.restrictTo('admin','lead-guid'),tourController.deleteTour);

module.exports = router;
