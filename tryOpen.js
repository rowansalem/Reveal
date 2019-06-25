var express   =    require("express");
var mysql     =    require('mysql');
var app       =    express();
//var iconv = require('iconv');
//const utf8 = require('utf8');
//var utf8 = require("./utf8")
var encoding = require("encoding");

var http = require('http');

app.use(express.static('public'));

var Request = require("request");

/*/var formData = {
  		operations:[
  			{"engine": {"facets":[],"mode":"record-based"}},
	{"clusterer": {"type":"binning","function":"fingerprint","column":"city","params":{}}}
]
};
 
Request.post({url:'http://127.0.0.1:3333/command/core/compute-clusters?project=1568228348625&operations?', operations: formData}, function(err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }
  console.log('Upload successful!  Server responded with:', body);
});
/**/


const options = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/compute-clusters?project=1913117724042&operations?",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8" },
    body:"engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22record-based%22%7D&clusterer=%7B%22type%22%3A%22binning%22%2C%22function%22%3A%22fingerprint%22%2C%22column%22%3A%22city%22%2C%22params%22%3A%7B%7D%7D"
};

Request(options, function (err, res, body) {
    if(err) console.log(err);
   // console.dir(JSON.parse(body));
    setData(JSON.parse(body));
});


function setData(data){
	
// enter the names of the table columns with the data
	var count = "c";
	var value = "v";
	var total=0;
	var cities=[];
	var values=[];
	var i;	
	var j;	
	var occrel = 0.49;

	/*/	for (_val in data){
	total = total + parseInt(data[_val][value], 10);
		}/*/
// cycle all the data received and I take the different plants + all the different dates
	for (i in data){
		var Rcount=data[i][0][count];
		var Rep = data[i][0][value];
		var Tcount=0;
		var cluster=[];
			for (j in data[i])
			{
				if((Rcount/data[i][j][count]+Tcount)>=occrel)
				{
					cluster.push(data[i][j][value]);	
					Tcount=data[i][j][count]+Tcount;
				}
			}
			//console.log(cluster);
			//console.log(Rep);
			values.push({from:cluster,to:Rep});
			//cities.push(data[i][count]); 
			//console.log(data[i][count]);
			//console.log(data[i]);
			//console.log(data[i][0][count]);
			
			//values.push({name:data[_val][city],y:10});
			//values.push({name:data[_val][city],y:Number((parseInt(data[_val][value], 10)/total)*100).toFixed(2)});

			//values.push({name:data[_val][count],y:data[_val][value]});
			//console.log(data[i][value]);
		
		
		
	}
	console.dir(values);
	console.log(encodeURIComponent(JSON.stringify(values)))
   // var ic = new iconv.Iconv('iso-8859-1', 'utf-8');
	const options = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/mass-edit?project=1913117724042",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8"},
    body:"columnName=city&expression=value&edits="+encodeURIComponent(JSON.stringify(values))+"&engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22record-based%22%7D"
};

Request(options, function (err, res, body) {
    if(err) console.log(err);
    console.dir(JSON.parse(body));
});

	
}

