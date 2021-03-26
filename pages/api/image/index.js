import pinataSDK from '@pinata/sdk';

export default function handler(req, res) {
  const pinata = pinataSDK('0702c647ed6118e9645b', 'f7498b9e51adbfe35fa25d9ef906391f0c360091c82b43ee814bd20e2676f3e5');
  pinata.testAuthentication().then((result) => {
    res.status(200).json({ success: true, msg: "Pinata authentication successful" })
  }).catch((err) => {
    res.status(500).json({ success: false, msg: err.msg })
  });
}