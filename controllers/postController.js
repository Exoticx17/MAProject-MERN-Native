const express = require('express');
const { ObjectID } = require('mongodb');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const archiver = require('archiver')
const Grid = require('gridfs-stream');
const JSONStream = require('JSONStream');
const mergeStream = require('merge-stream');
const url = 'mongodb+srv://XFusional:cc1ss7abc@blogcluster.dvlp2.mongodb.net/Posts?retryWrites=true&w=majority'


function getRandomElements(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const postPost = (req, res) => {
  try {
    const file = req.file;
    const originalname = file.originalname;
    const buffer = file.buffer;
    const mimetype = file.mimetype;

    mongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.log('Error connecting to the database');
        res.status(500).send({ message: 'Error connecting to the database' });
      } else {
        console.log('Connected to the database');
        const db = client.db('Posts');
        const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

        const uploadStream = bucket.openUploadStream(originalname, {
          contentType: mimetype,
          metadata: {
            name: req.query.name,
            description: req.query.description,
            hashtags: req.query.hashtags,
            comments: [],
            likes: 0,
            user: req.query.userid
          }
        });

        uploadStream.end(buffer, () => {
          console.log('File uploaded successfully');
          res.send({ id: uploadStream.id });
          client.close();
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error uploading file' });
  }
};




const sayHello = (req,res) => {
  try {
      console.log('sayHello function called');
      res.json('Hello')
  } catch (err) {
      console.log(err);
      res.status(500).send({ message: 'Error saying hello' });
  }
}

const fileGetOne = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });
    const files = await bucket.find({ _id: ObjectID(req.params.id) }).toArray();
    if (!files || files.length === 0) {
      res.status(404).send({ message: 'File not found' });
    } else {
      const file = files[0];
      const readStream = bucket.openDownloadStream(file._id);
      res.set('Content-Type', file.contentType);
      res.set('X-File-Metadata', JSON.stringify(file.metadata));
      readStream.pipe(res);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error retrieving file' });
  }
};

const fileGet1 = async (req, res) => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });
    const file = await bucket.find({ _id: ObjectID(req.params.id) }).toArray();
    if (!file || file.length === 0) {
      res.status(404).send({ message: 'File not found' });
    } else {
      const metadata = file[0].metadata;
      const fileId = file[0]._id.toString();

      const response = { metadata, fileId };
  
      res.status(200).send(response);
    }
    client.close();
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error retrieving file' });
  }
};





const fileGetAll = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    const files = await bucket.find().toArray();

    if (!files || files.length === 0) {
      res.status(404).send({ message: 'Files not found' });
      return;
    }

    const metadata = [];
    const fileIds = [];

    files.forEach(file => {
      metadata.push(file.metadata);
      fileIds.push(file._id);
    });

    const response = {
      files: metadata.map((metadata, i) => ({ metadata, fileId: fileIds[i].toString() }))
    };

    res.status(200).send(response);

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error retrieving files' });
  }
};

const fileSearch = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    const name = req.query.name;

    const files = await bucket.find({$text: {$search: name, $caseSensitive: false}}).toArray();

    const metadata = [];
    const fileIds = [];

    files.forEach(file => {
      metadata.push(file.metadata);
      fileIds.push(file._id);
    });

    const response = {
      files: metadata.map((metadata, i) => ({ metadata, fileId: fileIds[i].toString() }))
    };

    await client.close();

    if (!files || files.length === 0) {
      return res.status(404).send({ message: 'Files not found' });
    }

    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Error retrieving files' });
  }
};

const { MongoClient } = require('mongodb');

const fileGetRandom = async (req, res) => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    const files = await bucket.find().toArray();

    if (files.length === 0) {
      res.status(404).send({ message: 'Files not found' });
      return;
    }

    const randomFiles = getRandomElements(files, 4);

    const response = {
      files: randomFiles.map(file => ({
        metadata: file.metadata,
        fileId: file._id.toString()
      }))
    };

    res.status(200).send(response);

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error retrieving random files' });
  }
};

const fileGetRandom9 = async (req, res) => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    const files = await bucket.find().toArray();

    if (files.length === 0) {
      res.status(404).send({ message: 'Files not found' });
      return;
    }

    const randomFiles = getRandomElements(files, 9);

    const response = {
      files: randomFiles.map(file => ({
        metadata: file.metadata,
        fileId: file._id.toString()
      }))
    };

    res.status(200).send(response);

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error retrieving random files' });
  }
};

// Helper function to get random elements from an array
function getRandomElements(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const fileGetRandomComments = async (req, res) => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    const id = req.params.id;

    const file = await bucket.find({ _id: ObjectID(id) }).toArray();

    if (file.length === 0) {
      res.status(404).send({ message: 'File not found' });
      return;
    }

    const metadata = file[0].metadata;
    const comments = metadata.comments;

    if (!comments || comments.length === 0) {
      res.status(404).send({ message: 'No comments found for the file' });
      return;
    }

    const randomComments = getRandomElements(comments, 2);

    const response = {
      fileId: file[0]._id.toString(),
      comments: randomComments
    };

    res.status(200).send(response);

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error retrieving random comments' });
  }
};





const fileHashtag = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    const hashtag = req.query.hashtag;

    const files = await bucket.find({
      'metadata.hashtags': { $in: [hashtag] }
    }).toArray();

    const metadata = [];
    const fileIds = [];

    files.forEach(file => {
      metadata.push(file.metadata);
      fileIds.push(file._id);
    });

    const response = {
      files: metadata.map((metadata, i) => ({ metadata, fileId: fileIds[i].toString() }))
    };

    await client.close();

    if (!files || files.length === 0) {
      return res.status(404).send({ message: 'Files not found' });
    }

    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Error retrieving files' });
  }
};

const postLikes = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    const files = await bucket.find({
      'metadata.likes': { $gt: 3 }
    }).toArray();

    const metadata = [];
    const fileIds = [];

    files.forEach(file => {
      metadata.push(file.metadata);
      fileIds.push(file._id);
    });

    let response;
    if (!files || files.length === 0) {
      response = { message: 'Files not found' };
    } else {
      const randomIndex = Math.floor(Math.random() * files.length);
      response = { metadata: metadata[randomIndex], fileId: fileIds[randomIndex] };
    }

    await client.close();

    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Error retrieving files' });
  }
};



const addHashtags = async (req, res) => {
  const fileId = req.query.id;
  const hashtags = req.body.hashtags;

  try {
    const client = await mongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const filesCollection = db.collection('files.files');

    const file = await filesCollection.findOne({ _id: ObjectID(fileId) });

    if (!file) {
      res.status(404).send({ message: 'File not found' });
      return;
    }

    const updatedFile = await filesCollection.updateOne(
      { _id: ObjectID(fileId) },
      { $addToSet: { 'metadata.hashtags': { $each: hashtags } } }
    );

    res.status(200).send({ message: 'Hashtags added to file' });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error adding hashtags to file' });
  }
};

const addComments = async (req, res) => {
  const fileId = req.query.id;
  const comment = req.query.comment;

  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const filesCollection = db.collection('files.files');

    const file = await filesCollection.findOne({ _id: ObjectID(fileId) });

    if (!file) {
      res.status(404).send({ message: 'File not found' });
      return;
    }

    const updatedFile = await filesCollection.updateOne(
      { _id: ObjectID(fileId) },
      { $addToSet: { 'metadata.comments': comment } }
    );

    res.status(200).send({ message: 'Comment added to file' });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error adding comment to file' });
  }
};


const incrementLikes = async (req, res) => {
  const fileId = req.query.id;

  try {
    const client = await mongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const filesCollection = db.collection('files.files');

    const file = await filesCollection.findOne({ _id: ObjectID(fileId) });

    if (!file) {
      res.status(404).send({ message: 'File not found' });
      return;
    }

    const updatedFile = await filesCollection.updateOne(
      { _id: ObjectID(fileId) },
      { $inc: { 'metadata.likes': 1 } }
    );

    res.status(200).send({ message: 'Likes incremented for file' });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error incrementing likes for file' });
  }
};

const decreaseLikes = async (req, res) => {
  const fileId = req.query.id;

  try {
    const client = await mongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const filesCollection = db.collection('files.files');

    const file = await filesCollection.findOne({ _id: ObjectID(fileId) });

    if (!file) {
      res.status(404).send({ message: 'File not found' });
      return;
    }

    const updatedFile = await filesCollection.updateOne(
      { _id: ObjectID(fileId) },
      { $inc: { 'metadata.likes': -1 } }
    );

    res.status(200).send({ message: 'Likes decreased for file' });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error incrementing likes for file' });
  }
};

const postPut = (req, res) => {
  try {
    const file = req.file;
    const originalname = file.originalname;
    const buffer = file.buffer;
    const mimetype = file.mimetype;

    mongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        res.status(500).send({ message: 'Error connecting to database' });
      } else {
        const db = client.db('Posts');
        const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

        // Delete the previous version of the file using the provided file ID
        bucket.delete(new mongodb.ObjectID(req.query.id), (err) => {
          if (err) {
            res.status(500).send({ message: 'Error deleting the previous version of the file' });
            client.close();
          } else {
            // Upload the new version of the file
            const uploadStream = bucket.openUploadStream(originalname, { contentType: mimetype, metadata: {
              name: req.query.name,
              description: req.query.description,
              hashtags: [],
              comments: [],
              likes: 0,
              user: req.query.userid
            } });
            uploadStream.end(buffer, () => {
              res.send({ id: uploadStream.id });
              client.close();
            });
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};



const postDelete = (req, res) => {
  try {
    mongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        res.status(500).send({ message: 'Error connecting to database' });
      } else {
        const db = client.db('Posts');
        const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

        // Delete the file using the provided file ID
        bucket.delete(new mongodb.ObjectID(req.query.id), (err) => {
          if (err) {
            res.status(500).send({ message: 'Error deleting the file' });
          } else {
            res.send({ message: 'File deleted successfully' });
            client.close();
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};


const postsByUser = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db('Posts');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'files' });

    const userId = req.query.userId;

    const files = await bucket.find({ "metadata.user": userId }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).send({ message: 'No posts found for this user' });
    }

    const randomfiles = getRandomElements(files, 6);

    const metadata = [];
    const fileIds = [];

    randomfiles.forEach(file => {
      metadata.push(file.metadata);
      fileIds.push(file._id);
    });

    const response = {
      posts: metadata.map((metadata, i) => ({ metadata, fileId: fileIds[i] }))
    };

    await client.close();

    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Error retrieving posts' });
  }
};





module.exports= {
    postPost,
    sayHello,
    fileGetAll,
    fileGetOne,
    fileSearch,
    fileHashtag,
    addHashtags,
    addComments,
    postDelete,
    postPut,
    incrementLikes,
    decreaseLikes,
    postsByUser,
    postLikes,
    fileGetRandom,
    fileGetRandom9,
    fileGetRandomComments,
    fileGet1
}
