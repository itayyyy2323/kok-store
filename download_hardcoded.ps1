$urls = @{
    "lyon-home-2025.jpg" = "https://upload.wikimedia.org/wikipedia/en/thumb/c/c6/Olympique_Lyonnais.svg/512px-Olympique_Lyonnais.svg.png"
    "england-home-2026.jpg" = "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/England_national_football_team_crest.svg/512px-England_national_football_team_crest.svg.png"
    "spain-home-2026.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Escudo_de_la_selecci%C3%B3n_de_f%C3%BAtbol_de_Espa%C3%B1a.svg/512px-Escudo_de_la_selecci%C3%B3n_de_f%C3%BAtbol_de_Espa%C3%B1a.svg.png"
    "alnassr-home-2025.jpg" = "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Al-Nassr_Saudi_Club_logo.svg/512px-Al-Nassr_Saudi_Club_logo.svg.png"
    "liverpool-home-2025.jpg" = "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/512px-Liverpool_FC.svg.png"
    "liverpool-away-2025.jpg" = "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/512px-Liverpool_FC.svg.png"
    "juventus-home-2025.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Juventus_FC_2017_icon_%28black%29.svg/512px-Juventus_FC_2017_icon_%28black%29.svg.png"
    "juventus-away-2025.jpg" = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Juventus_FC_2017_icon_%28black%29.svg/512px-Juventus_FC_2017_icon_%28black%29.svg.png"
}

foreach ($item in $urls.GetEnumerator()) {
    $imgPath = "public/images/$($item.Key)"
    Write-Host "Downloading $($item.Value) to $imgPath"
    try {
        Invoke-WebRequest -Uri $item.Value -OutFile $imgPath -ErrorAction Stop
    } catch {
        Write-Host "Failed to download $($item.Key): $_"
    }
}
