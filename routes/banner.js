const express = require("express");

const router = express.Router();

const BANNER_CONTENT = [
  {
    image: "banner1",
    subTitle: "New Arrival",
    title: "Discover Our New Collection",
    desc: "Elevate your style with ALL STAR sneakers. The perfect choice for any occasion.",
    button: "Explore Now",
    class: "bottom-24 right-20 -translate-y-1/2",
  },
  {
    image: "banner2",
    subTitle: "Ready to Break Through",
    title: "Nike Air Max - Pinnacle of Technology",
    desc: "Designed to optimize performance, Nike Air Max offers exceptional comfort and style with every step.",
    button: "View Now",
    class: "bottom-20 left-20 -translate-y-1/2",
  },
  {
    image: "banner3",
    subTitle: "Classic Style",
    title: "Adidas - Beyond Limits",
    desc: "Experience comfort and style with the latest Adidas sneakers. Modern design, superior quality.",
    button: "Shop Now",
    class: "bottom-30 right-10 -translate-y-1/2",
  },
  {
    image: "banner4",
    subTitle: "Unique Style",
    title: "Nike Air Force 1 - The Legend Returns",
    desc: "Get your hands on the iconic Nike Air Force 1 with classic design and premium materials. Step up your game.",
    button: "Explore Now",
    class: "top-30 right-10 -translate-y-1/2",
  },
  {
    image: "banner5",
    subTitle: "More Dynamic, More Effective",
    title: "Nike Zoom - Boost Your Run",
    desc: "Improve speed and endurance with Nike Zoom shoes. Advanced technology to keep you at your peak.",
    button: "Shop Now",
    class: "bottom-20 right-20 -translate-y-1/2",
  },
];
var banner = [...BANNER_CONTENT];

router.get("/banner", (req, res) => {
  if (banner.length === 0) {
    banner = [...BANNER_CONTENT];
  }
  const randomIndex = Math.floor(Math.random() * banner.length);
  res.json(banner[randomIndex]);
  // if(banner.length <=1) {

  // }
  // seenBanner.push(banner[randomIndex]);
  banner.splice(randomIndex, 1);
});
module.exports = router;
