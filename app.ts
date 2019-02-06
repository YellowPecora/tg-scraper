const cheerio = require('cheerio');
const rp = require('request-promise');


function scrap(channel: string, message: number) {
	let URI =  `http://t.me/${channel}/${message}?embed=1`	
	let options =
	{
		uri: URI,
		method: 'POST',
		transform: body => cheerio.load(body),
	}

	return new Promise((res, req) => {
		rp(options)
			.then(($, response) => {
				if (response.statusCode == 200) {
					let user:string = $('div.tgme_widget_message_author') // parse the author of the message
	             	let message:string = $('div.tgme_widget_message_text') // parse the message itself
					let data =
					{
						usr: user,
						msg: message,
					}
					res(data)
				}
				else if (response.statusCode == 404 || response.errorCode) {
					console.error("channel not found")
				}
			})
		.catch((e: string) => req(e));
	})
};

let scrapaCock=  scrap("pythonita", 7).then(data => console.log(data)).catch(e => console.error(e))

