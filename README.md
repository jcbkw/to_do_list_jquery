# to_do_list_jquery
A simple todo list written using jQuery

Start the server by running `npm start`.
The following are the supported JSON web service methods


### POST /entries
Creates a new entry

- `@param {String} message`: The message of the entry to create
- **`@returns {Object}`**: The entry that was created



### PUT /entries
Updates the message and completion status of an existing entry

- `@param {String} id`: The ID of the entry to update
- `@param {String} message`: The new message
- `@param {Number} status`: The new completion status. Must be a positive integer.
- `@param {Boolean} [silent]`: If true, the lastModified property of the entry will not be updated
- **`@returns {Object}`**: The entry that was updated 



### PATCH /entries
Updates selective properties of an existing entry
The `message` or `status` properties can be selectively updated

The difference between PATCH and PUT is that the ladder requires 
the provision of all the entry properties, whereas PATCH lets one
pick and choose

- `@param {String} id`: The ID of the entry to update
- `@param {String} [message]`: The new message. Must be a non-empty string if provided.
- `@param {Number} [status]`: The new completion status. Must be a positive integer if provided.
- `@param {Boolean} [silent]`: If true, the lastModified property of the entry will not be updated
- **`@returns {Object}`**: The entry that was patched 



### DELETE /entries
Deletes an existing entry

- `@param {String} id`: The ID of the entry to delete
- **`@returns {Object}`**: The entry that was deleted 
   

   
### GET /entries
Gets an array of existing entries

- `@param {String} [sort]`: **asc** or **desc** If passed, sorts the results by their lastModified property either in ascending or descending order as specified
- `@param {String} [contains]`: If passed, only the entries with messages containing the provided text will be returned.
- **`@returns {Object[]}`**: An array of existing entries



### GET /entries
Gets an Object containing the resulting entries and some additional meta data

- `@param {String} [from]`: A non negative integer. If passed, it is used as the starting index of the returned entries
- `@param {String} [limit]`: A non negative integer. If passed, it is used as the maximum number of entries to be returned
- `@param {String} [sort]`: **asc** or **desc** If passed, sorts the results by their lastModified property either in ascending or descending order as specified
- `@param {String} [contains]`: If passed, only the entries with messages containing the provided text will be returned
- **`@returns {Object[]}`**: An Object with the following signature:
~~~~
{
    from: number,       // The starting index of the returned entries,
    limit: number,      // The maximum number of entries returned. -1 indicates no limit
    total: number,      // The total number of entries stored in the data base
    entries: Object[]   // The entries
}
~~~~



### GET /entries
Gets a single entry

- `@param {String} id`: The ID of the entry to return 
- **`@returns {Object}`**: The entry that was matched the provided ID
