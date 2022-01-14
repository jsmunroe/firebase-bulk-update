var admin = require("firebase-admin");
var serviceAccount = require("./service_key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "files");

try {
let files = fs.readdirSync(directoryPath);

uploadAll(firestore, files);

function uploadAll(firestore, files) {
    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        const lastDotIndex = file.lastIndexOf(".");
        const collectionName = file.substring(0, lastDotIndex);
        const objects = require("./files/" + file);

        for (let j = 0; j < objects.length; j++) {
            let object = objects[j];

            const itemId = `${object.version}:${object.key}`;
            const doc = firestore.collection(collectionName).doc(itemId);
            doc.set(object).then(() => {
                console.log(`Document ${itemId} uploaded!`)
            }).catch(error => {
                console.error(`Error uploading document: ${error}`)
            });
        }
    }
}

} catch (error) {
    console.error(`Error uploading document: ${error}`);
}

console.log('finished!');