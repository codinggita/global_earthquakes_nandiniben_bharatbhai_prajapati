const fs = require('fs');
const rawData = fs.readFileSync('routes.txt', 'utf8');

const collection = {
  info: {
    name: "Global Earthquake API (All Routes)",
    description: "Comprehensive Postman Collection encompassing all API routes requested.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "bearer",
    bearer: [
      {
        key: "token",
        value: "{{token}}",
        type: "string"
      }
    ]
  },
  item: []
};

let currentFolder = null;
const lines = rawData.split(/\r?\n/).map(l => l.trim()).filter(l => l);

// Note: some lines in the prompt have tabs, some have spaces.
const methodRegex = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S+)\s+(.+)$/i;

lines.forEach(line => {
  if (line.startsWith('Method') || line.startsWith('//')) return;

  const match = line.match(methodRegex);
  if (match) {
    const method = match[1].toUpperCase();
    let endpoint = match[2];
    const name = match[3];

    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }

    const requestItem = {
      name: name,
      request: {
        method: method,
        header: [],
        url: {
          raw: "{{baseUrl}}" + endpoint,
          host: ["{{baseUrl}}"],
          path: endpoint.split('?')[0].split('/').filter(p => p)
        }
      },
      response: []
    };

    if (endpoint.includes('?')) {
      const queryStr = endpoint.split('?')[1];
      const queries = queryStr.split('&').map(q => {
        const [key, val] = q.split('=');
        return { key, value: val || "" };
      });
      requestItem.request.url.query = queries;
    }

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      requestItem.request.body = {
        mode: "raw",
        raw: "{\n    \n}",
        options: { raw: { language: "json" } }
      };
    }

    // Add Token Extraction Script for Login & Register
    if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
      requestItem.event = [
        {
          listen: "test",
          script: {
            exec: [
              "const jsonData = pm.response.json();",
              "if (jsonData && jsonData.data && jsonData.data.token) {",
              "    pm.collectionVariables.set(\"token\", jsonData.data.token);",
              "    console.log(\"Token automatically saved to collection variables!\");",
              "}"
            ],
            type: "text/javascript"
          }
        }
      ];
    }

    if (currentFolder) {
      currentFolder.item.push(requestItem);
    } else {
      collection.item.push(requestItem);
    }
  } else {
    currentFolder = {
      name: line,
      item: []
    };
    collection.item.push(currentFolder);
  }
});

collection.variable = [
  {
    key: "baseUrl",
    value: "https://global-earthquakes-a4oc.onrender.com/api",
    type: "string"
  },
  {
    key: "token",
    value: "",
    type: "string"
  }
];

fs.writeFileSync('../Global_Earthquake_API.postman_collection.json', JSON.stringify(collection, null, 2));
console.log('Successfully generated Postman Collection.');
