# **OUTHOUSE API DOCUMENTATION**


## `GET "/bins"`
returns an array of public bin IDs for the requester's IP Address. public bin IDs are strings. Possible responses are outlined below
200: Found bins
```
["ce41a3dc-751b-4149-a427-0acfc531ddf5","783e5a54-0a19-4158-bc43-e872a177b366"]
```
404: no bins found for IP (no body)
```
```

## `POST "/bins"`
Creates a bin connected to the IP address and returns the newly created binID(publicID)

201: Bin created
```
{"binId":"1a81c85b-f486-41d5-bdc1-09974b5e11fb"}
```

400: bin creation failed (no body)
```
```

## `ALL /req/:publicId`
Puts a request within a bin. response is 200 if successful, 400 if failure 
example body (success):
```
"thanks"
```
example body (failure)
```
{error: "bin does not exist"}
```

## `GET /bins/:binId`
Returns an array of requests made to a bin. Requests follow the mongo document schema outlined below. Possible response statuses are outlined below i

500: internal server error
```
error: "error: generic server error message"
```

404: no requests found for bin (no body)
```
```

200: found requests
example Mongo Document:
```
{
  "_id": "632394225b64f07d58d64260",
  "ip": "::1",
  "path": "/req/ce41a3dc-751b-4149-a427-0acfc531ddf5",
  "method": "GET",
  "headers": {
      "host": "localhost:3000",
      "connection": "keep-alive",
      "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", 
      ...
}
```

successful response body is an array of mongo documents. some mongo document fields are omitted
```
[
  {
        "_id": "632394225b64f07d58d64260",
        "ip": "::1",
        "path": "/req/ce41a3dc-751b-4149-a427-0acfc531ddf5",
        "method": "GET",
        "headers": {
            "host": "localhost:3000",
            "connection": "keep-alive",
            "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", 
            ...
        },
        "body": "{}",
        "__v": 0
    },
    {
        "_id": "632394205b64f07d58d6425e",
        "ip": "::1",
        "path": "/req/ce41a3dc-751b-4149-a427-0acfc531ddf5",
        "method": "GET",
        "headers": {
            "host": "localhost:3000",
            "connection": "keep-alive",
            "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", 
            ...
        },
        "body": "{payload: "hi gene!"}",
        "__v": 0
    },
    ...
]
```
