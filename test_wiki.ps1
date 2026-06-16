$query = "File:Manchester City kit"
$url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=" + [uri]::EscapeDataString($query) + "&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json"
$html = Invoke-RestMethod -Uri $url
$html | ConvertTo-Json -Depth 5
