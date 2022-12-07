# quester-cli
Test your API with simple HTTP/S requests.

## Requester Files
You can use a .JSON file to speed up a request process. The .JSON file must have the following format:

### Requests with a Query

    {
      "url":" https://example.com/search/names",
      "method": "GET",
      "headers": {
         "Accept-Language": "de-DE"
      },
      "query": "name=john"
    }

### Requests with a Body

    {
      "url":" https://example.com/add/name",
      "method": "PUT",
      "headers": {
         "Accept-Language": "de-DE"
      },
      "body": {
          "name": "john"
      }
    }
