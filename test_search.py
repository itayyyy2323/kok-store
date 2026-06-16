import urllib.request
import urllib.parse
import re
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def get_image_url(query):
    try:
        url = "https://images.search.yahoo.com/search/images?p=" + urllib.parse.quote(query)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
        # find imgurl=&quot;https://...&quot; or similar
        # Yahoo images usually has data-url='...' or JSON in the page.
        # Let's look for "imgurl":"(http[^"]+)"
        match = re.search(r'"imgurl":"([^"]+)"', html)
        if match:
            return match.group(1).replace('\/', '/')
        # alternate:
        match2 = re.search(r'imgurl=&quot;(http[^&]+)&quot;', html)
        if match2:
            return match2.group(1)
        return None
    except Exception as e:
        return str(e)

print(get_image_url("Manchester City home kit 2024/25 jersey official"))
