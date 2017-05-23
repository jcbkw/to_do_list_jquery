function getData (dataUrl, callback) {

    xhrGetJson(dataUrl, /*params*/null, /*then*/function (error, data) {

        if (error) {

            console.error(error,"We found an error with your request. Try again.");

            return;

        }

        callback(data);

    });

}