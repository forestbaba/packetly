const express = require('express');
const router = express.Router();
const Job = require('./jobModel');
const Riders = require('../riders/riderModel');

router.post('/create', async (req, res) =>{
    if(!req.body.pick_up_address ||  req.body.pick_up_address === ""){
        return res.status(400).json({error: true, message:"pick_up_address is required"})
    }
    if(!req.body.pick_up_state ||  req.body.pick_up_state === ""){
        return res.status(400).json({error: true, message:"pick_up_state is required"})
    }
    if(!req.body.drop_off_address ||  req.body.drop_off_address === ""){
        return res.status(400).json({error: true, message:"drop_off_address is required"})
    }
    if(!req.body.drop_off_state ||  req.body.drop_off_state === ""){
        return res.status(400).json({error: true, message:"drop_off_state is required"})
    }

    if(!req.body.user ||  req.body.user === ""){
        return res.status(400).json({error: true, message:"user is required"})
    }
    if(!req.body.rider ||  req.body.rider === ""){
        return res.status(400).json({error: true, message:"rider is required"})
    }
    if(!req.body.price ||  req.body.price === ""){
        return res.status(400).json({error: true, message:"price is required"})
    }

    const AllRiders = Riders.find({});
    
    const newjob = new Job({
        pick_up_address: req.body.pick_up_address,
        pick_up_state: req.body.pick_up_state,
        drop_off_address: req.body.drop_off_address,
        drop_off_state: req.body.drop_off_state,
        user: req.body.user,
        rider: AllRiders[randomize(0, AllRiders.length)],
        price: req.body.price,
    }).save().then(job =>{
        return res.status(200).json({error: false, message:"Job created", job})
    }).catch(err =>{
        return res.status(400).json({error: true, message:"Error creating Job, please try again later"})
    })

});

router.post('/update_job', (req, res) =>{
    Job.findOne({_id: req.body.jobId})
    .then(job =>{
        if(job){
            job.status = req.body.jonStatus
            job.save().then(job =>{
                return res.status(200).json({error: false, message:"job status updated successfully"})
            })
        }else{
            return res.status(404).json({error: true, message:'Job not found'});
        }

    }).catch(err =>{
        return res.status(400).json({error: true, message:"error updating job status"})
    })
})

router.post('/allJobs', (req, res) =>{
    Job.find({user: req.body.user})
    .then(jobs =>{
        return res.status(200).json({error: false, message:"Jobs fetched", jobs})
    })
    .catch(err =>{
        return res.status(400).json({error: true, message:'Error fetch jobs'})
    })
})

router.get('/getPrice', (req, res) =>{
    const max = 10000;
    const min = 1000;
    const amount =  Math.floor(Math.random() * (max - min + 1) + min)
    return res.status(200).json({error: false, amount, eta: amount <= 3000 ? 2 : amount <= 5000 ? 3 : amount <= 7000 ? 4 : 5});

})
const  randomize =(min, max) =>{  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
  }

module.exports = router;