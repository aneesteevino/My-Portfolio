"""Build a cropped, sample-aligned circular video/audio loop with ffmpeg + numpy.

python scripts/build-hero-assets.py intro.mp4 --crop 576:720:356:0
Requires numpy, Pillow, and ffmpeg (PATH, --ffmpeg, or imageio-ffmpeg).
Crop is width:height:x:y; no person is generated or extended outside the source.
"""
import argparse
import json
import math
import re
import shutil
import subprocess
import tempfile
import wave
from pathlib import Path
import numpy as np
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]

def run(args, **kwargs):
    return subprocess.run(args,check=True,**kwargs)

def ffmpeg_path(value):
    if value: return value
    if shutil.which("ffmpeg"): return shutil.which("ffmpeg")
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError as exc:
        raise SystemExit("Install ffmpeg or: python -m pip install imageio-ffmpeg") from exc

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source",type=Path)
    parser.add_argument("--crop",help="width:height:x:y; auto-detect dark foreground on light background if omitted")
    parser.add_argument("--seconds",type=float,default=10)
    parser.add_argument("--fade",type=float,default=.5)
    parser.add_argument("--fps",type=int,default=24)
    parser.add_argument("--ffmpeg")
    parser.add_argument("--portrait-crop",help="width:height:x:y in original source coordinates")
    args=parser.parse_args()
    ff=ffmpeg_path(args.ffmpeg)
    source=str(args.source.resolve())
    metadata=subprocess.run([ff,"-hide_banner","-i",source],capture_output=True,text=True).stderr
    duration_match=re.search(r"Duration: (\d+):(\d+):([\d.]+)",metadata)
    if not duration_match: raise SystemExit("Could not read video duration")
    duration=sum(float(v)*m for v,m in zip(duration_match.groups(),[3600,60,1]))
    seconds=math.floor(min(args.seconds,duration)*args.fps)/args.fps
    fade=round(args.fade*args.fps)/args.fps
    if seconds<=fade*2: raise SystemExit("Source too short for the requested cross-fade")
    out=ROOT/"public/hero";out.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="portfolio-hero-") as folder:
        temp=Path(folder)
        samples=[]
        # Decode original frames for the crop estimate and sharpest portrait selection.
        for i,t in enumerate(np.linspace(.25,max(.25,seconds-.5),7)):
            file=temp/f"sample-{i}.png"
            run([ff,"-y","-loglevel","error","-ss",str(t),"-i",source,"-frames:v","1",str(file)])
            samples.append(Image.open(file).convert("RGB"))
        width,height=samples[0].size
        if args.crop: crop=tuple(map(int,args.crop.split(":")))
        else:
            # Robust occupancy across several frames; assumes the supplied plain light backdrop.
            foreground=np.stack([np.asarray(im).min(axis=2)<160 for im in samples]).mean(axis=0)>.35
            rows=np.where(foreground.sum(axis=1)>max(4,width*.008))[0]
            cols=np.where(foreground.sum(axis=0)>max(4,height*.012))[0]
            if len(rows)<height*.3 or len(cols)<width*.05:
                raise SystemExit("Foreground detection uncertain. Supply --crop width:height:x:y after inspecting the source.")
            top=max(0,int(rows[0]-height*.04));bottom=min(height,int(rows[-1]+height*.07))
            h=(bottom-top)//2*2;w=max(int(h*.8),int((cols[-1]-cols[0])*1.35))//2*2
            w=min(width//2*2,w);x=max(0,min(width-w,int((cols[0]+cols[-1]-w)/2)))//2*2
            crop=(w,h,x,top//2*2)
        w,h,x,y=crop
        if min(w,h)<=0 or min(x,y)<0 or x+w>width or y+h>height:
            raise SystemExit(f"Invalid crop {crop} for {width}x{height}")
        crop_string=":".join(map(str,crop))
        print(f"Source {width}x{height}; crop {crop_string}; {seconds}s; fade {fade}s",flush=True)
        # The steady segment is [fade,T-fade); transition is tail -> head.
        # Output starts at source fade and ends at source fade: temporal continuity
        # at the file boundary, with the same mapping on audio and video.
        graph=(f"[0:v]crop={crop_string},scale=768:-2:flags=lanczos,setsar=1,"
               f"colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,fps={args.fps},split=2[a][b];"
               f"[a]trim=start={fade}:end={seconds},setpts=PTS-STARTPTS,fps={args.fps},settb=AVTB[body];"
               f"[b]trim=start=0:end={fade},setpts=PTS-STARTPTS,fps={args.fps},settb=AVTB[head];"
               f"[body][head]xfade=transition=fade:duration={fade}:offset={seconds-2*fade},format=yuv420p[v]")
        rate=48000;channels=2
        audio_path=temp/"loop.wav"
        audio=subprocess.run([ff,"-v","error","-i",source,"-t",str(seconds),"-vn","-f","f32le","-ac",str(channels),"-ar",str(rate),"-"],capture_output=True)
        if audio.returncode or not audio.stdout:
            raise SystemExit("The supplied introduction has no decodable audio. Provide a video with the original voice; no silent audio will be invented.")
        pcm=np.frombuffer(audio.stdout,dtype="<f4").reshape(-1,channels)
        n=round(seconds*rate);f=round(fade*rate)
        if len(pcm)<n: pcm=np.pad(pcm,((0,n-len(pcm)),(0,0)))
        pcm=pcm[:n]
        alpha=(np.arange(f,dtype=np.float64)/f)[:,None]
        blended=pcm[-f:]*(1-alpha)+pcm[:f]*alpha
        loop=np.concatenate([pcm[f:-f],blended])
        with wave.open(str(audio_path),"wb") as wav:
            wav.setparams((channels,2,rate,len(loop),"NONE","not compressed"))
            wav.writeframes((np.clip(loop,-1,1)*32767).astype("<i2").tobytes())
        base=[ff,"-y","-hide_banner","-loglevel","warning","-i",source,"-i",str(audio_path),"-filter_complex",graph,"-map","[v]","-map","1:a","-t",str(seconds-fade)]
        run(base+["-c:v","libx264","-crf","24","-preset","slow","-pix_fmt","yuv420p","-c:a","aac","-b:a","96k","-movflags","+faststart",str(out/"hero.mp4")])
        run(base+["-c:v","libvpx-vp9","-crf","36","-b:v","0","-row-mt","1","-cpu-used","2","-c:a","libopus","-b:a","80k",str(out/"hero.webm")])
        sharpness=[]
        for im in samples:
            gray=np.asarray(im.convert("L"),dtype=float)
            face=gray[max(0,y):min(height,y+int(h*.42)),x:x+w]
            sharpness.append(float(np.diff(face,axis=0).var()+np.diff(face,axis=1).var()))
        best=samples[int(np.argmax(sharpness))]
        if args.portrait_crop: pw,ph,px,py=map(int,args.portrait_crop.split(":"))
        else:
            ph=min(height-y,int(h*.49));pw=int(ph*.8);px=int(x+w/2-pw/2);py=y
        portrait=best.crop((px,py,px+pw,py+ph)).resize((480,600),Image.Resampling.LANCZOS)
        portrait.save(ROOT/"public/portrait-bust.webp",quality=88)
        poster=best.crop((x,y,x+w,y+h));poster=poster.resize((768,round(h/w*768)),Image.Resampling.LANCZOS)
        poster.save(out/"poster.webp",quality=85)
        # OG uses the authentic source photo; no extra claim or synthetic image.
        og=Image.new("RGB",(1200,630),(244,242,238));og_photo=portrait.resize((504,630),Image.Resampling.LANCZOS)
        # Multiply the white source background into the paper, matching the CSS hero.
        a=np.asarray(og_photo,dtype=float)*np.array([244,242,238])/255
        og.paste(Image.fromarray(a.astype("uint8")),(348,0));og.save(ROOT/"public/og.jpg",quality=90)
        report={"input":args.source.name,"crop":crop,"fps":args.fps,"source_seconds":seconds,"fade_seconds":fade,"output_seconds":seconds-fade,"audio_samples":len(loop),"audio_rate":rate,"audio_boundary_step":float(np.max(np.abs(loop[-1]-loop[0]))),"portrait_sample":int(np.argmax(sharpness)),"note":"Linear overlap uses the same source-time mapping for picture and audio; no time-stretching."}
        (out/"build-report.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
        print(json.dumps(report,indent=2),flush=True)

if __name__=="__main__": main()
