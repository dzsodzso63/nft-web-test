import pinataSDK from '@pinata/sdk';
import https from 'https';
import fs from 'fs';

export default function handler(req, res) {
  const pinata = pinataSDK('0702c647ed6118e9645b', 'f7498b9e51adbfe35fa25d9ef906391f0c360091c82b43ee814bd20e2676f3e5');
  pinata.testAuthentication().then((result) => {
    https.get('https://i.picsum.photos/id/324/200/300.jpg', resp => resp.pipe(fs.createWriteStream(`./picture.jpg`)));
    pinata.pinFromFS("./picture.jpg").then((result) => {
      res.status(200).json({ success: true, msg: result })
    }).catch((err) => {
      res.status(500).json({ success: false, msg: err.msg })
    })
  }).catch((err) => {
    res.status(500).json({ success: false, msg: err.msg })
  })
}