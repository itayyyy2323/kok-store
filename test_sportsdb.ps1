$url = "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Arsenal"
$json = Invoke-RestMethod -Uri $url
$json.teams[0] | Select-Object strTeamJersey, strTeamBadge, strTeamLogo
