const express=require("express")
const router=express.Router()
const {signup,login,updateProfile,logout,staffuser,manageruser,adminuser,pendingusers,removeuser,approveuser,makemanager,changeRole}=require('../controller/authcontroller')
const {authmiddleware,adminmiddleware,managermiddleware}=require('../middleware/Authmiddleware')






router.post("/signup",signup)
router.post("/login",login)
router.delete("/removeuser/:UserId",authmiddleware,adminmiddleware,removeuser)
router.put("/approveuser/:UserId",authmiddleware,approveuser)
router.put("/makemanager/:UserId",authmiddleware,adminmiddleware,makemanager)
router.put("/changerole/:UserId",authmiddleware,adminmiddleware,changeRole)
router.get("/staffuser",authmiddleware,staffuser)
router.get("/manageruser",authmiddleware,manageruser)
router.get("/adminuser",authmiddleware,adminuser)
router.get("/pendingusers",authmiddleware,pendingusers)
router.post("/logout",authmiddleware,logout)
router.put("/updateProfile",authmiddleware,updateProfile)









module.exports=router