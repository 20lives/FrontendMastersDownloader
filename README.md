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

This package is using the experimental es modules feature only available on recent versions of node (**v13.2+**).

[youtube-dl](https://rg3.github.io/youtube-dl/) is used to convert HLS playlist to MP4, make sure to install it and have it available in your **PATH** before running.

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
