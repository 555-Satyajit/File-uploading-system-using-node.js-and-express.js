const path =require('path')
const express = require('express')
const app = express()
const fs = require('fs');
const multer  = require('multer')


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname,'public')))
app.set('view engine','ejs')




app.get('/', function (req, res) {
    const directoryPath = path.join(__dirname, 'uploads'); // Path to your files directory
    fs.readdir(directoryPath, function (err, files) {
        res.render('index', {upload: files }); // Render 'index.ejs' and pass 'files' array as data
    });

})



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Uploads directory setup
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Preserve original filename
    },
    limits: {
        fileSize: 10000 * 1024 * 1024,
    },
});
const upload = multer({ storage: storage });


app.post('/upload', upload.single('fileUpload'), function (req, res) {
    // 'file' is the name attribute of your file input field in the form

    // Access the uploaded file details
    const uploadedFile = req.fileUpload;

    // Example response to indicate successful upload
    res.redirect('/')
});

app.get('/del/:filename', function (req, res) {
    const filepath = req.params.filename;

    const directoryPath = path.join(__dirname, 'uploads',filepath); // Path to your files directory
    fs.unlink(directoryPath, function (err) {
        res.redirect('/');
    });

})
// Route to download a file
app.get('/download/:filename', function (req, res) {
    const filename = req.params.filename; // Get filename from request parameters

    // Construct the path to the file in the 'uploads' directory
    const filePath = path.join(__dirname, 'uploads', filename);

    // Send the file back to the client
    res.download(filePath, function (err) {
        if (err) {
            // Handle error, such as file not found
            console.error('Error downloading file:', err);
            res.status(404).send('File not found');
        } else {
            // File download successful
            console.log('File downloaded successfully:', filename);
        }
    });
});
app.get('/edit/:files', function (req, res) {

    res.render('edit',{file:req.params.files})
  });

app.post('/edit', function (req, res) {
    const oldFileName = req.body.Name;
    const newFileName = req.body.content1;
  
    const directoryPath = path.join(__dirname, 'uploads');
    const oldFilePath = path.join(directoryPath, oldFileName);
    const newFilePath = path.join(directoryPath, newFileName);
  
    fs.rename(oldFilePath, newFilePath, function (err) {
     
      res.redirect('/');
    });
  });



app.listen(3000)