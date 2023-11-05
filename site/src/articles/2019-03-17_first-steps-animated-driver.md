---
slug: "/articles/first-steps-animated-driver"
type: "article"
date: "2019-03-17"
source: "Medium"
title: "First steps to create a native driver for Animated using react-native-web"
link: "https://medium.com/@arqex/first-steps-to-create-a-native-driver-for-animated-using-react-native-web-a3008c6ccfbe"
---

Creating a native driver for react-native-web? Browsers don’t have a native side.
True. In this case, what we want is to make the JS implementation of Animated to run in the GPU when possible. In react-native, we just need to add useNativeDriver: true to our animation’s config in order to take it to the native side. 