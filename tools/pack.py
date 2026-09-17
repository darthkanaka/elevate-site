"""Justified row packing, the Flickr algorithm, run at build time.

Works in aspect-ratio space rather than pixels: for a row of height H the total
width is H * sum(ratios), so "does this fit" is a comparison of ratio sums. The
lookahead branch is the part pure CSS cannot do, and it is what stops a single
square image being stranded alone and inflating to four times the target height.
"""
def pack(ratios, container, gap, target_h, tol=0.25):
    rows, row = [], []
    def sums(r): return sum(r)
    for i, r in enumerate(ratios):
        avail = container - gap * len(row)          # gaps once this item joins
        lo = avail / target_h * (1 - tol)
        hi = avail / target_h * (1 + tol)
        cur = sums([x for x in row])
        new = cur + r
        if new < lo:
            row.append(r); continue
        if new > hi:
            # keep whichever of "with" and "without" lands closer to target
            prev_avail = container - gap * max(len(row) - 1, 0)
            tgt = avail / target_h
            prev_tgt = prev_avail / target_h
            if row and abs(cur - prev_tgt) < abs(new - tgt):
                rows.append(row); row = [r]
            else:
                row.append(r); rows.append(row); row = []
            continue
        row.append(r); rows.append(row); row = []
    if row: rows.append(row)
    return rows
