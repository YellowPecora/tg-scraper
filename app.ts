const cheerio = require('cheerio');
const rp = require('request-promise');


function scrap(channel:string, message:number) {
	let options = 
	{
		uri: 'http://t.me/${channel}/${message}?embed=1',
		method: 'POST',
		transform: ((body) => cheerio.load(body)),
	}

	rp(options)
		.then(($) => {
			if (response.statusCode == 200) {
				let user:string = $('div.tgme_widget_message_author')
				let message:string  = $('div.tgme_widget_message_text')
				let data = 
					{
						usr: user,
						msg: message,
					}
			};
			console.err('error: channel ${channel} not found');
		});
		.catch((e:string) => console.err(e););
	return data;

}

scrap("pythonita", 7)
