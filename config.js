module.exports = {
    "port": Number(process.env.PORT || "8080"),
    "database": "localhost:27017/lottery",
    "lineMinimumValue": 0,
    "lineMaximumValue": 2,
    "lineNumberOfValues": 3,
    "lineDefaultRows": 3
};
