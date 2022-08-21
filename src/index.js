// const request = require('request');
const pexels = require('pexels');
const https = require('https');
const fs = require('fs');
const path = require('path');

const client = pexels.createClient("563492ad6f9170000100000140a1c246edb841f69d0693994b5ada4e");
const query = 'apple';

let photosArr = []
let photosUrl = []

function downloadImage(url, filepath) {

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
}

const run = async function () {
    
    await client.photos.search({ query, per_page: 10 }).then(json => {
        photosArr = json.photos
        let counter = 0

        photosArr.forEach(photo => {
            photosUrl.push(photo.src.original)
        })

        var dirPath = path.join(__dirname, "images", query);

        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath, {recursive: true}, err => {
                console.log(err)
            });
        }

        photosUrl.forEach(async url => {
            let fileName = String(++counter).concat(".jpeg")
            let filePath = path.join(dirPath, fileName)
            downloadImage(url, filePath)
        })
    })
}

run()



