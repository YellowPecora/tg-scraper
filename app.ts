//'use strict';
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
				if (response.statusCode == 200) { 
					let $ = cheerio.load(response.body)
					let data = 
						{
							usr: $('div.tgme_widget_message_author').text(), // parse the author of the message
							txt: $('div.tgme_widget_message_text').text(), // parse the message itself
						}
					if (data.txt == '' && data.usr == '') {
						console.log('service message')
					}
					res(data)
				} else {
					console.error("channel not found" + response.statusCode)
				}
			})
			.catch((e: string) => req(e))
	})
};

scrap('linguaggioc', 215901).then(data => console.log(data)).catch(e => console.error(e));
