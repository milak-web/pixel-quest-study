const fs=require('fs'),vm=require('vm');const data=vm.runInNewContext(fs.readFileSync(__dirname+'/src/security-content.js','utf8')+';({LEVELS,WORLDS})');process.stdout.write(JSON.stringify(data));
