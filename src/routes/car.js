"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/car:

const permissions = require('../middlewares/permissions')
const car = require('../controllers/car')

// URL: /cars

router.route('/')
    .get(permissions.isLogin, car.list)
    .post(permissions.isStaffOrisAdmin, car.create)

router.route('/:id')
    .get(permissions.isLogin, car.read)
    .put(permissions.isStaffOrisAdmin, car.update)
    .patch(permissions.isStaffOrisAdmin,car.update)
    .delete(permissions.isStaffOrisAdmin, car.delete)

/* ------------------------------------------------------- */
module.exports = router