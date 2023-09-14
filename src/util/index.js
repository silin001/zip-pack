const fs = require('fs');
 function deleteFile (filePath) {
 try {
  fs.unlinkSync(filePath);
  console.log('File deleted successfully.');
 } catch (err) {
  console.error('Error deleting file:', err);
 }
}

module.exports = {
 deleteFile
}