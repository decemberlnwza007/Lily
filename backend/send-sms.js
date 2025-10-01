import twilio from 'twilio';

const accoundSid = "AC133477c752e7dfc3e5dcdc71dec9e645";
const authToken = "0acbe148ccf90fd0429e77487d977bb1";

const client = twilio(accoundSid, authToken);

client.messages
    .create({
        body: 'สวัสดี! นี่คือข้อความจากระบบของธันวา ',
     from: '+66824462690', 
     to: '+66824462690'    
   })
   .then(message => console.log(message.sid));