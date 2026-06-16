$productsPath = "data/products.json"
$products = Get-Content -Raw -Path $productsPath | ConvertFrom-Json

$newKitsJson = @"
[
    {
        "id": "pl-tottenham-home-2025", "name": "חולצת טוטנהאם בית 2024/25", "team": "טוטנהאם", "teamEn": "Tottenham",
        "league": "premier-league", "leagueName": "פרמייר ליג", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["tottenham-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "pl-astonvilla-home-2025", "name": "חולצת אסטון וילה בית 2024/25", "team": "אסטון וילה", "teamEn": "Aston Villa",
        "league": "premier-league", "leagueName": "פרמייר ליג", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["astonvilla-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "pl-newcastle-home-2025", "name": "חולצת ניוקאסל בית 2024/25", "team": "ניוקאסל", "teamEn": "Newcastle",
        "league": "premier-league", "leagueName": "פרמייר ליג", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["newcastle-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "la-girona-home-2025", "name": "חולצת ג'ירונה בית 2024/25", "team": "ג'ירונה", "teamEn": "Girona",
        "league": "la-liga", "leagueName": "לה ליגה", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["girona-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "la-realmadrid-away-2025", "name": "חולצת ריאל מדריד חוץ 2024/25", "team": "ריאל מדריד", "teamEn": "Real Madrid",
        "league": "la-liga", "leagueName": "לה ליגה", "year": 2025, "type": "away", "typeName": "חוץ",
        "isWorldCupSpecial": false, "images": ["realmadrid-away-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "la-barcelona-away-2025", "name": "חולצת ברצלונה חוץ 2024/25", "team": "ברצלונה", "teamEn": "Barcelona",
        "league": "la-liga", "leagueName": "לה ליגה", "year": 2025, "type": "away", "typeName": "חוץ",
        "isWorldCupSpecial": false, "images": ["barcelona-away-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "sa-napoli-home-2025", "name": "חולצת נאפולי בית 2024/25", "team": "נאפולי", "teamEn": "Napoli",
        "league": "serie-a", "leagueName": "סריה A", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["napoli-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "sa-roma-home-2025", "name": "חולצת רומא בית 2024/25", "team": "רומא", "teamEn": "AS Roma",
        "league": "serie-a", "leagueName": "סריה A", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["roma-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "sa-lazio-home-2025", "name": "חולצת לאציו בית 2024/25", "team": "לאציו", "teamEn": "Lazio",
        "league": "serie-a", "leagueName": "סריה A", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["lazio-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "bl-leverkusen-home-2025", "name": "חולצת באייר לברקוזן בית 2024/25", "team": "באייר לברקוזן", "teamEn": "Bayer Leverkusen",
        "league": "bundesliga", "leagueName": "בונדסליגה", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["leverkusen-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": true, "tags": ["חדש", "פופולרי"]
    },
    {
        "id": "bl-leipzig-home-2025", "name": "חולצת ר.ב. לייפציג בית 2024/25", "team": "ר.ב. לייפציג", "teamEn": "RB Leipzig",
        "league": "bundesliga", "leagueName": "בונדסליגה", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["leipzig-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "l1-marseille-home-2025", "name": "חולצת מארסיי בית 2024/25", "team": "מארסיי", "teamEn": "Marseille",
        "league": "ligue-1", "leagueName": "ליג 1", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["marseille-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "l1-lyon-home-2025", "name": "חולצת ליון בית 2024/25", "team": "ליון", "teamEn": "Lyon",
        "league": "ligue-1", "leagueName": "ליג 1", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["lyon-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "wc2026-england-home", "name": "חולצת נבחרת אנגליה בית 2026", "team": "אנגליה", "teamEn": "England",
        "league": "world-cup", "leagueName": "גביע העולם", "year": 2026, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": true, "images": ["england-home-2026.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": true, "tags": ["מונדיאל", "הנבחרת", "פופולרי"]
    },
    {
        "id": "wc2026-spain-home", "name": "חולצת נבחרת ספרד בית 2026", "team": "ספרד", "teamEn": "Spain",
        "league": "world-cup", "leagueName": "גביע העולם", "year": 2026, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": true, "images": ["spain-home-2026.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["מונדיאל", "הנבחרת"]
    },
    {
        "id": "wc2026-italy-home", "name": "חולצת נבחרת איטליה בית 2026", "team": "איטליה", "teamEn": "Italy",
        "league": "world-cup", "leagueName": "גביע העולם", "year": 2026, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": true, "images": ["italy-home-2026.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["מונדיאל", "הנבחרת"]
    },
    {
        "id": "wc2026-portugal-home", "name": "חולצת נבחרת פורטוגל בית 2026", "team": "פורטוגל", "teamEn": "Portugal",
        "league": "world-cup", "leagueName": "גביע העולם", "year": 2026, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": true, "images": ["portugal-home-2026.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["מונדיאל", "הנבחרת"]
    },
    {
        "id": "wc2026-netherlands-home", "name": "חולצת נבחרת הולנד בית 2026", "team": "הולנד", "teamEn": "Netherlands",
        "league": "world-cup", "leagueName": "גביע העולם", "year": 2026, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": true, "images": ["netherlands-home-2026.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["מונדיאל", "הנבחרת"]
    },
    {
        "id": "saudi-alnassr-home-2025", "name": "חולצת אל-נאסר בית 2024/25", "team": "אל-נאסר", "teamEn": "Al-Nassr",
        "league": "saudi-league", "leagueName": "הליגה הסעודית", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["alnassr-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": true, "tags": ["חדש", "פופולרי"]
    },
    {
        "id": "saudi-alittihad-home-2025", "name": "חולצת אל-איתיחאד בית 2024/25", "team": "אל-איתיחאד", "teamEn": "Al-Ittihad",
        "league": "saudi-league", "leagueName": "הליגה הסעודית", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["alittihad-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "pl-liverpool-away-2025", "name": "חולצת ליברפול חוץ 2024/25", "team": "ליברפול", "teamEn": "Liverpool",
        "league": "premier-league", "leagueName": "פרמייר ליג", "year": 2025, "type": "away", "typeName": "חוץ",
        "isWorldCupSpecial": false, "images": ["liverpool-away-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "pl-arsenal-away-2025", "name": "חולצת ארסנל חוץ 2024/25", "team": "ארסנל", "teamEn": "Arsenal",
        "league": "premier-league", "leagueName": "פרמייר ליג", "year": 2025, "type": "away", "typeName": "חוץ",
        "isWorldCupSpecial": false, "images": ["arsenal-away-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "pl-manutd-away-2025", "name": "חולצת מנצ'סטר יונייטד חוץ 2024/25", "team": "מנצ'סטר יונייטד", "teamEn": "Manchester United",
        "league": "premier-league", "leagueName": "פרמייר ליג", "year": 2025, "type": "away", "typeName": "חוץ",
        "isWorldCupSpecial": false, "images": ["manutd-away-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "pl-chelsea-away-2025", "name": "חולצת צ'לסי חוץ 2024/25", "team": "צ'לסי", "teamEn": "Chelsea",
        "league": "premier-league", "leagueName": "פרמייר ליג", "year": 2025, "type": "away", "typeName": "חוץ",
        "isWorldCupSpecial": false, "images": ["chelsea-away-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    },
    {
        "id": "sa-acmilan-home-2025", "name": "חולצת מילאן בית 2024/25", "team": "מילאן", "teamEn": "AC Milan",
        "league": "serie-a", "leagueName": "סריה A", "year": 2025, "type": "home", "typeName": "בית",
        "isWorldCupSpecial": false, "images": ["acmilan-home-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": true, "tags": ["חדש", "פופולרי"]
    },
    {
        "id": "sa-juventus-away-2025", "name": "חולצת יובנטוס חוץ 2024/25", "team": "יובנטוס", "teamEn": "Juventus",
        "league": "serie-a", "leagueName": "סריה A", "year": 2025, "type": "away", "typeName": "חוץ",
        "isWorldCupSpecial": false, "images": ["juventus-away-2025.jpg"], "sizes": ["S", "M", "L", "XL"], "featured": false, "tags": ["חדש"]
    }
]
"@

$newKits = $newKitsJson | ConvertFrom-Json

# create an ArrayList for easy appending
$list = New-Object System.Collections.ArrayList
foreach ($p in $products) {
    [void]$list.Add($p)
}

foreach ($n in $newKits) {
    $exists = $false
    foreach ($p in $products) {
        if ($p.id -eq $n.id) {
            $exists = $true
            break
        }
    }
    if (-not $exists) {
        [void]$list.Add($n)
    }
}

$list | ConvertTo-Json -Depth 10 | Set-Content $productsPath -Encoding UTF8
Write-Output "Added $($newKits.Count) products to $productsPath."
