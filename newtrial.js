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
var rp = require('request-promise');

var projectid;

//ClusterOnJobTitle_metaphone();
function print()
{
  console.log("succeeded with status ");

}

   
async function Modfications_Jobtitle()
{
const options = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/text-transform?columnName=job_title&onError=keep-original&repeat=false&repeatCount=&project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8" ,"Cookie": "host=.butterfly; scripting.lang=jython"},
    body: "expression=value.toLowercase()&engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22record-based%22%7D"
};
await rp(options)
    .then(function (body) {
     console.dir(JSON.parse(body));
     ClusterOnJobTitle_FingerPrint();  

    })
    .catch(function (err) {
console.log(err);
    });
}
async function ClusterOnJobTitle_FingerPrint()
{
  console.log("cluster ClusterOnJobTitle_FingerPrint***********");
	const options = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/compute-clusters?project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8" ,"Cookie": "host=.butterfly; scripting.lang=jython"},
    body:"engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22record-based%22%7D&clusterer=%7B%22type%22%3A%22binning%22%2C%22function%22%3A%22fingerprint%22%2C%22column%22%3A%22job_title%22%2C%22params%22%3A%7B%7D%7D"
};
await rp(options)
    .then(function (body) {
     setData_jobtitle(JSON.parse(body),1);
    })
    .catch(function (err) {
console.log(err);
    });
}

async function ClusterOnJobTitle_Ngram()
{
console.log("cluster ClusterOnJobTitle_Ngram***********");
const options = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/compute-clusters?project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8" ,"Cookie": "host=.butterfly; scripting.lang=jython"},
    body:"engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22record-based%22%7D&clusterer=%7B%22type%22%3A%22binning%22%2C%22function%22%3A%22ngram-fingerprint%22%2C%22column%22%3A%22job_title%22%2C%22params%22%3A%7B%22ngram-size%22%3A2%7D%7D"
};
await rp(options)
    .then(function (body) {
     setData_jobtitle(JSON.parse(body),2);
    })
    .catch(function (err) {
console.log(err);
    });
}
async function ClusterOnJobTitle_metaphone()
{
console.log("cluster ClusterOnJobTitle_metaphone***********");
const options = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/compute-clusters?project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8" ,"Cookie": "host=.butterfly; scripting.lang=jython"},
    body:"engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22record-based%22%7D&clusterer=%7B%22type%22%3A%22binning%22%2C%22function%22%3A%22metaphone3%22%2C%22column%22%3A%22job_title%22%2C%22params%22%3A%7B%7D%7D"
};

await rp(options)
    .then(function (body) {
     setData_jobtitle(JSON.parse(body),3);
    })
    .catch(function (err) {
console.log(err);
    });
}


async function Modfications(newProjectid)
{
    projectid=newProjectid;
const options = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/text-transform?columnName=city&onError=keep-original&repeat=false&repeatCount=&project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8" ,"Cookie": "host=.butterfly; scripting.lang=jython"},
    body: "expression=value.toLowercase()&engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22record-based%22%7D"
};
await rp(options)
    .then(function (body) {
    console.dir(JSON.parse(body));

    })
    .catch(function (err) {
console.log(err);
    });
    const options2 = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/text-transform?columnName=city&onError=keep-original&repeat=false&repeatCount=&project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8" ,"Cookie": "host=.butterfly; scripting.lang=jython"},
    body: "expression=value.replace(%2Fel%5C-%2Fi%2C%22el%22)&engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22row-based%22%7D"
};

await rp(options2)
    .then(function (body) {
    console.dir(JSON.parse(body));

    })
    .catch(function (err) {
console.log(err);
    });


const options3 = {
    method: "POST",
    url:"http://127.0.0.1:3333/command/core/text-transform?columnName=city&onError=keep-original&repeat=false&repeatCount=&project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8" ,"Cookie": "host=.butterfly; scripting.lang=jython"},
    body: "expression=value.replace(%22al-%22%2C%22al%22)&engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22row-based%22%7D"
};
await rp(options3)
    .then(function (body) {
    console.dir(JSON.parse(body));
    console.dir("now we are splitting   ***************************************** ");
    Split();
    })
    .catch(function (err) {
console.log(err);
    });
}

async function Split()
{
const options = {
    method: "POST",
    url:"http://127.0.0.1:3333/command/core/split-multi-value-cells?columnName=city&keyColumnName=id&mode=separator&separator=%5B%26%2C%2F-%5D&regex=true&project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8" ,"Cookie": "host=.butterfly; scripting.lang=jython"},
    body: "engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22row-based%22%7D"
}

await rp(options)
    .then(function (body) {
    console.log("regular expression     ");
    console.dir(JSON.parse(body));
    Split2();
    })
    .catch(function (err) {
console.log(err);
    });
}

async function Split2()
{
const options = {
    method: "POST",
    url:"http://127.0.0.1:3333/command/core/split-multi-value-cells?columnName=city&keyColumnName=id&mode=separator&separator=+and+&regex=false&project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8"},
    body: "engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22row-based%22%7D"
}
await rp(options)
    .then(function (body) {
    console.log("separator and      ");
   console.dir(JSON.parse(body));
   Split3();
    })
    .catch(function (err) {
console.log(err);
    });

}
async function Split3()
{
const options= {
    method: "POST",
    url:"http://127.0.0.1:3333/command/core/split-multi-value-cells?columnName=city&keyColumnName=id&mode=separator&separator=.&regex=false&project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8"},
    body: "engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22row-based%22%7D"
}
await rp(options)
    .then(function (body) {
  console.log("separator is .      ");
   console.dir(JSON.parse(body));
   Split4();
    })
    .catch(function (err) {
console.log(err);
    });

}
async function Split4()
{
const options= {
    method: "POST",
    url:"http://127.0.0.1:3333/command/core/split-multi-value-cells?columnName=city&keyColumnName=id&mode=separator&separator=+or+&regex=false&project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8"},
    body: "engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22row-based%22%7D"
}
await rp(options)
    .then(function (body) {
    console.log("separator is or      ");
   console.dir(JSON.parse(body));
  ClusterFingerPrint();
    })
    .catch(function (err) {
console.log(err);
    });

}
async function ClusterFingerPrint() {
	 console.dir("cluster ClusterOncity_FingerPrint***********");
const options = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/compute-clusters?project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8" },
    body:"engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22record-based%22%7D&clusterer=%7B%22type%22%3A%22binning%22%2C%22function%22%3A%22fingerprint%22%2C%22column%22%3A%22city%22%2C%22params%22%3A%7B%7D%7D"
};

await rp(options)
    .then(function (body) {
  // console.dir(JSON.parse(body));
   setData(JSON.parse(body),1);
    })
    .catch(function (err) {
console.log(err);
    });

}

async function ClusterKNN() {
console.dir("cluster ClusterOncity_knn***********");
const options = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/compute-clusters?project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8" },
    body:"engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22record-based%22%7D&clusterer=%7B%22type%22%3A%22knn%22%2C%22function%22%3A%22levenshtein%22%2C%22column%22%3A%22city%22%2C%22params%22%3A%7B%22radius%22%3A3%2C%22blocking-ngram-size%22%3A6%7D%7D"
};
await rp(options)
    .then(function (body) {
  // console.dir(JSON.parse(body));
   setData(JSON.parse(body),2);
    })
    .catch(function (err) {
console.log(err);
    });
}
async function ClusterNgram() {
console.dir("cluster ClusterOncity_ngram***********");
const options = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/compute-clusters?project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8" },
    body:"engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22row-based%22%7D&clusterer=%7B%22type%22%3A%22binning%22%2C%22function%22%3A%22ngram-fingerprint%22%2C%22column%22%3A%22city%22%2C%22params%22%3A%7B%22ngram-size%22%3A2%7D%7D"
};
await rp(options)
    .then(function (body) {
  // console.dir(JSON.parse(body));
   setData(JSON.parse(body),3);
    })
    .catch(function (err) {
console.log(err);
    });

}

async function Clustermetaphone() {
console.dir("cluster ClusterOncity_metaphone***********");
const options = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/compute-clusters?project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8" },
    body:"engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22row-based%22%7D&clusterer=%7B%22type%22%3A%22binning%22%2C%22function%22%3A%22metaphone3%22%2C%22column%22%3A%22city%22%2C%22params%22%3A%7B%7D%7D"
};
await rp(options)
    .then(function (body) {
   //console.dir(JSON.parse(body));
   setData(JSON.parse(body),4);
    })
    .catch(function (err) {
console.log(err);
    });
}


async function setData(data,x){
	
// enter the names of the table columns with the data
	var count = "c";
	var value = "v";
	var total=0;
	var cities=[];
	var values=[];
	var i;	
	var j;	
	var occrel = 0.49;

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
			values.push({from:cluster,to:Rep});		
	}
	//console.dir(values);
	//console.log(encodeURIComponent(JSON.stringify(values)))
   // var ic = new iconv.Iconv('iso-8859-1', 'utf-8');
	const options = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/mass-edit?project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8"},
    body:"columnName=city&expression=value&edits="+encodeURIComponent(JSON.stringify(values))+"&engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22record-based%22%7D"
};

await rp(options)
    .then(function (body) {
        console.dir(JSON.parse(body));
        
  if(x==1)
  {
     ClusterKNN();
  }
  else if(x==2)
  {
       ClusterNgram();
  }
    else if(x==3)
  {
    Clustermetaphone();
  }
     else if(x==4)
  {
    Modfications_Jobtitle();
          console.log("clustering city done **************");
  }


    })
    .catch(function (err) {
console.log(err);
    });	
}


async function setData_jobtitle(data,x){
	
// enter the names of the table columns with the data
	var count = "c";
	var value = "v";
	var total=0;
	var cities=[];
	var values=[];
	var i;	
	var j;	
	var occrel = 0.49;

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
			values.push({from:cluster,to:Rep});		
	}
	//console.dir(values);
	//console.log(encodeURIComponent(JSON.stringify(values)))
   // var ic = new iconv.Iconv('iso-8859-1', 'utf-8');
	const options = {
    method: "POST",
    url: "http://127.0.0.1:3333/command/core/mass-edit?project="+projectid+"",
    port: 3333,
    headers: { "content-type":"application/x-www-form-urlencoded; charset=UTF-8"},
    body:"columnName=job_title&expression=value&edits="+encodeURIComponent(JSON.stringify(values))+"&engine=%7B%22facets%22%3A%5B%5D%2C%22mode%22%3A%22record-based%22%7D"
};


await rp(options)
    .then(function (body) {
  console.dir(JSON.parse(body)); 
  if(x==1)
  {
       ClusterOnJobTitle_Ngram();
  }
  else if(x==2)
  {
       ClusterOnJobTitle_metaphone();
  }
    else if(x==3)
  {
          console.log("clustering done **************");
  }

    })
    .catch(function (err) {
console.log(err);
    });
}




module.exports = {
    Modfications

}