# Harvest manifest

Everything pulled off the old Squarespace site on 2026-09-16, before any rebuild work. This folder is the archive. Web-optimized copies live in `assets/` and are generated from these, never the other way around.

Total 89 MB across 43 files.

All Squarespace images share the base path `https://images.squarespace-cdn.com/content/v1/62cdf8a27898e2439f8cd217/`. In the tables below the Source column shows only the part that follows it.

One thing to know if you re-download anything: the CDN returns WebP by default no matter what extension you ask for. You have to send a browser user agent and an `Accept: image/png,image/jpeg,image/*;q=0.8` header to get the real PNG or JPEG. Use `?format=original` for full resolution.

## Pages

Saved HTML exactly as served, plus the theme CSS. Kept so any detail can be re-checked without refetching.

| File | Size | Source |
| --- | --- | --- |
| `pages/home.html` | 964 KB | elevatemediahi.com/ |
| `pages/contact.html` | 134 KB | elevatemediahi.com/contact |
| `pages/terms.html` | 105 KB | elevatemediahi.com/terms |
| `pages/image-host.html` | 72 KB | elevatemediahi.com/image-host |
| `pages/murakami-roofing-proposal.html` | 84 KB | elevatemediahi.com/murakami-roofing-proposal, Evolve HI content, not for reuse |
| `pages/site.css` | 1.3 MB | the full Squarespace theme stylesheet |
| `pages/custom.css` | 265 B | the only custom CSS on the site, two rules |

## Logo and favicon

| File | Size | Dimensions | Source | Notes |
| --- | --- | --- | --- | --- |
| `images/logos/Full Logo.png` | 20 KB | 1366 x 414 | `2456dcbb-.../Full+Logo.png?format=original` | The only logo artifact that exists anywhere. Flattened raster, transparent background |
| `images/logos/favicon.ico` | 6 KB | 200 x 200 | `a8c1ca51-.../favicon.ico?format=original` | Despite the extension this file is a JPEG, not an ICO |

There is no vector logo. Not on this Mac, not in any repo, not on the CDN. `?format=original` on the logo returns the same 1366 x 414 raster. Either Kawika supplies the source file or the mark gets re-vectorized from this PNG.

## Homepage section images

| File | Size | Dimensions | Where it appeared | Source |
| --- | --- | --- | --- | --- |
| `images/VideographyThumbnail_2.gif` | 20.8 MB | 600 x 400 | Services, Video Content card | `1657834979189-D7YJBZL5KNPM7WP0UDSW/` |
| `images/MotionGraphicsThumbnail.gif` | 11.8 MB | 600 x 400 | Services, Motion Graphics card | `1657833119333-JG0EN9AB5VBLT4VN9MRH/` |
| `images/PhotographyThumbnail.jpg` | 64 KB | 600 x 400 | Services, Photography card | `1657833250507-MERAFY6OGD435DEE83B2/` |
| `images/KawikaLopezOwner.jpg` | 62 KB | 600 x 400 | About, Small Business Mentality | `861fa3b3-.../Kawika+Lopez+Elevate+Media+Owner` |
| `images/ExperienceThumbnail.jpg` | 77 KB | 600 x 400 | About, Experience and Care | `527ae953-.../ExperienceThumbnail.jpg` |
| `images/Step1.png` | 1.9 MB | 1536 x 1024 | Process, step 1 | `0e456e32-.../5e585783-....png` |
| `images/Step2.png` | 2.2 MB | 1536 x 1024 | Process, step 2 | `d214c6a8-.../babb5668-....png` |
| `images/Step3.png` | 2.0 MB | 1536 x 1024 | Process, step 3 | `fd3b5d36-.../5967d606-....png` |

The two animated GIFs are the heaviest assets on the old site by a wide margin, 32 MB between them for two 600 x 400 loops. They become short muted webm loops in the rebuild.

The three process images are 1536 x 1024 PNGs, which is the giveaway signature of AI-generated art. Worth confirming with Kawika whether they stay.

Every one of these had empty alt text on the old site.

## Client logos

Twelve files in `images/clients/`, all 500 x 400 PNG with transparency, 11 to 37 KB each. All had empty alt text.

| File | Client |
| --- | --- |
| `HA.png` | Hawaiian Airlines |
| `FourSeasons.png` | Four Seasons |
| `Jeep.png` | Jeep |
| `Motorola.png` | Motorola |
| `HTA.png` | Hawaii Tourism Authority |
| `DTRIC.png` | DTRIC Insurance |
| `KoolauBallrooms.png` | Koolau Ballrooms |
| `KS.png` | Kamehameha Schools |
| `Kualoa.png` | Kualoa Ranch |
| `Locations.png` | Locations |
| `TandC.png` | Town and Country, the source file is named `T&C.png` |
| `Tiffen.png` | Tiffen |

## Photography

| File | Size | Dimensions | Where it appeared |
| --- | --- | --- | --- |
| `images/SelfPortrait.jpg` | 766 KB | 2500 x 3125 | Contact page, circular crop |
| `images/DJI_0259.jpg` | 1.1 MB | 2500 x 1665 | The image-host orphan page, a drone shot |

Both cap at 2500px on the CDN even with `?format=original`. The originals were 4767 x 5959 and 5464 x 3640. If higher resolution matters, get the files from Kawika.

## Video

| File | Size | Notes |
| --- | --- | --- |
| `video/elevate-banner.mp4` | 13.8 MB | 1920 x 1080, 38.91s, h264, 23.976fps. The hero background loop |
| `video/poster.jpg` | 235 KB | 1920 x 1080, frame grabbed at 2 seconds, for the video poster attribute |

Getting this file took some digging, so here is the method for next time. The page exposes an `alexandriaUrl` template ending in `{variant}`, but every variant path returns 404. The asset is served as HLS instead. Fetch `<alexandriaUrl base>/playlist.m3u8`, which returns signed segment URLs, then pull it with yt-dlp:

```
yt-dlp -f "bv*[height=1080]" --downloader native -o out.mp4 "<base>/playlist.m3u8"
```

Without ffmpeg installed yt-dlp writes a raw transport stream with an mp4 extension, which no browser will play. Remux it losslessly:

```
ffmpeg -i out.ts -c copy -movflags +faststart elevate-banner.mp4
```

The original upload was named `Elevate Banner Video.mov`. If Kawika still has that master it will be better than this 1080p derivative.

## Fonts

Poppins latin subset, weights 300 through 700, about 7.8 KB each, plus the Google Fonts CSS they came from. Kept as reference even if the rebuild changes typeface.

## StoryBrand document

`storybrand/` holds the two images extracted from `~/Library/Mobile Documents/com~apple~Pages/Documents/Story Brand - Elevate.pages`, last edited 2022-07-13. A Pages file is a zip, so `unzip -j '<file>' 'Data/*.jpg'` pulls the images out.

| File | Size | Dimensions |
| --- | --- | --- |
| `100-26.jpg` | 32 MB | 8025 x 5350 |
| `JamesW2-02-24.jpg` | 582 KB | 1500 x 1001 |

The text of the document is stored in Apple's IWA format, which is a proprietary compressed protobuf and not worth parsing. This is very likely the source of the current homepage copy and the best raw material for rewriting it. **Kawika needs to open it in Pages and export to PDF or plain text.**

## Deliberately not harvested

The Murakami Roofing proposal page's images and branding, because that page is Evolve HI collateral that happens to be hosted on the Elevate domain. Only its HTML is saved, so nothing is lost when the page is moved or deleted.

## What is in the repo and what is local only

The repo will be public, because GitHub Pages on a free account requires it. So two things in this folder are deliberately untracked, listed in `.gitignore` at the repo root:

1. `pages/murakami-roofing-proposal.html`, because it is Evolve HI client collateral and not ours to republish. It stays on disk.
2. `storybrand/`, because those two photos came out of a private Pages document rather than off the public site, and one of them is 32 MB. Re-extract them any time with `unzip -j '<path to the .pages file>' 'Data/*.jpg'`.

Everything else committed here was already public on elevatemediahi.com, so nothing new is exposed. Tracked size is about 55 MB, almost all of it the two animated GIFs and the hero video.
