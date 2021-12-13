const express = require('express');
const router = express.Router();
const {CATEGORY} = require('../models/category.model')

router.get('/',async(req,res)=>{
    const categories = await CATEGORY.find();
    if(!categories) return res.status(500).json({msg:"Error Canno't Get Categories"})

    res.status(200).send(categories)
})

router.get('/:id',async (req,res)=>{
    const {id} = req.params;
    const category = await CATEGORY.findById(id)

    if(!category) return res.status(404).json({msg:"Category Not Found"})
    res.status(200).send(category); 
})


router.post('/create',async(req,res)=>{
    const {
        name,
        icon
    } = req.body
    // const categoryExist = CATEGORY.findOne({name:name});

    // if(categoryExist) return res.status(401).json({msg:"This Category Is Already Exist"})

    const category = new CATEGORY({
        name,
        icon
    })
    await category.save();
    if(!category)  return res.status(400).json({msg:"The Category Cannot Be Created!"});
    res.send(category);
})

router.put('/update/:id',async (req,res)=>{
    const {id} = req.params;
    const {
        name,
        icon
    } = req.body
    const category = await CATEGORY.findByIdAndUpdate(id,
        {
            name,
            icon
        },
        {new:true});
    if(!category) return res.status(401).json({msg:'Category Cannot Be Updated'});

    res.status(200).send(category);
})

router.delete('/delete/:id', async (req,res)=>{
    const {id} = req.params;
    const category = await CATEGORY.findByIdAndDelete(id)
    if(!category) return res.status(401).json({msg:'Category Not Found'});
    res.status(200).json({msg:'Category Deleted Successfully'})
})
module.exports = router;