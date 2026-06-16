$json = Invoke-RestMethod -Uri "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Al%20Nassr"
Invoke-WebRequest -Uri $json.teams[0].strBadge -OutFile "public/images/alnassr-home-2025.jpg"
