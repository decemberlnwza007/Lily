import axios from 'axios'

const BASE_URL = 'https://api.textbee.dev/api/v1'
const API_KEY = '24bb3ff3-3a95-4f7f-a583-2d8dc6d745b2'
const DEVICE_ID = 'DEVICE_ID'
const phone = '+phone' // thai example: +66918058602 

const response = await axios.post(
  `${BASE_URL}/gateway/devices/${DEVICE_ID}/send-sms`,
  {
    recipients: [phone],
    message: '🤡 Lilly ขอแจ้งอาการของ ภัทรพล หินประกอบ ว่ามีโอกาศเสี่ยงเป็นโรคซึมเส้าขึ้นรุนแรง'
  },
  { headers: { 'x-api-key': API_KEY } }
)

console.log(response.data)