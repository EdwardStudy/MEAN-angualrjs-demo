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
    console.log('Info: findAll: GET Devices request recieved');
    res.send(devices)
};

exports.findById = function(req, res){
    console.log('Info: findById: GET: Id: ', req.params.id);

    //find the device with id
    var rid = req.params.id;
    var device;
    devices.forEach(function(item, i){
        if(item.id == rid){
            device = devices[i];
        }
    });

    console.log('Info: findById: GET; device: ', device);
    res.send(device);
};

exports.add = function(req, res){
    var dev = req.body;
    console.log('Info: add: Post; device: ', dev);
    devices.push(dev);
    res.send({success: true});
};

exports.delete = function(req, res){
    var id = req.params.id;
    devices = devices.filter(function(item){
        return item.id != id;
    });

    console.log("Info: delete: id: ", id);
    res.send({success: true});
};

exports.update = function(req, res){
    //get the device
    var id = req.params.id;
    var dev = req.body;
    console.log("Info: update: PUT: device:  ", devices, " Id: ", id);
    if(id != dev.id){
        console.log("Error: update: id's do not match for update");
        res.send({success: false});
    }

    //find the selected device & update
    devices.forEach(function(item, i){
        if(item.id == id){
            //update
            devices[i] = dev;
            console.log("Info: update: updating: ", devices[i]);
            res.send({success: true});
            return;
        }
    });
    console.log("Error: devices iteration error");
    res.send({success: false});
};
