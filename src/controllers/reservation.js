"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Reservation Controller:

const Reservation = require('../models/reservation');
const Car = require("../models/car");

module.exports = {

    list: async (req, res) => {
        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "List Cars"
            #swagger.description = `
                You can send query with endpoint for filter[], search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `
        */

        const data = await res.getModelList(Reservation)

        res.status(200).send({
            error: false,
            details: await res.getModelListDetails(Reservation),
            data
        })
    },

    // CRUD:

    create: async (req, res) => {
        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Create Reservation"
        */
        
        //! we take the carId, startDate and endDate from req.body to check the reservation is suitable
        const { carId, startDate, endDate } = req.body;
    
        try {

            //! we check for the car if it exists and also the isPublish parameter is true
            const car = await Car.findById(carId);
            if (!car || !car.isPublish) {
                return res.status(400).send({
                    error: true,
                    message: "This car is already reserved or does not exist."
                });
            }

            //! We check the dates if are they avaible for reservation
            const existingReservations = await Reservation.find({
                userId: req.user.id,
                $or: [
                    { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }, // Yeni başlangıç tarihi mevcut rezervasyon aralığında
                    { endDate: { $gte: new Date(startDate) }, startDate: { $lte: new Date(endDate) } } // Düzeltme: Burası endDate olmalıydı ve koşul yeniden düzenlendi
                ]
            });
    
            if (existingReservations.length > 0) {
                // Mevcut rezervasyon varsa, hata mesajı gönder
                return res.status(400).send({
                    error: true,
                    message: "You already have a reservation in the requested date range. Please choose a different date range."
                });
            }
    
            //! Create the reservation
            const newReservation = await Reservation.create({
                ...req.body,
                userId: req.user.id
            });

            //! If the reservation is successful we change the isPublish to false 
            await Car.updateOne({ _id: carId }, { isPublish: false });

    
            res.status(201).send({
                error: false,
                data: newReservation
            });
    
        } catch (error) {
            res.status(500).send({
                error: true,
                message: "An error occurred while creating the reservation."
            });
        }
    },
    

    read: async (req, res) => {
        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Get Single Reservation"
        */

        //! if the user is not admin and staff
        if (!req.user.isAdmin && !req.user.isStaff) {
            //! if we get in to this "if" it means that a user is in the system. 
            //! And the user can only see the owned reservation. 
            //! Can't see other users reservations.
            //* we get find the users reservation first and
            const self_reservation_id = await Reservation.findOne({ userId: req.user.id });

            //* if the users reservation exists we show it to user
            if (self_reservation_id) {
                const data = await Reservation.findOne({ _id: self_reservation_id })

                res.status(200).send({
                    error: false,
                    data
                })
            
            //* "else" means that that user have not a reservation to show or don't have permission
            } else {
                res.status(404).send({
                    error: true,
                    message: "Can't find the reservation or you don't have a permission to reach this reservation"
                });
            }
        
        //* this "else" shows that this user is admin or staff. And they can see all of the reservations thats why we just show it.
        } else {
            const data = await Reservation.findOne({ _id: req.params.id })

            res.status(200).send({
                error: false,
                data
            })
        }
       
        // const self_reservation_id = Reservation.findOne({ userId: req.user.id })

        // const data = await Reservation.findOne({ _id: self_reservation_id })

        
    },

    update: async (req, res) => {
        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Update Reservation"
        */
        
        // console.log(req.file) // upload.sinle()
        // console.log(req.files) // upload.array() || upload.any()

        // Mevcut Reservation resimlerini getir:
        // const Reservation = await Reservation.findOne({ _id: req.params.id }, { _id: 0, createdId })

        // Reservation.images
        // for (let file of req.files) {
        //     // Mevcut Reservation resimlerine ekle:
        //     // Reservation.images.push(file.filename)
        //     Reservation.images.push('/uploads/' + file.filename)
        // }
        // // Reservation resimlerini req.body'ye aktar:
        // req.body.images = Reservation.images
        // console.log(req.body);

        // const Reservation = await Reservation.findOne({ _id: req.params.id }, { _id: 0, createdId })


        const data = await Reservation.updateOne({ _id: req.params.id }, { runValidators: true })
        // const data = await Reservation.updateOne(
        //     { _id: req.params.id },
        //     { ...req.body, images: [...Reservation.images] },
        //     { runValidators: true }
        //   );

        res.status(202).send({
            error: false,
            data,
            new: await Reservation.findOne({ _id: req.params.id })
        })
    },

    delete: async (req, res) => {
        /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Delete Reservation"
        */

        const data = await Reservation.deleteOne({ _id: req.params.id })

        res.status(data.deletedCount ? 204 : 404).send({
            error: !data.deletedCount,
            data
        })
    }
}