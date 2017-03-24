// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Load credentials and set region from JSON config file
AWS.config.loadFromPath('./aws-config.json');

// Create EC2 service object
var EC2 = new AWS.EC2();

function createInstance(imageId, count, keyPair, securityGroup, instanceType) {
  EC2.runInstances({
    ImageId: imageId,
    MinCount: count,
    MaxCount: count,
    KeyName: keyPair,
    SecurityGroups: [securityGroup],
    InstanceType: instanceType
  }, function(err, data) {
    if(err) {
	  console.log("Could not create instance", err);
    } else {
      for(var i in data.Instances) {
        var instance = data.Instances[i];
        console.log("New instance: " + instance.InstanceId);
      }
    }
  });
}

function terminateInstance(instanceId) {
  EC2.terminateInstances({ InstanceIds: [instanceId] }, function(err, data) {
    if(err) {
	  console.log("Could not terminate instance", err);
    } else {
       for(var i in data.TerminatingInstances) {
        var instance = data.TerminatingInstances[i];
        console.log("Terminating instance: " + instance.InstanceId);
      } 
    }
  });
}