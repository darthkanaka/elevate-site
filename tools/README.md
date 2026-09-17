# Portfolio page generator

`portfolio.html` is generated, not hand edited. Re-run after changing the work:

    python3 tools/build-portfolio.py          # writes /tmp/pf_projects.html and /tmp/pf_gallery.html

Then paste those two fragments into `portfolio.html` between the marked
sections, or regenerate the page wholesale.

## Why a generator

The page uses the justified-row algorithm Flickr uses. Each item in a row gets
a flex-grow equal to its own aspect ratio against a zero basis, so its width is
its share of the row:

    width = (its ratio / sum of the row's ratios) * (row width - gaps)

Every item in a row then lands at the same height on its own, with no cropping
and no fixed aspect boxes. Packing items into rows has to happen somewhere, and
it has to happen before the browser paints: the row geometry is a function of
the whole set of ratios, so nothing can be sized until every ratio is known.
Measuring in the browser after images decode is what causes layout shift, so it
is done here instead and written into the markup.

`pack.py` is the row packer. It works in aspect-ratio space rather than pixels,
because for a row of height H the width is H times the sum of the ratios, so
"does this fit" is a comparison of ratio sums. The lookahead branch, keeping
whichever of with-item and without-item lands closer to the target height, is
the part that pure CSS cannot do, and it is what stops a lone square image
being stranded and inflating to several times the target height.

A row of one cannot flush, and a row that would come out more than 1.4 times
the target height is not stretched to flush either, because stretching a short
row is exactly where a justified layout starts cropping. Those rows are bounded
by height and left aligned instead.

Targets: client work is packed to 400px rows in the 1060px column beside the
sticky title; the personal gallery is packed to 300px rows across the full
width. Same engine, different target, which is what keeps the two sections
looking like one page.
