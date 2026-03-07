import fs from 'fs';

function getPngDimensions(filePath) {
    const data = fs.readFileSync(filePath);
    if (data.slice(0, 8).toString('hex') !== '89504e470d0a1a0a') {
        throw new Error('Not a PNG file');
    }
    const width = data.readUInt32BE(16);
    const height = data.readUInt32BE(20);
    return { width, height };
}

try {
    const dims = getPngDimensions('e:/Get_Job_And_Go/Frontend/public/logo.png');
    console.log(JSON.stringify(dims));
} catch (e) {
    console.error(e.message);
}
