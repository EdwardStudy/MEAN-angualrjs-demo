var devices = [
    {id:0, name: "iphone", assetTag:"a23456", owner:"dev", desc:"iOS4.2"},
    {id:1, name: "loaner-laptop-1", assetTag:"a13936", owner:"dev", desc:""},
    {id:2, name: "loaner-laptop-3", assetTag:"a43056", owner:"qa", desc:""},
    {id:3, name: "android", assetTag:"a33756", owner:"dev", desc:"android2.4"},
    {id:4, name: "galaxy tab", assetTag:"a53356", owner:"dev", desc:"android"},
    {id:5, name: "loaner-laptop-2", assetTag:"a63556", owner:"qa", desc:""},
    {id:6, name: "iphone", assetTag:"a73856", owner:"dev", desc:"iOS5"}
];

exports.findAll = function(req, res){
    res.send(devices)
};

exports.findById = function(req, res){
    res.send(devices[req.params.id]);
};

exports.add = function(req, res){
    var dev = req.body;
    devices.push(dev);
    console.log(devices);
    res.send({success: true});
};

exports.delete = function(req, res){
    var id = req.params.id;
    devices = devices.filter(function(item){
        return item.id != id;
    });

    console.log("Info: DELETE ", devices);
    res.send({success: true});
};

exports.update = function(req, res){
    //get the device
    var id = req.params.id;
    var dev = req.body;
    if(id != dev.id){
        console.log("Error: id's do not match for update");
        res.send({success: false});
    }

    //find the selected device & update
    devices.forEach(function(item, i){
        if(item.id == id){
            //update
            devices[i] = dev;
            console.log("Info: update done", devices[i]);
            res.send({success: true});
        }
    });
    console.log("Error: devices iteration error");
    res.send({success: false});
};
