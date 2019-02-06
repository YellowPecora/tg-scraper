const cheerio = require('cheerio');
const rp = require('request-promise');


function scrap(channel: string, message: number) {
	let URI =  `http://t.me/${channel}/${message}?embed=1`	
	let options =
	{
		uri: URI,
		method: 'POST',
	}

	return new Promise((res, req) => {
		rp(options)
			.then((response, body) => {
				if (response.statusCode == 200) {
					let $ = cheerio.load(body)
					console.log(typeof $, typeof response)
					let user: string = $('div.tgme_widget_message_author') // parse the author of the message
	           		let message: string = $('div.tgme_widget_message_text') // parse the message itself
					let data =
					{
						usr: user,
						msg: message,
					}
					res(data)
				} else {
				console.error("channel not found" + response)
				}
			})
			.catch((e: string) => req(e))
	})
};

scrap("pythonita", 7).then(data => console.log(data)).catch(e => console.error(e)) // this is just a test btw

