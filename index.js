module.exports = (context, basicIO) => {
	
const catalyst = require('zcatalyst-sdk-node');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
var lastUpdated="";
var flag;


const OpenAI = require('openai');
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});



async function downloadImage(url, tempDir) {
	try {
	  const response = await axios.get(url, { responseType: 'arraybuffer' });
	  const fileBuffer = Buffer.from(response.data);
  
	  const tempFilePath = path.join(tempDir, 'image.jpg');
  
	  fs.writeFileSync(tempFilePath, fileBuffer);
  
	  return tempFilePath;
	} catch (error) {
	  console.error('Error downloading image:', error.message);
	}
  }

  async function wishGenerate(age){
	//openai cred save strt
			const chatCompletion = await openai.chat.completions.create({
				messages: [{ role: "user", content: "write a attractive-eyecatching-bdaywishpoem for "+ age +"yearold. Atlast Greetings for completing the age. Give this in single paragraph no line break" }],
				model: "gpt-3.5-turbo-1106",
			});
			console.log(chatCompletion);
			console.log(chatCompletion.choices[0].message.content);
			return chatCompletion.choices[0].message.content;
	//openai cred save end
	
			// return "just test"
		}

	async function thromail(config, catalystApp){
		console.log("entered thromail")
		let email = catalystApp.email();
		return await email.sendMail(config);
	}
	
async function sendInMail(){
const date = new Date();
console.log(date, "todays date and time")


	let name = basicIO.getArgument("name");
	let mail = basicIO.getArgument("email");
	let age = basicIO.getArgument("age");
	let reply = basicIO.getArgument("reply");
	var url = basicIO.getArgument("url");
	let token = basicIO.getArgument("token");
	var img;
	

console.log(basicIO.getAllArguments(), "basicios");

	if(url){
		url = url+"&token="+token;
		console.log(url, "thisisurl");
		const tempDir = require('os').tmpdir();
		await downloadImage(url, tempDir)
		.then((tempFilePath) => {								
		  img = fs.createReadStream(tempFilePath);								  
		})
		.catch((error) => {
		  console.error('Error:', error.message);
		});
	}else{
		img = fs.createReadStream('img.jpg');
	}

	


	await wishGenerate(age).then(async (wishpoem) =>{
		console.log("entered mail config");
		let config = { 
			from_email: 'guruprasath.m@zohomail.in',
			to_email: mail,
			bcc: 'bdaymailer@googlegroups.com',
			reply_to: reply,
			subject: "🎉 Happy Birthday " + name + "! 🎂", 
			content: "Dear " + name + ",\n" + wishpoem,
			attachments: [img]
		};

		console.log("abv thromail")
		await thromail(config, catalystApp).then((m)=>{
		const currentDate = new Date();
		const istOptions = { timeZone: 'Asia/Kolkata' };

		const istDate = currentDate.toLocaleDateString('en-GB', istOptions);
		lastUpdated = istDate.replace(/\//g, '-');
		flag = "success";
		console.log(m, "success");


		}
			).catch((e)=>{
				flag = "fail";
				console.log(e, "errorpromise")})
		console.log("blw thromail");
		

	} )

	const reponse = {
		status: flag,
		lastUpdated: lastUpdated
	}
setTimeout(() => {
		basicIO.write(JSON.stringify(reponse));
	
		context.close()
}, 10000);
}

	//Get Segment instance with segment ID (If no ID is given, Default segment is used)
	// let segment = catalystApp.cache().segment();
	//Insert Cache using put by passing the key-value pair.
	// segment.put("Name", name, 1)
	// 	.then((cache) => {
	// 		context.log("\nInserted Cache : " + JSON.stringify(cache));
	// 		segment.get("Name").then((result) => {
    //             context.log("Got value : " + result);
	// 			basicIO.write(JSON.stringify(result));
	// 			context.close();
    //         });
	// 	})
	// 	.catch((err) => {
	// 		context.log(err);
	// 		basicIO.write(err.toString());
	// 		context.close();
	// 	});
	const catalystApp = catalyst.initialize(context);
	console.log("above sendmymail")
	sendInMail(catalystApp, context);
	console.log("below sendmymail")

}