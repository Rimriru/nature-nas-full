<script setup lang="ts">
const eyeLocation = reactive({
  x: 0,
  y: 0
});

const { x: mouseX, y: mouseY } = useMouse();
const { width, height } = useWindowSize();

watch([mouseX, mouseY, width, height], () => {
  eyeLocation.x = mouseX.value > width.value / 2 ? 17 : -17;

  if (
    mouseY.value > height.value / 2 &&
    mouseX.value > width.value * 0.25 &&
    mouseX.value < width.value * 0.75
  ) {
    eyeLocation.y = 25;
    eyeLocation.x = 0;
  } else if (
    mouseY.value < height.value / 2 &&
    mouseX.value > width.value * 0.35 &&
    mouseX.value < width.value * 0.65
  ) {
    eyeLocation.y = -25;
    eyeLocation.x = 0;
  } else if (mouseY.value < height.value / 2) {
    eyeLocation.y = -19;
  } else {
    eyeLocation.y = 19;
  }
});
</script>

<template>
  <svg width="76" height="134" viewBox="0 0 76 134" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      ref="eye"
      class="eye"
      d="M44.3643 85.9793C43.191 89.4434 39.3464 91.3531 35.7508 90.1933C32.1553 89.0334 30.2344 85.2637 31.4077 81.7997C32.581 78.3356 36.4257 76.4258 40.0212 77.5857C43.6168 78.7455 45.5377 82.5152 44.3643 85.9793Z"
      fill="black"
      stroke="black"
      stroke-width="2"
      :style="`transform: translateX(${eyeLocation.x}px) translateY(${eyeLocation.y}px)`"
    />
    <rect
      x="1.21355"
      y="0.741323"
      width="4.35634"
      height="18.1129"
      rx="2.17817"
      transform="matrix(0.973333 -0.229396 0.24022 0.970719 18.8543 12.5667)"
      fill="black"
      stroke="black"
      stroke-width="2"
    />
    <rect
      x="1.05537"
      y="0.94425"
      width="3.9796"
      height="22.3993"
      rx="1.9898"
      transform="matrix(0.998534 -0.0541337 0.0568321 0.998384 33.0085 0.382387)"
      fill="black"
      stroke="black"
      stroke-width="2"
    />
    <rect
      x="0.630179"
      y="1.25449"
      width="4.05497"
      height="16.2666"
      rx="2.02748"
      transform="matrix(0.951537 0.307534 -0.321358 0.946958 54.1151 11.2756)"
      fill="black"
      stroke="black"
      stroke-width="2"
    />
    <path
      d="M71 84C71 96.8143 67.0467 108.228 60.8892 116.33C54.7346 124.428 46.5952 129 38 129C29.4048 129 21.2654 124.428 15.1108 116.33C8.95332 108.228 5 96.8143 5 84C5 71.1857 8.95332 59.772 15.1108 51.6701C21.2654 43.5719 29.4048 39 38 39C46.5952 39 54.7346 43.5719 60.8892 51.6701C67.0467 59.772 71 71.1857 71 84Z"
      stroke="#3C52B4"
      stroke-width="10"
    />
  </svg>
</template>

<style lang="scss">
.eye {
  transition: transform 0.3s ease-in-out;
}
</style>
