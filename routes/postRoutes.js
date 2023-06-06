const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), postController.postPost);
router.put('/edit', upload.single('file'), postController.postPut);
router.get('/hello', postController.sayHello);
router.get('/one/:id', postController.fileGetOne);
router.get('/specific/:id', postController.fileGet1);
router.get('/all', postController.fileGetAll);
router.get('/search', postController.fileSearch)
router.get('/hashtag', postController.fileHashtag);
router.get('/user', postController.postsByUser);
router.get('/random', postController.fileGetRandom);
router.get('/nine', postController.fileGetRandom9);
router.get('/likes', postController.postLikes);
router.get('/comments2/:id', postController.fileGetRandomComments);
router.put('/addcomment', postController.addComments);
router.put('/increment', postController.incrementLikes);
router.put('/decrease', postController.decreaseLikes);
router.delete('/delete', postController.postDelete)

module.exports = router;
