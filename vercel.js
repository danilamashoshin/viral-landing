{
  "routes": [
    { "src": "/api/health", "dest": "/animator/health.json" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/animator/$1" }
  ]
}
