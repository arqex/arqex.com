---
slug: "/articles/web-animation-api"
type: "article"
date: "2020-03-28"
source: "Medium"
title: "Web animation API: Relative styling by adding animations"
link: "https://medium.com/@arqex/web-animation-api-relative-styling-by-adding-animations-57ac552337cc"
---

I keep working on creating a driver for the web version of Animated, that runs the animations in the GPU. Using all the methods I described in that article I could move some of the animations to the GPU, but there was a common issue to all the approaches: If a view receives animations from 2 different AnimatedValues, we need to apply both animations at the same time.