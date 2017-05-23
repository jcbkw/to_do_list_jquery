/* global __dirname */

var api = {
        
    GET: function (request, response, storage) {
        
        storage.read(function (data) {
            
            var id = get('id', null);
            
            // get unique by ID
            if (id) {
                
                if (data.hasOwnProperty(id)) {
                    
                    response.status(200).json(data[id]);
                    
                }
                else {
                    
                    response.status(404).json(id);
                    
                }
                
                return;
                
            }
            
            // get list
            var result = [],
                contains = get('contains', null);
            
            // (optional) only if contains
            if (contains) {
                
                contains = contains.trim().toLowerCase();
                
            }
            
            Object.keys(data).forEach(function (key) {
                
                var todo = data[key];
                
                if (!contains || todo.message.toLowerCase().indexOf(contains) !== -1) {
                    
                    result.push(todo);
                    
                }
                
            });
            
            // (optional) sort
            switch (get('sort', null)) {
                
                case 'asc' : result.sort(function(a, b){return a.lastModified - b.lastModified;}); break;
                case 'desc': result.sort(function(a, b){return b.lastModified - a.lastModified;}); break;
                
            }
            
            // (optional) limit and from
            var limit = getNonNegativeInteger('limit', Number.NaN),
                from = getNonNegativeInteger('from', Number.NaN),
                hasLimit = !isNaN(limit),
                hasFrom = !isNaN(from);
                
            if (hasLimit || hasFrom) {
                
                var total = result.length;
                
                if (hasFrom) {
                    
                    if (from >= result.length) {
                        
                        result.length = 0;
                        
                    }
                    else {
                        
                        result = result.slice(from);
                        
                    }
                    
                }
                else {
                    
                    from = 0;
                    
                }
                
                if (hasLimit) {
                    
                    if (limit < result.length) {
                        
                        result = result.slice(0, limit);
                        
                    }
                    
                }
                else {
                    
                    limit = -1;
                    
                }
                
                response.status(200).json({
                    from: from,
                    limit: limit,
                    total: total,
                    entries: result
                });
                
                return;
                
            }
            
            response.status(200).json(result);
                        
        });

    },
    
    POST: function (request, response, storage) {
        
        storage.read(function (data) {
            
            var id = (Math.round(Math.random() * 9999) + Date.now()).toString(16);
            
            data[id] =  {
                lastModified: Date.now(),
                message: get('message'),
                status: 0,
                id: id
            };
            
            storage.write(function () {
                
                response.status(/*201*/200).json(data[id]);
                
            });
            
        });

    },
    
    PUT: function (request, response, storage) {
        
        storage.read(function (data) {
            
            var id = get('id');

            if (data.hasOwnProperty(id)) {

                data[id].message = get('message');
                data[id].status = getNonNegativeInteger('status');
                
                // (optional) silent = don't update last modified 
                if (!JSON.parse(String(get('silent', false)))) {
                    
                    data[id].lastModified = Date.now();
                    
                }

                storage.write(function () {

                    response.status(200).json(data[id]);

                });

            }
            else {

                response.status(404).json(id);

            }
             
        });

    },
    
    PATCH: function (request, response, storage) {
        
        storage.read(function (data) {
            
            var id = get('id');

            if (data.hasOwnProperty(id)) {
                
                var entry = data[id],
                    hasChanged = false,
                    message = get('message', null),
                    status = getNonNegativeInteger('status', Number.NaN);
                    
                if (message !== null) {
                    
                    entry.message = message;
                    hasChanged = true;
                    
                }
                
                if (!isNaN(status)) {
                    
                    entry.status = status;
                    hasChanged = true;
                    
                }
                
                if (hasChanged) {
                    
                    // (optional) silent = don't update last modified 
                    if (!JSON.parse(String(get('silent', false)))) {

                        entry.lastModified = Date.now();

                    }

                    storage.write(function () {

                        response.status(200).json(entry);

                    });
                    
                }
                else {
                    
                    response.status(304).json(entry);
                    
                }

            }
            else {

                response.status(404).json(id);

            }
             
        });

    },
    
    DELETE: function (request, response, storage) {
        
        storage.read(function (data) {
            
            var id = get('id');

            if (data.hasOwnProperty(id)) {

                var cache = data[id];

                delete data[id];

                storage.write(function () {

                    response.status(/*200*/200).json(cache);

                });

            }
            else {

                response.status(404).json(id);

            }
                
        });

    }

};
    
module.exports = function (request, response) {
    
    get = createParameterGetter(request);
    
    call(response, api[request.method],
        request,
        response, 
        storage(require('path').join(__dirname, 'data.json'), response)
    );
    
};

var get;

function call (response, callback) {
    
    try {
        
        callback.apply(this, Array.prototype.slice.call(arguments, 2));
        
    }
    catch (e) {
        
        response.status(e instanceof ClientError ? 406 : 500).json(e.message || e + '');
        
    }
    
}

function createParameterGetter (request) {
    
    return function (name, defaultValue) {
        
        if (request.query && Object.prototype.hasOwnProperty.call(request.query, name)) {
            
            return request.query[name];
            
        }
        else if (request.body && Object.prototype.hasOwnProperty.call(request.body, name)) {
            
            return request.body[name];
            
        }
        else if (arguments.length > 1) {
            
            return defaultValue;
            
        }
        else {
            
            throw new ClientError('The parameter "' + name + '" is required!');
            
        }
        
    };
    
}

function getNonNegativeInteger (name, defaultValue) {
    
    var value = get.apply(this, arguments);
    
    if (!value && arguments.length > 1) {
        
        return defaultValue;
        
    }
    
    if ((/^[0-9]+$/).test(value)) {
        
        return parseInt(value, 10);
        
    }
    
    throw new ClientError('The parameter "' + name + '" is must be a non-negative integer! "' + value + '" is not acceptable!');
    
}

function storage (path, response) {
        
    var data,
        file = require('fs');
    
    return {

        read: function (callback) {

            if (data) {

                call(response, callback, data);

            }
            else if (file.existsSync(path)) {

                file.readFile(path, 'utf8', function (error, source) {

                    if (!error) {

                        try {

                            data = JSON.parse(source);

                        }
                        catch (e) {

                            error = e;

                        }

                    }

                    if (error) {

                        return response.status(500).json(error);

                    }

                    call(response, callback, data);

                });

            }
            else {

               call(response, callback, data = {});

            }

            return this;

        },

        write: function (callback) {

            file.writeFile(path, JSON.stringify(data || {}, null, 4), 'utf8', function (error) {

                if (error) {

                    return response.status(500).json(error);

                }

                call(response, callback);

            });

        }

    };

}

function ClientError (message) {
    
    this.name = 'ClientError';
    this.message = message;
    this.stack = (new Error).stack;
    
}