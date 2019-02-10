'use strict';
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
						msg: $('div.tgme_widget_message_text').text(), // parse the message itself
						date: $('a.tgme_widget_message_date').text(),
						img: $("div.tgme_widget_message_photo").html(),
						err: $('div.tgme_widget_message_error').text(),
					}
					if (data['err'] != null) {
						console.error(data['err'])
					}
					res(data)
				} else {
				console.error('error ', response.statusCode)
				}
			})
			.catch((e: string) => req(e))
	})
};

scrap('golangitaddajdajhd', 26431).then(data => {
	if (data['img'] != null) {
		console.log(`${data['usr']}: [Image] ${data['msg']}	${data['date']}`, data['img'],)
	} 	else if (data['msg']  == '' && data['usr'] == '' && data['img'] == '') {
		console.log('service message')
	} else {
		console.log(`${data['usr']}: ${data['msg']} ${data['date']}`)
	}
})
.catch(e => console.error(e)); //exaple of usage
