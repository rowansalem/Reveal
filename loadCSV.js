'use strict';

const parse      = require('csv-parse');
const util       = require('util');
const fs         = require('fs');
const path       = require('path');
const mysql      = require('mysql');
const async      = require('async');
const csvHeaders = require('csv-headers');
const leftpad    = require('leftpad');


function loadCSV (){
    const csvfn ="wuzzuf_cleaned_catg.csv";
    const dbnm  ="JobPosts";
    const tblnm ="wuzzuf";
    new Promise((resolve, reject) => {
        csvHeaders({
            file      : csvfn,
            delimiter : ','
        }, function(err, headers) {
            if (err) reject(err);
            else resolve({ headers });
        });
    })
    .then(context => {
        return new Promise((resolve, reject) => {
            context.db = mysql.createConnection({
              connectionLimit: 10,
              host: '127.0.0.1',
              port   : 3306,
              user     : 'root',
              password : 'password',
                database : dbnm
                      });
            context.db.connect((err) => {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    reject(err);
                } else {
                    resolve(context);
                }
            });
        })
    })
    
    
    .then(context => {
        return new Promise((resolve, reject) => {
            var fields = '';
            var fieldnms = '';
            var qs = '';
            context.headers.forEach(hdr => {
                hdr = hdr.replace(' ', '_');
                hdr = hdr.replace('"', '');
                hdr = hdr.replace('"', '');
                if (fields !== '') fields += ',';
                if (fieldnms !== '') fieldnms += ','
                if (qs !== '') qs += ',';
                fields += ` ${hdr} TEXT`;
                fieldnms += ` ${hdr}`;
                qs += ' ?';
            });
            context.qs = qs;
            context.fieldnms = fieldnms;
            context.db.query(' ALTER TABLE wuzzuf CONVERT TO CHARACTER SET utf8;',
                  err => {
                        if (err) reject(err);
                        else resolve(context);
                    })
            context.db.query(' DELETE FROM wuzzuf;',
                          err => {
                                if (err) reject(err);
                                else resolve(context);
                            })
        });
    })
    
    .then(context => {
        return new Promise((resolve, reject) => {
            fs.createReadStream(csvfn).pipe(parse({
                delimiter: ',',
                columns: true,
                relax_column_count: true
            }, (err, data) => {
                if (err) return reject(err);
                var count=0;
                async.eachSeries(data, (datum, next) => {
                    //console.log(`about to run INSERT INTO ${tblnm} ( ${context.fieldnms} ) VALUES ( ${context.qs} )`);
                    var d = [];
                    try {
                        context.headers.forEach(hdr => {
                            hdr = hdr.replace('"', '');
                          hdr = hdr.replace('"', '');
                           //console.log(hdr)
                      d.push(datum[hdr]);
                        });
                    } catch (e) {
                        console.error(e.stack);
                    }
                     //console.log(`${d.length}: ${util.inspect(d)}`);
                    if (d.length > 0) {
                        count=count+1;
                            // console.log(count);
                        context.db.query(`INSERT INTO ${tblnm} ( ${context.fieldnms} ) VALUES ( ${context.qs} )`, d,
                        err => {
                            if (err) { console.error(err); next(err); }
                            else setTimeout(() => { next(); });
                        });
                    } else { console.log(`empty row ${util.inspect(datum)} ${util.inspect(d)}`); next(); }
                },
                err => {
                    if (err) reject(err);
                    else resolve(context);
                });
            }));
        });
    })
    .then(context => { context.db.end(); })
    .catch(err => { console.error(err.stack); });
    console.log("finish Load CSV");
    
}
module.exports = {
    loadCSV
};