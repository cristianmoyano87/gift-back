var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express!' });
});


const fs = require('fs');

/* GET gift proposal */
router.get('/propose', function(req, res, next) {
  fs.readFile('./db/proposal.json', (err, data) => {
    if (err) throw err;
    const proposalAll = JSON.parse(data)
    const proposal = Math.floor(Math.random() * proposalAll.length)
    res.json(proposalAll[proposal]);
    });
});

/* GET gifts listing. */
router.get('/getall', function(req, res, next) {
  fs.readFile('./db/gifts.json', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
    });
});

/* POST new gift item */
router.post("/new", (req, res) => {
  const crypto = require('crypto');
  console.log(crypto.randomUUID())
  const {body} = req
  const newGift = {id:crypto.randomUUID(), ...body}

  fs.readFile('./db/gifts.json', (err, data) => {
    if (err) throw err;
    const existingGifts = JSON.parse(data)
    const newGifts = [...existingGifts, newGift]
    fs.writeFile('./db/gifts.json', JSON.stringify(newGifts),(error) => {
      if (error) {
        console.log('Error: ', error)
        res.sendStatus(500);
      } else {
        console.log('added !')
        res.sendStatus(201);
      }
    })
  });
});

/* PUT edit gift item */
router.put("/edit", (req, res) => {
  const updatedGift = req.body
  
  fs.readFile('./db/gifts.json', (err, data) => {
    if (err) throw err;
    const existingGifts = JSON.parse(data)
    const searchGift = (item) => item.id === updatedGift.id
    const position = existingGifts.findIndex(searchGift)
    const newGifts = [...existingGifts]
    newGifts.splice(position,1,updatedGift)

    fs.writeFile('./db/gifts.json', JSON.stringify(newGifts),(error) => {
      if (error) {
        console.log('Error: ', error)
        res.sendStatus(500);
      } else {
        console.log('updated !')
        res.sendStatus(204);
      }
    })
  });
});

/* DELETE gift item */
router.delete("/:id", (req, res) => {
  fs.readFile('./db/gifts.json', (err, data) => {
    if (err) throw err;
    const existingGifts = JSON.parse(data)
    const newGifts = existingGifts.filter(gift => gift.id !== req.params.id)
    
    fs.writeFile('./db/gifts.json', JSON.stringify(newGifts),(error) => {
      if (error) {
        console.log('Error: ', error)
        res.sendStatus(500);
      } else {
        console.log('deleted !')
        res.sendStatus(204);
      }
    })
  });
})

module.exports = router;
