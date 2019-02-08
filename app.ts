const cheerio = require('cheerio');
const rp = require('request-promise');


function scrap(channel: string, message: number) {
	let URI =  `http://t.me/${channel}/${message}?embed=1`	
	let options =
	{
		uri: URI,
		method: 'POST',
		resolveWithFullResponse: true,
	}

	return new Promise((res, req) => {
		rp(options)
			.then((response) => {
				let body = response.body	
				if (response.statusCode == 200) { 
					let $ = cheerio.load(body)
					let data = {}
					let data.usr: string = $('div.tgme_widget_message_author').text() // parse the author of the message
	           		let data.msg: string = $('div.tgme_widget_message_text').text() // parse the message itself
					res(data)
				} else {
					console.error("channel not found" + response.statusCode)
				}
			})
			.catch((e: string) => req(e))
	})
};

scrap("pythonita", 7).then(data => console.log(`${data.usr}: ${data.msg}`)).catch(e => console.error(e)) // this is just a test btw

