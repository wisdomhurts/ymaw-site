#!/usr/bin/env bash
# Build the worldflight legs from the archive photographs.
#
# Every leg is a slow single-direction camera move rendered from a real photo
# (ffmpeg zoompan), encoded dense-GOP so it scrubs (g=8 desktop / g=4 mobile),
# with its poster extracted from the ENCODED file so poster and first frame
# are pixel-identical. When Dorian's real footage arrives from Drive, re-cut
# the legs from footage with the same names and weights; nothing else changes.
#
# Usage: bash scripts/build-assets.sh   (from the repo root)
set -euo pipefail
cd "$(dirname "$0")/.."
FF=${SCROLLCRAFT_FFMPEG:-ffmpeg}
P=src/photos
OUT=assets
mkdir -p "$OUT"

# ---- grade intermediates ---------------------------------------------------
# Light touch: the Sony/Canon frames are already Lightroom-finished; the
# 2003-era scan (team) gets a gentle levels expand so it does not sit flat
# against the modern frames.
grade () { # in out extra_filter
  "$FF" -y -loglevel error -i "$1" -vf "$3" -q:v 2 "$2"
}
mkdir -p .cache
grade "$P/ymaw-mentors.jpg"   .cache/l1.jpg "eq=saturation=1.04:contrast=1.03"
grade "$P/ymaw-adventure.jpg" .cache/l2.jpg "eq=saturation=1.05:contrast=1.02"
grade "$P/ymaw-challenge.jpg" .cache/l3.jpg "eq=saturation=1.05:contrast=1.02"
grade "$P/ymaw-team.jpg"      .cache/l4.jpg "hqdn3d=5:4:8:6,colorlevels=rimin=0.03:gimin=0.03:bimin=0.03:rimax=0.97:gimax=0.97:bimax=0.97,eq=saturation=1.06:contrast=1.04"
grade "$P/ymaw-weekend.jpg"   .cache/l5.jpg "eq=saturation=1.03:contrast=1.03"
grade "$P/ymaw-campfire.jpg"  .cache/l6.jpg "eq=saturation=1.04:contrast=1.02"

# ---- desktop legs (1920x1080, 30fps, g=8) ----------------------------------
# zoompan jitters on small inputs, so feed it a 2x-supersampled frame.
# d = frames. 8s legs everywhere, 12s on the peak: one pace for the flight
# (1.8vh/8s = 0.225 vh/s; 2.6vh/12s = 0.217 vh/s).
leg () { # src out frames zexpr xexpr yexpr
  # Pre-crop to exact 16:9 BEFORE zoompan: zoompan pads a mismatched aspect
  # with black pillars (caught on the portrait source; cropping first is the
  # fix for every source).
  "$FF" -y -loglevel error -loop 1 -framerate 30 -i "$1" -vf \
    "scale=3840:-2,crop=3840:2160,zoompan=z='$4':x='$5':y='$6':d=$3:s=1920x1080:fps=30,format=yuv420p" \
    -frames:v "$3" -c:v libx264 -preset slow -crf 23 -g 8 -bf 0 -an -movflags +faststart "$2"
}
CX='iw/2-(iw/zoom/2)'; CY='ih/2-(ih/zoom/2)'
N=240; NP=360
# L1 mist kayak: slow push toward the far shore (slightly above centre)
leg .cache/l1.jpg "$OUT/leg1.mp4" $N "1.05+0.11*on/${N}" "$CX" "ih/2-(ih/zoom/2)-ih*0.03*on/${N}"
# L2 axe (portrait source): pure downward pan — animated 16:9 crop walking
# down the portrait frame from the raised axe to the splitting block.
"$FF" -y -loglevel error -loop 1 -framerate 30 -i .cache/l2.jpg -vf \
  "scale=3840:-2,crop=3840:2160:0:'(ih-2160)*(0.10+0.42*min(t/8,1))',scale=1920:1080,format=yuv420p" \
  -frames:v $N -c:v libx264 -preset slow -crf 23 -g 8 -bf 0 -an -movflags +faststart "$OUT/leg2.mp4"
# L3 kayaks out: push toward the paddler leaving
leg .cache/l3.jpg "$OUT/leg3.mp4" $N "1.04+0.12*on/${N}" "iw/2-(iw/zoom/2)+iw*0.02*on/${N}" "$CY"
# L4 fire circle: the slowest push, into the circle. 1600x900 + heavier crf:
# the 2003 film scan's grain resists x264 at a dense GOP, and the softness
# suits a dusk memory; replaced by real footage when it arrives.
"$FF" -y -loglevel error -loop 1 -framerate 30 -i .cache/l4.jpg -vf \
  "scale=3200:-2,crop=3200:1800,zoompan=z='1.03+0.08*on/${N}':x='$CX':y='$CY':d=${N}:s=1600x900:fps=30,format=yuv420p" \
  -frames:v $N -c:v libx264 -preset slow -crf 26 -g 8 -bf 0 -an -movflags +faststart "$OUT/leg4.mp4"
# L5 THE PEAK, 12s: wide open, slow arrival at the raised hands
leg .cache/l5.jpg "$OUT/leg5.mp4" $NP "1.02+0.12*on/${NP}" "$CX" "ih/2-(ih/zoom/2)+ih*0.02*on/${NP}"
# L6 his face: the gentlest push of the page
leg .cache/l6.jpg "$OUT/leg6.mp4" $N "1.02+0.07*on/${N}" "$CX" "ih/2-(ih/zoom/2)-ih*0.02*on/${N}"

# ---- mobile portrait legs (720x1280, g=4) ----------------------------------
# 9:16 crop around each subject, then the same slow move.
mleg () { # src out frames cropx zexpr
  "$FF" -y -loglevel error -loop 1 -framerate 30 -i "$1" -vf \
    "crop=ih*9/16:ih:$4:0,scale=1440:-2,zoompan=z='$5':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$3:s=720x1280:fps=30,format=yuv420p" \
    -frames:v "$3" -c:v libx264 -preset slow -crf 24 -g 4 -bf 0 -an -movflags +faststart "$2"
}
mleg .cache/l1.jpg "$OUT/leg1-m.mp4" $N  "iw*0.42" "1.04+0.10*on/${N}"
# L2 is a native portrait photo: no crop, just the drift
"$FF" -y -loglevel error -loop 1 -framerate 30 -i .cache/l2.jpg -vf \
  "scale=1440:-2,zoompan=z='1.06+0.08*on/${N}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)-ih*0.02*on/${N}':d=${N}:s=720x1280:fps=30,format=yuv420p" \
  -frames:v $N -c:v libx264 -preset slow -crf 24 -g 4 -bf 0 -an -movflags +faststart "$OUT/leg2-m.mp4"
mleg .cache/l3.jpg "$OUT/leg3-m.mp4" $N  "iw*0.48" "1.04+0.10*on/${N}"
mleg .cache/l4.jpg "$OUT/leg4-m.mp4" $N  "iw*0.30" "1.03+0.08*on/${N}"
mleg .cache/l5.jpg "$OUT/leg5-m.mp4" $NP "iw*0.40" "1.02+0.10*on/${NP}"
mleg .cache/l6.jpg "$OUT/leg6-m.mp4" $N  "iw*0.30" "1.02+0.07*on/${N}"

# ---- posters: first frame OF THE ENCODED clip ------------------------------
for i in 1 2 3 4 5 6; do
  "$FF" -y -loglevel error -i "$OUT/leg$i.mp4"   -frames:v 1 -vf scale=1600:-2 -c:v libwebp -quality 82 "$OUT/p$i.webp"
  "$FF" -y -loglevel error -i "$OUT/leg$i-m.mp4" -frames:v 1 -c:v libwebp -quality 80 "$OUT/p$i-m.webp"
done

# ---- archive chips for the circle leg (small, real years) ------------------
"$FF" -y -loglevel error -i "$P/ymaw-group.jpg"  -vf "scale=640:-2" -c:v libwebp -quality 80 "$OUT/arch-2006.webp"
"$FF" -y -loglevel error -i "$P/ymaw-hero.jpg"   -vf "scale=640:-2" -c:v libwebp -quality 80 "$OUT/arch-2003.webp"
"$FF" -y -loglevel error -i "$P/ymaw-nature.jpg" -vf "scale=640:-2" -c:v libwebp -quality 80 "$OUT/arch-2025.webp"

# ---- register page stills --------------------------------------------------
"$FF" -y -loglevel error -i "$P/ymaw-outdoor.jpg" -vf "scale=1200:-2" -c:v libwebp -quality 80 "$OUT/volunteer.webp"
"$FF" -y -loglevel error -i "$P/ymaw-hiking.jpg"  -vf "scale=1200:-2" -c:v libwebp -quality 80 "$OUT/king.webp"

# ---- brand marks -----------------------------------------------------------
# The mark (sun + fire + logs) is the left ~11% of the wordmark PNG.
"$FF" -y -loglevel error -i "$P/logo.png" -vf "crop=245:527:0:0,scale=128:-2" "$OUT/mark.png"
"$FF" -y -loglevel error -i "$P/logo.png" -vf "crop=245:527:0:0,scale=48:-2" "$OUT/favicon.png"
# Bone-ink wordmark for the dark canvas: recolour the green letterforms,
# keep the mark's own colours (only pixels matching the green are remapped).
"$FF" -y -loglevel error -i "$P/logo.png" -vf "geq=r='if(between(r(X,Y),40,110)*between(g(X,Y),80,140)*between(b(X,Y),40,100),242,r(X,Y))':g='if(between(r(X,Y),40,110)*between(g(X,Y),80,140)*between(b(X,Y),40,100),239,g(X,Y))':b='if(between(r(X,Y),40,110)*between(g(X,Y),80,140)*between(b(X,Y),40,100),231,b(X,Y))':a='alpha(X,Y)',scale=560:-2" "$OUT/wordmark-bone.png"

du -sh "$OUT"; ls -la "$OUT"

# ---- VP9 fallbacks ---------------------------------------------------------
# Chromium builds without proprietary codecs (some Linux distros, headless
# test browsers) cannot decode H.264. The page swaps .mp4 -> .webm via a
# canPlayType check before mount; frames are identical transcodes.
for f in "$OUT"/leg*.mp4; do
  g="${f%.mp4}.webm"
  gop=8; case "$f" in *-m.mp4) gop=4;; esac
  "$FF" -y -loglevel error -i "$f" -c:v libvpx-vp9 -crf 34 -b:v 0 -g $gop \
    -row-mt 1 -cpu-used 5 -an "$g"
done
