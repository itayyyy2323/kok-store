$ErrorActionPreference = "Continue"

$teams = @("Lyon", "England", "Spain", "Al Nassr", "Liverpool", "Juventus")

$productsPath = "data/products.json"
$products = Get-Content -Raw -Path $productsPath | ConvertFrom-Json

foreach ($product in $products) {
    $imgName = $product.images[0]
    $imgPath = "public/images/$imgName"
    
    $teamEn = $product.teamEn
    if ($teamEn -eq "Al-Nassr") { $teamEn = "Al Nassr" }
    
    if ($teams -contains $teamEn) {
        $size = 0
        if (Test-Path $imgPath) {
            $size = (Get-Item $imgPath).length
        }
        if ($size -lt 10000) {
            $teamQuery = [uri]::EscapeDataString($teamEn)
            $url = "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=$teamQuery"
            try {
                Start-Sleep -Seconds 10
                $json = Invoke-RestMethod -Uri $url -ErrorAction Stop
                if ($json.teams -and $json.teams.Count -gt 0) {
                    $team = $json.teams[0]
                    $imgUrl = $team.strEquipment
                    if ([string]::IsNullOrWhiteSpace($imgUrl)) {
                        $imgUrl = $team.strBadge
                    }
                    if (-not [string]::IsNullOrWhiteSpace($imgUrl)) {
                        Write-Host "Downloading $imgUrl -> $imgPath"
                        Invoke-WebRequest -Uri $imgUrl -OutFile $imgPath -ErrorAction Stop
                    }
                }
            } catch {
                Write-Host "Still failed for $teamEn : $_" -ForegroundColor Red
            }
        }
    }
}
Write-Host "Done with final 6 images."
