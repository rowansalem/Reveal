
module.exports.runRecommendation = function (req, res) {
    // using spawn instead of exec, prefer a stream over a buffer
    // to avoid maxBuffer issue
    var spawn = require('child_process').spawn;
    console.log('requiring child');
  
    var process = spawn('python', ["/home/rowan/Desktop/website/recommendation.py"]  );
    console.log('heading to path');
    process.stdout.on('data', function (data) {
      // res.send(data.toString());
    });
    console.log("DONE run recommendation");
  };
  