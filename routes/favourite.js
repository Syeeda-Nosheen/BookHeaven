const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

//add book to favourite
router.put("/add-book-to-favourite", authenticateToken, async(req, res) =>{
    try {
        const { bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookfavourite = userData.favourites.includes(bookid);
        if(isBookfavourite){
          return res.status(200).json({message:"Book is already in favourites"});  
        }
        else{
            await User.findByIdAndUpdate(id, {$push: { favourites: bookid}});
            return res.status(200).json({message:"Book added to favourites"});  
        }
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
});
//delete book from favourite
router.put("/remove-book-to-favourite", authenticateToken, async(req, res) =>{
    try {
        const { bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookfavourite = userData.favourites.includes(bookid);
        if(isBookfavourite){
            await User.findByIdAndUpdate(id, {$pull: { favourites: bookid}});
        }
          return res.status(200).json({message:"Book remove from favourites"});  
        } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
});
// get favourite books of particular user
router.get("/get-favourite-books", authenticateToken, async (req, res) =>{
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate("favourites");
        const favouriteBooks = userData.favourites;
        return res.json({
            status: "Success",
            data: favouriteBooks,
        });
    } catch (error) {
        return res.status(500).json({message:"An error occurred"});
    }
});


module.exports = router;