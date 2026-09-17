import sys; sys.path.insert(0, "/tmp")
from pack import pack
from PIL import Image
IMG = "assets/img/portfolio"

def ratio(n):
    w, h = Image.open(f"{IMG}/{n}.jpg").size
    return w / h

def still(name, alt):  return dict(kind="img", name=name, alt=alt, r=ratio(name))
def film(poster, provider, vid, label, alt):
    src = (f"https://player.vimeo.com/video/{vid}?autoplay=1&amp;title=0&amp;byline=0&amp;portrait=0"
           if provider == "vimeo" else
           f"https://www.youtube-nocookie.com/embed/{vid}?autoplay=1&amp;rel=0")
    return dict(kind="vid", name=poster, alt=alt, label=label, src=src, r=16/9)

# Client work sits in a 1060px column beside the sticky title; the gallery has
# the full width. Different targets, one engine.
PROJ_W, PROJ_TGT = 1060, 400
GAL_W,  GAL_TGT  = 1328, 300
GAP = 14
MAXH_MULT = 1.4     # past this multiple of target, a row is left alone, not stretched

def rows_for(items, container, target):
    packed = pack([i["r"] for i in items], container, GAP, target)
    out, k = [], 0
    for grp in packed:
        row = items[k:k + len(grp)]; k += len(grp)
        avail = container - GAP * (len(row) - 1)
        h = avail / sum(i["r"] for i in row)
        # A row of one, or a row that would come out unusually tall, is bounded
        # by height instead of stretched to flush. Stretching a short row is
        # exactly where a justified layout starts cropping, so it is not done.
        out.append((row, len(row) == 1 or h > target * MAXH_MULT))
    return out

def fig(it, pad):
    p = " " * pad
    if it["kind"] == "img":
        return (f'{p}<figure class="fig" style="--r:{it["r"]:.4f}">'
                f'<img src="{IMG}/{it["name"]}.jpg" alt="{it["alt"]}" loading="lazy" decoding="async"></figure>')
    return (f'{p}<button class="fig fig-vid" type="button" data-embed="{it["src"]}" '
            f'style="--r:{it["r"]:.4f}" aria-label="Play: {it["label"]}">'
            f'<img src="{IMG}/{it["name"]}.jpg" alt="{it["alt"]}" loading="lazy" decoding="async">'
            f'<span class="fig-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>'
            f'<span class="fig-label">{it["label"]}</span></button>')

def render_rows(rowset, pad, tsum=None):
    out = []
    for row, solo in rowset:
        cls = "row row-solo" if solo else "row"
        style = f' style="--tsum:{tsum}"' if (solo and tsum) else ""
        out.append(" " * pad + f'<div class="{cls}"{style}>')
        out += [fig(i, pad + 2) for i in row]
        out.append(" " * pad + "</div>")
    return "\n".join(out)

PROJECTS = [
 dict(client="Locations Real Estate", title="Fiftieth anniversary film",
      role="Writer, director, videographer, editor", items=[
   film("vid-locations","vimeo","245304728","50 year anniversary film",
        "Frame from the Locations Real Estate fiftieth anniversary film")]),
 dict(client="Hawaiian Airlines", title="Lion Coffee, bean to cup", role="Web content", items=[
   film("vid-lion","yt","cTvDIiYgR-g","From bean to cup","Frame from the Lion Coffee film, bean to cup"),
   still("ha-lion-1","A roaster at the counter of the Lion Coffee roasting room"),
   still("ha-lion-2","Three glasses of coffee being cupped and tasted")]),
 dict(client="Hawaiian Airlines", title="Poke bowls", role="Food photography", items=[
   still("ha-poke-2","An overhead shot of a poke bowl with ahi, avocado and cucumber"),
   still("ha-poke-1","A block of raw ahi on a board with vegetables and sauces"),
   still("ha-poke-3","Small bowls of poke toppings and sauces on white")]),
 dict(client="Hawaiian Airlines", title="The road to Hana", role="Photography", items=[
   still("ha-hana-1","A hiker at the base of a three tier waterfall on the road to Hana"),
   still("ha-hana-2","Aerial view of a waterfall running through a green Maui valley")]),
 dict(client="Hawaiian Airlines", title="Diamond Head trek", role="Web content", items=[
   film("vid-diamondhead","yt","plRTp-6Dnx0","Diamond Head trek","Frame from the Diamond Head trek film")]),
 dict(client="Hi&#42;Sessions", title="Hawaii&#8217;s music video series", role="Director of photography",
      note="The largest ongoing project at 9th Ave Studio. Through it we have partnered with Hawaiian "
           "Airlines, Four Seasons Ko&#699;olina, Ko&#699;olau Ballrooms, King&#8217;s Hawaiian and the "
           "Department of Education, among others.",
      link="https://www.youtube.com/@HISessions", items=[
   still("hisessions","The Hi Sessions live room, set up with rugs and camera gear")]),
 dict(client="Twelvenoon &amp; Midnite", title="Greenstone", role="Music video, album art, web content", items=[
   film("vid-twelvenoon","yt","e1pvSPel-LE","Greenstone, official music video","Frame from the Greenstone music video"),
   still("twelvenoon-1","Portrait of a bearded musician in a wide brimmed hat"),
   still("twelvenoon-2","Two musicians beside a pickup truck"),
   still("twelvenoon-3","Two musicians seated against a wall with a guitar")]),
 dict(client="Kualoa Ranch", title="Sustainability and activities", role="Photography", items=[
   still("kualoa-2","Riders on ATVs on a dirt road below the Kualoa ridge"),
   still("kualoa-1","A worker beside a reservoir with the Kualoa mountains behind"),
   still("kualoa-3","A farmer opening a cacao pod with a knife"),
   still("kualoa-4","Looking up through a banana grove at Kualoa")]),
 # TODO-VIDEO: the Touch A Heart film is vimeo 1212462505. It is not embeddable
 # as of 2026-09-17 and this is not a code problem. Tested against a known good
 # video on the same account as a control: that one returns oEmbed 200 and
 # player 401, this one returns oEmbed 404 and player 403. A 403 from the
 # player is an embed permission refusal rather than a privacy or referrer
 # issue, so in Vimeo the fix is Settings > Privacy > "Where can this be
 # embedded", set to anywhere or with elevatemediahi.com allowed. Once that is
 # done, add this line to the items list and rerun:
 #   film("vid-tah", "vimeo", "1212462505", "Touch A Heart film", "<alt text>"),
 # and save a poster to assets/img/portfolio/vid-tah.jpg from the oEmbed
 # thumbnail_url.
 dict(client="Touch A Heart", title="Brand film and product stills", role="Video and photography", items=[
   still("tah-1","A Touch A Heart coconut and kukui cookie set with cookies arranged around it"),
   still("tah-2","A latte and brownies styled for a cafe menu")]),
]

GALLERY = [("p-01","A man in a suit standing on a cliff edge at sunrise"),
 ("p-12","A hiker on a knife edge ridge at sunrise"),("p-02","A pod of spinner dolphins underwater"),
 ("p-14","A hiker alone on a narrow peak above the clouds"),("p-04","A hiker holding a light inside a waterfall grotto"),
 ("p-03","A woman seated by a lagoon below the Kualoa ridge"),("p-16","A hammock strung beside a waterfall in the forest"),
 ("p-07","A figure silhouetted against a lava glow at night"),("p-05","A hiker on a ridge high above Kaneohe"),
 ("p-17","Aerial view of a sea arch with a figure standing on it"),("p-06","A Jeep parked on the snow line of Mauna Kea"),
 ("p-08","Dolphins swimming in formation, in black and white"),("p-15","Headphones and a studio microphone, a product shot"),
 ("p-09","A couple beneath trees on a shoreline with Mokolii behind"),("p-11","A hiker standing on a green summit in the clouds"),
 ("p-13","Eyeglasses resting on a surgical mask, a product shot"),("p-10","A man in formal dress on a rock outcrop above the valley")]

blocks = []
for pr in PROJECTS:
    meta = [f'      <article class="proj" data-reveal>', f'        <div class="proj-meta">',
            f'          <h2>{pr["client"]}</h2>', f'          <p class="proj-title">{pr["title"]}</p>',
            f'          <span class="proj-role">{pr["role"]}</span>']
    if pr.get("note"): meta.append(f'          <p class="proj-note">{pr["note"]}</p>')
    if pr.get("link"): meta.append(f'          <a class="tlink proj-link" href="{pr["link"]}" target="_blank" rel="noopener">Watch on YouTube</a>')
    meta += ['        </div>', '        <div class="proj-media">']
    meta.append(render_rows(rows_for(pr["items"], PROJ_W, PROJ_TGT), 10, tsum="2.47"))
    meta += ['        </div>', '      </article>']
    blocks.append("\n".join(meta))

gal_items = [still(n, a) for n, a in GALLERY]
gallery = render_rows(rows_for(gal_items, GAL_W, GAL_TGT), 8, tsum="3.40")

open("/tmp/pf_projects.html","w").write("\n\n".join(blocks))
open("/tmp/pf_gallery.html","w").write(gallery)

print("CLIENT WORK   column %dpx, target %dpx" % (PROJ_W, PROJ_TGT))
for pr in PROJECTS:
    rs = rows_for(pr["items"], PROJ_W, PROJ_TGT)
    desc = []
    for row, solo in rs:
        if solo:
            desc.append(f"{len(row)}up h440 free")
        else:
            avail = PROJ_W - GAP*(len(row)-1); h = avail/sum(i['r'] for i in row)
            desc.append(f"{len(row)}up h{h:.0f}")
    print(f"  {pr['client'][:22]:<24}{pr['title'][:26]:<28}{'  '.join(desc)}")
print("\nGALLERY  width %dpx, target %dpx" % (GAL_W, GAL_TGT))
tot = 0
for row, solo in rows_for(gal_items, GAL_W, GAL_TGT):
    avail = GAL_W - GAP*(len(row)-1); h = avail/sum(i['r'] for i in row)
    tot += len(row)
    print(f"  {len(row)} up   h={'380 (left, free)' if solo else f'{h:.0f}'}")
print(f"  {tot} of {len(gal_items)} images placed")
