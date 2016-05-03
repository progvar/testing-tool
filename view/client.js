'use strict'

$(document).ready(() => {

	const content = $('tbody')
    const tick = '<i class="fa fa-check"></i>'
    const cross= '<i class="fa fa-times"></i>'


    let ws
    let host
    let counter

	$('#start').click(() => {
        if (ws) {
            ws.close()
            console.log('Reconnecting!')
        }
        counter = 0

        content.empty()
        if (location.origin.indexOf('localhost') !== -1) {
            host = location.origin.replace(/^http/, 'ws')
        } else {
            host = location.origin.replace(/^http/, 'wss')
        }
        console.log(host)
        ws = new WebSocket(host)
        console.log('Connected!')
        console.log(ws)
		ws.onmessage = event => {
            if (event.data == 'update_finished') {
                ws.close()
                console.log('Tests finished on client!')
                console.log('Client has disconnected!')
            } else {
                const context = JSON.parse(event.data)
                let trClass = 'success'

                if (context.error) {
                    trClass = 'danger'
                }

                let req = JSON.stringify(context.req, null, '\  ')
                let res = JSON.stringify(context.res, null, '\  ')

                if (req === 'null') {
                    req = '{}'
                }
                if (res === 'null') {
                    res = '{}'
                }
                
                const title = `<td style='text-align:left;width:650px;'>${context.title}</td>`
                const started = `<td style='text-align: center;'>${context.started}</td>`
                const ended = `<td style='text-align: center;'>${context.ended}</td>`
                const passed = `<td style='text-align: center;'>${context.passed === true && !context.error ? tick : cross }</td>`
                const error = `<td style='text-align: center;'> ${context.error ? context.error : '-'}</td>`
                const tr = `<tr data-toggle='collapse' data-target='#testcase${counter}' 
                class='accordion-toggle ${trClass}'>
                ${title}${started}${ended}${passed}${error}</tr>`

                content.append(tr)

                const reqHrefCollapsible = `<a href='#req${counter}' data-toggle='collapse'>request.json</a>`
                const reqCollapsible = `<pre id='req${counter}' class='collapse'>${req}</pre>`

                const resHrefCollapsible = `<a href='#res${counter}' data-toggle='collapse'>response.json</a>`
                const resCollapsible = `<pre id='res${counter}' class='collapse'>${res}</pre>`

                const hiddenDetails =
                    `<div class='col-lg-6'>${reqHrefCollapsible}${reqCollapsible}</div>
                    <div class='col-lg-6'>${resHrefCollapsible}${resCollapsible}</div>`

                const hiddenDiv = `<td class='hiddenRow'>
                <div class='accordian-body collapse' id='testcase${counter}'>${hiddenDetails}</div></td>`

                const hiddenTr = `<tr>${hiddenDiv}</tr>`

                content.append(hiddenTr)
                counter++
                console.log('I\'m updated')
            }
		}

		$('#stop').click( () => {
            ws.close()
		    console.log('Disconnected!')
		})
	})
})
