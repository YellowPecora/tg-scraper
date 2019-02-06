const cheerio = require('cheerio');
const rp = require('request-promise');


function scrap(channel: string, message: number) {
	let options =
	{
		uri: 'http://t.me/${channel}/${message}?embed=1',
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
				console.error("channel not found")
			})
		.catch((e: string) => req(e));
	}
};

let scrap = await scrap("pythonita", 7)
console.log(scrap)

