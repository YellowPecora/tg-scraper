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
						err: $('div.tgme_widget_message_error'),
					}
					res(data)
					return
				} else {
				console.error('error ', response.statusCode)
				}
            })
			.catch((e: string) => req(e))
	})
};

module tgScraper {
    export function returnResponse(channel: string, message: number, functor) {
        if (typeof functor == undefined) {
            let functor = console.log;
        }

        scrap(channel, message).then((data) => {
            if (data['err'].html() != null) {                                                                                                                                            
                functor(data['err'].text())                                       
                return                                                                   
            } else if (data['img'] != null) {
		        functor(`${data['usr']}: [Image] ${data['msg']}	${data['date']}`, data['img'],)
	        } else if (data['msg']  == '' && data['usr'] == '' && data['img'] == '') {
		        functor('service message')
	        } else {
		        functor(`${data['usr']}: ${data['msg']} ${data['date']}`)
            }
        })
        .catch(e => console.error(e)); 
    };
}
