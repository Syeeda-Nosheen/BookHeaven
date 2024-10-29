const router = require("express").Router();
const Book = require("../models/book");
const Order = require("../models/order"); 
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

//place order
router.post("/place-order", authenticateToken, async(req, res) =>{
    try {
        const { id } = req.headers;
        const { order } = req.body;
        for (const orderData of order){
            const newOrder = new Order({ user: id, book: orderData._id});
            const orderDataFrom = await newOrder.save();
            //saving order in user mode
            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDataFrom._id},
            });
            //clearing cart
            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id},
            });
        }
        return res.json({
            status: "Success",
            message: "Order placed successfully",
        });
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
});
//get order history of particular user


router.get("/get-order-history", authenticateToken, async (req, res) =>{
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        });
        
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        const orderData = userData.orders.reverse();
        return res.json({
            status: "Success",
            data: orderData,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"An error occurred"});
    }
});

//get all orders
router.get("/get-all-orders", authenticateToken, async (req, res) =>{
    try {
        const userData = await Order.find()
            .populate ({
                path: "book",
            })
            .populate ({
                path: "user",
            })
            .sort({ createdAt: -1});
        return res.json({
            status: "Success",
            data: userData,
        });
    } catch (error) {
        return res.status(500).json({message:"An error occurred"});
    }
});
//update order by admin
router.put("/update-status/:id", authenticateToken, async (req, res) =>{
    try {
        const {id} = req.params;
        await Order.findByIdAndUpdate(id,{status: req.body.status});
        return res.json({
            status: "Success",
            message: "Status updated successfully",
        });
    } catch (error) {
        return res.status(500).json({message:"An error occurred"});
    }
});
module.exports = router;