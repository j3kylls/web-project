const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { Readable } = require('stream');


// Load service account key
const KEYFILEPATH = path.join(__dirname, '..', 'driveServiceAccount.json');

// Set scopes required for full Drive access
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES
});

const drive = google.drive({ version: 'v3', auth });

// ID of shared root folder in your Google Drive (replace this manually later)
const ROOT_FOLDER_ID = '1oSGU22z3d89dIHU-VHMMLRopcfdQog8X';

module.exports = {
  createUserFolder: async (userId) => {
    const res = await drive.files.create({
      resource: {
        name: `User_${userId}`,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [ROOT_FOLDER_ID]
      },
      fields: 'id'
    });
    return res.data.id;
  },

  uploadFileToFolder: async (folderId, fileBuffer, filename, mimetype) => {
    const fileMetadata = {
      name: filename,
      parents: [folderId]
    };
    const { Readable } = require('stream');
    const media = {
      mimeType: mimetype,
      body: Readable.from(fileBuffer)
    };

    const res = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink'
    });

    // Make the file public
    await drive.permissions.create({
      fileId: res.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    return {
      id: res.data.id,
      viewLink: res.data.webViewLink,
      downloadLink: res.data.webContentLink
    };
  },

  deleteFile: async (fileId) => {
    await drive.files.delete({ fileId });
    return true;
  }
};
