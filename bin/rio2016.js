#!/usr/bin/env node

let http = require('http');
let Table = require('easy-table');
let minimist = require('minimist');

var argv = minimist(process.argv.slice(2));

let count =  argv.count || 10;

let request = http.request({
    host: 'www.medalbot.com',
    path: '/api/v1/medals'
}, function onResponseReceived(response) {
    var body = '';

    response.on('data', function onDataReceived(data) {
        body += data;
    });

    response.on('end', function onDataReceiptEnded() {
        try {
            let medals = JSON.parse(body);
            let table = new Table;

            medals = medals.slice(0, count);

            medals.forEach(function(medal) {
                table.cell('#', medal.place);
                table.cell('Country', medal.country_name);
                table.cell('Gold', medal.gold_count);
                table.cell('Silver', medal.silver_count);
                table.cell('Bronze', medal.bronze_count);
                table.cell('Total', medal.total_count);

                table.newRow();
            });

            console.log(table.toString());

        } catch (e) {
            console.error('Response received was not a valid JSON');
        }
    });
});

request.end();
