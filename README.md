# FrontendMasters Video Course Downloader

<p align="center">
  <a href="https://www.npmjs.com/package/frontendmasters-downloader">
    <img src="https://img.shields.io/npm/dt/frontendmasters-downloader.svg" alt="Total Downloads">
  </a>
  <img src="https://img.shields.io/npm/v/frontendmasters-downloader.svg" alt="Latest Release">
  <img src="https://i.imgur.com/1lxq31F.gif">
</p>

## Intro

[FrontendMasters](https://frontendmasters.com) is a great website for learning frontend and Javascript skills, **FrontendMastersDownloader** let's you keep an offline copy of videos to watch on your favourite device without the need for internet connection.

## Requirements

* This package is using the experimental es modules feature only available on recent versions of node (**v13.2+**).
* **FFmpeg** and **FFProbe** are required and used to download the video files, use your OS package manager to install it or download it from here: [Linux](https://johnvansickle.com/ffmpeg/)/[Mac](https://evermeet.cx/ffmpeg/)/[Windows](https://www.gyan.dev/ffmpeg/builds/) (The files should be accesible via PATH or on the current running directory)

## Usage

To use this you should have an active subscription to [FrontendMasters](https://frontendmasters.com) service, if you are a student with school email adress you can get [six months free](https://frontendmasters.com/welcome/github-student-developers/).

The simplest way of using this is with `npx`, just run:
```
npx frontendmasters-downloader
```
and follow the instructions.

if you want to run it without `npx` just follow these command:

```
git clone https://github.com/20lives/frontendmastersDownloader.git
cd frontendmastersDownloader
npm run start
# or yarn start
```

## Disclaimer

The tool above is for research purpose only not for human consumption, I am not responsible for any use of this program, please read [FrontendMasters terms of service](https://static.frontendmasters.com/assets/legal/MasterServicesAgreement.pdf) before using this.
